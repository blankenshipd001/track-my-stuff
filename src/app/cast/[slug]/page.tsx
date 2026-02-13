/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Box, Container, Typography, Paper, Card, CardContent, Chip } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { getCastMemberDetails } from '@/utils/api/serverContentApi';
import { Metadata } from 'next';
import { BackButton } from '@/components/buttons/back-button';

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const castMember = await getCastMemberDetails(resolvedParams.slug);

  if (!castMember) {
    return {
      title: 'Cast Member Not Found',
    };
  }

  return {
    title: `${castMember.name} | ReelTime`,
    description: castMember.biography || `${castMember.name}'s filmography on ReelTime`,
  };
}

export default async function CastMemberPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const castMember = await getCastMemberDetails(resolvedParams.slug);

  if (!castMember) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ color: 'white', textAlign: 'center' }}>
          <Typography variant="h5">Cast member not found</Typography>
        </Box>
      </Container>
    );
  }

  const filmography = castMember.filmography || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section with Profile */}
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.05)',
          mb: 4,
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 1fr', md: '200px 1fr' }, gap: 3 }}>
          {/* Profile Picture */}
          <Box>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '2 / 3',
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid rgba(192, 132, 252, 0.5)',
              }}
            >
              {castMember.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${castMember.profile_path}`}
                  alt={castMember.name}
                  fill
                  className="object-cover"
                  priority
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
                    fontSize: '1.5rem',
                  }}
                >
                  No Photo
                </Box>
              )}
            </Box>
          </Box>

          {/* Profile Info */}
          <Box>
            <Box>
              <Typography
                variant="h3"
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
                {castMember.name}
              </Typography>

              {castMember.known_for_department && (
                <Chip
                  label={`Known for: ${castMember.known_for_department}`}
                  sx={{
                    mb: 2,
                    background: 'rgba(192, 132, 252, 0.2)',
                    color: '#c084fc',
                    borderColor: 'rgba(192, 132, 252, 0.5)',
                  }}
                  variant="outlined"
                />
              )}

              {castMember.birthday && (
                <Typography variant="body1" sx={{ color: '#d1d5db', mb: 1 }}>
                  <strong>Born:</strong> {new Date(castMember.birthday).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              )}

              {castMember.place_of_birth && (
                <Typography variant="body1" sx={{ color: '#d1d5db', mb: 1 }}>
                  <strong>Place of Birth:</strong> {castMember.place_of_birth}
                </Typography>
              )}

              {castMember.popularity && (
                <Typography variant="body1" sx={{ color: '#d1d5db' }}>
                  <strong>Popularity:</strong> {Math.round(castMember.popularity * 10) / 10}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Biography */}
        {castMember.biography && (
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(75, 85, 99, 0.3)' }}>
            <Typography
              variant="h6"
              sx={{
                color: '#c084fc',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Biography
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#d1d5db',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
              }}
            >
              {castMember.biography}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Filmography Section */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            mb: 3,
            background: 'linear-gradient(to right, #c084fc, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Filmography ({filmography.length})
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2 }}>
          {filmography.map((work: any) => {
            const isMovie = work.media_type === 'movie';
            const title = isMovie ? work.title : work.name;
            const date = isMovie ? work.release_date : work.first_air_date;
            const posterPath = work.poster_path;

            return (
              <Box key={`${work.media_type}-${work.id}-${work.credit_id}`}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 1,
                    border: '1px solid rgba(192, 132, 252, 0.3)',
                    background: 'rgba(17, 24, 39, 0.8)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      borderColor: 'rgba(192, 132, 252, 0.6)',
                      boxShadow: '0 8px 32px rgba(192, 132, 252, 0.2)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  {posterPath && (
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '2 / 3',
                        overflow: 'hidden',
                      }}
                    >
                      <Link href={isMovie ? `/movies/${work.id}` : `/tv/${work.id}`}>
                        <Image
                          src={`https://image.tmdb.org/t/p/w342${posterPath}`}
                          alt={title}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </Link>
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Link href={isMovie ? `/movies/${work.id}` : `/tv/${work.id}`}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#c084fc',
                          fontWeight: '600',
                          mb: 0.5,
                          fontSize: '0.85rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          cursor: 'pointer',
                          '&:hover': {
                            color: '#f472b6',
                          },
                        }}
                      >
                        {title}
                      </Typography>
                    </Link>

                    {date && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#9ca3af',
                          fontSize: '0.75rem',
                          display: 'block',
                          mb: 0.5,
                        }}
                      >
                        {new Date(date).getFullYear()}
                      </Typography>
                    )}

                    {work.character && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#6b7280',
                          fontSize: '0.7rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        as {work.character}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Back Button */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <BackButton />
      </Box>
    </Container>
  );
}
