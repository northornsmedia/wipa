import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('room_id');

    if (!roomId) {
      return NextResponse.json({ error: 'Missing room_id' }, { status: 400 });
    }

    // SIMULATE MEETN API CALL
    // In a real integration, we would check the Meetn API for the live status of the room.
    
    // For simulation, we'll just check what's in our DB or randomly return a status based on time.
    const { data: resourceData } = await supabase
      .from('resources')
      .select('webinar_status, scheduled_at, duration_minutes')
      .eq('meetn_room_id', roomId)
      .single();

    let status = resourceData?.webinar_status || 'scheduled';

    if (resourceData?.scheduled_at) {
      const scheduledTime = new Date(resourceData.scheduled_at).getTime();
      const now = new Date().getTime();
      const durationMs = (resourceData.duration_minutes || 60) * 60 * 1000;
      
      // Auto-update status based on time for demonstration
      if (now >= scheduledTime && now <= scheduledTime + durationMs) {
        status = 'live';
        // If it just went live and we haven't notified yet, we could trigger a push notification here
        // For demonstration, we'll assume it's live.
      } else if (now > scheduledTime + durationMs) {
        status = 'ended';
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        room_id: roomId,
        status
      }
    });
  } catch (error: any) {
    console.error('Error getting Meetn room status:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
