"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import useGetMyFavoriteProviders from "@/hooks/useGetMyFavoriteProviders";
import { Media } from "@/data-models/media.interface";
import { User } from "@/data-models/user.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { addToWatchList, updateMovie, requestRemoveFromWatchList } from "@/utils/api/contentApi";
import { isTvMedia } from "./activity-helpers";
import { GRADIENTS, COLORS } from "@/lib/theme-constants";

// existing components you can keep
import SearchModal from "./SearchModal";

// new components
import { ContinueWatchingList } from "./components/continue-watching-list";
import { MovieQueueList } from "./components/movie-queue-list";
import { QuickAddFab } from "./components/quick-add-fab";
import { ProviderOverrideSheet } from "./components/provider-override-sheet";

interface MyWatchlistProps {
  watchlist: Media[];
  user?: User | null;
}

export default function Activity({ watchlist, user }: MyWatchlistProps) {
  const router = useRouter();
  const [watchlistState, setWatchlistState] = useState<Media[]>(watchlist);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [addStatus, setAddStatus] = useState<"watching" | "watchlist">("watching");
  const [providerItem, setProviderItem] = useState<Media | null>(null);

  const { myFavoriteProviders } = useGetMyFavoriteProviders(user?.uid || "");
  const providerById = useMemo(
    () => new Map(myFavoriteProviders.map((p: ServiceProvider) => [String(p.provider_id), p])),
    [myFavoriteProviders]
  );

  useEffect(() => {
    setWatchlistState(watchlist);
  }, [watchlist]);

  const continueWatching = useMemo(
    () => watchlistState.filter((i) => isTvMedia(i) && i.status === "watching"),
    [watchlistState]
  );

  const movieQueue = useMemo(
    () => watchlistState.filter((i) => !isTvMedia(i) && i.status === "watchlist"),
    [watchlistState]
  );

  const handleSelectTitle = useCallback(
    async (selectedMedia: Media) => {
      if (!user?.uid) return;

      const added = await addToWatchList(user.uid, selectedMedia);
      if (typeof added === "string") return;

      const withStatus: Media = {
        ...added,
        status: addStatus,
        ...(isTvMedia(added) ? { currentSeason: 1, currentEpisode: 1 } : {}),
      };

      await updateMovie(user.uid, withStatus);

      setWatchlistState((prev) => [withStatus, ...prev.filter((p) => p.id !== withStatus.id)]);
      setShowSearchModal(false);
    },
    [user?.uid, addStatus]
  );

  const handleMarkWatched = useCallback(
    async (item: Media) => {
      if (!user?.uid) return;
      const updated = { ...item, status: "completed" as const };
      await updateMovie(user.uid, updated);

      // remove from Activity immediately to keep screen clean
      setWatchlistState((prev) => prev.filter((p) => p.id !== item.id));
    },
    [user?.uid]
  );

  // const handleStartWatchingMovie = useCallback(
  //   async (item: Media) => {
  //     if (!user?.uid) return;
  //     const updated = { ...item, status: "watching" as const };
  //     await updateMovie(user.uid, updated);

  //     setWatchlistState((prev) => prev.map((p) => (p.id === item.id ? updated : p)));
  //   },
  //   [user?.uid]
  // );

  const handleNextEpisode = useCallback(
    async (item: Media) => {
      if (!user?.uid) return;

      const currentSeason = item.currentSeason ?? 1;
      const currentEpisode = item.currentEpisode ?? 1;
      const updated = { ...item, currentSeason, currentEpisode: currentEpisode + 1 };

      setWatchlistState((prev) => prev.map((p) => (p.id === item.id ? updated : p)));
      await updateMovie(user.uid, updated);
    },
    [user?.uid]
  );

  const handleProviderOverride = useCallback(
    async (item: Media, providerId: string) => {
      if (!user?.uid) return;

      const updated = {
        ...item,
        provider: providerId,
        selectedStreamer: providerId,
      };

      setWatchlistState((prev) => prev.map((p) => (p.id === item.id ? updated : p)));
      await updateMovie(user.uid, updated);
      setProviderItem(null);
    },
    [user?.uid]
  );

  const handleDelete = useCallback(
    async (item: Media) => {
      if (!user?.uid) return;
      await requestRemoveFromWatchList(user.uid, item);
      setWatchlistState((prev) => prev.filter((p) => p.id !== item.id));
    },
    [user?.uid]
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #111827, #1f2937, #111827)",
        color: "#fff",
        p: "1.5rem",
        maxWidth: 1600,
        mx: "auto",
      }}
    >
      <Box sx={{ maxWidth: "80rem", mx: "auto", mb: "2rem" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                background: GRADIENTS.textPurplePink,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                m: 0,
              }}
            >
              Activity
            </Typography>
            <Typography sx={{ color: COLORS.gray[400], mt: "0.5rem" }}>
              Fast updates for what you are watching now
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: "80rem", mx: "auto" }}>
        <ContinueWatchingList
          items={continueWatching}
          providerById={providerById}
          onNextEpisode={handleNextEpisode}
          onMarkWatched={handleMarkWatched}
          onProviderOverride={(item) => setProviderItem(item)}
          onOpenDetails={(item) => {
            const slug = item.movieId || item.id;
            router.push(isTvMedia(item) ? `/tv/${slug}` : `/movies/${slug}`);
          }}
        />

        <MovieQueueList
          items={movieQueue}
          providerById={providerById}
          onOpenDetails={(item) => {
            const slug = item.movieId || item.id;
            router.push(isTvMedia(item) ? `/tv/${slug}` : `/movies/${slug}`);
          }}
          onMarkWatched={handleMarkWatched}
          onDelete={handleDelete}
          onProviderOverride={(item) => setProviderItem(item)}
        />
      </Box>

      <QuickAddFab
        onAddWatching={() => {
          setAddStatus("watching");
          setShowSearchModal(true);
        }}
        onAddWatchlist={() => {
          setAddStatus("watchlist");
          setShowSearchModal(true);
        }}
      />

      {showSearchModal && (
        <SearchModal
          show={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onSelectTitle={handleSelectTitle}
        />
      )}

      {providerItem && (
        <ProviderOverrideSheet
          item={providerItem}
          providers={myFavoriteProviders}
          onClose={() => setProviderItem(null)}
          onSave={handleProviderOverride}
        />
      )}
    </Box>
  );
}