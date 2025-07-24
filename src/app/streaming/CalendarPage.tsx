"use client";

import React, { useState } from "react";
import { Container, Typography, Box, Grid, TextField, MenuItem, useMediaQuery, ToggleButtonGroup, ToggleButton } from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ListIcon from "@mui/icons-material/List";
import MovieIcon from "@mui/icons-material/Movie";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import dayjs, { Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Media } from "@/data-models/media.interface";
import { useTheme } from "@mui/material/styles";
import Picker from "@/components/calendar/Picker";
import CalendarDay from "@/components/calendar/CalendarDay";
import ListView from "@/components/calendar/ListView";

dayjs.extend(localizedFormat);

interface Props {
  watchList: Media[];
}

const CalendarPage = ({ watchList }: Props) => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs().startOf("month"));
  const [nameFilter, setNameFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month");
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [listType, setListType] = useState<"tv" | "movie">("tv");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const networks = watchList.flatMap((movie) => movie.networks?.map((p) => p.name) || []);
  const flatRates = watchList.flatMap((movie) => movie.providers?.flatrate?.map((p) => p.provider_name) || []);

  const uniqueProviders = Array.from(new Set([...flatRates, ...networks]));

  // For week view, base the calendar grid on the current month, but allow navigation through all weeks in the grid
  // Calculate the full range of days to cover all visible weeks, including those that start in the previous or next month
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const calendarStart = startOfMonth.startOf("week");
  const calendarEnd = endOfMonth.endOf("week");

  // Unified navigation handlers for back/forward depending on view mode
  // maxWeekIndex is now declared after daysArray
  const handleBack = () => {
    if (viewMode === "month") {
      setCurrentMonth((prev) => prev.subtract(1, "month"));
      setCurrentWeekIndex(0);
    } else if (viewMode === "week") {
      if (currentWeekIndex === 0) {
        // Go to previous month and last week
        const prevMonth = currentMonth.subtract(1, "month");
        const prevStartOfMonth = prevMonth.startOf("month");
        const prevEndOfMonth = prevMonth.endOf("month");
        const prevCalendarStart = prevStartOfMonth.startOf("week");
        const prevCalendarEnd = prevEndOfMonth.endOf("week");
        const prevTotalCells = prevCalendarEnd.diff(prevCalendarStart, "day") + 1;
        const prevMaxWeekIndex = Math.ceil(prevTotalCells / 7) - 1;
        setCurrentMonth(prevMonth);
        setCurrentWeekIndex(prevMaxWeekIndex);
      } else {
        setCurrentWeekIndex((i) => Math.max(i - 1, 0));
      }
    }
  };

  const handleForward = () => {
    if (viewMode === "month") {
      setCurrentMonth((prev) => prev.add(1, "month"));
      setCurrentWeekIndex(0);
    } else if (viewMode === "week") {
      if (currentWeekIndex >= maxWeekIndex) {
        // Go to next month and first week
        setCurrentMonth((prev) => prev.add(1, "month"));
        setCurrentWeekIndex(0);
      } else {
        setCurrentWeekIndex((i) => (i < maxWeekIndex ? i + 1 : i));
      }
    }
  };

  // Build daysArray to cover all days from calendarStart to calendarEnd (inclusive)
  const totalCells = calendarEnd.diff(calendarStart, "day") + 1;
  const daysArray = Array.from({ length: totalCells }, (_, i) => calendarStart.add(i, "day"));
  const maxWeekIndex = Math.ceil(daysArray.length / 7) - 1;

  // Helper to add a show to a date bucket
  const addShowToDate = (dict: { [date: string]: Media[] }, date: string, show: Media) => {
    if (!dict[date]) dict[date] = [];
    dict[date].push(show);
  };

  // Build showsByDate: TV shows with episodes only by episode air_date, movies by release_date
  const showsByDate: { [date: string]: Media[] } = {};
  watchList.forEach((item) => {
    if (Array.isArray(item.episodes) && item.episodes.length > 0) {
      // TV show with episodes: add each episode by its air_date
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      item.episodes.forEach((season: any) => {
        if (Array.isArray(season.episodes)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          season.episodes.forEach((ep: any) => {
            if (ep.air_date) {
              const epDay = dayjs(ep.air_date).format("YYYY-MM-DD");
              addShowToDate(showsByDate, epDay, { ...item, episodes: [ep] });
            }
          });
        }
      });
    } else {
      // Movie or TV show without episodes: add by release_date
      const releaseDate = item?.release_date || item?.first_air_date;
      if (releaseDate && dayjs(releaseDate).isSame(currentMonth, "month")) {
        const releaseDay = dayjs(releaseDate).format("YYYY-MM-DD");
        addShowToDate(showsByDate, releaseDay, item);
      }
    }
  });

  const filterShow = (show: Media) => {
    const matchesName = show?.name?.toLowerCase().includes(nameFilter.toLowerCase()) || show?.title?.toLocaleLowerCase().includes(nameFilter.toLocaleLowerCase());
    const matchesProvider = !providerFilter || show.providers?.flatrate?.some((p) => p.provider_name === providerFilter);
    return matchesName && matchesProvider;
  };

  // For week view, currentWeekIndex is the week number (0-based), not a day index
  const visibleDates = viewMode === "week" ? daysArray.slice(currentWeekIndex * 7, currentWeekIndex * 7 + 7) : daysArray;

  // For month and week views, show both TV and movies; for list view, filter by listType
  const filteredWatchList = viewMode === "list" ? (listType === "tv" ? watchList.filter((item) => !!item.name) : watchList.filter((item) => !!item.title)) : watchList;

  // Build filteredShowsByDate: TV shows with episodes only by episode air_date, movies by release_date
  const filteredShowsByDate: { [date: string]: Media[] } = {};
  filteredWatchList.forEach((item) => {
    if (Array.isArray(item.episodes) && item.episodes.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      item.episodes.forEach((season: any) => {
        if (Array.isArray(season.episodes)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          season.episodes.forEach((ep: any) => {
            if (ep.air_date) {
              const epDay = dayjs(ep.air_date).format("YYYY-MM-DD");
              addShowToDate(filteredShowsByDate, epDay, { ...item, episodes: [ep] });
            }
          });
        }
      });
    } else {
      const releaseDate = item?.release_date || item?.first_air_date;
      if (releaseDate && dayjs(releaseDate).isSame(currentMonth, "month")) {
        const releaseDay = dayjs(releaseDate).format("YYYY-MM-DD");
        addShowToDate(filteredShowsByDate, releaseDay, item);
      }
    }
  });

  return (
    <Container sx={{ py: 2 }}>
      <Picker back={handleBack} forward={handleForward} currentMonth={currentMonth} />

      <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2} mb={2}>
        <TextField label="Filter by Name" variant="outlined" size="small" fullWidth value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
        <TextField label="Filter by Provider" variant="outlined" size="small" select fullWidth value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          {uniqueProviders.map((provider) => (
            <MenuItem key={provider} value={provider}>
              {provider}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, val) => {
            if (val) {
              setViewMode(val);
              if (val === "week") {
                // Find the week index for today
                const today = dayjs();
                const todayIndex = daysArray.findIndex((day) => day.isSame(today, "day"));
                if (todayIndex !== -1) {
                  setCurrentWeekIndex(Math.floor(todayIndex / 7));
                } else {
                  setCurrentWeekIndex(0);
                }
              } else {
                setCurrentWeekIndex(0);
              }
            }
          }}
          size="small"
          sx={{
            boxShadow: 1,
            borderRadius: 2,
            backgroundColor: (theme) => theme.palette.background.paper,
            width: { xs: "100%", sm: "auto" },
          }}
          fullWidth={isMobile}
          aria-label="View mode"
        >
          <ToggleButton value="month" aria-label="Month View">
            <ViewModuleIcon sx={{ mr: 1 }} />
            Month
          </ToggleButton>
          <ToggleButton value="week" aria-label="Week View">
            <ViewWeekIcon sx={{ mr: 1 }} />
            Week
          </ToggleButton>
          <ToggleButton value="list" aria-label="List View">
            <ListIcon sx={{ mr: 1 }} />
            List
          </ToggleButton>
        </ToggleButtonGroup>

        {viewMode === "list" && (
          <ToggleButtonGroup
            value={listType}
            exclusive
            onChange={(e, val) => {
              if (val) setListType(val);
            }}
            size="small"
            sx={{
              boxShadow: 1,
              borderRadius: 2,
              backgroundColor: (theme) => theme.palette.background.paper,
              width: { xs: "100%", sm: "auto" },
              ml: 2,
            }}
            fullWidth={false}
            aria-label="List type"
          >
            <ToggleButton value="tv" aria-label="TV Shows">
              <LiveTvIcon sx={{ mr: 1 }} />
              TV Shows
            </ToggleButton>
            <ToggleButton value="movie" aria-label="Movies">
              <MovieIcon sx={{ mr: 1 }} />
              Movies
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      {/* {viewMode === "week" && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Button
            onClick={handleBack}
            disabled={currentWeekIndex === 0}
          >
            Previous Week
          </Button>
          <Button
            onClick={handleForward}
            disabled={currentWeekIndex >= maxWeekIndex}
          >
            Next Week
          </Button>
        </Box>
      )} */}

      {viewMode === "list" ? (
        <ListView shows={filteredWatchList} />
      ) : (
        <Grid container spacing={0.5} columns={7}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Grid size={1} key={day}>
              <Typography variant="caption" align="center" color="gray" display="block">
                {day}
              </Typography>
            </Grid>
          ))}

          {visibleDates.map((day) => {
            const dayKey = day.format("YYYY-MM-DD");
            const shows = (filteredShowsByDate[dayKey] || []).filter(filterShow);
            const isToday = day.isSame(dayjs(), "day");

            return (
              <Grid size={1} key={dayKey}>
                <CalendarDay shows={shows} day={day} isToday={isToday} />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default CalendarPage;
