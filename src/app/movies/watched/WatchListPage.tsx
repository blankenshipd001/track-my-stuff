"use client"
import { MovieGrid } from "@/components/movies";
import { Media } from "@/data-models/media.interface";
import useNotificationBar from "@/components/notifications/useNotificationBar";
import { requestRemoveFromWatchList } from "@/utils/api/contentApi";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";

interface Props {
  user?: { uid: string; email?: string } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watchList: any;
}

const WatchListPage = ({ user, watchList }: Props) => {
  const router = useRouter();
  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();

  const handleRemove = async (movie: Media) => {
    try {
      if (!user) {
        enqueueNotificationBar("Please log in to save movies.", "info");
        return;
      }

      await requestRemoveFromWatchList(user.uid, movie);
      enqueueNotificationBar("Removed from your watch list!", "success");
      router.refresh();

    } catch (err) {
      enqueueNotificationBar(`Error: ${err}`, "error");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const moviesWithTitle = watchList.filter((item: any) => !!item.title);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tvShowsWithName = watchList.filter((item: any) => !!item.name);

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
          <MovieGrid movies={moviesWithTitle} removeClicked={handleRemove} />
        </Box>
      )}

      {tvShowsWithName.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom color="white">
            TV Shows
          </Typography>
          <MovieGrid movies={tvShowsWithName} removeClicked={handleRemove} />
        </Box>
      )}

      {NotificationBarComponent}
    </Box>
  );
};

export default WatchListPage;
