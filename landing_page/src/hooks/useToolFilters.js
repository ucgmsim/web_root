import { useEffect, useState } from "react";
import { SECTIONS } from "../data/tools";

function readUrl() {
  const params = new URLSearchParams(window.location.search);
  const section = params.get("section");
  return {
    query: params.get("q") ?? "",
    section: SECTIONS.some((s) => s.id === section) ? section : "all",
  };
}

/**
 * Search text and section filter, mirrored into the URL so filtered views can be shared
 */
export default function useToolFilters() {
  const [initial] = useState(readUrl);
  const [query, setQuery] = useState(initial.query);
  const [section, setSection] = useState(initial.section);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query) params.set("q", query);
    else params.delete("q");
    if (section !== "all") params.set("section", section);
    else params.delete("section");
    const search = params.toString();
    const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [query, section]);

  return { query, setQuery, section, setSection };
}
