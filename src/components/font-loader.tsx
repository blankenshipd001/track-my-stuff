"use client";

import { useEffect } from "react";

export function FontLoader() {
  useEffect(() => {
    // Async load Material Icons to avoid blocking render
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    document.head.appendChild(link);
  }, []);

  return null;
}
