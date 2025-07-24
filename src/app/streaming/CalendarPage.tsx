"use client";

import React, { useState } from "react";
import { Container, Typography, Box, Grid, TextField, MenuItem, useMediaQuery, ToggleButtonGroup, ToggleButton, Button } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Movie } from "@/data-models/movie.interface";
import { useTheme } from "@mui/material/styles";
import Picker from "@/components/calendar/Picker";
import CalendarDay from "@/components/calendar/CalendarDay";
import ListView from "@/components/calendar/ListView";

dayjs.extend(localizedFormat);

interface Props {
  watchList: Movie[];
}

const CalendarPage = ({ watchList }: Props) => {
  console.log("watchList: ", watchList);

  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs().startOf("month"));
  const [nameFilter, setNameFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month");
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const networks = watchList.flatMap((movie) => movie.networks?.map((p) => p.name) || []);
  const flatRates = watchList.flatMap((movie) => movie.providers?.flatrate?.map((p) => p.provider_name) || []);

  const uniqueProviders = Array.from(new Set([...flatRates, ...networks]));

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");

  const handlePrevMonth = () => setCurrentMonth((prev) => prev.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));

  const daysInMonth = endOfMonth.date();
  const startDay = startOfMonth.day();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const daysArray = Array.from({ length: totalCells }, (_, i) => startOfMonth.startOf("week").add(i, "day"));

  const showsByDate: { [date: string]: Movie[] } = {};

  watchList.forEach((movie) => {
    const airDate = movie?.next_episode_to_air?.air_date || movie?.first_air_date;
    const releaseDate = movie?.release_date || movie?.first_air_date;
    const airDay = dayjs(airDate).format("YYYY-MM-DD");
    if (airDate && dayjs(airDate).isSame(currentMonth, "month")) {
      if (!showsByDate[airDay]) showsByDate[airDay] = [];
      showsByDate[airDay].push(movie);
    }
    const releaseDay = dayjs(releaseDate).format("YYYY-MM-DD");
    if (releaseDay && dayjs(releaseDay).isSame(currentMonth, "month")) {
      if (!showsByDate[releaseDay]) showsByDate[airDay] = [];
      showsByDate[releaseDay].push(movie);
    }
  });

  const filterShow = (show: Movie) => {
    const matchesName = show.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesProvider = !providerFilter || show.providers?.flatrate?.some((p) => p.provider_name === providerFilter);
    return matchesName && matchesProvider;
  };
  
  const visibleDates = viewMode === "week" ? daysArray.slice(currentWeekIndex, currentWeekIndex + 7) : daysArray;

  return (
    <Container sx={{ py: 2 }}>
      <Picker back={handlePrevMonth} forward={handleNextMonth} currentMonth={currentMonth} />

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

      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(e, val) => {
          if (val) {
            setViewMode(val);
            setCurrentWeekIndex(0); // Reset week index when switching view
          }
        }}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="month">Month View</ToggleButton>
        <ToggleButton value="week">Week View</ToggleButton>
        <ToggleButton value="list">List View</ToggleButton>
      </ToggleButtonGroup>

      {viewMode === "week" && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Button onClick={() => setCurrentWeekIndex((i) => Math.max(i - 1, 0))}>Previous Week</Button>
          <Button onClick={() => setCurrentWeekIndex((i) => i + 1)}>Next Week</Button>
        </Box>
      )}

      {viewMode === "list" ? (
        <ListView shows={watchList} />
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
            const shows = (showsByDate[dayKey] || []).filter(filterShow);

            return (
              <Grid size={1} key={dayKey}>
                <CalendarDay shows={shows} day={day} />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default CalendarPage;
