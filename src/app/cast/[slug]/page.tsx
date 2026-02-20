import React from 'react';
import { Box, Container, Typography, Paper, Card, CardContent, Chip } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCastMemberDetails } from '@/services';
import { Metadata } from 'next';
import { BackButton } from '@/components/buttons/back-button';
import { Breadcrumb } from '@/components/breadcrumb/breadcrumb';
import { generatePersonSchema } from '@/lib/schema-markup';
import { COLORS, GRADIENTS, SHADOWS, TRANSITIONS, BORDER_RADIUS } from '@/lib/theme-constants';
import { Credit } from '@/data-models/credit.interface';

/**
 * Helper function to process cast member details with sorted filmography
 */
async function getProcessedCastMemberDetails(castId: string) {
  try {
    const person = await fetchCastMemberDetails(castId);
    
    if (!person) return null;

    // Combine and sort movie and TV credits by popularity/date
    const allCredits = [
      ...(person.combined_credits?.cast || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((credit: any) => ({
          ...credit,
          media_type: credit.media_type || (credit.title ? 'movie' : 'tv'),
        }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ].sort((a: any, b: any) => {
      const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
      const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();
      return dateB - dateA; // Most recent first
    });

    return {
      ...person,
      filmography: allCredits.slice(0, 50), // Top 50 works
    };
  } catch (error) {
    console.error('Error fetching cast member details:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const castMember = await getProcessedCastMemberDetails(resolvedParams.slug);

  if (!castMember) {
    return {
      title: 'Cast Member Not Found',
    };
  }

  return {
    title: `${castMember.name} - Actor | ReelTime`,
    description: castMember.biography ? `${castMember.biography.slice(0, 155)}... See ${castMember.name}'s filmography on ReelTime` : `${castMember.name}'s filmography and movies on ReelTime`,
    keywords: `${castMember.name}, actor, actress, filmography, movies, TV shows`,
    alternates: {
      canonical: `https://reeltime.app/cast/${castMember.id}`,
    },
    openGraph: {
      title: `${castMember.name} - Actor`,
      description: castMember.biography?.slice(0, 155),
      images: castMember.profile_path ? [`https://image.tmdb.org/t/p/w500${castMember.profile_path}`] : [],
      type: 'profile',
      url: `https://reeltime.app/cast/${castMember.id}`,
    },
    twitter: {
      card: 'summary',
      title: `${castMember.name} - Actor`,
      description: castMember.biography?.slice(0, 200),
      images: castMember.profile_path ? [`https://image.tmdb.org/t/p/w500${castMember.profile_path}`] : [],
    },
  };
}

export default async function CastMemberPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const castMember = await getProcessedCastMemberDetails(resolvedParams.slug);

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
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Cast', url: '/cast' },
    { name: castMember.name, url: `/cast/${castMember.id}` },
  ];
  const schema = generatePersonSchema(castMember);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Breadcrumb items={breadcrumbItems} />
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
                border: `2px solid ${COLORS.purple[500]}`,
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
                  background: GRADIENTS.textPurplePink,
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
                    background: COLORS.purple[200],
                    color: COLORS.purple.solid,
                    borderColor: COLORS.purple[500],
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
                color: COLORS.purple.solid,
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Biography
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: COLORS.gray[300],
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
            background: GRADIENTS.textPurplePink,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Filmography ({filmography.length})
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2 }}>
          {filmography.map((work: Credit) => {
            const isMovie = work.media_type === 'movie';
            const title = isMovie ? work.title : work.name;
            const date = isMovie ? work.release_date : work.first_air_date;
            const posterPath = work.poster_path;

            return (
              <Box key={`${work.media_type}-${work.id}-${work.credit_id}`}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: BORDER_RADIUS.sm,
                    border: `1px solid ${COLORS.purple[300]}`,
                    background: 'rgba(17, 24, 39, 0.8)',
                    backdropFilter: 'blur(10px)',
                    transition: TRANSITIONS.default,
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      borderColor: COLORS.purple[600],
                      boxShadow: SHADOWS.cardHover,
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
                          alt={title ?? 'Poster'}
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
                          color: COLORS.purple.solid,
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
                            color: COLORS.pink.solid,
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
                          color: COLORS.gray[400],
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
