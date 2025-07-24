// app/movies/[slug]/RecommendedMovies.tsx
import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import { Media } from "@/data-models/media.interface";

export default function Recommended({ shows, handleClick }: { shows: Media[], handleClick: (movie: Media) => void }) {
  return (
    <>
      <Grid container spacing={2}>
        {shows.slice(0, 6).map((show) => (
          <Grid size={{xs: 6, sm: 4, md: 2}} key={show.id}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.title ?? 'image'}
              width={150}
              height={225}
              style={{ borderRadius: 6, width: "100%", height: "auto", cursor: "pointer" }}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                handleClick(show);
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <Typography variant="subtitle2" color="white" mt={1}>
              {show.title}
            </Typography>
          </Grid>
        ))}
      </Grid>

    </>
  );
}