import { verifySessionToken } from '@/lib/firebase/auth';
import getCookieHeader from '@/lib/getCookieHeader';
import { adminDB } from '@/lib/firebase/admin';
import MyWatchlist from './Activity';
import { getMostRecentSeasonEpisodes } from '@/utils/api/serverContentApi';
import { Media } from '@/data-models/media.interface';
import { Suspense } from 'react';

export default async function ActivityPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', padding: '20px' }}>Loading activity...</div>}>
      <ActivityContent />
    </Suspense>
  );
}

async function ActivityContent() {
  const cookieHeader = await getCookieHeader();
  const user = await verifySessionToken(cookieHeader);

  const snapshot = await adminDB.collection('/users/' + user?.uid + "/movies").get();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const movies: any = snapshot.docs.map(doc => doc.data());

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

  return <MyWatchlist watchlist={moviesWithEpisodes} user={user} />;
}

