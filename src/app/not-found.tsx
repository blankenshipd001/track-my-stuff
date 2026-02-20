"use client";
import React from 'react';
import { Box, Container, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COLORS, GRADIENTS, TRANSITIONS } from '@/lib/theme-constants';

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
              background: GRADIENTS.textPurplePink,
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
              color: COLORS.gray[300],
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
                background: GRADIENTS.textPurplePink,
                color: "white",
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: "600",
                "&:hover": {
                  background: GRADIENTS.purplePink,
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
                borderColor: COLORS.purple.solid,
                color: COLORS.purple.solid,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: "600",
                "&:hover": {
                  borderColor: COLORS.pink.solid,
                  color: COLORS.pink.solid,
                  background: COLORS.purple[100],
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
            <Typography variant="body2" sx={{ color: COLORS.gray[400], mb: 2 }}>
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
                  color: COLORS.purple.solid,
                  textDecoration: "none",
                  transition: TRANSITIONS.fast,
                }}
              >
                Activity
              </Link>
              <Link
                href="/streaming"
                style={{
                  color: COLORS.purple.solid,
                  textDecoration: "none",
                  transition: TRANSITIONS.fast,
                }}
              >
                Streaming
              </Link>
              <Link
                href="/watched"
                style={{
                  color: COLORS.purple.solid,
                  textDecoration: "none",
                  transition: TRANSITIONS.fast,
                }}
              >
                Watched
              </Link>
              <Link
                href="/about"
                style={{
                  color: COLORS.purple.solid,
                  textDecoration: "none",
                  transition: TRANSITIONS.fast,
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
