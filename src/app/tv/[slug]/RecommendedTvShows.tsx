// app/movies/[slug]/RecommendedMovies.tsx
import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import { Movie } from "@/data-models/movie.interface";

export default function RecommendedTvShows({ tvShows, handleClick }: { tvShows: Movie[], handleClick: (movie: Movie) => void }) {
  return (
    <>
      <Grid container spacing={2}>
        {tvShows.slice(0, 6).map((rec) => (
          <Grid size={{xs: 6, sm: 4, md: 2}} key={rec.id}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
              alt={rec.title}
              width={150}
              height={225}
              style={{ borderRadius: 6, width: "100%", height: "auto", cursor: "pointer" }}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                handleClick(rec);
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
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