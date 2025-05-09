'use client';

import { ChangeEvent, useState, useRef } from 'react';
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  styled,
  debounce,
  Popper,
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { fetchByTitle } from '@/lib/fetchByTitle';
import { Movie } from '@/data-models/movie.interface';

const SearchInput = styled(OutlinedInput)(({ theme }) => ({
  width: '100%',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '25px',
  '& fieldset': {
    borderColor: theme.palette.divider,
    borderRadius: '25px',
  },
  '& input': {
    padding: '12px',
  },
}));

export const MobileSearchBox = () => {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const theme = useTheme();

  const searchMovies = async (value: string, page: number = 1) => {
    if (!value.trim()) return setResults([]);
    setLoading(true);
    try {
      const { allContent } = await fetchByTitle(value); // Fetch results based on title and page
      if (page === 1) {
        setResults(allContent.slice(0, 5)); // Limit to top 5 results on first page
      } else {
        setResults((prevResults) => [
          ...prevResults,
          ...allContent.slice((page - 1) * 5, page * 5), // Append new results for subsequent pages
        ]);
      }
    } catch (e) {
      console.error('Failed to fetch movies:', e);
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = debounce(searchMovies, 300);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPage(1); // Reset page to 1 when the input changes
    debounceSearch(value, 1); // Fetch first page results
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (movie: Movie) => {
    setResults([]);
    router.push(`/movies/${movie.id}`);
  };

  const loadMore = async () => {
    if (loadingMore || !results.length) return;
    setLoadingMore(true);
    setPage((prev) => prev + 1); // Increment the page number
    try {
      const newPage = page + 1; // Fetch next page
      const { allContent } = await fetchByTitle(inputRef.current?.value || '');
      setResults((prevResults) => [
        ...prevResults,
        ...allContent.slice((newPage - 1) * 5, newPage * 5), // Append the new results for the next page
      ]);
    } catch (e) {
      console.error('Failed to fetch more movies:', e);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLDivElement; // Cast to HTMLDivElement
    const bottom = target.scrollHeight === target.scrollTop + target.clientHeight;
    if (bottom) loadMore();
  };

  return (
    <Box px={2} display="flex" justifyContent="center">
      <Box width="100%" maxWidth="800px">
        <SearchInput
          fullWidth
          type="search"
          placeholder="Search title..."
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <IconButton edge="end" aria-label="search">
                  <SearchIcon />
                </IconButton>
              )}
            </InputAdornment>
          }
          inputRef={inputRef}
        />
        <Popper
          open={results.length > 0}
          anchorEl={anchorEl}
          placement="bottom-start"
          style={{
            zIndex: 1300,
            width: inputRef.current?.offsetWidth || 300, // Match the width of the input field
            left: anchorEl ? `${anchorEl.getBoundingClientRect().left}px` : undefined, // Align to the left of the input
          }}
        >
          <Paper
            elevation={4}
            sx={{
              mt: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              maxHeight: '400px',
              overflowY: 'auto',
            }}
            onScroll={handleScroll}
          >
            <List dense disablePadding>
              {results.map((movie) => (
                <ListItemButton key={movie.id} onClick={() => handleSelect(movie)}>
                  <ListItemAvatar sx={{ minWidth: 64 }}>
                    <Avatar
                      variant="rounded"
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      sx={{ width: 56, height: 84 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        <Typography variant="body1">{movie.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({new Date(movie.release_date).getFullYear()})
                        </Typography>
                      </>
                    }
                    primaryTypographyProps={{ noWrap: true, ml: 1 }}
                  />
                </ListItemButton>
              ))}
            </List>
            {loadingMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                <CircularProgress size={20} />
              </Box>
            )}
          </Paper>
        </Popper>
      </Box>
    </Box>
  );
};