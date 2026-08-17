import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, scheduled_at, duration_minutes, host_user_id } = body;

    if (!title || !scheduled_at || !host_user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // SIMULATE MEETN API CALL
    // In a real integration, we would call the Meetn API here using MEETN_API_KEY
    const mockRoomId = `meetn_room_${uuidv4().substring(0, 8)}`;
    const mockRoomUrl = `https://meetn.com/room/${mockRoomId}`;
    const mockHostUrl = `https://meetn.com/host/${mockRoomId}?token=mock_token_123`;

    // Save to database
    // We assume the resource row was already created and we just need to update it,
    // OR we create a new resource row if resource_id is not provided.
    // The instructions say "saves to DB", so let's insert a new resource if not provided.
    const { data: resourceData, error: resourceError } = await supabase
      .from('resources')
      .insert({
        title,
        type: 'webinar',
        category: 'Live Event',
        url: mockRoomUrl,
        author_id: host_user_id,
        meetn_room_id: mockRoomId,
        meetn_room_url: mockRoomUrl,
        meetn_host_url: mockHostUrl,
        webinar_status: 'scheduled',
        webinar_platform: 'meetn',
        scheduled_at,
        duration_minutes: duration_minutes || 60
      })
      .select()
      .single();

    if (resourceError) {
      console.error('Error saving webinar to DB:', resourceError);
      return NextResponse.json({ error: 'Failed to save to database' }, { status: 500 });
    }

    // Insert notification to all users (simplification for "WIPA members/followers")
    // In a real app we might insert a notification to the followers of the host or just broadcast it
    // For demo, we just create one generic broadcast or skip if too expensive. Let's do a single system broadcast if supported, 
    // or just insert to 'feed_posts' so it appears on the platform feed!
    const { error: postError } = await supabase.from('feed_posts').insert({
      author_id: host_user_id,
      content: `I'm hosting a new webinar: **${title}**. Register now!`,
      type: 'post'
    });
    
    return NextResponse.json({
      success: true,
      data: {
        resource_id: resourceData.id,
        room_id: mockRoomId,
        room_url: mockRoomUrl,
        host_url: mockHostUrl
      }
    });
  } catch (error: any) {
    console.error('Error creating Meetn room:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
