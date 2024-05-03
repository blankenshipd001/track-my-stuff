import { Container, Typography, Link } from "@mui/material";

const AboutPage = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        About
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: 'white' }}>
        This website is built with React and Material-UI.
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: 'white' }}>
        © 2024:
        <a href="https://github.com/blankenshipd001">
          Code-Monkey
        </a>
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: 'white' }}>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
        <br />
        This product uses the Just Watch API but is not endorsed or certified by Just Watch.
      </Typography>
      {/* <Typography variant="body1" paragraph>
        Icons made by{" "}
        <Link href="https://www.flaticon.com/authors/freepik" target="_blank" rel="noopener noreferrer">
          Freepik
        </Link>{" "}
        from{" "}
        <Link href="https://www.flaticon.com/" target="_blank" rel="noopener noreferrer">
          www.flaticon.com
        </Link>{" "}
        and{" "}
        <Link href="https://fontawesome.com/" target="_blank" rel="noopener noreferrer">
          Font Awesome
        </Link>
        .
      </Typography> */}
      {/* <Typography variant="body1" paragraph>
        Disclaimer: This is a fictional website created for demonstration purposes only.
      </Typography> */}
    </Container>
  );
};

export default AboutPage;
