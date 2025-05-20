"use client";

import { Movie } from "@/data-models/movie.interface";
import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProviderLogos from "./ProviderLogos";
import RecommendedMovies from "./RecommendedMovies";
import AddToWatchlist from "@/components/buttons/AddToWatchlist";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MovieDetails({ user, movie, recommended }: { user: any; movie: Movie; recommended: Movie[] }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isLargeScreen = useMediaQuery("(min-width:1200px)");

  const handleClickEvent = (movie: Movie) => {
    router.push(`/movies/${movie.id}`, { scroll: false });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, color: theme.palette.text.primary }}>
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Header: Back button + Add to Watchlist */}
        <Stack direction={isMobile ? "column" : "row"} spacing={2} mb={3} alignItems={isMobile ? "flex-start" : "center"} justifyContent={isLargeScreen ? "space-between" : "flex-start"}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            variant="outlined"
            color="primary"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              width: isMobile ? "100%" : "auto",
              "&:hover": {
                borderColor: theme.palette.primary.dark,
                backgroundColor: theme.palette.primary.light,
              },
            }}
          >
            Back
          </Button>
          <AddToWatchlist user={user} movie={movie} />
        </Stack>

        {/* Movie Details: Poster, Title, Description */}
        <Grid container spacing={4} sx={{ alignItems: "flex-start" }}>
          {/* Image Section */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", justifyContent: "center" }}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={450}
              style={{
                borderRadius: 8,
                width: "100%",
                height: "auto",
              }}
            />
          </Grid>

          {/* Text Section: Title, Genres, Overview */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h4" gutterBottom color="text.primary">
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </Typography>
            <Box mb={2}>
              {movie.genres.map((g) => (
                <Chip
                  key={g.id}
                  label={g.name}
                  color="primary"
                  sx={{
                    mr: 1,
                    mb: 1,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.background.paper,
                  }}
                />
              ))}
            </Box>
            <Typography color="text.secondary" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
              {movie.overview}
            </Typography>

            {/* Watch Providers Section */}
            <Box mt={4}>
              <Typography variant="h6" gutterBottom color="text.primary">
                Available On:
              </Typography>
              <ProviderLogos providers={movie.providers} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Media Gallery */}
      <Box mt={6}>
        {/* Videos */}
        <Grid container spacing={2} mt={2}>
          {movie.videos?.results?.slice(0, 2).map((video) => (
            <Grid size={{ xs: 12, md: 6 }} key={video.id}>
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "56.25%", // 16:9 aspect ratio
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title={video.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                  allowFullScreen
                ></iframe>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" gutterBottom color="white">
          Media Gallery
        </Typography>
        <Grid container spacing={2}>
          {/* Images */}
          {movie.images?.backdrops?.slice(0, 4).map((img, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <Image
                src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                alt={`Backdrop ${index + 1}`}
                width={300}
                height={170}
                style={{
                  borderRadius: 10,
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recommended Movies Section */}
      <Box mt={4}>
        <Typography variant="h5" color="text.primary" gutterBottom>
          You May Also Like
        </Typography>
        <RecommendedMovies movies={recommended} handleClick={handleClickEvent}/>
      </Box>
    </Container>
  );
}
