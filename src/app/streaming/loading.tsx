import { Container, Box, Skeleton } from "@mui/material";

export default function StreamingLoading() {
  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Skeleton variant="text" width={250} height={50} sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: 1 }} />
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {[...Array(35)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
          ))}
        </Box>
      </Box>
    </Container>
  );
}
