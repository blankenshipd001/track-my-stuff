import { ChangeEvent } from "react";
import { OutlinedInput, InputAdornment, IconButton, styled, debounce } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchInput = styled(OutlinedInput)(() => ({
  width: "100%",
  color: "black",
  backgroundColor: "white",
  border: "1px solid #1A1A1A",
  borderRadius: "25px",
}));

export const SearchBox = ({ searchForMovie }: { searchForMovie: (value: string) => void }): JSX.Element => {
  const debounceSearch = debounce(searchForMovie, 150); // TODO find a good tolerance

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = event.target;
    debounceSearch(value);
  }

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ position: "relative", margin: "auto", width: "100%", maxWidth: "800px" }}>
        <SearchInput
          fullWidth
          type="search"
          name="search"
          placeholder="Search title..."
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton edge="end" aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          sx={{
            "& fieldset": {
              borderColor: "#1A1A1A",
              borderRadius: "25px",
            },
            "& input": {
              padding: "12px",
            },
          }}
        />
      </div>
    </div>
  );
};
