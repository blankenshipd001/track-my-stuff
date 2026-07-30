"use client";

import { Button } from "@mui/material";
import { COLORS, GRADIENTS } from "@/lib/theme-constants";

export type ActionVariant = "primary" | "success" | "danger" | "neutral";

interface ActivityActionButtonProps {
  variant?: ActionVariant;
  onClick: () => void;
  children: React.ReactNode;
}

const variantSx: Record<ActionVariant, object> = {
  primary: {
    background: GRADIENTS.purplePink,
    borderColor: "rgba(192,132,252,0.35)",
    "&:hover": {
      transform: "translateY(-1px)",
      filter: "brightness(1.06)",
    },
  },
  success: {
    background: "rgba(16,185,129,0.22)",
    borderColor: "rgba(52,211,153,0.45)",
    color: "#d1fae5",
    "&:hover": {
      background: "rgba(16,185,129,0.30)",
      borderColor: "rgba(52,211,153,0.6)",
      transform: "translateY(-1px)",
    },
  },
  danger: {
    background: "rgba(239,68,68,0.20)",
    borderColor: "rgba(248,113,113,0.45)",
    color: "#fee2e2",
    "&:hover": {
      background: "rgba(239,68,68,0.30)",
      borderColor: "rgba(248,113,113,0.6)",
      transform: "translateY(-1px)",
    },
  },
  neutral: {
    background: "rgba(31,41,55,0.9)",
    borderColor: "rgba(156,163,175,0.32)",
    "&:hover": {
      background: "rgba(31,41,55,1)",
      borderColor: "rgba(192,132,252,0.45)",
      transform: "translateY(-1px)",
    },
  },
};

export function ActivityActionButton({ variant = "neutral", onClick, children }: ActivityActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      sx={{
        height: "2.4rem",
        borderRadius: "0.65rem",
        border: "1px solid transparent",
        px: "0.5rem",
        fontSize: "0.8rem",
        fontWeight: 600,
        color: COLORS.gray[50],
        textTransform: "none",
        transition: "all 0.18s ease",
        ...variantSx[variant],
      }}
    >
      {children}
    </Button>
  );
}
