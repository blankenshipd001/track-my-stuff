// app/tv/[slug]/page.tsx
import { Box } from "@mui/material";
import { verifySessionToken } from "@/lib/firebase/auth";
import getCookieHeader from '@/lib/getCookieHeader';
import { getRecommendedTV, getTVDetails } from "@/utils/api/serverContentApi";
import Details from "@/components/details/details-page";

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
    <Details user={user} media={tvShow} recommended={recommended} isTv={true} />
  );
}
