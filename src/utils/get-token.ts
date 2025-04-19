import { cookies } from "next/headers";

export const getFirebaseTokenFromRequest = async () => {
  const token = cookies().get("token")?.value;
  return token || null;
};