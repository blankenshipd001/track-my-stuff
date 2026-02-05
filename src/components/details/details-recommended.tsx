import React from "react";
import { Box, Typography } from "@mui/material";
import RecommendedClient from "@/components/recommended/recommended-client";
import { Media } from "@/data-models/media.interface";

export default function DetailsRecommended({ recommended, isTv }: { recommended: Media[]; isTv: boolean }) {
  return (
    <Box mt={4}>
      <Typography variant="h5" color="text.primary" gutterBottom>
        You May Also Like
      </Typography>
      <RecommendedClient shows={recommended} isTv={isTv} />
    </Box>
  );
}
