"use client";
import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "@/lib/api/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";

import { db } from "@/lib/api/firestore";
import { getContent, requestRemoveFromWatchList } from "@/lib/api/contentApi";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, Container } from "@mui/material";

// import { useAuthContext } from "@/app/context/auth-provider";
import { useLoadPopular } from "@/lib/hooks/useLoadPopular";
import { useFindByTitle } from "@/lib/hooks/useFindByTitle";

import { Movie } from "../@interfaces/movie.interface";

import SearchBox from "@/lib/shared/search-box";
import MovieGrid from "@/lib/movies/movie-grid";
import TabPanel from "@/lib/shared/tab-panel";
import useNotificationBar from "../hooks/useNotificationBar";
import { UserAuth } from "@/app/context/auth-provider";


const MovieContent = () => {
  const router = useRouter();
  const { currentUser } = UserAuth();
  // const { currentUser } = useAuthContext();

  const { popularMedia } = useLoadPopular();

  const [tabNumber, setTabNumber] = useState(0);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [everything, setEverything] = useState<Movie[]>([]);
  const [watchList, setWatchList] = useState<Movie[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const [tabOneTitle, setTabOneTitle] = useState<string>("Trending");
  const { moviesContent, tvContent, allContent, fetchContent } = useFindByTitle();
  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();

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
   * Handle changing tabs
   * @param event click event
   * @param newTab the new tab number to swap to
   */
  const handleTabChange = (event: React.SyntheticEvent, newTab: number) => {
    setTabNumber(newTab);
  };

  const addToWatchList = async (movie: Movie) => {
    // Send them to login!
    if (currentUser == null) {
      router.push("/login");
    }

    // Delete the id from the movies database so we can use the documents ID that's set by firebase
    delete movie.id;

    const path = "users/" + currentUser?.uid + "/movies";
    // TODO do we need the docRef response
    //const docRef =
    await addDoc(collection(db, path), {
      ...movie,
    })
      .then(() => {
        enqueueNotificationBar("Successfully added to your watch list", "success");
      })
      .catch((err: unknown) => {
        enqueueNotificationBar(`Failure adding to your watch list: ${err}`, "error");
      });
  };

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

  React.useEffect(() => {
    setMovies(moviesContent);
    setTvShows(tvContent);
    setEverything(allContent);

    if (allContent.length > 0) {
      setTabOneTitle("All");
    } else {
      setTabOneTitle("Trending");
    }
  }, [allContent]);

  React.useEffect(() => {
    setEverything(popularMedia);
  }, [popularMedia]);

  return (
    <Container>
      <SearchBox searchForMovie={fetchContent} />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabNumber} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label={tabOneTitle} id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Movies" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="TV" id="tab-2" aria-controls="tabpanel-2" />
          {currentUser !== null ? <Tab label="Watchlist" id="tab-3" aria-controls="tabpanel-4" /> : null}
        </Tabs>
      </Box>

      {/* Always show */}
      <TabPanel value={tabNumber} index={0}>
        <MovieGrid movies={everything} addClicked={addToWatchList} />
      </TabPanel>
      <TabPanel value={tabNumber} index={1}>
        <MovieGrid movies={movies} addClicked={addToWatchList} />
      </TabPanel>
      <TabPanel value={tabNumber} index={2}>
        <MovieGrid movies={tvShows} addClicked={addToWatchList} />
      </TabPanel>

      {/* Only show if logged in */}
      <TabPanel value={tabNumber} index={3}>
        <MovieGrid movies={watchList} removeClicked={removeFromWatchList} />
      </TabPanel>
      
      {NotificationBarComponent}

    </Container>
  );
};

export default MovieContent;
