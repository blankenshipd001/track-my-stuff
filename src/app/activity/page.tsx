import { verifySessionToken } from '@/lib/firebase/auth';
import getCookieHeader from '@/lib/getCookieHeader';
import { adminDB } from '@/lib/firebase/admin';
import MyWatchlist from './Activity';
import { fetchTVDetails, fetchTVSeasonEpisodes } from '@/services';
import { Media } from '@/data-models/media.interface';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'My Activity | ReelTime',
  robots: {
    index: false,
    follow: false,
  },
};

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

  // Only enrich in-progress TV items that need episode totals for progress UI.
  // Skipping completed/watchlist items avoids unnecessary external API calls on first load.
  const moviesWithEpisodes = await Promise.all(movies.map(async (item: Media) => {
    const shouldEnrichEpisodes =
      item.media_type === 'tv' &&
      Boolean(item.movieId) &&
      item.status === 'watching' &&
      !item.episodes?.length;

    if (shouldEnrichEpisodes) {
      try {
        // Fetch TV details to find the most recent season
        const tvDetails = await fetchTVDetails(item.movieId.toString());
        
        if (tvDetails?.seasons && tvDetails.seasons.length > 0) {
          // Filter out special seasons (season 0) and get the last one
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const regularSeasons = tvDetails.seasons.filter((s: any) => s.season_number > 0);
          const mostRecentSeason = regularSeasons[regularSeasons.length - 1];
          
          if (mostRecentSeason) {
            // Fetch episodes for the most recent season
            const seasonData = await fetchTVSeasonEpisodes(item.movieId, mostRecentSeason.season_number);
            if (seasonData?.episodes) {
              return { 
                ...item, 
                episodes: [{ 
                  season_number: mostRecentSeason.season_number, 
                  episodes: seasonData.episodes 
                }] 
              };
            }
          }
        }
      } catch (error) {
        console.error('Error fetching season episodes:', error);
      }
    }
    return item;
  }));

  return <MyWatchlist watchlist={moviesWithEpisodes} user={user} />;
}

