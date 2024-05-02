import React, { Ref, forwardRef } from "react";
import { useRouter } from "next/navigation";
import { Box, Grid, Card, CardMedia, Typography, CardContent, styled } from "@mui/material";
import { ActionItems } from "@components/actions";
import { Movie } from "@/data-models/movie.interface";

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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  display: none;
`;

export const MovieGrid = forwardRef(({ movies, addClicked, removeClicked }: MovieGridProps, ref: Ref<HTMLDivElement>): JSX.Element => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  const handleClickEvent = (movie: Movie) => {
    router.push(`/movies/${movie.movieId}`, { scroll: false });
  };

  return (
    <Grid container spacing={3}>
      {movies.map((movie) => {
        const poster = movie.poster_path ?? movie.backdrop_path;
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieBox ref={ref}>
              <ContainerStyled>
                <Card>
                  <CardMedia onClick={() => handleClickEvent(movie)} component="img" image={`${BASE_URL}${poster}`} alt={movie.title} />
                  <ActionItemsContainer className="action-items">
                    <ActionItems movie={movie} addClicked={addClicked} removeClicked={removeClicked} />
                  </ActionItemsContainer>
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {movie.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {movie.overview}
                    </Typography>
                  </CardContent>
                </Card>
              </ContainerStyled>
            </MovieBox>
          </Grid>
        );
      })}
    </Grid>
  );
});

MovieGrid.displayName = "MovieGrid";
