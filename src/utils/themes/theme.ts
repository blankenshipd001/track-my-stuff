import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark", // Use dark mode
    primary: {
      main: "#782FEF", // Purple primary color
    },
    secondary: {
      main: "#5b22c6", // Secondary dark color
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Darker paper background for cards, menus, etc.
    },
    text: {
      primary: "#ffffff", // White text on dark background
      secondary: "#ccc", // Light grey for secondary text
    },
  },
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          borderRadius: "50px",
          textTransform: "none", // Prevent uppercasing of button text
        },
      },
    },
    MuiAvatar: {
      defaultProps: {
        sx: {
          bgcolor: "#5b22c6", // Default color for the Avatar
        },
      },
    },
  },
});
