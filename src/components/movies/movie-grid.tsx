import React from "react";
import { useRouter } from "next/navigation";
import { Movie } from "@/data-models/movie.interface";

import Image from "next/image";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { BookmarkAdd } from "@mui/icons-material";

interface MovieGridProps {
  movies: Movie[];
  addClicked?(movie: Movie): Promise<void>;
  removeClicked?(movie: Movie): Promise<void>;
}

export const MovieGrid = ({ movies, addClicked, removeClicked }: MovieGridProps): JSX.Element => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  const handleClickEvent = (movie: Movie) => {
    console.log("Clicked on movie: ", movie);
    if (movie.first_air_date !== undefined) {
      router.push(`/tv/${movie.movieId}`, { scroll: false });
    } else {
      router.push(`/movies/${movie.movieId}`, { scroll: false });
    }
  };

  const handleAddToWatchlist = (movie: Movie) => {
    if (addClicked !== undefined) {
      addClicked(movie);
    } else if (removeClicked !== undefined) {
      removeClicked(movie);
    }
  };

  return (
    <ImageList cols={3} sx={{ width: "100%", height: "100%" }} gap={18}>
      {movies.map((movie) => {
        const poster = movie.poster_path ?? movie.backdrop_path;
        return (
          <div key={movie.id ?? movie.movieId}>
            <ImageListItem
              sx={{
                border: "2px solid rgba(255, 255, 255, 0.6)", // White outline
                borderRadius: 4, // Optional: Rounds the corners slightly
                overflow: "hidden", // Ensures no overflow beyond border
              }}
            >
              <ImageListItemBar
                sx={{
                  padding: "2px 8px 2px 8px", // Adds padding inside the bar
                  background: "rgba(0, 0, 0, 0.6)", // Darkens the background slightly
                  borderRadius: "0 0 8px 8px", // Rounds bottom edges
                  cursor: "pointer", // Makes icon clickable
                  display: "flex", // Uses flexbox to align items
                  justifyContent: "space-between", // Positions title and icon on opposite sides
                  alignItems: "center", // Aligns items vertically
                  "&:hover": { color: "lightgray" }, // Subtle color change on hover
                }}
                position="below"
                title={movie.title ?? movie.original_title ?? movie.original_name}
                actionIcon={
                  <BookmarkAdd
                    sx={{
                      cursor: "pointer", // Makes icon clickable
                      marginLeft: "auto", // Pushes the icon to the right
                      "&:hover": { color: "lightgray" }, // Subtle color change on hover
                    }}
                    onClick={(event) => {
                      console.log("Clicked on icon");
                      event.stopPropagation();
                      event.preventDefault();
                      handleAddToWatchlist(movie);
                    }}
                  />
                }
              />
              <Image
                onClick={(event) => {
                  console.log("Clicked on image");
                  event.stopPropagation();
                  event.preventDefault();
                  handleClickEvent(movie);
                }}
                src={`${BASE_URL}${poster}?w=248&fit=crop&auto=format`}
                alt={movie.title ?? movie.original_name}
                loading="lazy"
                width={355}
                height={200}
                style={{
                  width: "100%",
                  height: "auto",
                  cursor: "pointer", // Makes image clickable
                  transition: "transform 0.2s ease-in-out", // Smooth hover effect
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")} // Slight zoom on hover
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on mouse leave
              />
            </ImageListItem>
          </div>
        );
      })}
    </ImageList>
  );
};

MovieGrid.displayName = "MovieGrid";
