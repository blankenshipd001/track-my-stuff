import { useState, useEffect } from "react";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { getMyFavoriteProviders } from "@/utils/api/contentApi";

/**
 * Get the user's favorite service providers
 * 
 * @param uid {string} user's id to get favorites for
 * @returns {ServiceProvider[]} user's service providers
 */
const useGetMyFavoriteProviders = (uid: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [myFavoriteProviders, setMyFavoriteProviders] = useState<ServiceProvider[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      getMyFavoriteProviders(uid).then((providers) => {
        setMyFavoriteProviders(providers);
        setIsLoading(false);
      });

    };
    fetchData();
  }, [uid]);

  return { myFavoriteProviders, isLoading };
};

export default useGetMyFavoriteProviders;
