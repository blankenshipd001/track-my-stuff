// app/movies/[slug]/RecommendedMovies.tsx
import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import { Movie } from "@/data-models/movie.interface";

export default function RecommendedMovies({ movies }: { movies: Movie[] }) {
  return (
    <>
      <Grid container spacing={2}>
        {movies.slice(0, 6).map((rec) => (
          <Grid size={{xs: 6, sm: 4, md: 2}} key={rec.id}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
              alt={rec.title}
              width={150}
              height={225}
              style={{ borderRadius: 6, width: "100%", height: "auto" }}
            />
            <Typography variant="subtitle2" color="white" mt={1}>
              {rec.title}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </>
  );
}