import { verifySessionToken } from '@/lib/firebase/auth';
import getCookieHeader from '@/lib/getCookieHeader';
import { adminDB } from '@/lib/firebase/admin';
import MyWatchlist from './Activity';
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

  const snapshot = await adminDB.collection("/users/" + user?.uid + "/movies").get();
  const allMedia = snapshot.docs.map((doc) => doc.data()) as Media[];

  // Only active items in Activity
  const active = allMedia.filter((item) => item.status !== "completed");

  return <MyWatchlist watchlist={active} user={user} />;
}

