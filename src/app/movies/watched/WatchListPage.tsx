"use client"
import { MovieGrid } from "@/components/movies";
import { Movie } from "@/data-models/movie.interface";
import useNotificationBar from "@/hooks/useNotificationBar";
import { requestRemoveFromWatchList } from "@/utils/api/contentApi";
import { useRouter } from "next/navigation";

interface Props {
  user?: { uid: string; email?: string } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watchList: any;
}

const WatchListPage = ({ user, watchList }: Props) => {
  const router = useRouter();
  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();

  const handleRemove = async (movie: Movie) => {
    try {
      if (!user) {
        enqueueNotificationBar("Please log in to save movies.", "info");
        return;
      }

      requestRemoveFromWatchList(user.uid, movie);
      enqueueNotificationBar("Removed from your watch list!", "success");
      router.refresh();
    } catch (err) {
      enqueueNotificationBar(`Error: ${err}`, "error");
    }
  };

  return (
    <div>
      <h1>Watched Movies</h1>
      <MovieGrid movies={watchList} removeClicked={handleRemove} />
      {NotificationBarComponent}
    </div>
  );
};

export default WatchListPage;
