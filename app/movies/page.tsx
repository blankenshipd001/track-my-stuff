"use client";

import { useState, useEffect } from "react";

import Results from "@/lib/movies/results";
import Footer from "@/lib/shared/footer";
import { getMovies, requestRemoveFromWatchList } from "@/lib/api/moviesApi";
import { auth } from "@/lib/api/firestore";
import { User as FirebaseUser } from "firebase/auth";
import Header from "@/lib/shared/header";
import { useRouter } from "next/navigation";

const MoviesApp = () => {
  const [watchList, setWatchList] = useState([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const router = useRouter()
 
    /**
   * Loads movies when the page loads
   */
  useEffect(() => {

    // auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        setUser(user);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getMovies(user?.uid).then((data: any) => {
          return setWatchList(data);
        })
        .catch((err) => {
          console.error("Error making async call: " + err);
          router.push("/")
        });
      } else {
        // No user is signed in.
        console.log('no one home')
        router.push("/")
      }
    // });    
  }, [user]);

  /**
   * Remove this movie from the watch list
   * @param {*} movie
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removeFromWatchList = async (movie: any) => {
    requestRemoveFromWatchList(user?.uid, movie).then(() => {
      
      const newWatchList = watchList.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => item.id !== movie.id
      );
      setWatchList(newWatchList);
      })
    };

  return (
    <>
      <Header />
      <main className="lg:flex min-h-screen flex-col items-center justify-between p-6 font-mono text-sm ">
        <div className="flex-grow">
          {watchList.length > 0  ?? <Results movies={watchList} bookmarkClicked={removeFromWatchList} />}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MoviesApp;
