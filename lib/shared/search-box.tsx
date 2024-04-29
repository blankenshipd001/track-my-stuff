
import { OutlinedInput, styled } from '@mui/material';
import { ChangeEvent } from 'react';

const SearchInput = styled(OutlinedInput)(() => ({
  width: "100%",
  color: "black",
  backgroundColor: "white",
  border: "1px solid #1A1A1A",
  borderRadius: "25px"
}));

interface searchBox {
  searchForMovie: (value: string) => void
}

// TODO: Fix this to be more inline with MUI using containers so it flows for mobile
const SearchBox = ({ searchForMovie }: searchBox ): JSX.Element => {
    return (
      <div className="p-4">
        <div className="pt-2 relative mx-auto text-gray-600">
          <SearchInput
            type="search"
            name="search"
            placeholder="Search title..."
              onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                searchForMovie(event.target.value)
            }}
          />
        </div>
      </div>
    );
  };
  
  export default SearchBox;