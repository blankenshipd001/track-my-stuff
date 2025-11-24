"use client";

import { useState, useEffect } from "react";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import useFetchAllAvailableProviders from "@/hooks/useFetchAllAvailableProviders";
import { saveMyProviders } from "@utils/api/contentApi";
import { useRouter } from "next/navigation";
import useGetMyFavoriteProviders from "@/hooks/useGetMyFavoriteProviders";
import { Check } from "lucide-react";
import {
  Container,
  Header,
  HeaderTop,
  Title,
  Subtitle,
  AddButton,
  GridContainer,
  Grid,
} from "../watching/styles";
import styled from "styled-components";

const ProviderCard = styled.div<{ selected?: boolean }>`
  background: rgba(31, 41, 55, 0.8);
  border: 2px solid ${props => props.selected ? '#a855f7' : 'rgba(75, 85, 99, 0.5)'};
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    border-color: ${props => props.selected ? '#c084fc' : '#6b7280'};
    transform: translateY(-2px);
    box-shadow: ${props => props.selected 
      ? '0 12px 24px rgba(168, 85, 247, 0.2), 0 8px 12px rgba(0, 0, 0, 0.3)' 
      : '0 8px 12px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.15)'};
  }
`;

const ProviderName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

const CheckIcon = styled.div<{ selected?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? '#a855f7' : '#6b7280'};
  background: ${props => props.selected ? 'linear-gradient(to right, #a855f7, #ec4899)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  
  svg {
    color: white;
    opacity: ${props => props.selected ? 1 : 0};
  }
`;

const StatsCard = styled.div`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const StatsNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(to right, #c084fc, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatsLabel = styled.div`
  color: #9ca3af;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

interface PreferencesProps {
  user?: { uid: string; email?: string } | null;
}

/**
 * Providers Page
 * 
 * @returns {React.FC}
 */
const Preferences = ({ user }: PreferencesProps) => {
  console.log('Rendering Preferences with user:', user);
  const router = useRouter();
  const { allProviders } = useFetchAllAvailableProviders();
  console.log('All available providers:', allProviders);
  const { myFavoriteProviders } = useGetMyFavoriteProviders(user?.uid || "");

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
  // if (authLoading) {
  //   return <LoadingScreen />;
  // }

  // If user is not logged in, prompt them to log in
  // if (!user) {
  //   return (
  //     <Container sx={{ textAlign: "center", py: 8 }}>
  //       <Typography variant="h5" gutterBottom>
  //         Please log in to manage your preferences
  //       </Typography>
  //       <Button variant="contained" color="primary" onClick={() => router.push("/login")}>
  //         Log In
  //       </Button>
  //     </Container>
  //   );
  // }

// export default Preferences;
  

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
    if (!user?.uid) return;
    await saveMyProviders(user.uid, selectedProviders);
    router.push('/watching');
  };

  return (
    <Container>
      <Header>
        <HeaderTop>
          <div>
            <Title>Streaming Preferences</Title>
            <Subtitle>Select your favorite streaming providers</Subtitle>
          </div>
          <AddButton 
            onClick={handleAddToFavorites}
            disabled={selectedProviders.length < 1}
          >
            <Check size={20} />
            Save Favorites
          </AddButton>
        </HeaderTop>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatsCard>
            <StatsNumber>{selectedProviders.length}</StatsNumber>
            <StatsLabel>Selected Providers</StatsLabel>
          </StatsCard>
          <StatsCard>
            <StatsNumber>{allProviders.length}</StatsNumber>
            <StatsLabel>Available Providers</StatsLabel>
          </StatsCard>
        </div>
      </Header>

      <GridContainer>
        <Grid>
          {allProviders.map((provider) => {
            const isSelected = selectedProviderId.includes(provider.provider_id);
            return (
              <ProviderCard
                key={provider.provider_id}
                selected={isSelected}
                onClick={() => handleProviderSelect(provider)}
              >
                <ProviderName>{provider.provider_name}</ProviderName>
                <CheckIcon selected={isSelected}>
                  <Check size={16} />
                </CheckIcon>
              </ProviderCard>
            );
          })}
        </Grid>
      </GridContainer>
    </Container>
  );
};

export default Preferences;