
"use client"

import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";

import Header from "@/components/header";
import MovieSearchBox from "@/components/search-box";
import Results from "@/components/results";
import Footer from "@/components/footer";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
const omdb_api_key = process.env.NEXT_PUBLIC_OMDB_API_KEY;

const MovieSearch = () => {
  const [movies, setMovies] = React.useState([]);
  const [searchValue, setSearchString] = React.useState("");

  /**
   * //TODO: Can we pull this out?
   * Get all movies from the omdb api that match the search string provided
   * @param {string} title
   */
  const findMovieByTitle = async (title: string) => {
    const omdbUrl = `https://www.omdbapi.com/?s=${searchValue}&apikey=${omdb_api_key}`;
    const response = await fetch(omdbUrl);
    const responseJson = await response.json();

    const newItems: any = [];

    const results = await responseJson.Search;
    
    if (results) {
      results.map(async (movie: any) => {
        if (movie.imdbID !== null) {
          const movieDBUrl = `https://api.themoviedb.org/3/find/${movie.imdbID}?api_key=${movie_api_key}&external_source=imdb_id`;
          await fetch(movieDBUrl)
            .then(async (res) => {
              if (res) {
                const parsedRes = await res.json();
                if (parsedRes.movie_results.length > 0) {
                  const newMovie = {
                    ...parsedRes.movie_results[0],
                    ...movie,
                  };
                  newItems.push(newMovie);
                }
              }
            })
            .catch((err) => {
              console.log("error");
            });
        }
      });

      console.log("movies", newItems);
      setMovies(newItems);
    }
  };

  const addToWatchList = async (movie: any) => {
    // Delete the id from the movies database so we can use the documents ID that's set by firebase
    delete movie.id;

    const docRef = await addDoc(collection(db, "movies"), {
      ...movie,
    });

    const newWatchList: any = [...movies, movie];
    setMovies(newWatchList);
  };

  React.useEffect(() => {
    findMovieByTitle(searchValue);
  }, [searchValue]);

  return (
    <>
      <Header />
      <MovieSearchBox searchString={searchValue} setSearchValue={setSearchString} />
      <Results movies={movies} bookmarkClicked={addToWatchList} />
      <Footer />
    </>
  );
};


export default MovieSearch;