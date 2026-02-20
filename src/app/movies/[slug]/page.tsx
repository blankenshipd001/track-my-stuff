// app/movies/[slug]/page.tsx
import { Box } from "@mui/material";
import { verifySessionToken } from "@/lib/firebase/auth";
import getCookieHeader from '@/lib/getCookieHeader';
import { fetchMovieDetails, fetchRecommendedMovies, fetchPopularMoviesWithProviders } from "@/services";
import DetailsPageServer from "@/components/details/details-page-server";
import { Metadata } from "next";
import { Suspense } from "react";
import MovieLoading from "./loading";
import { Genre, Media } from "@/data-models/media.interface";
import { generateMovieSchema } from "@/lib/schema-markup";
import { User } from "@/data-models/user.interface";


/**
 * Generate static params for popular movies at build time
 * Pre-renders the top 50 most popular movies to improve initial load performance
 */
export async function generateStaticParams() {
  try {
    const popular = await fetchPopularMoviesWithProviders() as Media[];
    return popular.slice(0, 50).map((movie: Media) => ({
      slug: movie?.id?.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params for movies:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  let movie;
  try {
    movie = await fetchMovieDetails(resolvedParams.slug);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    movie = null;
  }
  
  if (!movie) {
    return {
      title: 'Movie Not Found',
    };
  }

  const year = new Date(movie.release_date).getFullYear();
  const genreNames = movie.genres?.map((g: Genre) => g.name).join(', ');
  
  const keywordString = `${movie.title}, movie, ${year}, ${genreNames || 'film'}`;

  return {
    title: `${movie.title} (${year}) | ReelTime`,
    description: movie.overview ? `${movie.overview.slice(0, 155)}... Watch ${movie.title} on ReelTime` : `Watch ${movie.title} on ReelTime. Streaming information and details for ${movie.title}.`,
    keywords: keywordString,
    alternates: {
      canonical: `https://reeltime.app/movies/${movie.id}`,
    },
    openGraph: {
      title: `${movie.title} (${year})`,
      description: movie.overview || `Watch ${movie.title} on ReelTime`,
      images: movie.poster_path ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] : [],
      type: 'video.movie',
      url: `https://reeltime.app/movies/${movie.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${movie.title} (${year})`,
      description: movie.overview?.slice(0, 200),
      images: movie.poster_path ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] : [],
    },
  };
}

export default async function MovieDetailsPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let movie;
  try {
    movie = await fetchMovieDetails(resolvedParams.slug);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    movie = null;
  }

  if (!movie) return (
    <Box sx={{ color: "white" }}>Movie not found.</Box>
  );

  // Generate schema markup
  const schema = generateMovieSchema(movie);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Suspense fallback={<MovieLoading />}>
        <MovieDetailsContent params={resolvedParams} movie={movie} />
      </Suspense>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function MovieDetailsContent({ params, movie }: { params: { slug: string }; movie: Media }) {
  const cookieHeader = await getCookieHeader();
  const user: User | null = await verifySessionToken(cookieHeader);
  const recommended = await fetchRecommendedMovies(movie.genres?.[0]?.id?.toString() || '0');

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Movies', url: '/movies' },
    { name: movie.title || 'Movie', url: `/movies/${movie.id}` },
  ];
  
  return (
    <DetailsPageServer
      user={user}
      media={movie}
      recommended={recommended}
      isTv={false}
      breadcrumbItems={breadcrumbItems}
    />
  );
}