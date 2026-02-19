"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, IconButton } from '@mui/material';
import Link from 'next/link';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { COLORS, GRADIENTS, SHADOWS, TRANSITIONS, BORDER_RADIUS } from '@/lib/theme-constants';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  popularity?: number;
  order?: number;
}

interface CastSectionProps {
  cast: CastMember[];
}

const FlipCard: React.FC<{ castMember: CastMember }> = ({ castMember }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const containerVariants = {
    rest: { rotateY: 0 },
    hover: { rotateY: 180 },
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
        cursor: 'pointer',
        flexShrink: 0,
        width: '100%',
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <Card
        sx={{
          height: '100%',
          borderRadius: BORDER_RADIUS.md,
          border: `1px solid ${COLORS.purple[300]}`,
          background: GRADIENTS.cardLight,
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          transition: TRANSITIONS.default,
          '&:hover': {
            borderColor: COLORS.purple[600],
            boxShadow: SHADOWS.cardHover,
          },
        }}
      >
        {!isFlipped ? (
          // Front: Profile Picture
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '2 / 3',
              overflow: 'hidden',
              borderRadius: '8px 8px 0 0',
            }}
          >
            {castMember.profile_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w185${castMember.profile_path}`}
                alt={castMember.name}
                fill
                className="object-cover"
                sizes="120px"
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  background: GRADIENTS.purpleShade,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.6rem',
                  textAlign: 'center',
                  p: 0.5,
                }}
              >
                No Image
              </Box>
            )}
          </Box>
        ) : (
          // Back: Info
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 1.5,
              background: GRADIENTS.flipCardBack,
              justifyContent: 'space-between',
              transform: 'rotateY(180deg)',
            }}
          >
            <Box>
              {/* Character Name */}
              <Typography
                variant="body2"
                sx={{
                  color: COLORS.pink.solid,
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {castMember.character}
              </Typography>
              
              {/* Actor Name */}
              <Typography
                variant="body2"
                sx={{
                  color: COLORS.purple.solid,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  mb: 0.75,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {castMember.name}
              </Typography>
              
              {/* Popularity */}
              {castMember.popularity && (
                <Typography
                  variant="caption"
                  sx={{
                    color: COLORS.gray[400],
                    fontSize: '0.65rem',
                    display: 'block',
                    mb: 0.5,
                  }}
                >
                  Popularity: {Math.round(castMember.popularity * 10) / 10}
                </Typography>
              )}
              
              {/* Order */}
              {castMember.order !== undefined && (
                <Typography
                  variant="caption"
                  sx={{
                    color: COLORS.gray[400],
                    fontSize: '0.65rem',
                  }}
                >
                  #{castMember.order + 1} in cast
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <CardContent
          sx={{
            p: 0.75,
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderTop: `1px solid ${COLORS.purple[200]}`,
            transform: isFlipped ? 'rotateY(180deg)' : 'none',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: COLORS.gray[300],
              fontSize: '0.7rem',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {isFlipped ? 'Flip back' : castMember.character}
          </Typography>
          <Button
            component={Link}
            href={`/cast/${castMember.id}`}
            size="small"
            sx={{
              background: COLORS.purpleDark.solid,
              color: 'white',
              textTransform: 'none',
              fontSize: '0.75rem',
              p: '4px 8px',
              minWidth: 'auto',
              fontWeight: 600,
              transition: TRANSITIONS.fast,
              '&:hover': {
                background: COLORS.purpleDark.solidHover,
                boxShadow: SHADOWS.buttonHover,
              },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            More
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function CastSection({ cast }: CastSectionProps) {
  // Filter cast to top 20 and ensure they have names
  const topCast = cast
    .filter((member) => member.name && member.character)
    .slice(0, 20);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  if (!topCast.length) {
    return null;
  }

  return (
    <Box sx={{ mt: 3, mb: 4 }}>
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          mb: 2,
          background: GRADIENTS.textPurplePink,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Cast
      </Typography>
      
      {/* Carousel wrapper with navigation arrows */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Left Arrow */}
        <IconButton
          aria-label="Scroll cast carousel left"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          sx={{
            display: { xs: 'none', sm: 'flex' },
            color: canScrollLeft ? COLORS.purple.solid : COLORS.gray[600],
            border: canScrollLeft ? `1px solid ${COLORS.purple[500]}` : `1px solid ${COLORS.purple[100]}`,
            borderRadius: BORDER_RADIUS.sm,
            p: 0.5,
            transition: TRANSITIONS.default,
            '&:hover:not(:disabled)': {
              background: COLORS.purple[100],
              borderColor: COLORS.purple[800],
            },
            '&:disabled': {
              cursor: 'not-allowed',
            },
          }}
        >
          <ChevronLeft fontSize="small" />
        </IconButton>
        
        {/* Scrollable Carousel Container */}
        <Box
          ref={carouselRef}
          onScroll={checkScroll}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 1.5,
            pb: 1,
            px: 0,
            scrollBehavior: 'smooth',
            flex: 1,
            
            // Scrollbar styling
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: COLORS.purple[50],
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: COLORS.purple[300],
              borderRadius: '8px',
              '&:hover': {
                background: COLORS.purple[500],
              },
            },
            
            // Firefox scrollbar
            scrollbarColor: `${COLORS.purple[300]} ${COLORS.purple[50]}`,
            scrollbarWidth: 'thin',
          }}
        >
          {topCast.map((member) => (
            <Box
              key={member.id}
              sx={{
                width: { xs: 100, sm: 120, md: 140 },
                flexShrink: 0,
              }}
            >
              <FlipCard castMember={member} />
            </Box>
          ))}
        </Box>
        
        {/* Right Arrow */}
        <IconButton
          aria-label="Scroll cast carousel right"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          sx={{
            display: { xs: 'none', sm: 'flex' },
            color: canScrollRight ? COLORS.purple.solid : COLORS.gray[600],
            border: canScrollRight ? `1px solid ${COLORS.purple[500]}` : `1px solid ${COLORS.purple[100]}`,
            borderRadius: BORDER_RADIUS.sm,
            p: 0.5,
            transition: TRANSITIONS.default,
            '&:hover:not(:disabled)': {
              background: COLORS.purple[100],
              borderColor: COLORS.purple[800],
            },
            '&:disabled': {
              cursor: 'not-allowed',
            },
          }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>
      
      {/* Scroll hint on mobile */}
      <Typography
        variant="caption"
        sx={{
          display: { xs: 'block', sm: 'none' },
          color: COLORS.gray[400],
          mt: 1,
          fontSize: '0.7rem',
          textAlign: 'center',
        }}
      >
        ← Swipe to see more
      </Typography>
    </Box>
  );
}
