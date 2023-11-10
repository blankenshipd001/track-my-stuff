/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { forwardRef, Ref, useState } from "react";
import Image from 'next/image';
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { useRouter } from 'next/navigation'
import ActionItems from "../shared/ActionItems";
 
interface thumbnail {
  movie: any;
  bookmarkClicked(movie: any): any;
}

const Thumbnail = forwardRef(({ movie, bookmarkClicked }: thumbnail, ref: Ref<HTMLDivElement>): JSX.Element => {
  const BASE_URL = "https://image.tmdb.org/t/p/original/"; // process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  const router = useRouter()
  const poster = movie.poster_path ?? movie.backdrop_path;
  const movieData = `${movie.media_type ?? ''} ${movie.release_date ?? movie.first_air_date}`
  const [movieYear] = movieData.split('-')
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  
  const Movie = styled.div`
    align-items: center;
    flex-direction: column;
    display: flex;
    text-align: left;
    color: white;
    position: relative;
    z-index: 10;

  `
  const Caption = styled.div`
    align-items: flex-start;
    width: 100%;
`

  const handleClickEvent = (event: any) => {
    console.log('event click');
    router.push(`/movies/${movie.movieId}`, { scroll: false })
    // <Link href={`/blog/${post.slug}`}>{post.title}</Link>
  }

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  return (
    <Movie
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      { isDropdownVisible && <ActionItems movie={movie} bookmarkClicked={bookmarkClicked} /> }
      {/* <div
        onClick={() => bookmarkClicked(movie)}
        className="absolute h-8 w-8 opacity-30 hover:opacity-70 z-10"
      >
        Hello
      </div> */}
      <Image
        src={
          `${BASE_URL}${poster}`
        }
        alt={movie.name}
        width="350"
        height="450"
        onClick={handleClickEvent}
        className="p-2 group cursor-pointer z-20 relative
      transition duration-200 ease-in 
      transform hover:scale-105 hover:brightness-50 flex-column items-center"
      />
      <Caption>
        <h2 className="mt-1 text-2xl text-white transition-all duration-100 ease-in-out group-hover:font-bold">
          {movie.title}
        </h2>
        <p className="flex items-center opacity-100">
          {movieYear}
        </p>
      </Caption>
    </Movie>
  );
});

Thumbnail.displayName = "Thumbnail";

export default Thumbnail;
