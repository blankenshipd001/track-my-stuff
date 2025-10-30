"use client"

import { MediaGrid } from "@/components/media";
import { Media } from "@/data-models/media.interface";
import { Box, Typography } from "@mui/material";
import { User } from '@/data-models/user.interface';

interface Props {
  watchList: Media[];
  user: User;
}

const WatchListPage = ({ watchList, user }: Props) => {
  const moviesWithTitle = watchList.filter((item: Media) => !!item.title);
  const tvShowsWithName = watchList.filter((item: Media) => !!item.name);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography variant="h4" gutterBottom color="white">
        Watchlist
      </Typography>

      {moviesWithTitle.length > 0 && (
        <Box mb={6}>
          <Typography variant="h5" gutterBottom color="white">
            Movies
          </Typography>
          <MediaGrid movies={moviesWithTitle} isWatchlist={true} user={user} />
        </Box>
      )}

      {tvShowsWithName.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom color="white">
            TV Shows
          </Typography>
          <MediaGrid movies={tvShowsWithName} isWatchlist={true} user={user} />
        </Box>
      )}
    </Box>
  );
};

export default WatchListPage;
