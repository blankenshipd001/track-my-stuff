"use client";

import { Movie } from "@/data-models/movie.interface";
import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Recommended from "@/components/recommended/Recommended";
import AddToWatchlist from "@/components/buttons/AddToWatchlist";
import ProviderLogos from "@/components/provider/ProviderLogos";
import Details from "@/components/details/Details";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MovieDetails({ user, movie, recommended }: { user: any; movie: Movie; recommended: Movie[] }) {
  const router = useRouter();

  const handleClickEvent = (movie: Movie) => {
    router.push(`/movies/${movie.id}`, { scroll: false });
  };

  return (
    <Details user={user} media={movie} recommended={recommended} handleClickEvent={handleClickEvent} isTv={false} />

  );
}
