import { verifySessionToken } from '@/lib/firebase/auth';
import { cookies } from 'next/headers';
import WatchListPage from '@/app/watched/WatchListPage';
import { adminDB } from '@/lib/firebase/admin';
import { Media } from '@/data-models/media.interface';
import { DocumentData } from 'firebase-admin/firestore';
import { User } from '@/data-models/user.interface';

export default async function WatchedPage() {
  const user: User | null = await verifySessionToken(cookies().toString());
  
  const snapshot = await adminDB.collection('/users/' + user?.uid + "/movies").get();
  const movies: DocumentData[] = snapshot.docs.map(doc => doc.data());

  return (
    <WatchListPage watchList={movies as Media[]} user={user}/>
  );
}