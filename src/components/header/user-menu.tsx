"use client";
import { useState } from "react";
import {
  IconButton,
  Avatar,
  Menu,
  Button,
  Typography,
} from "@mui/material";

interface UserMenuProps {
  user: { uid: string; email?: string; picture?: string } | null;
}

const UserMenu = ({ user, onLogout }: { user: UserMenuProps["user"]; onLogout: () => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0, ml: 2 }}>
        <Avatar
          alt={user?.email || "User"}
          src={user?.picture}
          sx={{ width: 36, height: 36, border: "2px solid #782FEF" }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 2,
              background: "rgba(18, 18, 18, 0.9)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              backdropFilter: "blur(10px)",
              p: 2,
              borderRadius: 2,
            },
          },
        }}
      >
        <Typography variant="body2" sx={{ mb: 1, color: "#ccc" }}>
          {user?.email}
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          style={{
            color: "white",
            background: "#782FEF",
            fontWeight: "bold",
            border: "1px solid #782FEF",
            borderRadius: "100px",
          }}
          onClick={() => {
            setAnchorEl(null);
            onLogout();
          }}
        >
          Log Out
        </Button>
      </Menu>
    </>
  );
};

export default UserMenu;