import React from "react";

import { Button } from "@mui/material";

interface IconButton {
  label: string;
  buttonIcon: JSX.Element;
  onClick?(): void;
}

/**
 * The basic icon button in our system that is purple, white text and rounded
 *
 * @param label the label to display in the button
 * @param buttonIcon icon component to display
 * @returns
 */
export const IconButton = ({ label, buttonIcon, onClick }: IconButton) => {
  return (
    <Button
      variant="outlined"
      sx={{ borderRadius: "100px", margin: "0 8px" }}
      startIcon={buttonIcon}
      onClick={onClick}
      style={{
        color: "white",
        width: "188px",
        fontWeight: "bold",
        border: "1px solid white",
        borderRadius: "100px",
      }}
    >
      {label}
    </Button>
  );
};
