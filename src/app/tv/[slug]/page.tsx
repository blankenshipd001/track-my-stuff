// app/tv/[slug]/page.tsx
import { Box } from "@mui/material";
import { verifySessionToken } from "@/lib/firebase/auth";
import { cookies } from "next/headers";
import { getRecommendedTV, getTVDetails } from "@/utils/api/serverContentApi";
import Details from "@/components/details/details-page";

export default async function TVDetailsPage({ params }: { params: { slug: string } }) {
  const user = await verifySessionToken(cookies().toString());
  const tvShow = await getTVDetails(params.slug);

  if (!tvShow) return (
    <Box sx={{ color: "white" }}>TV Show not found.</Box>
  );

  const recommended = await getRecommendedTV(tvShow.genres?.[0]?.id || 0);

  return (
    <Details user={user} media={tvShow} recommended={recommended} isTv={true} />
  );
}
