import { Media } from "@/data-models/media.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";


export const addMovieToProviderList = (providersByMovie: ServiceProvider[], movie: Media, providerList: ServiceProvider[], movieList: Map<string, Media[]> = new Map<string, Media[]>) => {
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
  purchase: Map<string, Media[]>;
  rental: Map<string, Media[]>;
  streamer: Map<string, Media[]>;
}

/**
 * Take a list of movies and a list of providers. If the movie has a provider in the providerList then sort it there.
 * 
 * @param watchList {Media[]} list of movies to sort by providers
 * @param providerList {ServiceProvider[]} list of providers to sort movies for
 * @returns {Lists} a set of lists that contain movies sorted by provider
 */
export const buildListOfMoviesOnEachProvider = (watchList: Media[], providerList: ServiceProvider[]): Lists => {
  const lists: { purchase: Map<string, Media[]>; rental: Map<string, Media[]>; streamer: Map<string, Media[]> } = {
    purchase: new Map<string, Media[]>(),
    rental: new Map<string, Media[]>(),
    streamer: new Map<string, Media[]>(),
  };

  const moviesByPurchaseProvider: Map<string, Media[]> = new Map<string, Media[]>();
  const moviesByRentalProvider: Map<string, Media[]> = new Map<string, Media[]>();
  const moviesByStreamingProvider: Map<string, Media[]> = new Map<string, Media[]>();

  if (watchList.length > 0 && providerList.length > 0) {
    watchList.forEach((movie) => {
      lists.purchase = addMovieToProviderList(movie?.providers?.buy, movie, providerList, moviesByPurchaseProvider);
      lists.rental = addMovieToProviderList(movie?.providers?.rent, movie, providerList, moviesByRentalProvider);
      lists.streamer = addMovieToProviderList(movie?.providers?.flatrate, movie, providerList, moviesByStreamingProvider);
    });
  }

  return lists;
};
