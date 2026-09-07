const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '..', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seedLeaderboardXP() {
  console.log('===============================================================');
  console.log('🏆 Seeding Member XP for All Users (Points between 100 - 1000)');
  console.log('===============================================================');

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .order('created_at', { ascending: true });

  if (error || !profiles) {
    console.error('Error fetching profiles:', error);
    process.exit(1);
  }

  console.log(`Found ${profiles.length} total profiles.`);

  let successCount = 0;
  for (let i = 0; i < profiles.length; i++) {
    const p = profiles[i];
    // Random points between 100 and 1000
    const points = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
    // Level is points / 100 (e.g. 850 pts = Level 8)
    const level = Math.max(1, Math.floor(points / 100));

    const { error: upsertErr } = await supabase
      .from('member_xp')
      .upsert({
        user_id: p.id,
        total_xp: points,
        level: level,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (upsertErr) {
      console.error(`[${i + 1}/${profiles.length}] Failed for ${p.full_name}:`, upsertErr.message);
    } else {
      successCount++;
      console.log(`[${i + 1}/${profiles.length}] ${p.full_name} (${p.email || 'No email'}) -> ${points} XP (Level ${level})`);
    }
  }

  console.log('\n===============================================================');
  console.log(`🎉 Successfully assigned points (100-1000) to ${successCount} users in member_xp!`);
  console.log('===============================================================');
}

seedLeaderboardXP();
