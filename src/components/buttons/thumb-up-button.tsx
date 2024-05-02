import { Movie } from "@/data-models/movie.interface";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Fab } from "@mui/material";

interface thumbUpButton {
  movie: Movie;
}

//TODO: Come back and handle the thumb click
export const ThumbUpButton = ({ movie }: thumbUpButton) => {
  return (
    <Fab
      size="medium"
      style={{
        backgroundColor: "#FFFFFF",
      }}
      aria-label="add"
    >
      <ThumbUpIcon onClick={() => console.log("you liked this move: " + movie.title)} style={{ paddingLeft: "5px" }} />
    </Fab>
  );
};
