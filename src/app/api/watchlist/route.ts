import { NextRequest, NextResponse } from "next/server";
// import { adminAuth, adminDB } from "@/config/firebase-admin"; // adjust to your setup
import { adminAuth, adminDB } from "@/utils/firebase/firebaseAdmin"; // adjust to your setup
import { getFirebaseTokenFromRequest } from "@utils/get-token"; // helper to extract token

export async function POST(req: NextRequest) {
  try {
    const token = await getFirebaseTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const body = await req.json();
    const { movie } = body;

    if (!movie) {
      return NextResponse.json({ error: "Missing movie data" }, { status: 400 });
    }

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
