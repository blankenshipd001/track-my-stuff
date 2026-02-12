"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #111827, #1f2937, #111827)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        px: 3,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* Large 404 */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "6rem", md: "10rem" },
              fontWeight: "bold",
              background: "linear-gradient(to right, #c084fc, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
              mb: 2,
            }}
          >
            404
          </Typography>

          {/* Error message */}
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: "white",
              fontWeight: "600",
              mb: 2,
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#d1d5db",
              maxWidth: "500px",
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The content may have been moved or deleted.
          </Typography>

          {/* Action buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() => router.back()}
              sx={{
                background: "linear-gradient(to right, #c084fc, #f472b6)",
                color: "white",
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: "600",
                "&:hover": {
                  background: "linear-gradient(to right, #a855f7, #ec4899)",
                },
              }}
            >
              Go Back
            </Button>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              sx={{
                borderColor: "#c084fc",
                color: "#c084fc",
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: "600",
                "&:hover": {
                  borderColor: "#f472b6",
                  color: "#f472b6",
                  background: "rgba(192, 132, 252, 0.1)",
                },
              }}
            >
              Home Page
            </Button>
          </Box>

          {/* Helpful links */}
          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: "1px solid rgba(75, 85, 99, 0.3)",
              width: "100%",
            }}
          >
            <Typography variant="body2" sx={{ color: "#9ca3af", mb: 2 }}>
              Popular pages:
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Link
                href="/activity"
                style={{
                  color: "#c084fc",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Activity
              </Link>
              <Link
                href="/streaming"
                style={{
                  color: "#c084fc",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Streaming
              </Link>
              <Link
                href="/watched"
                style={{
                  color: "#c084fc",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Watched
              </Link>
              <Link
                href="/about"
                style={{
                  color: "#c084fc",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                About
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
