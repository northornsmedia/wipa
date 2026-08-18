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
    <div className="w-full max-w-full min-w-0 bg-white dark:bg-[#0f172a] md:bg-white/80 md:dark:bg-[#151c2c]/80 md:backdrop-blur-xl md:rounded-[2rem] p-3 sm:p-4 border-b md:border border-gray-100 dark:border-white/5 md:border-gray-200/80 md:dark:border-gray-800/80 shadow-none md:shadow-sm overflow-hidden mb-2 sm:mb-4 box-border">
      <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full max-w-full min-w-0 box-border">
        {/* 1. Add Story / Share Insight Card */}
        <button
          onClick={onOpenCreatePost}
          className="flex flex-col items-center gap-1 shrink-0 group active:scale-90 transition-transform"
        >
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 border-2 border-dashed border-[#5a32fa] flex items-center justify-center bg-gray-50 dark:bg-white/5">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full bg-[#5a32fa] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#0f172a]">
              <Plus size={11} strokeWidth={3} />
            </div>
          </div>
          <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 truncate max-w-[62px]">
            Your story
          </span>
        </button>

        {/* 2. Spotlight Leaders & Highlights */}
        {SPOTLIGHT_STORIES.map((story) => (
          <Link
            key={story.id}
            href={story.path}
            className="flex flex-col items-center gap-1 shrink-0 group active:scale-90 transition-transform"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#f59e0b] via-[#ec4899] to-[#8b5cf6] shadow-sm">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#0f172a] p-0.5">
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
            <span className="text-[10px] font-medium text-gray-800 dark:text-gray-200 truncate max-w-[64px] text-center">
              {story.name.split(' ')[0]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
