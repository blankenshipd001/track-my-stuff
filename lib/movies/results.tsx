"use client"

import Thumbnail from './thumbnail';
import FlipMove from "react-flip-move";

function Results({ movies, bookmarkClicked }: any) {
  return (
    <FlipMove
      className="px-5 my-10 sm:grid 
      md:grid-cols-2 xl:grid-cols-3 
      3xl:grid-cols-4"
    >
      {movies.map((movie: any) => (
        <Thumbnail key={movie.imdbID} movie={movie} bookmarkClicked={bookmarkClicked} />
      ))}
    </FlipMove>
  );
}

export default Results;