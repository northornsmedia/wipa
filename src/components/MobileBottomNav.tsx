// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Plus, BookOpen, User, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import MobileCreationSheet from './MobileCreationSheet';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
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
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 max-w-md mx-auto bg-[#090d16]/90 dark:bg-[#090d16]/90 backdrop-blur-2xl border border-white/10 dark:border-white/15 rounded-full px-3 py-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all box-border">
        <div className="h-13 w-full flex items-center justify-between">
          {/* 1. Feed / Home */}
          <Link
            href="/platform"
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all active:scale-95 touch-manipulation ${
              isActive('/platform')
                ? 'bg-white/10 text-white font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home size={19} strokeWidth={isActive('/platform') ? 2.5 : 1.8} />
            <span className="text-[9.5px] font-medium mt-0.5 leading-none">Home</span>
          </Link>

          {/* 2. Chat */}
          <Link
            href="/platform/messages"
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all active:scale-95 touch-manipulation ${
              isActive('/platform/messages')
                ? 'bg-white/10 text-white font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare size={19} strokeWidth={isActive('/platform/messages') ? 2.5 : 1.8} />
            <span className="text-[9.5px] font-medium mt-0.5 leading-none">Chat</span>
          </Link>

          {/* 3. Executive Pill Action Button */}
          <Link
            href="/platform/create-post"
            aria-label="Create Post"
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#5a32fa] via-[#ff2a5f] to-[#ff90e8] text-white px-3.5 py-2 rounded-full font-bold text-xs shadow-lg shadow-[#5a32fa]/30 active:scale-90 transition-transform touch-manipulation cursor-pointer"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Post</span>
          </Link>

          {/* 4. Resources */}
          <Link
            href="/platform/resources"
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all active:scale-95 touch-manipulation ${
              isActive('/platform/resources')
                ? 'bg-white/10 text-white font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen size={19} strokeWidth={isActive('/platform/resources') ? 2.5 : 1.8} />
            <span className="text-[9.5px] font-medium mt-0.5 leading-none">Library</span>
          </Link>

          {/* 5. Profile */}
          <Link
            href="/platform/profile"
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all active:scale-95 touch-manipulation ${
              isActive('/platform/profile')
                ? 'bg-white/10 text-white font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {user?.avatar_url ? (
              <div className={`w-5 h-5 rounded-full overflow-hidden ring-1.5 ${isActive('/platform/profile') ? 'ring-white' : 'ring-gray-400/40'}`}>
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <User size={19} strokeWidth={isActive('/platform/profile') ? 2.5 : 1.8} />
            )}
            <span className="text-[9.5px] font-medium mt-0.5 leading-none">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Universal Mobile Creation Sheet */}
      <MobileCreationSheet isOpen={isCreationOpen} onClose={() => setIsCreationOpen(false)} />
    </>
  );
}

