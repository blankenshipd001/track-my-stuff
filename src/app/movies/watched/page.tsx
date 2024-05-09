"use client";
import React, { useEffect, useState } from "react";
import { Grid, Container } from "@mui/material";
// import TheatersIcon from "@mui/icons-material/Theaters";
// import ConnectedTvIcon from "@mui/icons-material/ConnectedTv";
// import LiveTvIcon from "@mui/icons-material/LiveTv";
import { Movie } from "@/data-models/movie.interface";
import { useRouter } from "next/navigation";
import { getContent } from "@/utils/api/contentApi";
import { UserAuth } from "@/utils/providers/auth-provider";
import useGetMyFavoriteProviders from "@/hooks/useGetMyFavoriteProviders";
import { LoadingScreen } from "@/components/loading";
import { ServiceProvider } from "@/data-models/service-provider.interface";

// Main MovieGrid component
const Watched = () => {
  const { user } = UserAuth();
  const { isLoading, myFavoriteProviders } = useGetMyFavoriteProviders(user?.uid);

  const moviesByPurchaseProvider: Map<string, Movie[]> = new Map<string, Movie[]>();
  const moviesByRentalProvider: Map<string, Movie[]> = new Map<string, Movie[]>();
  const moviesByStreamingProvider: Map<string, Movie[]> = new Map<string, Movie[]>();

  const [watchList, setWatchList] = useState<Movie[]>([]);
  const router = useRouter();

  /**
   * Loads movies when the page loads
   */
  useEffect(() => {
    if (user !== null) {
      getContent(user?.uid)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((data: any) => {
          console.log("setting watch list");
          // console.log(data);
          setWatchList(data);
        })
        .catch((err) => {
          console.error("Error making async call: " + err);
          router.push("/");
        });
    } else {
      // No user is signed in.
      console.log("no one home");
      router.push("/");
    }
  }, [user]);

  // const buildWatchList = (providerList: ServiceProvider[], movie: Movie, movieList: Map<string, Movie[]>) => {
  const buildWatchList = (providerList: ServiceProvider[], movie: Movie, movieList: Map<string, Movie[]>) => {
    providerList?.forEach((movieProvider) => {
      //find out if each one exists in my favorites list
      const provider = myFavoriteProviders.find((p) => {
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


  const buildPurchaseWatchList = () => {
    const lists: { purchase: Map<string, Movie[]>; rental: Map<string, Movie[]>; streamer: Map<string, Movie[]> } = {
      purchase: new Map<string, Movie[]>,
      rental: new Map<string, Movie[]>,
      streamer: new Map<string, Movie[]>,
    };

    if (watchList.length > 0 && myFavoriteProviders.length > 0) {
      watchList.forEach((movie) => {
        lists.purchase = buildWatchList(movie.providers.buy, movie, moviesByPurchaseProvider);
        lists.rental = buildWatchList(movie.providers.rent, movie, moviesByRentalProvider);
        lists.streamer = buildWatchList(movie.providers.flatrate, movie, moviesByStreamingProvider);
      });
    }

    return lists;
  };

  // const buildRentalWatchList = () => {
  //   if (watchList.length > 0 && myFavoriteProviders.length > 0) {
  //     watchList.forEach((movie) => {
  //       //get a list of their providers
  //       const purchaseProviders = movie.providers.rent ?? [];

  //       purchaseProviders.forEach((movieProvider) => {
  //         //find out if each one exists in my favorites list
  //         const provider = myFavoriteProviders.find((p) => {
  //           return p.provider_id === movieProvider.provider_id;
  //         });

  //         if (provider) {
  //           if (!moviesByRentalProvider.has(provider.provider_name)) {
  //             moviesByRentalProvider.set(provider.provider_name, []);
  //           }
  //           moviesByRentalProvider.get(provider.provider_name)?.push(movie);
  //         }
  //       });
  //     });
  //   }

  //   return moviesByRentalProvider;
  // };

  // const buildStreamingWatchList = () => {
  //   if (watchList.length > 0 && myFavoriteProviders.length > 0) {
  //     watchList.forEach((movie) => {
  //       //get a list of their providers
  //       const purchaseProviders = movie.providers.flatrate ?? [];

  //       purchaseProviders.forEach((movieProvider) => {
  //         //find out if each one exists in my favorites list
  //         const provider = myFavoriteProviders.find((p) => {
  //           return p.provider_id === movieProvider.provider_id;
  //         });

  //         if (provider) {
  //           if (!moviesByStreamingProvider.has(provider.provider_name)) {
  //             moviesByStreamingProvider.set(provider.provider_name, []);
  //           }
  //           moviesByStreamingProvider.get(provider.provider_name)?.push(movie);
  //         }
  //       });
  //     });
  //   }

  //   return moviesByStreamingProvider;
  // };

  interface Props {
    providers: Map<string, Movie[]>;
    listName: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ProviderList: React.FC<Props> = ({ providers, listName }) => {
    return (
      <Grid container spacing={4}>
        {Array.from(providers.entries()).map(([providerName, providerMovies]) => {
          return (
            <div key={providerName}>
              <h2>{listName}: {providerName}</h2>
              <ul>
                {providerMovies.map((movie: Movie) => (
                  <li key={movie.id}>{movie.title}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </Grid>
    );
  };

  if (!isLoading) {
    const lists = buildPurchaseWatchList();

    return (
      <Container>
        <ProviderList providers={lists.streamer} listName="Stream" />

        <ProviderList providers={lists.rental} listName="Rent"/>

        <ProviderList providers={lists.purchase} listName="Purchase" />
      </Container>
    );
  } else {
    return <LoadingScreen />;
  }
};

export default Watched;
