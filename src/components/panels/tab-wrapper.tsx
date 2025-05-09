"use client";
import { Box, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { TabPanel } from "./tab-panel";
import { MovieGrid } from "../movies";
import { Movie } from "@/data-models/movie.interface";
import useNotificationBar from "@/hooks/useNotificationBar";
import { useRouter } from "next/navigation";
import { addToWatchList, requestRemoveFromWatchList } from "@/utils/api/contentApi";

interface Props {
  user?: { uid: string; email?: string } | null;
  watchList: Movie[];
  allContent: Movie[];
  movies: Movie[];
  tvShows: Movie[];
}

const TabsWrapper = ({ user, watchList, allContent, movies, tvShows }: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tab, setTab] = useState<number>(0);
  const tabOneTitle = allContent.length > 0 ? "All" : "Trending";

  const handleAdd = async (movie: Movie) => {
    try {
      if (!user) {
        enqueueNotificationBar("Please log in to save movies.", "info");
        return;
      }

      addToWatchList(user.uid, movie);
      enqueueNotificationBar("Added to your watch list!", "success");
      router.refresh();
    } catch (err) {
      enqueueNotificationBar(`Error: ${err}`, "error");
    }
  };

  const handleRemove = async (movie: Movie) => {
    try {
      if (!user) {
        enqueueNotificationBar("Please log in to save movies.", "info");
        return;
      }

      requestRemoveFromWatchList(user.uid, movie);
      enqueueNotificationBar("Removed from your watch list!", "success");
      router.refresh();
    } catch (err) {
      enqueueNotificationBar(`Error: ${err}`, "error");
    }
  };

  const renderTabSelector = () => (
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <InputLabel id="tab-select-label">View</InputLabel>
      <Select labelId="tab-select-label" value={tab} label="View" onChange={(e) => setTab(Number(e.target.value))}>
        <MenuItem value={0}>{tabOneTitle}</MenuItem>
        <MenuItem value={1}>Movies</MenuItem>
        <MenuItem value={2}>TV</MenuItem>
        {user && <MenuItem value={3}>Watchlist</MenuItem>}
      </Select>
    </FormControl>
  );

  return (
    <>
      {isMobile ? (
        renderTabSelector()
      ) : (
        <Box sx={{ borderBottom: 1, borderColor: "divider", overflowX: "auto" }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} variant="scrollable" scrollButtons="auto">
            <Tab label={tabOneTitle} />
            <Tab label="Movies" />
            <Tab label="TV" />
            {user && <Tab label="Watchlist" />}
          </Tabs>
        </Box>
      )}

      <TabPanel value={tab} index={0}>
        <MovieGrid movies={allContent} addClicked={handleAdd}/>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <MovieGrid movies={movies} addClicked={handleAdd}/>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <MovieGrid movies={tvShows} addClicked={handleAdd}/>
      </TabPanel>
      {user && (
        <TabPanel value={tab} index={3}>
          <MovieGrid movies={watchList} removeClicked={handleRemove}/>
        </TabPanel>
      )}

      {NotificationBarComponent}
    </>
  );
};

export default TabsWrapper;
