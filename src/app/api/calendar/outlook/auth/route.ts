import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Mock Microsoft OAuth redirect
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const callbackUrl = `${baseUrl}/api/calendar/outlook/callback?code=mock_outlook_code_456`;
  return NextResponse.redirect(callbackUrl);
}
