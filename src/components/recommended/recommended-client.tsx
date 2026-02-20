"use client";
import { useRouter } from "next/navigation";
import { Grid, Typography, Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { getProxyImageUrlForPath } from '@/lib/imageUrl';
import { Media } from "@/data-models/media.interface";

export default function RecommendedClient({ shows, isTv }: { shows: Media[]; isTv: boolean }) {
  const router = useRouter();

  const handleClick = (movie: Media) => {
    router.push(`/${isTv ? "tv" : "movies"}/${movie.id}`, { scroll: false });
  };

  return (
    <Grid container spacing={2}>
      {shows.slice(0, 6).map((show) => {
        const href = `/${isTv ? "tv" : "movies"}/${show.id}`;
        const title = show.title || show.name || 'Untitled';
        const year = isTv ? show.first_air_date?.substring(0, 4) : show.release_date?.substring(0, 4);
        const altText = `${title}${year ? ` (${year})` : ''} - ${isTv ? 'TV Series' : 'Movie'} Poster`;
        
        return (
          <Grid size={{xs: 6, sm: 4, md: 2}} key={show.id}>
            <Link
              href={href}
              style={{
                textDecoration: 'none',
                display: 'block',
                position: 'relative',
                borderRadius: 6,
                overflow: 'hidden',
              }}
              title={title}
              rel="related"
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '150%',
                  overflow: 'hidden',
                  borderRadius: 1,
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {show.poster_path ? (
                  <Image
                    src={getProxyImageUrlForPath(show.poster_path, 'w500')!}
                    alt={altText}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClick(show);
                    }}
                  />
                ) : null}
              </Box>
              <Typography 
                variant="subtitle2" 
                color="white" 
                mt={1}
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {title}
              </Typography>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
}
