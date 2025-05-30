"use client";
// app/tv-schedule/page.tsx
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import Image from "next/image";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watchList: any;
}

const TvSchedulePage = ({ watchList }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tvShowsWithName = watchList.filter((item: any) => !!item.name);
console.log("Tv Shows in Watchlist: ", tvShowsWithName);
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" color="white" gutterBottom>
        Upcoming Episodes
      </Typography>
      <Grid container spacing={4}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {tvShowsWithName.map((show: any) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={show.name}>
            <Paper
              elevation={6}
              sx={{
                backgroundColor: "#1f1f1f",
                borderRadius: 4,
                overflow: "hidden",
                color: "white",
                height: "100%",
              }}
            >
              <Image src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} width={500} height={750} style={{ width: "100%", height: "auto" }} />
              <Box p={2}>
                <Typography variant="h6">{show.name}</Typography>
                <Typography variant="body2" color="grey.400">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {show.networks.map((n: any) => n.name).join(", ")}
                </Typography>
                {show.next_episode_to_air?.air_date && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Next Episode:{" "}
                    <strong>
                      {new Date(show.next_episode_to_air.air_date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </strong>
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TvSchedulePage;



        // <Grid container spacing={2}>
        //   {moviesThisWeek.map((movie: Movie) => (
        //     <Grid size={{ xs: 12, sm: 6, md: 4 }} key={movie.id}>
        //       <Card sx={{ display: "flex", backgroundColor: "#222" }}>
        //         <Box
        //           component="img"
        //           src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
        //           alt={movie.name}
        //           sx={{
        //             width: 100,
        //             height: "auto",
        //             objectFit: "cover",
        //             borderTopLeftRadius: 4,
        //             borderBottomLeftRadius: 4,
        //           }}
        //         />
        //         <CardContent sx={{ flex: "1 0 auto" }}>
        //           <Typography variant="h6">{movie.name}</Typography>
        //           <Typography variant="body2" color="text.secondary">
        //             Airs on: {dayjs(movie.first_air_date).format("dddd, MMM D")}
        //           </Typography>
        //           {movie?.providers?.flatrate?.map((provider) => (
        //             <Box key={provider.provider_id} display="flex" alignItems="center" mt={1}>
        //               <img src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`} alt={provider.provider_name} style={{ marginRight: 8, borderRadius: 4 }} />
        //               <Typography>{provider.provider_name}</Typography>
        //             </Box>
        //           ))}
        //         </CardContent>
        //       </Card>
        //     </Grid>
        //   ))}
        // </Grid>