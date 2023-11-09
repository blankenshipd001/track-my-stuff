/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { forwardRef, Ref } from "react";
import Image from 'next/image';
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { useRouter } from 'next/navigation'

interface thumbnail {
  movie: any;
  bookmarkClicked(movie: any): any;
}

const Thumbnail = forwardRef(({ movie, bookmarkClicked }: thumbnail, ref: Ref<HTMLDivElement>): JSX.Element => {
  const BASE_URL = "https://image.tmdb.org/t/p/original/"; // process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  const router = useRouter()
  const poster = movie.poster_path ?? movie.backdrop_path;
  const movieData = `${movie.media_type ?? ''} ${movie.release_date ?? movie.first_air_date}`

  const Movie = styled.div`
    align-items: center;
    flex-direction: column;
    display: flex;
    text-align: center;
  `
  const Caption = styled.div`
  align-items: center;
`

  const handleClickEvent = (event: any) => {
    console.log('event click');
    router.push(`/movies/${movie.id}`, { scroll: false })
    // <Link href={`/blog/${post.slug}`}>{post.title}</Link>
  }
  return (
    <Movie
      ref={ref}
      className="p-2 group cursor-pointer
      transition duration-200 ease-in 
      transform sm:hover:scale-105 hover:z-50 flex-column items-center"
      onClick={handleClickEvent}
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
          `${BASE_URL}${poster}`
        }
        alt={movie.name}
        width="350"
        height="450"
      />
      <Caption>
        <p className="truncate max-w-md">{movie.overview}</p>
        <h2 className="mt-1 text-2xl text-white transition-all duration-100 ease-in-out group-hover:font-bold">
          {movie.title}
        </h2>
        <p className="flex items-center opacity-0 group-hover:opacity-100">
          {movieData}
          <HandThumbUpIcon className="h-5 mx-2" />
          {movie.vote_count}
        </p>
      </Caption>
    </Movie>
  );
});

Thumbnail.displayName = "Thumbnail";

export default Thumbnail;
