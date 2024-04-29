import { Button, Box } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CheckIcon from "@mui/icons-material/Check";
import { Movie } from "../@interfaces/movie.interface";

interface Actions {
  movie: Movie;
  addClicked?(movie: Movie): void;
  removeClicked?(movie: Movie): void; // Assuming you have a removeClicked function
}

const ActionItems = ({ movie, addClicked, removeClicked }: Actions) => {
  return (
    <Box className="absolute inset-x-0 top-0 z-0" style={{ background: "#1A1A1A", opacity: "80%", height: "152px" }} display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
      {addClicked !== null && addClicked !== undefined ? (
        <Button
          variant="outlined"
          sx={{ borderRadius: "100px", margin: "0 8px" }}
          startIcon={<PlaylistAddIcon />}
          onClick={() => addClicked(movie)}
          style={{
            color: "white",
            width: "188px",
            fontWeight: "bold",
            border: "1px solid white",
            borderRadius: "100px",
          }}
        >
          WATCHLIST
        </Button>
      ) : null}
      <Button
        variant="outlined"
        sx={{ borderRadius: "100px", margin: "0 8px" }}
        startIcon={<CheckIcon />}
        style={{
          color: "white",
          width: "188px",
          fontWeight: "bold",
          border: "1px solid white",
          borderRadius: "100px",
        }}
      >
        WATCHED
      </Button>
      {removeClicked !== null && removeClicked !== undefined ? (
        <Button
          variant="outlined"
          sx={{ borderRadius: "100px", margin: "0 8px" }}
          startIcon={<PlaylistAddIcon />}
          onClick={() => removeClicked(movie)}
          style={{
            color: "white",
            width: "188px",
            fontWeight: "bold",
            border: "1px solid white",
            borderRadius: "100px",
          }}
        >
          REMOVE
        </Button>
      ) : null}
    </Box>
  );
};

export default ActionItems;

// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { Button } from "@mui/material";
// import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
// import CheckIcon from "@mui/icons-material/Check";

// interface Actions {
//   movie: any;
//   bookmarkClicked(movie: any): any;
// }

// const ActionItems = ({ movie, bookmarkClicked }: Actions) => {

//   return (
//     <div
//     className="absolute inset-x-0 top-0 z-0"
//     style={{background: "#1A1A1A", opacity: "80%", height: "152px"}}
//     >
//       <ul>
//         <li style={{padding: "15px"}}>
//           <Button
//             variant="outlined"
//             style={{
//               color: "white",
//               width: "188px",
//               fontWeight: "bold",
//               border: "1px solid white",
//               borderRadius: "100px",
//               padding: "13px 32px 13px 32px",
//               gap: "8px"
//             }}
//             startIcon={<PlaylistAddIcon />}
//             onClick={() => bookmarkClicked(movie)}
//           >
//             WATCHLIST
//           </Button>
//         </li>
//         <li>
//           <Button
//             variant="outlined"
//             style={{
//               color: "white",
//               width: "188px",
//               fontWeight: "bold",
//               border: "1px solid white",
//               borderRadius: "100px",
//               padding: "13px 32px 13px 32px",
//               gap: "8px"
//             }}
//             startIcon={<CheckIcon />}
//           >
//             WATCHED
//           </Button>
//         </li>
//         <li>
//         <Button
//             variant="outlined"
//             style={{
//               color: "white",
//               width: "188px",
//               fontWeight: "bold",
//               border: "1px solid white",
//               borderRadius: "100px",
//               padding: "13px 32px 13px 32px",
//               gap: "8px"
//             }}
//             startIcon={<PlaylistAddIcon />}
//             onClick={() => removeClicked(movie)}
//           >
//             REMOVE
//           </Button>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default ActionItems;
