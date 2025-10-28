import { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "./admin";
import { User } from "@/data-models/user.interface";

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
    const decodedIdToken: DecodedIdToken = await adminAuth.verifySessionCookie(token, true);

    const user: User | null = decodedIdToken
      ? {
          uid: decodedIdToken.uid,
          email: decodedIdToken.email,
          email_verified: decodedIdToken.email_verified,
          picture: decodedIdToken.picture,
          name: decodedIdToken.name,
          auth_time: decodedIdToken.auth_time,
          firebase: decodedIdToken.firebase,
        }
      : null;

    return user;
  } catch (error) {
    console.error("Invalid session cookie:", error);
    return null;
  }
}
