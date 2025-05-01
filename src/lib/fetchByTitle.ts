import { Movie } from "@/data-models/movie.interface";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

export const fetchByTitle = async (searchValue: string) => {
  const getMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${movie_api_key}&query=${searchValue}&include_adult=false&language=en-US&region=us&append_to_response=providers`;
  const getTvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${movie_api_key}&query=${searchValue}&include_adult=false&language=en-US&region=us&append_to_response=providers`;

  const [movieResponse, tvResponse] = await Promise.all([fetch(getMovieUrl), fetch(getTvUrl)]);
  const [movieResponseJson, tvResponseJson] = await Promise.all([movieResponse.json(), tvResponse.json()]);

  const moviesResult: Movie[] = await Promise.all(
    movieResponseJson.results.map(async (movie: Movie) => {
      const newMovie = {
        ...movie,
        movieId: movie.id
      };
      return newMovie;
    })
  );

  const tvResult: Movie[] = await Promise.all(
    tvResponseJson.results.map(async (tv: Movie) => {
      const newShow = {
        ...tv,
        movieId: tv.id,
      };
      return newShow;
    })
  );

  return {
    moviesContent: moviesResult,
    tvContent: tvResult,
    allContent: [...moviesResult, ...tvResult],
  }
}