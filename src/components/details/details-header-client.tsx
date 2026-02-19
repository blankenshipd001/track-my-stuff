"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      startIcon={<ArrowBack />}
      onClick={() => router.back()}
      variant="outlined"
      color="primary"
      sx={{
        width: { xs: "100%", sm: "auto" },
      }}
    >
      Back
    </Button>
  );
}
