import { verifySessionToken } from '@/lib/firebase/auth';
import { cookies } from 'next/headers';
// import StreamingPage from '@/app/tv/streaming/StreamingPage';
import { adminDB } from '@/lib/firebase/admin';
import CalendarPage from './CalendarPage';

export default async function WatchedPage() {
  const user = await verifySessionToken(cookies().toString());

  const snapshot = await adminDB.collection('/users/' + user?.uid + "/movies").get();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const movies: any = snapshot.docs.map(doc => doc.data());

  return (
    // <StreamingPage watchList={movies}/>
    <CalendarPage watchList={movies} />
  );
}