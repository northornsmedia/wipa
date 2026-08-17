import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Mock Google OAuth redirect
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const callbackUrl = `${baseUrl}/api/calendar/google/callback?code=mock_google_code_123`;
  return NextResponse.redirect(callbackUrl);
}
