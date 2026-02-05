import React from "react";
import { Stack } from "@mui/material";
import AddToWatchlist from "@/components/buttons/AddToWatchlist";
import { Media } from "@/data-models/media.interface";
import BackButton from "./details-header-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DetailsHeaderServer({ user, media }: { user: any; media: Media }) {
  return (
    <Stack 
      direction={{ xs: "column", sm: "row" }} 
      spacing={2} 
      mb={3} 
      alignItems={{ xs: "flex-start", sm: "center" }} 
      justifyContent={{ xs: "flex-start", xl: "space-between" }}
    >
      <BackButton />
      <AddToWatchlist user={user} movie={media} />
    </Stack>
  );
}
