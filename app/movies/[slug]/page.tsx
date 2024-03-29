/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Header from "@/lib/shared/header";
import { Box, Button, Divider, Fab, Grid, Paper } from "@mui/material";
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
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const movie_api_key = process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;
const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway" || reason === "escapeKeyDown") {
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
      <Box display="flex" key={provider.provider_id} sx={{ paddingRight: "10px", marginLeft: "10px", paddingTop: "10px" }}>
        <Image style={{ borderRadius: "10px" }} src={`${BASE_URL}${provider.logo_path}`} alt={provider.provider_name} height={40} width={50} />
        <span style={{ paddingLeft: "10px", paddingTop: "10px" }}>{provider.provider_name}</span>
      </Box>
    );
  };

  const ProviderWrapper = (title: string, items: any) => {
    return (
      <Grid item xs={4}>
        <Paper
          sx={{
            backgroundColor: "#3D3D3D",
            textAlign: "left",
          }}
        >
          <Box
            sx={{
              paddingBottom: "10px"
            }}
          >
          <div
            style={{
              fontWeight: "400",
              fontSize: "18px",
              marginLeft: "10px",
              paddingBottom: "7px",
              paddingTop: "6px",
            }}
          >
            Buy
          </div>
          <Divider />
          {items?.length > 0 && items.map((p: any) => {
              return provider(p);
            })}
        </Box>
        </Paper>
      </Grid>
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
    })
      .then(() => {
        setAlertMessage("Successfully added to your watch list");
        setSuccessOpen(true);
      })
      .catch((err: any) => {
        //TODO handle failure due to login and pop login
        setAlertMessage(`Failure adding to your watch list: ${err}`);
        setErrorOpen(true);
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
    <Box>
      <Header />
      <Paper style={{ position: "relative" }}>
        <Paper
          sx={{
            p: 2,
            margin: "auto",
            maxWidth: "100%",
            flexGrow: 1,
            marginBottom: "2rem",
            backgroundColor: "#1A1A1A",
          }}
          style={{
            filter: "blur(16px) brightness(50%)",
            backgroundColor: "rgba(255,255,255, 0.35)",
            backgroundImage: `url(${BASE_URL}${details?.backdrop_path})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "40vh",
            width: "100%",
          }}
        ></Paper>
        <Paper
          sx={{
            p: 2,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
          }}
        >
          <Grid container spacing={2}>
            <Grid xs={12} item>
              <Box
                onClick={goBack}
                style={{
                  paddingTop: "10px",
                  cursor: "pointer",
                  color: "#FFFFFF",
                  fontWeight: "400",
                  fontSize: "18px",
                }}
              >
                <Fab
                  size="medium"
                  style={{
                    backgroundColor: "#782FEF",
                    color: "#FFFFFF",
                    marginRight: "10px",
                  }}
                  aria-label="add"
                >
                  <ArrowBackIosIcon onClick={goBack} style={{ paddingLeft: "5px" }} />
                </Fab>
                Back
              </Box>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Image src={`${BASE_URL}${details?.poster_path}`} alt={details?.title} width="230" height="300" />
              </Grid>

              <Grid xs={8} item container direction="column" spacing={2}>
                <Grid item xs={12} style={{ paddingLeft: "32px" }}>
                  <Box
                    style={{
                      cursor: "pointer",
                      color: "#FFFFFF",
                      paddingBottom: "12px",
                      fontWeight: "700",
                      fontSize: "40px",
                      lineHeight: "normal",
                    }}
                  >
                    {details?.title}&nbsp;
                    <span style={{ fontSize: "28px", fontStyle: "normal", fontWeight: "400", lineHeight: "28px" }}>({details?.release_date})</span>
                  </Box>

                  <Box
                    style={{
                      cursor: "pointer",
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    {details?.overview}
                  </Box>

                  <Grid item container spacing={3} sx={{ paddingTop: "16px", alignItems: "center" }}>
                    <Grid item>
                      <Box
                        style={{
                          cursor: "pointer",
                          color: "white",
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
                    </Grid>

                    <Grid item>
                      <Box
                        style={{
                          cursor: "pointer",
                          color: "white",
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
                    </Grid>

                    <Grid item>
                      <Fab
                        size="medium"
                        style={{
                          backgroundColor: "#FFFFFF",
                        }}
                        aria-label="add"
                      >
                        <ThumbUpIcon onClick={goBack} style={{ paddingLeft: "5px" }} />
                      </Fab>
                    </Grid>

                    <Grid item>
                      <Fab size="medium" aria-label="add">
                        <ThumbDownIcon onClick={goBack} style={{ paddingLeft: "5px" }} />
                      </Fab>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Paper>

      {/* Lower Grid for providers */}
      <Grid sx={{ flexGrow: 1 }} style={{ paddingLeft: "20px", paddingRight: "20px" }} container spacing={5}>
        {ProviderWrapper("Buy", details?.providers?.buy)}
        {ProviderWrapper("Rent", details?.providers?.rent)}
        {ProviderWrapper("Subscribe", details?.providers?.flatrate)}\
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
          marginBottom: "-1rem",
        }}
      >
        You may also like...
      </Box>
      <Results movies={recommended} bookmarkClicked={addToWatchList} />
      <Snackbar open={successOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
