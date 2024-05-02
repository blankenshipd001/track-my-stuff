import { Movie } from "@/data-models/movie.interface";
import Image from "next/image";
import { Box, Button, Container, Grid } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CheckIcon from "@mui/icons-material/Check";
import { ThumbDownButton, ThumbUpButton } from "../buttons";

interface details {
  movie: Movie;
}

const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

export const Details = ({ movie }: details) => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Image src={`${BASE_URL}${movie?.poster_path}`} alt={movie?.title} width="230" height="300" />
        </Grid>

        <Grid xs={8} item container direction="column" spacing={2}>
          <Grid item xs={12} style={{ paddingLeft: "32px" }}>
            <Box
              style={{
                cursor: "pointer",
                color: "#FFFFFF",
                paddingBottom: "12px",
                fontWeight: "700",
                fontSize: "40px",
                lineHeight: "normal",
              }}
            >
              {movie?.title}&nbsp;
              <span style={{ fontSize: "28px", fontStyle: "normal", fontWeight: "400", lineHeight: "28px" }}>({movie?.release_date})</span>
            </Box>

            <Box
              style={{
                cursor: "pointer",
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {movie?.overview}
            </Box>

            <Grid item container spacing={3} sx={{ paddingTop: "16px", alignItems: "center" }}>
              <Grid item>
                <Box
                  style={{
                    cursor: "pointer",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
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
                </Box>
              </Grid>

              <Grid item>
                <Box
                  style={{
                    cursor: "pointer",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  <Button
                    variant="outlined"
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      border: "1px solid white",
                      borderRadius: "20px",
                    }}
                    startIcon={<PlaylistAddIcon />}
                  >
                    WATCHLIST
                  </Button>
                </Box>
              </Grid>

              <Grid item>
                  <ThumbUpButton movie={movie} />
              </Grid>

              <Grid item>
                <ThumbDownButton movie={movie} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
