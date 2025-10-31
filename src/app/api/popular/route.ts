import { NextResponse } from "next/server";
import { fetchPopularContent } from "@/utils/api/serverContentApi";

// Simple cache for popular content
type CacheEntry = { ts: number; data: unknown };
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
const cache = new Map<string, CacheEntry>();

export async function GET() {
  try {
    const cacheKey = "popular:movies";
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.data as Record<string, unknown>);
    }

    const movies = await fetchPopularContent();
    const result = { movies };
    cache.set(cacheKey, { ts: Date.now(), data: result });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ movies: [], error: String(err) }, { status: 500 });
  }
}
