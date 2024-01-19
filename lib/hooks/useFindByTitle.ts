import { useState } from "react";
import { Movie } from "../@interfaces/movie.interface";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

/**
 * Get all movies from the omdb api that match the search string provided
 * 
 * This returns
 * 
 * moviesContent: Movie[]
 * tvContent: Movie[]
 * allContent: Movie[]
 * fetchContent: function(searchValue)
 */
export const useFindByTitle = () => {
  const [allContent, setAllContent] = useState<Movie[]>([]);
  const [moviesContent, setMovies] = useState<Movie[]>([]);
  const [tvContent, setTvShows] = useState<Movie[]>([]);

  const fetchContent = (searchValue: string) => {
    const getMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${movie_api_key}&query=${searchValue}&include_adult=false&language=en-US&append_to_response=providers`;
    const getTvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${movie_api_key}&query=${searchValue}&include_adult=false&language=en-US&append_to_response=providers`;

    Promise.all([fetch(getMovieUrl), fetch(getTvUrl)])
      .then((results) => Promise.all(results.map((r) => r.json())))
      .then(async ([movieResponseJson, tvResponseJson]) => {
        const moviesResult: Movie[] = await Promise.all(
          movieResponseJson.results.map((movie: Movie) => {
            return fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`)
              .then((res) => res.json())
              .then((providers) => {
                const newMovie = {
                  ...movie,
                  movieId: movie.id,
                  // For now we only care about US but we could expand
                  providers: providers.results.US ?? [],
                };

                return newMovie;
              });
          })
        );

        setMovies(moviesResult);

        const tvResult: Movie[] = await Promise.all(
          tvResponseJson.results.map((tv: Movie) => {
            return fetch(`https://api.themoviedb.org/3/tv/${tv.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`)
              .then((res) => res.json())
              .then((providers) => {
                const newShow = {
                  ...tv,
                  movieId: tv.id,
                  // For now we only care about US but we could expand
                  providers: providers.results.US ?? [],
                };

                return newShow;
              });
          })
        );

        setTvShows(tvResult);

        const everything: Movie[] = [...moviesResult, ...tvResult];

        setAllContent(everything);
      });
  };

  return { allContent, moviesContent, tvContent, fetchContent };
};
