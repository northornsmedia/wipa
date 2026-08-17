import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect('/platform/calendar?error=missing_code');
  }

  // Get current session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    // Save mock tokens to profile
    await supabase.from('profiles').update({
      google_access_token: 'mock_google_access_token',
      google_refresh_token: 'mock_google_refresh_token'
    }).eq('id', session.user.id);
  }

  // Redirect back to calendar
  return NextResponse.redirect(new URL('/platform/calendar?sync=google_success', request.url));
}
