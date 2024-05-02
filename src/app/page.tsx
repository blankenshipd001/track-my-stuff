import React from "react";

import { Container } from "@mui/material";
import { Header } from "@components/header/header";
import { Footer } from "@components/footer/footer";
import { Title } from "@/components/title";
import { MovieContent } from "@/components/movies/movie-content";


const MovieSearch = () => {
  return (
    <Container>
      <Header />
      <Title />
      <MovieContent />
      <Footer />
    </Container>
  );
};

export default MovieSearch;
