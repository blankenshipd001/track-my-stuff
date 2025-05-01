import React from "react";
// import { cookies } from "next/headers";
// import { verifyIdToken } from "@/utils/firebase/firebaseAdmin";
import { Container } from "@mui/material";
import { Title } from "@/components/title";
import { fetchPopularContent } from "@utils/api/serverContentApi";
import MovieContent from "@/components/movies/movie-content";
// import { getUserFromCookies } from "@/lib/firebase/auth";

const MovieSearch = async () => {  
  // const user = await getUserFromCookies(); // implement based on Firebase cookies
  const popularMedia = await fetchPopularContent();
  // const watchList = user ? await getWatchList(user.uid) : [];


  // const cookieStore = cookies();
  // // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  // const token = cookieStore.get("token")?.value || "";
  // if (token !== null) {
  //   user = await verifyIdToken(token);
  // }


  return (
    <Container>
      <Title />
      <MovieContent 
        popularMedia={popularMedia}
        user={null}
      />
    </Container>
  );
};

export default MovieSearch;
