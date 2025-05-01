"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { SearchBox } from "@components/search";
import {
  // addToWatchList,
  getContent,
  // requestRemoveFromWatchList,
} from "@/utils/api/contentApi";
import { fetchByTitle } from "@/lib/fetchByTitle";
import useNotificationBar from "@/hooks/useNotificationBar";
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

  // const addToWatchListClickHandler = async (movie: Movie) => {
  //   if (!user) {
  //     enqueueNotificationBar("Please log in to save movies.", "info");
  //     return;
  //   }
  //   try {
  //     const docRef = await addToWatchList(user.uid, movie);
  //     if (docRef && typeof docRef !== "string") {
  //       enqueueNotificationBar("Added to your watch list!", "success");
  //       router.push(`/movies/${docRef.id}`);
  //     }
  //   } catch (err) {
  //     enqueueNotificationBar(`Error: ${err}`, "error");
  //   }
  // };

  // const removeFromWatchList = async (movie: Movie) => {
  //   if (!user) return;
  //   await requestRemoveFromWatchList(user.uid, movie);
  //   setWatchList((prev) => prev.filter((item) => item.id !== movie.id));
  // };

  // // --- Mobile-friendly tab selector ---
  // const renderTabSelector = () => (
  //   <FormControl fullWidth size="small" sx={{ mb: 2 }}>
  //     <InputLabel id="tab-select-label">View</InputLabel>
  //     <Select
  //       labelId="tab-select-label"
  //       value={tabNumber}
  //       label="View"
  //       onChange={(e) => setTabNumber(Number(e.target.value))}
  //     >
  //       <MenuItem value={0}>{tabOneTitle}</MenuItem>
  //       <MenuItem value={1}>Movies</MenuItem>
  //       <MenuItem value={2}>TV</MenuItem>
  //       {user && <MenuItem value={3}>Watchlist</MenuItem>}
  //     </Select>
  //   </FormControl>
  // );

  return (
    <Container maxWidth="lg" sx={{ py: isClient && isMobile ? 2 : 4 }}>
      <Box sx={{ mb: 2 }}>
        <SearchBox searchForMovie={fetchContent} />
      </Box>
      <TabsWrapper
        user={user}
        watchList={watchList}
        allContent={everything}
        movies={movies}
        tvShows={tvShows}
      />
     
           {NotificationBarComponent}
    </Container>
  );
};

// import { Container } from "@mui/material";
// // import { SearchBox } from "@/components/search";

// import { fetchByTitle } from "@/lib/fetchByTitle";
// import { getContent } from "@/utils/api/contentApi";
// // import { fetchTrendingContent } from "@/lib/fetchTrendingContent";
// // import { Movie } from "@/data-models/movie.interface";
// import TabsWrapper from "../panels/tab-wrapper";
// // import { getUserFromCookies } from "@/lib/firebase/auth";

// interface MovieContentProps {
//   searchQuery?: string;
// }

// const MovieContent = async ({ searchQuery = "" }: MovieContentProps) => {
//   // const user = await getUserFromCookies();
//   const user = null; // Placeholder for user authentication
//   const [watchList] = await Promise.all([
//     user ? getContent(user.uid) : [],
//     // fetchTrendingContent()
//   ]);

//   const { moviesContent, tvContent, allContent } = searchQuery
//     ? await fetchByTitle(searchQuery)
//     : { moviesContent: [], tvContent: [], allContent: [] };

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       {/* <Box sx={{ mb: 2 }}>
//         <SearchBox initialQuery={searchQuery} />
//       </Box> */}
//       <TabsWrapper
//         user={user}
//         watchList={watchList}
//         allContent={allContent}
//         movies={moviesContent}
//         tvShows={tvContent}
//       />
//     </Container>
//   );
// }

export default MovieContent;