import { Box, Grid, Card, CardMedia, Typography, CardContent, styled } from "@mui/material";
import React, { Ref, forwardRef } from "react";
import { Movie } from "../@interfaces/movie.interface";
import ActionItems from "../shared/action-items";

interface MovieGridProps {
  movies: Movie[];
  addClicked?(movie: Movie): Promise<void>;
  removeClicked?(movie: Movie): Promise<void>;
}

const MovieBox = styled(Box)(() => ({
    alignItems: "center",
    flexDirection: "column",
    display: "flex",
    textAlign: "left",
    color: "white",
    position: "relative",
    cursor: "pointer",
  }));

const ContainerStyled = styled(Box)`
    &:hover {
      .action-items {
        display: block;
      }
    }  
  }`;

const ActionItemsContainer = styled("div")`
  text-align: center;
  margin: auto;
  width: fit-content;
  display: none;
`;

const MovieGrid = forwardRef(({ movies, addClicked, removeClicked }: MovieGridProps, ref: Ref<HTMLDivElement>): JSX.Element => {
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  return (
    <Grid container spacing={3}>
      {movies.map((movie) => {
        const poster = movie.poster_path ?? movie.backdrop_path;
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieBox ref={ref}>
            <ContainerStyled>
              <Card>
                <CardMedia component="img" image={`${BASE_URL}${poster}`} alt={movie.title} />

                <CardContent>
                  <Typography variant="h6" component="h2">
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {movie.overview}
                  </Typography>
                </CardContent>
              </Card>
              <ActionItemsContainer className="action-items">
                <ActionItems movie={movie} addClicked={addClicked} removeClicked={removeClicked} />
              </ActionItemsContainer>
            </ContainerStyled>
            </MovieBox>
          </Grid>
        );
      })}
    </Grid>
  );
});

MovieGrid.displayName = "MovieGrid";

export default MovieGrid;
