import { Skeleton, Container, Paper, Box, Stack } from "@mui/material";

export default function TVDetailsLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
          <Skeleton variant="rectangular" width={120} height={40} />
        </Stack>

        <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
          <Skeleton variant="rectangular" width={300} height={450} sx={{ borderRadius: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={60} />
            <Box sx={{ display: "flex", gap: 1, my: 2 }}>
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
            </Box>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
