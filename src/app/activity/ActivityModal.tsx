"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { Box, Button, Typography } from "@mui/material";
import { Media } from "@/data-models/media.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import NextImage from "next/image";
import { COLORS } from "@/lib/theme-constants";

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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(31, 41, 55, 0.8)",
    border: "1px solid rgba(75, 85, 99, 0.5)",
    borderRadius: "0.5rem",
    padding: "0.75rem",
    color: "white",
    fontSize: "0.875rem",
    boxSizing: "border-box",
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(31, 41, 55, 0.8)",
    border: "1px solid rgba(75, 85, 99, 0.5)",
    borderRadius: "0.5rem",
    padding: "0.75rem",
    color: "white",
    fontSize: "0.875rem",
    cursor: "pointer",
  };

  return (
    <Box
      onClick={handleCancel}
      sx={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        p: "1rem",
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          background: "#1f2937",
          borderRadius: "1rem",
          p: "2rem",
          maxWidth: "800px",
          width: "100%",
          border: "1px solid rgba(75, 85, 99, 0.5)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header with poster and title */}
        <Box sx={{ display: 'flex', gap: '1.5rem', mb: '2rem', alignItems: 'flex-start' }}>
          {formData.poster_path && (
            <Box sx={{ flexShrink: 0 }}>
              <img
                src={getProxyImageUrlForPath(formData.poster_path, 'w185') || ''}
                alt="Poster"
                style={{ width: 120, height: 'auto', borderRadius: 8, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}
              />
            </Box>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography component="h2" sx={{ fontSize: "1.5rem", fontWeight: "bold", m: 0, mb: '0.5rem' }}>
              {formData?.title || formData.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', mb: '1rem' }}>
              <Box sx={{ 
                padding: '0.25rem 0.75rem', 
                background: COLORS.purple[300], 
                border: `1px solid ${COLORS.purple[600]}`,
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: COLORS.purple.solid
              }}>
                {formData.type === 'movie' ? 'Movie' : 'TV Show'}
              </Box>
              {formData.provider && myFavoriteProviders.find(p => String(p.provider_id) === String(formData.provider)) && (() => {
                const selectedProvider = myFavoriteProviders.find(p => String(p.provider_id) === String(formData.provider));
                return selectedProvider?.logo_path ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', p: '0.25rem 0.75rem', background: '#fff', borderRadius: '6px' }}>
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
                  </Box>
                ) : null;
              })()}
            </Box>
            
            {/* Rating */}
            <Box>
              <Typography component="label" sx={{ display: "block", fontSize: "0.875rem", fontWeight: 500, mb: '0.5rem', color: '#d1d5db' }}>
                Your Rating
              </Typography>
              <Box sx={{ display: "flex", gap: "0.25rem" }}>
                {[...Array(5)].map((_, i) => (
                  <Button
                    key={i} 
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                    sx={{ minWidth: 0, p: 0, color: i < formData.rating ? "#fbbf24" : "rgba(255,255,255,0.45)" }}
                  >
                    <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Two column layout for main content */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {/* Main content */}
          <Box>
            <Box sx={{ mb: '1rem' }}>
              <Typography component="label" htmlFor="providerSelect" sx={{ display: "block", fontSize: "0.875rem", fontWeight: 500, mb: '0.5rem', color: '#d1d5db' }}>
                Streaming Provider
              </Typography>
              <select
                id="providerSelect"
                aria-label="Streaming Provider"
                title="Streaming Provider"
                value={formData.provider}
                style={selectStyle}
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
              </select>
            </Box>

            <Box sx={{ mb: '1rem' }}>
              <Typography component="label" htmlFor="statusSelect" sx={{ display: "block", fontSize: "0.875rem", fontWeight: 500, mb: '0.5rem', color: '#d1d5db' }}>
                Watching Status
              </Typography>
              <select 
                id="statusSelect" 
                aria-label="Watching Status"
                title="Watching Status"
                value={formData.status} 
                style={selectStyle}
                onChange={(e) => setFormData({
                  ...formData,
                  status: e.target.value as "watching" | "completed" | "watchlist"
                })}
              >
                <option value="watchlist">📋 Watchlist</option>
                <option value="watching">👀 Watching</option>
                <option value="completed">✅ Completed</option>
              </select>
            </Box>

            {/* TV show progress */}
            {formData.type === 'tv' && (
              <>
                <Box sx={{ mb: '1rem' }}>
                  <Typography sx={{ display: "block", fontSize: "0.875rem", fontWeight: 500, mb: '0.5rem', color: '#d1d5db' }}>
                    Where You Are
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <Box>
                      <label style={{ fontSize: '0.75rem', color: COLORS.gray[400], display: 'block', marginBottom: '0.25rem' }}>Season</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min="1"
                        max={totalNumberOfSeasons > 0 ? totalNumberOfSeasons : undefined}
                        value={(formData as Media & { currentSeason?: number }).currentSeason ?? 1}
                        style={inputStyle}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            setFormData(prev => ({ ...prev, currentSeason: 1 }));
                            return;
                          }
                          const seasonVal = Math.max(1, Math.min(totalNumberOfSeasons || 1, parseInt(val, 10) || 1));
                          
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
                        onKeyDown={(e) => {
                          // Prevent backspace from navigating back
                          if (e.key === 'Backspace' && e.currentTarget.value.length === 1) {
                            e.preventDefault();
                            setFormData(prev => ({ ...prev, currentSeason: 1 }));
                          }
                          // Allow: backspace, delete, tab, escape, enter, arrows, and numbers
                          if (
                            e.key === 'Backspace' ||
                            e.key === 'Delete' ||
                            e.key === 'Tab' ||
                            e.key === 'Escape' ||
                            e.key === 'Enter' ||
                            e.key === 'ArrowLeft' ||
                            e.key === 'ArrowRight' ||
                            e.key === 'ArrowUp' ||
                            e.key === 'ArrowDown' ||
                            (e.key >= '0' && e.key <= '9')
                          ) {
                            return;
                          }
                          e.preventDefault();
                        }}
                        placeholder="Season"
                      />
                    </Box>
                    <Box>
                      <label style={{ fontSize: '0.75rem', color: COLORS.gray[400], display: 'block', marginBottom: '0.25rem' }}>Episode</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min="1"
                        max={maxEpisodesInCurrentSeason > 0 ? maxEpisodesInCurrentSeason : undefined}
                        value={(formData as Media & { currentEpisode?: number }).currentEpisode ?? 1}
                        style={inputStyle}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            setFormData(prev => ({ ...prev, currentEpisode: 1 }));
                            return;
                          }
                          const epVal = Math.max(1, Math.min(maxEpisodesInCurrentSeason || 1, parseInt(val, 10) || 1));
                          setFormData(prev => ({ ...prev, currentEpisode: epVal }));
                        }}
                        onKeyDown={(e) => {
                          // Prevent backspace from navigating back
                          if (e.key === 'Backspace' && e.currentTarget.value.length === 1) {
                            e.preventDefault();
                            setFormData(prev => ({ ...prev, currentEpisode: 1 }));
                          }
                          // Allow: backspace, delete, tab, escape, enter, arrows, and numbers
                          if (
                            e.key === 'Backspace' ||
                            e.key === 'Delete' ||
                            e.key === 'Tab' ||
                            e.key === 'Escape' ||
                            e.key === 'Enter' ||
                            e.key === 'ArrowLeft' ||
                            e.key === 'ArrowRight' ||
                            e.key === 'ArrowUp' ||
                            e.key === 'ArrowDown' ||
                            (e.key >= '0' && e.key <= '9')
                          ) {
                            return;
                          }
                          e.preventDefault();
                        }}
                        placeholder="Episode"
                      />
                    </Box>
                  </Box>
                </Box>

                {(totalNumberOfSeasons > 0 || totalNumberOfEpisodes > 0) && (
                  <Box sx={{ 
                    marginTop: '1rem',
                    padding: '1rem', 
                    background: 'rgba(168, 85, 247, 0.1)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(168, 85, 247, 0.2)'
                  }}>
                    <Box sx={{ fontSize: '0.875rem', color: '#d1d5db', textAlign: 'center' }}>
                      <Box sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.purple.solid, mb: '0.25rem' }}>
                        {totalNumberOfSeasons} / {totalNumberOfEpisodes}
                      </Box>
                      <Box>Total Seasons / Episodes</Box>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>

        {/* Poster selection */}
        {formData.images?.posters && formData.images.posters.length > 1 && (
          <Box sx={{ mt: '1.5rem', mb: '1rem' }}>
            <Typography component="label" htmlFor="posterSelect" sx={{ display: "block", fontSize: "0.875rem", fontWeight: 500, mb: '0.5rem', color: '#d1d5db' }}>
              Choose Poster
            </Typography>
            <select
              id="posterSelect"
              aria-label="Choose Poster"
              title="Choose Poster"
              value={formData.poster_path || ''}
              style={selectStyle}
              onChange={(e) => setFormData({ ...formData, poster_path: e.target.value })}
            >
              <option value="">Default</option>
              {formData.images.posters.map((p, idx) => (
                <option key={p.file_path} value={p.file_path}>Poster {idx + 1}</option>
              ))}
            </select>
          </Box>
        )}

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: "0.5rem", mt: '2rem', pt: '1.5rem', borderTop: '1px solid rgba(75, 85, 99, 0.3)' }}>
          <Button
            onClick={handleCancel}
            sx={{
              flex: 1,
              p: "0.75rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              border: "1px solid rgba(75, 85, 99, 0.5)",
              background: "rgba(31, 41, 55, 0.8)",
              color: "#fff",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              "&:hover": {
                background: "rgba(55, 65, 81, 0.8)",
              },
            }}
          >
            <X size={16} />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            sx={{
              flex: 1,
              p: "0.75rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              border: "none",
              background: "linear-gradient(to right, #a855f7, #ec4899)",
              color: "#fff",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              "&:hover": {
                background: "linear-gradient(to right, #9333ea, #db2777)",
              },
            }}
          >
            <Check size={16} />
            {editingId ? "Save Changes" : "Add to Watchlist"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default WatchlistModal;