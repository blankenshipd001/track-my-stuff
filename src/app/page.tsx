import React from "react";

import { Container } from "@mui/material";
import { Title } from "@/components/title";
import { MovieContent } from "@/components/movies/movie-content";


const MovieSearch = () => {
  return (
    <Container>
      <Title />
      <MovieContent />
    </Container>
  );
};

export default MovieSearch;
