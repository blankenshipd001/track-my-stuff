import { Movie } from "@/data-models/movie.interface";
import { Box, Paper, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useMemo, useState } from "react";
import ProviderLogos from "../provider/ProviderLogos";

interface ListViewProps {
  shows: Movie[];
}

const ListView = ({ shows }: ListViewProps) => {
  const [search, setSearch] = useState<string>("");

  const showsByDate = useMemo(() => {
    return shows.reduce((acc: { [date: string]: Movie[] }, show) => {
      const date = show.next_episode_to_air?.air_date || show.first_air_date;
      if (!date) return acc;
      if (!acc[date]) acc[date] = [];
      acc[date].push(show);
      return acc;
    }, {});
  }, [shows]);

  // Helper to normalize strings for fuzzy search (removes accents, special chars, lowercases)
  function normalize(str: string) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^\w\s]/gi, '') // Remove special characters
      .toLowerCase();
  }

  const filteredList = useMemo(() => {
    const normSearch = normalize(search);
    return Object.entries(showsByDate)
      .flatMap(([date, shows]) =>
        shows.map((show) => ({
          ...show,
          airDate: date,
        }))
      )
      .filter((movie) => normalize(movie.name).includes(normSearch));
  }, [showsByDate, search]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField size="small" label="Search by name" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        {filteredList.map((show) => (
          <Paper
            key={`${show.id}-${show.airDate}`}
            sx={{
              p: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
              boxShadow: 2,
              borderRadius: 2,
            }}
          >
            <Image src={`https://image.tmdb.org/t/p/w154${show.poster_path}`} alt={show.name ?? 'image'} width={48} height={72} style={{ borderRadius: 4, flexShrink: 0 }} />
            <Box flexGrow={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                {show.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Airs: {dayjs(show.airDate).format("MMM D, YYYY")}
              </Typography>
              {show?.next_episode_to_air?.name && (
                <Typography variant="body2" color="text.secondary">
                  Episode: {show.next_episode_to_air.name}
                </Typography>
              )}
              {/* Providers as icons */}
              {show.providers?.flatrate?.length > 0 && (
                <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                  <ProviderLogos providers={show.providers} />
                </Box>
              )}
            </Box>
          </Paper>
        ))}
      </Box>
    </>
  );
};

export default ListView;
