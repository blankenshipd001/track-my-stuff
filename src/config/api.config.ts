/**
 * Centralized API Configuration
 * Single source of truth for all API endpoints, keys, and configuration
 */

// API Keys
export const API_KEYS = {
  TMDB: process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY || '',
} as const;

// Base URLs
const BASE_URLS = {
  TMDB_API: 'https://api.themoviedb.org/3',
  TMDB_IMAGE: process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL || 'https://image.tmdb.org/t/p',
} as const;

// TMDB API Endpoints
export const TMDB_ENDPOINTS = {
  // Movies
  MOVIE_POPULAR: (page = 1) => 
    `${BASE_URLS.TMDB_API}/movie/popular?api_key=${API_KEYS.TMDB}&include_video=false&page=${page}`,
  
  MOVIE_DETAILS: (movieId: string | number) => 
    `${BASE_URLS.TMDB_API}/movie/${movieId}?api_key=${API_KEYS.TMDB}&append_to_response=videos,images,credits`,
  
  MOVIE_PROVIDERS: (movieId: string | number) => 
    `${BASE_URLS.TMDB_API}/movie/${movieId}/watch/providers?api_key=${API_KEYS.TMDB}&external_source=imdb_id`,
  
  // Search
  SEARCH_MOVIE: (query: string) => 
    `${BASE_URLS.TMDB_API}/search/movie?api_key=${API_KEYS.TMDB}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&region=us`,
  
  SEARCH_TV: (query: string) => 
    `${BASE_URLS.TMDB_API}/search/tv?api_key=${API_KEYS.TMDB}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&region=us`,
  
  // TV Shows
  TV_DETAILS: (tvId: string | number) => 
    `${BASE_URLS.TMDB_API}/tv/${tvId}?api_key=${API_KEYS.TMDB}&append_to_response=videos,images,credits`,
  
  TV_PROVIDERS: (tvId: string | number) => 
    `${BASE_URLS.TMDB_API}/tv/${tvId}/watch/providers?api_key=${API_KEYS.TMDB}`,
  
  TV_SEASON: (tvId: string | number, seasonNumber: number) => 
    `${BASE_URLS.TMDB_API}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEYS.TMDB}`,
  
  TV_POPULAR: (page = 1) => 
    `${BASE_URLS.TMDB_API}/tv/popular?api_key=${API_KEYS.TMDB}&page=${page}`,
  
  // People/Cast
  PERSON_DETAILS: (personId: string | number) => 
    `${BASE_URLS.TMDB_API}/person/${personId}?api_key=${API_KEYS.TMDB}&append_to_response=movie_credits,tv_credits,images`,
  
  // Discover/Recommendations
  DISCOVER_MOVIE_BY_GENRE: (genreId: string | number) => 
    `${BASE_URLS.TMDB_API}/discover/movie?api_key=${API_KEYS.TMDB}&with_genres=${genreId}&sort_by=popularity.desc`,
  
  DISCOVER_TV_BY_GENRE: (genreId: string | number) => 
    `${BASE_URLS.TMDB_API}/discover/tv?api_key=${API_KEYS.TMDB}&with_genres=${genreId}&sort_by=popularity.desc`,
  
  // Providers List
  PROVIDERS_MOVIE_LIST: () => 
    `${BASE_URLS.TMDB_API}/watch/providers/movie?api_key=${API_KEYS.TMDB}&language=en-US&watch_region=us`,
  
  PROVIDERS_TV_LIST: () => 
    `${BASE_URLS.TMDB_API}/watch/providers/tv?api_key=${API_KEYS.TMDB}&language=en-US&watch_region=us`,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  POPULAR_MOVIES: {
    tags: ['popular-movies'] as string[],
    revalidate: 1800, // 30 minutes
  },
  MOVIE_DETAILS: {
    tags: ['movie-details'] as string[],
    revalidate: 3600, // 1 hour
  },
  TV_DETAILS: {
    tags: ['tv-details'] as string[],
    revalidate: 3600, // 1 hour
  },
  TV_POPULAR: {
    tags: ['tv-popular'] as string[],
    revalidate: 1800, // 30 minutes
  },
  PERSON_DETAILS: {
    tags: ['person-details'] as string[],
    revalidate: 86400, // 24 hours - cast info rarely changes
  },
  PROVIDERS: {
    tags: ['providers'] as string[],
    revalidate: 86400, // 24 hours
  },
  PROVIDERS_LIST: {
    tags: ['providers-list'] as string[],
    revalidate: 604800, // 7 days - providers don't change often
  },
  SEARCH: {
    tags: ['search-results'] as string[],
    revalidate: 3600, // 1 hour
  },
};

// Retry Configuration
export const RETRY_CONFIG = {
  DEFAULT: {
    maxRetries: 3,
    initialDelayMs: 1000,
    skipRetryDuringBuild: false,
  },
  BATCH_REQUESTS: {
    maxRetries: 2,
    initialDelayMs: 1000,
    skipRetryDuringBuild: false,
  },
} as const;

// API Rate Limits
export const RATE_LIMITS = {
  BATCH_SIZE: 5,
  BATCH_DELAY_MS: 0, // No delay needed with retry logic
} as const;
