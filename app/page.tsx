/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/api/firestore";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { User as FirebaseUser } from "firebase/auth";

import TabPanel from "@/lib/shared/tab-panel";
import Snackbar from '@mui/material/Snackbar';
import SearchBox from "@/lib/shared/search-box";
import Results from "@/lib/movies/results";
import Footer from "@/lib/shared/footer";
import { Paper } from "@mui/material";
import Header from "@/lib/shared/header";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
// const omdb_api_key = process.env.NEXT_PUBLIC_OMDB_API_KEY;


const MovieSearch = () => {
  const [everything, setEverything] = useState<any>([]);
  const [value, setValue] = useState(0);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [movies, setMovies] = useState<any>([]);
  const [tvShows, setTvShows] = useState<any>([]);
  const [tabOneTitle, setTabOneTitle] = useState<string>("Trending");

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
  }, []);
  
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
            return fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`
            )
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

        setMovies(moviesResult);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tvResult: any[] = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tvResponseJson.results.map((tv: any) => {
            return fetch(
              `https://api.themoviedb.org/3/tv/${tv.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`
            )
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

        setTvShows(tvResult);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const everything: any = [...moviesResult, ...tvResult];
        setTabOneTitle("All");
        return setEverything(everything);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addToWatchList = async (movie: any) => {
    // Delete the id from the movies database so we can use the documents ID that's set by firebase
    delete movie.id;

    const path = "users/" + user?.uid + "/movies";
    // TODO do we need the docRef response
    //const docRef =
    await addDoc(collection(db, path), {
      ...movie,
    }).then(() => {
      setAlertMessage("Successfully added to your watch list")
      setSuccessOpen(true);
    }).catch((err: any) => {
      //TODO handle failure due to login and pop login
      setAlertMessage(`Failure adding to your watch list: ${err}`);
      setErrorOpen(true);
    });
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || reason === 'escapeKeyDown') {
      setErrorOpen(false);
      setSuccessOpen(false);
    }

    setErrorOpen(false);
    setSuccessOpen(false);
  };

  const loadPopular = async () => {
    const popular_url = `https://api.themoviedb.org/3/movie/popular?api_key=${movie_api_key}&include_video=false`;

    return fetch(popular_url)
      .then(async (res) => {
        const json = await res.json();
        return json;
      })
      .then(async (popularRes) => {
        const trendingResults: any[] = await Promise.all(
          popularRes.results.slice(0,3).map((item: { id: unknown; }) => {
            return fetch(
              `https://api.themoviedb.org/3/movie/${item.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`
            )
            .then((res) => res.json())
            .then((providers) => {
              const newMovie = {
                ...item,
                movieId: item.id,
                providers: providers.results.US ?? [],
              };
    
              return newMovie;
            });
          }
        ));
        
        return setEverything(trendingResults);
      });
  };

  React.useEffect(() => {
    loadPopular();
  }, []);

  return (
      <Box
        component="section"
        flexDirection={"column"}
        bgcolor="#1A1A1A"
        sx={{
          flexGrow: 1,
          width: "100%",
          display: "flex",
          paddingBottom: "3rem"
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
            marginTop: "4rem"
          }}
        >
          <h1 className="text-white md:text-3xl lg:text-4xl">
          Your watchlists and recommendations—together.
          </h1>
          <p className="text-white">
          Search a title and see where it’s available to buy, rent, or stream.
          </p>
        </Box>
        <SearchBox
          searchForMovie={findMovieByTitle}
        />
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label={tabOneTitle} id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Movies" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="TV" id="tab-2" aria-controls="tabpanel-2" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Results movies={everything} bookmarkClicked={addToWatchList} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Results movies={movies} bookmarkClicked={addToWatchList} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Results movies={tvShows} bookmarkClicked={addToWatchList} />
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
        <Snackbar open={successOpen} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
        <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default MovieSearch;
