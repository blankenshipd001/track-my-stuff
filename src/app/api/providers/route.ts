import { NextResponse } from "next/server";
import { fetchProvidersList } from '@/services';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'movie', 'tv', or null for all

    const { movies, tv, all } = await fetchProvidersList();

    // Add HTTP cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=1209600');
    headers.set('CDN-Cache-Control', 'max-age=1209600');

    // Return filtered results based on type parameter
    if (type === 'movie') {
      return NextResponse.json({ providers: movies }, { headers });
    } else if (type === 'tv') {
      return NextResponse.json({ providers: tv }, { headers });
    } else {
      return NextResponse.json({ movies, tv, all }, { headers });
    }
  } catch (err) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    return NextResponse.json(
      { movies: [], tv: [], all: [], error: String(err) },
      { status: 500, headers }
    );
  }
}
