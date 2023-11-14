import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";

const isDev = false;
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: isDev ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_DEV : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
// TODO: do we need to export these here?
const db = getFirestore(app);
const auth = getAuth();

const signIn = () => {
  return signInWithRedirect(auth, googleProvider)
    .then(() => {})
    .catch(() => {});
};

// const redirectToSignIn = async () => {
//   try {
//     const result = await signInWithRedirect(auth, googleProvider);
//     if (result) {
//       // This is the signed-in user
//       const user = result.user;
//       // This gives you a Facebook Access Token.
//       const credential = provider.credentialFromResult(auth, result);
//       const token = credential.accessToken;
//     }
//     const operationType = result.operationType;

//     //TODO can we type this better?
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     console.error(err);
//     // TODO handle this better
//     alert(err.message);
//   }
// };

// const showSignInPopup = async () => {
//   try {
//     const res = await signInWithPopup(auth, googleProvider);
//     const user = res.user;
//     const q = query(collection(db, "users"), where("uid", "==", user.uid));
//     const docs = await getDocs(q);
//     if (docs.docs.length === 0) {
//       await addDoc(collection(db, "users"), {
//         uid: user.uid,
//         name: user.displayName,
//         authProvider: "google",
//         email: user.email,
//       });
//     }
//     //TODO can we type this better?
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     console.error(err);
//     // TODO handle this better
//     alert(err.message);
//   }
// };

const logout = () => {
  signOut(auth);
};

export { auth, db, signIn, logout };
