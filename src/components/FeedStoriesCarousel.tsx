// @ts-nocheck
'use client';

import React from 'react';
import { Plus, User } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';

const SPOTLIGHT_STORIES = [
  {
    id: 1,
    name: 'Elena Rostova',
    role: 'Patent Partner',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    storyBg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    badge: '⭐ WIPA Leader',
    path: '/platform/resources/articles-insights'
  },
  {
    id: 2,
    name: 'AI & Patent Law',
    role: 'Live Masterclass',
    avatar: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400',
    storyBg: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400',
    badge: '🔴 Live Webinar',
    path: '/platform/resources/webinars'
  },
  {
    id: 3,
    name: 'Sarah Jenkins',
    role: 'TechLaw Counsel',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    storyBg: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    badge: '🌟 Verified Member',
    path: '/platform/network'
  },
  {
    id: 4,
    name: 'Maria Garcia',
    role: 'Corporate Counsel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    storyBg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    badge: '🎓 Mentor',
    path: '/platform/mentorship'
  },
  {
    id: 5,
    name: 'Top 50 IP Firms',
    role: 'Global Rankings',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
    storyBg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
    badge: '🏢 Top Firms',
    path: '/platform/resources/ip-firms'
  },
  {
    id: 6,
    name: 'IP Podcast #42',
    role: 'New Episode',
    avatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400',
    storyBg: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400',
    badge: '🎙️ Podcast',
    path: '/platform/resources/podcasts-conversations'
  }
];

export default function FeedStoriesCarousel({ onOpenCreatePost }: { onOpenCreatePost: () => void }) {
  const user = useAppStore((state) => state.user);

  return (
    <div className="w-full max-w-full min-w-0 bg-transparent py-1 sm:py-2 mb-3 box-border border-0 border-none">
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full max-w-full min-w-0 box-border px-3.5 sm:px-4">
        
        {/* 1. Share / Your Story Tile */}
        <Link
          href="/platform/create-post"
          className="w-[96px] h-[138px] sm:w-28 sm:h-38 md:w-36 md:h-28 rounded-2xl shrink-0 border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/[0.05] md:bg-gray-50/80 md:dark:bg-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.08] flex flex-col items-center justify-center p-2 transition-all group active:scale-95 text-center relative overflow-hidden shadow-xs backdrop-blur-md"
        >
          {/* Mobile Layout (Your Story) */}
          <div className="flex flex-col items-center md:hidden">
            <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={24} className="text-slate-400" />
              )}
            </div>
            {/* Blue Plus Badge */}
            <div className="w-5 h-5 rounded-full bg-[#0095f6] text-white flex items-center justify-center -mt-2.5 z-10 border-2 border-white dark:border-slate-900 shadow-xs">
              <Plus size={12} strokeWidth={3} />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 mt-2 tracking-tight leading-none">
              Your Story
            </span>
          </div>

          {/* Desktop Layout (Share Insight) */}
          <div className="hidden md:flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600/90 dark:bg-white/10 text-white flex items-center justify-center shadow-sm mb-1.5 group-hover:scale-105 transition-transform border border-white/10">
              <Plus size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight text-center">
              Share Insight
            </span>
            <span className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5 text-center">
              Create post
            </span>
          </div>
        </Link>

        {/* 2. Executive Spotlight & Feature Story Cards */}
        {SPOTLIGHT_STORIES.map((story) => (
          <Link
            key={story.id}
            href={story.path}
            className="w-[96px] h-[138px] sm:w-28 sm:h-38 md:w-36 md:h-28 rounded-2xl shrink-0 relative overflow-hidden group border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all active:scale-95 block"
          >
            {/* Background Image */}
            <img
              src={story.storyBg || story.avatar}
              alt={story.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Mobile Top Floating Circle Avatar */}
            <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 z-10">
              <img
                src={story.avatar}
                alt={story.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
              />
            </div>

            {/* Desktop Gradient & Badges */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <div className="hidden md:flex absolute top-2 left-2 right-2 items-center justify-between z-10">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 truncate max-w-[110px]">
                {story.badge}
              </span>
            </div>
            <div className="hidden md:block absolute bottom-2 left-2.5 right-2.5 z-10">
              <h4 className="text-xs font-bold text-white leading-tight truncate">
                {story.name}
              </h4>
              <p className="text-[9.5px] text-gray-300 font-medium truncate">
                {story.role}
              </p>
            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}
