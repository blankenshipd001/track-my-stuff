import { NextResponse } from "next/server";
import { fetchPopularMoviesWithProviders } from '@/services';

export async function GET() {
  try {
    // All the complex logic is now in the service layer
    const movies = await fetchPopularMoviesWithProviders();

    // Add HTTP cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=1800, stale-while-revalidate=3600');
    headers.set('CDN-Cache-Control', 'max-age=3600');

    return NextResponse.json({ movies }, { headers });
  } catch (err) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    return NextResponse.json(
      { movies: [], error: String(err) },
      { status: 500, headers }
    );
  }
}
