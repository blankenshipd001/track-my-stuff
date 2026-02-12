"use client";

import { Box } from "@mui/material";

/**
 * Contains any items relevant for a footer. 
 *  To include copyright, images and links
 *
 * @returns Footer
 */
export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 3,
        px: 2,
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(75, 85, 99, 0.3)",
        textAlign: "center",
        color: "#9ca3af",
        fontSize: "0.875rem",
      }}
    >
      <div style={{ marginBottom: "0.5rem" }}>
        © 2025 Copyright:
        <a 
          href="https://github.com/blankenshipd001"
          style={{ 
            color: "#c084fc", 
            textDecoration: "none",
            marginLeft: "0.25rem",
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#f472b6"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#c084fc"}
        >
          Code-Monkey
        </a>
      </div>
      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
        <br />
        This product uses the Just Watch API but is not endorsed or certified by Just Watch.
      </div>
    </Box>
  );
};
