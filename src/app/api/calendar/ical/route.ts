import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function formatDateForICal(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  if (!userId || !token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Verify token
  const { data: profile } = await supabase
    .from('profiles')
    .select('calendar_token')
    .eq('id', userId)
    .single();

  if (!profile || profile.calendar_token !== token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Fetch events
  const { data: events, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return new NextResponse('Error fetching events', { status: 500 });
  }

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WIPA//Calendar Sync//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  events?.forEach(event => {
    const dtstart = formatDateForICal(new Date(event.start_at));
    const dtend = formatDateForICal(new Date(event.end_at));
    const dtstamp = formatDateForICal(new Date(event.created_at || Date.now()));

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:${event.id}@wipa.com`);
    icsContent.push(`DTSTAMP:${dtstamp}`);
    icsContent.push(`DTSTART:${dtstart}`);
    icsContent.push(`DTEND:${dtend}`);
    icsContent.push(`SUMMARY:${event.title}`);
    if (event.description) icsContent.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);
    if (event.location) icsContent.push(`LOCATION:${event.location}`);
    if (event.meeting_url) icsContent.push(`URL:${event.meeting_url}`);
    icsContent.push('END:VEVENT');
  });

  icsContent.push('END:VCALENDAR');

  return new NextResponse(icsContent.join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="wipa-calendar.ics"'
    }
  });
}
