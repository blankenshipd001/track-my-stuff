"use client";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { ActivityActionButton } from "./activity-action-button";
import Image from "next/image";
import { Media } from "@/data-models/media.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import { COLORS, GRADIENTS } from "@/lib/theme-constants";

const sectionSx = {
  mb: "1.25rem",
};

const headingSx = {
  m: "0 0 0.75rem 0",
  fontSize: "1.1rem",
  fontWeight: 700,
  color: COLORS.gray[100],
};

const listSx = {
  display: "grid",
  gap: "0.75rem",
};

const cardSx = {
  p: "0.9rem",
  borderRadius: "0.9rem",
  background: GRADIENTS.card,
  border: "1px solid rgba(192, 132, 252, 0.2)",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.28)",
};

const titleSx = {
  fontSize: "0.98rem",
  color: COLORS.text.primary,
  lineHeight: 1.3,
};

const providerButtonSx = {
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
};

const actionsSx = {
  mt: "0.75rem",
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "0.45rem",
};

const emptyStateSx = {
  p: "14px 12px",
  borderRadius: "12px",
  border: "1px dashed rgba(156,163,175,0.35)",
  color: COLORS.gray[300],
  background: "rgba(31, 41, 55, 0.45)",
  fontSize: "0.9rem",
};

interface Props {
  items: Media[];
  providerById: Map<string, ServiceProvider>;
  onOpenDetails: (item: Media) => void;
  onMarkWatched: (item: Media) => void;
  onDelete: (item: Media) => void;
  onProviderOverride: (item: Media) => void;
}

export function MovieQueueList({ items, providerById, onOpenDetails, onMarkWatched, onDelete, onProviderOverride }: Props) {
  if (items.length === 0) {
    return (
      <Box component="section" sx={sectionSx}>
        <Typography component="h2" sx={headingSx}>Movies To See</Typography>
        <Box sx={emptyStateSx}>No movies in your queue yet.</Box>
      </Box>
    );
  }

  return (
    <Box component="section" sx={sectionSx}>
      <Typography component="h2" sx={headingSx}>Movies To See</Typography>

      <Box sx={listSx}>
        {items.map((item) => {
          const selectedProvider = providerById.get(String(item.provider || item.selectedStreamer || ""));
          const posterPath = item.poster_path || item.backdrop_path;
          const flatrate = item.providers?.flatrate ?? [];

          return (
            <Paper component="article" key={item.id} sx={cardSx}>
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
                  <Typography component="strong" sx={titleSx}>
                    {item.title || item.name}
                  </Typography>

                  <Stack direction="row" spacing={0.75} sx={{ mt: 0.75, alignItems: "center" }}>
                    {selectedProvider?.logo_path ? (
                      <Image src={getProxyImageUrlForPath(selectedProvider.logo_path, "w45") || ""} alt={selectedProvider.provider_name} width={18} height={18} style={{ borderRadius: 4, background: "#fff", padding: 1 }} />
                    ) : null}
                    <Typography sx={{ fontSize: 12, color: COLORS.gray[300], overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedProvider?.provider_name || "Provider not set"}
                    </Typography>
                  </Stack>

                  {!selectedProvider && flatrate.length > 0 && (
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.75 }}>
                      {flatrate.slice(0, 4).map((p) => (
                        <Image key={p.provider_id} src={getProxyImageUrlForPath(p.logo_path, "w45") || ""} alt={p.provider_name} width={16} height={16} style={{ borderRadius: 3, background: "#fff", padding: 1 }} />
                      ))}
                    </Stack>
                  )}
                </Box>

                <Button
                  onClick={() => onProviderOverride(item)}
                  sx={providerButtonSx}
                >
                  Provider
                </Button>
              </Box>

              <Typography sx={{ mt: "0.4rem", color: COLORS.gray[300], fontSize: "0.88rem" }}>
                Movie in your watchlist queue
              </Typography>
             
              <Box sx={actionsSx}>
                <ActivityActionButton variant="primary" onClick={() => onOpenDetails(item)}>Details</ActivityActionButton>
                <ActivityActionButton variant="success" onClick={() => onMarkWatched(item)}>Watched</ActivityActionButton>
                <ActivityActionButton variant="danger" onClick={() => onDelete(item)}>Remove</ActivityActionButton>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
