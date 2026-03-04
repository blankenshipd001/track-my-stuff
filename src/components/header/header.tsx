import HeaderClient from "./header-client";
import { getCurrentUser } from "@/lib/get-current-user";

export const Header = async () => {
  const user = await getCurrentUser();

  const navItems = [
    { label: "Search", path: "/" },
    ...(user
      ? [
          { label: "Watchlist", path: "/watched" },
          // { label: "Streaming", path: "/streaming" },
          { label: "Activity", path: "/activity" },
        ]
      : []),
    { label: "About", path: "/about" },
  ];

  return <HeaderClient user={user} navItems={navItems} />;
}
