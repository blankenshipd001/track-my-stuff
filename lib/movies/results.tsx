"use client";

import Image from 'next/image';
import Thumbnail from './thumbnail';
import FlipMove from "react-flip-move";
const BASE_URL = "https://image.tmdb.org/t/p/original/"; // process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

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
        console.log("movie", movie);
        return (
          <div key={movie.imdbId}>
            <Thumbnail
              key={movie.imdbID}
              movie={movie}
              bookmarkClicked={bookmarkClicked}
            />
            <div>Buy</div>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {movie.providers?.buy?.map((streamer: any) => {
              return (
                <div key={streamer.provider_id}>
                  <Image
                    src={`${BASE_URL}${streamer.logo_path}`}
                    alt="movie poster2"
                    height={40}
                    width={50}
                  />
                </div>
              );
            })}
            <div>Rent</div>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {movie.providers?.rent?.map((streamer: any) => {
              return (
                <div key={streamer.provider_id}>
                  <Image
                    src={`${BASE_URL}${streamer.logo_path}`}
                    alt="movie poster2"
                    height={40}
                    width={50}
                  />
                </div>
              );
            })}
            <div>Stream</div>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {movie.providers?.flatrate?.map((streamer: any) => {
              return (
                <div key={streamer.provider_id}>
                  <Image
                    src={`${BASE_URL}${streamer.logo_path}`}
                    alt="movie poster2"
                    height={40}
                    width={50}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </FlipMove>
  );
}

export default Results;
