import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { mentorId, menteeId, objective, format, preferredDate, preferredTime, message } = await req.json();

    if (!mentorId || !objective || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const resolvedMenteeId = menteeId || 'f6e418d5-19b7-490b-8b0e-fbcdcfa5ac36';

    // 1. Fetch mentor profile
    const { data: mentor } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, company')
      .eq('id', mentorId)
      .maybeSingle();

    // 2. Fetch mentee profile
    const { data: mentee } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, company')
      .eq('id', resolvedMenteeId)
      .maybeSingle();

    // 3. Create a calendar event for the requested mentorship session
    const sessionDate = preferredDate ? new Date(preferredDate) : new Date(Date.now() + 86400000 * 3);
    const startIso = sessionDate.toISOString();
    const endIso = new Date(sessionDate.getTime() + 45 * 60000).toISOString();

    const { data: calEvent } = await supabase
      .from('calendar_events')
      .insert({
        user_id: resolvedMenteeId,
        title: `1:1 Mentorship Session: ${mentor?.full_name || 'Mentor'} & ${mentee?.full_name || 'Mentee'}`,
        description: `Objective: ${objective}\nFormat: ${format || '30-min Strategy Call'}\nMentee Note: ${message}`,
        start_time: startIso,
        end_time: endIso,
        event_type: 'mentorship',
        location: 'WIPA Video Meeting Room',
        color: '#5a32fa'
      })
      .select()
      .maybeSingle();

    // 4. Create notification for mentor
    await supabase
      .from('notifications')
      .insert({
        user_id: mentorId,
        actor_id: resolvedMenteeId,
        type: 'mentorship_request',
        content: `${mentee?.full_name || 'A WIPA Member'} requested a 1:1 mentorship session regarding "${objective}".`,
        link: '/platform/mentorship'
      });

    return NextResponse.json({
      success: true,
      requestId: calEvent?.id || `req_${Date.now()}`,
      mentorName: mentor?.full_name || 'Mentor',
      menteeName: mentee?.full_name || 'Mentee',
      scheduledAt: startIso
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
