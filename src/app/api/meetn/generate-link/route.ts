import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const MEETN_ROOMS = [
  { id: 'ROOM1', name: 'ROOM1', url: 'https://meetn.com/room1-2' },
  { id: 'Room2', name: 'Room2', url: 'https://meetn.com/room2-2' },
  { id: 'Room3', name: 'Room3', url: 'https://meetn.com/room3-2' }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scheduled_at, duration_minutes = 60, current_webinar_id } = body;

    const BUFFER_MS = 60 * 60 * 1000; // 60-minute buffer window for extensions/setup
    const requestedStart = scheduled_at ? new Date(scheduled_at).getTime() : Date.now();
    const durationMs = (Number(duration_minutes) || 60) * 60 * 1000;
    const requestedEnd = requestedStart + durationMs + BUFFER_MS;

    // Fetch existing scheduled webinars to check room occupancy
    const { data: existingWebinars } = await supabase
      .from('webinars')
      .select('id, title, scheduled_at, duration_minutes, url, assigned_room, webinar_status')
      .neq('webinar_status', 'ended');

    const occupiedRooms = new Set<string>();

    if (existingWebinars && existingWebinars.length > 0) {
      for (const w of existingWebinars) {
        if (current_webinar_id && w.id === current_webinar_id) continue;
        if (!w.scheduled_at) continue;

        const wStart = new Date(w.scheduled_at).getTime();
        const wDurationMs = (Number(w.duration_minutes) || 60) * 60 * 1000;
        // Each existing webinar locks the room for its duration PLUS the 60-minute buffer
        const wEndWithBuffer = wStart + wDurationMs + BUFFER_MS;

        // Check if there is interval overlap with 60-min buffer: (requestedStart < wEndWithBuffer) && (requestedEnd > wStart)
        if (requestedStart < wEndWithBuffer && requestedEnd > wStart) {
          if (w.assigned_room) occupiedRooms.add(w.assigned_room);
          if (w.url) {
            if (w.url.includes('room1-2')) occupiedRooms.add('ROOM1');
            if (w.url.includes('room2-2')) occupiedRooms.add('Room2');
            if (w.url.includes('room3-2')) occupiedRooms.add('Room3');
          }
        }
      }
    }

    // Auto-assign next available room in sequence: ROOM1 -> Room2 -> Room3
    let assigned = MEETN_ROOMS.find(r => !occupiedRooms.has(r.id) && !occupiedRooms.has(r.name));

    if (!assigned) {
      assigned = MEETN_ROOMS[0];
    }

    return NextResponse.json({
      success: true,
      room_name: assigned.name,
      assigned_room: assigned.name,
      url: assigned.url,
      occupied_rooms: Array.from(occupiedRooms),
      is_conflict_free: !occupiedRooms.has(assigned.id)
    });
  } catch (error: any) {
    console.error('Meetn room allocation error:', error);
    return NextResponse.json({
      success: true,
      room_name: 'ROOM1',
      assigned_room: 'ROOM1',
      url: 'https://meetn.com/room1-2'
    });
  }
}
