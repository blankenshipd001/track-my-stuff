"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { Media } from "@/data-models/media.interface";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
// Import styled components from MyWatchlist
import {
  Modal,
  ModalContent,
  ModalTitle,
  FormGroup,
  Label,
  Input,
  Select,
  ProgressInputs,
  ButtonGroup,
  Button,
  Stars,
  Star,
} from "./styles";

interface ProviderDetails {
  name: string;
  color: string;
}
type ProviderKey = "netflix" | "hulu" | "disney" | "hbo" | "prime" | "apple";
type Providers = Record<ProviderKey, ProviderDetails>;

interface WatchlistModalProps {
  show: boolean;
  editingId: number | null | undefined;
  formData: Media;
  providers: Providers;
  handleCancel: () => void;
  handleSave: () => void;
  setFormData: React.Dispatch<React.SetStateAction<Media>>;
}

const WatchlistModal = ({
  show,
  editingId,
  formData,
  providers,
  handleCancel,
  handleSave,
  setFormData,
}: WatchlistModalProps) => {
  if (!show) return null;

  // Derive totals for TV shows (display only)
  const totalNumberOfSeasons = formData.type === 'tv' && Array.isArray(formData.episodes) ? formData.episodes.length : 0;
  const totalNumberOfEpisodes = formData.type === 'tv' && Array.isArray(formData.episodes)
    ? formData.episodes.reduce((sum, season) => {
        const count = Array.isArray(season.episodes) ? season.episodes.length : 0;
        return sum + count;
      }, 0)
    : 0;

  return (
    <Modal onClick={handleCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{editingId ? "Edit Title" : "Add New Title"}</ModalTitle>

        {/* Read-only fields: Title, Type, Provider. Only Status, Progress, Rating are editable per requirements */}
        <FormGroup>
          <Label>Title</Label>
          <Input value={formData?.title || formData.name} readOnly aria-readonly="true" placeholder="Enter title" />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="typeSelect">Type</Label>
          <Select id="typeSelect" aria-label="Type" value={formData.type} disabled aria-disabled="true">
            <option value="movie">Movie</option>
            <option value="tv">TV Show</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="providerSelect">Streaming Provider</Label>
          <Select
            id="providerSelect"
            aria-label="Streaming Provider"
            value={formData.provider}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              provider: e.target.value,
              selectedStreamer: e.target.value,
            }))}
          >
            {Object.entries(providers).map(([key, provider]) => (
              <option key={key} value={key}>
                {provider.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="statusSelect">Status</Label>
          <Select id="statusSelect" aria-label="Choose a status" value={formData.status} onChange={(e) => setFormData(
            {
              ...formData,
              status: e.target.value as "watching" | "completed" | "watchlist"
            })}>
            <option value="watchlist">Watchlist</option>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
          </Select>
        </FormGroup>

        {formData.type === "tv" && (
          <FormGroup>
            <Label>Progress (Episodes)</Label>
            <ProgressInputs>
              <Input
                type="number"
                min="0"
                value={formData?.progress?.current ?? 0}
                onChange={(e) => {
                  const val = e.target.value;
                  const current = val === '' ? 0 : Math.max(0, parseInt(val, 10) || 0);
                  setFormData(prev => ({
                    ...prev,
                    progress: { ...(prev.progress || { current: 0, total: 0 }), current }
                  }));
                }}
                placeholder="Current"
              />
              <Input
                type="number"
                min="0"
                value={formData?.progress?.total ?? 0}
                onChange={(e) => {
                  const val = e.target.value;
                  const total = val === '' ? 0 : Math.max(0, parseInt(val, 10) || 0);
                  setFormData(prev => ({
                    ...prev,
                    progress: { ...(prev.progress || { current: 0, total: 0 }), total }
                  }));
                }}
                placeholder="Total"
              />
            </ProgressInputs>
          </FormGroup>
        )}

        {formData.type === 'tv' && (
          <FormGroup>
            <Label>Current Season</Label>
            <Input
              type="number"
              min="1"
              value={(formData as Media & { currentSeason?: number }).currentSeason ?? 1}
              onChange={(e) => {
                const seasonVal = e.target.value === '' ? 1 : Math.max(1, parseInt(e.target.value, 10) || 1);
                setFormData(prev => ({ ...prev, currentSeason: seasonVal }));
              }}
              placeholder="Season"
            />
          </FormGroup>
        )}

        {formData.type === 'tv' && (
          <FormGroup>
            <Label>Current Episode</Label>
            <Input
              type="number"
              min="1"
              value={(formData as Media & { currentEpisode?: number }).currentEpisode ?? 1}
              onChange={(e) => {
                const epVal = e.target.value === '' ? 1 : Math.max(1, parseInt(e.target.value, 10) || 1);
                setFormData(prev => ({ ...prev, currentEpisode: epVal }));
              }}
              placeholder="Episode"
            />
          </FormGroup>
        )}

        {formData.type === 'tv' && (
          <FormGroup>
            <Label>Total Seasons / Episodes</Label>
            <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
              {totalNumberOfSeasons} season{totalNumberOfSeasons === 1 ? '' : 's'} • {totalNumberOfEpisodes} episode{totalNumberOfEpisodes === 1 ? '' : 's'}
            </div>
          </FormGroup>
        )}

        <FormGroup>
          <Label>Rating</Label>
          <Stars>
            {[...Array(5)].map((_, i) => (
              <Star key={i} filled={i < formData.rating} viewBox="0 0 20 20" onClick={() => setFormData({ ...formData, rating: i + 1 })}>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </Star>
            ))}
          </Stars>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="posterSelect">Poster</Label>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {formData.poster_path && (
              // small preview image
              <img
                src={getProxyImageUrlForPath(formData.poster_path, 'w92') || ''}
                alt="Poster preview"
                style={{ width: 60, height: 'auto', borderRadius: 4, boxShadow: '0 0 0 1px rgba(255,255,255,0.1)' }}
              />
            )}
            <Select
              id="posterSelect"
              aria-label="Select poster"
              value={formData.poster_path || ''}
              onChange={(e) => setFormData({ ...formData, poster_path: e.target.value })}
            >
              <option value="">None</option>
              {formData.images?.posters?.map((p) => (
                <option key={p.file_path} value={p.file_path}>{p.file_path}</option>
              ))}
            </Select>
          </div>
        </FormGroup>

        <ButtonGroup>
          <Button variant="secondary" onClick={handleCancel}>
            <X size={16} />
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Check size={16} />
            {editingId ? "Save Changes" : "Add Title"}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default WatchlistModal;