// app/tv/[slug]/page.tsx
import { Box } from "@mui/material";
import { verifySessionToken } from "@/lib/firebase/auth";
import getCookieHeader from '@/lib/getCookieHeader';
import { getRecommendedTV, getTVDetails, fetchPopularTV } from "@/utils/api/serverContentApi";
import DetailsPageServer from "@/components/details/details-page-server";
import { Metadata } from "next";
import { Suspense } from "react";
import TVLoading from "./loading";
import { Media } from "@/data-models/media.interface";

/**
 * Generate static params for popular TV shows at build time
 * Pre-renders the top 50 most popular TV shows to improve initial load performance
 */
export async function generateStaticParams() {
  try {
    const popular = await fetchPopularTV();
    return popular.slice(0, 50).map((show: Media) => ({
      slug: show?.id?.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params for TV shows:', error);
    return [];
  }
}

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
  const resolvedParams = await params;
  const tvShow = await getTVDetails(resolvedParams.slug);

  if (!tvShow) return (
    <Box sx={{ color: "white" }}>TV Show not found.</Box>
  );

  return (
    <Suspense fallback={<TVLoading />}>
      <TVDetailsContent params={resolvedParams} tvShow={tvShow} />
    </Suspense>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function TVDetailsContent({ params, tvShow }: { params: { slug: string }; tvShow: Media }) {
  const cookieHeader = await getCookieHeader();
  const user = await verifySessionToken(cookieHeader);
  const recommended = await getRecommendedTV(tvShow.genres?.[0]?.id || 0);

  return (
    <DetailsPageServer user={user} media={tvShow} recommended={recommended} isTv={true} />
  );
}
