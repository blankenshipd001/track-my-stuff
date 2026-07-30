import { memo } from "react";
import NextImage from "next/image";
import { Box, Typography } from "@mui/material";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { COLORS } from "@/lib/theme-constants";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import { FALLBACK_PROVIDER_META } from "../activity-helpers";

interface ActivityProviderBadgeProps {
  providerId?: string;
  providerById: Map<string, ServiceProvider>;
}

function ActivityProviderBadgeComponent({ providerId, providerById }: ActivityProviderBadgeProps) {
  if (!providerId) {
    return null;
  }

  const provider = providerById.get(String(providerId));

  if (!provider) {
    const providerMeta = FALLBACK_PROVIDER_META[providerId];
    if (!providerMeta) {
      return null;
    }

    return (
      <Box sx={{ position: "absolute", top: "0.75rem", right: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
        <Typography
          sx={{
            p: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.25px",
            background: providerMeta.color,
            color: "#F9FAFB",
            boxShadow: "0 2px 4px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(4px)",
            textShadow: "0 1px 2px rgba(0,0,0,0.4)",
          }}
        >
          {providerMeta.name}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "absolute", top: "0.75rem", right: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
      {provider.logo_path ? (
        <Box
          sx={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <NextImage
            src={getProxyImageUrlForPath(provider.logo_path, "w45")!}
            alt={provider.provider_name}
            width={24}
            height={24}
            style={{ objectFit: "contain" }}
          />
        </Box>
      ) : (
        <Typography
          sx={{
            p: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.25px",
            background: COLORS.purple.solid,
            color: "#F9FAFB",
            boxShadow: "0 2px 4px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(4px)",
          }}
        >
          {provider.provider_name}
        </Typography>
      )}
    </Box>
  );
}

export const ActivityProviderBadge = memo(ActivityProviderBadgeComponent);
