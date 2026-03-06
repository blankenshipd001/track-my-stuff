"use client";
import { Suspense, useEffect, useState } from "react";
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
import GoogleIcon from "@mui/icons-material/Google";
import Image from "next/image";
import Logo from "@utils/assets/logo.svg";
import { StandardButton } from "@components/buttons";
import { logoutUser } from "@/lib/clientLogout";
import { auth, googleProvider } from "@/lib/firebase/config";
import { signInWithPopup } from "firebase/auth";
import UserMenu from "./user-menu";
import { User } from "@/data-models/user.interface";

interface HeaderClientProps {
  user: User | null;
  navItems: { label: string; path: string }[];
}

const HeaderClient = ({ user, navItems }: HeaderClientProps) => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    router.prefetch?.("/activity");
  }, [router]);

  const handleNav = (path: string) => {
    setDrawerOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    await logoutUser();

    router.push("/");
    router.refresh();
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      router.push("/activity");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const response = await fetch("/api/delete-account", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Delete account error:", error);
    }
  };

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 4 },
        py: 2,
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(75, 85, 99, 0.3)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
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
            <UserMenu user={user} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />
          </Suspense>
        ) : (
          <StandardButton
            label="Sign in"
            onClickAction={handleLogin}
            startIcon={<GoogleIcon />}
          />
        )}
      </Box>

      {/* mobile nav */}
      <IconButton 
        aria-label="Open navigation menu"
        sx={{ display: { xs: "flex", md: "none" } }} 
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon sx={{ color: "white" }} />
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "rgba(17, 24, 39, 0.95)",
              backdropFilter: "blur(12px)",
              color: "white",
              width: 250,
              borderLeft: "1px solid rgba(75, 85, 99, 0.3)",
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
              onClick={async () => {
                setDrawerOpen(false);
                await handleLogin();
              }}
            >
              <ListItemText primary="Sign in" />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </Box>
  );
};
export default HeaderClient;