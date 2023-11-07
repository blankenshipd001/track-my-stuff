
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

    const results = await responseJson.Search;
    
    if (results?.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results.map(async (movie: any) => {
        if (movie.imdbID !== null) {
          const movieDBUrl = `https://api.themoviedb.org/3/find/${movie.imdbID}?api_key=${movie_api_key}&external_source=imdb_id`;
          await fetch(movieDBUrl)
            .then(async (res) => {
              if (res !== undefined) {
                const parsedRes = await res.json();
                if (parsedRes?.movie_results.length > 0) {
                  const newMovie = {
                    ...parsedRes.movie_results[0],
                    ...movie,
                  };
                  newItems.push(newMovie);
                }
              }
            })
            .catch((err) => {
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