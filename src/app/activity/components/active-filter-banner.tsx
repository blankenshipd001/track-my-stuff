import { Film, Tv, X } from "lucide-react";
import { Box, Button, Typography } from "@mui/material";
import { COLORS } from "@/lib/theme-constants";
import { ActivityFilter, toLabel } from "../activity-helpers";

interface ActiveFilterBannerProps {
  filter: ActivityFilter;
  count: number;
  onClear: () => void;
}

export function ActiveFilterBanner({ filter, count, onClear }: ActiveFilterBannerProps) {
  if (filter === "all") {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: "0.75rem 1rem",
        background: "rgba(168, 85, 247, 0.15)",
        border: "1px solid rgba(168, 85, 247, 0.3)",
        borderRadius: "0.5rem",
        mb: "1.5rem",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            p: "0.25rem 0.75rem",
            background: "rgba(168, 85, 247, 0.3)",
            borderRadius: "0.375rem",
            border: "1px solid rgba(168, 85, 247, 0.4)",
          }}
        >
          {filter === "movies" && <Film size={16} color={COLORS.purple.solid} />}
          {filter === "tv" && <Tv size={16} color={COLORS.purple.solid} />}
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: COLORS.purple.solid }}>{toLabel(filter)}</Typography>
        </Box>
        <Typography sx={{ fontSize: "0.875rem", color: "#d1d5db" }}>
          Showing <Box component="strong" sx={{ color: COLORS.purple.solid }}>{count}</Box> {count === 1 ? "item" : "items"}
        </Typography>
      </Box>
      <Button
        onClick={onClear}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          p: "0.375rem 0.625rem",
          background: "transparent",
          border: "1px solid rgba(168, 85, 247, 0.4)",
          borderRadius: "0.375rem",
          color: COLORS.purple.solid,
          fontSize: "0.8125rem",
          fontWeight: 500,
          minWidth: "auto",
          textTransform: "none",
          "&:hover": {
            background: "rgba(168, 85, 247, 0.2)",
          },
        }}
      >
        <X size={14} />
        Clear Filter
      </Button>
    </Box>
  );
}
