import { useState, useEffect } from "react";
import { Movie } from "../@interfaces/movie.interface";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

//TODO make this more like the useFindByTitle hook so it can be called whenever we want instead of just once
export const useLoadPopular = () => {
  const [popularMedia, setPopularMedia] = useState<Movie[]>([]);

  const popular_url = `https://api.themoviedb.org/3/movie/popular?api_key=${movie_api_key}&include_video=false`;

  function fetchPopular() {
    fetch(popular_url)
      .then(async (res) => {
        const json = await res.json();
        return json;
      })
      .then(async (popularRes) => {
        const trendingResults: Movie[] = await Promise.all(
          popularRes.results.map((item: { id: unknown }) => {
            return fetch(`https://api.themoviedb.org/3/movie/${item.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`)
              .then((res) => res.json())
              .then((providers) => {
                const newMovie = {
                  ...item,
                  movieId: item.id,
                  providers: providers.results.US ?? [],
                };

                return newMovie;
              });
          })
        );

        setPopularMedia(trendingResults);
      });
  }

  useEffect(() => {
    fetchPopular();
  }, []);

  return { popularMedia, fetchPopular};
};
