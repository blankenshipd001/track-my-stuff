import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails } from "@/utils/api/serverContentApi";

// Simple per-id cache
type CacheEntry = { ts: number; data: unknown };
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
const cache = new Map<string, CacheEntry>();

export async function GET(request: NextRequest, { params }: { params: any }) {
  const id = (params && (await params).id) || params?.id;
  if (!id){
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const cacheKey = `movie:${id}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.data as Record<string, unknown>);
    }

    const movie = await getMovieDetails(id);
    if (!movie) return NextResponse.json({ error: "Not found" }, { status: 404 });

    cache.set(cacheKey, { ts: Date.now(), data: movie });

    return NextResponse.json(movie);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
