import React from "react";

import { Container } from "@mui/material";
import { Footer } from "@components/footer/footer";
import { Title } from "@/components/title";
import { MovieContent } from "@/components/movies/movie-content";


const MovieSearch = () => {
  return (
    <Container>
      <Title />
      <MovieContent />
      <Footer />
    </Container>
  );
};

export default MovieSearch;
