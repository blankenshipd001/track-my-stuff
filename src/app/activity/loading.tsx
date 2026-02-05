import { Container, Box, Skeleton } from "@mui/material";

export default function ActivityLoading() {
  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={50} sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" width={120} height={80} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
