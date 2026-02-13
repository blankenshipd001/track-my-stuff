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
        onClick={handleToggle} 
        disabled={loading || checkingWatchlist} 
        fullWidth
        sx={{
          background: isInWatchlist 
            ? 'transparent' 
            : 'linear-gradient(to right, #c084fc, #f472b6)',
          color: '#fff',
          border: isInWatchlist 
            ? '2px solid rgba(192, 132, 252, 0.5)' 
            : 'none',
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '1rem',
          py: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            background: isInWatchlist 
              ? 'rgba(192, 132, 252, 0.1)' 
              : 'linear-gradient(to right, #a855f7, #ec4899)',
            borderColor: isInWatchlist 
              ? 'rgba(192, 132, 252, 0.8)' 
              : 'none',
          },
          '&:disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        }}
      >
        {buttonText}
      </Button>
      {NotificationBarComponent}
    </>
  );
}