"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconButton,
  Avatar,
  Menu,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

interface UserMenuProps {
  user: { uid: string; email?: string; picture?: string } | null;
}

const UserMenu = ({ 
  user, 
  onLogout, 
  onDeleteAccount 
}: { 
  user: UserMenuProps["user"]; 
  onLogout: () => void;
  onDeleteAccount: () => Promise<void>;
}) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <IconButton 
        aria-label="Open user menu"
        onClick={(e) => setAnchorEl(e.currentTarget)} 
        sx={{ p: 0, ml: 2 }}
      >
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
        <Typography variant="body2" sx={{ mb: 2, color: "#ccc" }}>
          {user?.email}
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            color: "white",
            background: "#782FEF",
            fontWeight: "bold",
            border: "1px solid #782FEF",
            borderRadius: "100px",
            mb: 1,
            "&:hover": {
              background: "#5b22c6",
              borderColor: "#5b22c6",
            },
          }}
          onClick={() => {
            setAnchorEl(null);
            router.push("/providers");
          }}
        >
          Add Providers
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            color: "white",
            background: "#782FEF",
            fontWeight: "bold",
            border: "1px solid #782FEF",
            borderRadius: "100px",
            mb: 1,
            "&:hover": {
              background: "#5b22c6",
              borderColor: "#5b22c6",
            },
          }}
          onClick={() => {
            setAnchorEl(null);
            onLogout();
          }}
        >
          Log Out
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            color: "#ff4444",
            borderColor: "#ff4444",
            fontWeight: "bold",
            borderRadius: "100px",
            "&:hover": {
              background: "rgba(255, 68, 68, 0.1)",
              borderColor: "#ff6666",
            },
          }}
          onClick={() => {
            setAnchorEl(null);
            setDeleteDialogOpen(true);
          }}
        >
          Delete Account
        </Button>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            background: "rgba(18, 18, 18, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 68, 68, 0.3)",
          },
        }}
      >
        <DialogTitle sx={{ color: "white" }}>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#ccc" }}>
            Are you sure you want to delete your account? This action cannot be undone.
            All your watchlist data and preferences will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
            sx={{
              color: "#ccc",
              borderRadius: "100px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setIsDeleting(true);
              try {
                await onDeleteAccount();
              } finally {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
              }
            }}
            disabled={isDeleting}
            sx={{
              color: "white",
              background: "#ff4444",
              fontWeight: "bold",
              borderRadius: "100px",
              "&:hover": {
                background: "#cc0000",
              },
            }}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserMenu;