import { verifySessionToken } from '@/lib/firebase/auth';
import getCookieHeader from '@/lib/getCookieHeader';
import WatchListPage from '@/app/watched/WatchListPage';
import { adminDB } from '@/lib/firebase/admin';
import { Media } from '@/data-models/media.interface';
import { DocumentData } from 'firebase-admin/firestore';
import { User } from '@/data-models/user.interface';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'My Watchlist | ReelTime',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function WatchedPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', padding: '20px' }}>Loading watched list...</div>}>
      <WatchedContent />
    </Suspense>
  );
}

async function WatchedContent() {
  const cookieHeader = await getCookieHeader();
  const user: User | null = await verifySessionToken(cookieHeader);
  
  const snapshot = await adminDB.collection('/users/' + user?.uid + "/movies").get();
  const allMedia: DocumentData[] = snapshot.docs.map(doc => doc.data());
  
  // Filter on server side for better performance
  const movies = (allMedia as Media[]).filter((item: Media) => !!item.title);
  const tvShows = (allMedia as Media[]).filter((item: Media) => !!item.name);

  return (
    <WatchListPage movies={movies} tvShows={tvShows} user={user}/>
  );
}