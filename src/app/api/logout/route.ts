import { NextResponse } from 'next/server';

export async function POST() {
  // Create a response
  const response = NextResponse.json({ message: 'Logout successful' });

  // Clear the token cookie by setting it to empty & expired
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0), // expire immediately
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
