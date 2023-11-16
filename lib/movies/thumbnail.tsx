/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { forwardRef, Ref, useState } from "react";

import Image from "next/image";
// import styled from "styled-components";
import { useRouter } from "next/navigation";
import { styled } from '@mui/material';

import ActionItems from "../shared/action-items";
import { Box, Paper } from "@mui/material";

interface thumbnail {
  movie: any;
  bookmarkClicked(movie: any): any;
}

const Thumbnail = forwardRef(({ movie, bookmarkClicked }: thumbnail, ref: Ref<HTMLDivElement>): JSX.Element => {
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  const router = useRouter();
  const poster = movie.poster_path ?? movie.backdrop_path;
  const movieData = `${movie.media_type ?? ""} ${movie.release_date ?? movie.first_air_date}`;
  const [movieYear] = movieData.split("-");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const Movie = styled(Paper)(({ theme }) => ({
    alignItems: "center",
    flexDirection: "column",
    display: "flex",
    textAlign: "left",
    color: "white",
    position: "relative",
    marginTop: "10px",
  }));
  
  const Caption = styled(Paper)(({ theme }) => ({
    alignItems: "flex-start",
    width: "100%"
  }));

  const handleClickEvent = (event: any) => {
    console.log("event click");
    router.push(`/movies/${movie.movieId}`, { scroll: false });
  };

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  return (
    <Movie ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {isDropdownVisible && <ActionItems movie={movie} bookmarkClicked={bookmarkClicked} />}
      <Image
        priority={true}
        src={`${BASE_URL}${poster}`}
        alt={movie.title}
        width="200"
        height="300"
        onClick={handleClickEvent}
        className="p-2 group cursor-pointer z-20 relative
      transition duration-200 ease-in 
      transform hover:scale-105 hover:brightness-50 flex-column items-center"
      />
      <Box sx={{ alignItems: "flex-start", width: "100%" }}>
        <Box sx={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px" }}>{movie.title}</Box>
        <Box sx={{ fontWeight: "400", fontSize: "16px", lineHeight: "21.79px" }}>{movieYear}</Box>
      </Box>
    </Movie>
  );
});

Thumbnail.displayName = "Thumbnail";

export default Thumbnail;
