import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

// Helper to calculate level based on XP (100 XP = 1 Level)
const calculateLevel = (totalXp: number) => {
  return Math.floor(totalXp / 100) + 1;
};

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const body = await request.json();
    const { userId, xpAmount, reason, referenceId } = body;

    if (!userId || !xpAmount || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Insert into xp_transactions
    const { error: txError } = await supabase.from('xp_transactions').insert({
      user_id: userId,
      xp_amount: xpAmount,
      reason,
      reference_id: referenceId
    });

    if (txError) throw txError;

    // 2. Fetch current member_xp
    const { data: currentXp, error: xpFetchError } = await supabase
      .from('member_xp')
      .select('total_xp')
      .eq('user_id', userId)
      .single();

    let newTotalXp = xpAmount;
    
    if (xpFetchError && xpFetchError.code !== 'PGRST116') {
      throw xpFetchError;
    }

    if (currentXp) {
      newTotalXp = currentXp.total_xp + xpAmount;
    }

    const newLevel = calculateLevel(newTotalXp);

    // 3. Upsert member_xp
    const { error: upsertError } = await supabase
      .from('member_xp')
      .upsert({
        user_id: userId,
        total_xp: newTotalXp,
        level: newLevel,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (upsertError) throw upsertError;

    // Send level up notification if leveled up
    if (currentXp && newLevel > calculateLevel(currentXp.total_xp)) {
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'level_up',
        title: 'Level Up!',
        message: `🎉 You've reached Level ${newLevel}! Keep going!`,
        link: '/platform/leaderboard'
      });
    }

    // 4. Check for achievement unlocks
    // Fetch all achievements
    const { data: achievements } = await supabase.from('achievements').select('*');
    
    // Fetch user's current unlocked achievements
    const { data: unlocked } = await supabase.from('member_achievements').select('achievement_id').eq('user_id', userId);
    const unlockedIds = unlocked?.map(a => a.achievement_id) || [];

    const newUnlocks = [];

    if (achievements) {
      for (const achievement of achievements) {
        if (!unlockedIds.includes(achievement.id)) {
          // Check if condition is met
          // Basic threshold-based check
          let conditionMet = false;

          if (achievement.name === 'IP Scholar' && newTotalXp >= 100) conditionMet = true;
          if (achievement.name === 'Patent Pro' && newTotalXp >= 500) conditionMet = true;
          if (achievement.name === 'WIPA Legend' && newTotalXp >= 2000) conditionMet = true;

          // Note: Other achievements like "First Post", "Connector" might need specific checks based on the `reason`
          if (achievement.name === 'Quiz Newbie' && reason.includes('Quiz')) conditionMet = true;
          if (achievement.name === 'First Post' && reason === 'First Post') conditionMet = true;
          if (achievement.name === 'Profile Complete' && reason === 'Profile Complete') conditionMet = true;
          if (achievement.name === 'Event Goer' && reason === 'Event Registration') conditionMet = true;

          if (conditionMet) {
            newUnlocks.push(achievement);
            await supabase.from('member_achievements').insert({
              user_id: userId,
              achievement_id: achievement.id
            });
            // Send notification
            await supabase.from('notifications').insert({
              user_id: userId,
              type: 'achievement',
              title: 'Achievement Unlocked!',
              message: `🏆 You've earned the ${achievement.name} badge!`,
              link: '/platform/leaderboard'
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        total_xp: newTotalXp,
        level: newLevel,
        new_achievements: newUnlocks
      }
    });
  } catch (error: any) {
    console.error('Error awarding XP:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
