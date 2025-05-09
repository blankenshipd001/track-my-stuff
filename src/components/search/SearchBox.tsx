"use client";

import { ChangeEvent, useRef } from "react";
import { OutlinedInput, InputAdornment, IconButton, styled, debounce, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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

export const SearchBox = ({ searchForMovie }: { searchForMovie: (value: string) => void }): JSX.Element => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debounceSearch = debounce(searchForMovie, 300);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    debounceSearch(value); // Fetch first page results
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
              <IconButton edge="end" aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          inputRef={inputRef}
        />
      </Box>
    </Box>
  );
};
