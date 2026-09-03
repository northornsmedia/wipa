// @ts-nocheck
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, BookOpen, User, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import MobileCreationSheet from './MobileCreationSheet';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const [isCreationOpen, setIsCreationOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/platform') return pathname === '/platform';
    return pathname.startsWith(path);
  };

  if (pathname === '/platform/create-post' || pathname.startsWith('/platform/messages')) {
    return null;
  }

  return (
    <>
      {/* Sleek Floating Glassmorphic Capsule Nav */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 max-w-md mx-auto bg-[#090d16]/90 dark:bg-[#090d16]/90 backdrop-blur-2xl border border-white/10 dark:border-white/15 rounded-full px-2.5 py-1 shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all box-border">
        <div className="h-12 w-full flex items-center justify-between px-1">
          {/* 1. Feed / Home (No text) */}
          <Link
            href="/platform"
            aria-label="Home"
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation ${
              isActive('/platform')
                ? 'bg-white/15 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home size={21} strokeWidth={isActive('/platform') ? 2.4 : 1.9} />
          </Link>

          {/* 2. Chat (No text) */}
          <Link
            href="/platform/messages"
            aria-label="Chat"
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation ${
              isActive('/platform/messages')
                ? 'bg-white/15 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare size={21} strokeWidth={isActive('/platform/messages') ? 2.4 : 1.9} />
          </Link>

          {/* 3. Executive Pill Action Button (+ Post - Left as is) */}
          <Link
            href="/platform/create-post"
            aria-label="Create Post"
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#5a32fa] via-[#ff2a5f] to-[#ff90e8] text-white px-3.5 py-2 rounded-full font-bold text-xs shadow-lg shadow-[#5a32fa]/30 active:scale-90 transition-transform touch-manipulation cursor-pointer"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Post</span>
          </Link>

          {/* 4. Resources / Library (No text) */}
          <Link
            href="/platform/resources"
            aria-label="Library"
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation ${
              isActive('/platform/resources')
                ? 'bg-white/15 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen size={21} strokeWidth={isActive('/platform/resources') ? 2.4 : 1.9} />
          </Link>

          {/* 5. Profile (No text) */}
          <Link
            href="/platform/profile"
            aria-label="Profile"
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation ${
              isActive('/platform/profile')
                ? 'bg-white/15 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {user?.avatar_url ? (
              <div className={`w-6 h-6 rounded-full overflow-hidden ring-1.5 ${isActive('/platform/profile') ? 'ring-white' : 'ring-gray-400/40'}`}>
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <User size={21} strokeWidth={isActive('/platform/profile') ? 2.4 : 1.9} />
            )}
          </Link>
        </div>
      </nav>

      {/* Universal Mobile Creation Sheet */}
      <MobileCreationSheet isOpen={isCreationOpen} onClose={() => setIsCreationOpen(false)} />
    </>
  );
}
