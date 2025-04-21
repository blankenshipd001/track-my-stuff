// app/components/HeaderClient.tsx  (Client Component)
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer, Box, IconButton, List, ListItemButton, ListItemText, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import Logo from "@utils/assets/logo.svg";
import { StandardButton } from "@components/buttons";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface HeaderClientProps {
  user: { uid: string; email?: string } | null;
  navItems: { label: string; path: string }[];
}

const HeaderClient = ({ user, navItems }: HeaderClientProps) => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { login, logout } = useCurrentUser();

  const handleNav = (path: string) => {
    setDrawerOpen(false);
    router.push(path);
  };

  return (
    <Box component="header" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
      <Box onClick={() => handleNav("/")} sx={{ cursor: "pointer" }}>
        <Image src={Logo} alt="Logo" width={200} height={100} style={{ height: "auto" }} />
      </Box>

      {/* desktop */}
      <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
        {navItems.map((item) => (
          <StandardButton key={item.label} label={item.label} onClickAction={() => handleNav(item.path)} />
        ))}
        {user ? (
          <StandardButton label="LOG OUT" onClickAction={async () => {logout()}} />
        ) : (
          <StandardButton label="LOG IN" onClickAction={() => login()} />
        )}
      </Box>

      {/* mobile */}
      <IconButton sx={{ display: { xs: "flex", md: "none" } }} onClick={() => setDrawerOpen(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 250 }}>
          {navItems.map((item) => (
            <ListItemButton key={item.label} onClick={() => handleNav(item.path)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
          <Divider />
          {user ? (
            <ListItemButton onClick={async () => { logout(); setDrawerOpen(false); router.refresh(); }}>
              <ListItemText primary="Log Out" />
            </ListItemButton>
          ) : (
            <ListItemButton onClick={() => { login(); handleNav("/login"); }}>
              <ListItemText primary="Log In" />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </Box>
  );
}

export default HeaderClient;