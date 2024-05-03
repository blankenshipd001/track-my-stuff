import React, { Ref, forwardRef } from "react";
import { useRouter } from "next/navigation";
import { Box, Grid, Card, CardMedia, Typography, CardContent, styled, useMediaQuery } from "@mui/material";
import { ActionItems } from "@components/actions";
import { Movie } from "@/data-models/movie.interface";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { darkTheme } from "@/utils/themes/theme";
import { ProviderChip } from "../provider";

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

const BookmarkIconWrapper = styled(Box)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

export const MovieGrid = forwardRef(({ movies, addClicked, removeClicked }: MovieGridProps, ref: Ref<HTMLDivElement>): JSX.Element => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  const handleClickEvent = (movie: Movie) => {
    console.log("ugh");
    router.push(`/movies/${movie.movieId}`, { scroll: false });
  };

  const handleAddToWatchlist = (movie: Movie) => {
    if (addClicked !== undefined) {
      addClicked(movie);
    }
  };

  // Check if the screen size matches the mobile breakpoint
  const isMobileScreen = useMediaQuery(darkTheme.breakpoints.down("sm")) ?? false;

  return (
    <Grid container spacing={3}>
      {movies.map((movie) => {
        const poster = movie.poster_path ?? movie.backdrop_path;
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieBox ref={ref}>
              <ContainerStyled>
                <Card>
                  {isMobileScreen ? (
                    <BookmarkIconWrapper onClick={() => handleAddToWatchlist(movie)}>
                      <BookmarkBorderIcon fontSize="large" />
                    </BookmarkIconWrapper>
                  ) : (
                    <ActionItemsContainer className="action-items">
                      <ActionItems movie={movie} addClicked={() => handleAddToWatchlist(movie)} removeClicked={removeClicked} />
                    </ActionItemsContainer>
                  )}
                  <CardMedia onClick={() => handleClickEvent(movie)} component="img" image={`${BASE_URL}${poster}`} alt={movie.title} />

                  <CardContent>
                    <Typography variant="subtitle1" component="h2" sx={{ fontSize: "1.0rem", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {movie.title}
                    </Typography>
                    {/* TODO: do we want to only render on the details page? */}
                    {/* <Typography variant="body2" color="textSecondary" component="p" sx={{ fontSize: ".75rem", marginTop: "8px" }}>
                      {movie.overview}
                    </Typography> */}
                    {/* {movie.providers?.flatrate?.map((provider, index) => (
                      <ProviderChip providerInfo={provider} key={index} />
                    ))}
                    {movie.providers?.rent?.map((provider, index) => (
                      <ProviderChip providerInfo={provider} key={index} />
                    ))}
                    {movie.providers?.buy?.map((provider, index) => (
                      <ProviderChip providerInfo={provider} key={index} />
                    ))} */}
                    {movie?.providers?.flatrate?.length > 0 && (
                      <>
                        <Typography variant="body2" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Stream:</Typography>
                        {movie.providers.flatrate.map((provider, index) => (
                          <ProviderChip providerInfo={provider} key={index} />
                        ))}
                      </>
                    )}
                    {movie?.providers?.rent?.length > 0 && (
                      <>
                        <Typography variant="body2" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Rent:</Typography>
                        {movie.providers.rent.map((provider, index) => (
                          <ProviderChip providerInfo={provider} key={index} />
                        ))}
                      </>
                    )}
                    {movie?.providers?.buy?.length > 0 && (
                      <>
                        <Typography variant="body2" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Buy:</Typography>
                        {movie.providers.buy.map((provider, index) => (
                          <ProviderChip providerInfo={provider} key={index} />
                        ))}
                      </>
                    )}
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
