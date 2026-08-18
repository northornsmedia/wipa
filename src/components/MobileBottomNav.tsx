// @ts-nocheck
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Globe, Plus, BookOpen, User, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import MobileCreationSheet from './MobileCreationSheet';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const setIsLexIQOpen = useAppStore((state) => state.setIsLexIQOpen);
  const [isCreationOpen, setIsCreationOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/platform') return pathname === '/platform';
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Floating LexIQ AI Assistant Trigger (FAB) on mobile */}
      <button
        onClick={() => setIsLexIQOpen(true)}
        aria-label="Ask LexIQ AI"
        className="md:hidden fixed bottom-[72px] right-3.5 z-40 w-10 h-10 rounded-full bg-gradient-to-tr from-[#5a32fa] via-purple-600 to-[#ff90e8] text-white flex items-center justify-center shadow-md shadow-[#5a32fa]/30 active:scale-90 transition-transform ring-2 ring-white/60 dark:ring-[#0b0f19]/60"
      >
        <Sparkles size={18} className="text-white" />
      </button>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800/80 px-2 flex items-center justify-around pb-safe transition-colors shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {/* 1. Feed / Home */}
        <Link
          href="/platform"
          className={`flex flex-col items-center justify-center w-14 h-full relative transition-all active:scale-90 ${
            isActive('/platform')
              ? 'text-[#5a32fa] dark:text-[#ff90e8]'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Home size={21} strokeWidth={isActive('/platform') ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-1">Home</span>
          {isActive('/platform') && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#5a32fa] dark:bg-[#ff90e8]" />
          )}
        </Link>

        {/* 2. Network */}
        <Link
          href="/platform/network"
          className={`flex flex-col items-center justify-center w-14 h-full relative transition-all active:scale-90 ${
            isActive('/platform/network')
              ? 'text-[#5a32fa] dark:text-[#ff90e8]'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Globe size={21} strokeWidth={isActive('/platform/network') ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-1">Network</span>
          {isActive('/platform/network') && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#5a32fa] dark:bg-[#ff90e8]" />
          )}
        </Link>

        {/* 3. Centered Elevated '+' Create Button */}
        <div className="flex flex-col items-center justify-center -mt-5">
          <button
            onClick={() => setIsCreationOpen(true)}
            aria-label="Create Post, Webinar, or Topic"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff2a5f] to-rose-600 text-white flex items-center justify-center shadow-lg shadow-[#ff2a5f]/40 active:scale-90 transition-transform ring-4 ring-white dark:ring-[#0b0f19]"
          >
            <Plus size={24} strokeWidth={2.8} />
          </button>
          <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">
            Create
          </span>
        </div>

        {/* 4. Resources (11 Verticals) */}
        <Link
          href="/platform/resources"
          className={`flex flex-col items-center justify-center w-14 h-full relative transition-all active:scale-90 ${
            isActive('/platform/resources')
              ? 'text-[#5a32fa] dark:text-[#ff90e8]'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BookOpen size={21} strokeWidth={isActive('/platform/resources') ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-1">Resources</span>
          {isActive('/platform/resources') && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#5a32fa] dark:bg-[#ff90e8]" />
          )}
        </Link>

        {/* 5. Profile */}
        <Link
          href="/platform/profile"
          className={`flex flex-col items-center justify-center w-14 h-full relative transition-all active:scale-90 ${
            isActive('/platform/profile')
              ? 'text-[#5a32fa] dark:text-[#ff90e8]'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {user?.avatar_url ? (
            <div className={`w-6 h-6 rounded-full overflow-hidden ring-2 ${isActive('/platform/profile') ? 'ring-[#5a32fa] dark:ring-[#ff90e8]' : 'ring-transparent'}`}>
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <User size={21} strokeWidth={isActive('/platform/profile') ? 2.5 : 2} />
          )}
          <span className="text-[10px] font-bold mt-1">Profile</span>
          {isActive('/platform/profile') && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#5a32fa] dark:bg-[#ff90e8]" />
          )}
        </Link>
      </nav>

      {/* Universal Mobile Creation Sheet */}
      <MobileCreationSheet isOpen={isCreationOpen} onClose={() => setIsCreationOpen(false)} />
    </>
  );
}
