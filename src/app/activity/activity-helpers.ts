import { Media } from "@/data-models/media.interface";

export const ACTIVITY_FILTERS = ["all", "watching", "completed", "watchlist", "movies", "tv"] as const;
export type ActivityFilter = (typeof ACTIVITY_FILTERS)[number];

interface ProviderDetails {
  name: string;
  color: string;
}

export const FALLBACK_PROVIDER_META: Record<string, ProviderDetails> = {
  netflix: { name: "Netflix", color: "#dc2626" },
  hulu: { name: "Hulu", color: "#22c55e" },
  paramount: { name: "Paramount+", color: "#166534" },
  disney: { name: "Disney+", color: "#2563eb" },
  hbo: { name: "HBO Max", color: "#9333ea" },
  prime: { name: "Prime Video", color: "#0ea5e9" },
  apple: { name: "Apple TV+", color: "#1f2937" },
};

export function isTvMedia(item: Media): boolean {
  return item.type === "tv" || item.media_type === "tv";
}

export function matchesActivityFilter(item: Media, filter: ActivityFilter): boolean {
  if (filter === "all") return true;
  if (filter === "movies") return item.type === "movie";
  if (filter === "tv") return isTvMedia(item);
  return item.status === filter;
}

export function toLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getStatusLabel(item: Media): string {
  return item.status ? toLabel(item.status) : "U";
}

export function getTotalEpisodes(item: Media): number {
  if (item.episodes && item.episodes.length > 0) {
    return item.episodes.reduce((sum, season) => {
      return sum + (Array.isArray(season.episodes) ? season.episodes.length : 0);
    }, 0);
  }

  if (item.seasons && item.seasons.length > 0) {
    return item.seasons.reduce((sum, season) => {
      return sum + (season.episode_count || 0);
    }, 0);
  }

  return 0;
}

export function calculateTvProgress(item: Media): number {
  if (!isTvMedia(item)) return 0;

  const currentSeason = (item as Media & { currentSeason?: number }).currentSeason ?? 1;
  const currentEpisode = (item as Media & { currentEpisode?: number }).currentEpisode ?? 1;

  let totalWatched = 0;
  let totalEpisodes = 0;

  if (item.episodes && item.episodes.length > 0) {
    item.episodes.forEach((season) => {
      const episodeCount = Array.isArray(season.episodes) ? season.episodes.length : 0;
      totalEpisodes += episodeCount;

      if (season.season_number < currentSeason) {
        totalWatched += episodeCount;
      } else if (season.season_number === currentSeason) {
        totalWatched += currentEpisode;
      }
    });
  } else if (item.seasons && item.seasons.length > 0) {
    item.seasons.forEach((season) => {
      const episodeCount = season.episode_count || 0;
      totalEpisodes += episodeCount;

      if (season.season_number < currentSeason) {
        totalWatched += episodeCount;
      } else if (season.season_number === currentSeason) {
        totalWatched += currentEpisode;
      }
    });
  }

  return totalEpisodes > 0 ? (totalWatched / totalEpisodes) * 100 : 0;
}
