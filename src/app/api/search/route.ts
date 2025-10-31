import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

// Simple in-memory cache for search results to reduce TMDB calls.
type CacheEntry = { ts: number; data: unknown };
const CACHE_TTL = 1000 * 60; // 60s
const cache = new Map<string, CacheEntry>();

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  if (!q) return NextResponse.json({ movies: [], tv: [], all: [] });

  try {
    const cacheKey = `search:${q}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.data as Record<string, unknown>);
    }

    const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&include_adult=false&language=en-US&region=us`;
    const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&include_adult=false&language=en-US&region=us`;

    const [movieResp, tvResp] = await Promise.all([fetchJson(movieUrl), fetchJson(tvUrl)]);

    const movies = Array.isArray(movieResp?.results) ? movieResp.results : [];
    const tv = Array.isArray(tvResp?.results) ? tvResp.results : [];

    // Attach US providers to each result (server-side) to avoid client doing this work
    const attachProviders = async (items: Array<{ id?: number }>, isTv = false) => {
      return Promise.all(
        items.map(async (item) => {
          try {
            const id = item.id;
            const type = isTv ? "tv" : "movie";
            const providerRes = await fetch(
              `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${TMDB_API_KEY}`
            );
            const providerJson = await providerRes.json();
            return {
              ...item,
              movieId: id,
              providers: providerJson?.results?.US ?? [],
            };
          } catch (e) {
            return { ...item, movieId: item.id, providers: [] };
          }
        })
      );
    };

    const moviesWithProviders = await attachProviders(movies, false);
    const tvWithProviders = await attachProviders(tv, true);

    const all = [...moviesWithProviders, ...tvWithProviders];

    const result = { movies: moviesWithProviders, tv: tvWithProviders, all };
    cache.set(cacheKey, { ts: Date.now(), data: result });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ movies: [], tv: [], all: [], error: String(err) }, { status: 500 });
  }
}
