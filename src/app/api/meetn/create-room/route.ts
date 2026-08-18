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

    // Check if creator is admin or regular user
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', host_user_id)
      .single();

    const isUserAdmin = Boolean(profile?.is_admin);
    const initialApprovalStatus = isUserAdmin ? 'approved' : 'pending';

    const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Save directly to dedicated webinars table
    const { data: webinarData, error: webinarError } = await supabase
      .from('webinars')
      .insert({
        title,
        slug: `${cleanSlug}-${Date.now()}`,
        category: 'webinars',
        resource_type: 'Upcoming Webinar',
        type: 'webinar',
        url: mockRoomUrl,
        author_id: host_user_id,
        meetn_room_id: mockRoomId,
        meetn_room_url: mockRoomUrl,
        meetn_host_url: mockHostUrl,
        webinar_status: 'upcoming',
        webinar_platform: 'meetn',
        approval_status: initialApprovalStatus,
        scheduled_at,
        duration_minutes: duration_minutes || 60
      })
      .select()
      .single();

    if (webinarError) {
      console.error('Error saving webinar to DB:', webinarError);
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
        resource_id: webinarData?.id,
        webinar_id: webinarData?.id,
        room_id: mockRoomId,
        room_url: mockRoomUrl,
        host_url: mockHostUrl,
        approval_status: initialApprovalStatus
      }
    });
  } catch (error: any) {
    console.error('Error creating Meetn room:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
