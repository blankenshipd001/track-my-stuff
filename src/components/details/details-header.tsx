import React from "react"
import { useRouter } from "next/navigation";
import { ArrowBack } from "@mui/icons-material";
import { Button, Stack, useMediaQuery, useTheme } from "@mui/material";
import AddToWatchlist from "@/components/buttons/AddToWatchlist";
import { Movie } from "@/data-models/movie.interface";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DetailsHeader({user, media}: { user: any; media: Movie }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isLargeScreen = useMediaQuery("(min-width:1200px)");

    {/* Header: Back button + Add to Watchlist */}
    return (
        <Stack direction={isMobile ? "column" : "row"} spacing={2} mb={3} alignItems={isMobile ? "flex-start" : "center"} justifyContent={isLargeScreen ? "space-between" : "flex-start"}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            variant="outlined"
            color="primary"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              width: isMobile ? "100%" : "auto",
              "&:hover": {
                borderColor: theme.palette.primary.dark,
                backgroundColor: theme.palette.primary.light,
              },
            }}
          >
            Back
          </Button>          
          <AddToWatchlist user={user} movie={media} />
        </Stack>
    );
}