"use client";
import { Box, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { TabPanel } from "./tab-panel";
import { MediaGrid } from "../media";
import { Media } from "@/data-models/media.interface";
import useNotificationBar from "../notifications/useNotificationBar";

interface Props {
  user?: { uid: string; email?: string } | null;
  watchList: Media[];
  allContent: Media[];
}

const TabsWrapper = ({ user, watchList, allContent }: Props) => {
  const theme = useTheme();
  const { NotificationBarComponent } = useNotificationBar();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tab, setTab] = useState<number>(0);

  const renderTabSelector = () => (
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <InputLabel id="tab-select-label">View</InputLabel>
      <Select labelId="tab-select-label" value={tab} label="View" onChange={(e) => setTab(Number(e.target.value))}>
        <MenuItem value={0}>Trending</MenuItem>
        {user && <MenuItem value={1}>Watchlist</MenuItem>}
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
            <Tab label="Trending" />
            {user && <Tab label="Watchlist" />}
          </Tabs>
        </Box>
      )}

      {user ? (
        <>
          <TabPanel value={tab} index={0}>
            <MediaGrid movies={allContent} user={user} />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <MediaGrid movies={watchList} isWatchlist user={user} />
          </TabPanel>
        </>
      ) : (
        <MediaGrid movies={allContent} />
      )}

      {NotificationBarComponent}
    </>
  );
};

export default TabsWrapper;
