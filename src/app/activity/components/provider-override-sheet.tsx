"use client";

import { Box, Button, Typography } from "@mui/material";
import { Media } from "@/data-models/media.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { COLORS } from "@/lib/theme-constants";
import Image from "next/image";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";

interface Props {
  item: Media;
  providers: ServiceProvider[];
  onClose: () => void;
  onSave: (item: Media, providerId: string) => void;
}

export function ProviderOverrideSheet({ item, providers, onClose, onSave }: Props) {
  const currentProvider = String(item.provider || item.selectedStreamer || "");

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.62)",
        zIndex: 200,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: "100%",
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
          p: "1rem",
          background: COLORS.gray[900],
          borderTop: "1px solid rgba(192, 132, 252, 0.35)",
          boxShadow: "0 -12px 36px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography component="h3" sx={{ m: "0 0 0.35rem 0", color: COLORS.gray[100], fontSize: "1rem", fontWeight: 700 }}>
          Choose Streaming Provider
        </Typography>
        <Typography sx={{ m: "0 0 0.75rem 0", color: COLORS.gray[400], fontSize: "0.86rem" }}>
          {item.title || item.name}
        </Typography>

        <Box sx={{ display: "grid", gap: "0.45rem", maxHeight: "50vh", overflowY: "auto" }}>
          {providers.map((p) => {
            const id = String(p.provider_id);
            return (
              <Button
                key={p.provider_id}
                onClick={() => onSave(item, id)}
                sx={{
                  height: "2.65rem",
                  borderRadius: "0.65rem",
                  border: `1px solid ${id === currentProvider ? COLORS.purple.solid : "rgba(156,163,175,.25)"}`,
                  background: id === currentProvider ? "rgba(168,85,247,.26)" : "rgba(31,41,55,.95)",
                  color: COLORS.gray[100],
                  fontWeight: 600,
                  textAlign: "left",
                  px: "0.75rem",
                  justifyContent: "flex-start",
                  textTransform: "none",
                  "&:hover": {
                    background: id === currentProvider ? "rgba(168,85,247,.3)" : "rgba(55,65,81,.95)",
                  },
                }}
              >
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                  {p.logo_path ? <Image src={getProxyImageUrlForPath(p.logo_path, "w45") || ""} alt={p.provider_name} width={18} height={18} style={{ borderRadius: 4, background: "#fff", padding: 1 }} /> : null}
                  {p.provider_name}
                </Box>
              </Button>
            );
          })}
        </Box>

        <Button
          onClick={onClose}
          sx={{
            mt: "0.75rem",
            width: "100%",
            height: "2.6rem",
            borderRadius: "0.65rem",
            border: "1px solid rgba(156, 163, 175, 0.3)",
            background: "transparent",
            color: COLORS.gray[300],
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              background: "rgba(55,65,81,0.4)",
            },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
