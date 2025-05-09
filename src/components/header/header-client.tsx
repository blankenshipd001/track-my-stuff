"use client";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import Logo from "@utils/assets/logo.svg";
import { StandardButton } from "@components/buttons";
import { logoutUser } from "@/lib/clientLogout";
import UserMenu from "./user-menu";

interface HeaderClientProps {
  user: { uid: string; email?: string; picture?: string } | null;
  navItems: { label: string; path: string }[];
}

const HeaderClient = ({ user, navItems }: HeaderClientProps) => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (path: string) => {
    setDrawerOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    await logoutUser();
    router.refresh();
  };

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
        py: 2,
        backgroundColor: "#121212",
        borderBottom: "1px solid #333",
      }}
    >
      <Box onClick={() => handleNav("/")} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
        <Image src={Logo} alt="Logo" width={160} height={80} style={{ height: "auto" }} />
      </Box>

      {/* desktop nav */}
      <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
        {navItems.map((item) => (
          <StandardButton key={item.label} label={item.label} onClickAction={() => handleNav(item.path)} />
        ))}
        {user ? (
          <Suspense fallback={<Box sx={{ width: 36, height: 36 }} />}>
            <UserMenu user={user} onLogout={handleLogout} />
          </Suspense>
        ) : (
          <StandardButton label="LOG IN" onClickAction={() => router.push("/login")} />
        )}
      </Box>

      {/* mobile nav */}
      <IconButton sx={{ display: { xs: "flex", md: "none" } }} onClick={() => setDrawerOpen(true)}>
        <MenuIcon sx={{ color: "white" }} />
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#121212",
              color: "white",
              width: 250,
            },
          },
        }}
      >
        <List sx={{ width: 250 }}>
          {navItems.map((item) => (
            <ListItemButton key={item.label} onClick={() => handleNav(item.path)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
          <Divider sx={{ borderColor: "#333" }} />
          {user ? (
            <ListItemButton
              onClick={async () => {
                setDrawerOpen(false);
                await logoutUser();
                router.refresh();
              }}
            >
              <ListItemText primary="Log Out" />
            </ListItemButton>
          ) : (
            <ListItemButton
              onClick={() => {
                router.push("/login");
                setDrawerOpen(false);
                router.refresh();
              }}
            >
              <ListItemText primary="Log In" />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </Box>
  );
};
export default HeaderClient;