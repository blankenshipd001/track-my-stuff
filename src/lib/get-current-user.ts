import { cache } from 'react';
import { verifySessionToken } from '@/lib/firebase/auth';
import getCookieHeader from '@/lib/getCookieHeader';
import { getContentServerSide } from '@/utils/api/serverContentApi';
import { User } from '@/data-models/user.interface';
import { Media } from '@/data-models/media.interface';

/**
 * Get the current authenticated user
 * This is cached per request, so multiple calls on the same request only execute once
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const cookieHeader = await getCookieHeader();
    const user = await verifySessionToken(cookieHeader);
    return user;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
});

/**
 * Get the current user's watchlist
 * This is cached per request, so multiple calls on the same request only execute once
 */
export const getCurrentUserWatchlist = cache(
  async (): Promise<Media[]> => {
    try {
      const user = await getCurrentUser();
      if (!user) return [];
      return await getContentServerSide(user.uid);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }
  }
);
