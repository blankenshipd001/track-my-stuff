"use client"

import { forwardRef, Ref } from "react";
import Image from 'next/image';
import { HandThumbUpIcon } from "@heroicons/react/24/outline";

const Thumbnail = forwardRef(({ movie, bookmarkClicked }, ref: Ref<HTMLDivElement>) => {
  const BASE_URL = "https://image.tmdb.org/t/p/original/"; // process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  return (
    <div
      ref={ref}
      className="p-2 group cursor-pointer
      transition duration-200 ease-in 
      transform sm:hover:scale-105 hover:z-50"
    >
      <svg
        onClick={() => bookmarkClicked(movie)}
        data-v-32656d44=""
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="bookmark"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        className="absolute h-8 w-8 opacity-30 hover:opacity-70 z-10"
      >
        <path
          data-v-32656d44=""
          fill="currentColor"
          d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"
        ></path>
      </svg>
      <Image
        src={
          `${BASE_URL}${movie.backdrop_path || movie.poster_path}` ||
          `${BASE_URL}${movie.poster_path}`
        }
        alt="movie poster2"
        height={400}
        width={500}
      />
      <div className="p-2">
        <p className="truncate max-w-md">{movie.overview}</p>
        <h2 className="mt-1 text-2xl text-white transition-all duration-100 ease-in-out group-hover:font-bold">
          {movie.title}
        </h2>
        <p className="flex items-center opacity-0 group-hover:opacity-100">
          {movie.media_type && `${movie.media_type} .`}{" "}
          {movie.release_date || movie.first_air_date} .{" "}
          <HandThumbUpIcon className="h-5 mx-2" />
          {movie.vote_count}
        </p>
      </div>
    </div>
  );
});

Thumbnail.displayName = "Thumbnail";

export default Thumbnail;
