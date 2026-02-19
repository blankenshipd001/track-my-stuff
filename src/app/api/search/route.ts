import { NextRequest, NextResponse } from "next/server";
import { searchContent, attachProvidersToItems } from '@/services';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  
  if (!q) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    return NextResponse.json({ movies: [], tv: [], all: [] }, { headers });
  }

  try {
    // Search for content
    const { movies, tv } = await searchContent(q);

    // Attach providers to results
    const [moviesWithProviders, tvWithProviders] = await Promise.all([
      attachProvidersToItems(movies, false),
      attachProvidersToItems(tv, true),
    ]);

    const all = [...moviesWithProviders, ...tvWithProviders];

    // Add HTTP cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=600');
    headers.set('CDN-Cache-Control', 'max-age=600');

    return NextResponse.json(
      { movies: moviesWithProviders, tv: tvWithProviders, all },
      { headers }
    );
  } catch (err) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    return NextResponse.json(
      { movies: [], tv: [], all: [], error: String(err) },
      { status: 500, headers }
    );
  }
}
