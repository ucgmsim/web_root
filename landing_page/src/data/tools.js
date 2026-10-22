import { BASE_URL } from "./site";

// Single source of truth for every tool on the page. Add a tool here plus a 16:9 image in public/tools/.
export const SECTIONS = [
  {
    id: "hazard",
    label: "Hazard",
    title: "Seismic Hazard & Ground Motion",
    blurb: "Real-time shaking, active faults and scenario simulations.",
  },
  {
    id: "site",
    label: "Site",
    title: "Site Characterisation",
    blurb: "Vs30 models, CPT / SPT data and tools to infer site conditions.",
  },
  {
    id: "data",
    label: "Data & Models",
    title: "Ground Motion Data & Models",
    blurb: "Recorded and simulated ground motions and the NZ velocity model.",
  },
  {
    id: "docs",
    label: "Docs",
    title: "Documentation",
    blurb: "Developer documentation for the libraries behind these tools.",
  },
];

// Set hidden: true to take a tool off the page without deleting its entry
const ALL_TOOLS = [
  {
    id: "seismic_now",
    name: "SeismicNow",
    section: "hazard",
    description: "Near real-time ground motion analysis for recent New Zealand earthquakes.",
    details:
      "Near real-time ground motion analysis for New Zealand, with station waveforms, intensity measures and event maps.",
    url: `${BASE_URL}/seismic_now`,
    tags: ["Real-time", "Waveforms", "Stations"],
    status: "Updated",
    featured: true,
  },
  {
    id: "sim_atlas",
    name: "Simulation Atlas",
    section: "hazard",
    description: "Explore NZ's active faults and an illustrative ground motion simulation for each.",
    details:
      "Mapped active faults in New Zealand, their properties, and an illustrative ground motion simulation for a potential major earthquake on each fault.",
    url: `${BASE_URL}/sim_atlas`,
    tags: ["Faults", "Simulations", "Map"],
  },
  {
    id: "code_hazard",
    name: "Code Hazard",
    section: "hazard",
    description: "NZS1170.5 design hazard values for any location in New Zealand.",
    details:
      "Displays NZS1170.5 Hazard Map information across New Zealand for a chosen return period and intensity measure.",
    url: `${BASE_URL}/code_hazard`,
    tags: ["NZS1170.5", "Design", "Map"],
    // Offline while its data pipeline is rebuilt
    hidden: true,
  },
  {
    id: "vs30",
    name: "Vs30 Map",
    section: "site",
    description: "Vs30 models, geology and terrain categories, and measured sites.",
    details: "Vs30 models and categories for New Zealand, with the measured sites used to build them.",
    url: `${BASE_URL}/vs30`,
    tags: ["Vs30", "Geology", "Map"],
  },
  {
    id: "vs_viewer",
    name: "VsViewer",
    section: "site",
    description: "Turn CPT, SPT and Vs profiles into informed Vs30 estimates.",
    details: "Visualise CPT / SPT / Vs profiles and apply correlations to infer informed Vs30 values.",
    url: `${BASE_URL}/vs_viewer`,
    tags: ["CPT", "SPT", "Vs30"],
  },
  {
    id: "nzgd",
    name: "NZGD CPT & SPT",
    section: "site",
    description: "Standardised CPT and SPT data with Vs30 estimates, derived from NZGD records.",
    details:
      "Access standardised Cone Penetration Test (CPT) and Standard Penetration Test (SPT) data, derived from records hosted by the New Zealand Geotechnical Database (NZGD), with Vs30 estimates for selected correlations.",
    url: `${BASE_URL}/nzgd`,
    tags: ["CPT", "SPT", "Downloads"],
    status: "Updated",
  },
  {
    id: "nzgmdb",
    name: "NZGMDB",
    section: "data",
    description: "Search and download recorded strong-motion data from NZ earthquakes.",
    details:
      "New Zealand Ground Motion Database (NZGMDB) for accessing and downloading strong motion records from New Zealand earthquakes.",
    url: `${BASE_URL}/nzgmdb`,
    tags: ["Records", "Database", "Downloads"],
  },
  {
    id: "nzsdb",
    name: "NZ Simulation Database",
    section: "data",
    description: "Download simulated ground motions for past and scenario earthquakes.",
    details:
      "New Zealand Simulation Database (NZSDB) for exploring and downloading simulated ground motions for past and future New Zealand earthquakes. Filter by event or site, inspect results on a map, and download the subset you need.",
    url: `${BASE_URL}/simulation_db`,
    tags: ["Simulations", "Database", "Downloads"],
    status: "New",
    featured: true,
  },
  {
    id: "nzcvm",
    name: "NZCVM Web App",
    section: "data",
    description: "Interactively configure and query the NZ Community Velocity Model.",
    details: "An interactive interface for the New Zealand Community Velocity Model (NZCVM).",
    url: `${BASE_URL}/nzcvm_webapp`,
    tags: ["Velocity model", "3D", "Config"],
  },
  {
    id: "docs",
    name: "QCore Docs",
    section: "docs",
    description: "API and module documentation for our Python packages.",
    details:
      "Documentation for the Python packages behind these tools, such as source_modelling, velocity_modelling, IM and workflow.",
    url: `${BASE_URL}/docs`,
    tags: ["API", "Python", "Reference"],
  },
];

export const TOOLS = ALL_TOOLS.filter((tool) => !tool.hidden);

/**
 * Lowercase text used for searching a tool
 */
export function searchText(tool) {
  return [tool.name, tool.description, tool.details, ...tool.tags].join(" ").toLowerCase();
}
