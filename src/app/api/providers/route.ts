import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

// Simple cache for providers
type CacheEntry = { ts: number; data: unknown };
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days - providers don't change often
const cache = new Map<string, CacheEntry>();

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'movie', 'tv', or null for all

    const cacheKey = `providers:all`;
    const cached = cache.get(cacheKey);
    
    let movies, tv, allProviders;

    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      const cachedData = cached.data as { movies: unknown[]; tv: unknown[]; all: unknown[] };
      movies = cachedData.movies;
      tv = cachedData.tv;
      allProviders = cachedData.all;
    } else {
      const movieProviderAPI = `https://api.themoviedb.org/3/watch/providers/movie?api_key=${TMDB_API_KEY}&language=en-US&watch_region=us`;
      const tvProviderAPI = `https://api.themoviedb.org/3/watch/providers/tv?api_key=${TMDB_API_KEY}&language=en-US&watch_region=us`;

      const [movieResp, tvResp] = await Promise.all([fetchJson(movieProviderAPI), fetchJson(tvProviderAPI)]);

      movies = movieResp?.results ?? [];
      tv = tvResp?.results ?? [];

      // Merge unique providers by id
      type Provider = { provider_id?: number } & Record<string, unknown>;
      const map = new Map<number, Provider>();
      [...movies, ...tv].forEach((p: Provider) => {
        if (p && typeof p.provider_id === "number") map.set(p.provider_id as number, p);
      });

      allProviders = Array.from(map.values()) as Provider[];

      const result = { movies, tv, all: allProviders };
      cache.set(cacheKey, { ts: Date.now(), data: result });
    }

    // Return filtered results based on type parameter
    if (type === 'movie') {
      return NextResponse.json({ providers: movies });
    } else if (type === 'tv') {
      return NextResponse.json({ providers: tv });
    } else {
      return NextResponse.json({ movies, tv, all: allProviders });
    }
  } catch (err) {
    return NextResponse.json({ movies: [], tv: [], all: [], error: String(err) }, { status: 500 });
  }
}
