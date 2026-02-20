import React from 'react';
import { Media } from "@/data-models/media.interface";
import { User } from "@/data-models/user.interface";
import { Container, Paper, Box } from "@mui/material";
import DetailsHeaderServer from "./details-header-server";
import DetailsMediaServer from "./details-media-server";
import DetailsMediaGallery from "./details-media-gallery";
import DetailsRecommended from "./details-recommended";
import EpisodesSection from "./episodes-section";
import CastSection from "./cast-section";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";
import { GRADIENTS, SHADOWS, BORDER_RADIUS } from '@/lib/theme-constants';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export default function DetailsPageServer({
  user,
  media,
  recommended,
  isTv,
  breadcrumbItems,
}: {
  user: User | null;
  media: Media;
  recommended: Media[];
  isTv: boolean;
  breadcrumbItems?: BreadcrumbItem[];
}) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <Breadcrumb items={breadcrumbItems} />
      )}
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: BORDER_RADIUS.lg,
          background: GRADIENTS.card,
          backdropFilter: 'blur(10px)',
          boxShadow: SHADOWS.dark,
          border: '1px solid rgba(192, 132, 252, 0.15)',
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
