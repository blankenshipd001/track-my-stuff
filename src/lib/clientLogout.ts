"use client";

import { signOut } from "firebase/auth";
import { auth } from "./firebase/client"; // your Firebase client instance

export async function logoutUser() {
  try {
    await signOut(auth);

    document.cookie = "__session=; Max-Age=0 path=/;";
  } catch (err) {
    console.error("Error during logout:", err);
  }
}