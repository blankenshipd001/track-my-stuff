import { verifySessionToken } from '@/lib/firebase/auth';
import { cookies } from 'next/headers';
import WatchListPage from '@/app/watched/WatchListPage';
import { adminDB } from '@/lib/firebase/admin';

export default async function WatchedPage() {
  const user = await verifySessionToken(cookies().toString());

  const snapshot = await adminDB.collection('/users/' + user?.uid + "/movies").get();
  const movies = snapshot.docs.map(doc => doc.data());

  return (
    <WatchListPage user={user} watchList={movies}/>
  );
}