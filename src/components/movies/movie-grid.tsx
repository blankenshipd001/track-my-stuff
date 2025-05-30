// app/components/MovieGrid.tsx
"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Movie } from "@/data-models/movie.interface";

import Image from "next/image";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { BookmarkAdd } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { getTVDetails } from "@/utils/api/serverContentApi";

interface MovieGridProps {
  movies: Movie[];
  addClicked?(movie: Movie): Promise<void>;
  removeClicked?(movie: Movie): Promise<void>;
}

export const MovieGrid = ({ movies, addClicked, removeClicked }: MovieGridProps): JSX.Element => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const cols = useMemo(() => {
    if (isXs) return 1;
    if (isSm) return 2;
    if (isMd) return 3;
    return 4;
  }, [isXs, isSm, isMd]);

  const handleClickEvent = (movie: Movie) => {
    const isTV = movie.first_air_date !== undefined;
    const path = isTV ? `/tv/${movie.movieId}` : `/movies/${movie.movieId}`;
    router.push(path, { scroll: false });
  };

  const handleAddToWatchlist = async (movie: Movie) => {
    if (addClicked) {
      if (movie.name) {
        const tvShow = await getTVDetails(`${movie.id}`);
        if (tvShow) {
          addClicked(tvShow);
        }
      } else {
        addClicked(movie);
      }      
    } else if (removeClicked) {
      removeClicked(movie);
    }
  };

  return (
    <ImageList cols={cols} sx={{ width: "100%", height: "100%" }} gap={16}>
      {movies.map((movie) => {
        const poster = movie.poster_path ?? movie.backdrop_path;
        const title = movie.title ?? movie.original_title ?? movie.original_name;

        return (
          <ImageListItem
            key={movie.id ?? movie.movieId}
            sx={{
              border: "2px solid rgba(255, 255, 255, 0.6)",
              borderRadius: 4,
              overflow: "hidden",
              width: "100%",
            }}
          >
            <Image
              src={`${BASE_URL}${poster}?w=248&fit=crop&auto=format`}
              alt={title}
              loading="lazy"
              width={355}
              height={200}
              style={{
                width: "100%",
                height: "auto",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
              }}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                handleClickEvent(movie);
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />

            <ImageListItemBar
              sx={{
                padding: "2px 8px",
                background: "rgba(0, 0, 0, 0.6)",
                borderRadius: "0 0 8px 8px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.9rem",
                  md: "1rem",
                },
              }}
              position="below"
              title={title}
              // TODO: Add this back but we will have to re-fetch the tv show because it's not adding
              actionIcon={
                <BookmarkAdd
                  sx={{ cursor: "pointer", "&:hover": { color: "lightgray" } }}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    handleAddToWatchlist(movie);
                  }}
                />
              }
            />
          </ImageListItem>
        );
      })}
    </ImageList>
  );
};

MovieGrid.displayName = "MovieGrid";