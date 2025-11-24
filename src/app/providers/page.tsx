import { verifySessionToken } from '@/lib/firebase/auth';
import getCookieHeader from '@/lib/getCookieHeader';
import Preferences from './Preferences';

export default async function PreferencesPage() {
  const cookieHeader = await getCookieHeader();
  const user = await verifySessionToken(cookieHeader);

  return (
    <Preferences user={user} />
  );
}