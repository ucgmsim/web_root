import { useDeferredValue, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SECTIONS, TOOLS, searchText } from "../data/tools";
import useFavourites from "../hooks/useFavourites";
import useToolFilters from "../hooks/useToolFilters";
import FeaturedTool from "./FeaturedTool";
import ToolCard from "./ToolCard";
import ToolFilters from "./ToolFilters";

const SEARCH_INDEX = TOOLS.map((tool) => ({ tool, text: searchText(tool) }));
const FEATURED = TOOLS.filter((tool) => tool.featured);

const gridSx = {
  display: "grid",
  gap: { xs: 1.5, sm: 3 },
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
};

function ToolGroup({ id, title, blurb, tools, favourites, onToggleFavourite }) {
  return (
    <Box component="section" aria-labelledby={`${id}-title`} sx={{ mt: { xs: 5, md: 7 }, scrollMarginTop: 160 }}>
      <Typography id={`${id}-title`} variant="h4" component="h2" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
        {title}
      </Typography>
      {blurb && (
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {blurb}
        </Typography>
      )}
      <Box sx={{ ...gridSx, mt: 2.5 }}>
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isFavourite={favourites.has(tool.id)}
            onToggleFavourite={onToggleFavourite}
          />
        ))}
      </Box>
    </Box>
  );
}

/**
 * Searchable, filterable directory of every tool, grouped by section
 */
export default function ToolDirectory() {
  const { query, setQuery, section, setSection } = useToolFilters();
  const [favouriteIds, toggleFavourite] = useFavourites();
  const favourites = useMemo(() => new Set(favouriteIds), [favouriteIds]);
  const deferredQuery = useDeferredValue(query);

  const matches = useMemo(() => {
    const terms = deferredQuery.toLowerCase().split(/\s+/).filter(Boolean);
    return SEARCH_INDEX.filter(
      ({ tool, text }) => (section === "all" || tool.section === section) && terms.every((term) => text.includes(term)),
    ).map(({ tool }) => tool);
  }, [deferredQuery, section]);

  const groups = useMemo(
    () =>
      SECTIONS.map((s) => ({ ...s, tools: matches.filter((tool) => tool.section === s.id) })).filter(
        (s) => s.tools.length > 0,
      ),
    [matches],
  );

  const filtering = Boolean(query) || section !== "all";
  const favouriteTools = useMemo(() => TOOLS.filter((tool) => favourites.has(tool.id)), [favourites]);
  const clearFilters = () => {
    setQuery("");
    setSection("all");
  };

  return (
    <Box
      id="tools"
      component="section"
      aria-labelledby="tools-title"
      sx={{ scrollMarginTop: 64, pb: { xs: 8, md: 12 } }}
    >
      <Container maxWidth="xl">
        <Box sx={{ pt: { xs: 6, md: 9 }, pb: 1 }}>
          <Typography variant="overline" component="p" color="accentText.main">
            Web tools
          </Typography>
          <Typography id="tools-title" variant="h3" component="h2" sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" } }}>
            Find the right tool
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 640 }}>
            Every tool opens in a new tab, so you can keep this page as your launcher.
          </Typography>
        </Box>

        <ToolFilters query={query} onQueryChange={setQuery} section={section} onSectionChange={setSection} />

        {filtering ? (
          <Stack direction="row" spacing={1} aria-live="polite" sx={{ alignItems: "center" }}>
            <Typography color="text.secondary">
              Showing {matches.length} of {TOOLS.length} tools
            </Typography>
            <Button size="small" onClick={clearFilters}>
              Clear filters
            </Button>
          </Stack>
        ) : (
          <>
            {FEATURED.length > 0 && (
              <Box
                sx={{
                  mt: 3,
                  display: "grid",
                  gap: 3,
                  gridTemplateColumns: { xs: "1fr", lg: FEATURED.length > 1 ? "repeat(2, 1fr)" : "1fr" },
                }}
              >
                {FEATURED.map((tool) => (
                  <FeaturedTool key={tool.id} tool={tool} stacked={FEATURED.length > 1} />
                ))}
              </Box>
            )}
            {favouriteTools.length > 0 && (
              <ToolGroup
                id="favourites"
                title="Your tools"
                blurb="Tools you starred on this device."
                tools={favouriteTools}
                favourites={favourites}
                onToggleFavourite={toggleFavourite}
              />
            )}
          </>
        )}

        {groups.map((group) => (
          <ToolGroup
            key={group.id}
            id={`section-${group.id}`}
            title={group.title}
            blurb={group.blurb}
            tools={group.tools}
            favourites={favourites}
            onToggleFavourite={toggleFavourite}
          />
        ))}

        {matches.length === 0 && (
          <Box sx={{ py: 10, textAlign: "center" }}>
            <Typography variant="h6" component="p">
              No tools match &ldquo;{query}&rdquo;
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Try a broader term such as &ldquo;hazard&rdquo;, &ldquo;Vs30&rdquo; or &ldquo;database&rdquo;.
            </Typography>
            <Button variant="outlined" onClick={clearFilters} sx={{ mt: 3 }}>
              Clear filters
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
