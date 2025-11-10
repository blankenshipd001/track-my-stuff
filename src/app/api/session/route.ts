import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(req: Request) {
  const { token } = await req.json();

  const decoded = await adminAuth.verifyIdToken(token);
  
  if (!decoded.email_verified) {
    return NextResponse.json({ error: 'Email not verified' }, { status: 401 });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn });

  const c = await cookies();
  c.set({
    name: '__session',
    value: sessionCookie,
    httpOnly: true, 
    secure: true,
    path: '/',
    maxAge: expiresIn / 1000,
  });

  return NextResponse.json({ status: 'success' });
}