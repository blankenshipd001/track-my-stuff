import { cookies } from "next/headers";

export const getFirebaseTokenFromRequest = async () => {
  // cookies() may return a promise depending on Next version/runtime
  // await it to get a ReadonlyRequestCookies instance with get()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = await cookies();
  const token = typeof c.get === "function" ? c.get("token")?.value : undefined;
  return token || null;
};