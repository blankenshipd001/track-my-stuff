"use client";

import React from "react";
// import { User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import { useEffect, useState } from "react";
import { Box, IconButton, Drawer, List, ListItemText, Divider, ListItemButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { StandardButton } from "../components/standard-button";
import Logo from "../assets/logo.svg";

import { UserAuth } from "@/app/context/auth-provider";
// TODO Is this needed?
// import { Libre_Barcode_EAN13_Text } from "next/font/google";

const Header = () => {
  const router = useRouter();
  const { googleSignIn, logOut, user } = UserAuth();
  const [loading, setLoading] = React.useState(true);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  // const [user, setUser] = useState<FirebaseUser | null>(null);
 
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

  // const logOut = () => {
  //   auth
  //     .signOut()
  //     .then(() => {
  //       setUser(null);
  //     })
  //     .catch();
  // };

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(function (user) {
  //     setLoading(false); // Set loading to false once the authentication state is checked
  //     if (user) {
  //       setUser(user);
  //     } else {
  //       console.log("no one");
  //       setUser(null);
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [user, setUser]);

  return (
    <header className="items-center">
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
        <Image onClick={handleClickEvent} src={Logo} alt="Logo" className="h-12 w-32 mr-2 mt-1 cursor-pointer" width={400} height={200} />

        {/* Mobile navigation */}
        <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "flex-end" }}>
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Main navigation for desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "flex-end", flex: 1 }}>
          {user !== null ? <StandardButton label="Search" onClickAction={() => router.push("/")} /> : null}
          {user !== null ? <StandardButton label="Watchlist" onClickAction={() => router.push("/movies")} /> : null}
          {loading ? <div>...</div> : user !== null ? <StandardButton label="LOG OUT" onClickAction={handleSignOut} /> : <StandardButton label="LOG IN" onClickAction={() => handleSignIn()} />}
        </Box>
      </Box>

      {/* Drawer for mobile */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 250 }}>
          <ListItemButton onClick={() => router.push("/")}>
            <ListItemText primary="Search" />
          </ListItemButton>
          <ListItemButton onClick={() => router.push("/movies")}>
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

export default Header;
