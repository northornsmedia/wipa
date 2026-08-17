import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { resource_id, user_id } = await req.json();
    if (!resource_id) {
      return NextResponse.json({ error: 'Missing resource_id' }, { status: 400 });
    }

    const { error } = await supabase.from('sponsored_clicks').insert({
      resource_id,
      user_id: user_id || null
    });
    
    if (error) {
      console.error('Error logging click:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
