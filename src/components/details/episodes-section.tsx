"use client";
import React from "react";
import { Typography, ToggleButtonGroup, ToggleButton, List, ListItem, ListItemText } from "@mui/material";

interface Episode {
  id?: number;
  episode_number?: number;
  name?: string;
  overview?: string;
}

interface Season {
  season_number: number;
  episodes: Episode[];
}

export default function EpisodesSection({ episodes }: { episodes: Season[] }) {
  const [selectedSeason, setSelectedSeason] = React.useState(
    Array.isArray(episodes) && episodes.length > 0 ? episodes[0].season_number : null
  );

  return (
    <>
      <Typography variant="h5" mb={2}>Episodes</Typography>
      {/* Season selector */}
      <ToggleButtonGroup
        value={selectedSeason}
        exclusive
        onChange={(_e, val) => val && setSelectedSeason(val)}
        sx={{ mb: 2, flexWrap: 'wrap' }}
      >
        {episodes.map((season) => (
          <ToggleButton key={season.season_number} value={season.season_number} sx={{ minWidth: 40 }}>
            {season.season_number}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {/* Episodes for selected season */}
      {episodes
        .filter((season) => season.season_number === selectedSeason)
        .map((season) => (
          <List key={season.season_number} sx={{ maxHeight: 300, overflowY: 'auto', p: 0 }}>
            {season.episodes.map((ep, idx) => (
              <ListItem key={ep.id || idx} alignItems="flex-start" divider sx={{ py: 1, px: 2 }}>
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
    </>
  );
}
