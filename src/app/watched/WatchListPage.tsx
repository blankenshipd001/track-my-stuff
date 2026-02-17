"use client"

import { MediaGrid } from "@/components/media";
import { Media } from "@/data-models/media.interface";
import { Box, Typography } from "@mui/material";
import { User } from '@/data-models/user.interface';

interface Props {
  movies: Media[];
  tvShows: Media[];
  user?: User | null;
}

const WatchListPage = ({ movies, tvShows, user }: Props) => {

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography variant="h4" gutterBottom color="white">
        Watchlist
      </Typography>

      {movies.length > 0 && (
        <Box mb={6}>
          <Typography variant="h5" gutterBottom color="white">
            Movies
          </Typography>
          <MediaGrid movies={movies} isWatchlist={true} user={user} />
        </Box>
      )}

      {tvShows.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom color="white">
            TV Shows
          </Typography>
          <MediaGrid movies={tvShows} isWatchlist={true} user={user} />
        </Box>
      )}
    </Box>
  );
};

export default WatchListPage;
