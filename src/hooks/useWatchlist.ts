import { db } from "@/config/firebase";
import { Movie } from "@/data-models/movie.interface";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

// const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

//TODO make this more like the useFindByTitle hook so it can be called whenever we want instead of just once
export const useWatchList = (uid: string) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

//   const popular_url = `https://api.themoviedb.org/3/movie/popular?api_key=${movie_api_key}&include_video=false`;

  function fetchWatchlist() {
    // fetch(popular_url)
    //   .then(async (res) => {
    //     const json = await res.json();
    //     return json;
    //   })
    //   .then(async (popularRes) => {
    //     const trendingResults: Movie[] = await Promise.all(
    //       popularRes.results.map((item: { id: unknown }) => {
    //         return fetch(`https://api.themoviedb.org/3/movie/${item.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`)
    //           .then((res) => res.json())
    //           .then((providers) => {
    //             console.log('popular providers: ', providers)
    //             const newMovie = {
    //               ...item,
    //               movieId: item.id,
    //               providers: providers.results.US ?? [],
    //             };

    //             return newMovie;
    //           });
    //       })
    //     );

    //     setWatchlist(trendingResults);
    //   });



      const path = "users/" + uid + "/movies";
      getDocs(collection(db, path)).then((movieData) => {
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const moviesList: Movie[] = movieData.docs.map((doc: any) => {
        return {
          id: doc.id,
          docId: doc.documentId,
          ...doc.data(),
        };
      });

      setWatchlist(moviesList);
    });

  }

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return { watchlist, fetchWatchlist};
};
