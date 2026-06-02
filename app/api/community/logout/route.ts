import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(
    new URL('/comunidad', process.env.NEXT_PUBLIC_SITE_URL || 'https://tudominio.com')
  );

  response.cookies.set('member-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
    expires: new Date(0),
  });

  return response;
}

export async function POST() {
  const response = NextResponse.json({ success: true, redirect: '/comunidad' });

  response.cookies.set('member-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
    expires: new Date(0),
  });

  return response;
}
