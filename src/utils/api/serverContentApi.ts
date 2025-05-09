import { Movie } from "@/data-models/movie.interface";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
const popular_url = `https://api.themoviedb.org/3/movie/popular?api_key=${movie_api_key}&include_video=false`;

export async function fetchPopularContent(): Promise<Movie[]> {
  return fetch(popular_url)
    .then(async (res) => {
      const json = await res.json();
      return json;
    })
    .then(async (popularRes) => {
      const trendingResults: Movie[] = await Promise.all(
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

export async function getMovieDetails(slug: string): Promise<Movie | null> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${slug}?api_key=${movie_api_key}&append_to_response=videos,images`, { cache: "no-store" });
  
  if (!res.ok) {
    return null
  }
  
  const movie = await res.json();

  const providerRes = await fetch(`https://api.themoviedb.org/3/movie/${slug}/watch/providers?api_key=${movie_api_key}`);
  const providerData = await providerRes.json();

  return {
    ...movie,
    movieId: Number(movie.id),
    providers: providerData.results?.US ?? [],
  };
}

export async function getRecommendedMovies(genreId: number): Promise<Movie[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&with_genres=${genreId}&api_key=${movie_api_key}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.results || [];
}


export async function getTVDetails(slug: string): Promise<Movie | null> {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${slug}?api_key=${movie_api_key}&append_to_response=videos,images`, { cache: "no-store" });
  
  if (!res.ok) {
    return null
  }
  
  const tv = await res.json();
  const providerRes = await fetch(`https://api.themoviedb.org/3/tv/${slug}/watch/providers?api_key=${movie_api_key}`);
  const providerData = await providerRes.json();

  return {
    ...tv,
    movieId: Number(tv.id),
    providers: providerData.results?.US ?? [],
  };
}

export async function getRecommendedTV(genreId: number): Promise<Movie[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?include_adult=false&with_genres=${genreId}&api_key=${movie_api_key}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.results || [];
}