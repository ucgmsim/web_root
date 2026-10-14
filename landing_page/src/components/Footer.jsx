import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DOCS_URL, GITHUB_URL, HERO_ATTRIBUTION, NEW_TAB, SITE_FULL_NAME, SITE_NAME, UC_URL } from "../data/site";
import { HERO_BG } from "../theme";

const linkSx = { color: "#CBD5E1", "&:hover": { color: "#FFFFFF" } };

/**
 * Footer with links, research-use disclaimer and hero data attribution
 */
export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: HERO_BG, color: "#94A3B8", py: { xs: 6, md: 8 } }}>
      <Container maxWidth="xl">
        <Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ justifyContent: "space-between" }}>
          <Box sx={{ maxWidth: 520 }}>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
              <Box component="img" src="/brand/q_mark.png" alt="" width={28} height={28} loading="lazy" />
              <Typography sx={{ fontWeight: 700, color: "#F8FAFC" }}>
                {SITE_NAME}{" "}
                <Box component="span" sx={{ fontWeight: 400, color: "#94A3B8" }}>
                  {SITE_FULL_NAME}
                </Box>
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Values from these tools come from research models and simulations. They are intended for research use and
              should not be used for seismic design or engineering practice without independent verification.
            </Typography>
          </Box>
          <Stack direction="row" spacing={4} component="nav" aria-label="Footer">
            <Stack spacing={1}>
              <Link href="#tools" sx={linkSx}>
                Tools
              </Link>
              <Link href="#about" sx={linkSx}>
                About
              </Link>
              <Link href={DOCS_URL} {...NEW_TAB} sx={linkSx}>
                Docs
              </Link>
            </Stack>
            <Stack spacing={1}>
              <Link href={GITHUB_URL} {...NEW_TAB} sx={linkSx}>
                GitHub
              </Link>
              <Link href="#funding" sx={linkSx}>
                Funding
              </Link>
              <Link href={UC_URL} {...NEW_TAB} sx={linkSx}>
                University of Canterbury
              </Link>
            </Stack>
          </Stack>
        </Stack>
        <Box sx={{ mt: 6, pt: 3, borderTop: "1px solid rgba(148, 163, 184, 0.15)" }}>
          <Typography variant="caption" component="p">
            Hero map. {HERO_ATTRIBUTION.hazard}{" "}
            <Link href={HERO_ATTRIBUTION.hazardUrl} {...NEW_TAB} sx={linkSx}>
              nshm.gns.cri.nz
            </Link>
            . {HERO_ATTRIBUTION.terrain}{" "}
            <Link href={HERO_ATTRIBUTION.terrainUrl} {...NEW_TAB} sx={linkSx}>
              Attribution
            </Link>
            .
          </Typography>
          <Typography variant="caption" component="p" sx={{ mt: 1 }}>
            © {new Date().getFullYear()} {SITE_FULL_NAME}, University of Canterbury.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
