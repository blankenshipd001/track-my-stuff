import React from "react";
import { Container } from "@mui/material";
import { Title } from "@/components/title";
import { fetchPopularContent } from "@utils/api/serverContentApi";
import MovieContent from "@/components/movies/movie-content";
import { verifySessionToken } from "@/lib/firebase/auth";
import { cookies } from "next/headers";

const MovieSearch = async () => {  
  const user = await verifySessionToken(cookies().toString());

  const popularMedia = await fetchPopularContent();

  return (
    <Container>
      <Title />
      <MovieContent popularMedia={popularMedia} user={user} />
    </Container>
  );
};

export default MovieSearch;
