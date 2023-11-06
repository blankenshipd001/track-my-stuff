
"use client"

import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";

import Header from "@/lib/movies/header";
import SearchBox from "@/lib/shared/search-box";
import Results from "@/lib/movies/results";
import Footer from "@/lib/shared/footer";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
const omdb_api_key = process.env.NEXT_PUBLIC_OMDB_API_KEY;

const MovieSearch = () => {
  const [movies, setMovies] = React.useState([]);
  const [searchValue, setSearchString] = React.useState("");

  /**
   * //TODO: Can we pull this out?
   * Get all movies from the omdb api that match the search string provided
   */
  const findMovieByTitle = async () => {
    const omdbUrl = `https://www.omdbapi.com/?s=${searchValue}&apikey=${omdb_api_key}`;
    const response = await fetch(omdbUrl);
    const responseJson = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newItems: any = [];

    const results: [] = await responseJson.Search;
    console.log(results);

    if (results !== undefined && results.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results.map(async (movie: any) => {
        if (movie.imdbID !== null) { // we have a movie so get the details and where it's streaming
          const movieDBUrl = `https://api.themoviedb.org/3/find/${movie.imdbID}?api_key=${movie_api_key}&external_source=imdb_id`;
          const streamingProviderUrl = `https://api.themoviedb.org/3/movie/${movie.imdbID}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`;

          Promise.all([
            fetch(movieDBUrl),
            fetch(streamingProviderUrl)
          ]).then(async ([movieResp, providersResp]) => {
            const moviesRes = await movieResp.json();
            const providers = await providersResp.json();

            console.log(moviesRes);
            console.log(providers);
            if (moviesRes.movie_results.length > 0) {
              const newMovie = {
                ...moviesRes.movie_results[0],
                ...movie,
                // For now we only care about US but we could expand
                providers: providers.results.US
              };
              newItems.push(newMovie);
            }
          }).catch((err) => {
            console.log("error", err);
          });
        }
      });

      console.log("movies", newItems);
      setMovies(newItems);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addToWatchList = async (movie: any) => {
    // Delete the id from the movies database so we can use the documents ID that's set by firebase
    delete movie.id;

    // TODO do we need the docRef response
    //const docRef = 
    await addDoc(collection(db, "movies"), {
      ...movie,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newWatchList: any = [...movies, movie];
    setMovies(newWatchList);
  };

  //TODO Fix this search because we shouldn't care
  React.useEffect(() => {
    findMovieByTitle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <>
      <Header />
      <SearchBox searchString={searchValue} setSearchValue={setSearchString} />
      <Results movies={movies} bookmarkClicked={addToWatchList} />
      <Footer />
    </>
  );
};


export default MovieSearch;