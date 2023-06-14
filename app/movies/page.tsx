"use client"

import { useState, useEffect } from "react";

import { db } from "@/lib/firestore";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";

import Header from "@/components/header";
import Results from "@/components/results";
import Footer from "@/components/footer";

const MoviesApp = () => {
  const [watchList, setWatchList] = useState([]);

  /**
   * Get all movies on my watch list
   * @returns list of movies
   */
  const getMovies = async () => {
    const moviesSnapshot = await getDocs(collection(db, "movies"));
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
  const removeFromWatchList = async (movie: any) => {
    const res = await deleteDoc(doc(db, "movies", `${movie.id}`))
      .then(() => {
        console.log(`The movie, ${movie.title}, removed`);
        const newWatchList = watchList.filter(
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
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-grow">
        {/* <Head>
          <title>Code Monkey Movie Watch list</title>
          <meta name="Application created to display a list of movies that are on my watch list" content="Created by code monkey" />
          <link rel="icon" href="/favicon.ico" />
        </Head> */}
        <Results movies={watchList} bookmarkClicked={removeFromWatchList} />
      </div>
      <Footer />
    </div>
  );
};

export default MoviesApp;
