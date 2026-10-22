# Landing Page

Homepage for the UcEqEng (UC Earthquake Engineering) web tools, built with React, Vite, MUI and three.js.

## Running the Landing Page

```bash
npm install
npm start          # dev server on http://localhost:3000 (or $PORT)
npm run build      # production build into build/
npm run preview    # serve the production build locally
```

Vite 6 runs on Node 18, but Node 20+ is recommended.

## Adding or editing a tool

All tools live in `src/data/tools.js`. Every card, the search and the section filters are generated from it.

1. Add an entry with `id`, `name`, `section`, `description`, `details`, `url` and `tags`. Optionally add `status` (e.g. `"New"`) and `featured: true`.
2. Add two 16:9 preview images: `public/tools/<id>.webp` (1200x675) and `public/tools/<id>_600.webp` (600x338).

Site-wide names and links (GitHub, docs, contact email) are in `src/data/site.js`. Funders and computing allocations are in `src/data/funding.js`.

## 3D hero map

The hero shows NZ terrain coloured by NSHM 2022 hazard: mean PGA, 10% in 50 years, Vs30 = 400 m/s. These textures are generated offline:

```bash
NSHM_API_KEY=<key> python scripts/build_hero_assets.py --hazard-cache .cache/nshm_pga_475.npz
```

- **Hazard values** come from the NSHM web app's GraphQL API, using the public `X-API-KEY` its front end uses. The script needs `numpy`, `scipy`, `matplotlib` and `Pillow`.
- **Terrain** comes from Mapzen Terrarium tiles on AWS Open Data, cached in `.cache/terrain_tiles`.
- **Outputs:**
  - `public/hero/`: height, normal, colour and glow textures, plus the static poster.
  - `src/data/hero_meta.json`: extent and legend.

Browsers without WebGL, and phones, see the static poster. So does anyone with reduced motion turned on.
