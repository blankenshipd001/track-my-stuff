"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { Media } from "@/data-models/media.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import NextImage from "next/image";
// Import styled components from MyWatchlist
import {
  Modal,
  ModalContent,
  ModalTitle,
  FormGroup,
  Label,
  Input,
  Select,
  ButtonGroup,
  Button,
  Stars,
  Star,
} from "./styles";

interface WatchlistModalProps {
  show: boolean;
  editingId: number | null | undefined;
  formData: Media;
  myFavoriteProviders: ServiceProvider[];
  handleCancel: () => void;
  handleSave: () => void;
  setFormData: React.Dispatch<React.SetStateAction<Media>>;
}

const WatchlistModal = ({
  show,
  editingId,
  formData,
  myFavoriteProviders,
  handleCancel,
  handleSave,
  setFormData,
}: WatchlistModalProps) => {
  if (!show) return null;

  // Derive totals for TV shows (display only)
  const totalNumberOfSeasons = formData.type === 'tv' && typeof formData.seasonCount === 'number' ? formData.seasonCount : 0;
  const totalNumberOfEpisodes = formData.type === 'tv' && typeof formData.episodeCount === 'number' ? formData.episodeCount : 0;

  // Get max episodes for the current season
  // const currentSeasonNumber = (formData as Media & { currentSeason?: number }).currentSeason ?? 1;
  const maxEpisodesInCurrentSeason = 23;
  // = formData.type === 'tv' && Array.isArray(formData.seasons)
  //   ? (formData.seasons.find(s => s.season_number === currentSeasonNumber)?.episode_count ?? 0)
  //   : 0;

  return (
    <Modal onClick={handleCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header with poster and title */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
          {formData.poster_path && (
            <div style={{ flexShrink: 0 }}>
              <img
                src={getProxyImageUrlForPath(formData.poster_path, 'w185') || ''}
                alt="Poster"
                style={{ width: 120, height: 'auto', borderRadius: 8, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}
              />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <ModalTitle style={{ margin: 0, marginBottom: '0.5rem' }}>
              {formData?.title || formData.name}
            </ModalTitle>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                padding: '0.25rem 0.75rem', 
                background: 'rgba(168, 85, 247, 0.2)', 
                border: '1px solid rgba(168, 85, 247, 0.5)',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#c084fc'
              }}>
                {formData.type === 'movie' ? 'Movie' : 'TV Show'}
              </div>
              {formData.provider && myFavoriteProviders.find(p => String(p.provider_id) === String(formData.provider)) && (() => {
                const selectedProvider = myFavoriteProviders.find(p => String(p.provider_id) === String(formData.provider));
                return selectedProvider?.logo_path ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', background: '#fff', borderRadius: '6px' }}>
                    <NextImage
                      src={getProxyImageUrlForPath(selectedProvider.logo_path, 'w45')!}
                      alt={selectedProvider.provider_name}
                      width={20}
                      height={20}
                      style={{ objectFit: 'contain' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>
                      {selectedProvider.provider_name}
                    </span>
                  </div>
                ) : null;
              })()}
            </div>
            
            {/* Rating */}
            <div>
              <Label style={{ marginBottom: '0.5rem' }}>Your Rating</Label>
              <Stars>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    $filled={i < formData.rating} 
                    viewBox="0 0 20 20" 
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                    style={{ cursor: 'pointer' }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </Star>
                ))}
              </Stars>
            </div>
          </div>
        </div>

        {/* Two column layout for main content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {/* Main content */}
          <div>
            <FormGroup>
              <Label htmlFor="providerSelect">Streaming Provider</Label>
              <Select
                id="providerSelect"
                aria-label="Streaming Provider"
                value={formData.provider}
                onChange={(e) => {
                  const providerId = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    provider: providerId,
                    selectedStreamer: providerId,
                  }));
                }}
              >
                <option value="">Select a provider...</option>
                {myFavoriteProviders
                  .sort((a, b) => a.display_priority - b.display_priority)
                  .map((provider) => (
                    <option key={provider.provider_id} value={provider.provider_id}>
                      {provider.provider_name}
                    </option>
                  ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="statusSelect">Watching Status</Label>
              <Select 
                id="statusSelect" 
                aria-label="Choose a status" 
                value={formData.status} 
                onChange={(e) => setFormData({
                  ...formData,
                  status: e.target.value as "watching" | "completed" | "watchlist"
                })}
              >
                <option value="watchlist">📋 Watchlist</option>
                <option value="watching">👀 Watching</option>
                <option value="completed">✅ Completed</option>
              </Select>
            </FormGroup>

            {/* TV show progress */}
            {formData.type === 'tv' && (
              <>
                <FormGroup>
                  <Label>Where You Are</Label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.25rem' }}>Season</label>
                      <Input
                        type="number"
                        min="1"
                        max={totalNumberOfSeasons > 0 ? totalNumberOfSeasons : undefined}
                        value={(formData as Media & { currentSeason?: number }).currentSeason ?? 1}
                        onChange={(e) => {
                          const seasonVal = e.target.value === '' ? 1 : Math.max(1, Math.min(totalNumberOfSeasons || 1, parseInt(e.target.value, 10) || 1));
                          
                          // Check if the new season has fewer episodes than the current episode number
                          const maxEpisodesInNewSeason = Array.isArray(formData.seasons)
                            ? (formData.seasons.find(s => s.season_number === seasonVal)?.episode_count ?? 0)
                            : 0;
                          
                          const currentEpisode = (formData as Media & { currentEpisode?: number }).currentEpisode ?? 1;
                          const adjustedEpisode = maxEpisodesInNewSeason > 0 && currentEpisode > maxEpisodesInNewSeason 
                            ? maxEpisodesInNewSeason 
                            : currentEpisode;

                          setFormData(prev => ({ 
                            ...prev, 
                            currentSeason: seasonVal,
                            currentEpisode: adjustedEpisode
                          }));
                        }}
                        placeholder="Season"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.25rem' }}>Episode</label>
                      <Input
                        type="number"
                        min="1"
                        max={maxEpisodesInCurrentSeason > 0 ? maxEpisodesInCurrentSeason : undefined}
                        value={(formData as Media & { currentEpisode?: number }).currentEpisode ?? 1}
                        onChange={(e) => {
                          const epVal = e.target.value === '' ? 1 : Math.max(1, Math.min(maxEpisodesInCurrentSeason || 1, parseInt(e.target.value, 10) || 1));
                          setFormData(prev => ({ ...prev, currentEpisode: epVal }));
                        }}
                        placeholder="Episode"
                      />
                    </div>
                  </div>
                </FormGroup>

                {(totalNumberOfSeasons > 0 || totalNumberOfEpisodes > 0) && (
                  <div style={{ 
                    marginTop: '1rem',
                    padding: '1rem', 
                    background: 'rgba(168, 85, 247, 0.1)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(168, 85, 247, 0.2)'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#d1d5db', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.25rem' }}>
                        {totalNumberOfSeasons} / {totalNumberOfEpisodes}
                      </div>
                      <div>Total Seasons / Episodes</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Poster selection */}
        {formData.images?.posters && formData.images.posters.length > 1 && (
          <FormGroup style={{ marginTop: '1.5rem' }}>
            <Label htmlFor="posterSelect">Choose Poster</Label>
            <Select
              id="posterSelect"
              aria-label="Select poster"
              value={formData.poster_path || ''}
              onChange={(e) => setFormData({ ...formData, poster_path: e.target.value })}
            >
              <option value="">Default</option>
              {formData.images.posters.map((p, idx) => (
                <option key={p.file_path} value={p.file_path}>Poster {idx + 1}</option>
              ))}
            </Select>
          </FormGroup>
        )}

        {/* Action buttons */}
        <ButtonGroup style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(75, 85, 99, 0.3)' }}>
          <Button variant="secondary" onClick={handleCancel}>
            <X size={16} />
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Check size={16} />
            {editingId ? "Save Changes" : "Add to Watchlist"}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default WatchlistModal;