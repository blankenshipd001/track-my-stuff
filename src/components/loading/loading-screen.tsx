import React from "react";
import { CircularProgress, Container, Typography, Box } from "@mui/material";

export const LoadingScreen: React.FC = () => {
  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Typography variant="h4" gutterBottom>
          Loading...
        </Typography>
        <CircularProgress color="primary" size={60} />
      </Box>
    </Container>
  );
};
