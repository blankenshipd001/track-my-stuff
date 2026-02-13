"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, IconButton } from '@mui/material';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
          borderRadius: 1.5,
          border: '1px solid rgba(192, 132, 252, 0.3)',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.8))',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(192, 132, 252, 0.6)',
            boxShadow: '0 8px 32px rgba(192, 132, 252, 0.2)',
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.1), rgba(244, 114, 182, 0.1))',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              {/* Character Name */}
              <Typography
                variant="body2"
                sx={{
                  color: '#f472b6',
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
                  color: '#c084fc',
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
                    color: '#9ca3af',
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
                    color: '#9ca3af',
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
            borderTop: '1px solid rgba(192, 132, 252, 0.2)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#d1d5db',
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
              background: '#a855f7',
              color: 'white',
              textTransform: 'none',
              fontSize: '0.75rem',
              p: '4px 8px',
              minWidth: 'auto',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              '&:hover': {
                background: '#9333ea',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
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
    <Box sx={{ mt: 6, mb: 4 }}>
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          mb: 2,
          background: 'linear-gradient(to right, #c084fc, #f472b6)',
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
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          sx={{
            display: { xs: 'none', sm: 'flex' },
            color: canScrollLeft ? '#c084fc' : '#4b5563',
            border: canScrollLeft ? '1px solid rgba(192, 132, 252, 0.5)' : '1px solid rgba(192, 132, 252, 0.1)',
            borderRadius: 1,
            p: 0.5,
            transition: 'all 0.3s ease',
            '&:hover:not(:disabled)': {
              background: 'rgba(192, 132, 252, 0.1)',
              borderColor: 'rgba(192, 132, 252, 0.8)',
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
              background: 'rgba(192, 132, 252, 0.05)',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(192, 132, 252, 0.3)',
              borderRadius: '8px',
              '&:hover': {
                background: 'rgba(192, 132, 252, 0.5)',
              },
            },
            
            // Firefox scrollbar
            scrollbarColor: 'rgba(192, 132, 252, 0.3) rgba(192, 132, 252, 0.05)',
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
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          sx={{
            display: { xs: 'none', sm: 'flex' },
            color: canScrollRight ? '#c084fc' : '#4b5563',
            border: canScrollRight ? '1px solid rgba(192, 132, 252, 0.5)' : '1px solid rgba(192, 132, 252, 0.1)',
            borderRadius: 1,
            p: 0.5,
            transition: 'all 0.3s ease',
            '&:hover:not(:disabled)': {
              background: 'rgba(192, 132, 252, 0.1)',
              borderColor: 'rgba(192, 132, 252, 0.8)',
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
          color: '#9ca3af',
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
