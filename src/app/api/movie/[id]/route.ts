import { NextRequest, NextResponse } from "next/server";
import { fetchMovieDetails } from '@/services';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=0');
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400, headers }
    );
  }

  try {
    // Fetch movie details (includes providers via service layer)
    const movie = await fetchMovieDetails(id);

    if (!movie) {
      const headers = new Headers();
      headers.set('Cache-Control', 'public, max-age=60');
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers }
      );
    }

    // Cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    headers.set('CDN-Cache-Control', 'max-age=86400');

    return NextResponse.json(movie, { headers });
  } catch (err) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    return NextResponse.json(
      { error: String(err) },
      { status: 500, headers }
    );
  }
}
