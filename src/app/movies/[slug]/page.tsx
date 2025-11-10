// app/movies/[slug]/page.tsx
import { Box } from "@mui/material";
import { verifySessionToken } from "@/lib/firebase/auth";
import getCookieHeader from '@/lib/getCookieHeader';
import { getMovieDetails, getRecommendedMovies } from "@/utils/api/serverContentApi";
import Details from "@/components/details/details-page";

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
    <Details user={user} media={movie} recommended={recommended} isTv={false} />
  );
}