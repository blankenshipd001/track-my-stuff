"use client";

import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/api/firestore";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { User as FirebaseUser } from "firebase/auth";

import TabPanel from "@/lib/shared/tab-panel";
import SearchBox from "@/lib/shared/search-box";
import Results from "@/lib/movies/results";
import Footer from "@/lib/shared/footer";
import { Paper } from "@mui/material";
import { styled } from "styled-components";
import Header from "@/lib/shared/header";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
const omdb_api_key = process.env.NEXT_PUBLIC_OMDB_API_KEY;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const MovieSearch = () => {
  const [movies, setMovies] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [user, setUser] = useState<FirebaseUser | null>(null)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        setUser(user);
      } else {
        // No user is signed in.
        setUser(null)
      }
    });
  }, [])
  const Background = styled(Box)`
    background: black;
  `
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
        const movies = await Promise.all(
          movieResponseJson.results.map((movie: any) => {
            return fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`
            )
              .then((res) => res.json())
              .then((providers) => {
                // console.log("providers", providers);
                const newMovie = {
                  ...movie,
                  // For now we only care about US but we could expand
                  providers: providers.results.US,
                };

                return newMovie;
              });
          })
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tv = await Promise.all(
          tvResponseJson.results.map((tv: any) => {
            return fetch(
              `https://api.themoviedb.org/3/tv/${tv.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`
            )
              .then((res) => res.json())
              .then((providers) => {
                // console.log("providers", providers);
                const newShow = {
                  ...tv,
                  // For now we only care about US but we could expand
                  providers: providers.results.US,
                };

                return newShow;
              });
          })
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const everything: any = [...movies, ...tv];
        return setMovies(everything);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addToWatchList = async (movie: any) => {
    // Delete the id from the movies database so we can use the documents ID that's set by firebase
    delete movie.id;

    const path = "users/" + user?.uid + "/movies";

    // TODO do we need the docRef response
    //const docRef =
    const response= await addDoc(collection(db, path), {
      ...movie,
    });

    console.log(response, 'response')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newWatchList: any = [...movies, movie];
    setMovies(newWatchList);
  };

  // //TODO Fix this search because we shouldn't care
  // React.useEffect(() => {
  //   findMovieByTitle();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchValue]);

  return (
      <Background
        component="section"
        flexDirection={"column"}
        sx={{
          flexGrow: 1,
          width: "100%",
          height: "100vh",
          display: "flex",
        }}
      >
        <Header />
        <Title>
          <h1>
          What do you want to watch?
          </h1>
          <p>
          Search a title and see where it’s available to buy, rent, or stream.
          </p>
        </Title>
        <SearchBox
          searchForMovie={findMovieByTitle}
        />
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="All/Popular" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Movies" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="TV" id="tab-2" aria-controls="tabpanel-2" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Results movies={movies} bookmarkClicked={addToWatchList} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Results movies={movies} bookmarkClicked={addToWatchList} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Results movies={movies} bookmarkClicked={addToWatchList} />
        </TabPanel>
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
      </Background>
  );
};

export default MovieSearch;
