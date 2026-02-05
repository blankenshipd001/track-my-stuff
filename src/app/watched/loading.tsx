import { Container, Box, Skeleton, Typography } from "@mui/material";

export default function WatchedLoading() {
  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={50} sx={{ mb: 3 }} />
        
        <Typography variant="h5" gutterBottom>
          <Skeleton width={150} />
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2, mb: 6 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
