import { verifySessionToken } from '@/lib/firebase/auth';
import getCookieHeader from '@/lib/getCookieHeader';
import { adminDB } from '@/lib/firebase/admin';
import CalendarPage from './CalendarPage';
import { getMostRecentSeasonEpisodes } from '@/utils/api/serverContentApi';
import { Media } from '@/data-models/media.interface';
import { Suspense } from 'react';

export default async function StreamingPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', padding: '20px' }}>Loading streaming calendar...</div>}>
      <StreamingContent />
    </Suspense>
  );
}

async function StreamingContent() {
  const cookieHeader = await getCookieHeader();
  const user = await verifySessionToken(cookieHeader);

  const snapshot = await adminDB.collection('/users/' + user?.uid + "/movies").get();
  const movies: Media[] = snapshot.docs.map(doc => doc.data() as Media);

  // For TV shows, fetch and attach the most recent season's episodes in parallel
  const moviesWithEpisodes = await Promise.all(movies.map(async (item: Media) => {
    if (item.media_type === 'tv' && item.movieId) {
      const recentSeason = await getMostRecentSeasonEpisodes(item.movieId);
      if (recentSeason) {
        return { ...item, episodes: [recentSeason] };
      }
    }
    return item;
  }));

  return <CalendarPage watchList={moviesWithEpisodes} />;
}
