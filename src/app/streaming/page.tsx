import { verifySessionToken } from '@/lib/firebase/auth';
import { cookies } from 'next/headers';
// import StreamingPage from './StreamingPage';
import { adminDB } from '@/lib/firebase/admin';
import CalendarPage from './CalendarPage';
import { getMostRecentSeasonEpisodes } from '@/utils/api/serverContentApi';

export default async function WatchedPage() {
  const user = await verifySessionToken(cookies().toString());

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
    // <StreamingPage watchList={movies}/>
    <CalendarPage watchList={movies} />
  );
}
