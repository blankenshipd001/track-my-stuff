// app/movies/[slug]/page.tsx
import { Box } from "@mui/material";
import { verifySessionToken } from "@/lib/firebase/auth";
import getCookieHeader from '@/lib/getCookieHeader';
import { getMovieDetails, getRecommendedMovies, fetchPopularContent } from "@/utils/api/serverContentApi";
import DetailsPageServer from "@/components/details/details-page-server";
import { Metadata } from "next";
import { Suspense } from "react";
import MovieLoading from "./loading";

/**
 * Generate static params for popular movies at build time
 * Pre-renders the top 50 most popular movies to improve initial load performance
 */
export async function generateStaticParams() {
  try {
    const popular = await fetchPopularContent();
    return popular.slice(0, 50).map((movie: any) => ({
      slug: movie.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params for movies:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const movie = await getMovieDetails(resolvedParams.slug);
  
  if (!movie) {
    return {
      title: 'Movie Not Found',
    };
  }

  return {
    title: `${movie.title} (${new Date(movie.release_date).getFullYear()}) | ReelTime`,
    description: movie.overview || `Watch ${movie.title} on ReelTime`,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: movie.poster_path ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] : [],
    },
  };
}

export default async function MovieDetailsPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const movie = await getMovieDetails(resolvedParams.slug);

  if (!movie) return (
    <Box sx={{ color: "white" }}>Movie not found.</Box>
  );

  return (
    <Suspense fallback={<MovieLoading />}>
      <MovieDetailsContent params={resolvedParams} movie={movie} />
    </Suspense>
  );
}

async function MovieDetailsContent({ params, movie }: { params: { slug: string }; movie: any }) {
  const cookieHeader = await getCookieHeader();
  const user = await verifySessionToken(cookieHeader);
  const recommended = await getRecommendedMovies(movie.genres?.[0]?.id || 0);
  
  return (
    <DetailsPageServer user={user} media={movie} recommended={recommended} isTv={false} />
  );
}