import { Container, Typography } from "@mui/material";

const Title = () => {
  return (
    <Container>
        <Typography variant="h4" component="h1" sx={{color: 'white',  textAlign: 'center', mt: 4, mb: 2}} fontSize={{ xs: '1rem', md: '2.5rem'}}>
            Your watchlists and recommendations—together.
        </Typography>
        <Typography variant="subtitle1" sx={{color: 'white', textAlign: 'center'}} fontSize={{ xs: '.75rem', md: '1rem'}}>
            Search a title and see where it’s available to buy, rent, or stream.
        </Typography>
    </Container>
  );
};

export default Title;
