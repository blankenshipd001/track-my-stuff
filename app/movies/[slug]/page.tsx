/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Header from "@/lib/shared/header";
import { Box, Button, Divider, Fab, Grid, Paper, styled } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CheckIcon from "@mui/icons-material/Check";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Image from "next/image";
import { useEffect, useState, forwardRef } from "react";
import { useRouter } from "next/navigation";
import Results from "@/lib/movies/results";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/api/firestore";
import { User as FirebaseUser } from "firebase/auth";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
const BASE_URL = "https://image.tmdb.org/t/p/original/"; // process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


//TODO come back here
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#3D3D3D",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

//TODO: Refactor the header to use Box/Paper/Containers/Flex layouts not absolute
export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [details, setDetails] = useState<any>();
  const [recommended, setRecommended] = useState<any>([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  
  useEffect(() => {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        setUser(user);
      } else {
        // No user is signed in.
        setUser(null)
      }
    });
  }, []);

  useEffect(() => {
    getItem();
  }, []);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || reason === 'escapeKeyDown') {
      setErrorOpen(false);
      setSuccessOpen(false);
    }

    setErrorOpen(false);
    setSuccessOpen(false);
  };

  // TODO Handle actually going back with the search?
  const goBack = () => {
    router.push("/");
  };

  const provider = (provider: any) => {
    return (
      <Box
        display="flex"
        key={provider.provider_id}
        sx={{ paddingRight: "10px", paddingTop: "10px" }}
      >
        <Image
          style={{ borderRadius: "10px" }}
          src={`${BASE_URL}${provider.logo_path}`}
          alt="movie poster2"
          height={40}
          width={50}
        />
        <span style={{ paddingLeft: "10px", paddingTop: "10px" }}>
          {provider.provider_name}
        </span>
      </Box>
    );
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
      }).then(() => {
        setAlertMessage("Successfully added to your watch list")
        setSuccessOpen(true);
      }).catch((err: any) => {
        //TODO handle failure due to login and pop login
        setAlertMessage(`Failure adding to your watch list: ${err}`);
        setErrorOpen(true);
      });
    };

  const getRecommended = (movie: any) => {
    const genre = movie?.genres[0]?.id;
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genre}&api_key=${movie_api_key}`

    return fetch(url).then(res => res.json()).then(data => {
      console.log(data);
      setRecommended(data.results);
    })
  }

  /**
   * For now check on both movies and tv (later pass it as a query param?)
   * TODO: Refactor this mess to parse a query param for the type tv/movie and then make one call.
   *
   * TODO: refactor out fetch calls into hooks to clean up duplicated code
   */
  const getItem = async () => {
    const getMovieUrl = `https://api.themoviedb.org/3/movie/${params.slug}?api_key=${movie_api_key}`;
    const getTvUrl = `https://api.themoviedb.org/3/tv/${params.slug}?api_key=${movie_api_key}`;

    Promise.all([fetch(getMovieUrl), fetch(getTvUrl)]).then(
      async ([movieResponse, tvResponse]) => {
        if (movieResponse.status === 200) {
          const results = await movieResponse.json();
          return fetch(
            `https://api.themoviedb.org/3/movie/${results.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`
          )
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
          return fetch(
            `https://api.themoviedb.org/3/movie/${results.id}/watch/providers?api_key=${movie_api_key}&external_source=imdb_id`
          )
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
      }
    );
  };


  return (
    <Box>
      <Header />
      <Box
        component="section"
        bgcolor="#1A1A1A"
        sx={{
          flexGrow: 1,
          paddingBottom: "3rem",
        }}
        style={{ backgroundColor: "#1A1A1A" }}
      >
        <Box
          zIndex={-1}
          style={{
            filter: "blur(16px) brightness(50%)",
            backgroundColor: "rgba(255,255,255, 0.35)",
            backgroundImage: `url(${BASE_URL}${details?.backdrop_path})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "40vh",
            width: "100%",
          }}
        />
        <Fab
          size="medium"
          style={{
            backgroundColor: "#782FEF",
            // border: `1px solid #`,
            color: "#FFFFFF",
            position: "absolute",
            top: "110px",
            left: "45px",
          }}
          aria-label="add"
        >
          <ArrowBackIosIcon onClick={goBack} style={{ paddingLeft: "5px" }} />
        </Fab>
        <Box
          onClick={goBack}
          style={{
            cursor: "pointer",
            color: "#FFFFFF",
            position: "absolute",
            top: "122px",
            left: "98px",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Back
        </Box>
        <Image
          src={`${BASE_URL}${details?.poster_path}`}
          alt={details?.title}
          width="230"
          style={{
            position: "absolute",
            top: "175px",
            left: "53px",
          }}
          height="300"
        />
        <Box
          style={{
            cursor: "pointer",
            color: "#FFFFFF",
            position: "absolute",
            top: "171px",
            left: "320px",
            fontWeight: "bold",
            fontSize: "36px",
          }}
        >
          {details?.title} ({details?.release_date})
        </Box>
        <Box
          style={{
            cursor: "pointer",
            color: "#FFFFFF",
            position: "absolute",
            top: "225px",
            left: "320px",
            fontWeight: "bold",
            fontSize: "18px",
            width: "682px",
          }}
        >
          {details?.overview}
        </Box>
        <Box
          style={{
            cursor: "pointer",
            color: "white",
            position: "absolute",
            top: "450px",
            left: "320px",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          <Button
            variant="outlined"
            style={{
              color: "white",
              fontWeight: "bold",
              border: "1px solid white",
              borderRadius: "20px",
            }}
            startIcon={<PlaylistAddIcon />}
          >
            WATCHLIST
          </Button>
        </Box>
        <Box
          style={{
            cursor: "pointer",
            color: "white",
            position: "absolute",
            top: "450px",
            left: "480px",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          <Button
            variant="outlined"
            style={{
              color: "white",
              fontWeight: "bold",
              border: "1px solid white",
              borderRadius: "20px",
            }}
            startIcon={<CheckIcon />}
          >
            WATCHED
          </Button>
        </Box>
        <Fab
          size="medium"
          style={{
            backgroundColor: "#FFFFFF",
            position: "absolute",
            top: "445px",
            left: "628px",
          }}
          aria-label="add"
        >
          <ThumbUpIcon onClick={goBack} style={{ paddingLeft: "5px" }} />
        </Fab>
        <Fab
          size="medium"
          style={{
            position: "absolute",
            top: "445px",
            left: "700px",
          }}
          aria-label="add"
        >
          <ThumbDownIcon onClick={goBack} style={{ paddingLeft: "5px" }} />
        </Fab>
      </Box>

      
      {/* Lower Grid for providers */}
      <Grid sx={{ flexGrow: 1 }} style={{paddingLeft: "20px", paddingRight: "20px"}} container spacing={5}>
        <Grid item xs={4}>
          <Item>
            <div style={{fontWeight: "400", fontSize: "18px", paddingBottom: "15px"}}>Buy</div>
            <Divider />
            {details?.providers?.buy?.length > 0 &&
              details?.providers?.buy?.map((p: any) => {
                return provider(p);
              })}
          </Item>
        </Grid>

        <Grid item xs={4} >
          <Item>
          <div style={{fontWeight: "400", fontSize: "18px", paddingBottom: "15px"}}>Rent</div>
            <Divider />

            {details?.providers?.rent?.length > 0 &&
              details?.providers?.rent?.map((p: any) => {
                return provider(p);
              })}
          </Item>
        </Grid>

        <Grid item xs={4}>
          <Item>
          <div style={{fontWeight: "400", fontSize: "18px", paddingBottom: "15px"}}>Subscribe</div>
            <Divider />

            {details?.providers?.flatrate?.length > 0 &&
              details?.providers?.flatrate?.map((p: any) => {
                return provider(p);
              })}
          </Item>
        </Grid>
      </Grid>

      {/* Results for Recommendations */}
      <Box
        sx={{
          color: "white",
          fontWeight: "400",
          fontSize: "18px",
          lineHeight: "24.51px",
          paddingLeft: "28px",
          // This is a hack for now
          marginBottom: "-1rem" 
        }}
      >
        You may also like...
      </Box>

      <Results style={{marginTop: "1rem"}} movies={recommended} bookmarkClicked={addToWatchList} />
      <Snackbar open={successOpen} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
        <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
    </Box>
  );
}
