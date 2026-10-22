import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { SECTIONS } from "../data/tools";

function isTypingTarget(element) {
  return (
    element instanceof HTMLElement &&
    (element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName))
  );
}

const kbdSx = {
  display: { xs: "none", md: "inline-flex" },
  px: 0.75,
  py: 0.1,
  borderRadius: 1,
  border: "1px solid",
  borderColor: "divider",
  fontSize: 12,
  color: "text.secondary",
  fontFamily: "inherit",
};

/**
 * Search box and section chips; "/" or Ctrl/Cmd+K focuses the search
 */
export default function ToolFilters({ query, onQueryChange, section, onSectionChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      const shortcut =
        (event.key === "/" && !isTypingTarget(event.target)) || (event.key === "k" && (event.metaKey || event.ctrlKey));
      if (!shortcut) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 64,
        zIndex: 2,
        py: 2,
        mb: 2,
        bgcolor: "rgba(var(--mui-palette-background-defaultChannel) / 0.86)",
        backdropFilter: "saturate(160%) blur(12px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "center" } }}>
        <TextField
          inputRef={inputRef}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search tools, e.g. Vs30 or CPT"
          size="small"
          type="search"
          sx={{
            width: { xs: "100%", md: 380 },
            "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor: "background.paper" },
            "& input::-webkit-search-cancel-button": { display: "none" },
          }}
          slotProps={{
            htmlInput: { "aria-label": "Search tools" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {query ? (
                    <IconButton size="small" aria-label="Clear search" onClick={() => onQueryChange("")}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <Box component="kbd" sx={kbdSx}>
                      /
                    </Box>
                  )}
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack
          direction="row"
          spacing={1}
          role="group"
          aria-label="Filter by section"
          sx={{ overflowX: "auto", pb: { xs: 0.5, md: 0 }, scrollbarWidth: "none" }}
        >
          {[{ id: "all", label: "All" }, ...SECTIONS].map((item) => {
            const selected = section === item.id;
            return (
              <Chip
                key={item.id}
                label={item.label}
                clickable
                color={selected ? "primary" : "default"}
                variant={selected ? "filled" : "outlined"}
                aria-pressed={selected}
                onClick={() => onSectionChange(item.id)}
              />
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
