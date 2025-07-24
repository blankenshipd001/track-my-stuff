"use client";

import { Movie } from "@/data-models/movie.interface";
import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProviderLogos from "@/components/provider/ProviderLogos";
import Recommended from "@/components/recommended/Recommended";
import AddToWatchlist from "@/components/buttons/AddToWatchlist";
import Details from "@/components/details/Details";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TvDetails({ user, movie, recommended }: { user: any, movie: Movie; recommended: Movie[] }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isLargeScreen = useMediaQuery("(min-width:1200px)");

  const handleClickEvent = (movie: Movie) => {
    router.push(`/tv/${movie.id}`, { scroll: false });
  };
  
  return (
    <Details user={user} media={movie} recommended={recommended} isTv={true} />
  );
}
