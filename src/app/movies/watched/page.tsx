"use client";
import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { Movie } from "@/data-models/movie.interface";
import { useRouter } from "next/navigation";
import { getContent } from "@/utils/api/contentApi";
import useGetMyFavoriteProviders from "@/hooks/useGetMyFavoriteProviders";
import { LoadingScreen } from "@/components/loading";
import { ProviderList } from "@/components/provider";
import { buildListOfMoviesOnEachProvider } from "@/utils/helpers/buildListOfMoviesOnEachProvider";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Main MovieGrid component
const Watched = () => {
  const { user } = useCurrentUser();
  const { isLoading, myFavoriteProviders } = useGetMyFavoriteProviders(user?.uid || "");

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
          setWatchList(data);
        })
        .catch((err) => {
          console.error("Error making async call: " + err);
          router.push("/");
        });
    } else {
      // No user is signed in.
      router.push("/");
    }
  }, [user]);

  if (!isLoading) {
    const lists = buildListOfMoviesOnEachProvider(watchList, myFavoriteProviders);

    return (
      <Container>
        <ProviderList providers={lists.streamer} listName="Stream" />

        <ProviderList providers={lists.rental} listName="Rent" />

        <ProviderList providers={lists.purchase} listName="Purchase" />
      </Container>
    );
  } else {
    return <LoadingScreen />;
  }
};

export default Watched;
