import React from 'react';
import { Media } from "@/data-models/media.interface";
import { Container, Paper, Box } from "@mui/material";
import DetailsHeaderServer from "./details-header-server";
import DetailsMediaServer from "./details-media-server";
import DetailsMediaGallery from "./details-media-gallery";
import DetailsRecommended from "./details-recommended";
import EpisodesSection from "./episodes-section";
import CastSection from "./cast-section";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DetailsPageServer({ user, media, recommended, isTv }: { user: any; media: Media; recommended: Media[]; isTv: boolean }) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <DetailsHeaderServer user={user} media={media} />

        {/* Movie Details: Poster, Title, Description */}
        <DetailsMediaServer media={media} isTv={isTv} />

        {/* Show episodes grouped by season if they exist */}
        {Array.isArray(media.episodes) && media.episodes.length > 0 && (
          <Box mt={4}>
            <EpisodesSection episodes={media.episodes} />
          </Box>
        )}

        {/* Cast Section */}
        {Array.isArray(media?.credits?.cast) && media?.credits?.cast.length > 0 && (
          <CastSection cast={media?.credits?.cast} />
        )}
      </Paper>

      {/* Media Gallery */}
      <DetailsMediaGallery media={media} />

      {/* Recommended Movies Section */}
      <DetailsRecommended recommended={recommended} isTv={isTv} />
    </Container>
  );
}
