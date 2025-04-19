import { cookies } from "next/headers";
import { adminAuth } from "@/utils/firebase/firebaseAdmin"; // adjust to your setup

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ user: null }), {
      status: 401,
    });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);

    return new Response(JSON.stringify({ user: decodedToken }), {
      status: 200,
    });
  } catch (error) {
    console.error("Invalid session token", error);
    return new Response(JSON.stringify({ user: null }), {
      status: 401,
    });
  }
}