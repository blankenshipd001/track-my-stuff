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
    if (uid === "") {
      return;
    }
    
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const providers = await getMyFavoriteProviders(uid);
        if (isMounted) {
          setMyFavoriteProviders(providers);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [uid]);

  return { myFavoriteProviders, isLoading };
};

export default useGetMyFavoriteProviders;
