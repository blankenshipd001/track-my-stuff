// app/components/MediaGrid.tsx
"use client";

import React, { ReactNode, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Media } from "@/data-models/media.interface";

import Image from "next/image";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { BookmarkAdd, BookmarkRemove } from "@mui/icons-material";
// NOTE: This is a client component — avoid importing server helpers directly.
// Use the API route `/api/tv/[id]` instead so TMDB calls remain server-side.
import useNotificationBar from "@/components/notifications/useNotificationBar";
import { requestRemoveFromWatchList } from "@/utils/api/contentApi";
import { ProviderLogos } from "../provider/ProviderLogos";

interface MediaGridProps {
  movies: Media[];
  addClicked?(movie: Media): Promise<void>;
  removeClicked?(movie: Media): Promise<void>;
  isWatchlist?: boolean;
  user?: { uid: string; email?: string } | null;
}

export const MediaGrid = ({ movies, addClicked, removeClicked, isWatchlist, user }: MediaGridProps): React.ReactElement => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();

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

  const handleClickEvent = (movie: Media) => {
    const isTV = movie.first_air_date !== undefined;
    const path = isTV ? `/tv/${movie.movieId}` : `/movies/${movie.movieId}`;
    router.push(path, { scroll: false });
  };

  const handleAddToWatchlist = async (movie: Media) => {
    if (addClicked) {
      if (movie.name) {
        try {
          const res = await fetch(`/api/tv/${movie.id}`);
          if (res.ok) {
            const tvShow = await res.json();
            addClicked(tvShow);
          } else {
            enqueueNotificationBar("Could not load TV details", "error");
          }
        } catch (e) {
          enqueueNotificationBar(String(e), "error");
        }
      } else {
        addClicked(movie);
      }
    } else if (removeClicked) {
      removeClicked(movie);
    }
  };

  /**
   * Remove the content from the server so
   * @param media Media
   * @returns
   */
  const handleRemove = async (movie: Media) => {
    try {
      if (!user) {
        enqueueNotificationBar("Please log in to save movies.", "info");
        return;
      }

      await requestRemoveFromWatchList(user.uid, movie);
      enqueueNotificationBar("Removed from your watch list!", "success");
      router.refresh();
    } catch (err) {
      enqueueNotificationBar(`Error: ${err}`, "error");
    }
  };

  const getBookmarkIcon = (media: Media): ReactNode => {
    if (isWatchlist) {
      return (
        <BookmarkRemove
          sx={{ cursor: "pointer", color: "lightgrey", "&:hover": { color: "#782FEF" } }}
          onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
            event.stopPropagation();
            event.preventDefault();
            handleRemove(media);
          }}
        />
      );
    } else {
      return (
        <BookmarkAdd
          sx={{ cursor: "pointer", color: "lightgrey", "&:hover": { color: "#782FEF" } }}
          onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
            event.stopPropagation();
            event.preventDefault();
            handleAddToWatchlist(media);
          }}
        />
      );
    }
  };

  const getProviders = (media: Media): ReactNode => {
    const providers = media?.providers?.flatrate;
    if (Array.isArray(providers) && providers.length > 0) {
      return <ProviderLogos list={providers} />;
    }
    return null;
  };

  return (
    <>
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
                background: "black",
              }}
            >
              <Image
                src={`${BASE_URL}${poster}?w=248&fit=crop&auto=format`}
                alt={title ?? "image"}
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
                actionIcon={getBookmarkIcon(movie)}
              />
              <Box sx={{margin: "0 0 -10px 10px"}} bgcolor="black">{getProviders(movie)}</Box>
            </ImageListItem>
          );
        })}
      </ImageList>

      {NotificationBarComponent}
    </>
  );
};

MediaGrid.displayName = "MediaGrid";
