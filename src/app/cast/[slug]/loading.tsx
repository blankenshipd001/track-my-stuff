import { Box, Container, Skeleton, Paper } from '@mui/material';

export default function CastMemberLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section Skeleton */}
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.05)',
          mb: 4,
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 1fr', md: '200px 1fr' }, gap: 3 }}>
          {/* Profile Picture Skeleton */}
          <Box>
            <Skeleton
              variant="rectangular"
              sx={{
                aspectRatio: '2 / 3',
                borderRadius: 2,
                backgroundColor: 'rgba(192, 132, 252, 0.1)',
              }}
            />
          </Box>

          {/* Profile Info Skeleton */}
          <Box>
            <Skeleton
              variant="text"
              sx={{
                fontSize: '2rem',
                mb: 2,
                backgroundColor: 'rgba(192, 132, 252, 0.1)',
              }}
              width="60%"
            />
            <Skeleton
              variant="rounded"
              width="30%"
              height={32}
              sx={{
                mb: 2,
                backgroundColor: 'rgba(192, 132, 252, 0.1)',
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                mb: 1,
                backgroundColor: 'rgba(192, 132, 252, 0.1)',
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                mb: 1,
                backgroundColor: 'rgba(192, 132, 252, 0.1)',
              }}
            />
            <Skeleton
              variant="text"
              width="50%"
              sx={{
                backgroundColor: 'rgba(192, 132, 252, 0.1)',
              }}
            />
          </Box>
        </Box>

        {/* Biography Skeleton */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(75, 85, 99, 0.3)' }}>
          <Skeleton
            variant="text"
            width="20%"
            sx={{
              mb: 2,
              fontSize: '1.5rem',
              backgroundColor: 'rgba(192, 132, 252, 0.1)',
            }}
          />
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="text"
              sx={{
                mb: 1,
                backgroundColor: 'rgba(192, 132, 252, 0.1)',
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Filmography Title Skeleton */}
      <Skeleton
        variant="text"
        width="30%"
        sx={{
          mb: 3,
          fontSize: '1.5rem',
          backgroundColor: 'rgba(192, 132, 252, 0.1)',
        }}
      />

      {/* Filmography Grid Skeleton */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Box key={i}>
            <Skeleton
              variant="rectangular"
              sx={{
                aspectRatio: '2 / 3',
                borderRadius: 1,
                backgroundColor: 'rgba(192, 132, 252, 0.1)',
              }}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
}
