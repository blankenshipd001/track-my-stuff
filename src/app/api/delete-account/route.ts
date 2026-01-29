import { NextResponse } from "next/server";
import { getFirebaseTokenFromRequest } from "@utils/get-token";
import { adminAuth, adminDB } from "@/lib/firebase/admin";

export async function DELETE() {
  try {
    const token = await getFirebaseTokenFromRequest();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // Delete all user data from Firestore
    // Delete movies collection
    const moviesSnapshot = await adminDB.collection(`users/${uid}/movies`).get();
    const movieDeletePromises = moviesSnapshot.docs.map((doc) => doc.ref.delete());

    // Delete providers collection
    const providersSnapshot = await adminDB.collection(`users/${uid}/providers`).get();
    const providerDeletePromises = providersSnapshot.docs.map((doc) => doc.ref.delete());

    // Wait for all Firestore deletions
    await Promise.all([...movieDeletePromises, ...providerDeletePromises]);

    // Delete user document if it exists
    const userDocRef = adminDB.doc(`users/${uid}`);
    const userDoc = await userDocRef.get();
    if (userDoc.exists) {
      await userDocRef.delete();
    }

    // Delete user from Firebase Auth
    await adminAuth.deleteUser(uid);

    // Clear the session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("__session", "", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error("Error deleting account:", err);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
