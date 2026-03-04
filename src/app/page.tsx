import React from "react";
import { Container } from "@mui/material";
import { Title } from "@/components/title";
import { fetchPopularMoviesWithProviders } from "@/services";
import MovieContent from "@/components/media/movie-content";
import { getCurrentUser, getCurrentUserWatchlist } from "@/lib/get-current-user";
import { Media } from "@/data-models/media.interface";

const MovieSearch = async () => {  
  const [user, popularMedia, watchList] = await Promise.all([
    getCurrentUser(),
    fetchPopularMoviesWithProviders() as Promise<Media[]>,
    getCurrentUserWatchlist(),
  ]);

  return (
    <Container>
      <Title />
      <MovieContent popularMedia={popularMedia} user={user} initialWatchList={watchList} />
    </Container>
  );
};

export default MovieSearch;
