"use client";

import { CSSProperties } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Media } from "@/data-models/media.interface";
import { COLORS, GRADIENTS } from "@/lib/theme-constants";
import { ActivityActionButton } from "./activity-action-button";
import Image from "next/image";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import { ServiceProvider } from "@/data-models/service-provider.interface";

interface Props {
  items: Media[];
  providerById: Map<string, ServiceProvider>;
  onNextEpisode: (item: Media) => void;
  onMarkWatched: (item: Media) => void;
  onProviderOverride: (item: Media) => void;
  onOpenDetails: (item: Media) => void;
}

const titleStyle: CSSProperties = {
  fontSize: "0.98rem",
  color: COLORS.text.primary,
  lineHeight: 1.3,
};

export function ContinueWatchingList({ items, providerById, onNextEpisode, onMarkWatched, onProviderOverride, onOpenDetails }: Props) {
  return (
    <Box component="section" sx={{ mb: "1.25rem" }}>
      <Typography component="h2" sx={{ m: "0 0 0.75rem 0", fontSize: "1.1rem", fontWeight: 700, color: COLORS.gray[100] }}>
        Continue Watching
      </Typography>
      <Box sx={{ display: "grid", gap: "0.75rem" }}>
        {items.map((item) => {
          const selectedProvider = providerById.get(String(item.provider || item.selectedStreamer || ""));
          const posterPath = item.poster_path || item.backdrop_path;
          const flatrate = item.providers?.flatrate ?? [];

          return (
            <Paper
              key={item.id}
              component="article"
              sx={{
                p: "0.9rem",
                borderRadius: "0.9rem",
                background: GRADIENTS.card,
                border: "1px solid rgba(192, 132, 252, 0.2)",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.28)",
              }}
            >
              <Box sx={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 1.25, alignItems: "center" }}>
                <Box sx={{ width: 56, height: 84, borderRadius: 1, overflow: "hidden", background: "#1f2937", flexShrink: 0 }}>
                  {posterPath ? (
                    <Image src={getProxyImageUrlForPath(posterPath, "w185") || ""} alt={item.title || item.name || "Poster"} width={56} height={84} style={{ width: "56px", height: "84px", objectFit: "cover" }} />
                  ) : (
                    <Box sx={{ width: "56px", height: "84px", display: "grid", placeItems: "center", color: COLORS.gray[500], fontSize: 10 }}>
                      No Art
                    </Box>
                  )}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography component="strong" sx={titleStyle}>
                    {item.title || item.name}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 0.75, mt: 0.75, alignItems: "center" }}>
                    {selectedProvider?.logo_path ? <Image src={getProxyImageUrlForPath(selectedProvider.logo_path, "w45") || ""} alt={selectedProvider.provider_name} width={18} height={18} style={{ borderRadius: 4, background: "#fff", padding: 1 }} /> : null}
                    <Typography sx={{ fontSize: 12, color: COLORS.gray[300], overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedProvider?.provider_name || "Provider not set"}
                    </Typography>
                  </Box>

                  {!selectedProvider && flatrate.length > 0 && (
                    <Box sx={{ display: "flex", gap: 0.5, mt: 0.75 }}>
                      {flatrate.slice(0, 4).map((p) => (
                        <Image key={p.provider_id} src={getProxyImageUrlForPath(p.logo_path, "w45") || ""} alt={p.provider_name} width={16} height={16} style={{ borderRadius: 3, background: "#fff", padding: 1 }} />
                      ))}
                    </Box>
                  )}
                </Box>

                <Button
                  onClick={() => onProviderOverride(item)}
                  sx={{
                    height: "2rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(192, 132, 252, 0.4)",
                    background: "rgba(168, 85, 247, 0.15)",
                    color: COLORS.purple.solid,
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    px: "0.7rem",
                    minWidth: "auto",
                    textTransform: "none",
                    "&:hover": {
                      background: "rgba(168, 85, 247, 0.24)",
                    },
                  }}
                >
                  Provider
                </Button>
              </Box>
              <Typography sx={{ mt: "0.4rem", color: COLORS.gray[300], fontSize: "0.88rem" }}>
                S{item.currentSeason ?? 1} E{item.currentEpisode ?? 1}
              </Typography>
              <Box sx={{ mt: "0.75rem", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.45rem" }}>
                <ActivityActionButton variant="primary" onClick={() => onNextEpisode(item)}>Next Episode</ActivityActionButton>
                <ActivityActionButton variant="success" onClick={() => onMarkWatched(item)}>Watched</ActivityActionButton>
                <ActivityActionButton variant="neutral" onClick={() => onOpenDetails(item)}>Details</ActivityActionButton>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
