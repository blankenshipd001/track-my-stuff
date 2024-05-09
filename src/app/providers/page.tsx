"use client";

import { useEffect, useState } from "react";
import { Container, Typography, List, ListItemButton, Checkbox, ListItemText, Button, Grid } from "@mui/material";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import useFetchAllAvailableProviders from "@/hooks/useFetchAllAvailableProviders";
import { saveMyProviders } from "@utils/api/contentApi";
import { UserAuth } from "@/utils/providers/auth-provider";
import { LoadingScreen } from "@/components/loading";
import useGetMyFavoriteProviders from "@/hooks/useGetMyFavoriteProviders";

/**
 * Providers Page
 * 
 * @returns {React.FC}
 */
const Preferences: React.FC = () => {
  const { googleSignIn, user } = UserAuth();
  const { allProviders } = useFetchAllAvailableProviders();
  const { isLoading, myFavoriteProviders } = useGetMyFavoriteProviders(user?.uid);
  const [selectedProviders, setSelectedProviders] = useState<ServiceProvider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<number[]>([]);

  /**
   * Handle adding the provider to the list of selected providers
   * @param providerId {number} id of the selected provider
   */
  const handleProviderSelect = async (provider: ServiceProvider) => {
    const isSelected = selectedProviderId.includes(provider.provider_id);
    if (isSelected) {
      setSelectedProviderId(selectedProviderId.filter((id) => id !== provider.provider_id));
      setSelectedProviders(selectedProviders.filter((p) => p.provider_id !== provider.provider_id));
    } else {
      setSelectedProviderId([...selectedProviderId, provider.provider_id]);
      setSelectedProviders([...selectedProviders, provider]);
    }
  };

  /**
   * Handle saving my list of favorites to the database
   */
  const handleAddToFavorites = async () => {
    if (user === null) {
      await googleSignIn();
    }

    await saveMyProviders(user.uid, selectedProviders);
  };

  useEffect(() => {    
    setSelectedProviders([...selectedProviders, ...myFavoriteProviders]);
  }, [myFavoriteProviders]);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Select Your Favorite Streaming Providers
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddToFavorites} disabled={selectedProviders.length < 1}>
        Add to Favorites
      </Button>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
            <List>
              {allProviders.slice(0, Math.ceil(allProviders.length / 2)).map((provider: ServiceProvider, index: number) => (
                <ListItemButton key={`${provider.provider_id} - ${index}`} onClick={() => handleProviderSelect(provider)}>
                  <ListItemText primary={provider.provider_name} />
                  <Checkbox checked={selectedProviderId.includes(provider.provider_id)} color="primary" onChange={() => handleProviderSelect(provider)} />
                </ListItemButton>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
            <List>
              {allProviders.slice(Math.ceil(allProviders.length / 2)).map((provider: ServiceProvider, index: number) => (
                <ListItemButton key={`${provider.provider_id} - ${index}`} onClick={() => handleProviderSelect(provider)}>
                  <ListItemText primary={provider.provider_name} />
                  <Checkbox checked={selectedProviderId.includes(provider.provider_id)} color="primary" onChange={() => handleProviderSelect(provider)} />
                </ListItemButton>
              ))}
            </List>
          </Grid>
        </Grid>
      )}
      <Button variant="contained" color="primary" onClick={handleAddToFavorites} disabled={selectedProviders.length < 1}>
        Add to Favorites
      </Button>
    </Container>
  );
};

export default Preferences;
