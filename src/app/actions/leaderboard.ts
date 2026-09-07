'use server';

import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function getGlobalLeaderboardAction() {
  try {
    const supabase = getSupabaseServerClient();
    const { data: leaderData, error: leaderError } = await supabase
      .from('member_xp')
      .select(`
        *,
        profile:profiles (
          id,
          full_name,
          avatar_url,
          role,
          company,
          country,
          practice_area,
          membership_tier,
          verification_status
        )
      `)
      .order('total_xp', { ascending: false })
      .limit(100);

    if (leaderError) {
      console.error('Server Action getGlobalLeaderboardAction error:', leaderError);
      return { success: false, data: [] };
    }

    const validLeaders = (leaderData || []).filter(l => l.profile && l.profile.full_name);
    return { success: true, data: validLeaders };
  } catch (err: any) {
    console.error('Server Action getGlobalLeaderboardAction exception:', err);
    return { success: false, data: [] };
  }
}
