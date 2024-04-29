import React from "react";
import Footer from "@/lib/shared/footer";
import { Container } from "@mui/material";
import Header from "@/lib/shared/header";
import Title from "@/lib/movies/title";
import MovieContent from "@/lib/movies/movie-content";

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
