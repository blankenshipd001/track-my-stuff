// app/tv/[slug]/page.tsx
import { Box } from "@mui/material";
import { verifySessionToken } from "@/lib/firebase/auth";
import getCookieHeader from '@/lib/getCookieHeader';
import { fetchRecommendedTV, fetchTVDetails, fetchPopularTV } from "@/services";
import DetailsPageServer from "@/components/details/details-page-server";
import { Metadata } from "next";
import { Suspense } from "react";
import TVLoading from "./loading";
import { Genre, Media } from "@/data-models/media.interface";
import { generateTVSchema } from "@/lib/schema-markup";
import { User } from "@/data-models/user.interface";

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
  const tvShow = await fetchTVDetails(resolvedParams.slug);
  
  if (!tvShow) {
    return {
      title: 'TV Show Not Found',
    };
  }

  const year = new Date(tvShow.first_air_date).getFullYear();
  const genreNames = tvShow.genres?.map((g: Genre) => g.name).join(', ');
  const keywordString = `${tvShow.name}, TV show, series, ${year}, ${genreNames || 'television'}`;

  return {
    title: `${tvShow.name} (${year}) | ReelTime`,
    description: tvShow.overview ? `${tvShow.overview.slice(0, 155)}... Watch ${tvShow.name} on ReelTime` : `Watch ${tvShow.name} on ReelTime. Streaming information and details for ${tvShow.name}.`,
    keywords: keywordString,
    alternates: {
      canonical: `https://reeltime.app/tv/${tvShow.id}`,
    },
    openGraph: {
      title: `${tvShow.name} (${year})`,
      description: tvShow.overview || `Watch ${tvShow.name} on ReelTime`,
      images: tvShow.poster_path ? [`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`] : [],
      type: 'video.tv_show',
      url: `https://reeltime.app/tv/${tvShow.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tvShow.name} (${year})`,
      description: tvShow.overview?.slice(0, 200),
      images: tvShow.poster_path ? [`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`] : [],
    },
  };
}

export default async function TVDetailsPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let tvShow;
  try {
    tvShow = await fetchTVDetails(resolvedParams.slug);
  } catch (error) {
    console.error('Error fetching TV details:', error);
    tvShow = null;
  }

  if (!tvShow) return (
    <Box sx={{ color: "white" }}>TV Show not found.</Box>
  );

  // Generate schema markup
  const schema = generateTVSchema(tvShow);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Suspense fallback={<TVLoading />}>
        <TVDetailsContent params={resolvedParams} tvShow={tvShow} />
      </Suspense>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function TVDetailsContent({ params, tvShow }: { params: { slug: string }; tvShow: Media }) {
  const cookieHeader = await getCookieHeader();
  const user: User | null = await verifySessionToken(cookieHeader);
  const recommended = await fetchRecommendedTV(tvShow.genres?.[0]?.id?.toString() || '0');

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'TV Shows', url: '/tv' },
    { name: tvShow.name || 'Show', url: `/tv/${tvShow.id}` },
  ];

  return (
    <DetailsPageServer
      user={user}
      media={tvShow}
      recommended={recommended}
      isTv={true}
      breadcrumbItems={breadcrumbItems}
    />
  );
}
