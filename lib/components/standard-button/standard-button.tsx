import { Button } from "@mui/material";
import React from "react";

interface StandardButton {
    label: string;
    onClickAction?(): void;
  }

export const StandardButton = ({label, onClickAction}: StandardButton) => {
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
      sx={{ fontWeight: "bold", mx: 1}}
    >
      {label}
    </Button>
  );
};

