import { Movie } from "@/data-models/movie.interface";
import Image from "next/image";
import {
  Box,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton as MuiIconButton,
  Tooltip,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CheckIcon from "@mui/icons-material/Check";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

interface DetailsProps {
  movie: Movie;
}

const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

export const Details = ({ movie }: DetailsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container>
      <Grid container spacing={4}>
        {/* Poster */}
        <Grid size={{xs: 12, md: 2}}>
          <Box
            sx={{
              width: "100%",
              height: 0,
              paddingTop: "130%", // maintains aspect ratio
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <Image
              src={`${BASE_URL}${movie?.poster_path}`}
              alt={movie?.title ?? 'image'}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 230px"
            />
          </Box>
        </Grid>

        {/* Details */}
        <Grid size={{xs: 12, md: 10}}>
          <Box
            sx={{
              pl: isMobile ? 1 : 4,
              color: theme.palette.common.white,
              pb: 2,
              pt: isMobile ? 4 : 0,
              display: "flex",
              flexWrap: isMobile ? "wrap" : "nowrap",
              alignItems: "baseline",
              borderRadius: 6,
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h4"}
              component="h1"
              sx={{ fontWeight: 700, lineHeight: "normal", flexShrink: 0 }}
            >
              {movie?.title}
            </Typography>
            <Typography
              variant={isMobile ? "subtitle2" : "h6"}
              component="span"
              sx={{ fontWeight: 400, pl: 1 }}
            >
              ({movie?.release_date})
            </Typography>
          </Box>

          <Box
            sx={{
              pl: isMobile ? 1 : 4,
              color: theme.palette.common.white,
              pb: 2,
            }}
          >
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {movie?.overview}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              pl: isMobile ? 1 : 4,
              pt: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <ActionButton label="Watched" icon={<CheckIcon />} />
            <ActionButton label="Watchlist" icon={<PlaylistAddIcon />} />
            <ActionButton
              label="Thumbs Up"
              icon={<ThumbUpIcon />}
              onClick={() => console.log("Liked:", movie.title)}
            />
            <ActionButton
              label="Thumbs Down"
              icon={<ThumbDownIcon />}
              onClick={() => console.log("Disliked:", movie.title)}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

interface ActionButtonProps {
  label: string;
  icon: React.ReactElement;
  onClick?: () => void;
}

const ActionButton = ({ label, icon, onClick }: ActionButtonProps) => (
  <Tooltip title={label}>
    <MuiIconButton
      onClick={onClick}
      sx={{
        color: "#fff",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: 2,
        padding: 1,
        transition: "0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      {icon}
    </MuiIconButton>
  </Tooltip>
);
