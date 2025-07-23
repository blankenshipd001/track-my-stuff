// app/movies/[slug]/page.tsx
import { Box } from "@mui/material";
import { verifySessionToken } from "@/lib/firebase/auth";
import { cookies } from "next/headers";
import { getMovieDetails, getRecommendedMovies } from "@/utils/api/serverContentApi";
import Details from "@/components/details/details-page";

export default async function MovieDetailsPage({ params }: { params: { slug: string } }) {
  const user = await verifySessionToken(cookies().toString());
  const movie = await getMovieDetails(params.slug);

  if (!movie) return (
    <Box sx={{ color: "white" }}>Movie not found.</Box>
  );

  const recommended = await getRecommendedMovies(movie.genres?.[0]?.id || 0);

  return (
    <Details user={user} media={movie} recommended={recommended} isTv={false} />
  );
}