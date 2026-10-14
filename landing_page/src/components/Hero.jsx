import { lazy, Suspense, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import heroMeta from "../data/hero_meta.json";
import { GITHUB_URL, HERO_ATTRIBUTION, NEW_TAB, SITE_FULL_NAME, SITE_NAME } from "../data/site";
import { SECTIONS, TOOLS } from "../data/tools";
import { HERO_BG } from "../theme";

const HeroScene = lazy(() => import("./HeroScene"));

const LEGEND_TICKS = [0.1, 0.3, 1.0];

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const WEBGL = typeof document !== "undefined" && supportsWebGL();

function tickPosition(value) {
  return (Math.log(value / heroMeta.pgaMin) / Math.log(heroMeta.pgaMax / heroMeta.pgaMin)) * 100;
}

function HazardLegend() {
  return (
    <Box
      sx={{
        position: "absolute",
        right: { xs: 12, md: 72 },
        bottom: { xs: 12, md: 32 },
        width: 230,
        p: 1.5,
        borderRadius: 3,
        bgcolor: "rgba(15, 23, 42, 0.72)",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        backdropFilter: "blur(10px)",
        color: "#CBD5E1",
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: "#E2E8F0" }}>
          Peak ground acceleration (g)
        </Typography>
        <Tooltip
          title={`${HERO_ATTRIBUTION.hazard} ${HERO_ATTRIBUTION.terrain}`}
          placement="top-end"
          enterTouchDelay={0}
        >
          <InfoOutlinedIcon tabIndex={0} aria-label="Map data sources" sx={{ fontSize: 16, cursor: "help" }} />
        </Tooltip>
      </Stack>
      <Box
        sx={{
          mt: 1,
          height: 8,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${heroMeta.legend.join(", ")})`,
        }}
      />
      <Box sx={{ position: "relative", height: 16, mt: 0.5 }}>
        {LEGEND_TICKS.map((tick) => (
          <Typography
            key={tick}
            variant="caption"
            sx={{
              position: "absolute",
              left: `${tickPosition(tick)}%`,
              transform: tick === LEGEND_TICKS[0] ? "none" : tick === 1 ? "translateX(-100%)" : "translateX(-50%)",
              fontSize: 11,
            }}
          >
            {tick.toFixed(1)}
          </Typography>
        ))}
      </Box>
      <Typography variant="caption" component="p" sx={{ fontSize: 11, color: "#94A3B8", mt: 0.25 }}>
        10% in 50 years · NSHM 2022 · Vs30 400 m/s
      </Typography>
    </Box>
  );
}

/**
 * Full-bleed dark hero: headline and calls to action beside the 3D NSHM hazard view of New Zealand
 */
export default function Hero() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", { noSsr: true });
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"), { noSsr: true });
  const [sceneReady, setSceneReady] = useState(false);
  const handleReady = useCallback(() => setSceneReady(true), []);
  const show3d = WEBGL && isDesktop && !reducedMotion;

  return (
    <Box
      component="section"
      aria-labelledby="hero-title"
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: HERO_BG,
        color: "#E2E8F0",
        backgroundImage: [
          "radial-gradient(55% 60% at 78% 45%, rgba(246, 147, 34, 0.16), transparent 70%)",
          "radial-gradient(40% 50% at 8% 95%, rgba(76, 29, 149, 0.28), transparent 70%)",
          "radial-gradient(rgba(148, 163, 184, 0.10) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "auto, auto, 26px 26px",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" },
          alignItems: "center",
          gap: { xs: 2, md: 4 },
          minHeight: { md: "min(880px, 94vh)" },
          pt: { xs: 13, md: 10 },
          pb: { xs: 0, md: 6 },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 620 }}>
          <Typography variant="overline" component="p" sx={{ color: "primary.main", mb: 2 }}>
            {SITE_NAME} · University of Canterbury
          </Typography>
          <Typography
            id="hero-title"
            variant="h1"
            sx={{ fontSize: { xs: "2.6rem", sm: "3.4rem", lg: "4.1rem" }, color: "#F8FAFC" }}
          >
            Earthquake engineering tools for{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg, #F69322, #F16725 60%, #FDE68A)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              New Zealand
            </Box>
          </Typography>
          <Typography sx={{ mt: 3, fontSize: { xs: "1.05rem", md: "1.2rem" }, color: "#94A3B8", maxWidth: 540 }}>
            Explore seismic hazard, characterise sites and download recorded and simulated ground motions with open web
            tools from {SITE_FULL_NAME} at the University of Canterbury.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 4 }}>
            <Button variant="contained" size="large" href="#tools" endIcon={<ArrowDownwardIcon />}>
              Browse tools
            </Button>
            <Button
              variant="outlined"
              size="large"
              href={GITHUB_URL}
              {...NEW_TAB}
              aria-label={`${SITE_NAME} on GitHub (opens in a new tab)`}
              startIcon={<GitHubIcon />}
              sx={{ color: "#E2E8F0", borderColor: "rgba(226, 232, 240, 0.3)", "&:hover": { borderColor: "#E2E8F0" } }}
            >
              GitHub
            </Button>
          </Stack>
          <Stack
            direction="row"
            divider={<Box sx={{ width: "1px", bgcolor: "rgba(148, 163, 184, 0.25)" }} />}
            spacing={2.5}
            sx={{ mt: 5, color: "#94A3B8" }}
          >
            <HeroStat value={TOOLS.length} label="web tools" />
            <HeroStat value={SECTIONS.length} label="research areas" />
            <HeroStat value="Open" label="source on GitHub" />
          </Stack>
        </Box>

        <Box
          sx={{
            position: "relative",
            height: { xs: 380, sm: 460, md: "min(780px, 86vh)" },
            mx: { xs: -2, md: 0 },
            mr: { md: -6 },
          }}
        >
          <Box
            component="img"
            src="/hero/nz_hazard_poster.webp"
            alt="Map of New Zealand coloured by NSHM 2022 seismic hazard, highest along the Alpine Fault and around Wellington"
            width={1600}
            height={1200}
            fetchPriority="high"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: sceneReady ? 0 : 1,
              transition: "opacity 900ms ease",
            }}
          />
          {show3d && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                opacity: sceneReady ? 1 : 0,
                transition: "opacity 900ms ease",
                // Fade the survey grid out before the canvas edge
                maskImage: "radial-gradient(70% 72% at 55% 50%, #000 55%, transparent 100%)",
              }}
            >
              <Suspense fallback={null}>
                <HeroScene onReady={handleReady} />
              </Suspense>
            </Box>
          )}
          <HazardLegend />
        </Box>
      </Container>
    </Box>
  );
}

function HeroStat({ value, label }) {
  return (
    <Box>
      <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.2 }}>{value}</Typography>
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
}
