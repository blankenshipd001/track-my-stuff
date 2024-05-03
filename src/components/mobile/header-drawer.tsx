import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Divider, Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { UserAuth } from "@utils/providers/auth-provider";

interface headerDrawer {
  drawerOpen: boolean;
}

export const HeaderDrawer = ({ drawerOpen }: headerDrawer) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>();
  const { googleSignIn, logOut, user } = UserAuth();

  useEffect(() => {
    console.log('drawer: ', drawerOpen)
    setIsOpen(drawerOpen);
  }, [isOpen]);

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

  return (
    <Drawer anchor="right" open={isOpen} >
      <List sx={{ width: 250 }}>
        <ListItemButton onClick={() => router.push("/")}>
          <ListItemText primary="Search" />
        </ListItemButton>
        <ListItemButton onClick={() => router.push("/movies/watched")}>
          <ListItemText primary="Watchlist" />
        </ListItemButton>

        <Divider />

        {user !== null && (
          <ListItemButton onClick={() => handleSignOut()}>
            <ListItemText primary="Log Out" />
          </ListItemButton>
        )}
        {!(user !== null) && (
          <ListItemButton onClick={() => handleSignIn()}>
            <ListItemText primary="Log In" />
          </ListItemButton>
        )}
      </List>
    </Drawer>
  );
};
