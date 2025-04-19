import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

export const verifyIdToken = async (token: string) => {
    try {
      return await admin.auth().verifyIdToken(token);
    } catch (err) {
      console.error("no token", err);
      return null;
    }
  };
  
export const adminAuth = admin.auth();
export const adminDB = admin.firestore();