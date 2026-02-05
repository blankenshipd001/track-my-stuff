import { useEffect, useState } from "react";
import { getContent } from "@/utils/api/contentApi";
import { Media } from "@/data-models/media.interface";

/**
 * Hook to check if a specific movie/TV show is in the user's watchlist
 * @param uid User ID
 * @param movieId The ID of the movie/TV show to check
 * @returns Object with isInWatchlist boolean and refetch function
 */
export const useIsInWatchlist = (uid: string | undefined, movieId: number | undefined) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkWatchlist = async () => {
    if (!uid || !movieId) {
      setIsInWatchlist(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const watchlist: Media[] = await getContent(uid);
      const found = watchlist.some((item) => item.movieId === movieId || item.id === movieId);
      setIsInWatchlist(found);
    } catch (error) {
      console.error("Error checking watchlist:", error);
      setIsInWatchlist(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkWatchlist();
  }, [uid, movieId]);

  return { isInWatchlist, loading, refetch: checkWatchlist };
};
