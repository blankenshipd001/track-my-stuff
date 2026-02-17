import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

async function fetchJson(url: string) {
  const res = await fetch(url, {
    next: {
      tags: ['search-results'],
      revalidate: 3600, // 1 hour ISR
    },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  
  if (!q) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    return NextResponse.json({ movies: [], tv: [], all: [] }, { headers });
  }

  try {
    const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&include_adult=false&language=en-US&region=us`;
    const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&include_adult=false&language=en-US&region=us`;

    const [movieResp, tvResp] = await Promise.all([fetchJson(movieUrl), fetchJson(tvUrl)]);

    const movies = Array.isArray(movieResp?.results) ? movieResp.results : [];
    const tv = Array.isArray(tvResp?.results) ? tvResp.results : [];

    // Attach US providers to each result (server-side)
    const attachProviders = async (items: Array<{ id?: number }>, isTv = false) => {
      return Promise.all(
        items.map(async (item) => {
          try {
            const id = item.id;
            const type = isTv ? "tv" : "movie";
            const providerRes = await fetch(
              `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${TMDB_API_KEY}`,
              {
                next: {
                  tags: ['search-providers', `search-provider:${type}:${id}`],
                  revalidate: 3600,
                },
              }
            );
            const providerJson = await providerRes.json();
            return {
              ...item,
              movieId: id,
              providers: providerJson?.results?.US ?? [],
            };
          } catch (e) {
            console.error(e);
            return { ...item, movieId: item.id, providers: [] };
          }
        })
      );
    };

    const moviesWithProviders = await attachProviders(movies, false);
    const tvWithProviders = await attachProviders(tv, true);

    const all = [...moviesWithProviders, ...tvWithProviders];

    const result = { movies: moviesWithProviders, tv: tvWithProviders, all };

    // Add HTTP cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=600');
    headers.set('CDN-Cache-Control', 'max-age=600');

    return NextResponse.json(result, { headers });
  } catch (err) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    return NextResponse.json(
      { movies: [], tv: [], all: [], error: String(err) },
      { status: 500, headers }
    );
  }
}
