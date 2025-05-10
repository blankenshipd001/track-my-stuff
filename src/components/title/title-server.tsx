import { Container, Typography } from "@mui/material";

export const Title = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" sx={{ color: "white", textAlign: "center", mt: 2, mb: 0.5, fontSize: { xs: ".8rem", md: "2.5rem" } }}>
        Your watchlists and recommendations—together.
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "white", textAlign: "center", fontSize: { xs: ".6rem", md: "1.25rem" } }}>
        Search a title and see where it’s available to buy, rent, or stream.
      </Typography>
    </Container>
  );
};
