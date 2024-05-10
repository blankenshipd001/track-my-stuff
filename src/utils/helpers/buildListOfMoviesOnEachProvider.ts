import { Movie } from "@/data-models/movie.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";


export const addMovieToProviderList = (providersByMovie: ServiceProvider[], movie: Movie, providerList: ServiceProvider[], movieList: Map<string, Movie[]> = new Map<string, Movie[]>) => {
  providersByMovie?.forEach((movieProvider) => {
    //find out if each one exists in my favorites list
    const provider = providerList.find((p) => {
      return p.provider_id === movieProvider.provider_id;
    });

    if (provider) {
      if (!movieList.has(provider.provider_name)) {
        movieList.set(provider.provider_name, []);
      }
      movieList.get(provider.provider_name)?.push(movie);
    }
  });

  return movieList;
};

interface Lists {
  purchase: Map<string, Movie[]>;
  rental: Map<string, Movie[]>;
  streamer: Map<string, Movie[]>;
}

/**
 * Take a list of movies and a list of providers. If the movie has a provider in the providerList then sort it there.
 * 
 * @param watchList {Movie[]} list of movies to sort by providers
 * @param providerList {ServiceProvider[]} list of providers to sort movies for
 * @returns {Lists} a set of lists that contain movies sorted by provider
 */
export const buildListOfMoviesOnEachProvider = (watchList: Movie[], providerList: ServiceProvider[]): Lists => {
  const lists: { purchase: Map<string, Movie[]>; rental: Map<string, Movie[]>; streamer: Map<string, Movie[]> } = {
    purchase: new Map<string, Movie[]>(),
    rental: new Map<string, Movie[]>(),
    streamer: new Map<string, Movie[]>(),
  };

  const moviesByPurchaseProvider: Map<string, Movie[]> = new Map<string, Movie[]>();
  const moviesByRentalProvider: Map<string, Movie[]> = new Map<string, Movie[]>();
  const moviesByStreamingProvider: Map<string, Movie[]> = new Map<string, Movie[]>();

  if (watchList.length > 0 && providerList.length > 0) {
    watchList.forEach((movie) => {
      lists.purchase = addMovieToProviderList(movie.providers.buy, movie, providerList, moviesByPurchaseProvider);
      lists.rental = addMovieToProviderList(movie.providers.rent, movie, providerList, moviesByRentalProvider);
      lists.streamer = addMovieToProviderList(movie.providers.flatrate, movie, providerList, moviesByStreamingProvider);
    });
  }

  return lists;
};
