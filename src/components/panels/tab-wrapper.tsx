"use client"
import { Box, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { TabPanel } from "./tab-panel";
import { MovieGrid } from "../movies";
import { Movie } from "@/data-models/movie.interface";


interface Props {
    user: { uid: string; email?: string } | null;
    watchList: Movie[];
    allContent: Movie[];
    movies: Movie[];
    tvShows: Movie[];
}

const TabsWrapper = ({ user, watchList, allContent, movies, tvShows }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [tab, setTab] = useState<number>(0);
    const tabOneTitle = allContent.length > 0 ? "All" : "Trending";

    const renderTabSelector = () => (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id="tab-select-label">View</InputLabel>
          <Select
            labelId="tab-select-label"
            value={tab}
            label="View"
            onChange={(e) => setTab(Number(e.target.value))}
          >
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
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={tabOneTitle} />
            <Tab label="Movies" />
            <Tab label="TV" />
            {user && <Tab label="Watchlist" />}
          </Tabs>
        </Box>
      )}

      <TabPanel value={tab} index={0}>
        <MovieGrid movies={allContent} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <MovieGrid movies={movies} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <MovieGrid movies={tvShows} />
      </TabPanel>
      {user && (
        <TabPanel value={tab} index={3}>
          <MovieGrid movies={watchList} />
        </TabPanel>
      )}
    </>
    );
}

export default TabsWrapper;