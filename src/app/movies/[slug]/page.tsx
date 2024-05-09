"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Box, Container, Grid, Paper, Typography, useMediaQuery } from "@mui/material";
import { Details, MovieGrid } from "@/components/movies";
import { ProviderGrid } from "@/components/provider";
import useNotificationBar from "@/hooks/useNotificationBar";
import { BackButton } from "@/components/buttons/back-button";
import { UserAuth } from "@/utils/providers/auth-provider";
import { Movie } from "@/data-models/movie.interface";
import { darkTheme } from "@/utils/themes/theme";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { googleSignIn, user } = UserAuth();
  const isMobile = useMediaQuery(darkTheme.breakpoints.down("sm"));

  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();

  const [details, setDetails] = useState<Movie>();
  const [recommended, setRecommended] = useState<Movie[]>([]);

  useEffect(() => {
    getItem();
  }, []);

  // TODO Handle actually going back with the search?
  const goBack = () => {
    router.push("/");
  };

  const addToWatchList = async (movie: Movie) => {
    if (user === null) {
      await googleSignIn();
    }

    // Delete the id from the movies database so we can use the documents ID that's set by firebase
    delete movie.id;
    const path = "users/" + user?.uid + "/movies";
    // TODO do we need the docRef response
    //const docRef =
    await addDoc(collection(db, path), {
      ...movie,
    })
      .then(() => {
        enqueueNotificationBar("Successfully added to your watch list", "success");
      })
      .catch((err: unknown) => {
        enqueueNotificationBar(`Failure adding to your watch list: ${err}`, "error");
      });
  };

  const getRecommended = async (movie: Movie) => {
    const genre = movie?.genres[0]?.id;
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genre}&api_key=${movie_api_key}`;
    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setRecommended(data.results);
      });
  };

  /**
   * For now check on both movies and tv (later pass it as a query param?)
   * TODO: Refactor this mess to parse a query param for the type tv/movie and then make one call.
   *
   * TODO: refactor out fetch calls into hooks to clean up duplicated code
   */
  const getItem = async () => {
    const getMovieUrl = `https://api.themoviedb.org/3/movie/${params.slug}?api_key=${movie_api_key}`;
    const getTvUrl = `https://api.themoviedb.org/3/tv/${params.slug}?api_key=${movie_api_key}`;
    Promise.all([fetch(getMovieUrl), fetch(getTvUrl)]).then(async ([movieResponse, tvResponse]) => {
      if (movieResponse.status === 200) {
        const results = await movieResponse.json();
        return fetch(`https://api.themoviedb.org/3/movie/${results.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`)
          .then((res) => res.json())
          .then((providers) => {
            const newMovie = {
              ...results,
              movieId: results.id,
              // For now we only care about US but we could expand
              providers: providers.results.US ?? [],
            };
            setDetails(newMovie);
            getRecommended(newMovie);
          });
      }
      if (tvResponse.status === 200) {
        const results = await tvResponse.json();
        return fetch(`https://api.themoviedb.org/3/movie/${results.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`)
          .then((res) => res.json())
          .then((providers) => {
            const newMovie = {
              ...results,
              movieId: results.id,
              // For now we only care about US but we could expand
              providers: providers.results.US ?? [],
            };
            setDetails(newMovie);
            getRecommended(newMovie);
          });
      }
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: isMobile ? 1 : 3 }}>
        <Paper elevation={3} sx={{ padding: isMobile ? 1 : 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <BackButton buttonClick={() => goBack()} />
            </Grid>
            {details && (
              <Grid item xs={12}>
                <Details movie={details} />
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Providers */}
        <Grid container spacing={isMobile ? 2 : 5} sx={{ marginTop: 2 }}>
          <ProviderGrid title="Buy" items={details?.providers?.buy || []} />
          <ProviderGrid title="Rent" items={details?.providers?.rent || []} />
          <ProviderGrid title="Subscribe" items={details?.providers?.flatrate || []} />
        </Grid>

        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: "400",
            fontSize: "18px",
            lineHeight: "24px",
            paddingLeft: isMobile ? 1 : 3,
            marginBottom: 1, // Removed negative margin
          }}
        >
          You may also like...
        </Typography>
        <MovieGrid movies={recommended} addClicked={addToWatchList} />
        {NotificationBarComponent}
      </Box>
    </Container>
  );
}
