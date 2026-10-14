"""Build the 3D hero textures (height, hazard colour, poster) from NSHM 2022 hazard and terrain tiles."""

import argparse
import base64
import io
import json
import math
import os
import urllib.request
import zipfile
from pathlib import Path

import numpy as np
from matplotlib.colors import LightSource, LinearSegmentedColormap
from PIL import Image, ImageFilter
from scipy import ndimage
from scipy.interpolate import griddata

NSHM_API = "https://nshm-api.gns.cri.nz/kororaa-app-api/graphql"
GRID_URL = (
    "https://raw.githubusercontent.com/GNS-Science/nzshm-common-py/main/"
    "nzshm_common/grids/nz_0_1_nb_1_v1.py"
)
TILE_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"

LON_MIN, LON_MAX = 166.0, 179.0
LAT_MIN, LAT_MAX = -47.6, -34.0
RES_DEG = 0.0125
TILE_ZOOM = 7

# Brand hazard ramp: deep indigo (low) through QuakeCoRE orange to pale gold (high)
HAZARD_CMAP = LinearSegmentedColormap.from_list(
    "quakecore_hazard",
    ["#1E1B4B", "#4C1D95", "#9D174D", "#F16725", "#F69322", "#FDE68A"],
)
PGA_MIN, PGA_MAX = 0.1, 1.0


def fetch_nshm_hazard(api_key: str) -> tuple[np.ndarray, np.ndarray]:
    """
    Fetch NSHM 2022 gridded PGA (10% in 50 years, Vs30 400, mean) and its grid points

    Parameters
    ----------
    api_key : str
        X-API-KEY used by the public NSHM web app

    Returns
    -------
    pts : np.ndarray
        Grid points as (n, 2) lon, lat
    vals : np.ndarray
        PGA values in g for each point
    """
    query = (
        "query { gridded_hazard: HAZARD_gridded_hazard(grid_id: NZ_0_1_NB_1_1, "
        'hazard_model_id: "NSHM_v1.0.4", imt: "PGA", agg: "mean", vs30: 400, poe: 0.1) '
        "{ ok gridded_hazard { values } } }"
    )
    request = urllib.request.Request(
        NSHM_API,
        data=json.dumps({"query": query}).encode(),
        headers={"X-API-KEY": api_key, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        vals = json.load(response)["data"]["gridded_hazard"]["gridded_hazard"][0][
            "values"
        ]

    # Grid definition is a base64 zip of lon,lat rows in nzshm-common
    with urllib.request.urlopen(GRID_URL, timeout=60) as response:
        source = response.read().decode()
    body = source.split("data = (", 1)[1]
    encoded = "".join(part.split('"')[1] for part in body.split("\n") if '"' in part)
    archive = zipfile.ZipFile(io.BytesIO(base64.b64decode(encoded)))
    rows = archive.read(archive.namelist()[0]).decode().split()
    pts = np.array([[float(v) for v in row.split(",")] for row in rows])
    return pts, np.asarray(vals)


def tile_xy(lon: float, lat: float, zoom: int) -> tuple[float, float]:
    """
    Convert lon/lat to fractional web-mercator tile coordinates

    Parameters
    ----------
    lon : float
        Longitude in degrees
    lat : float
        Latitude in degrees
    zoom : int
        Tile zoom level

    Returns
    -------
    x : float
        Fractional tile x
    y : float
        Fractional tile y
    """
    n = 2**zoom
    lat_rad = math.radians(lat)
    x = (lon + 180.0) / 360.0 * n
    y = (1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n
    return x, y


def load_elevation(cache_dir: Path) -> np.ndarray:
    """
    Download (or reuse cached) Terrarium tiles and resample to the lon/lat output grid

    Parameters
    ----------
    cache_dir : Path
        Directory to cache downloaded tiles

    Returns
    -------
    elev : np.ndarray
        Elevation in metres on the output grid, north at row 0
    """
    cache_dir.mkdir(parents=True, exist_ok=True)
    x0, y0 = tile_xy(LON_MIN, LAT_MAX, TILE_ZOOM)
    x1, y1 = tile_xy(LON_MAX, LAT_MIN, TILE_ZOOM)
    tx = range(int(x0), int(x1) + 1)
    ty = range(int(y0), int(y1) + 1)

    mosaic = np.zeros((len(ty) * 256, len(tx) * 256), dtype=np.float32)
    for j, y in enumerate(ty):
        for i, x in enumerate(tx):
            path = cache_dir / f"{TILE_ZOOM}_{x}_{y}.png"
            if not path.exists():
                urllib.request.urlretrieve(TILE_URL.format(z=TILE_ZOOM, x=x, y=y), path)
            rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
            mosaic[j * 256 : (j + 1) * 256, i * 256 : (i + 1) * 256] = (
                rgb[..., 0] * 256 + rgb[..., 1] + rgb[..., 2] / 256 - 32768
            )

    # Sample the mercator mosaic at each output lon/lat
    lons = np.arange(LON_MIN, LON_MAX, RES_DEG)
    lats = np.arange(LAT_MAX, LAT_MIN, -RES_DEG)
    px = np.array([(tile_xy(lon, 0, TILE_ZOOM)[0] - tx[0]) * 256 for lon in lons])
    py = np.array([(tile_xy(0, lat, TILE_ZOOM)[1] - ty[0]) * 256 for lat in lats])
    grid_y, grid_x = np.meshgrid(py, px, indexing="ij")
    return ndimage.map_coordinates(mosaic, [grid_y, grid_x], order=1)


def hazard_surface(
    pts: np.ndarray, vals: np.ndarray, shape: tuple[int, int]
) -> np.ndarray:
    """
    Interpolate the 0.1 degree hazard grid onto the output grid

    Parameters
    ----------
    pts : np.ndarray
        Grid points as (n, 2) lon, lat
    vals : np.ndarray
        PGA values in g
    shape : tuple[int, int]
        Output grid shape (rows, cols)

    Returns
    -------
    pga : np.ndarray
        Interpolated PGA, nearest-filled outside the hazard grid hull
    """
    lons = LON_MIN + np.arange(shape[1]) * RES_DEG
    lats = LAT_MAX - np.arange(shape[0]) * RES_DEG
    grid_lon, grid_lat = np.meshgrid(lons, lats)
    pga = griddata(pts, vals, (grid_lon, grid_lat), method="linear")
    nearest = griddata(pts, vals, (grid_lon, grid_lat), method="nearest")
    pga = np.where(np.isnan(pga), nearest, pga)
    return ndimage.gaussian_filter(pga, 2)


def save_assets(elev: np.ndarray, pga: np.ndarray, out_dir: Path) -> float:
    """
    Write the height, normal, colour, glow and poster images used by the hero

    Parameters
    ----------
    elev : np.ndarray
        Elevation in metres, north at row 0
    pga : np.ndarray
        PGA in g on the same grid
    out_dir : Path
        Output directory (public/hero)

    Returns
    -------
    aspect : float
        cos(mid latitude) scaling for longitude
    """
    out_dir.mkdir(parents=True, exist_ok=True)
    land = ndimage.binary_opening(elev > 1, iterations=1)
    land = ndimage.binary_fill_holes(land)
    land_alpha = ndimage.gaussian_filter(land.astype(np.float32), 0.8)

    # Height map: land only, gamma lifts low relief so the plains still read
    height = np.clip(elev, 0, 3000) / 3000 * land
    height = ndimage.gaussian_filter(height, 0.8) ** 0.8
    Image.fromarray((height * 255).astype(np.uint8)).save(
        out_dir / "nz_height.png", optimize=True
    )

    # Normal map so the 3D lighting picks up relief (row index runs south, so y flips)
    grad_row, grad_col = np.gradient(ndimage.gaussian_filter(height, 2.0))
    normal = np.dstack([-grad_col * 40, grad_row * 40, np.ones_like(height)])
    normal /= np.linalg.norm(normal, axis=2, keepdims=True)
    Image.fromarray(((normal + 1) / 2 * 255).astype(np.uint8), "RGB").save(
        out_dir / "nz_normal.webp", quality=90, method=6
    )

    # Colour: hazard ramp shaded by terrain
    norm = np.clip(np.log(pga / PGA_MIN) / np.log(PGA_MAX / PGA_MIN), 0, 1)
    colour = HAZARD_CMAP(norm)[..., :3]
    shade = LightSource(azdeg=315, altdeg=40).hillshade(
        elev * land, vert_exag=0.04, dx=1000, dy=1000
    )
    colour = colour * (0.55 + 0.6 * shade[..., None])
    rgba = np.dstack([np.clip(colour, 0, 1), land_alpha])
    Image.fromarray((rgba * 255).astype(np.uint8), "RGBA").save(
        out_dir / "nz_color.webp", quality=88, method=6
    )

    # Poster: flat glow render on the hero background for mobile and reduced motion
    texture = Image.fromarray((rgba * 255).astype(np.uint8), "RGBA")
    aspect = math.cos(math.radians((LAT_MIN + LAT_MAX) / 2))
    tex_w = round(texture.height * 0.86 * aspect * texture.width / texture.height)
    texture = texture.resize((tex_w, round(texture.height * 0.86)), Image.LANCZOS)
    poster = Image.new("RGBA", (1600, 1200), (11, 18, 32, 255))
    glow = texture.filter(ImageFilter.GaussianBlur(28))
    pos = ((poster.width - texture.width) // 2, (poster.height - texture.height) // 2)
    poster.alpha_composite(glow, pos)
    poster.alpha_composite(texture, pos)
    poster.convert("RGB").save(out_dir / "nz_hazard_poster.webp", quality=82, method=6)

    # Glow underlay for the 3D scene: blurred colour with padding so the halo is not clipped
    small = Image.fromarray((rgba * 255).astype(np.uint8), "RGBA").resize(
        (416, 435), Image.LANCZOS
    )
    pad = round(small.width * 0.08)
    halo = Image.new(
        "RGBA", (small.width + 2 * pad, small.height + 2 * pad), (0, 0, 0, 0)
    )
    halo.alpha_composite(small, (pad, pad))
    halo.filter(ImageFilter.GaussianBlur(12)).save(
        out_dir / "nz_glow.webp", quality=80, method=6
    )
    return aspect


def write_meta(aspect: float, meta_path: Path):
    """
    Write the extent, legend and source metadata the hero component imports

    Parameters
    ----------
    aspect : float
        cos(mid latitude) scaling for longitude
    meta_path : Path
        Output JSON path (src/data/hero_meta.json)
    """
    meta = {
        "lonMin": LON_MIN,
        "lonMax": LON_MAX,
        "latMin": LAT_MIN,
        "latMax": LAT_MAX,
        "aspect": round(aspect * (LON_MAX - LON_MIN) / (LAT_MAX - LAT_MIN), 4),
        "pgaMin": PGA_MIN,
        "pgaMax": PGA_MAX,
        "legend": [
            "#" + "".join(f"{round(c * 255):02X}" for c in HAZARD_CMAP(v)[:3])
            for v in np.linspace(0, 1, 6)
        ],
        "glowPadding": 0.08,
        "source": "NSHM 2022 (NSHM_v1.0.4) PGA, 10% in 50 years, Vs30 400 m/s, mean",
    }
    meta_path.write_text(json.dumps(meta, indent=2) + "\n")


def main():
    """Parse arguments and build all hero assets."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--hazard-cache",
        type=Path,
        help="Cached .npz with pts and vals from a previous fetch",
    )
    parser.add_argument("--tile-cache", type=Path, default=Path(".cache/terrain_tiles"))
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "public" / "hero",
    )
    parser.add_argument(
        "--meta-path",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "src" / "data" / "hero_meta.json",
    )
    args = parser.parse_args()

    if args.hazard_cache and args.hazard_cache.exists():
        cached = np.load(args.hazard_cache)
        pts, vals = cached["pts"], cached["vals"]
    else:
        pts, vals = fetch_nshm_hazard(os.environ["NSHM_API_KEY"])
        if args.hazard_cache:
            np.savez(args.hazard_cache, pts=pts, vals=vals)

    elev = load_elevation(args.tile_cache)
    pga = hazard_surface(pts, vals, elev.shape)
    aspect = save_assets(elev, pga, args.out_dir)
    write_meta(aspect, args.meta_path)
    print(f"Wrote hero assets for grid {elev.shape} to {args.out_dir}")


if __name__ == "__main__":
    main()
