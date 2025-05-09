// /app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the session cookie
  response.cookies.set('__session', '', {
    path: '/',
    maxAge: 0, // Expire immediately
  });

  return response;
}