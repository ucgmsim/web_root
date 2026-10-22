import { memo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { NEW_TAB } from "../data/site";
import { HERO_BG } from "../theme";
import ToolImage from "./ToolImage";

function ToolInfo({ tool, anchorEl, onClose }) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      slotProps={{ paper: { sx: { p: 2.5, maxWidth: 360, borderRadius: 3 } } }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {tool.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {tool.details}
      </Typography>
      <Stack direction="row" sx={{ gap: 0.75, flexWrap: "wrap", mt: 1.5 }}>
        {tool.tags.map((tag) => (
          <Chip key={tag} label={tag} size="small" variant="outlined" />
        ))}
      </Stack>
      <Button
        variant="contained"
        size="small"
        href={tool.url}
        {...NEW_TAB}
        aria-label={`Launch ${tool.name} (opens in a new tab)`}
        endIcon={<OpenInNewIcon />}
        sx={{ mt: 2 }}
      >
        Launch
      </Button>
    </Popover>
  );
}

/**
 * Tool card: preview, title and one-liner launch the tool in a new tab; info and favourite sit below
 */
function ToolCard({ tool, isFavourite, onToggleFavourite }) {
  const [infoAnchor, setInfoAnchor] = useState(null);

  return (
    <Card
      component="article"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
        "&:hover": {
          transform: { sm: "translateY(-3px)" },
          boxShadow: "0 18px 40px -18px rgba(15, 23, 42, 0.35)",
          borderColor: "primary.main",
        },
        "&:hover img": { transform: "scale(1.035)" },
        "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
      }}
    >
      <CardActionArea
        component="a"
        href={tool.url}
        {...NEW_TAB}
        aria-label={`Launch ${tool.name}: ${tool.description} (opens in a new tab)`}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: { xs: "row", sm: "column" },
          alignItems: "stretch",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            aspectRatio: "16 / 9",
            bgcolor: HERO_BG,
            flexShrink: 0,
            width: { xs: 128, sm: "100%" },
            alignSelf: { xs: "center", sm: "auto" },
            m: { xs: 1.5, sm: 0 },
            mr: { xs: 0, sm: 0 },
            borderRadius: { xs: 2, sm: 0 },
          }}
        >
          <ToolImage tool={tool} sizes="(min-width: 1200px) 400px, (min-width: 600px) 50vw, 128px" />
          {tool.status && (
            <Chip
              label={tool.status}
              size="small"
              color="primary"
              sx={{ position: "absolute", top: 10, left: 10, display: { xs: "none", sm: "flex" } }}
            />
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, pb: { xs: 1.5, sm: 1 } }}>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}>
              {tool.name}
            </Typography>
            {tool.status && (
              <Chip label={tool.status} size="small" color="primary" sx={{ display: { sm: "none" }, height: 20 }} />
            )}
            <OpenInNewIcon aria-hidden sx={{ ml: "auto", fontSize: 18, color: "text.secondary" }} />
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {tool.description}
          </Typography>
          <Stack direction="row" sx={{ gap: 0.75, flexWrap: "wrap", mt: 1.5, display: { xs: "none", sm: "flex" } }}>
            {tool.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>
      <Stack direction="row" sx={{ justifyContent: "flex-end", px: 1, pb: 1, mt: { xs: -1, sm: 0 } }}>
        <Tooltip title="More about this tool">
          <IconButton
            size="small"
            aria-label={`About ${tool.name}`}
            onClick={(event) => setInfoAnchor(event.currentTarget)}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={isFavourite ? "Remove from your tools" : "Add to your tools"}>
          <IconButton
            size="small"
            aria-label={`${isFavourite ? "Remove" : "Add"} ${tool.name} ${isFavourite ? "from" : "to"} your tools`}
            aria-pressed={isFavourite}
            onClick={() => onToggleFavourite(tool.id)}
            sx={{ color: isFavourite ? "primary.main" : undefined }}
          >
            {isFavourite ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Stack>
      <ToolInfo tool={tool} anchorEl={infoAnchor} onClose={() => setInfoAnchor(null)} />
    </Card>
  );
}

export default memo(ToolCard);
