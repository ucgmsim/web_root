import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "qcs:favourites";

function readStored() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Favourite tool ids kept in localStorage for returning visitors
 */
export default function useFavourites() {
  const [favourites, setFavourites] = useState(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // Storage can be unavailable (private mode); favourites then last for the session only
    }
  }, [favourites]);

  const toggleFavourite = useCallback((id) => {
    setFavourites((current) => (current.includes(id) ? current.filter((fav) => fav !== id) : [...current, id]));
  }, []);

  return [favourites, toggleFavourite];
}
