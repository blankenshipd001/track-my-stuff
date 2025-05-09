'use client';

import { auth, googleProvider } from '@/lib/firebase/config';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button, Container, Typography } from '@mui/material';

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

    router.refresh();
    router.push('/');
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <Button variant="contained" onClick={handleLogin}>Sign in with Google</Button>
    </Container>
  );
}