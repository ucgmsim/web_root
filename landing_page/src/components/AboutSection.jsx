import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  CONTACT_EMAIL,
  GITHUB_URL,
  LEAD_NAME,
  LEAD_URL,
  NEW_TAB,
  SITE_FULL_NAME,
  SITE_NAME,
  UC_URL,
} from "../data/site";

function Panel({ title, children }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, height: "100%" }}>
      <Typography variant="h6" component="h3" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

/**
 * About us, open source and contact panels
 */
export default function AboutSection() {
  return (
    <Box
      id="about"
      component="section"
      aria-labelledby="about-title"
      sx={{ scrollMarginTop: 64, py: { xs: 8, md: 12 }, borderTop: "1px solid", borderColor: "divider" }}
    >
      <Container maxWidth="xl">
        <Typography variant="overline" component="p" color="accentText.main">
          About us
        </Typography>
        <Typography
          id="about-title"
          variant="h3"
          component="h2"
          sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" }, maxWidth: 760 }}
        >
          Research software for a more earthquake-resilient New Zealand
        </Typography>

        <Box
          sx={{
            mt: 4,
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
          }}
        >
          <Panel title="Who we are">
            <Typography color="text.secondary">
              {SITE_NAME} ({SITE_FULL_NAME}) is an earthquake engineering research group at the{" "}
              <Link href={UC_URL} {...NEW_TAB}>
                University of Canterbury
              </Link>{" "}
              led by{" "}
              <Link href={LEAD_URL} {...NEW_TAB}>
                {LEAD_NAME}
              </Link>
              . Our research spans ground motion simulation, seismic hazard, site characterisation and velocity
              modelling, and we turn it into tools that researchers and engineers can use directly in the browser.
            </Typography>
            <Link href="#funding" sx={{ display: "inline-block", mt: 2 }}>
              See who funds this research
            </Link>
          </Panel>
          <Panel title="Open source">
            <Typography color="text.secondary">
              Our code, models and workflows are developed in the open. Browse the repositories behind these tools,
              report issues or contribute.
            </Typography>
            <Button
              variant="contained"
              href={GITHUB_URL}
              {...NEW_TAB}
              aria-label={`${SITE_NAME} on GitHub (opens in a new tab)`}
              startIcon={<GitHubIcon />}
              sx={{ mt: 3 }}
            >
              github.com/ucgmsim
            </Button>
          </Panel>
          <Panel title="Get in touch">
            <Typography color="text.secondary">
              Found a bug or need data that a tool doesn&apos;t provide? Open an issue on the relevant repository
              {CONTACT_EMAIL ? " or email the team." : "."}
            </Typography>
            <Stack spacing={1} sx={{ mt: 3 }}>
              <Link href={GITHUB_URL} {...NEW_TAB} sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                GitHub repositories <OpenInNewIcon sx={{ fontSize: 16 }} />
              </Link>
              {CONTACT_EMAIL && (
                <Link href={`mailto:${CONTACT_EMAIL}`} sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                  <MailOutlinedIcon sx={{ fontSize: 18 }} /> {CONTACT_EMAIL}
                </Link>
              )}
            </Stack>
          </Panel>
        </Box>
      </Container>
    </Box>
  );
}
