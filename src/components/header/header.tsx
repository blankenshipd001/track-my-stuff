import HeaderClient from "./header-client";
import { getCurrentUser } from "@/lib/get-current-user";

export const Header = async () => {
  const user = await getCurrentUser();

  const navItems = [
  { label: "Search", path: "/" },
  ...(user
    ? [
        { label: "Activity", path: "/activity" },
        { label: "Watched", path: "/watched" },
      ]
    : []),
  { label: "About", path: "/about" },
];

  return <HeaderClient user={user} navItems={navItems} />;
}
