import { Media } from "@/data-models/media.interface";

const movie_api_key = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
const popular_url = `https://api.themoviedb.org/3/movie/popular?api_key=${movie_api_key}&include_video=false`;

export async function fetchPopularContent(): Promise<Media[]> {
  return fetch(popular_url, { next: { revalidate: 3600 } }) // Cache for 1 hour
    .then(async (res) => {
      const json = await res.json();
      return json;
    })
    .then(async (popularRes) => {
      const trendingResults: Media[] = await Promise.all(
        popularRes.results.map((item: { id: unknown }) => {
          return fetch(`https://api.themoviedb.org/3/movie/${item.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`)
            .then((res) => res.json())
            .then((providers) => {
              const newMovie = {
                ...item,
                movieId: item.id,
                providers: providers.results.US ?? [],
              };

              return newMovie;
            });
        })
      );

      return trendingResults;
    });
}

export async function getMovieDetails(slug: string): Promise<Media | null> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${slug}?api_key=${movie_api_key}&append_to_response=videos,images`, { next: { revalidate: 3600 } }); // Cache for 1 hour
  
  if (!res.ok) {
    return null
  }
  
  const movie = await res.json();

  const providerRes = await fetch(`https://api.themoviedb.org/3/movie/${slug}/watch/providers?api_key=${movie_api_key}`, { next: { revalidate: 3600 } }); // Cache for 1 hour
  const providerData = await providerRes.json();

  return {
    ...movie,
    movieId: Number(movie.id),
    providers: providerData.results?.US ?? [],
  };
}

/**
 * Fetch the most recent season's episodes for a TV show by TMDB id
 * @param tvId The TMDB id of the TV show
 * @returns An object with season_number and episodes[] for the most recent season, or null if not found
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMostRecentSeasonEpisodes(tvId: string | number): Promise<{ season_number: number; episodes: any[] } | null> {
  // Get show details to find all seasons - cache for 1 hour
  const tvRes = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${movie_api_key}`, { next: { revalidate: 3600 } });

  if (!tvRes.ok) return null;
  const tv = await tvRes.json();

  if (!Array.isArray(tv.seasons) || tv.seasons.length === 0) return null;
  // Find the most recent (highest season_number) season
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validSeasons = tv.seasons.filter((s: any) => s.season_number !== 0);

  if (validSeasons.length === 0) return null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mostRecent = validSeasons.reduce((a: any, b: any) => (a.season_number > b.season_number ? a : b));
  const season_number = mostRecent.season_number;
  
  // Fetch episodes for that season - cache for 1 hour
  const seasonRes = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/${season_number}?api_key=${movie_api_key}`, { next: { revalidate: 3600 } });

  if (!seasonRes.ok) {
    return null;
  } 

  const seasonData = await seasonRes.json();

  return {
    season_number,
    episodes: Array.isArray(seasonData.episodes) ? seasonData.episodes : [],
  };
}

export async function getRecommendedMovies(genreId: number): Promise<Media[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&with_genres=${genreId}&api_key=${movie_api_key}`,
    { next: { revalidate: 7200 } } // Cache for 2 hours
  );
  const data = await res.json();
  return data.results || [];
}

export async function getTVDetails(slug: string): Promise<Media | null> {
  // Step 1: Get show details (already have slug as TV id)
  const res = await fetch(`https://api.themoviedb.org/3/tv/${slug}?api_key=${movie_api_key}&append_to_response=videos,images`, { next: { revalidate: 3600 } }); // Cache for 1 hour
  if (!res.ok) {
    return null;
  }
  const tv = await res.json();

  // Step 2: For each season, fetch all episodes and group by season
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let episodesBySeason: Array<{ season_number: number; episodes: any[] }> = [];
  if (Array.isArray(tv.seasons)) {
    episodesBySeason = await Promise.all(
      tv.seasons
        .filter((season: { season_number: number }) => season.season_number !== 0)
        .map(async (season: { season_number: number }) => {
          const season_number = season.season_number;
          const seasonRes = await fetch(`https://api.themoviedb.org/3/tv/${slug}/season/${season_number}?api_key=${movie_api_key}`, { next: { revalidate: 3600 } }); // Cache for 1 hour
          if (!seasonRes.ok) return { season_number, episodes: [] };
          const seasonData = await seasonRes.json();
          return {
            season_number,
            episodes: Array.isArray(seasonData.episodes) ? seasonData.episodes : [],
          };
        })
    );
  }

  // Step 3: Get providers
  const providerRes = await fetch(`https://api.themoviedb.org/3/tv/${slug}/watch/providers?api_key=${movie_api_key}`, { next: { revalidate: 3600 } }); // Cache for 1 hour
  const providerData = await providerRes.json();

  return {
    ...tv,
    movieId: Number(tv.id),
    providers: providerData.results?.US ?? [],
    episodes: episodesBySeason,
  };
}

export async function getRecommendedTV(genreId: number): Promise<Media[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?include_adult=false&with_genres=${genreId}&api_key=${movie_api_key}`,
    { next: { revalidate: 7200 } } // Cache for 2 hours
  );
  const data = await res.json();
  return data.results || [];
}