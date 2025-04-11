"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import Image from "next/image";
import { Box, Container, Grid, Paper, Typography, Chip, Button } from "@mui/material";
import useNotificationBar from "@/hooks/useNotificationBar";
// import { BackButton } from "@/components/buttons/back-button";
import { UserAuth } from "@/utils/providers/auth-provider";
import { Movie } from "@/data-models/movie.interface";
import { ArrowBack } from "@mui/icons-material";

// const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;
const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

export default function MovieDetailsPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { googleSignIn, user } = UserAuth();
  // const isMobile = useMediaQuery(darkTheme.breakpoints.down("sm"));

  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();

  const [details, setDetails] = useState<Movie>();
  const [recommended, setRecommended] = useState<Movie[]>([]);

  useEffect(() => {
    fetchMovieOrTvDetails();
  }, []);

  const addToWatchList = async (movie: Movie) => {
    if (user === null) {
      await googleSignIn();
    }

    delete movie.id;
    const path = `users/${user?.uid}/movies`;

    try {
      await addDoc(collection(db, path), { movie });
      enqueueNotificationBar("Successfully added to your watch list", "success");
    } catch (err) {
      enqueueNotificationBar(`Failure adding to your watch list: ${err}`, "error");
    }
  };

  const fetchRecommendedMovies = async (movie: Movie) => {
    const genreId = movie?.genres[0]?.id;
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}&api_key=${movie_api_key}`;

    const res = await fetch(url);
    const data = await res.json();
    setRecommended(data.results);
  };

  const fetchMovieOrTvDetails = async () => {
    const getMovieUrl = `https://api.themoviedb.org/3/movie/${params.slug}?api_key=${movie_api_key}`;

    const movieRes = await fetch(getMovieUrl);

    if (movieRes.ok) {
      const movie = await movieRes.json();
      return handleMovieOrTvResponse(movie, "movie");
    }
  };

  const handleMovieOrTvResponse = async (media: Movie, type: "movie" | "tv") => {
    const providerUrl = `https://api.themoviedb.org/3/${type}/${media.id}/watch/providers?api_key=${movie_api_key}`;
    const res = await fetch(providerUrl);
    const providerData = await res.json();

    const formatted: Movie = {
      ...media,
      movieId: Number(media.id),
      providers: providerData.results?.US ?? [],
    };

    setDetails(formatted);
    fetchRecommendedMovies(formatted);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {details && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Button startIcon={<ArrowBack />} variant="contained" sx={{ mb: 2 }} onClick={() => router.back()}>
            Back
          </Button>
          {/* temporary spacing as these buttons will move */}
          &nbsp;&nbsp;&nbsp;
          <Button startIcon={<ArrowBack />} variant="contained" sx={{ mb: 2 }} onClick={() => addToWatchList(details)}>
            Add to Watchlist
          </Button>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Image src={`${BASE_URL}${details.poster_path}`} alt={details.title} width={300} height={450} style={{ borderRadius: 8, width: "100%", height: "auto" }} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom color="white">
                {details.title} ({new Date(details.release_date).getFullYear()})
              </Typography>
              <Box mb={2}>
                {details.genres.map((genre) => (
                  <Chip key={genre.id} label={genre.name} color="primary" sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
              <Typography variant="body1" color="white" sx={{ whiteSpace: "pre-wrap" }}>
                {details.overview}
              </Typography>

              <Box mt={4}>
                <Typography variant="h6" gutterBottom color="white">
                  Available On:
                </Typography>
                <Grid container spacing={1}>
                  {["buy", "rent", "flatrate"].map((type) => {
                    const providerList = details.providers?.[type as "buy" | "rent" | "flatrate"];
                    return Array.isArray(providerList)
                      ? providerList.map((provider, i) => (
                          <Grid item key={i}>
                            <Image src={`${BASE_URL}${provider.logo_path}`} alt={provider.provider_name} width={40} height={40} style={{ borderRadius: "50%", background: "#fff" }} />
                          </Grid>
                        ))
                      : null;
                  })}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Typography variant="h6" gutterBottom color="white">
        You May Also Like
      </Typography>
      <Grid container spacing={2}>
        {recommended.slice(0, 6).map((rec) => (
          <Grid item xs={6} md={2} key={rec.id}>
            <Image src={`${BASE_URL}${rec.poster_path}`} alt={rec.title} width={150} height={225} style={{ borderRadius: 6, width: "100%", height: "auto" }} />
            <Typography variant="subtitle2" color="white" mt={1}>
              {rec.title}
            </Typography>
          </Grid>
        ))}
      </Grid>
      {NotificationBarComponent}
    </Container>
  );
}
