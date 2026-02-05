"use client";

import { useEffect, useState } from "react";
import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GetAppIcon from "@mui/icons-material/GetApp";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user has already made a decision
    const promptDismissed = localStorage.getItem("pwa-prompt-dismissed");
    const promptInstalled = localStorage.getItem("pwa-installed");
    
    if (promptDismissed === "true" || promptInstalled === "true") {
      return;
    }

    // Check if running as standalone (already installed)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) {
      localStorage.setItem("pwa-installed", "true");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      // Show prompt after a short delay to not overwhelm users immediately
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for successful installation
    window.addEventListener("appinstalled", () => {
      localStorage.setItem("pwa-installed", "true");
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      localStorage.setItem("pwa-installed", "true");
    }

    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-prompt-dismissed", "true");
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <Paper
      elevation={6}
      sx={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 9999,
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        maxWidth: 500,
        mx: "auto",
      }}
    >
      <GetAppIcon color="primary" />
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Install ReelTime
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add to your home screen for quick access
        </Typography>
      </Box>
      <Button
        variant="contained"
        size="small"
        onClick={handleInstall}
        sx={{ flexShrink: 0 }}
      >
        Install
      </Button>
      <IconButton
        size="small"
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
        sx={{ flexShrink: 0 }}
      >
        <CloseIcon />
      </IconButton>
    </Paper>
  );
}
