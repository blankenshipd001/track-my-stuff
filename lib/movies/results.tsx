"use client";

// import { Box, styled } from "@mui/material";
import Thumbnail from "./thumbnail";
import Carousel from "../components/carousel/carousel";
// import ProviderComponent from "../components/misc/provider-component";
// import { Provider } from "@/lib/@interfaces/provider.interface";
import { Movie } from "@/lib/@interfaces/movie.interface";

// const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

// const  Providers = styled(Box)`
//   display: flex;
//   flex-direction: row;
// `;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Results({ movies, bookmarkClicked }: { movies: Movie[]; bookmarkClicked(movie: Movie): any; }) {
  return (
    <Carousel>
      {movies.map((movie: Movie) => {
        // const movieData = `${movie.media_type ?? ""} ${movie.release_date ?? movie.first_air_date}`;
        // const [movieYear] = movieData.split("-");
        return (
          <div key={movie.movieId} >
            <Thumbnail key={movie.id} movie={movie} bookmarkClicked={bookmarkClicked} />
            {/* <Box sx={{ alignItems: "flex-start", width: "100%" }}>
              <Box sx={{ fontWeight: "700", fontSize: "16px", fontStyle: "normal", lineHeight: "21.79px", color: "#FFF" }}>{movie.title}</Box>
              <Box sx={{ fontWeight: "400", fontSize: "16px", fontStyle: "normal", lineHeight: "21.79px", color: "#AAA" }}>{movieYear}</Box>
            </Box>
            <Providers>
              {movie.providers?.flatrate?.map((provider: Provider) => {
                return <ProviderComponent key={provider.provider_id} provider={provider} imageSrc={`${BASE_URL}${provider.logo_path}`} />;
              })} */}
            {/* </Providers> */}
          </div>
        );
      })}
    </Carousel>
  );
}

export default Results;
