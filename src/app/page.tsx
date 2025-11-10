import React from "react";
import { Container } from "@mui/material";
import { Title } from "@/components/title";
import { fetchPopularContent } from "@utils/api/serverContentApi";
import MovieContent from "@/components/media/movie-content";
import { verifySessionToken } from "@/lib/firebase/auth";
import getCookieHeader from '@/lib/getCookieHeader';

const MovieSearch = async () => {  
  const cookieHeader = await getCookieHeader();
  const user = await verifySessionToken(cookieHeader);

  const popularMedia = await fetchPopularContent();

  return (
    <Container>
      <Title />
      <MovieContent popularMedia={popularMedia} user={user} />
    </Container>
  );
};

export default MovieSearch;
