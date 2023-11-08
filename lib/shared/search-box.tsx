
import { Button, OutlinedInput, styled } from '@mui/material';
import { InputAdornment } from "@mui/material";
import { useState } from 'react';


const SearchInput = styled(OutlinedInput)`
width: 100%;
`
interface searchBox {
    searchForMovie: (value: string) => void
}

const SearchBox = ({ searchForMovie }: searchBox ): JSX.Element => {
  const [searchValue, setSearchString] = useState("");
    return (
      <div className="p-12">
        <div className="pt-2 relative mx-auto text-gray-600">
          <SearchInput
            type="search"
            name="search"
            placeholder="Search title..."
            value={searchValue}
            onChange={(event) => setSearchString(event.target.value)}
            endAdornment={<InputAdornment position='end'><Button color='primary' onClick={() => searchForMovie(searchValue)}> Search</Button> </InputAdornment>}
          />
        </div>
      </div>
    );
  };
  
  export default SearchBox;