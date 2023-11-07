"use client";

import { useState, useEffect } from "react";

import Header from "@/lib/movies/header";
import Results from "@/lib/movies/results";
import Footer from "@/lib/shared/footer";
import { getMovies, requestRemoveFromWatchList } from "@/lib/api/moviesApi";

const MoviesApp = () => {
  const [watchList, setWatchList] = useState([]);
  /**
   * Loads movies when the page loads
   */
  useEffect(() => {
    getMovies()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        setWatchList(data);
      })
      .catch((err) => {
        console.error("Error making async call: " + err);
      });
  }, []);

  /**
   * Remove this movie from the watch list
   * @param {*} movie
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const removeFromWatchList = async (movie: any) => {
    requestRemoveFromWatchList(movie).then(() => {
      
      const newWatchList = watchList.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => item.imdbID !== movie.imdbID
      );
      setWatchList(newWatchList);
      })
    };

  return (
    <>
      <Header />
      <main className="lg:flex min-h-screen flex-col items-center justify-between p-6 font-mono text-sm ">
        <div className="flex-grow">
          <Results movies={watchList} bookmarkClicked={removeFromWatchList} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MoviesApp;
