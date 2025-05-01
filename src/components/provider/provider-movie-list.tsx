import { Movie } from "@/data-models/movie.interface";
import { Grid, Typography, Card, CardMedia, CardActionArea, Box, Divider } from "@mui/material";

interface ProviderListProps {
  providers: Map<string, Movie[]>;
  listName: string;
}

export const ProviderList: React.FC<ProviderListProps> = ({ providers, listName }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  return (
    <Box sx={{ mb: 6 }}>
      {Array.from(providers.entries()).map(([providerName, movies]) => (
        <Box key={providerName} sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            {listName}: {providerName}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={2}>
            {movies.map((movie) => {
              const poster = movie.poster_path ?? movie.backdrop_path;
              const posterUrl = poster ? `${BASE_URL}${poster}` : "/placeholder.png";

              return (
                <Grid size={{xs: 2, sm: 2, md: 2}} key={movie.id}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 2,
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.03)" },
                    }}
                  >
                    <CardActionArea href={`/movies/${movie.id}`}>
                      <CardMedia
                        component="img"
                        image={posterUrl}
                        alt={movie.title}
                        sx={{ height: 225, objectFit: "cover" }}
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};