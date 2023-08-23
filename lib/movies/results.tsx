"use client"

import Thumbnail from './thumbnail';
import FlipMove from "react-flip-move";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Results({ movies, bookmarkClicked }: any) {
  return (
    <FlipMove
      className="px-5 my-10 sm:grid 
      md:grid-cols-2 xl:grid-cols-3 
      3xl:grid-cols-4"
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {movies.map((movie: any) => (
        <Thumbnail key={movie.imdbID} movie={movie} bookmarkClicked={bookmarkClicked} />
      ))}
    </FlipMove>
  );
}

export default Results;