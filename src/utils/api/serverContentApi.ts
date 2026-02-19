/**
 * Server Content API
 * Legacy compatibility layer - delegates to service layer
 * @deprecated Use services directly from @/services
 */

import { Media } from "@/data-models/media.interface";
import { 
  fetchPopularMoviesWithProviders, 
  fetchMovieDetails as fetchMovieDetailsSvc,
  fetchTVDetails as fetchTVDetailsSvc,
  fetchTVSeasonEpisodes as fetchTVSeasonEpisodesSvc,
  fetchCastMemberDetails as fetchCastMemberDetailsSvc,
  fetchRecommendedMovies as fetchRecommendedMoviesSvc,
  fetchRecommendedTV as fetchRecommendedTVSvc,
  fetchPopularTV as fetchPopularTVSvc
} from '@/services';

/**
 * Fetch popular movies with providers
 * @deprecated Use fetchPopularMoviesWithProviders from @/services
 */
export async function fetchPopularContent(): Promise<Media[]> {
  return fetchPopularMoviesWithProviders() as Promise<Media[]>;
}

/**
 * Fetch movie details by ID
 * @deprecated Use fetchMovieDetails from @/services
 */
export async function getMovieDetails(slug: string): Promise<Media | null> {
  try {
    const movie = await fetchMovieDetailsSvc(slug);
    return movie as Media;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

/**
 * Fetch TV show details by ID
 * @deprecated Use fetchTVDetails from @/services
 */
export async function getTVDetails(slug: string): Promise<Media | null> {
  try {
    const tv = await fetchTVDetailsSvc(slug);
    return tv as Media;
  } catch (error) {
    console.error('Error fetching TV details:', error);
    return null;
  }
}

/**
 * Fetch most recent season episodes for a TV show
 * @deprecated Use fetchTVSeasonEpisodes from @/services
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMostRecentSeasonEpisodes(tvId: string | number): Promise<{ season_number: number; episodes: any[] } | null> {
  try {
    // First get TV details to find the most recent season
    const tvDetails = await fetchTVDetailsSvc(tvId.toString());
    
    if (!tvDetails?.seasons || tvDetails.seasons.length === 0) {
      return null;
    }

    // Filter out special seasons (season 0) and get the last one
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const regularSeasons = tvDetails.seasons.filter((s: any) => s.season_number > 0);
    const mostRecentSeason = regularSeasons[regularSeasons.length - 1];
    
    if (!mostRecentSeason) {
      return null;
    }

    // Fetch episodes for the most recent season
    const seasonData = await fetchTVSeasonEpisodesSvc(tvId as number, mostRecentSeason.season_number);
    
    return {
      season_number: mostRecentSeason.season_number,
      episodes: seasonData.episodes ?? [],
    };
  } catch (error) {
    console.error('Error fetching season episodes:', error);
    return null;
  }
}

/**
 * Fetch cast member details
 * @deprecated Use fetchCastMemberDetails from @/services
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCastMemberDetails(castId: string | number): Promise<any | null> {
  try {
    const person = await fetchCastMemberDetailsSvc(castId.toString());
    
    if (!person) return null;

    // Combine and sort movie and TV credits by popularity/date
    const allCredits = [
      ...(person.combined_credits?.cast || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((credit: any) => ({
          ...credit,
          media_type: credit.media_type || (credit.title ? 'movie' : 'tv'),
        }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ].sort((a: any, b: any) => {
      const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
      const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();
      return dateB - dateA; // Most recent first
    });

    return {
      ...person,
      filmography: allCredits.slice(0, 50), // Top 50 works
    };
  } catch (error) {
    console.error('Error fetching cast member details:', error);
    return null;
  }
}

/**
 * Fetch recommended movies by genre
 * @deprecated Use fetchRecommendedMovies from @/services
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getRecommendedMovies(genreId: string | number): Promise<any[]> {
  try {
    return await fetchRecommendedMoviesSvc(genreId.toString());
  } catch (error) {
    console.error('Error fetching recommended movies:', error);
    return [];
  }
}

/**
 * Fetch recommended TV shows by genre
 * @deprecated Use fetchRecommendedTV from @/services
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getRecommendedTV(genreId: string | number): Promise<any[]> {
  try {
    return await fetchRecommendedTVSvc(genreId.toString());
  } catch (error) {
    console.error('Error fetching recommended TV:', error);
    return [];
  }
}

/**
 * Fetch popular TV shows
 * @deprecated Use fetchPopularTV from @/services
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchPopularTV(): Promise<any[]> {
  try {
    return await fetchPopularTVSvc();
  } catch (error) {
    console.error('Error fetching popular TV:', error);
    return [];
  }
}
