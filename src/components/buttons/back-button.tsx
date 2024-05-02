import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Box, Fab } from "@mui/material";

interface backButton {
  buttonClick(): void;
}

export const BackButton = ({ buttonClick }: backButton) => {
  return (
    <Box
      onClick={() => buttonClick()}
      style={{
        paddingBottom: "10px",
        cursor: "pointer",
        color: "#FFFFFF",
        fontWeight: "400",
        fontSize: "18px",
      }}
    >
      <Fab
        size="medium"
        style={{
          backgroundColor: "#782FEF",
          color: "#FFFFFF",
          marginRight: "10px",
        }}
        aria-label="add"
      >
        <ArrowBackIosIcon style={{ paddingLeft: "5px" }} />
      </Fab>
      Back
    </Box>
  );
};
