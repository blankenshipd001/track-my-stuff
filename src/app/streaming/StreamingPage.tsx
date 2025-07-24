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
              <Image src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name ?? 'image'} width={500} height={750} style={{ width: "100%", height: "auto" }} />
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
