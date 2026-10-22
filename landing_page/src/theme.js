import { createTheme } from "@mui/material/styles";

// Orange from the UcEqEng GitHub mark; darker shade keeps text links above 4.5:1 on light surfaces
const ORANGE = "#F69322";
const ORANGE_DEEP = "#F16725";
const ORANGE_TEXT = "#B45309";

export const HERO_BG = "#0B1220";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: ORANGE, dark: "#D9770F", contrastText: "#1A1206" },
        secondary: { main: ORANGE_DEEP, contrastText: "#1A1206" },
        accentText: { main: ORANGE_TEXT },
        background: { default: "#F7F8FA", paper: "#FFFFFF" },
        text: { primary: "#0F172A", secondary: "#475569" },
        divider: "rgba(15, 23, 42, 0.08)",
      },
    },
    dark: {
      palette: {
        primary: { main: ORANGE, dark: "#D9770F", contrastText: "#1A1206" },
        secondary: { main: ORANGE_DEEP, contrastText: "#1A1206" },
        accentText: { main: ORANGE },
        background: { default: HERO_BG, paper: "#131C2E" },
        text: { primary: "#E2E8F0", secondary: "#94A3B8" },
        divider: "rgba(226, 232, 240, 0.08)",
      },
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter Variable", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 750, letterSpacing: "-0.03em", lineHeight: 1.05 },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.015em" },
    h6: { fontWeight: 650, letterSpacing: "-0.01em" },
    button: { textTransform: "none", fontWeight: 600 },
    overline: { fontWeight: 700, letterSpacing: "0.12em" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 999, paddingInline: 20 } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.vars.palette.divider}`,
          borderRadius: 18,
        }),
      },
    },
    MuiLink: {
      defaultProps: { color: "accentText.main", underline: "hover" },
    },
  },
});

export default theme;
