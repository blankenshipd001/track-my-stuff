"use client";

import { memo, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Media } from "@/data-models/media.interface";
import { getMaxEpisodesInSeason } from "../activity-helpers";
import styled from "styled-components";
import { COLORS } from "@/lib/theme-constants";

const PopoverContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.5rem;
  background: ${COLORS.gray[900]};
  border: 1px solid ${COLORS.gray[700]};
  border-radius: 8px;
  padding: 1rem;
  z-index: 50;
  min-width: 200px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid ${COLORS.gray[700]};
  }
`;

const PopoverTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${COLORS.gray[300]};
  margin-bottom: 0.75rem;
  text-align: center;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Label = styled.div`
  font-size: 0.75rem;
  color: ${COLORS.gray[400]};
  width: 60px;
  font-weight: 600;
  text-transform: uppercase;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const CountDisplay = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${COLORS.gray[100]};
  min-width: 40px;
  text-align: center;
`;

const IconButton = styled.button`
  background: ${COLORS.purple[600]};
  border: none;
  color: white;
  padding: 0.375rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: ${COLORS.purple[500]};
  }

  &:active {
    background: ${COLORS.purpleDark.solid};
  }
`;

const ActionButton = styled.button`
  background: ${COLORS.purpleDark.solid};
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  transition: background 0.2s;
  margin-top: 0.75rem;

  &:hover {
    background: ${COLORS.purpleDark.solidHover};
  }

  &:active {
    background: ${COLORS.purpleDark.solid};
  }
`;

interface EpisodeQuickEditPopoverProps {
  item: Media;
  onSave: (currentSeason: number, currentEpisode: number) => void;
  onClose: () => void;
}

function EpisodeQuickEditPopoverComponent({ item, onSave, onClose }: EpisodeQuickEditPopoverProps) {
  const currentSeason = (item as Media & { currentSeason?: number }).currentSeason ?? 1;
  const currentEpisode = (item as Media & { currentEpisode?: number }).currentEpisode ?? 1;
  const totalSeasons = item.seasonCount ?? (item.seasons?.length ?? 0);
  const maxEpisodesInSeason = getMaxEpisodesInSeason(item, currentSeason);

  const handleSeasonChange = useCallback(
    (delta: number) => {
      const newSeason = Math.max(1, Math.min(totalSeasons, currentSeason + delta));
      // If moving to a different season, reset to episode 1
      if (newSeason !== currentSeason) {
        onSave(newSeason, 1);
      }
    },
    [currentSeason, totalSeasons, onSave]
  );

  const handleEpisodeChange = useCallback(
    (delta: number) => {
      const maxEpisodes = maxEpisodesInSeason || 1;
      const newEpisode = Math.max(1, Math.min(maxEpisodes, currentEpisode + delta));
      onSave(currentSeason, newEpisode);
    },
    [currentSeason, currentEpisode, maxEpisodesInSeason, onSave]
  );

  const handleNextEpisode = useCallback(() => {
    if (maxEpisodesInSeason > 0 && currentEpisode < maxEpisodesInSeason) {
      onSave(currentSeason, currentEpisode + 1);
    } else if (currentSeason < totalSeasons) {
      onSave(currentSeason + 1, 1);
    }
  }, [currentSeason, currentEpisode, maxEpisodesInSeason, totalSeasons, onSave]);

  return (
    <PopoverContainer onClick={(e) => e.stopPropagation()}>
      <PopoverTitle>Update Progress</PopoverTitle>

      <ControlRow>
        <Label>Season</Label>
        <InputGroup>
          <IconButton
            onClick={() => handleSeasonChange(-1)}
            disabled={currentSeason <= 1}
            title="Previous season"
          >
            <ChevronUp size={16} />
          </IconButton>
          <CountDisplay>S{currentSeason}</CountDisplay>
          <IconButton
            onClick={() => handleSeasonChange(1)}
            disabled={currentSeason >= totalSeasons}
            title="Next season"
          >
            <ChevronDown size={16} />
          </IconButton>
        </InputGroup>
      </ControlRow>

      <ControlRow>
        <Label>Episode</Label>
        <InputGroup>
          <IconButton
            onClick={() => handleEpisodeChange(-1)}
            disabled={currentEpisode <= 1}
            title="Previous episode"
          >
            <ChevronUp size={16} />
          </IconButton>
          <CountDisplay>
            E{currentEpisode}
            {maxEpisodesInSeason > 0 && ` / ${maxEpisodesInSeason}`}
          </CountDisplay>
          <IconButton
            onClick={() => handleEpisodeChange(1)}
            disabled={maxEpisodesInSeason > 0 && currentEpisode >= maxEpisodesInSeason}
            title="Next episode"
          >
            <ChevronDown size={16} />
          </IconButton>
        </InputGroup>
      </ControlRow>

      <ActionButton onClick={handleNextEpisode} title="Advance to next episode">
        <ChevronDown size={16} />
        Next Episode
      </ActionButton>

      <ActionButton
        onClick={() => onClose()}
        style={{
          background: COLORS.gray[700],
          marginTop: "0.5rem",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.gray[600])}
        onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.gray[700])}
        title="Close"
      >
        Done
      </ActionButton>
    </PopoverContainer>
  );
}

export const EpisodeQuickEditPopover = memo(EpisodeQuickEditPopoverComponent);
