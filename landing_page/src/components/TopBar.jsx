import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useColorScheme } from "@mui/material/styles";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { DOCS_URL, GITHUB_URL, NEW_TAB, SITE_FULL_NAME, SITE_NAME } from "../data/site";

const navButtonSx = { color: "#CBD5E1", "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255, 255, 255, 0.06)" } };

function ColourModeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  if (!mode) return null;
  const resolved = mode === "system" ? systemMode : mode;
  const next = resolved === "dark" ? "light" : "dark";
  return (
    <Tooltip title={`Switch to ${next} mode`}>
      <IconButton onClick={() => setMode(next)} aria-label={`Switch to ${next} mode`} sx={navButtonSx}>
        {resolved === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}

/**
 * Fixed top bar: transparent over the hero, glassy once the page scrolls
 */
export default function TopBar() {
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 24 });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const closeMenu = () => setMenuAnchor(null);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: scrolled ? "rgba(11, 18, 32, 0.78)" : "transparent",
        backdropFilter: scrolled ? "saturate(160%) blur(14px)" : "none",
        borderBottom: "1px solid",
        borderColor: scrolled ? "rgba(148, 163, 184, 0.14)" : "transparent",
        transition: "background-color 200ms ease, border-color 200ms ease",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: 64 } }}>
          <Box
            component="a"
            href="#top"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              color: "inherit",
              textDecoration: "none",
              mr: "auto",
            }}
          >
            <Box component="img" src="/brand/q_mark.png" alt="" width={32} height={32} />
            <Typography
              noWrap
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.1rem" },
                color: "#F8FAFC",
                letterSpacing: "-0.01em",
              }}
            >
              {SITE_NAME}
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" }, fontWeight: 400, color: "#94A3B8", ml: 1 }}
              >
                {SITE_FULL_NAME}
              </Box>
            </Typography>
          </Box>

          <Box
            component="nav"
            aria-label="Main"
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}
          >
            <Button href="#tools" sx={navButtonSx}>
              Tools
            </Button>
            <Button href="#about" sx={navButtonSx}>
              About
            </Button>
            <Button href="#funding" sx={navButtonSx}>
              Funding
            </Button>
            <Button
              href={DOCS_URL}
              {...NEW_TAB}
              aria-label="Docs (opens in a new tab)"
              endIcon={<OpenInNewIcon sx={{ fontSize: "16px !important" }} />}
              sx={navButtonSx}
            >
              Docs
            </Button>
          </Box>
          <Tooltip title={`${SITE_NAME} on GitHub`}>
            <IconButton
              href={GITHUB_URL}
              {...NEW_TAB}
              aria-label={`${SITE_NAME} on GitHub (opens in a new tab)`}
              sx={navButtonSx}
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
          <ColourModeToggle />
          <IconButton
            aria-label="Open menu"
            aria-controls={menuAnchor ? "main-menu" : undefined}
            aria-haspopup="true"
            onClick={(event) => setMenuAnchor(event.currentTarget)}
            sx={{ ...navButtonSx, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Menu id="main-menu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
            <MenuItem component="a" href="#tools" onClick={closeMenu}>
              Tools
            </MenuItem>
            <MenuItem component="a" href="#about" onClick={closeMenu}>
              About
            </MenuItem>
            <MenuItem component="a" href="#funding" onClick={closeMenu}>
              Funding
            </MenuItem>
            <MenuItem component="a" href={DOCS_URL} {...NEW_TAB} onClick={closeMenu}>
              Docs <OpenInNewIcon sx={{ fontSize: 16, ml: 1 }} />
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
