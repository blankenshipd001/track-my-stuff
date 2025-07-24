"use client";

import { Media } from "@/data-models/movie.interface";
import { Container, Paper, useTheme } from "@mui/material";
import DetailsHeader from "./details-header";
import DetailsMediaGallery from "./details-media-gallery";
import DetailsMedia from "./details-media";
import DetailsRecommended from "./details-recommended";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DetailsPage({ user, media, recommended, isTv }: { user: any; media: Media; recommended: Media[]; isTv: boolean }) {
  const theme = useTheme();
  
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
        <DetailsHeader user={user} media={media} />

        {/* Movie Details: Poster, Title, Description */}
        <DetailsMedia media={media} isTv={isTv} />
      </Paper>

      {/* Media Gallery */}
     <DetailsMediaGallery media={media} />

      {/* Recommended Movies Section */}
      <DetailsRecommended recommended={recommended} isTv={isTv} />
    </Container>
  );
}
