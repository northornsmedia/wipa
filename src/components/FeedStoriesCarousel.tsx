// @ts-nocheck
'use client';

import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';

const SPOTLIGHT_STORIES = [
  {
    id: 1,
    name: 'Elena Rostova',
    role: 'Patent Partner',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    badge: '⭐ WIPA Leader',
    path: '/platform/resources/articles-insights'
  },
  {
    id: 2,
    name: 'AI & Patent Law',
    role: 'Live Masterclass',
    avatar: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400',
    badge: '🔴 Live Webinar',
    path: '/platform/resources/webinars'
  },
  {
    id: 3,
    name: 'Sarah Jenkins',
    role: 'TechLaw Counsel',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    badge: '🌟 Verified Member',
    path: '/platform/network'
  },
  {
    id: 4,
    name: 'Maria Garcia',
    role: 'Corporate Counsel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    badge: '🎓 Mentor',
    path: '/platform/mentorship'
  },
  {
    id: 5,
    name: 'Top 50 IP Firms',
    role: 'Global Rankings',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
    badge: '🏢 Top Firms',
    path: '/platform/resources/ip-firms'
  },
  {
    id: 6,
    name: 'IP Podcast #42',
    role: 'New Episode',
    avatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400',
    badge: '🎙️ Podcast',
    path: '/platform/resources/podcasts-conversations'
  }
];

export default function FeedStoriesCarousel({ onOpenCreatePost }: { onOpenCreatePost: () => void }) {
  const user = useAppStore((state) => state.user);

  return (
    <div className="w-full max-w-full min-w-0 bg-transparent py-1 sm:py-2 mb-3 box-border">
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full max-w-full min-w-0 box-border px-1">
        {/* 1. Share Executive Insight Button Tile */}
        <Link
          href="/platform/create-post"
          className="w-28 sm:w-36 h-22 sm:h-28 rounded-2xl shrink-0 border border-gray-200/80 dark:border-white/15 bg-gray-50/80 dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08] flex flex-col items-center justify-center p-2.5 transition-all group active:scale-95 text-left relative overflow-hidden backdrop-blur-md"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600/90 dark:bg-white/10 text-white flex items-center justify-center shadow-sm mb-1.5 group-hover:scale-105 transition-transform border border-white/10">
            <Plus size={18} strokeWidth={2.5} />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white leading-tight text-center">
            Share Insight
          </span>
          <span className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5 text-center">
            Create post
          </span>
        </Link>

        {/* 2. Executive Spotlight & Feature Cards */}
        {SPOTLIGHT_STORIES.map((story) => (
          <Link
            key={story.id}
            href={story.path}
            className="w-30 sm:w-36 h-22 sm:h-28 rounded-2xl shrink-0 relative overflow-hidden group border border-gray-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all active:scale-95 block"
          >
            {/* Background Image */}
            <img
              src={story.avatar}
              alt={story.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

            {/* Top Badge */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 truncate max-w-[110px]">
                {story.badge}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-2 left-2.5 right-2.5 z-10">
              <h4 className="text-[11px] sm:text-xs font-bold text-white leading-tight truncate">
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

