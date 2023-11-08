"use client";

import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/api/firestore";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import TabPanel from "@/lib/shared/tab-panel";
import Header from "@/lib/movies/header";
import SearchBox from "@/lib/shared/search-box";
import Results from "@/lib/movies/results";
import Footer from "@/lib/shared/footer";
import { Paper } from "@mui/material";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
const omdb_api_key = process.env.NEXT_PUBLIC_OMDB_API_KEY;

const MovieSearch = () => {
  const [movies, setMovies] = React.useState([]);
  const [searchValue, setSearchString] = React.useState("");
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  /**
   * //TODO: Can we pull this out?
   * Get all movies from the omdb api that match the search string provided
   */
  const findMovieByTitle = async () => {
    const getMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${movie_api_key}&query=${searchValue}&include_adult=false&language=en-US&append_to_response=providers`;
    const getTvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${movie_api_key}&query=${searchValue}&include_adult=false&language=en-US&append_to_response=providers`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newItems: any = [];

    Promise.all([fetch(getMovieUrl), fetch(getTvUrl)]).then(
      async ([movieResponse, tvResponse]) => {
        const movieResponseJson = await movieResponse.json();
        const tvResponseJson = await tvResponse.json();

        console.log("movies", movieResponseJson.results);
        console.log("tv", tvResponseJson.results);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        movieResponseJson.results.map((movie: any) => {
          const newMovie = {
            ...movie,
            // For now we only care about US but we could expand
            // providers: providers.results.US,
          };
          newItems.push(newMovie);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tvResponseJson.results.map((tv: any) => {
          const newMovie = {
            ...tv,
            // For now we only care about US but we could expand
            // providers: providers.results.US,
          };
          newItems.push(newMovie);
        });
        setMovies(newItems);
      }
    );
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addToWatchList = async (movie: any) => {
    // Delete the id from the movies database so we can use the documents ID that's set by firebase
    delete movie.id;

    // TODO do we need the docRef response
    //const docRef =
    await addDoc(collection(db, "movies"), {
      ...movie,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newWatchList: any = [...movies, movie];
    setMovies(newWatchList);
  };

  //TODO Fix this search because we shouldn't care
  React.useEffect(() => {
    findMovieByTitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <>
      <Box
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
        <SearchBox
          searchString={searchValue}
          setSearchValue={setSearchString}
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
      </Box>
    </>
  );
};

export default MovieSearch;
