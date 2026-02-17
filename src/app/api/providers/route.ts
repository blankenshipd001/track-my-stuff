import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

async function fetchJson(url: string) {
  const res = await fetch(url, {
    next: {
      tags: ['providers-list'],
      revalidate: 604800, // 7 days - providers don't change often
    },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'movie', 'tv', or null for all

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
      return NextResponse.json({ movies, tv, all: allProviders }, { headers });
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
