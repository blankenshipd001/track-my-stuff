"use client";

import { useState, useEffect } from "react";

import { db } from "@/lib/firestore";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";

import Header from "@/lib/movies/header";
import Results from "@/lib/movies/results";
import Footer from "@/lib/shared/footer";

const MoviesApp = () => {
  const [watchList, setWatchList] = useState([]);

  /**
   * Get all movies on my watch list
   * @returns list of movies
   */
  const getMovies = async () => {
    const moviesSnapshot = await getDocs(collection(db, "movies"));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const moviesList = moviesSnapshot.docs.map((doc: any) => {
      return {
        id: doc.id,
        docId: doc.documentId,
        ...doc.data(),
      };
    });
    return moviesList;
  };

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

  // const removeFromWatchList = (movie) => {
  //   const newWatchList = watchList.filter(
  //     (item) => item.imdbID !== movie.imdbID
  //   );
  //   setWatchList(newWatchList);
  // };

  /**
   * Remove this movie from the watch list
   * @param {*} movie
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removeFromWatchList = async (movie: any) => {
    await deleteDoc(doc(db, "movies", `${movie.id}`))
      .then(() => {
        console.log(`The movie, ${movie.title}, removed`);
        const newWatchList = watchList.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: any) => item.imdbID !== movie.imdbID
        );
        setWatchList(newWatchList);
      })
      .catch((error) => {
        console.error(
          `There was an issue removing the movie: ${movie.title} from the list`
        );
        console.log(error);
      });
  };

  return (
    <>
      {/* <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col h-screen"> */}
      <Header />
      <main className="lg:flex min-h-screen flex-col items-center justify-between p-6 font-mono text-sm ">
        <div className="flex-grow">
          {/* <Head>
          <title>Code Monkey Movie Watch list</title>
          <meta name="Application created to display a list of movies that are on my watch list" content="Created by code monkey" />
          <link rel="icon" href="/favicon.ico" />
        </Head> */}
          <Results movies={watchList} bookmarkClicked={removeFromWatchList} />
        </div>
      </main>
      <Footer />
      {/* </div>
      </div> */}
    </>
  );
};

export default MoviesApp;
