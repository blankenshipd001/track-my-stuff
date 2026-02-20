import React from "react";
import { Container } from "@mui/material";
import { Title } from "@/components/title";
import { fetchPopularMoviesWithProviders } from "@/services";
import MovieContent from "@/components/media/movie-content";
import { verifySessionToken } from "@/lib/firebase/auth";
import getCookieHeader from '@/lib/getCookieHeader';
import { Media } from "@/data-models/media.interface";

const MovieSearch = async () => {  
  const cookieHeader = await getCookieHeader();
  const user = await verifySessionToken(cookieHeader);

  const popularMedia = await fetchPopularMoviesWithProviders() as Media[];

  return (
    <Container>
      <Title />
      <MovieContent popularMedia={popularMedia} user={user} />
    </Container>
  );
};

export default MovieSearch;
