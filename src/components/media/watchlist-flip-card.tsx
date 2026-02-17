"use client";

import React, { ReactNode, useState } from "react";
import { Box, useMediaQuery, useTheme, IconButton } from "@mui/material";
import Image from "next/image";
import { BookmarkAdd, BookmarkRemove, Info, OpenInNew } from "@mui/icons-material";
import { motion } from "framer-motion";
import ImageListItem from "@mui/material/ImageListItem";
import { Media } from "@/data-models/media.interface";
import { ProviderLogos } from "../provider/ProviderLogos";

export interface WatchlistFlipCardProps {
  movie: Media;
  poster: string | null | undefined;
  title: string | null | undefined;
  onRemove: (movie: Media) => Promise<void>;
  onNavigate: (movie: Media) => void;
  onAdd?: (movie: Media) => Promise<void>;
  isInWatchlist?: boolean;
}

export const WatchlistFlipCard: React.FC<WatchlistFlipCardProps> = ({
  movie,
  poster,
  title,
  onRemove,
  onNavigate,
  onAdd,
  isInWatchlist = true,
}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const containerVariants = {
    rest: { rotateY: 0 },
    hover: { rotateY: 180 },
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
    if (e.key === 'Escape') {
      setIsFlipped(false);
    }
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const getProviders = (): ReactNode => {
    const providers = movie?.providers?.flatrate;
    if (Array.isArray(providers) && providers.length > 0) {
      return <ProviderLogos list={providers} />;
    }
    return (
      <Box sx={{ color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center' }}>
        Not available
      </Box>
    );
  };

  return (
    <motion.div
      initial="rest"
      animate={isFlipped ? "hover" : "rest"}
      variants={containerVariants}
      transition={{ duration: 0.6 }}
      style={{
        perspective: 1000,
        height: '100%',
        cursor: isMobile ? 'pointer' : 'pointer',
      }}
    >
      <ImageListItem
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-pressed={isFlipped}
        aria-label={`${title} - press Enter to see available providers. Currently showing ${isFlipped ? 'providers' : 'poster'}`}
        sx={{
          borderRadius: 1.5,
          overflow: "hidden",
          width: "100%",
          height: "auto",
          aspectRatio: "2 / 3",
          border: isFocused
            ? '2px solid #a78bfa'
            : '1px solid rgba(192, 132, 252, 0.2)',
          outline: isFocused ? '2px solid #a78bfa' : 'none',
          outlineOffset: '2px',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.85), rgba(31, 41, 55, 0.85))',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(192, 132, 252, 0.5)',
            boxShadow: '0 8px 32px rgba(192, 132, 252, 0.15)',
          },
          '&:focus-visible': {
            outline: '2px solid #a78bfa',
            outlineOffset: '2px',
          },
        }}
      >
        {!isFlipped ? (
          // Front: Poster Image with Action Buttons
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={`${BASE_URL}${poster}?w=500&fit=crop&auto=format`}
              alt={`${title} movie poster - ${movie.release_date ? new Date(movie.release_date).getFullYear() : ''}`}
              loading="lazy"
              width={500}
              height={300}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                // On mobile, flip the card; on desktop, navigate to details
                if (isMobile) {
                  setIsFlipped(!isFlipped);
                } else {
                  onNavigate(movie);
                }
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            {/* Action Buttons Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
                display: isMobile ? 'none' : 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                p: 1,
                opacity: 0,
                '&:hover': { opacity: 1 },
                transition: 'opacity 0.3s ease',
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onNavigate(movie);
              }}
            >
              {/* Info/Flip Button */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                  aria-label="View available providers"
                  title="View available providers"
                  sx={{
                    pointerEvents: 'auto',
                    background: 'rgba(192, 132, 252, 0.2)',
                    border: '1px solid rgba(192, 132, 252, 0.5)',
                    color: '#c084fc',
                    '&:hover': {
                      background: 'rgba(192, 132, 252, 0.4)',
                    },
                  }}
                >
                  <Info fontSize="small" />
                </IconButton>
              </Box>

              {/* Bookmark Button */}
              <IconButton
                size="small"
                onClick={async (e) => {
                  e.stopPropagation();
                  await (isInWatchlist ? onRemove(movie) : (onAdd ? onAdd(movie) : onRemove(movie)));
                }}
                aria-label={isInWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
                title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                sx={{
                  pointerEvents: 'auto',
                  background: isInWatchlist ? 'rgba(244, 114, 182, 0.2)' : 'rgba(192, 132, 252, 0.2)',
                  border: isInWatchlist ? '1px solid rgba(244, 114, 182, 0.5)' : '1px solid rgba(192, 132, 252, 0.5)',
                  color: isInWatchlist ? '#f472b6' : '#c084fc',
                  '&:hover': {
                    background: isInWatchlist ? 'rgba(244, 114, 182, 0.4)' : 'rgba(192, 132, 252, 0.4)',
                  },
                }}
              >
                {isInWatchlist ? <BookmarkRemove fontSize="small" /> : <BookmarkAdd fontSize="small" />}
              </IconButton>
            </Box>
          </Box>
        ) : (
          // Back: Streaming Providers & Actions
          <Box
            sx={{
              width: "100%",
              height: "100%",
              minHeight: 0,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.1), rgba(244, 114, 182, 0.1))',
              transform: 'scaleX(-1)',
              cursor: isMobile ? 'pointer' : 'default',
            }}
            onClick={(e) => {
              setIsFlipped(false);
              e.stopPropagation();
            }}
          >
            {/* Title */}
            <Box
              sx={{
                textAlign: 'center',
                mb: 1,
              }}
            >
              <Box
                sx={{
                  color: '#f472b6',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </Box>
            </Box>

            {/* Available On */}
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Box sx={{ color: '#c084fc', fontWeight: 700, fontSize: '0.75rem', mb: 0.75 }}>
                AVAILABLE ON
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.75,
                  justifyContent: "center",
                }}
              >
                {getProviders()}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                justifyContent: 'center',
                mt: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                aria-label="View poster"
                title="View poster"
                sx={{
                  pointerEvents: 'auto',
                  background: 'rgba(192, 132, 252, 0.2)',
                  border: '1px solid rgba(192, 132, 252, 0.5)',
                  color: '#c084fc',
                  '&:hover': {
                    background: 'rgba(192, 132, 252, 0.4)',
                  },
                }}
              >
                <Info fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(movie);
                }}
                aria-label={`More information about ${title}`}
                title="More information"
                sx={{
                  pointerEvents: 'auto',
                  background: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  color: '#a855f7',
                  '&:hover': {
                    background: 'rgba(168, 85, 247, 0.4)',
                  },
                }}
              >
                <OpenInNew fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={async (e) => {
                  e.stopPropagation();
                  await (isInWatchlist ? onRemove(movie) : (onAdd ? onAdd(movie) : onRemove(movie)));
                }}
                aria-label={isInWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
                title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                sx={{
                  pointerEvents: 'auto',
                  background: isInWatchlist ? 'rgba(244, 114, 182, 0.2)' : 'rgba(192, 132, 252, 0.2)',
                  border: isInWatchlist ? '1px solid rgba(244, 114, 182, 0.5)' : '1px solid rgba(192, 132, 252, 0.5)',
                  color: isInWatchlist ? '#f472b6' : '#c084fc',
                  '&:hover': {
                    background: isInWatchlist ? 'rgba(244, 114, 182, 0.4)' : 'rgba(192, 132, 252, 0.4)',
                  },
                }}
              >
                {isInWatchlist ? <BookmarkRemove fontSize="small" /> : <BookmarkAdd fontSize="small" />}
              </IconButton>
            </Box>
          </Box>
        )}
      </ImageListItem>
    </motion.div>
  );
};

WatchlistFlipCard.displayName = "WatchlistFlipCard";
