import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('room_id');

    if (!roomId) {
      return NextResponse.json({ error: 'Missing room_id' }, { status: 400 });
    }

    // SIMULATE MEETN API CALL
    // In a real integration, we would fetch recordings for the ended room from Meetn API.
    
    const mockRecordings = [
      {
        id: `rec_${roomId}_1`,
        url: `https://meetn.com/recording/${roomId}`,
        duration_seconds: 3600,
        created_at: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        room_id: roomId,
        recordings: mockRecordings
      }
    });
  } catch (error: any) {
    console.error('Error fetching Meetn recordings:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
