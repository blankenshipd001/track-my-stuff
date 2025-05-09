import { signOut } from "firebase/auth";
import { auth } from "./firebase/client"; // your Firebase client instance

export async function logoutUser() {
  try {
    await signOut(auth);
    await fetch('/api/logout', { method: 'POST' });
  } catch (err) {
    console.error("Error during logout:", err);
  }
}