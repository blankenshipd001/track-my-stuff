"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useGetMyFavoriteProviders from "@/hooks/useGetMyFavoriteProviders";
import { Media } from "@/data-models/media.interface";
import { User } from "@/data-models/user.interface";
import { COLORS } from "@/lib/theme-constants";
import dynamic from "next/dynamic";
import {
  Container,
  Header,
  HeaderTop,
  Title,
  Subtitle,
  StatsGrid,
  StatCard,
  StatNumber,
  StatLabel,
  FilterContainer,
  FilterButton,
  GridContainer,
  Grid,
} from "./styles";
import { addToWatchList, requestRemoveFromWatchList, updateMovie } from "@/utils/api/contentApi";
import {
  ACTIVITY_FILTERS,
  ActivityFilter,
  getStatusLabel,
  isTvMedia,
  matchesActivityFilter,
  toLabel,
} from "./activity-helpers";
import { AddTitleMenu } from "./components/add-title-menu";
import { ActiveFilterBanner } from "./components/active-filter-banner";
import { ActivityCard } from "./components/activity-card";
import { ProviderLegend } from "./components/provider-legend";

// Dynamically import heavy modal components to reduce initial bundle size
const WatchlistModal = dynamic(() => import("./ActivityModal"), {
  ssr: false,
  loading: () => null,
});

const SearchModal = dynamic(() => import("./SearchModal"), {
  ssr: false,
  loading: () => null,
});

interface MyWatchlistProps {
  watchlist: Media[];
  user?: User | null;
}

const StreamingWatchlist = ({ watchlist, user }: MyWatchlistProps) => {
  const router = useRouter();
  const [watchlistState, setWatchlistState] = useState<Media[]>(watchlist);
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [showModal, setShowModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null | undefined>(null);
  const [formData, setFormData] = useState<Media>({} as Media);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(true);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [shouldShowDetailsAfterAdd, setShouldShowDetailsAfterAdd] = useState(true);
  const { myFavoriteProviders } = useGetMyFavoriteProviders(user?.uid || "");

  useEffect(() => {
    setWatchlistState(watchlist);
  }, [watchlist]);

  useEffect(() => {
    const candidates = watchlist.filter((item) => {
      const isTv = item.type === "tv" || item.media_type === "tv";
      return isTv && item.status === "watching" && Boolean(item.movieId) && !item.seasons?.length;
    });

    if (candidates.length === 0) {
      return;
    }

    let cancelled = false;

    const enrichSeasonTotals = async () => {
      const updates = new Map<number, Array<{ season_number: number; episode_count: number }>>();

      const BATCH_SIZE = 4;
      for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
        if (cancelled) {
          return;
        }

        const batch = candidates.slice(i, i + BATCH_SIZE);
        const enrichedBatch = await Promise.all(
          batch.map(async (item) => {
            try {
              const response = await fetch(`/api/tv/${item.movieId}`);
              if (!response.ok) {
                return null;
              }

              const tvDetails = await response.json();
              if (!Array.isArray(tvDetails?.seasons)) {
                return null;
              }

              const seasons = tvDetails.seasons
                .filter((season: { season_number?: number }) => (season.season_number ?? 0) > 0)
                .map((season: { season_number: number; episode_count?: number }) => ({
                  season_number: season.season_number,
                  episode_count: season.episode_count ?? 0,
                }));

              return {
                id: item.id,
                movieId: item.movieId,
                seasons,
              };
            } catch (error) {
              console.error("Error enriching TV seasons:", error);
              return null;
            }
          })
        );

        for (const item of enrichedBatch) {
          if (!item || !item.seasons) {
            continue;
          }
          updates.set(item.id ?? item.movieId, item.seasons);
        }
      }

      if (updates.size === 0) {
        return;
      }

      setWatchlistState((prev) =>
        prev.map((item) => {
          const key = item.id ?? item.movieId;
          const seasons = updates.get(key);
          if (!seasons) {
            return item;
          }
          return { ...item, seasons };
        })
      );
    };

    enrichSeasonTotals();

    return () => {
      cancelled = true;
    };
  }, [watchlist]);

  const filteredItems = useMemo(
    () => watchlistState.filter((item) => matchesActivityFilter(item, filter)),
    [watchlistState, filter]
  );

  const stats = useMemo(
    () => ({
      watching: watchlistState.filter((i) => i.status === "watching").length,
      completed: watchlistState.filter((i) => i.status === "completed").length,
      watchlist: watchlistState.filter((i) => i.status === "watchlist").length,
    }),
    [watchlistState]
  );

  const providerById = useMemo(
    () => new Map(myFavoriteProviders.map((provider) => [String(provider.provider_id), provider])),
    [myFavoriteProviders]
  );

  const resetForm = () => {
    setFormData({} as Media);
  };

  const handleAdd = (showDetails: boolean) => {
    setEditingId(null);
    resetForm();
    setShouldShowDetailsAfterAdd(showDetails);
    setShowSearchModal(true);
    setShowAddDropdown(false);
  };

  const handleSelectTitle = async (selectedMedia: Media) => {
    // Fetch full details for the selected title
    try {
      const result = await addToWatchList(user?.uid as string, selectedMedia);
      if (typeof result !== 'string') {
        setFormData(result);
        setEditingId(result?.id);
        if (shouldShowDetailsAfterAdd) {
          setShowModal(true);
        } else {
          // Quick add without showing modal - refresh the page
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Error fetching title details:", err);
    }
  };

  const handleEdit = useCallback((item: Media) => {
    setEditingId(item.id);
    setFormData(item);
    setShowModal(true);
  }, []);

  const handleSave = async () => {
    if(!user) {
      return;
    }

    await updateMovie(user.uid, formData);

    setShowModal(false);
    setEditingId(null);
    resetForm();
    
    // Refresh the page data
    router.refresh();
  };

  const handleDelete = useCallback(async (movie: Media) => {
    if (!user) {
      return;
    }

    await requestRemoveFromWatchList(user.uid, movie);

    // Refresh the page data
    router.refresh();
  }, [router, user]);

  const handleCancel = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const toggleFlip = useCallback((id: number | undefined) => {
    if (!id) return;
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleNavigateToDetails = useCallback((item: Media) => {
    const slug = item.movieId || item.id;
    if (!isTvMedia(item)) {
      router.push(`/movies/${slug}`);
    } else {
      router.push(`/tv/${slug}`);
    }
  }, [router]);

  const handleUpdateEpisode = useCallback(
    async (item: Media, currentSeason: number, currentEpisode: number) => {
      if (!user) {
        return;
      }

      const updatedItem = {
        ...item,
        currentSeason,
        currentEpisode,
      };

      // Optimistically update local state
      setWatchlistState((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, currentSeason, currentEpisode }
            : i
        )
      );

      try {
        await updateMovie(user.uid, updatedItem);
      } catch (err) {
        console.error("Error updating episode progress:", err);
        // Revert on error
        setWatchlistState(watchlist);
      }
    },
    [user, watchlist]
  );

  const handleUpdateRating = useCallback(
    async (item: Media, rating: number) => {
      if (!user) {
        return;
      }

      const updatedItem = {
        ...item,
        rating,
      };

      // Optimistically update local state
      setWatchlistState((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, rating }
            : i
        )
      );

      try {
        await updateMovie(user.uid, updatedItem);
      } catch (err) {
        console.error("Error updating rating:", err);
        // Revert on error
        setWatchlistState(watchlist);
      }
    },
    [user, watchlist]
  );
  
  return (
    <Container>
      <Header>
        <HeaderTop>
          <div>
            <Title>My Watchlist</Title>
            <Subtitle>Track what you&apos;re watching across all platforms</Subtitle>
          </div>

          <ProviderLegend
            providers={myFavoriteProviders}
            collapsed={isLegendCollapsed}
            onToggle={() => setIsLegendCollapsed((prev) => !prev)}
          />

          <AddTitleMenu
            show={showAddDropdown}
            onToggle={() => setShowAddDropdown((prev) => !prev)}
            onQuickAdd={() => handleAdd(false)}
            onAddWithDetails={() => handleAdd(true)}
          />

          <StatsGrid>
            <StatCard>
              <StatNumber color="#60a5fa">{stats.watching}</StatNumber>
              <StatLabel>Currently Watching</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber color={COLORS.gray[300]}>{stats.completed}</StatNumber>
              <StatLabel>Completed</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber color={COLORS.purple.solid}>{stats.watchlist}</StatNumber>
              <StatLabel>In Watchlist</StatLabel>
            </StatCard>
          </StatsGrid>
        </HeaderTop>

        <FilterContainer>
          {ACTIVITY_FILTERS.map((value) => (
            <FilterButton key={value} $active={(filter === value).toString()} onClick={() => setFilter(value)}>
              {toLabel(value)}
            </FilterButton>
          ))}
        </FilterContainer>

        <ActiveFilterBanner filter={filter} count={filteredItems.length} onClear={() => setFilter("all")} />
      </Header>

      <GridContainer>
        <Grid>
          {filteredItems.map((item) => {
            const isFlipped = flippedCards.has(item.id!);
            
            return (
              <ActivityCard
                key={item.id}
                item={item}
                isFlipped={isFlipped}
                statusLabel={getStatusLabel(item)}
                providerById={providerById}
                onFlip={toggleFlip}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onNavigateToDetails={handleNavigateToDetails}
                onUpdateEpisode={handleUpdateEpisode}
                onUpdateRating={handleUpdateRating}
              />
            );
          })}
        </Grid>
      </GridContainer>

      {showModal && (
        <WatchlistModal
          show={showModal}
          editingId={editingId}
          formData={formData}
          myFavoriteProviders={myFavoriteProviders}
          handleCancel={handleCancel}
          handleSave={handleSave}
          setFormData={setFormData}
        />
      )}

      {showSearchModal && (
        <SearchModal
          show={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onSelectTitle={handleSelectTitle}
        />
      )}
    </Container>
  );
};

export default StreamingWatchlist;
