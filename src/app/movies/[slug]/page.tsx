// app/movies/[slug]/page.tsx
import { Box } from "@mui/material";
import { verifySessionToken } from "@/lib/firebase/auth";
import getCookieHeader from '@/lib/getCookieHeader';
import { getMovieDetails, getRecommendedMovies } from "@/utils/api/serverContentApi";
import DetailsPageServer from "@/components/details/details-page-server";
import { Metadata } from "next";

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
  const cookieHeader = await getCookieHeader();
  const user = await verifySessionToken(cookieHeader);
  const resolvedParams = await params;
  const movie = await getMovieDetails(resolvedParams.slug);

  if (!movie) return (
    <Box sx={{ color: "white" }}>Movie not found.</Box>
  );

  const recommended = await getRecommendedMovies(movie.genres?.[0]?.id || 0);
  
  return (
    <DetailsPageServer user={user} media={movie} recommended={recommended} isTv={false} />
  );
}