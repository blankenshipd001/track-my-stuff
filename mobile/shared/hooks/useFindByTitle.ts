import { Media } from "@/data-models/media.interface";
import { useState } from "react";

/**
 * Client hook that delegates search to a server API route (`/api/search`).
 * This avoids exposing the TMDB API key to the browser and keeps heavy work on the server.
 */
export const useFindByTitle = () => {
  const [allContent, setAllContent] = useState<Media[]>([]);
  const [moviesContent, setMovies] = useState<Media[]>([]);
  const [tvContent, setTvShows] = useState<Media[]>([]);

  const fetchContent = async (searchValue: string) => {
    if (!searchValue) return;
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchValue)}`);
      if (!res.ok) return;
      const json = await res.json();
      setMovies(json.movies || []);
      setTvShows(json.tv || []);
      setAllContent(json.all || []);
    } catch (err) {
      // ignore or surface to caller later
      console.error("search error", err);
    }
  };

  return { allContent, moviesContent, tvContent, fetchContent };
};
