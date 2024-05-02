/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { collection, addDoc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { Box, Container, Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/config/firebase";
import { Details, MovieGrid } from "@/components/movies";
import { ProviderGrid } from "@/components/provider";
import { Movie } from "@/data-models/movie.interface";
import useNotificationBar from "@/hooks/useNotificationBar";
import { BackButton } from "@/components/buttons/back-button";
import { Header } from "@/components/header";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

//TODO: Refactor the header to use Box/Paper/Containers/Flex layouts not absolute
export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter();

  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();

  const [details, setDetails] = useState<Movie>();
  const [recommended, setRecommended] = useState<any>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setUser(user);
      } else {
        // No user is signed in.
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    getItem();
  }, []);

  // TODO Handle actually going back with the search?
  const goBack = () => {
    router.push("/");
  };

  const commonStyles = {
    providerBox: {
      display: "flex",
      paddingRight: "10px",
      marginLeft: "10px",
      paddingTop: "10px",
    },
    paperRoot: {
      p: 2,
      margin: "auto",
      maxWidth: "100%",
      flexGrow: 1,
      marginBottom: "2rem",
      backgroundColor: "#1A1A1A",
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addToWatchList = async (movie: any) => {
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
      .catch((err: any) => {
        enqueueNotificationBar(`Failure adding to your watch list: ${err}`, "error");
      });
  };

  const getRecommended = async (movie: any) => {
    const genre = movie?.genres[0]?.id;
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genre}&api_key=${movie_api_key}`;
    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
            // console.log("providers", providers);
            const newMovie = {
              ...results,
              movieId: results.id,
              // For now we only care about US but we could expand
              providers: providers.results.US ?? [],
            };
            console.log(newMovie);
            setDetails(newMovie);
            getRecommended(newMovie);
          });
      }
      if (tvResponse.status === 200) {
        const results = await tvResponse.json();
        return fetch(`https://api.themoviedb.org/3/movie/${results.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`)
          .then((res) => res.json())
          .then((providers) => {
            // console.log("providers", providers);
            const newMovie = {
              ...results,
              movieId: results.id,
              // For now we only care about US but we could expand
              providers: providers.results.US ?? [],
            };
            console.log(newMovie);
            setDetails(newMovie);
            getRecommended(newMovie);
          });
      }
    });
  };

  return (
    <Container>
    <Header />
      <Box>
        <Paper sx={commonStyles.paperRoot}>
          <Grid container spacing={2}>
            <Grid item>
              <BackButton buttonClick={() => goBack()} />
            </Grid>
            {details ? <Details movie={details} /> : null}
          </Grid>
        </Paper>

        {/* Providers */}
        <Grid container spacing={5}>
          <ProviderGrid title="Buy" items={details?.providers?.buy || []} />
          <ProviderGrid title="Rent" items={details?.providers?.rent || []} />
          <ProviderGrid title="Subscribe" items={details?.providers?.flatrate || []} />
        </Grid>

        <Box
          sx={{
            color: "white",
            fontWeight: "400",
            fontSize: "18px",
            lineHeight: "24.51px",
            paddingLeft: "28px",
            // This is a hack for now
            marginBottom: "-1rem",
          }}
        >
          You may also like...
        </Box>
        <MovieGrid movies={recommended} addClicked={addToWatchList} />
        {NotificationBarComponent}
      </Box>
    </Container>
  );
}
