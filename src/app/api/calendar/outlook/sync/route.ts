import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Mock syncing to Outlook Calendar
  return NextResponse.json({ success: true, message: 'Synced to Outlook Calendar (Mock)' });
}
