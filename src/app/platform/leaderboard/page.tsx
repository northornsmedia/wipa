'use client';

import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { Trophy, Medal, Star, Shield, Lock, Search, Award, Crown } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements'>('leaderboard');
  const [timeframe, setTimeframe] = useState<'all_time' | 'monthly' | 'weekly'>('all_time');
  const [leaders, setLeaders] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<Set<string>>(new Set());
  const [currentUserRank, setCurrentUserRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch Leaderboard
      const { data: leaderData } = await supabase
        .from('member_xp')
        .select('*, profile:profiles(first_name, last_name, avatar_url, job_title)')
        .order('total_xp', { ascending: false })
        .limit(100);
        
      if (leaderData) {
        setLeaders(leaderData);
        if (user?.id) {
          const userIndex = leaderData.findIndex(l => l.user_id === user.id);
          if (userIndex !== -1) {
            setCurrentUserRank({ ...leaderData[userIndex], rank: userIndex + 1 });
          } else {
            // User not in top 100, fetch their rank (approximate)
            const { data: userXp } = await supabase.from('member_xp').select('*').eq('user_id', user.id).single();
            if (userXp) {
              const { count } = await supabase.from('member_xp').select('*', { count: 'exact', head: true }).gt('total_xp', userXp.total_xp);
              setCurrentUserRank({ ...userXp, profile: user, rank: (count || 0) + 1 });
            }
          }
        }
      }
      
      // Fetch Achievements
      const { data: achData } = await supabase.from('achievements').select('*').order('xp_threshold', { ascending: true });
      if (achData) setAchievements(achData);
      
      if (user?.id) {
        const { data: userAchData } = await supabase.from('member_achievements').select('achievement_id').eq('user_id', user.id);
        if (userAchData) {
          setUserAchievements(new Set(userAchData.map(a => a.achievement_id)));
        }
      }
      
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] font-sans pb-24">
      {/* Hero Header */}
      <div className="bg-[#5a32fa] text-white py-12 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <Trophy size={64} className="mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">Global Leaderboard</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
            Learn, contribute, and climb the ranks to become an IP Legend.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        
        {/* Tabs */}
        <div className="bg-white dark:bg-[#1e293b] p-2 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 flex gap-2 mb-8 mx-auto max-w-md">
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'leaderboard' ? 'bg-[#5a32fa] text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            <Trophy size={18} /> Top 100
          </button>
          <button 
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'achievements' ? 'bg-[#5a32fa] text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            <Award size={18} /> Achievements
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><DotmCircular7 size={40} className="text-[#6600FF]" /></div>
        ) : (
          <>
            {activeTab === 'leaderboard' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Timeframe Selector */}
                <div className="flex items-center justify-center gap-2">
                  {[
                    { id: 'all_time', label: 'All Time' },
                    { id: 'monthly', label: 'This Month' },
                    { id: 'weekly', label: 'This Week' }
                  ].map((tf) => (
                    <button
                      key={tf.id}
                      onClick={() => setTimeframe(tf.id as any)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                        timeframe === tf.id
                          ? 'bg-[#5a32fa] text-white shadow-sm shadow-[#5a32fa]/30'
                          : 'bg-white dark:bg-[#1e293b] text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>

                {/* Podium */}
                <div className="flex items-end justify-center gap-4 md:gap-8 pt-4 pb-10">
                  {/* 2nd Place */}
                  {top3[1] && (
                    <div className="flex flex-col items-center animate-in zoom-in duration-500 delay-100">
                      <div className="relative mb-3">
                        <img src={top3[1].profile?.avatar_url || `https://ui-avatars.com/api/?name=${top3[1].profile?.first_name}+${top3[1].profile?.last_name}`} alt="2nd" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-[#C0C0C0] object-cover" />
                        <div className="absolute -bottom-2 -right-2 bg-[#C0C0C0] text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-xs border-2 border-white dark:border-[#0f172a]">2</div>
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white text-center max-w-[90px] truncate text-xs sm:text-sm">{top3[1].profile?.first_name}</div>
                      <div className="text-[11px] font-bold text-[#5a32fa]">Lvl {top3[1].level}</div>
                      <div className="text-xs font-medium text-gray-500">{top3[1].total_xp} XP</div>
                    </div>
                  )}
                  
                  {/* 1st Place */}
                  {top3[0] && (
                    <div className="flex flex-col items-center animate-in zoom-in duration-500 z-10 -mt-6">
                      <Crown className="text-[#FFD700] mb-2 w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
                      <div className="relative mb-3 shadow-xl rounded-full">
                        <img src={top3[0].profile?.avatar_url || `https://ui-avatars.com/api/?name=${top3[0].profile?.first_name}+${top3[0].profile?.last_name}`} alt="1st" className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-[#FFD700] object-cover" />
                        <div className="absolute -bottom-3 -right-2 bg-[#FFD700] text-gray-900 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-sm sm:text-xl border-2 border-white dark:border-[#0f172a]">1</div>
                      </div>
                      <div className="font-black text-sm sm:text-xl text-gray-900 dark:text-white text-center max-w-[120px] sm:max-w-[140px] truncate">{top3[0].profile?.first_name} {top3[0].profile?.last_name}</div>
                      <div className="text-xs font-bold text-[#5a32fa] px-3 py-0.5 bg-[#5a32fa]/10 rounded-full mt-1">Level {top3[0].level}</div>
                      <div className="font-bold text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">{top3[0].total_xp} XP</div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {top3[2] && (
                    <div className="flex flex-col items-center animate-in zoom-in duration-500 delay-200">
                      <div className="relative mb-3">
                        <img src={top3[2].profile?.avatar_url || `https://ui-avatars.com/api/?name=${top3[2].profile?.first_name}+${top3[2].profile?.last_name}`} alt="3rd" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-[#CD7F32] object-cover" />
                        <div className="absolute -bottom-2 -right-2 bg-[#CD7F32] text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-xs border-2 border-white dark:border-[#0f172a]">3</div>
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white text-center max-w-[90px] truncate text-xs sm:text-sm">{top3[2].profile?.first_name}</div>
                      <div className="text-[11px] font-bold text-[#5a32fa]">Lvl {top3[2].level}</div>
                      <div className="text-xs font-medium text-gray-500">{top3[2].total_xp} XP</div>
                    </div>
                  )}
                </div>

                {/* List */}
                <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden relative">
                  <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {rest.map((leader, index) => (
                      <div key={leader.id} className={`flex items-center gap-4 p-4 md:p-6 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${user?.id === leader.user_id ? 'bg-[#5a32fa]/5 dark:bg-[#5a32fa]/10' : ''}`}>
                        <div className="w-12 text-center font-black text-gray-400 dark:text-gray-600 text-xl">
                          {index + 4}
                        </div>
                        <img src={leader.profile?.avatar_url || `https://ui-avatars.com/api/?name=${leader.profile?.first_name}+${leader.profile?.last_name}`} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <Link href={`/platform/profile/${leader.user_id}`} className="font-bold text-gray-900 dark:text-white hover:text-[#5a32fa] truncate block">
                            {(leader.profile as any)?.first_name} {(leader.profile as any)?.last_name}
                          </Link>
                          <div className="text-xs text-gray-500 truncate">{leader.profile?.job_title || 'Member'}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-[#5a32fa]">Lvl {leader.level}</div>
                          <div className="text-sm font-medium text-gray-500">{leader.total_xp} XP</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Sticky Current User if not in list */}
                  {currentUserRank && currentUserRank.rank > 100 && (
                    <div className="sticky bottom-0 bg-white dark:bg-[#1e293b] border-t-2 border-[#5a32fa] p-4 md:p-6 flex items-center gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                      <div className="w-12 text-center font-black text-[#5a32fa] text-xl">
                        {currentUserRank.rank}
                      </div>
                      <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${(user as any)?.first_name}+${(user as any)?.last_name}`} alt="You" className="w-12 h-12 rounded-full object-cover border-2 border-[#5a32fa]" />
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-gray-900 dark:text-white truncate">You</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-[#5a32fa]">Lvl {currentUserRank.level}</div>
                        <div className="text-sm font-medium text-gray-500">{currentUserRank.total_xp} XP</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {achievements.map((ach) => {
                  const isUnlocked = userAchievements.has(ach.id);
                  return (
                    <div key={ach.id} className={`bg-white dark:bg-[#1e293b] rounded-3xl p-6 border transition-all ${isUnlocked ? 'border-[#5a32fa]/30 shadow-md' : 'border-gray-200 dark:border-white/10 opacity-70 grayscale'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-inner"
                          style={{ backgroundColor: ach.badge_color || '#5a32fa' }}
                        >
                          <Star size={24} fill="currentColor" />
                        </div>
                        {isUnlocked ? (
                          <div className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 p-1.5 rounded-full">
                            <Shield size={16} />
                          </div>
                        ) : (
                          <div className="bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500 p-1.5 rounded-full">
                            <Lock size={16} />
                          </div>
                        )}
                      </div>
                      <h3 className="font-black text-lg text-gray-900 dark:text-white mb-1">{ach.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 h-10">{ach.description}</p>
                      
                      <div className="bg-gray-50 dark:bg-black/20 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center justify-between border border-gray-100 dark:border-white/5">
                        <span>XP Required</span>
                        <span className="text-[#5a32fa]">{ach.xp_threshold} XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.204a1 1 0 0 1-.964.732H5.82a1 1 0 0 1-.964-.732L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294l2.952-5.605Z"/>
      <path d="M5 21h14"/>
    </svg>
  );
}
