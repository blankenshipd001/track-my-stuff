/* eslint-disable @typescript-eslint/strict-boolean-expressions */
"use client";

import Box from "@mui/material/Box";

import Image from "next/image";
import Thumbnail from "./thumbnail";
import FlipMove from "react-flip-move";
import styled from "styled-components";
const BASE_URL = "https://image.tmdb.org/t/p/original/"; // process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

const Providers = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 1rem;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const provider = (provider: any) => {
  return (
    <Box key={provider.provider_id} sx={{ paddingRight: "10px" }}>
      <Image
        style={{ borderRadius: "10px" }}
        src={`${BASE_URL}${provider.logo_path}`}
        alt="movie poster2"
        height={40}
        width={50}
      />
    </Box>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Results({ movies, bookmarkClicked }: any) {
  return (
    <FlipMove
      className="px-5 my-10 sm:grid 
      md:grid-cols-2 xl:grid-cols-3 
      3xl:grid-cols-4"
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {movies.map((movie: any) => {
        return (
          <div key={movie.movieId}>
            <Thumbnail
              key={movie.movieId}
              movie={movie}
              bookmarkClicked={bookmarkClicked}
            />
            <Providers>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {movie.providers?.flatrate?.map((streamer: any) => {
                return provider(streamer);
              })}
            </Providers>
          </div>
        );
      })}
    </FlipMove>
  );
}

export default Results;
