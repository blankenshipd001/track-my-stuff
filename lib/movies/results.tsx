/* eslint-disable @typescript-eslint/strict-boolean-expressions */
"use client";

import { Paper, styled } from "@mui/material";
import Thumbnail from "./thumbnail";
import Carousel from "../components/carousel/carousel";
import ProviderComponent from "../components/misc/provider-component";
import { Provider } from "@/lib/@interfaces/provider.interface";
import { Movie } from "@/lib/@interfaces/movie.interface";

const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

const Providers = styled(Paper)`
  display: flex;
  flex-direction: row;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Results({ movies, bookmarkClicked }: { movies: Movie[]; bookmarkClicked(movie: any): any; }) {
  return (
    <Carousel>
      {movies.map((movie: Movie) => {
        console.log("movie: ", movie);
        return (
          <div key={movie.movieId}>
            <Thumbnail key={movie.movieId} movie={movie} bookmarkClicked={bookmarkClicked} />
            <Providers>
              {movie.providers?.flatrate?.map((provider: Provider) => {
                return <ProviderComponent key={provider.provider_id} provider={provider} imageSrc={`${BASE_URL}${provider.logo_path}`} />;
              })}
            </Providers>
          </div>
        );
      })}
    </Carousel>
  );
}

export default Results;
