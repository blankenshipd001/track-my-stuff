"use client";
import React from 'react';
import { Media } from "@/data-models/media.interface";
import { Container, Paper, useTheme, ToggleButtonGroup, ToggleButton, List, ListItem, ListItemText, Typography, Box } from "@mui/material";
import DetailsHeader from "./details-header";
import DetailsMediaGallery from "./details-media-gallery";
import DetailsMedia from "./details-media";
import DetailsRecommended from "./details-recommended";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DetailsPage({ user, media, recommended, isTv }: { user: any; media: Media; recommended: Media[]; isTv: boolean }) {
  const theme = useTheme();
  
  // State for selected season
  const [selectedSeason, setSelectedSeason] = React.useState(
    Array.isArray(media.episodes) && media.episodes.length > 0 ? media.episodes[0].season_number : null
  );

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

        {/* Show episodes grouped by season if they exist */}
        {Array.isArray(media.episodes) && media.episodes.length > 0 && (
          <Box mt={4}>
            <Typography variant="h5" mb={2}>Episodes</Typography>
            {/* Season selector */}
            <ToggleButtonGroup
              value={selectedSeason}
              exclusive
              onChange={(_e, val) => val && setSelectedSeason(val)}
              sx={{ mb: 2, flexWrap: 'wrap' }}
            >
              {media.episodes.map((season) => (
                <ToggleButton key={season.season_number} value={season.season_number} sx={{ minWidth: 40 }}>
                  {season.season_number}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {/* Episodes for selected season */}
            {media.episodes
              .filter((season) => season.season_number === selectedSeason)
              .map((season) => (
                <List key={season.season_number} sx={{ maxHeight: 300, overflowY: 'auto', p: 0 }}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {season.episodes.map((ep: any) => (
                    <ListItem key={ep.id} alignItems="flex-start" divider sx={{ py: 1, px: 2 }}>
                      <ListItemText
                        primary={<><strong>Episode {ep.episode_number}:</strong> {ep.name}</>}
                        secondary={ep.overview && (
                          <Typography variant="body2" color="text.secondary" mt={0.5}>
                            {ep.overview}
                          </Typography>
                        )}
                      />
                    </ListItem>
                  ))}
                </List>
              ))}
          </Box>
        )}
      </Paper>

      {/* Media Gallery */}
     <DetailsMediaGallery media={media} />

      {/* Recommended Movies Section */}
      <DetailsRecommended recommended={recommended} isTv={isTv} />
    </Container>
  );
}
