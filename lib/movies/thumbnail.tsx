// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { forwardRef, Ref } from "react";

// import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardMedia, styled } from "@mui/material";
import ActionItems from "../shared/action-items";
import { Box } from "@mui/material";
import { Movie } from "../@interfaces/movie.interface";

interface thumbnail {
  movie: Movie;
  bookmarkClicked(movie: Movie): void;
}

const Thumbnail = forwardRef(({ movie, bookmarkClicked }: thumbnail, ref: Ref<HTMLDivElement>): JSX.Element => {
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;
  const router = useRouter();
  const poster = movie.poster_path ?? movie.backdrop_path;
  const Movie = styled(Box)(() => ({
    alignItems: "center",
    flexDirection: "column",
    display: "flex",
    textAlign: "left",
    color: "white",
    position: "relative",
    cursor: "pointer",
  }));

  const ActionItemsContainer = styled("div")`
    text-align:center;
    margin: auto;
    width: fit-content;
    display: none;
  `;

  const ContainerStyled = styled(Box)`
    &:hover {
      .action-items {
        display: block;
      }
    }  
  }`;

  const handleClickEvent = () => {
    router.push(`/movies/${movie.movieId}`, { scroll: false });
  };

  return (
    <Card sx={{ minWidth: 200 }} style={{ position: "relative", width: "90%" }}>
      <Movie ref={ref}>
        <ContainerStyled>
          <CardMedia
            onClick={handleClickEvent}
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "100%",
              height: "auto",
              zIndex: "1",
            }}
            component="img"
            height="200"
            image={`${BASE_URL}${poster}`}
            alt="work portfolio"
          />
          <ActionItemsContainer className="action-items">
            <ActionItems movie={movie} addClicked={bookmarkClicked} />
          </ActionItemsContainer>
        </ContainerStyled>
      </Movie>
    </Card>

    // <Movie ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
    //   {isDropdownVisible && <ActionItems movie={movie} bookmarkClicked={bookmarkClicked} />}
    //   <Image
    //     priority={true}
    //     src={`${BASE_URL}${poster}`}
    //     alt={movie.title}
    //     width="300"
    //     height="453"
    //     onClick={handleClickEvent}
    //   />
    // </Movie>
  );
});

Thumbnail.displayName = "Thumbnail";

export default Thumbnail;
