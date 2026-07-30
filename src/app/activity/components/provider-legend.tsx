import NextImage from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { COLORS } from "@/lib/theme-constants";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";

interface FavoriteProvider {
  provider_id: number;
  provider_name: string;
  logo_path?: string;
  display_priority: number;
}

interface ProviderLegendProps {
  providers: FavoriteProvider[];
  collapsed: boolean;
  onToggle: () => void;
}

export function ProviderLegend({ providers, collapsed, onToggle }: ProviderLegendProps) {
  if (providers.length === 0) {
    return null;
  }

  const sortedProviders = [...providers].sort((a, b) => a.display_priority - b.display_priority);

  return (
    <Box sx={{ width: "100%", mt: "1rem" }}>
      <ButtonBase
        onClick={onToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: "0.75rem 1rem",
          width: "100%",
          background: "rgba(31, 41, 55, 0.9)",
          borderRadius: "0.5rem",
          border: "1px solid rgba(75, 85, 99, 0.5)",
          transition: "all 0.2s",
          "&:hover": {
            background: "rgba(31, 41, 55, 1)",
            borderColor: "rgba(168, 85, 247, 0.5)",
          },
        }}
      >
        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: COLORS.gray[400] }}>
          MY STREAMING SERVICES
        </Typography>
        {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </ButtonBase>
      {!collapsed && (
        <Box
          sx={{
            mt: "0.5rem",
            p: "1rem",
            background: "rgba(31, 41, 55, 0.5)",
            borderRadius: "0.5rem",
            border: "1px solid rgba(75, 85, 99, 0.3)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {sortedProviders.map((provider) => (
              <Box
                key={provider.provider_id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {provider.logo_path ? (
                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
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
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: COLORS.purple.solid,
                    }}
                  />
                )}
                <Typography sx={{ fontSize: "0.875rem", color: "#e5e7eb" }}>{provider.provider_name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
