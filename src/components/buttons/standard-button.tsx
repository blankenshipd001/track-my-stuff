// components/buttons/StandardButton.tsx

import React from "react";
import { Button } from "@mui/material";

interface StandardButtonProps {
  label: string;
  onClickAction?: () => void;
}

/**
 * A styled button that is purple, bold, white text, rounded and responsive to hover/focus.
 */
export const StandardButton = ({ label, onClickAction }: StandardButtonProps) => {
  return (
    <Button
      variant="outlined"
      onClick={onClickAction}
      sx={{
        color: "white",
        backgroundColor: "#782FEF",
        fontWeight: "bold",
        borderRadius: "100px",
        border: "1px solid #782FEF",
        textTransform: "none",
        px: 3,
        py: 1,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "#5b22c6",
          borderColor: "#5b22c6",
        },
        "&:active": {
          transform: "scale(0.98)",
        },
        "&:focus": {
          outline: "2px solid #9c6bff",
          outlineOffset: "2px",
        },
      }}
    >
      {label}
    </Button>
  );
};