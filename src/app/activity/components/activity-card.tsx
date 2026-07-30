import { memo, useCallback, useState } from "react";
import { Film, Tv, Edit2, Trash2, Info, ChevronRight } from "lucide-react";
import { Box, Button, Typography } from "@mui/material";
import { Media } from "@/data-models/media.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import { COLORS } from "@/lib/theme-constants";
import { calculateTvProgress, getTotalEpisodes, isTvMedia } from "../activity-helpers";
import { ActivityCardBack } from "./activity-card-back";
import { ActivityProviderBadge } from "./activity-provider-badge";
import { EpisodeQuickEditPopover } from "./episode-quick-edit-popover";

interface ActivityCardProps {
  item: Media;
  isFlipped: boolean;
  statusLabel: string;
  providerById: Map<string, ServiceProvider>;
  onFlip: (id: number | undefined) => void;
  onEdit: (item: Media) => void;
  onDelete: (item: Media) => void;
  onNavigateToDetails: (item: Media) => void;
  onUpdateEpisode: (item: Media, currentSeason: number, currentEpisode: number) => Promise<void>;
  onUpdateRating: (item: Media, rating: number) => Promise<void>;
}

function ActivityCardComponent({
  item,
  isFlipped,
  statusLabel,
  providerById,
  onFlip,
  onEdit,
  onDelete,
  onNavigateToDetails,
  onUpdateEpisode,
  onUpdateRating,
}: ActivityCardProps) {
  const [showEpisodePopover, setShowEpisodePopover] = useState(false);
  const currentSeason = (item as Media & { currentSeason?: number }).currentSeason;
  const currentEpisode = (item as Media & { currentEpisode?: number }).currentEpisode;
  const totalEpisodes = getTotalEpisodes(item);
  const isTv = isTvMedia(item);
  const displayType = isTv ? "TV Show" : "Movie";

  const handleEpisodeSave = useCallback(
    async (newSeason: number, newEpisode: number) => {
      await onUpdateEpisode(item, newSeason, newEpisode);
      setShowEpisodePopover(false);
    },
    [item, onUpdateEpisode]
  );

  const handleRatingClick = useCallback(
    (rating: number) => {
      onUpdateRating(item, rating);
    },
    [item, onUpdateRating]
  );

  return (
    <Box
      sx={{
        background: "rgba(31, 41, 55, 0.3)",
        backdropFilter: "blur(12px)",
        borderRadius: "0.75rem",
        overflow: "hidden",
        border: "1px solid rgba(75, 85, 99, 0.5)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        perspective: "1000px",
        height: "20rem",
        "&:hover": {
          borderColor: "rgba(168, 85, 247, 0.6)",
          boxShadow: "0 12px 24px rgba(168, 85, 247, 0.2), 0 8px 12px rgba(0, 0, 0, 0.3)",
          transform: "translateY(-4px) scale(1.02)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.6s",
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <Box sx={{ position: "relative", height: "20rem" }}>
            <img src={getProxyImageUrlForPath(item.poster_path || item.backdrop_path, "w185")!} alt={item.title || item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #111827, rgba(17, 24, 39, 0.4), transparent)" }} />

            <Box sx={{ position: "absolute", top: "0.75rem", left: "50%", transform: "translateX(-30%)", display: "flex", gap: "0.5rem", opacity: 1 }}>
              <Button
                onClick={() => onFlip(item.id)}
                title="More Details"
                sx={{
                  minWidth: 0,
                  background: "rgba(17, 24, 39, 0.9)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(75, 85, 99, 0.5)",
                  borderRadius: "0.5rem",
                  p: "0.5rem",
                  color: "white",
                  "&:hover": {
                    background: "rgba(31, 41, 55, 0.9)",
                    borderColor: "#a855f7",
                  },
                }}
              >
                <Info size={14} />
              </Button>
              <Button
                onClick={() => onEdit(item)}
                sx={{
                  minWidth: 0,
                  background: "rgba(17, 24, 39, 0.9)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(75, 85, 99, 0.5)",
                  borderRadius: "0.5rem",
                  p: "0.5rem",
                  color: "white",
                  "&:hover": {
                    background: "rgba(31, 41, 55, 0.9)",
                    borderColor: "#a855f7",
                  },
                }}
              >
                <Edit2 size={14} />
              </Button>
              <Button
                onClick={() => onDelete(item)}
                sx={{
                  minWidth: 0,
                  background: "rgba(17, 24, 39, 0.9)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(75, 85, 99, 0.5)",
                  borderRadius: "0.5rem",
                  p: "0.5rem",
                  color: "white",
                  "&:hover": {
                    background: "rgba(31, 41, 55, 0.9)",
                    borderColor: "#a855f7",
                  },
                }}
              >
                <Trash2 size={14} />
              </Button>
              {isTv && item.status === "watching" && (
                <Button
                  onClick={() => setShowEpisodePopover(true)}
                  title="Update episode progress"
                  sx={{
                    minWidth: 0,
                    position: "relative",
                    background: "rgba(17, 24, 39, 0.9)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(75, 85, 99, 0.5)",
                    borderRadius: "0.5rem",
                    p: "0.5rem",
                    color: "white",
                    "&:hover": {
                      background: "rgba(31, 41, 55, 0.9)",
                      borderColor: "#a855f7",
                    },
                  }}
                >
                  <ChevronRight size={14} />
                  {showEpisodePopover && (
                    <EpisodeQuickEditPopover
                      item={item}
                      onSave={handleEpisodeSave}
                      onClose={() => setShowEpisodePopover(false)}
                    />
                  )}
                </Button>
              )}
            </Box>

            <ActivityProviderBadge providerId={item.provider} providerById={providerById} />

            <Box sx={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: "rgba(17, 24, 39, 0.8)", backdropFilter: "blur(12px)", p: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
              {isTv ? <Tv size={12} /> : <Film size={12} />}
              {displayType}
            </Box>

            <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.title || item.name}
              </Typography>

              {isTv && totalEpisodes > 0 && (
                <Box sx={{ position: "relative" }}>
                  <Typography
                    onClick={() => setShowEpisodePopover(true)}
                    sx={{ cursor: "pointer", fontSize: "0.8rem", color: COLORS.gray[200], mb: "0.25rem" }}
                    title="Click to update progress"
                  >
                    S{currentSeason ?? 1} E{currentEpisode ?? 1} • {totalEpisodes} total episodes
                  </Typography>
                  <Box sx={{ width: "100%", height: "0.35rem", borderRadius: "999px", background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
                    <Box sx={{ width: `${calculateTvProgress(item)}%`, height: "100%", background: "linear-gradient(to right, #a855f7, #ec4899)" }} />
                  </Box>
                  {showEpisodePopover && (
                    <EpisodeQuickEditPopover
                      item={item}
                      onSave={handleEpisodeSave}
                      onClose={() => setShowEpisodePopover(false)}
                    />
                  )}
                </Box>
              )}

              {isTv && totalEpisodes === 0 && currentSeason && currentEpisode && (
                <Box>
                  <Typography sx={{ fontSize: "0.8rem", color: COLORS.gray[200] }}>
                    Season {currentSeason}, Episode {currentEpisode}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "0.4rem" }}>
                <Box sx={{ display: "flex", gap: "0.15rem" }}>
                  {[...Array(5)].map((_, i) => (
                    <Button
                      key={i} 
                      onClick={() => handleRatingClick(i + 1)}
                      sx={{ minWidth: 0, p: 0, color: i < item.rating ? "#fbbf24" : "rgba(255,255,255,0.45)" }}
                    >
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </Button>
                  ))}
                </Box>
                <Box
                  sx={{
                    p: "0.2rem 0.6rem",
                    borderRadius: "999px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#fff",
                    background:
                      item.status === "watching"
                        ? "rgba(59, 130, 246, 0.65)"
                        : item.status === "completed"
                        ? "rgba(16, 185, 129, 0.65)"
                        : "rgba(107, 114, 128, 0.65)",
                  }}
                >
                  {statusLabel}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <ActivityCardBack item={item} onFlip={onFlip} onNavigateToDetails={onNavigateToDetails} />
      </Box>
    </Box>
  );
}

export const ActivityCard = memo(ActivityCardComponent);
