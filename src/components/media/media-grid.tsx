// app/components/MediaGrid.tsx
"use client";

import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Media } from "@/data-models/media.interface";

import { useMediaQuery, useTheme, Button, Box, CircularProgress } from "@mui/material";

import ImageList from "@mui/material/ImageList";
import useNotificationBar from "@/components/notifications/useNotificationBar";
import { requestRemoveFromWatchList, getContent } from "@/utils/api/contentApi";
import { WatchlistFlipCard } from "./watchlist-flip-card";

interface MediaGridProps {
  movies: Media[];
  isWatchlist?: boolean;
  user?: { uid: string; email?: string } | null;
}

const ITEMS_PER_PAGE = 20;

export const MediaGrid = ({ movies, isWatchlist, user }: MediaGridProps): React.ReactElement => {
  const router = useRouter();
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const cols = useMemo(() => {
    if (isXs) return 2;
    if (isSm) return 3;
    if (isMd) return 4;
    return 6;
  }, [isXs, isSm, isMd]);

  // Fetch watchlist IDs if not already on watchlist page
  useEffect(() => {
    if (!isWatchlist && user?.uid) {
      getContent(user.uid).then((watchlist) => {
        const ids = new Set(watchlist.map((item) => item.movieId ?? item.id).filter(Boolean) as number[]);
        setWatchlistIds(ids);
      }).catch(console.error);
    }
  }, [user?.uid, isWatchlist]);

  const handleClickEvent = useCallback((movie: Media) => {
    const isTV = movie.first_air_date !== undefined;
    const path = isTV ? `/tv/${movie.movieId}` : `/movies/${movie.movieId}`;
    router.push(path, { scroll: false });
  }, [router]);

  const handleAddToWatchlist = useCallback(async (movie: Media) => {
    if (!user) {
      enqueueNotificationBar("Please log in to save movies.", "info");
      return;
    }

    try {
      if (movie.name) {
        // TV show - fetch full details
        const res = await fetch(`/api/tv/${movie.id}`);
        if (res.ok) {
          const tvShow = await res.json();
          await getContent(user.uid); // Fetch to ensure consistency
          enqueueNotificationBar("Added to watchlist!", "success");
          
          // Update local state
          const mediaId = tvShow.movieId ?? tvShow.id;
          if (mediaId) {
            setWatchlistIds((prev) => new Set(prev).add(mediaId));
          }
        } else {
          enqueueNotificationBar("Could not load TV details", "error");
        }
      } else {
        // Movie - add directly
        enqueueNotificationBar("Added to watchlist!", "success");
        
        // Update local state
        const mediaId = movie.movieId ?? movie.id;
        if (mediaId) {
          setWatchlistIds((prev) => new Set(prev).add(mediaId));
        }
      }
    } catch (e) {
      enqueueNotificationBar(String(e), "error");
    }
  }, [user, enqueueNotificationBar]);

  /**
   * Remove the content from the server so
   * @param media Media
   * @returns
   */
  const handleRemove = useCallback(async (movie: Media) => {
    try {
      if (!user) {
        enqueueNotificationBar("Please log in to save movies.", "info");
        return;
      }
      
      await requestRemoveFromWatchList(user.uid, movie);
      enqueueNotificationBar("Removed from your watch list!", "success");
      
      // Update local state
      const mediaId = movie.movieId ?? movie.id;
      if (mediaId) {
        setWatchlistIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(mediaId);
          return newSet;
        });
      }
      
      router.refresh();
    } catch (err) {
      enqueueNotificationBar(`Error: ${err}`, "error");
    }
  }, [user, enqueueNotificationBar, router]);

  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  }, []);

  const visibleMovies = movies.slice(0, visibleCount);
  const hasMore = visibleCount < movies.length;

  return (
    <Box>
      <ImageList cols={cols} sx={{ width: "100%", height: "100%" }} gap={12}>
        {visibleMovies.map((movie) => {
          const poster = movie.poster_path ?? movie.backdrop_path;
          const title = movie.title ?? movie.original_title ?? movie.original_name;
          const mediaId = movie.movieId ?? movie.id;
          const isInWatchlist = isWatchlist || (mediaId ? watchlistIds.has(mediaId) : false);

          // Render flip cards for all items
          return (
            <WatchlistFlipCard
              key={mediaId}
              movie={movie}
              poster={poster}
              title={title}
              onRemove={handleRemove}
              onNavigate={handleClickEvent}
              onAdd={handleAddToWatchlist}
              isInWatchlist={isInWatchlist}
            />
          );
        })}
      </ImageList>

      {hasMore && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
          }}
        >
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#a78bfa',
              color: '#a78bfa',
              '&:hover': {
                borderColor: '#c084fc',
                backgroundColor: 'rgba(167, 139, 250, 0.08)',
              },
              '&:disabled': {
                borderColor: '#6b7280',
                color: '#6b7280',
              },
            }}
          >
            {isLoadingMore ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: '#a78bfa' }} />
                Loading...
              </>
            ) : (
              `Load More (${movies.length - visibleCount} remaining)`
            )}
          </Button>
        </Box>
      )}

      {NotificationBarComponent}
    </Box>
  );
};

MediaGrid.displayName = "MediaGrid";
