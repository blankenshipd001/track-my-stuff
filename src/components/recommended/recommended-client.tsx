"use client";
import { useRouter } from "next/navigation";
import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import { getProxyImageUrlForPath } from '@/lib/imageUrl';
import { Media } from "@/data-models/media.interface";

export default function RecommendedClient({ shows, isTv }: { shows: Media[]; isTv: boolean }) {
  const router = useRouter();

  const handleClick = (movie: Media) => {
    router.push(`/${isTv ? "tv" : "movies"}/${movie.id}`, { scroll: false });
  };

  return (
    <Grid container spacing={2}>
      {shows.slice(0, 6).map((show) => (
        <Grid size={{xs: 6, sm: 4, md: 2}} key={show.id}>
          {show.poster_path ? (
            <Image
              src={getProxyImageUrlForPath(show.poster_path, 'w500')!}
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
          ) : null}
          <Typography variant="subtitle2" color="white" mt={1}>
            {show.title}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}
