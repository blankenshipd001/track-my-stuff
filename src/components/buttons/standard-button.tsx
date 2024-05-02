import React from "react";

import { Button } from "@mui/material";

interface StandardButton {
  label: string;
  onClickAction?(): void;
}

/**
 * The basic button in our system that is purple, white text and rounded
 * 
 * @param label the label to display in the button
 * @param onClickAction what do we do when a user clicks the button?
 * @returns 
 */
export const StandardButton = ({ label, onClickAction }: StandardButton) => {
  return (
    <Button
      variant="outlined"
      style={{
        color: "white",
        background: "#782FEF",
        // width: "188px",
        fontWeight: "bold",
        border: "1px solid #782FEF",
        borderRadius: "100px",
      }}
      onClick={onClickAction}
      sx={{ fontWeight: "bold", mx: 1 }}
    >
      {label}
    </Button>
  );
};
