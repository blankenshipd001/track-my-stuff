/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CheckIcon from "@mui/icons-material/Check";

interface Actions {
  movie: any;
  bookmarkClicked(movie: any): any;
}

const ActionItems = ({ movie, bookmarkClicked }: Actions) => {
  // const rate = () => {
  // }

  return (
    <div className="absolute inset-x-2 top-2 z-50">
      <ul>
        <li>
          <Button
            variant="outlined"
            style={{
              color: "white",
              fontWeight: "bold",
              border: "1px solid white",
              borderRadius: "20px",
            }}
            startIcon={<PlaylistAddIcon />}
            onClick={() => bookmarkClicked(movie)}
          >
            WATCHLIST
          </Button>
        </li>
        <li>
          <Button
            variant="outlined"
            style={{
              color: "white",
              fontWeight: "bold",
              border: "1px solid white",
              borderRadius: "20px",
            }}
            startIcon={<CheckIcon />}
          >
            WATCHED
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default ActionItems;
