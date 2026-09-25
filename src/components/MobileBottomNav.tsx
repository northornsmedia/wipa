'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import { Home09Icon } from '@/components/icons/Home09Icon';
import { SentIcon } from '@/components/icons/SentIcon';
import { SearchAiLineIcon } from '@/components/icons/SearchAiLineIcon';
import { useAppStore } from '@/store/useAppStore';
import MobileCreationSheet from './MobileCreationSheet';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const isInsideChat = useAppStore((state) => state.isInsideChat);
  const [isCreationOpen, setIsCreationOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/platform') return pathname === '/platform';
    return pathname.startsWith(path);
  };

  if (pathname === '/platform/create-post' || (pathname.startsWith('/platform/messages') && isInsideChat)) {
    return null;
  }

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent('open-mobile-search'));
  };

  return (
    <>
      {/* Instagram-style Full Bottom Navigation Bar (Mathematically centered horizontally & vertically) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 transition-all box-border pb-[env(safe-area-inset-bottom,0px)]">
        <div className="h-[57px] w-full max-w-md mx-auto flex items-center justify-between px-3.5 sm:px-6">
          {/* 1. Feed / Home */}
          <Link
            href="/platform"
            aria-label="Home"
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 touch-manipulation ${
              isActive('/platform')
                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10'
                : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home09Icon size={20} />
          </Link>

          {/* 2. Chat */}
          <Link
            href="/platform/messages"
            aria-label="Chat"
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 touch-manipulation ${
              isActive('/platform/messages')
                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10'
                : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <SentIcon size={20} />
          </Link>

          {/* 3. Executive Pill Action Button (Resources - Screen Center) */}
          <Link
            href="/platform/resources"
            aria-label="Resources"
            className="flex items-center justify-center bg-gradient-to-r from-[#5a32fa] via-[#ff2a5f] to-[#ff90e8] text-white px-3.5 py-1.5 rounded-full font-bold text-xs shadow-md shadow-[#5a32fa]/25 active:scale-90 transition-transform touch-manipulation cursor-pointer shrink-0"
          >
            <span>Resources</span>
          </Link>

          {/* 4. Search Button */}
          <Link
            href="/platform/search"
            aria-label="Search"
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 touch-manipulation cursor-pointer ${
              isActive('/platform/search')
                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10'
                : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <SearchAiLineIcon size={21} />
          </Link>

          {/* 5. Profile */}
          <Link
            href="/platform/profile"
            aria-label="Profile"
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 touch-manipulation ${
              isActive('/platform/profile')
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {user?.avatar_url ? (
              <div className={`w-6.5 h-6.5 rounded-full overflow-hidden ring-2 ${isActive('/platform/profile') ? 'ring-slate-900 dark:ring-white' : 'ring-transparent'}`}>
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <User size={20} strokeWidth={isActive('/platform/profile') ? 2.4 : 1.9} />
            )}
          </Link>
        </div>
      </nav>

      {/* Universal Mobile Creation Sheet */}
      <MobileCreationSheet isOpen={isCreationOpen} onClose={() => setIsCreationOpen(false)} />
    </>
  );
}
