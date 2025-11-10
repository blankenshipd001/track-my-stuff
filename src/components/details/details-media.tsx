import React from "react";
import Image from "next/image";
import { getProxyImageUrlForPath } from '@/lib/imageUrl';
import { Box, Chip, Grid, Typography, useTheme } from "@mui/material";
import ProviderLogos from "@/components/provider/ProviderLogos";
import { Media } from "@/data-models/media.interface";

export default function DetailsMedia({ media, isTv }: { media: Media; isTv: boolean }) {
  const theme = useTheme();

  {/* Media Gallery */}
  return (
    <Grid container spacing={4} sx={{ alignItems: "flex-start" }}>
      {/* Image Section */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", justifyContent: "center" }}>
        {media.poster_path ? (
          <Image
            src={getProxyImageUrlForPath(media.poster_path, 'w500')!}
            alt={media.title ?? "image"}
            width={300}
            height={450}
            style={{
              borderRadius: 8,
              width: "100%",
              height: "auto",
            }}
          />
        ) : null}
      </Grid>

      {/* Text Section: Title, Genres, Overview */}
      <Grid size={{ xs: 12, md: 8 }}>
        {isTv ? (
          <Typography variant="h4" gutterBottom color="text.primary">
            {media?.name} ({new Date(media.first_air_date).getFullYear()})
          </Typography>
        ) : (
          <Typography variant="h4" gutterBottom color="text.primary">
            {media?.title} ({new Date(media.release_date).getFullYear()})
          </Typography>
        )}

        <Box mb={2}>
          {media.genres.map((g) => (
            <Chip
              key={g.id}
              label={g.name}
              color="primary"
              sx={{
                mr: 1,
                mb: 1,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            />
          ))}
        </Box>
        <Typography color="text.secondary" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
          {media.overview}
        </Typography>

        {/* Watch Providers Section */}
        <Box mt={4}>
          <ProviderLogos providers={media.providers} />
        </Box>
      </Grid>
    </Grid>
  );
}
