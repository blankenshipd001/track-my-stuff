import { Movie } from "@/data-models/movie.interface";
import Image from "next/image";
import { Box, Container, Grid, Typography, useMediaQuery } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CheckIcon from "@mui/icons-material/Check";
import { IconButton, ThumbDownButton, ThumbUpButton } from "../buttons";
import { darkTheme } from "@/utils/themes/theme";

interface details {
  movie: Movie;
}

const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

export const Details = ({ movie }: details) => {
  const isMobile = useMediaQuery(darkTheme.breakpoints.down("sm"));

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <Image src={`${BASE_URL}${movie?.poster_path}`} alt={movie?.title} layout="responsive" width="230" height="300" />
        </Grid>

        <Grid item xs={12} md={10} container direction="column" spacing={2}>
          <Box sx={{ 
            paddingLeft: isMobile ? 1 : 4,
            color: "#FFFFFF",
            paddingBottom: 2,
            paddingTop: isMobile ? 4 : 0,
            display: 'flex',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            alignItems: 'baseline'
          }}>
            <Typography variant={isMobile ? 'h6' : 'h4'} component="h1" sx={{ fontWeight: 700, lineHeight: 'normal', flexShrink: 0 }}>
              {movie?.title}
            </Typography>
            <Typography variant={isMobile ? 'subtitle2' : 'h6'} component="span" sx={{ fontWeight: 400, paddingLeft: 1 }}>
              ({movie?.release_date})
            </Typography>
          </Box>

          <Box sx={{ paddingLeft: isMobile ? 1 : 4, color: "#FFFFFF", paddingBottom: 2, display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {movie?.overview}
            </Typography>
          </Box>

          <Grid item container spacing={2} sx={{ paddingTop: 2, alignItems: "center" }}>
            <Grid item>
              <IconButton label="WATCHED" buttonIcon={<CheckIcon />} />
            </Grid>
            <Grid item>
              <IconButton label="WATCHLIST" buttonIcon={<PlaylistAddIcon />} />
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
    </Container>
  );
};
