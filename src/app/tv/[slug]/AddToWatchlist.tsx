// app/movies/[slug]/AddToWatchlist.tsx
"use client";

import { Button } from "@mui/material";
import { Movie } from "@/data-models/movie.interface";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addToWatchList } from "@/utils/api/contentApi";

export default function AddToWatchlist({ userId, movie }: {userId: string, movie: Movie }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      if (!userId) {
        alert("Please log in to add to watchlist");
        return;
      }

      addToWatchList(userId, movie);
      
      router.refresh();
    } catch (err) {
      alert("Error adding to watchlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="contained" onClick={handleAdd} disabled={loading} fullWidth>
      {loading ? "Adding..." : "Add to Watchlist"}
    </Button>
  );
}