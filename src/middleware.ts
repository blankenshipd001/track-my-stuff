import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('__session')?.value;
  const isLoggedIn = Boolean(token);

  const isProtected = req.nextUrl.pathname.startsWith('/watched') || req.nextUrl.pathname.startsWith('/movies');

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/watched'],
};