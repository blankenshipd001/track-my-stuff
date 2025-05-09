"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, useTheme, useMediaQuery } from "@mui/material";
import { SearchBox } from "@components/search";
import { getContent } from "@/utils/api/contentApi";
import { fetchByTitle } from "@/lib/fetchByTitle";
import useNotificationBar from "@/components/notifications/useNotificationBar";
import { Movie } from "@/data-models/movie.interface";
import TabsWrapper from "../panels/tab-wrapper";

interface MovieContentProps {
  popularMedia: Movie[];
  user?: { uid: string; email?: string } | null;
}

export const MovieContent = ({ popularMedia, user }: MovieContentProps) => {
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [everything, setEverything] = useState<Movie[]>([]);
  const [watchList, setWatchList] = useState<Movie[]>([]);

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

  const fetchContent = async (searchValue: string) => {
    if (!searchValue) {
      setMovies([]);
      setTvShows([]);
      setEverything([]);
      return;
    }

    try {
      const { moviesContent, tvContent, allContent } = await fetchByTitle(searchValue);
      setMovies(moviesContent);
      setTvShows(tvContent);
      setEverything(allContent);
    } catch (err) {
      enqueueNotificationBar(`Error: ${err}`, "error");
    }
  };

  useEffect(() => {
    setEverything(popularMedia);
  }, [popularMedia]);

  return (
    <Container maxWidth="lg" sx={{ py: isClient && isMobile ? 2 : 4 }}>
      <Box sx={{ mb: 2 }}>
        <SearchBox searchForMovie={fetchContent} />
      </Box>
      <TabsWrapper user={user} watchList={watchList} allContent={everything} movies={movies} tvShows={tvShows} />

      {NotificationBarComponent}
    </Container>
  );
};

export default MovieContent;
