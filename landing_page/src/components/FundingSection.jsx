import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { COMPUTING, FUNDERS, PRINCIPAL_FUNDER } from "../data/funding";
import { NEW_TAB } from "../data/site";

const tileSx = {
  p: 2.5,
  height: "100%",
  borderRadius: 3,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  color: "inherit",
  textDecoration: "none",
  transition: "border-color 200ms ease, transform 200ms ease",
  "&[href]:hover": { borderColor: "primary.main", transform: { sm: "translateY(-2px)" } },
  "@media (prefers-reduced-motion: reduce)": { transition: "none", "&[href]:hover": { transform: "none" } },
};

function OrgTile({ org, sx }) {
  const linkProps = org.url
    ? { component: "a", href: org.url, ...NEW_TAB, "aria-label": `${org.name} (opens in a new tab)` }
    : {};
  return (
    <Paper variant="outlined" {...linkProps} sx={{ ...tileSx, ...sx }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Typography sx={{ fontWeight: 650 }}>{org.name}</Typography>
        {org.url && <OpenInNewIcon aria-hidden sx={{ ml: "auto !important", fontSize: 16, color: "text.secondary" }} />}
      </Stack>
      {org.fullName && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {org.fullName}
        </Typography>
      )}
    </Paper>
  );
}

/**
 * Research funders, led by the principal funder, and the computing allocations behind the simulations
 */
export default function FundingSection() {
  return (
    <Box
      id="funding"
      component="section"
      aria-labelledby="funding-title"
      sx={{ scrollMarginTop: 64, pb: { xs: 8, md: 12 } }}
    >
      <Container maxWidth="xl">
        <Typography variant="overline" component="p" color="accentText.main">
          Funding &amp; computing
        </Typography>
        <Typography
          id="funding-title"
          variant="h3"
          component="h2"
          sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" }, maxWidth: 760 }}
        >
          Who funds this research?
        </Typography>

        <Box
          sx={{
            mt: 4,
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "2fr repeat(4, 1fr)" },
          }}
        >
          <Paper
            variant="outlined"
            component="a"
            href={PRINCIPAL_FUNDER.url}
            {...NEW_TAB}
            aria-label={`${PRINCIPAL_FUNDER.name}, principal funder (opens in a new tab)`}
            sx={{
              ...tileSx,
              p: 3,
              gridColumn: { sm: "1 / -1", lg: "auto" },
              borderColor: "primary.main",
              backgroundImage: "linear-gradient(135deg, rgba(246, 147, 34, 0.14), transparent 65%)",
            }}
          >
            <Typography variant="overline" sx={{ color: "accentText.main", lineHeight: 1.6 }}>
              Principal funder
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>
                {PRINCIPAL_FUNDER.name}
              </Typography>
              <OpenInNewIcon aria-hidden sx={{ fontSize: 18, color: "text.secondary" }} />
            </Stack>
            <Typography color="text.secondary">{PRINCIPAL_FUNDER.fullName}</Typography>
          </Paper>
          {FUNDERS.map((org) => (
            <OrgTile key={org.name} org={org} />
          ))}
        </Box>

        <Typography variant="h6" component="h3" sx={{ mt: { xs: 5, md: 7 } }}>
          Computing allocations
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 680 }}>
          Our large-scale ground motion simulations run on high-performance computing allocations from:
        </Typography>
        <Box
          sx={{
            mt: 2.5,
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" },
          }}
        >
          {COMPUTING.map((org) => (
            <OrgTile key={org.name} org={org} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
