import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { Fab } from "@mui/material";
import { Movie } from "@/data-models/movie.interface";

interface thumbDownButton {
  movie: Movie;
}

//TODO: Come back and handle the thumb click
export const ThumbDownButton = ({ movie }: thumbDownButton) => {
  return (
    <Fab
      size="medium"
      style={{
        backgroundColor: "#FFFFFF",
      }}
      aria-label="add"
    >
      <ThumbDownIcon onClick={() => console.log("you didn't this move: " + movie.title)} style={{ paddingLeft: "5px" }} />
    </Fab>
  );
};
