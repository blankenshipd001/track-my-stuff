import { verifySessionToken } from '@/lib/firebase/auth';
import getCookieHeader from '@/lib/getCookieHeader';
import { adminDB } from '@/lib/firebase/admin';
import CalendarPage from './CalendarPage';
import { fetchTVDetails, fetchTVSeasonEpisodes } from '@/services';
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

  return <CalendarPage watchList={moviesWithEpisodes} />;
}
