import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: Request) {
  try {
    const { resource_id } = await req.json();
    if (!resource_id) {
      return NextResponse.json({ error: 'Missing resource_id' }, { status: 400 });
    }

    const supabaseClient = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    // We insert whether there is a user or not
    const { error } = await supabase.from('sponsored_clicks').insert({
      resource_id,
      user_id: session?.user?.id || null
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
