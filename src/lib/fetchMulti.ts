import { Media } from "@/data-models/media.interface";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

export const fetchByTitle = async (searchValue: string) => {
  const getMutliUrl = `https://api.themoviedb.org/3/search/multi?api_key=${movie_api_key}&query=${searchValue}&include_adult=false&language=en-US&region=us`;
  
  const response = await fetch(getMutliUrl);
  const multiResponse = await response.json();

//   const moviesResult: Media[] = await Promise.all(
//     movieResponseJson.results.map(async (movie: Media) => {
//       const newMovie = {
//         ...movie,
//         type: 'movie',
//         movieId: movie.id
//       };
//       return newMovie;
//     })
//   );

//   const tvResult: Media[] = await Promise.all(
//     tvResponseJson.results.map(async (tv: Media) => {
//       const newShow = {
//         ...tv,
//         type: 'tv',
//         movieId: tv.id,
//       };
//       return newShow;
//     })
//   );

  return {
    multiResponse: multiResponse,
  }
}