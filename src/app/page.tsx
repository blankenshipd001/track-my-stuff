import React from "react";
import { cookies } from "next/headers";
import { verifyIdToken } from "@/utils/firebase/firebaseAdmin";
import { Container } from "@mui/material";
import { Title } from "@/components/title";
import { MovieContent } from "@/components/movies/movie-content";
import { fetchPopularContent } from "@utils/api/serverContentApi";

const MovieSearch = async () => {
  let user = null;

  const cookieStore = cookies();
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const token = cookieStore.get("token")?.value || "";
  if (token !== null) {
    user = await verifyIdToken(token);
  }

  const popularMedia = await fetchPopularContent();

  return (
    <Container>
      <Title />
      <MovieContent 
        popularMedia={popularMedia}
        user={user}
      />
    </Container>
  );
};

export default MovieSearch;
