import HeaderClient from "./header-client";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/firebase/auth";

export const Header = async () => {
  const user = await verifySessionToken(cookies().toString());

  const navItems = [
    { label: "Search", path: "/" },
    ...(user
      ? [
          { label: "Watchlist", path: "/movies/watched" },
          { label: "Streaming", path: "/tv/streaming" },
        ]
      : []),
    { label: "About", path: "/about" },
  ];

  return <HeaderClient user={user} navItems={navItems} />;
}
