import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
const popular_url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&include_video=false`;

export async function GET() {
  try {
    // Fetch popular movies with cache tag and ISR
    const popularRes = await fetch(popular_url, {
      next: {
        tags: ['popular-movies'],
        revalidate: 1800, // 30 minutes - popular content changes more frequently
      },
    }).then(r => r.json());

    if (!Array.isArray(popularRes.results)) {
      throw new Error('Invalid response from TMDB');
    }

    // Batch providers in groups of 5 to reduce request overload and avoid N+1 pattern
    const BATCH_SIZE = 5;
    const moviesWithProviders = [];

    for (let i = 0; i < popularRes.results.length; i += BATCH_SIZE) {
      const batch = popularRes.results.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.all(
        batch.map(async (item: { id?: number; [key: string]: unknown }) => {
          try {
            const providerRes = await fetch(
              `https://api.themoviedb.org/3/movie/${item.id}/watch/providers?api_key=${TMDB_API_KEY}&external_source=imdb_id`,
              {
                next: {
                  tags: ['popular-providers', `movie-provider:${item.id}`],
                  revalidate: 86400, // 24 hours - providers change slowly
                },
              }
            );

            const providers = await providerRes.json();

            return {
              ...item,
              movieId: item.id,
              providers: providers.results?.US ?? [],
            };
          } catch (error) {
            console.error(`Error fetching providers for movie ${item.id}:`, error);
            return {
              ...item,
              movieId: item.id,
              providers: [],
            };
          }
        })
      );

      moviesWithProviders.push(...batchResults);

      // Add small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < popularRes.results.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const result = { movies: moviesWithProviders };

    // Add HTTP cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=1800, stale-while-revalidate=3600');
    headers.set('CDN-Cache-Control', 'max-age=3600');

    return NextResponse.json(result, { headers });
  } catch (err) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    return NextResponse.json(
      { movies: [], error: String(err) },
      { status: 500, headers }
    );
  }
}
