// app/tv/[slug]/page.tsx
import { Box } from "@mui/material";
import { verifySessionToken } from "@/lib/firebase/auth";
import getCookieHeader from '@/lib/getCookieHeader';
import { getRecommendedTV, getTVDetails } from "@/utils/api/serverContentApi";
import DetailsPageServer from "@/components/details/details-page-server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const tvShow = await getTVDetails(resolvedParams.slug);
  
  if (!tvShow) {
    return {
      title: 'TV Show Not Found',
    };
  }

  return {
    title: `${tvShow.name} (${new Date(tvShow.first_air_date).getFullYear()}) | ReelTime`,
    description: tvShow.overview || `Watch ${tvShow.name} on ReelTime`,
    openGraph: {
      title: tvShow.name,
      description: tvShow.overview,
      images: tvShow.poster_path ? [`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`] : [],
    },
  };
}

export default async function TVDetailsPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const cookieHeader = await getCookieHeader();
  const user = await verifySessionToken(cookieHeader);
  const resolvedParams = await params;
  const tvShow = await getTVDetails(resolvedParams.slug);

  if (!tvShow) return (
    <Box sx={{ color: "white" }}>TV Show not found.</Box>
  );

  const recommended = await getRecommendedTV(tvShow.genres?.[0]?.id || 0);

  return (
    <DetailsPageServer user={user} media={tvShow} recommended={recommended} isTv={true} />
  );
}
