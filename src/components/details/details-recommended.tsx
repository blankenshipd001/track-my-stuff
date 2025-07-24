import React from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import Recommended from "@/components/recommended/Recommended";

import { Media } from "@/data-models/media.interface";

export default function DetailsRecommended({ recommended, isTv }: { recommended: Media[]; isTv: boolean }) {
  const router = useRouter();

  const handleClickEvent = (movie: Media) => {
    router.push(`/${isTv ? "tv" : "movies"}/${movie.id}`, { scroll: false });
  };

  {/* Media Gallery */}
  return (
    <Box mt={4}>
      <Typography variant="h5" color="text.primary" gutterBottom>
        You May Also Like
      </Typography>
      <Recommended shows={recommended} handleClick={handleClickEvent} />
    </Box>
  );
}
