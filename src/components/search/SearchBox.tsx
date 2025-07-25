"use client";

import { ChangeEvent, useRef, useState } from "react";
import { OutlinedInput, InputAdornment, IconButton, styled, Box, Paper, List, ListItem, ListItemText, Avatar, ClickAwayListener, useTheme, ListItemButton } from "@mui/material";
import { debounce } from "@mui/material/utils";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { addToWatchList } from "@/utils/api/contentApi";
import { BookmarkAdd } from "@mui/icons-material";
import { fetchByTitle } from "@/lib/fetchByTitle";
import { useRouter } from "next/navigation";
import useNotificationBar from "@/components/notifications/useNotificationBar";
import { Media } from "@/data-models/media.interface";

const SearchInput = styled(OutlinedInput)(({ theme }) => ({
  width: "100%",
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: "25px",
  "& fieldset": {
    borderColor: theme.palette.divider,
    borderRadius: "25px",
  },
  "& input": {
    padding: "12px",
  },
}));

interface SearchBoxProps {
  user?: { uid: string; email?: string } | null;
}

export const SearchBox = ({ user: userProp }: SearchBoxProps): JSX.Element => {
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState<Media[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();

  // Debounced search handler using MUI debounce
  const debouncedSearch = useRef(
    debounce(async (value: string) => {
      if (!value) {
        setDropdownOptions([]);
        setDropdownOpen(false);
        return;
      }
      try {
        const { moviesContent, tvContent } = await fetchByTitle(value);
        const movies = moviesContent.map(m => ({ ...m, type: "movie" }));
        const tv = tvContent.map(m => ({ ...m, type: "tv" }));
        const all = [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
        setDropdownOptions(all);
        setShowAll(false);
        setDropdownOpen(all.length > 0);
      } catch (err) {
        enqueueNotificationBar(`Error: ${err}`, "error");
      }
    }, 200)
  ).current;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchValue("");
    setDropdownOptions([]);
    setDropdownOpen(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Box px={2} display="flex" justifyContent="center">
      <Box width="100%" maxWidth="800px" position="relative">
        <SearchInput
          fullWidth
          type="search"
          placeholder="Search title..."
          value={searchValue}
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end" sx={{ pr: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <IconButton edge="end" aria-label="search" tabIndex={-1} disabled>
                  <SearchIcon />
                </IconButton>
                {searchValue && (
                  <IconButton edge="end" aria-label="clear" onClick={handleClear} sx={{ ml: 0 }}>
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
            </InputAdornment>
          }
          inputRef={inputRef}
        />
        {dropdownOpen && (
          <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
            <Paper
              elevation={4}
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                mt: 1,
                borderRadius: 3,
                boxShadow: 3,
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                fontSize: 18,
                zIndex: 10,
                maxHeight: 650,
                overflowY: "auto",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <List disablePadding>
                {(showAll ? dropdownOptions : dropdownOptions.slice(0, 5)).map((option: Media) => (
                  <ListItem
                    key={option.id}
                    alignItems="flex-start"
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      px: 2,
                      py: 1,
                      backgroundColor: "transparent",
                      transition: "background 0.2s",
                      "&:hover, &:focus": {
                        backgroundColor: theme.palette.action.hover,
                      },
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", flex: 1, alignItems: "flex-start", cursor: "pointer" }}
                      onClick={() => {
                        setDropdownOpen(false);
                        if (option.type === "movie") {
                          router.push(`/movies/${option.movieId}`);
                        } else if (option.type === "tv") {
                          router.push(`/tv/${option.movieId}`);
                        }
                      }}
                    >
                      <Avatar src={option.poster_path ? `https://image.tmdb.org/t/p/w92${option.poster_path}` : undefined} variant="rounded" sx={{ mr: 2, width: 48, height: 72, borderRadius: 2 }} />
                      <ListItemText
                        slotProps={{
                          primary: {
                            sx: {
                              fontWeight: 600,
                              fontSize: 17,
                              color: theme.palette.text.primary,
                            },
                          },
                          secondary: {
                            sx: {
                              color: theme.palette.text.secondary,
                              fontSize: 15,
                            },
                          },
                        }}
                        primary={option.title || option.name}
                        secondary={option.type === "movie" ? "Movie" : "TV Show"}
                      />
                    </Box>
                    <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
                      {(userProp?.uid) && (
                        <BookmarkAdd
                          sx={{ cursor: "pointer", color: "lightgrey", "&:hover": { color: "#782FEF" } }}
                          onClick={async (e: React.MouseEvent) => {
                            e.stopPropagation();
                            try {
                              await addToWatchList((userProp?.uid) as string, option);
                              enqueueNotificationBar("Added to watchlist!", "success");
                            } catch (err) {
                              enqueueNotificationBar("Failed to add to watchlist", "error");
                            }
                          }}
                        />
                      )}
                    </Box>
                  </ListItem>
                ))}
                {dropdownOptions.length > 5 && !showAll && (
                  <ListItemButton sx={{ justifyContent: 'center', py: 1 }} onClick={() => setShowAll(true)}>
                    Show more
                  </ListItemButton>
                )}
              </List>
            </Paper>
          </ClickAwayListener>
        )}
      </Box>
      {NotificationBarComponent}
    </Box>
  );
};
