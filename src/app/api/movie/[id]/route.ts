import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

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
    // Fetch movie details with cache tag
    const movieRes = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,images,credits`,
      {
        next: {
          tags: ['movie-detail', `movie:${id}`],
          revalidate: 3600, // 1 hour
        },
      }
    );

    if (!movieRes.ok) {
      const headers = new Headers();
      headers.set('Cache-Control', 'public, max-age=60');
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers }
      );
    }

    const movie = await movieRes.json();

    // Fetch providers
    const providerRes = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`,
      {
        next: {
          tags: ['movie-providers', `movie-provider:${id}`],
          revalidate: 86400, // 24 hours
        },
      }
    );

    const providerData = await providerRes.json();

    const result = {
      ...movie,
      movieId: Number(movie.id),
      providers: providerData.results?.US ?? [],
    };

    // Cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    headers.set('CDN-Cache-Control', 'max-age=86400');

    return NextResponse.json(result, { headers });
  } catch (err) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    return NextResponse.json(
      { error: String(err) },
      { status: 500, headers }
    );
  }
}
