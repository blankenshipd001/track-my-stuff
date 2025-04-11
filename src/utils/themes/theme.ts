import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: '#782FEF'
        },
        text: {
            primary: '#ffffff'
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        
        // Override the default typography variant to use white text
        allVariants: {
          color: '#ffffff', // White text color
        },
    }
});