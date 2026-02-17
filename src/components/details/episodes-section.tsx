"use client";
import React from "react";
import { Typography, ToggleButtonGroup, ToggleButton, Box, Card, CardContent, IconButton, useMediaQuery, useTheme, Collapse } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [selectedSeason, setSelectedSeason] = React.useState(
    Array.isArray(episodes) && episodes.length > 0 ? episodes[0].season_number : null
  );
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #c084fc, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Episodes
        </Typography>
        <IconButton
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.3s ease',
            color: '#c084fc',
            '&:hover': {
              background: 'rgba(192, 132, 252, 0.1)',
            },
          }}
        >
          <ExpandMore />
        </IconButton>
      </Box>

      <Collapse in={isExpanded} timeout="auto">
        {/* Season selector */}
        <ToggleButtonGroup
          value={selectedSeason}
          exclusive
          onChange={(_e, val) => val && setSelectedSeason(val)}
          sx={{
            mb: 2.5,
            flexWrap: 'wrap',
            gap: 1,
            display: 'flex',
            '& .MuiToggleButton-root': {
              color: '#9ca3af',
              border: '1px solid rgba(192, 132, 252, 0.3)',
              backgroundColor: 'rgba(17, 24, 39, 0.5)',
              borderRadius: 1,
              minWidth: isMobile ? 44 : 48,
              py: 0.75,
              px: isMobile ? 1 : 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(192, 132, 252, 0.1)',
                borderColor: 'rgba(192, 132, 252, 0.5)',
                color: '#c084fc',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(192, 132, 252, 0.2)',
                color: '#f472b6',
                borderColor: 'rgba(192, 132, 252, 0.6)',
                fontWeight: 700,
                '&:hover': {
                  backgroundColor: 'rgba(192, 132, 252, 0.3)',
                },
              },
            },
          }}
        >
          {episodes.map((season) => (
            <ToggleButton key={season.season_number} value={season.season_number}>
              {isMobile ? `S${season.season_number}` : `Season ${season.season_number}`}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* Episodes for selected season */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1 : 1.5 }}>
          {episodes
            .filter((season) => season.season_number === selectedSeason)
            .map((season) => (
              <Box key={season.season_number}>
                {season.episodes.map((ep, idx) => (
                  <Card
                    key={ep.id || idx}
                    sx={{
                      borderRadius: 1.5,
                      border: '1px solid rgba(192, 132, 252, 0.15)',
                      background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.85), rgba(31, 41, 55, 0.85))',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'rgba(192, 132, 252, 0.5)',
                        boxShadow: '0 8px 32px rgba(192, 132, 252, 0.15)',
                        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(31, 41, 55, 0.9))',
                      },
                    }}
                  >
                    <CardContent sx={{ p: isMobile ? 1.5 : 2, '&:last-child': { pb: isMobile ? 1.5 : 2 } }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          mb: 0.75,
                          background: 'linear-gradient(to right, #f472b6, #c084fc)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontSize: isMobile ? '0.95rem' : '1rem',
                        }}
                      >
                        <span style={{ color: '#9ca3af', WebkitTextFillColor: 'unset' }}>Ep {ep.episode_number}:</span> {ep.name}
                      </Typography>
                      {ep.overview && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#d1d5db',
                            lineHeight: 1.6,
                            fontSize: isMobile ? '0.85rem' : '0.9rem',
                            display: isMobile ? '-webkit-box' : 'block',
                            WebkitLineClamp: isMobile ? 2 : 'unset',
                            WebkitBoxOrient: isMobile ? 'vertical' : 'unset',
                            overflow: isMobile ? 'hidden' : 'visible',
                            textOverflow: isMobile ? 'ellipsis' : 'clip',
                          }}
                        >
                          {ep.overview}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ))}
        </Box>
      </Collapse>
    </Box>
  );
}
