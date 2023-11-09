
import { OutlinedInput, styled } from '@mui/material';
import { useMemo } from 'react';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require('lodash');

const SearchInput = styled(OutlinedInput)`
width: 100%;
background: white;
    color: black;
    border: 1px solid black;
    border-radius: 25px;
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
        300,
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(event: any) => {
              throttledSearch(event.target.value)
            }}
          />
        </div>
      </div>
    );
  };
  
  export default SearchBox;