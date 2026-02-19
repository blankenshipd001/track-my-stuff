/**
 * TMDB Service Layer
 * Handles all TMDB API interactions with proper typing and error handling
 */

import { fetchWithRetry } from '@/utils/api/retryFetch';
import { TMDB_ENDPOINTS, CACHE_CONFIG, RETRY_CONFIG, RATE_LIMITS } from '@/config/api.config';
import { Media } from '@/data-models/media.interface';

/**
 * Fetch popular movies with pagination
 */
export async function fetchPopularMovies(pages: number[] = [1]): Promise<Partial<Media>[]> {
  const allResults: Array<{ id: number; [key: string]: unknown }> = [];

  // Fetch all pages in parallel
  const pageResponses = await Promise.all(
    pages.map((page) =>
      fetchWithRetry(
        TMDB_ENDPOINTS.MOVIE_POPULAR(page),
        { next: CACHE_CONFIG.POPULAR_MOVIES },
        RETRY_CONFIG.DEFAULT
      ).then((res) => res.json())
    )
  );

  // Combine results
  pageResponses.forEach((response) => {
    if (response.results && Array.isArray(response.results)) {
      allResults.push(...response.results);
    }
  });

  return allResults as Partial<Media>[];
}

/**
 * Fetch movie providers in batches
 */
export async function fetchMovieProviders(
  movieIds: number[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Map<number, any>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const providersMap = new Map<number, any>();
  const { BATCH_SIZE } = RATE_LIMITS;

  for (let i = 0; i < movieIds.length; i += BATCH_SIZE) {
    const batch = movieIds.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map(async (id) => {
        try {
          const response = await fetchWithRetry(
            TMDB_ENDPOINTS.MOVIE_PROVIDERS(id),
            {
              next: {
                tags: [...CACHE_CONFIG.PROVIDERS.tags, `movie-provider:${id}`],
                revalidate: CACHE_CONFIG.PROVIDERS.revalidate,
              },
            },
            RETRY_CONFIG.BATCH_REQUESTS
          );
          const data = await response.json();
          return { id, providers: data.results?.US ?? [] };
        } catch (error) {
          console.error(`Error fetching providers for movie ${id}:`, error);
          return { id, providers: [] };
        }
      })
    );

    batchResults.forEach(({ id, providers }) => {
      providersMap.set(id, providers);
    });
  }

  return providersMap;
}

/**
 * Fetch popular movies with providers
 */
export async function fetchPopularMoviesWithProviders(): Promise<Partial<Media>[]> {
  // Fetch movies
  const movies = await fetchPopularMovies([1, 2]);

  // Extract movie IDs
  const movieIds = movies.map((m) => m.id!).filter(Boolean);

  // Fetch providers in batches
  const providersMap = await fetchMovieProviders(movieIds);

  // Combine movies with providers
  return movies.map((movie) => ({
    ...movie,
    movieId: movie.id,
    providers: providersMap.get(movie.id!) ?? [],
  })) as Partial<Media>[];
}

/**
 * Fetch movie details
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchMovieDetails(movieId: string): Promise<any> {
  const response = await fetchWithRetry(
    TMDB_ENDPOINTS.MOVIE_DETAILS(movieId),
    { next: CACHE_CONFIG.MOVIE_DETAILS },
    RETRY_CONFIG.DEFAULT
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch movie details: ${response.statusText}`);
  }

  const movie = await response.json();

  // Fetch providers
  const providerRes = await fetchWithRetry(
    TMDB_ENDPOINTS.MOVIE_PROVIDERS(movieId),
    { next: CACHE_CONFIG.PROVIDERS },
    RETRY_CONFIG.DEFAULT
  );
  const providerData = await providerRes.json();

  return {
    ...movie,
    movieId: Number(movie.id),
    providers: providerData.results?.US ?? [],
  };
}

/**
 * Search movies and TV shows
 */
export async function searchContent(query: string): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  movies: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tv: any[];
}> {
  if (!query) {
    return { movies: [], tv: [] };
  }

  const [movieResp, tvResp] = await Promise.all([
    fetchWithRetry(
      TMDB_ENDPOINTS.SEARCH_MOVIE(query),
      { next: CACHE_CONFIG.SEARCH },
      RETRY_CONFIG.DEFAULT
    ).then((r) => r.json()),
    fetchWithRetry(
      TMDB_ENDPOINTS.SEARCH_TV(query),
      { next: CACHE_CONFIG.SEARCH },
      RETRY_CONFIG.DEFAULT
    ).then((r) => r.json()),
  ]);

  return {
    movies: Array.isArray(movieResp?.results) ? movieResp.results : [],
    tv: Array.isArray(tvResp?.results) ? tvResp.results : [],
  };
}

/**
 * Attach providers to content items
 */
export async function attachProvidersToItems(
  items: Array<{ id?: number }>,
  isTv = false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  return Promise.all(
    items.map(async (item) => {
      try {
        const id = item.id;
        const endpoint = isTv
          ? TMDB_ENDPOINTS.TV_PROVIDERS(id!)
          : TMDB_ENDPOINTS.MOVIE_PROVIDERS(id!);

        const providerRes = await fetchWithRetry(
          endpoint,
          {
            next: {
              tags: [...CACHE_CONFIG.PROVIDERS.tags, `provider:${isTv ? 'tv' : 'movie'}:${id}`],
              revalidate: CACHE_CONFIG.PROVIDERS.revalidate,
            },
          },
          RETRY_CONFIG.BATCH_REQUESTS
        );

        const providerJson = await providerRes.json();
        return {
          ...item,
          movieId: id,
          providers: providerJson?.results?.US ?? [],
        };
      } catch (e) {
        console.error(e);
        return { ...item, movieId: item.id, providers: [] };
      }
    })
  );
}

/**
 * Fetch TV show details
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchTVDetails(tvId: string): Promise<any> {
  const response = await fetchWithRetry(
    TMDB_ENDPOINTS.TV_DETAILS(tvId),
    { next: CACHE_CONFIG.TV_DETAILS },
    RETRY_CONFIG.DEFAULT
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch TV details: ${response.statusText}`);
  }

  const tv = await response.json();
  
  // Fetch providers
  const providerRes = await fetchWithRetry(
    TMDB_ENDPOINTS.TV_PROVIDERS(Number(tvId)),
    { next: CACHE_CONFIG.PROVIDERS },
    RETRY_CONFIG.DEFAULT
  );
  const providerData = await providerRes.json();

  return {
    ...tv,
    movieId: Number(tv.id),
    providers: providerData.results?.US ?? [],
  };
}

/**
 * Fetch TV season episodes
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchTVSeasonEpisodes(tvId: number, seasonNumber: number): Promise<any> {
  const response = await fetchWithRetry(
    TMDB_ENDPOINTS.TV_SEASON(tvId, seasonNumber),
    { next: CACHE_CONFIG.TV_DETAILS },
    RETRY_CONFIG.DEFAULT
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch season episodes: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch cast member details
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchCastMemberDetails(castId: string): Promise<any> {
  const response = await fetchWithRetry(
    TMDB_ENDPOINTS.PERSON_DETAILS(castId),
    { next: CACHE_CONFIG.PERSON_DETAILS },
    RETRY_CONFIG.DEFAULT
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch cast member details: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch recommended movies by genre
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchRecommendedMovies(genreId: string): Promise<any[]> {
  const response = await fetchWithRetry(
    TMDB_ENDPOINTS.DISCOVER_MOVIE_BY_GENRE(genreId),
    { next: CACHE_CONFIG.POPULAR_MOVIES },
    RETRY_CONFIG.DEFAULT
  );

  const data = await response.json();
  return data.results ?? [];
}

/**
 * Fetch recommended TV shows by genre
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchRecommendedTV(genreId: string): Promise<any[]> {
  const response = await fetchWithRetry(
    TMDB_ENDPOINTS.DISCOVER_TV_BY_GENRE(genreId),
    { next: CACHE_CONFIG.TV_POPULAR },
    RETRY_CONFIG.DEFAULT
  );

  const data = await response.json();
  return data.results ?? [];
}

/**
 * Fetch popular TV shows
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchPopularTV(): Promise<any[]> {
  const response = await fetchWithRetry(
    TMDB_ENDPOINTS.TV_POPULAR(),
    { next: CACHE_CONFIG.TV_POPULAR },
    RETRY_CONFIG.DEFAULT
  );

  const data = await response.json();
  return data.results ?? [];
}

/**
 * Fetch available streaming providers
 */
export async function fetchProvidersList(): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  movies: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tv: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  all: any[];
}> {
  const [movieResp, tvResp] = await Promise.all([
    fetchWithRetry(
      TMDB_ENDPOINTS.PROVIDERS_MOVIE_LIST(),
      { next: CACHE_CONFIG.PROVIDERS_LIST },
      RETRY_CONFIG.DEFAULT
    ).then((r) => r.json()),
    fetchWithRetry(
      TMDB_ENDPOINTS.PROVIDERS_TV_LIST(),
      { next: CACHE_CONFIG.PROVIDERS_LIST },
      RETRY_CONFIG.DEFAULT
    ).then((r) => r.json()),
  ]);

  const movies = movieResp?.results ?? [];
  const tv = tvResp?.results ?? [];

  // Merge unique providers by id
  type Provider = { provider_id?: number } & Record<string, unknown>;
  const map = new Map<number, Provider>();
  [...movies, ...tv].forEach((p: Provider) => {
    if (p && typeof p.provider_id === "number") {
      map.set(p.provider_id, p);
    }
  });

  const all = Array.from(map.values());

  return { movies, tv, all };
}
