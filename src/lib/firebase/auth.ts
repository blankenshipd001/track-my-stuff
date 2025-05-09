import { adminAuth } from "./admin";

export async function verifySessionToken(cookie?: string) {
  if (!cookie) {
    return null;
  }

  // grab the __session token from the cookie where we store it
  const token = cookie.match(/__session=([^;]+)/)?.[1];

  if (!token) {
    return null;
  }

  try {
    return await adminAuth.verifySessionCookie(token, true);
  } catch (error) {
    console.error("Invalid session cookie:", error);
    return null;
  }
}
