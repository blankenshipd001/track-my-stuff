"use client";
import React, { useEffect, useState } from "react";
import { Grid, Card, CardMedia, CardContent, Typography, Box, Container } from "@mui/material";
// import TheatersIcon from "@mui/icons-material/Theaters";
// import ConnectedTvIcon from "@mui/icons-material/ConnectedTv";
// import LiveTvIcon from "@mui/icons-material/LiveTv";
import { Movie } from "@/data-models/movie.interface";
import { useRouter } from "next/navigation";
import { getContent } from "@/utils/api/contentApi";
import { UserAuth } from "@/utils/providers/auth-provider";
import useUserSession from "@/hooks/useUserSession";

const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

interface movieCard {
  movie: Movie;
}

// Mapping platforms to icons
// const platformIcons = {
//   rent: <LiveTvIcon />,
//   stream: <ConnectedTvIcon />,
//   theater: <TheatersIcon />
// };

// MovieCard component
const MovieCard = ({ movie }: movieCard) => {
  const poster = movie.poster_path ?? movie.backdrop_path;

  return (
    <Card raised>
      <CardMedia component="img" height="140" image={`${BASE_URL}${poster}`} alt={movie.title} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.overview}
        </Typography>
        <Box display="flex" justifyContent="start" mt={2}>
          {/* {movie.providers.map(provider => (
          <Box key={provider} mr={1}>
            {platformIcons[platform]}
          </Box>
        ))} */}
        </Box>
      </CardContent>
    </Card>
  );
};

// Main MovieGrid component
const MovieGrid = () => {
  const { currentUser } = UserAuth();
  const user = useUserSession(currentUser);

  const [watchList, setWatchList] = useState<Movie[]>([]);
  const router = useRouter();

  /**
   * Loads movies when the page loads
   */
  useEffect(() => {
    if (user !== null) {
      getContent(user?.uid)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((data: any) => {
          console.log("setting watch list");
          console.log(data);
          setWatchList(data);
        })
        .catch((err) => {
          console.error("Error making async call: " + err);
          router.push("/");
        });
    } else {
      // No user is signed in.
      console.log("no one home");
      router.push("/");
    }
  }, [user]);

  return (
    <Container>
      <Grid container spacing={4}>
        {watchList.map((movie: Movie, index: number) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MovieGrid;
