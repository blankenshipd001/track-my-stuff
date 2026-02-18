

"use client";

import { useState, useEffect, useRef } from "react";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import useFetchAllAvailableProviders from "@/hooks/useFetchAllAvailableProviders";
import { saveMyProviders } from "@utils/api/contentApi";
import { useRouter } from "next/navigation";
import useGetMyFavoriteProviders from "@/hooks/useGetMyFavoriteProviders";
import { Check, Search, Loader2 } from "lucide-react";
import {
  Container,
  Header,
  HeaderTop,
  Title,
  Subtitle,
  AddButton,
  GridContainer,
  Grid,
} from "../activity/styles";
import styled from "styled-components";
import Image from "next/image";
import { getProxyImageUrlForPath } from '@/lib/imageUrl';
import { COLORS, GRADIENTS } from '@/lib/theme-constants';

const ProviderCard = styled.div<{ selected?: boolean }>`
  background: rgba(31, 41, 55, 0.8);
  border: 2px solid ${props => props.selected ? COLORS.purple.solid : 'rgba(75, 85, 99, 0.5)'};
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    border-color: ${props => props.selected ? COLORS.purple.solid : '#6b7280'};
    transform: translateY(-2px);
    box-shadow: ${props => props.selected 
      ? '0 12px 24px rgba(168, 85, 247, 0.2), 0 8px 12px rgba(0, 0, 0, 0.3)' 
      : '0 8px 12px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.15)'};
  }
`;

const ProviderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const LogoContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
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
  border: 2px solid ${props => props.selected ? COLORS.purple.solid : '#6b7280'};
  background: ${props => props.selected ? GRADIENTS.textPurplePink : 'transparent'};
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
  border-radius: 0.5rem;
  padding: 0.5rem 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 0 1 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transform: translateY(-1px);
  }
`;

const StatsNumber = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  background: ${GRADIENTS.textPurplePink};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
`;

const StatsLabel = styled.div`
  color: ${COLORS.gray[400]};
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(31, 41, 55, 0.8);
  border: 2px solid rgba(75, 85, 99, 0.5);
  border-radius: 1rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

  &:focus {
    outline: none;
    border-color: ${COLORS.purple.solid};
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
  }

  &::placeholder {
    color: ${COLORS.gray[400]};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
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
  const router = useRouter();
  const { allProviders } = useFetchAllAvailableProviders();
  const { myFavoriteProviders } = useGetMyFavoriteProviders(user?.uid || "");

  const [selectedProviders, setSelectedProviders] = useState<ServiceProvider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize the selected providers with existing favorites
  useEffect(() => {
    if (myFavoriteProviders?.length) {
      setSelectedProviders(myFavoriteProviders);
      setSelectedProviderId(myFavoriteProviders.map((p) => p.provider_id));
    }
  }, [myFavoriteProviders]);

  /**
   * Handle adding/removing the provider to/from the list of selected providers
   */
  const handleProviderSelect = async (provider: ServiceProvider) => {
    const isSelected = selectedProviderId.includes(provider.provider_id);
    
    let updatedProviders: ServiceProvider[];
    if (isSelected) {
      setSelectedProviderId((prev) => prev.filter((id) => id !== provider.provider_id));
      setSelectedProviders((prev) => {
        updatedProviders = prev.filter((p) => p.provider_id !== provider.provider_id);
        return updatedProviders;
      });
    } else {
      setSelectedProviderId((prev) => [...prev, provider.provider_id]);
      setSelectedProviders((prev) => {
        updatedProviders = [...prev, provider];
        return updatedProviders;
      });
    }

    // Auto-save with debounce
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(async () => {
      if (!user?.uid) return;
      setIsSaving(true);
      try {
        // Wait for state to update before saving
        await new Promise(resolve => setTimeout(resolve, 0));
        await saveMyProviders(user.uid, isSelected 
          ? selectedProviders.filter((p) => p.provider_id !== provider.provider_id)
          : [...selectedProviders, provider]
        );
      } catch (error) {
        console.error('Error auto-saving providers:', error);
      } finally {
        setIsSaving(false);
      }
    }, 500);
  };

  // Filter providers based on search query
  const filteredProviders = allProviders.filter((provider) =>
    provider.provider_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * Handle saving my list of favorites to the database
   */
  const handleAddToFavorites = async () => {
    if (!user?.uid) return;
    setIsSaving(true);
    try {
      await saveMyProviders(user.uid, selectedProviders);
      router.push('/watching');
    } catch (error) {
      console.error('Error saving providers:', error);
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <Header>
        <HeaderTop>
          <div>
            <Title>Streaming Providers</Title>
            <Subtitle>Select your current streaming providers</Subtitle>
          </div>
          <AddButton 
            onClick={handleAddToFavorites}
            disabled={selectedProviders.length < 1 || isSaving}
          >
            {isSaving ? (
              <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Check size={20} />
            )}
            {isSaving ? 'Saving...' : 'Save Favorites'}
          </AddButton>
        </HeaderTop>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <StatsCard>
            <StatsNumber>{selectedProviders.length}</StatsNumber>
            <StatsLabel>Selected Providers</StatsLabel>
          </StatsCard>
          <StatsCard>
            <StatsNumber>{filteredProviders.length}</StatsNumber>
            <StatsLabel>Showing Providers</StatsLabel>
          </StatsCard>
          <StatsCard>
            <StatsNumber>{allProviders.length}</StatsNumber>
            <StatsLabel>Total Providers</StatsLabel>
          </StatsCard>
        </div>
      </Header>

      <SearchContainer>
        <SearchIcon>
          <Search size={20} />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search providers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>

      <GridContainer>
        <Grid>
          {[...filteredProviders].sort((a, b) => a.display_priority - b.display_priority).map((provider) => {
            const isSelected = selectedProviderId.includes(provider.provider_id);
            return (
              <ProviderCard
                key={provider.provider_id}
                selected={isSelected}
                onClick={() => handleProviderSelect(provider)}
              >
                <ProviderInfo>
                  <LogoContainer>
                    {provider.logo_path ? (
                      <Image
                        src={getProxyImageUrlForPath(provider.logo_path, 'w92')!}
                        alt={provider.provider_name}
                        width={40}
                        height={40}
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                        {provider.provider_name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </LogoContainer>
                  <ProviderName>{provider.provider_name}</ProviderName>
                </ProviderInfo>
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