"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Box, IconButton, Drawer, List, ListItemText, Divider, ListItemButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import Logo from "@utils/assets/logo.svg";
import { StandardButton } from "@components/buttons";
import { UserAuth } from "@utils/providers/auth-provider";

const styles = {
  logo: {
    cursor: "pointer",
    maxWidth: "100%",
    height: "auto",
  },
};

export const Header = () => {
  const router = useRouter();
  const { googleSignIn, logOut, user } = UserAuth();
  const [loading, setLoading] = React.useState(true);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  /**
   * Send the user back to the homepage
   */
  const handleClickEvent = () => {
    router.push(`/`, { scroll: false });
  };

  return (
    <header className="items-center">
      {/* Logo */}

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
        <div onClick={handleClickEvent} style={styles.logo}>
          <Image src={Logo} alt="Logo" width={200} height={100} />
        </div>

        {/* Mobile navigation */}
        <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "flex-end" }}>
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Main navigation for desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "flex-end", flex: 1 }}>
          {user !== null ? <StandardButton label="Search" onClickAction={() => router.push("/")} /> : null}
          {user !== null ? <StandardButton label="Watchlist" onClickAction={() => router.push("/movies/watched")} /> : null}
          {loading ? <div>...</div> : user !== null ? <StandardButton label="LOG OUT" onClickAction={handleSignOut} /> : <StandardButton label="LOG IN" onClickAction={() => handleSignIn()} />}
        </Box>
      </Box>

      {/* Drawer for mobile */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 250 }}>
          <ListItemButton onClick={() => router.push("/")}>
            <ListItemText primary="Search" />
          </ListItemButton>
          <ListItemButton onClick={() => router.push("/movies/watched")}>
            <ListItemText primary="Watchlist" />
          </ListItemButton>

          <Divider />

          {user !== null && (
            <ListItemButton onClick={logOut}>
              <ListItemText primary="Log Out" />
            </ListItemButton>
          )}
          {!(user !== null) && (
            <ListItemButton onClick={() => handleSignOut()}>
              <ListItemText primary="Log In" />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </header>
  );
};
