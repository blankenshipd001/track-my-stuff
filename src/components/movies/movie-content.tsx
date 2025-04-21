"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  Tab,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { SearchBox } from "@components/search";
import {
  addToWatchList,
  getContent,
  requestRemoveFromWatchList,
} from "@/utils/api/contentApi";
import { useFindByTitle } from "@/hooks/useFindByTitle";
import useNotificationBar from "@/hooks/useNotificationBar";
import { Movie } from "@/data-models/movie.interface";
import { TabPanel } from "../panels";
import { MovieGrid } from "./movie-grid";

interface MovieContentProps {
  popularMedia: Movie[];
  user?: { uid: string; email?: string } | null;
}

export const MovieContent = ({ popularMedia, user }: MovieContentProps) => {
  const router = useRouter();

  const [tabNumber, setTabNumber] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [everything, setEverything] = useState<Movie[]>([]);
  const [watchList, setWatchList] = useState<Movie[]>([]);
  const [tabOneTitle, setTabOneTitle] = useState<string>("Trending");

  const { moviesContent, tvContent, allContent, fetchContent } = useFindByTitle();
  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    getContent(user.uid)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => setWatchList(data))
      .catch(() => router.push("/"));
  }, [user]);

  useEffect(() => {
    setMovies(moviesContent);
    setTvShows(tvContent);
    setEverything(allContent);
    setTabOneTitle(allContent.length > 0 ? "All" : "Trending");
  }, [allContent]);

  useEffect(() => {
    setEverything(popularMedia);
  }, [popularMedia]);

  const addToWatchListClickHandler = async (movie: Movie) => {
    if (!user) {
      enqueueNotificationBar("Please log in to save movies.", "info");
      return;
    }
    try {
      const docRef = await addToWatchList(user.uid, movie);
      if (docRef && typeof docRef !== "string") {
        enqueueNotificationBar("Added to your watch list!", "success");
        router.push(`/movies/${docRef.id}`);
      }
    } catch (err) {
      enqueueNotificationBar(`Error: ${err}`, "error");
    }
  };

  const removeFromWatchList = async (movie: Movie) => {
    if (!user) return;
    await requestRemoveFromWatchList(user.uid, movie);
    setWatchList((prev) => prev.filter((item) => item.id !== movie.id));
  };

  // --- Mobile-friendly tab selector ---
  const renderTabSelector = () => (
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <InputLabel id="tab-select-label">View</InputLabel>
      <Select
        labelId="tab-select-label"
        value={tabNumber}
        label="View"
        onChange={(e) => setTabNumber(Number(e.target.value))}
      >
        <MenuItem value={0}>{tabOneTitle}</MenuItem>
        <MenuItem value={1}>Movies</MenuItem>
        <MenuItem value={2}>TV</MenuItem>
        {user && <MenuItem value={3}>Watchlist</MenuItem>}
      </Select>
    </FormControl>
  );

  return (
    <Container maxWidth="lg" sx={{ py: isClient && isMobile ? 2 : 4 }}>
      <Box sx={{ mb: 2 }}>
        <SearchBox searchForMovie={fetchContent} />
      </Box>

      {isClient && isMobile ? (
        renderTabSelector()
      ) : (
        <Box sx={{ borderBottom: 1, borderColor: "divider", overflowX: "auto" }}>
          <Tabs
            value={tabNumber}
            onChange={(e, newTab) => setTabNumber(newTab)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="movie content tabs"
            sx={{ minHeight: 48 }}
          >
            <Tab label={tabOneTitle} sx={{ minWidth: 80 }} />
            <Tab label="Movies" sx={{ minWidth: 80 }} />
            <Tab label="TV" sx={{ minWidth: 80 }} />
            {user && <Tab label="Watchlist" sx={{ minWidth: 80 }} />}
          </Tabs>
        </Box>
      )}

      <TabPanel value={tabNumber} index={0}>
        <MovieGrid movies={everything} addClicked={addToWatchListClickHandler} />
      </TabPanel>
      <TabPanel value={tabNumber} index={1}>
        <MovieGrid movies={movies} addClicked={addToWatchListClickHandler} />
      </TabPanel>
      <TabPanel value={tabNumber} index={2}>
        <MovieGrid movies={tvShows} addClicked={addToWatchListClickHandler} />
      </TabPanel>
      {user && (
        <TabPanel value={tabNumber} index={3}>
          <MovieGrid movies={watchList} removeClicked={removeFromWatchList} />
        </TabPanel>
      )}

      {NotificationBarComponent}
    </Container>
  );
};
