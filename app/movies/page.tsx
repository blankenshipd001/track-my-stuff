"use client";

import { useState, useEffect } from "react";

import Results from "@/lib/movies/results";
import Footer from "@/lib/shared/footer";
import { getMovies, requestRemoveFromWatchList } from "@/lib/api/moviesApi";
import { auth } from "@/lib/api/firestore";
import { User as FirebaseUser } from "firebase/auth";
import Header from "@/lib/shared/header";

const MoviesApp = () => {
  const [watchList, setWatchList] = useState([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  /**
   * Loads movies when the page loads
   */
  useEffect(() => {

    auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        setUser(user);
        getMovies(user?.uid).then(data => {
          setWatchList(data);
        })
        .catch((err) => {
          console.error("Error making async call: " + err);
        });
      } else {
        // No user is signed in.
        console.log('no one home')
      }
    });    
  }, []);

  /**
   * Remove this movie from the watch list
   * @param {*} movie
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const removeFromWatchList = async (movie: any) => {
    requestRemoveFromWatchList(user?.uid, movie).then(() => {
      
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
