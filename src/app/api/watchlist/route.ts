import { NextRequest, NextResponse } from "next/server";
import { getFirebaseTokenFromRequest } from "@utils/get-token"; // helper to extract token
import { adminAuth, adminDB } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const token = await getFirebaseTokenFromRequest();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const body = await req.json();
    const { movie } = body;

    if (!movie) {
      return NextResponse.json({ error: "Missing movie data" }, { status: 400 });
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...movieWithoutId } = movie;

    await adminDB.collection(`users/${decoded.uid}/movies`).add({
      movie: movieWithoutId,
      addedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error adding to watchlist:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
