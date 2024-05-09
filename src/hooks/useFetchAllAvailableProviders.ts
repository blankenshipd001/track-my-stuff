import { ServiceProvider } from "@/data-models/service-provider.interface";
import { useState, useEffect } from "react";

const useFetchAllAvailableProviders = () => {
  const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
  const movieProviderAPI = `https://api.themoviedb.org/3/watch/providers/movie?api_key=${movie_api_key}&language=en-US&watch_region=us`;
  const tvProviderAPI = `https://api.themoviedb.org/3/watch/providers/tv?api_key=${movie_api_key}&language=en-US&watch_region=us`;

  const [isLoading, setStatus] = useState<boolean>(true);
  const [moviesContent, setMovies] = useState<ServiceProvider[]>([]);
  const [tvContent, setTvShows] = useState<ServiceProvider[]>([]);
  const [allProviders, setAllProviders] = useState<ServiceProvider[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([fetch(movieProviderAPI), fetch(tvProviderAPI)])
        .then((results) => Promise.all(results.map((r) => r.json())))
        .then(async ([movieProviderResultsJson, tvProviderResultsJson]) => {
          setMovies(movieProviderResultsJson.results);
          setTvShows(tvProviderResultsJson.results);
          const allProvidersSet = new Set([...movieProviderResultsJson.results, tvProviderResultsJson.results]);
          const allProvidersArr = Array.from(allProvidersSet);
          setAllProviders(allProvidersArr);
          setStatus(false);
        });
    };
    fetchData();
  }, []);

  return { moviesContent, tvContent, allProviders, isLoading };
};

export default useFetchAllAvailableProviders;
