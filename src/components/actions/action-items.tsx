import { Box } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
// import CheckIcon from "@mui/icons-material/Check";

import { IconButton } from "../buttons";
import { Movie } from "@/data-models/movie.interface";

interface Actions {
  movie: Movie;
  addClicked?(movie: Movie): void;
  removeClicked?(movie: Movie): void; // Assuming you have a removeClicked function
}

export const ActionItems = ({ movie, addClicked, removeClicked }: Actions) => {
  return (
    <Box className="absolute inset-x-0 top-0 z-0" style={{ background: "#1A1A1A", opacity: "80%", height: "152px" }} display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
      {addClicked !== null && addClicked !== undefined ? <IconButton label="WATCHLIST" buttonIcon={<PlaylistAddIcon />} onClick={() => addClicked(movie)} /> : null}

      {/* <IconButton label="WATCHED" buttonIcon={<CheckIcon />} onClick={() => removeClicked(movie)} /> */}

      {removeClicked !== null && removeClicked !== undefined ? <IconButton label="REMOVE" buttonIcon={<PlaylistRemoveIcon />} onClick={() => removeClicked(movie)} /> : null}
    </Box>
  );
};
