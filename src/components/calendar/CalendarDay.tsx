import { Movie } from "@/data-models/movie.interface";
import { Box, Paper, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import { useState } from "react";
import SelectionDialog from "./SelectionDialog";

interface CalendarDayProps {
  shows: Movie[];
  day: Dayjs;
}

const CalendarDay = ({ shows, day }: CalendarDayProps) => {
  const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null);
  const [selectedShows, setSelectedShows] = useState<Movie[]>([]);
  const [currentMonth] = useState<Dayjs>(dayjs().startOf("month"));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const imageWidth = isMobile ? 36 : 48;
  const imageHeight = isMobile ? 54 : 72;

  const isCurrentMonth = day.month() === currentMonth.month();

  const handleDayClick = (shows: Movie[], day: Dayjs) => {
    setSelectedDay(day);
    setSelectedShows(shows);
  };

  const handleCloseDialog = () => setSelectedDay(null);

  return (
    <>
      <Paper
        onClick={() => shows.length > 0 && handleDayClick(shows, day)}
        elevation={1}
        sx={{
          backgroundColor: isCurrentMonth ? "#1f1f1f" : "#121212",
          borderRadius: 1,
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: isMobile ? 150 : 180, // increase as needed
          p: 1,
          cursor: shows.length > 0 ? "pointer" : "default",
          overflow: "hidden",
          transition: "background-color 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: shows.length > 0 ? "rgba(255, 255, 255, 0.08)" : "inherit",
          },
        }}
      >
        <Typography variant="caption" color={isCurrentMonth ? "gray" : "#555"} display="block" textAlign="right">
          {day.date()}
        </Typography>
        {shows.slice(0, 4).map((show, idx) => (
          <Tooltip key={idx} title={show.name}>
            <Box sx={{ display: "inline-block", mr: 0.5 }}>
              <Image loading="lazy" src={`https://image.tmdb.org/t/p/w185${show.poster_path}`} alt={show.name} width={imageWidth} height={imageHeight} style={{ borderRadius: 4 }} />
            </Box>
          </Tooltip>
        ))}
        {shows.length > 4 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            +{shows.length - 4} more
          </Typography>
        )}
      </Paper>

      {selectedDay && 
        <SelectionDialog selectedDay={selectedDay} selectedShows={selectedShows} handleCloseDialog={handleCloseDialog} />}
    </>
  );
};

export default CalendarDay;
