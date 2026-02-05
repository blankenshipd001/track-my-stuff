// app/movies/[slug]/AddToWatchlist.tsx
"use client";

import { Button } from "@mui/material";
import { Media } from "@/data-models/media.interface";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addToWatchList, requestRemoveFromWatchList } from "@/utils/api/contentApi";
import useNotificationBar from "@/components/notifications/useNotificationBar";
import { useIsInWatchlist } from "@/hooks/useIsInWatchlist";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AddToWatchlist({ user, movie }: {user: any, movie: Media }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();
  const { isInWatchlist, loading: checkingWatchlist, refetch } = useIsInWatchlist(user?.uid, movie?.movieId || movie?.id);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (!user && !user.uid) {
        enqueueNotificationBar("Please log in to save movies.", "info");
        return;
      }

      if (isInWatchlist) {
        // Remove from watchlist
        await requestRemoveFromWatchList(user.uid, movie);
        enqueueNotificationBar("Removed from your watch list!", "success");
      } else {
        // Add to watchlist
        await addToWatchList(user.uid, movie);
        enqueueNotificationBar("Added to your watch list!", "success");
      }
      
      await refetch();
      router.refresh();
    } catch (err) {
      enqueueNotificationBar(`Error: ${err}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const buttonText = loading 
    ? (isInWatchlist ? "Removing..." : "Adding...") 
    : (isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist");

  return (
    <>
      <Button 
        variant={isInWatchlist ? "outlined" : "contained"} 
        onClick={handleToggle} 
        disabled={loading || checkingWatchlist} 
        fullWidth
      >
        {buttonText}
      </Button>
      {NotificationBarComponent}
    </>
  );
}