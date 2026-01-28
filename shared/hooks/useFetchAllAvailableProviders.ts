import { ServiceProvider } from "@/data-models/service-provider.interface";
import { useState, useEffect } from "react";

const useFetchAllAvailableProviders = () => {
  // This hook now queries a server-side route `/api/providers` which handles TMDB requests
  // and keeps the API key server-only.

  const [isLoading, setStatus] = useState<boolean>(true);
  const [moviesContent, setMovies] = useState<ServiceProvider[]>([]);
  const [tvContent, setTvShows] = useState<ServiceProvider[]>([]);
  const [allProviders, setAllProviders] = useState<ServiceProvider[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/providers`);
        if (!res.ok) {
          setStatus(false);
          return;
        }
        const json = await res.json();
        setMovies(json.movies || []);
        setTvShows(json.tv || []);
        setAllProviders(json.all || []);
      } catch (e) {
        console.error(e);
      } finally {
        setStatus(false);
      }
    };
    fetchData();
  }, []);

  return { moviesContent, tvContent, allProviders, isLoading };
};

export default useFetchAllAvailableProviders;
