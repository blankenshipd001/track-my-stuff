"use client";

import { useState } from "react";
import { Box, Button } from "@mui/material";
import { Plus, Sparkles, ListPlus } from "lucide-react";
import { COLORS, GRADIENTS, SHADOWS } from "@/lib/theme-constants";

interface Props {
  onAddWatching: () => void;
  onAddWatchlist: () => void;
}

export function QuickAddFab({ onAddWatching, onAddWatchlist }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ position: "fixed", right: "1rem", bottom: "1.2rem", zIndex: 120 }}>
      {open && (
        <Box sx={{ mb: "0.55rem", display: "grid", gap: "0.45rem" }}>
          <Button
            onClick={() => {
              setOpen(false);
              onAddWatching();
            }}
            sx={{
              minWidth: "10.5rem",
              height: "2.45rem",
              borderRadius: "999px",
              border: "1px solid rgba(192, 132, 252, 0.4)",
              background: "rgba(17, 24, 39, 0.95)",
              color: COLORS.gray[100],
              fontSize: "0.84rem",
              fontWeight: 700,
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
              "&:hover": {
                background: "rgba(31, 41, 55, 0.95)",
              },
            }}
          >
            <Sparkles size={16} />
            Add To Watching
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              onAddWatchlist();
            }}
            sx={{
              minWidth: "10.5rem",
              height: "2.45rem",
              borderRadius: "999px",
              border: "1px solid rgba(192, 132, 252, 0.4)",
              background: "rgba(17, 24, 39, 0.95)",
              color: COLORS.gray[100],
              fontSize: "0.84rem",
              fontWeight: 700,
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
              "&:hover": {
                background: "rgba(31, 41, 55, 0.95)",
              },
            }}
          >
            <ListPlus size={16} />
            Add To Watchlist
          </Button>
        </Box>
      )}

      <Button
        onClick={() => setOpen((v) => !v)}
        aria-label="Add title"
        sx={{
          minWidth: 0,
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "999px",
          border: 0,
          background: GRADIENTS.purplePink,
          color: "#fff",
          boxShadow: SHADOWS.buttonHover,
          "&:hover": {
            filter: "brightness(1.05)",
            background: GRADIENTS.purplePink,
          },
        }}
      >
        <Plus size={22} />
      </Button>
    </Box>
  );
}