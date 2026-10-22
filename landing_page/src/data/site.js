// Site-wide names, links and text. Set CONTACT_EMAIL to show an email contact in the About section.
export const SITE_NAME = "UcEqEng";
export const SITE_FULL_NAME = "UC Earthquake Engineering";
export const BASE_URL = "https://quakecoresoft.canterbury.ac.nz";
export const GITHUB_URL = "https://github.com/ucgmsim";
export const UC_URL = "https://www.canterbury.ac.nz";
export const DOCS_URL = `${BASE_URL}/docs`;
export const CONTACT_EMAIL = "uceqeng@gmail.com";

// Spread onto every external link: open in a new tab without giving it window.opener
export const NEW_TAB = { target: "_blank", rel: "noopener noreferrer" };

export const HERO_ATTRIBUTION = {
  hazard:
    "Hazard: NZ National Seismic Hazard Model 2022 (NSHM_v1.0.4), GNS Science / Earth Sciences New Zealand. Mean PGA, 10% probability of exceedance in 50 years, Vs30 = 400 m/s.",
  hazardUrl: "https://nshm.gns.cri.nz",
  terrain: "Terrain: Mapzen Terrain Tiles (AWS Open Data) and their source providers.",
  terrainUrl: "https://github.com/tilezen/joerd/blob/master/docs/attribution.md",
};
