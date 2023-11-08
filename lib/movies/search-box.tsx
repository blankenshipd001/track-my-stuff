import { Button, Input } from '@mui/material';
import { InputAdornment } from "@mui/material";

interface movieSearch {
    searchString: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSearchValue(value: string): any;
}

const MovieSearchBox = ({ searchString, setSearchValue }: movieSearch ): JSX.Element => {
    return (
      <div className="p-12">
        <div className="pt-2 relative mx-auto text-gray-600">
          <Input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Search"
            value={searchString}
            onChange={(event) => setSearchValue(event.target.value)}
            endAdornment={<InputAdornment position='end'><Button> Search</Button> </InputAdornment>}
          />
        </div>
      </div>
    );
  };
  
  export default MovieSearchBox;