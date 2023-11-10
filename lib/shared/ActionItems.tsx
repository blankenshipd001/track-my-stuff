/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Fab } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CheckIcon from "@mui/icons-material/Check";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

interface Actions {
    movie: any;
    bookmarkClicked(movie: any): any;
  }

const ActionItems = ({movie, bookmarkClicked}: Actions) => {

    const rate = () => {
    }
    
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
            {/* <li>
                <Fab
                    size="medium"
                    style={{
                        backgroundColor: "#FFFFFF",
                    }}
                    aria-label="add"
                    >
                    <ThumbUpIcon onClick={rate} style={{ paddingLeft: "5px" }} />
                </Fab>
                <Fab
                    size="medium"
                    aria-label="add"
                    >
                    <ThumbDownIcon onClick={rate} style={{ paddingLeft: "5px" }} />
                </Fab>
            </li> */}
        </ul>
      </div>
    );
  };
  
  export default ActionItems;
