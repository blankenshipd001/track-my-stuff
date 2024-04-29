"use client";
import React, { useState, useEffect } from "react";

import Footer from "@/lib/shared/footer";
import { getContent, requestRemoveFromWatchList } from "@/lib/api/contentApi";
import { auth } from "@/lib/api/firestore";
import { User as FirebaseUser } from "firebase/auth";
import Header from "@/lib/shared/header";
import { useRouter } from "next/navigation";
import { Movie } from "@/lib/@interfaces/movie.interface";

import Box from "@mui/material/Box";
import SearchBox from "@/lib/shared/search-box";
import { Paper } from "@mui/material";
import MovieGrid from "@/lib/movies/movie-grid";
// import { useAuthContext } from "@/lib/context/auth-provider";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

const MoviesApp = () => {
  const [watchList, setWatchList] = useState<Movie[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  // TODO switch to using this
  // const { currentUser } = useAuthContext();
  const router = useRouter();

  /**
   * Loads movies when the page loads
   */
  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        setUser(user);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getContent(user?.uid)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((data: any) => {
            console.log("setting watch list");
            console.log(data);
            setWatchList(data);
          })
          .catch((err) => {
            console.error("Error making async call: " + err);
            router.push("/");
          })
      } else {
        // No user is signed in.
        console.log("no one home");
        router.push("/");
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
        (item: any) => item.id !== movie.id
      );
      setWatchList(newWatchList);
    });
  };

  /**
   * //TODO: Can we pull this out?
   * Get all movies from the omdb api that match the search string provided
   */
  const findMovieByTitle = async (searchValue: string) => {
    const getMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${movie_api_key}&query=${searchValue}&include_adult=false&language=en-US&append_to_response=providers`;
    const getTvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${movie_api_key}&query=${searchValue}&include_adult=false&language=en-US&append_to_response=providers`;

    Promise.all([fetch(getMovieUrl), fetch(getTvUrl)])
      .then((results) => Promise.all(results.map((r) => r.json())))
      .then(async ([movieResponseJson, tvResponseJson]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const moviesResult: any[] = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          movieResponseJson.results.map((movie: any) => {
            return fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`)
              .then((res) => res.json())
              .then((providers) => {
                // console.log("providers", providers);
                const newMovie = {
                  ...movie,
                  movieId: movie.id,
                  // For now we only care about US but we could expand
                  providers: providers.results.US ?? [],
                };

                return newMovie;
              });
          })
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tvResult: any[] = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tvResponseJson.results.map((tv: any) => {
            return fetch(`https://api.themoviedb.org/3/tv/${tv.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`)
              .then((res) => res.json())
              .then((providers) => {
                // console.log("providers", providers);
                const newShow = {
                  ...tv,
                  movieId: tv.id,
                  // For now we only care about US but we could expand
                  providers: providers.results.US ?? [],
                };

                return newShow;
              });
          })
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const everything: any = [...moviesResult, ...tvResult];

        return setWatchList(everything);
      });
  };

  return (
    <Box
      component="section"
      flexDirection={"column"}
      bgcolor="#1A1A1A"
      sx={{
        flexGrow: 1,
        width: "100%",
        display: "flex",
        paddingBottom: "3rem",
      }}
    >
      <Header />
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "4rem",
        }}
      >
        <h1 className="text-white md:text-3xl lg:text-4xl">Your watchlists and recommendations—together.</h1>
        <p className="text-white">Search a title and see where it’s available to buy, rent, or stream.</p>
      </Box>
      <SearchBox searchForMovie={findMovieByTitle} />
        <MovieGrid movies={watchList} removeClicked={removeFromWatchList} />
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          bgcolor: "transparent",
        }}
      >
        <Footer />
      </Paper>
    </Box>
  );
};

export default MoviesApp;
