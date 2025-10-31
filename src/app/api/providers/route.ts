import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

// Simple cache for providers
type CacheEntry = { ts: number; data: unknown };
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes for providers
const cache = new Map<string, CacheEntry>();

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

export async function GET() {
  try {
    const cacheKey = `providers:all`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.data as Record<string, unknown>);
    }
    const movieProviderAPI = `https://api.themoviedb.org/3/watch/providers/movie?api_key=${TMDB_API_KEY}&language=en-US&watch_region=us`;
    const tvProviderAPI = `https://api.themoviedb.org/3/watch/providers/tv?api_key=${TMDB_API_KEY}&language=en-US&watch_region=us`;

    const [movieResp, tvResp] = await Promise.all([fetchJson(movieProviderAPI), fetchJson(tvProviderAPI)]);

    const movies = movieResp?.results ?? [];
    const tv = tvResp?.results ?? [];

    // Merge unique providers by id
    type Provider = { provider_id?: number } & Record<string, unknown>;
    const map = new Map<number, Provider>();
    [...movies, ...tv].forEach((p: Provider) => {
      if (p && typeof p.provider_id === "number") map.set(p.provider_id as number, p);
    });

    const allProviders = Array.from(map.values()) as Provider[];

    const result = { movies, tv, all: allProviders };
    cache.set(cacheKey, { ts: Date.now(), data: result });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ movies: [], tv: [], all: [], error: String(err) }, { status: 500 });
  }
}
