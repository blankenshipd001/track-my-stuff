/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {  useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/api/firestore";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import TabPanel from "@/lib/shared/tab-panel";
import Snackbar from '@mui/material/Snackbar';
import SearchBox from "@/lib/shared/search-box";
import Results from "@/lib/movies/results";
import Footer from "@/lib/shared/footer";
import { Paper } from "@mui/material";
import Header from "@/lib/shared/header";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useAuthContext } from "@/app/context/auth-provider";
import { useLoadPopular } from "@/lib/hooks/useLoadPopular";
import { useFindByTitle } from "@/lib/hooks/useFindByTitle";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

const MovieSearch = () => {  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {popularMedia, fetchPopular} = useLoadPopular();
  const {moviesContent, tvContent, allContent, fetchContent} = useFindByTitle();

  const { currentUser  } = useAuthContext()
  const [everything, setEverything] = useState<any>([]);
  const [value, setValue] = useState(0);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [movies, setMovies] = useState<any>([]);
  const [tvShows, setTvShows] = useState<any>([]);
  const [tabOneTitle, setTabOneTitle] = useState<string>("Trending");
  const router = useRouter()

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  
  const addToWatchList = async (movie: any) => {
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
          searchForMovie={fetchContent}
        />
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label={tabOneTitle} id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Movies" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="TV" id="tab-2" aria-controls="tabpanel-2" />
            {currentUser !== null ? <Tab label="Watchlist" id="tab-3" aria-controls="tabpanel-4" /> : null}
          </Tabs>
        </Box>

        {/* Always show */}
        <TabPanel value={value} index={0}>
          <Results movies={everything} bookmarkClicked={addToWatchList} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Results movies={movies} bookmarkClicked={addToWatchList} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Results movies={tvShows} bookmarkClicked={addToWatchList} />
        </TabPanel>
        
        {/* Only show if logged in */}
        <TabPanel value={value} index={3}>
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
