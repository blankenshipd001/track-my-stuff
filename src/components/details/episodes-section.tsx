"use client";
import React from "react";
import { Typography, ToggleButtonGroup, ToggleButton, Box, Card, CardContent, IconButton, useMediaQuery, useTheme, Collapse } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { COLORS, GRADIENTS, SHADOWS, TRANSITIONS, BORDER_RADIUS } from '@/lib/theme-constants';

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
            background: GRADIENTS.textPurplePink,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Episodes
        </Typography>
        <IconButton
          aria-label={isExpanded ? 'Collapse episodes' : 'Expand episodes'}
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: TRANSITIONS.default,
            color: COLORS.purple.solid,
            '&:hover': {
              background: COLORS.purple[100],
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
              color: COLORS.gray[400],
              border: `1px solid ${COLORS.purple[300]}`,
              backgroundColor: 'rgba(17, 24, 39, 0.5)',
              borderRadius: BORDER_RADIUS.sm,
              minWidth: isMobile ? 44 : 48,
              py: 0.75,
              px: isMobile ? 1 : 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              transition: TRANSITIONS.default,
              '&:hover': {
                backgroundColor: COLORS.purple[100],
                borderColor: COLORS.purple[500],
                color: COLORS.purple.solid,
              },
              '&.Mui-selected': {
                backgroundColor: COLORS.purple[200],
                color: COLORS.pink.solid,
                borderColor: COLORS.purple[600],
                fontWeight: 700,
                '&:hover': {
                  backgroundColor: COLORS.purple[300],
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
                      borderRadius: BORDER_RADIUS.md,
                      border: `1px solid ${COLORS.purple[100]}`,
                      background: GRADIENTS.card,
                      backdropFilter: 'blur(10px)',
                      transition: TRANSITIONS.default,
                      '&:hover': {
                        borderColor: COLORS.purple[500],
                        boxShadow: SHADOWS.cardHoverLight,
                        background: GRADIENTS.cardHeavy,
                      },
                    }}
                  >
                    <CardContent sx={{ p: isMobile ? 1.5 : 2, '&:last-child': { pb: isMobile ? 1.5 : 2 } }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          mb: 0.75,
                          background: GRADIENTS.textPinkPurple,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontSize: isMobile ? '0.95rem' : '1rem',
                        }}
                      >
                        <span style={{ color: COLORS.gray[400], WebkitTextFillColor: 'unset' }}>Ep {ep.episode_number}:</span> {ep.name}
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
