'use client';

import { auth, googleProvider } from '@/lib/firebase/config';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();

    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    router.push('/');
    router.refresh();
  };

  return (
    <Container maxWidth="sm">
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Stack spacing={4} alignItems="center" width="100%">
          <Typography variant="h4" color="white" textAlign="center">
            Sign in to continue
          </Typography>

          <Button
            onClick={handleLogin}
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              backgroundColor: '#fff',
              color: '#000',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#f1f1f1',
              },
              width: '100%',
              maxWidth: 320,
              boxShadow: 2,
              fontWeight: 500,
            }}
          >
            Sign in with Google
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
