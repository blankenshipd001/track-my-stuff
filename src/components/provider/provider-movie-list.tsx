import { Movie } from "@/data-models/movie.interface";
import { Grid, Typography, Card, CardMedia } from "@mui/material";
// import TheatersIcon from "@mui/icons-material/Theaters";
// import ConnectedTvIcon from "@mui/icons-material/ConnectedTv";
// import LiveTvIcon from "@mui/icons-material/LiveTv";

interface providerListProps {
  providers: Map<string, Movie[]>;
  listName: string;
}

// TODO: Add icons to the providers and make this page prettier

/**
 *
 * @param providers {Map<string, Movie[]} list of providers with the movies they have
 * @param listName {string} 
 * @returns a component that has the name of the provider (listName) and all the movies on that provider
 */
export const ProviderList: React.FC<providerListProps> = ({ providers, listName }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  return (
    <Grid container spacing={4}>
      {Array.from(providers.entries()).map(([providerName, providerMovies]) => (
        <Grid item xs={12} md={6} lg={4} key={providerName} style={{ marginBottom: "40px" }}>
          <Typography variant="h5">
            {listName}: {providerName}
          </Typography>
          <Grid container spacing={4}>
            {providerMovies.map((movie: Movie) => {
              const poster = movie.poster_path ?? movie.backdrop_path;
              return (
                <Grid item key={movie.id} xs={12} sm={6} md={4}>
                  <Card>
                    <CardMedia component="img" height="150" image={`${BASE_URL}${poster}`} alt={movie.title} />
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
