
import { Button, OutlinedInput, styled } from '@mui/material';
import { InputAdornment } from "@mui/material";
import { useMemo, useState } from 'react';
const _ = require('lodash');

const SearchInput = styled(OutlinedInput)`
width: 100%;
`
interface searchBox {
    searchForMovie: (value: string) => void
}

const SearchBox = ({ searchForMovie }: searchBox ): JSX.Element => {
  const throttledSearch = useMemo(
    () =>
      _.debounce(
        (search: string) => {
          searchForMovie(search)
        },
        1200,
        { leading: false, trailing: true }
      ),
    []
  );
  
    return (
      <div className="p-12">
        <div className="pt-2 relative mx-auto text-gray-600">
          <SearchInput
            type="search"
            name="search"
            placeholder="Search title..."
            onChange={(event) => {
              throttledSearch(event.target.value)
            }}
          />
        </div>
      </div>
    );
  };
  
  export default SearchBox;