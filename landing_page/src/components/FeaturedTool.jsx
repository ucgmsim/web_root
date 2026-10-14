import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { HERO_BG } from "../theme";
import { NEW_TAB } from "../data/site";
import ToolImage from "./ToolImage";

/**
 * Wide spotlight card for the newest or most important tool
 */
export default function FeaturedTool({ tool }) {
  return (
    <Card
      component="article"
      aria-labelledby={`featured-${tool.id}`}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
        overflow: "hidden",
        bgcolor: HERO_BG,
        color: "#E2E8F0",
        borderColor: "rgba(246, 147, 34, 0.35)",
        backgroundImage: "radial-gradient(70% 90% at 100% 100%, rgba(246, 147, 34, 0.22), transparent 70%)",
      }}
    >
      <Box sx={{ aspectRatio: "16 / 9", overflow: "hidden" }}>
        <ToolImage tool={tool} sizes="(min-width: 900px) 700px, 100vw" />
      </Box>
      <Stack spacing={2} sx={{ justifyContent: "center", p: { xs: 3, md: 5 } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {tool.status && <Chip label={tool.status} color="primary" size="small" />}
          <Typography variant="overline" sx={{ color: "#94A3B8" }}>
            Featured tool
          </Typography>
        </Stack>
        <Typography
          id={`featured-${tool.id}`}
          variant="h3"
          component="h2"
          sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" }, color: "#F8FAFC" }}
        >
          {tool.name}
        </Typography>
        <Typography sx={{ color: "#94A3B8" }}>{tool.details}</Typography>
        <Stack direction="row" sx={{ gap: 0.75, flexWrap: "wrap" }}>
          {tool.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              sx={{ color: "#CBD5E1", borderColor: "rgba(203, 213, 225, 0.3)" }}
            />
          ))}
        </Stack>
        <Box>
          <Button
            variant="contained"
            size="large"
            href={tool.url}
            {...NEW_TAB}
            aria-label={`Launch ${tool.name} (opens in a new tab)`}
            endIcon={<OpenInNewIcon />}
          >
            Launch {tool.name}
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}
