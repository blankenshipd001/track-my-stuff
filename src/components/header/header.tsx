// app/components/Header.tsx  (Server Component — no "use client")
import HeaderClient from "./header-client";
import { cookies } from "next/headers";
import { verifyIdToken } from "@/utils/firebase/firebaseAdmin";
// import { getWatchlistCount } from "@/utils/api/contentApi"; // e.g. a server‑only helper

export const Header = async () => {
  const token = cookies().get("token")?.value;
  let user = null;
  // let watchCount = 0;

  if (token) {
    const decoded = await verifyIdToken(token);
    if (decoded) {
      user = { uid: decoded.uid, email: decoded.email };
      // Fetch data server-side
      // watchCount = await getWatchlistCount(decoded.uid);
    }
  }

  // If you have static menus, you could define them here too:
  const navItems = [
    { label: "Search", path: "/" },
    ...(user
      ? [
          { label: "Watchlist", path: "/movies/watched" },
          { label: "Streaming", path: "/movies/streaming" },
        ]
      : []),
    { label: "About", path: "/about" },
  ];

  return <HeaderClient user={user} navItems={navItems} />;
}
