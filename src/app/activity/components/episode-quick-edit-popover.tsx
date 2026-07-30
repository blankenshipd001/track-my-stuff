"use client";

import { memo, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Box, Button, Typography } from "@mui/material";
import { Media } from "@/data-models/media.interface";
import { getMaxEpisodesInSeason } from "../activity-helpers";
import { COLORS } from "@/lib/theme-constants";

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
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{
        position: "absolute",
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        mb: "0.5rem",
        background: COLORS.gray[900],
        border: `1px solid ${COLORS.gray[700]}`,
        borderRadius: "8px",
        p: "1rem",
        zIndex: 50,
        minWidth: 200,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
        "&::after": {
          content: '""',
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: `6px solid ${COLORS.gray[700]}`,
        },
      }}
    >
      <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: COLORS.gray[300], mb: "0.75rem", textAlign: "center" }}>
        Update Progress
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", mb: "0.75rem" }}>
        <Typography sx={{ fontSize: "0.75rem", color: COLORS.gray[400], width: 60, fontWeight: 600, textTransform: "uppercase" }}>
          Season
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
          <Button
            onClick={() => handleSeasonChange(-1)}
            disabled={currentSeason <= 1}
            title="Previous season"
            sx={{
              minWidth: 0,
              p: "0.375rem",
              borderRadius: "4px",
              background: COLORS.purple[600],
              color: "#fff",
              "&:hover": { background: COLORS.purple[500] },
              "&:active": { background: COLORS.purpleDark.solid },
            }}
          >
            <ChevronUp size={16} />
          </Button>
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: COLORS.gray[100], minWidth: 40, textAlign: "center" }}>
            S{currentSeason}
          </Typography>
          <Button
            onClick={() => handleSeasonChange(1)}
            disabled={currentSeason >= totalSeasons}
            title="Next season"
            sx={{
              minWidth: 0,
              p: "0.375rem",
              borderRadius: "4px",
              background: COLORS.purple[600],
              color: "#fff",
              "&:hover": { background: COLORS.purple[500] },
              "&:active": { background: COLORS.purpleDark.solid },
            }}
          >
            <ChevronDown size={16} />
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Typography sx={{ fontSize: "0.75rem", color: COLORS.gray[400], width: 60, fontWeight: 600, textTransform: "uppercase" }}>
          Episode
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
          <Button
            onClick={() => handleEpisodeChange(-1)}
            disabled={currentEpisode <= 1}
            title="Previous episode"
            sx={{
              minWidth: 0,
              p: "0.375rem",
              borderRadius: "4px",
              background: COLORS.purple[600],
              color: "#fff",
              "&:hover": { background: COLORS.purple[500] },
              "&:active": { background: COLORS.purpleDark.solid },
            }}
          >
            <ChevronUp size={16} />
          </Button>
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: COLORS.gray[100], minWidth: 40, textAlign: "center" }}>
            E{currentEpisode}
            {maxEpisodesInSeason > 0 && ` / ${maxEpisodesInSeason}`}
          </Typography>
          <Button
            onClick={() => handleEpisodeChange(1)}
            disabled={maxEpisodesInSeason > 0 && currentEpisode >= maxEpisodesInSeason}
            title="Next episode"
            sx={{
              minWidth: 0,
              p: "0.375rem",
              borderRadius: "4px",
              background: COLORS.purple[600],
              color: "#fff",
              "&:hover": { background: COLORS.purple[500] },
              "&:active": { background: COLORS.purpleDark.solid },
            }}
          >
            <ChevronDown size={16} />
          </Button>
        </Box>
      </Box>

      <Button
        onClick={handleNextEpisode}
        title="Advance to next episode"
        sx={{
          mt: "0.75rem",
          width: "100%",
          background: COLORS.purpleDark.solid,
          border: "none",
          color: "#fff",
          p: "0.5rem 1rem",
          borderRadius: "6px",
          fontSize: "0.875rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          textTransform: "none",
          "&:hover": { background: COLORS.purpleDark.solidHover },
          "&:active": { background: COLORS.purpleDark.solid },
        }}
      >
        <ChevronDown size={16} />
        Next Episode
      </Button>

      <Button
        onClick={() => onClose()}
        title="Close"
        sx={{
          mt: "0.5rem",
          width: "100%",
          background: COLORS.gray[700],
          border: "none",
          color: "#fff",
          p: "0.5rem 1rem",
          borderRadius: "6px",
          fontSize: "0.875rem",
          fontWeight: 600,
          textTransform: "none",
          "&:hover": { background: COLORS.gray[600] },
        }}
      >
        Done
      </Button>
    </Box>
  );
}

export const EpisodeQuickEditPopover = memo(EpisodeQuickEditPopoverComponent);
