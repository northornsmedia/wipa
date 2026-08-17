import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // 1. Find webinars that are marked as 'ended' but have no recordings yet (or just any 'ended' webinar to sync)
    // Actually, we need to add `meetn_recordings` column first, but for now we'll just simulate the check
    const { data: endedWebinars } = await supabase
      .from('resources')
      .select('id, meetn_room_id, webinar_status')
      .eq('webinar_status', 'ended');

    if (!endedWebinars || endedWebinars.length === 0) {
      return NextResponse.json({ success: true, message: 'No ended webinars to sync.' });
    }

    // 2. Poll Meetn API for recordings for each
    const updates = [];
    for (const w of endedWebinars) {
      if (w.meetn_room_id) {
        // We call our own API or Meetn directly
        // For simulation, we assume they all have a generic recording URL
        const mockRecordings = [
          {
            id: `rec_${w.meetn_room_id}_1`,
            url: `https://meetn.com/recording/${w.meetn_room_id}`,
            duration_seconds: 3600,
            created_at: new Date().toISOString()
          }
        ];
        
        // We would save to DB here if we added a `meetn_recordings` JSONB column.
        updates.push({ id: w.id, recordings: mockRecordings });
      }
    }

    return NextResponse.json({
      success: true,
      synced_count: updates.length,
      updates
    });
  } catch (error: any) {
    console.error('Error in sync-recordings cron:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
