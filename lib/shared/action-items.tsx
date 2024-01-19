/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CheckIcon from "@mui/icons-material/Check";

interface Actions {
  movie: any;
  bookmarkClicked(movie: any): any;
}

const ActionItems = ({ movie, bookmarkClicked }: Actions) => {

  return (
    <div 
    className="absolute inset-x-0 top-0 z-0" 
    style={{background: "#1A1A1A", opacity: "80%", height: "152px"}}
    >
      <ul>
        <li style={{padding: "15px"}}>
          <Button
            variant="outlined"
            style={{
              color: "white",
              width: "188px",
              fontWeight: "bold",
              border: "1px solid white",
              borderRadius: "100px",
              padding: "13px 32px 13px 32px",
              gap: "8px"
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
              width: "188px",
              fontWeight: "bold",
              border: "1px solid white",
              borderRadius: "100px",
              padding: "13px 32px 13px 32px",
              gap: "8px"
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
