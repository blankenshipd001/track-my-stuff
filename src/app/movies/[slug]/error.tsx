'use client'

import { Container, Paper, Box, Typography, Button, Stack } from '@mui/material';
import { useEffect } from 'react';
import { BORDER_RADIUS, SHADOWS, GRADIENTS } from '@/lib/theme-constants';

export default function MovieDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Movie details page error:', error)
  }, [error])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: BORDER_RADIUS.lg,
          background: GRADIENTS.card,
          backdropFilter: 'blur(10px)',
          boxShadow: SHADOWS.dark,
          border: '1px solid rgba(192, 132, 252, 0.15)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ color: '#ff6b6b', mb: 2, fontWeight: 'bold' }}>
          Oops! Something went wrong
        </Typography>

        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
          We encountered an error while loading this movie. Please try again.
        </Typography>

        {error.message && (
          <Box
            sx={{
              p: 2,
              mb: 3,
              bgcolor: 'rgba(255, 107, 107, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(255, 107, 107, 0.3)',
              textAlign: 'left',
            }}
          >
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', wordBreak: 'break-word' }}>
              {error.message}
            </Typography>
          </Box>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            onClick={reset}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            Try again
          </Button>

          <Button
            variant="outlined"
            href="/"
            sx={{
              borderColor: 'rgba(102, 126, 234, 0.5)',
              color: 'rgba(102, 126, 234, 1)',
              '&:hover': {
                borderColor: 'rgba(102, 126, 234, 1)',
                bgcolor: 'rgba(102, 126, 234, 0.1)',
              },
            }}
          >
            Go home
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}
