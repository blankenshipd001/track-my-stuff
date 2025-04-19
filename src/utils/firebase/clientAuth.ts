import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    // Send to API route to set cookie
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    return result.user;
  } catch (err) {
    console.error("Login error", err);
    throw err;
  }
};