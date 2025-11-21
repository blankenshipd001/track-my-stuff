import { verifySessionToken } from '@/lib/firebase/auth';
import getCookieHeader from '@/lib/getCookieHeader';
// import StreamingPage from './StreamingPage';
import { adminDB } from '@/lib/firebase/admin';
import MyWatchlist from './MyWatchlist';
import { getMostRecentSeasonEpisodes } from '@/utils/api/serverContentApi';

export default async function WatchedPage() {
  const cookieHeader = await getCookieHeader();
  const user = await verifySessionToken(cookieHeader);

  const snapshot = await adminDB.collection('/users/' + user?.uid + "/movies").get();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let movies: any = snapshot.docs.map(doc => doc.data());

  // For TV shows, fetch and attach the most recent season's episodes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  movies = await Promise.all(movies.map(async (item: any) => {
    if (item.media_type === 'tv' && item.movieId) {
      const recentSeason = await getMostRecentSeasonEpisodes(item.movieId);
      if (recentSeason) {
        return { ...item, episodes: [recentSeason] };
      }
    }
    return item;
  }));

  return (
    <MyWatchlist watchlist={movies} user={user} />
  );
}

