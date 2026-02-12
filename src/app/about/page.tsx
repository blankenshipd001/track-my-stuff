"use client"
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";

const AboutPage = () => {
  const linkStyle = {
    color: "#c084fc",
    textDecoration: "none",
    marginLeft: "0.25rem",
    transition: "color 0.2s",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #111827, #1f2937, #111827)",
        py: 6,
        px: 3,
      }}
    >
      <Container maxWidth="md">
        <Typography 
          variant="h3" 
          component="h1"
          gutterBottom 
          sx={{ 
            color: "white",
            fontWeight: "bold",
            mb: 4,
            background: "linear-gradient(to right, #c084fc, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          About Us
        </Typography>
        
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="body1" sx={{ color: "#d1d5db", lineHeight: 1.8 }}>
            We&apos;re passionate TV and movie fans who wanted a better way to keep track of what&apos;s airing and when. This site was built to give you a clear, calendar-style view of your favorite shows, upcoming episodes, and where to watch them — all in one place. Whether you&apos;re tracking new releases, catching up on a series, or planning your next binge, we&apos;re here to make it easy and enjoyable. Built with care using Next.js, Firebase, and Material UI.
          </Typography>
          
          <Typography variant="body1" sx={{ color: "#d1d5db", lineHeight: 1.8 }}>
            This website is built with React and Material-UI.
          </Typography>
          
          <Typography variant="body1" sx={{ color: "#9ca3af", mt: 2 }}>
            © 2025 Copyright:
            <a 
              href="https://github.com/blankenshipd001"
              style={linkStyle}
              onMouseEnter={(e) => e.currentTarget.style.color = "#f472b6"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#c084fc"}
            >
              Code-Monkey
            </a>
          </Typography>
          
          <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.875rem" }}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
            <br />
            This product uses the Just Watch API but is not endorsed or certified by Just Watch.
          </Typography>

          <Box sx={{ mt: 2, pt: 3, borderTop: "1px solid rgba(75, 85, 99, 0.3)" }}>
            <Link 
              href="/privacy"
              style={{
                ...linkStyle,
                marginLeft: 0,
                fontSize: "0.875rem",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#f472b6"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#c084fc"}
            >
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
