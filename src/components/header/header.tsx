import HeaderClient from "./header-client";
import { verifySessionToken } from "@/lib/firebase/auth";
import getCookieHeader from '@/lib/getCookieHeader';

export const Header = async () => {
  const cookieHeader = await getCookieHeader();
  const user = await verifySessionToken(cookieHeader);

  const navItems = [
    { label: "Search", path: "/" },
    ...(user
      ? [
          { label: "Watchlist", path: "/watched" },
          { label: "Streaming", path: "/streaming" },
          { label: "My Providers", path: "/providers" },
          { label: "Activity", path: "/activity" },
        ]
      : []),
    { label: "About", path: "/about" },
  ];

  return <HeaderClient user={user} navItems={navItems} />;
}
