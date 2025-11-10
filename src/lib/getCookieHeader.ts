import { cookies } from 'next/headers';

// Build a cookie header string from Next's RequestCookies
export async function getCookieHeader(): Promise<string> {
  try {
    // cookies() can be a sync object or a promise depending on runtime/Next version
    // Await to support both shaped returns.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = await cookies();
    const all = typeof c.getAll === 'function' ? c.getAll() : [];
    if (!all || all.length === 0) return '';
    return all.map((cookie: any) => `${cookie.name}=${cookie.value}`).join('; ');
  } catch (e) {
    // cookies() may throw in some runtime contexts; return empty string on error
    return '';
  }
}

export default getCookieHeader;
