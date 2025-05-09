// app/movies/[slug]/AddToWatchlist.tsx
"use client";

import { Button } from "@mui/material";
import { Movie } from "@/data-models/movie.interface";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addToWatchList } from "@/utils/api/contentApi";
import useNotificationBar from "@/components/notifications/useNotificationBar";

export default function AddToWatchlist({ userId, movie }: {userId: string, movie: Movie }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();

  const handleAdd = async () => {
    setLoading(true);
    try {
      if (!userId) {
        enqueueNotificationBar("Please log in to save movies.", "info");
        return;
      }

      addToWatchList(userId, movie);
      enqueueNotificationBar("Added to your watch list!", "success");
      router.refresh();
    } catch (err) {
      enqueueNotificationBar(`Error: ${err}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleAdd} disabled={loading} fullWidth>
        {loading ? "Adding..." : "Add to Watchlist"}
      </Button>
      {NotificationBarComponent}
    </>
  );
}