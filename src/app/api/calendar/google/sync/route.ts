import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Mock syncing to Google Calendar
  // In a real app, this would use googleapis and the stored google_access_token
  return NextResponse.json({ success: true, message: 'Synced to Google Calendar (Mock)' });
}
