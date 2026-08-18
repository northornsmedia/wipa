// @ts-nocheck
'use client';

import React from 'react';
import { Plus, Video, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';

const SPOTLIGHT_STORIES = [
  {
    id: 1,
    name: 'Elena Rostova',
    role: 'Patent Partner',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    type: 'spotlight',
    badge: '⭐ WIPA Leader',
    path: '/platform/resources/articles-insights'
  },
  {
    id: 2,
    name: 'Live Masterclass',
    role: 'AI & Patent Law',
    avatar: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=200',
    type: 'webinar',
    badge: '📹 Live Webinar',
    path: '/platform/resources/webinars'
  },
  {
    id: 3,
    name: 'Sarah Jenkins',
    role: 'TechLaw IP',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    type: 'spotlight',
    badge: '⭐ Verified',
    path: '/platform/network'
  },
  {
    id: 4,
    name: 'Maria Garcia',
    role: 'Corporate Counsel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    type: 'spotlight',
    badge: '🌟 Mentor',
    path: '/platform/mentorship'
  },
  {
    id: 5,
    name: 'IP Law Rankings',
    role: 'Global Top Firms',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200',
    type: 'firms',
    badge: '🏢 Top 50 Firms',
    path: '/platform/resources/ip-firms'
  },
  {
    id: 6,
    name: 'Podcast Episode',
    role: 'Episode #42',
    avatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=200',
    type: 'podcast',
    badge: '🎙️ Podcast',
    path: '/platform/resources/podcasts-conversations'
  }
];

export default function FeedStoriesCarousel({ onOpenCreatePost }: { onOpenCreatePost: () => void }) {
  const user = useAppStore((state) => state.user);

  return (
    <div className="w-full bg-white/80 dark:bg-[#151c2c]/80 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-3.5 sm:p-4 border border-gray-200/80 dark:border-gray-800/80 shadow-sm overflow-hidden mb-4">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
          <Sparkles size={14} className="text-[#ff2a5f]" />
          <span>Spotlight Stories & Highlights</span>
        </div>
        <Link href="/platform/resources/webinars" className="text-[11px] font-bold text-[#5a32fa] dark:text-[#ff90e8] hover:underline">
          View All Live
        </Link>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* 1. Add Story / Share Insight Card */}
        <button
          onClick={onOpenCreatePost}
          className="flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-transform"
        >
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 border-2 border-dashed border-[#5a32fa] flex items-center justify-center bg-gray-50 dark:bg-white/5">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#ff2a5f] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#151c2c]">
              <Plus size={12} strokeWidth={3} />
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate max-w-[64px]">
            Share Post
          </span>
        </button>

        {/* 2. Spotlight Leaders & Highlights */}
        {SPOTLIGHT_STORIES.map((story) => (
          <Link
            key={story.id}
            href={story.path}
            className="flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-transform"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#ff2a5f] via-[#5a32fa] to-[#ff90e8] shadow-md group-hover:shadow-[#5a32fa]/30 transition-shadow">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#151c2c] p-0.5">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {story.type === 'webinar' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase bg-red-500 text-white tracking-wider animate-pulse shadow-sm">
                  LIVE
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 truncate max-w-[68px] text-center">
              {story.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
