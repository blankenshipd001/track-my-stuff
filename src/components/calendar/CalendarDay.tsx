"use client";
import { Media } from "@/data-models/media.interface";
import { Box, Paper, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import { getProxyImageUrlForPath } from '@/lib/imageUrl';
import { useState } from "react";
import SelectionDialog from "./SelectionDialog";

interface CalendarDayProps {
  shows: Media[];
  day: Dayjs;
  isToday?: boolean;
}

const CalendarDay = ({ shows, day, isToday = false }: CalendarDayProps) => {
  const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null);
  const [selectedShows, setSelectedShows] = useState<Media[]>([]);
  const [currentMonth] = useState<Dayjs>(dayjs().startOf("month"));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const imageWidth = isMobile ? 36 : 48;
  const imageHeight = isMobile ? 54 : 72;

  const isCurrentMonth = day.month() === currentMonth.month();

  const handleDayClick = (shows: Media[], day: Dayjs) => {
    setSelectedDay(day);
    setSelectedShows(shows);
  };

  const handleCloseDialog = () => setSelectedDay(null);

  return (
    <>
      <Paper
        onClick={() => shows.length > 0 && handleDayClick(shows, day)}
        elevation={isToday ? 6 : 1}
        sx={{
          backgroundColor: isToday
            ? theme.palette.primary.light
            : isCurrentMonth
              ? "#1f1f1f"
              : "#121212",
          borderRadius: 2,
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: isMobile ? 150 : 180,
          p: 1,
          cursor: shows.length > 0 ? "pointer" : "default",
          overflow: "hidden",
          transition: "background-color 0.2s ease-in-out",
          border: isToday ? '3px double ' + theme.palette.primary.dark : undefined,
          boxShadow: isToday ? 8 : 1,
          "&:hover": {
            backgroundColor: shows.length > 0 ? "rgba(255, 255, 255, 0.08)" : "inherit",
          },
        }}
      >
        <Typography
          variant="caption"
          color={isToday ? theme.palette.primary.dark : isCurrentMonth ? "gray" : "#555"}
          display="block"
          textAlign="right"
          fontWeight={isToday ? 'bold' : undefined}
        >
          {day.date()}
        </Typography>
        {shows.slice(0, 4).map((show, idx) => (
          <Tooltip key={idx} title={show.name}>
            <Box sx={{ display: "inline-block", mr: 0.5 }}>
              {show.poster_path ? (
                <Image loading="lazy" src={getProxyImageUrlForPath(show.poster_path, 'w185')!} alt={show.name ?? 'image'} width={imageWidth} height={imageHeight} style={{ borderRadius: 4 }} />
              ) : null}
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
