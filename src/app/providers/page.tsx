"use client";

import { useEffect, useState } from "react";
import { Container, Typography, List, ListItemButton, Checkbox, ListItemText, Button, Grid } from "@mui/material";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import useFetchAllAvailableProviders from "@/hooks/useFetchAllAvailableProviders";
import { saveMyProviders } from "@utils/api/contentApi";
import { LoadingScreen } from "@/components/loading";
import useGetMyFavoriteProviders from "@/hooks/useGetMyFavoriteProviders";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/**
 * Providers Page
 * 
 * @returns {React.FC}
 */
const Preferences: React.FC = () => {
  const { user, loading: authLoading, login } = useCurrentUser();
  const { allProviders } = useFetchAllAvailableProviders();

  // Always call hook at top-level to avoid conditional hook usage
  const { isLoading, myFavoriteProviders } = useGetMyFavoriteProviders(user?.uid || "");

  const [selectedProviders, setSelectedProviders] = useState<ServiceProvider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<number[]>([]);

    // Initialize the selected providers with existing favorites
    useEffect(() => {
      if (myFavoriteProviders?.length) {
        setSelectedProviders(myFavoriteProviders);
        setSelectedProviderId(myFavoriteProviders.map((p) => p.provider_id));
      }
    }, [myFavoriteProviders]);

  // If auth is still initializing, show a loading screen
  if (authLoading) {
    return <LoadingScreen />;
  }

  // If user is not logged in, prompt them to log in
  if (!user) {
    return (
      <Container sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" gutterBottom>
          Please log in to manage your preferences
        </Typography>
        <Button variant="contained" color="primary" onClick={login}>
          Log In
        </Button>
      </Container>
    );
  }

  /**
   * Handle adding/removing the provider to/from the list of selected providers
   */
  const handleProviderSelect = (provider: ServiceProvider) => {
    const isSelected = selectedProviderId.includes(provider.provider_id);
    if (isSelected) {
      setSelectedProviderId((prev) => prev.filter((id) => id !== provider.provider_id));
      setSelectedProviders((prev) => prev.filter((p) => p.provider_id !== provider.provider_id));
    } else {
      setSelectedProviderId((prev) => [...prev, provider.provider_id]);
      setSelectedProviders((prev) => [...prev, provider]);
    }
  };

  /**
   * Handle saving my list of favorites to the database
   */
  const handleAddToFavorites = async () => {
    await saveMyProviders(user.uid, selectedProviders);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Select Your Favorite Streaming Providers
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddToFavorites}
        disabled={selectedProviders.length < 1}
        sx={{ mb: 2 }}
      >
        Save Favorites
      </Button>

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
            <List>
              {allProviders
                .slice(0, Math.ceil(allProviders.length / 2))
                .map((provider, index) => (
                  <ListItemButton
                    key={`${provider.provider_id}-${index}`}
                    onClick={() => handleProviderSelect(provider)}
                  >
                    <ListItemText primary={provider.provider_name} />
                    <Checkbox
                      checked={selectedProviderId.includes(provider.provider_id)}
                      color="primary"
                      onChange={() => handleProviderSelect(provider)}
                    />
                  </ListItemButton>
                ))}
            </List>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
            <List>
              {allProviders
                .slice(Math.ceil(allProviders.length / 2))
                .map((provider, index) => (
                  <ListItemButton
                    key={`${provider.provider_id}-${index}`}
                    onClick={() => handleProviderSelect(provider)}
                  >
                    <ListItemText primary={provider.provider_name} />
                    <Checkbox
                      checked={selectedProviderId.includes(provider.provider_id)}
                      color="primary"
                      onChange={() => handleProviderSelect(provider)}
                    />
                  </ListItemButton>
                ))}
            </List>
          </Grid>
        </Grid>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddToFavorites}
        disabled={selectedProviders.length < 1}
        sx={{ mt: 2 }}
      >
        Save Favorites
      </Button>
    </Container>
  );
};

export default Preferences;
