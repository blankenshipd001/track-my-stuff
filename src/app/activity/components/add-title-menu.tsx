import { ChevronDown, Edit2, Plus } from "lucide-react";
import { Box, Button } from "@mui/material";
import { COLORS, GRADIENTS } from "@/lib/theme-constants";
import type { CSSProperties } from "react";

interface AddTitleMenuProps {
  show: boolean;
  onToggle: () => void;
  onQuickAdd: () => void;
  onAddWithDetails: () => void;
}

export function AddTitleMenu({ show, onToggle, onQuickAdd, onAddWithDetails }: AddTitleMenuProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <Button
        onClick={onToggle}
        sx={{
          background: GRADIENTS.purplePink,
          p: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          border: "none",
          color: "white",
          textTransform: "none",
          "&:hover": {
            background: "linear-gradient(to right, #9333ea, #db2777)",
            transform: "translateY(-1px)",
          },
        }}
      >
        <Plus size={20} />
        Add Title
        <ChevronDown size={16} style={{ marginLeft: "0.25rem" }} />
      </Button>
      {show && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            right: 0,
            mt: "0.5rem",
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            borderRadius: "0.75rem",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
            minWidth: "200px",
            zIndex: 50,
          }}
        >
          <Button
            onClick={onQuickAdd}
            sx={{
              ...menuButtonStyle,
              borderRadius: 0,
              justifyContent: "flex-start",
              textTransform: "none",
              "&:hover": {
                background: "rgba(168, 85, 247, 0.2)",
                color: COLORS.purple.solid,
              },
            }}
          >
            <Plus size={16} />
            Quick Add
          </Button>
          <Button
            onClick={onAddWithDetails}
            sx={{
              ...menuButtonStyle,
              borderRadius: 0,
              justifyContent: "flex-start",
              textTransform: "none",
              "&:hover": {
                background: "rgba(168, 85, 247, 0.2)",
                color: COLORS.purple.solid,
              },
            }}
          >
            <Edit2 size={16} />
            Add with Details
          </Button>
        </Box>
      )}
    </Box>
  );
}

const menuButtonStyle: CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  textAlign: "left",
  background: "transparent",
  border: "none",
  color: "#e5e7eb",
  fontSize: "0.875rem",
  fontWeight: 500,
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};
