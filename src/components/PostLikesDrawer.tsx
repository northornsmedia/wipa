'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, User, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';

interface LikedUser {
  id: string;
  full_name?: string;
  avatar_url?: string;
  practice_area?: string;
  is_wipa_recommended?: boolean;
  liked_at?: string;
}

interface PostLikesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  users: LikedUser[];
  isLoading: boolean;
  currentUserId?: string;
}

export default function PostLikesDrawer({
  isOpen,
  onClose,
  users,
  isLoading,
  currentUserId
}: PostLikesDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const touchStartY = useRef<number | null>(null);

  // Reset expansion state whenever opened
  useEffect(() => {
    if (isOpen) {
      setIsExpanded(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Pull / Drag upward and downward gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;
    touchStartY.current = null;

    // Pulling upward: expand to full drawer
    if (deltaY < -35) {
      setIsExpanded(true);
    }
    // Pulling downward: collapse to half or close
    else if (deltaY > 45) {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Sheet Modal (Slides from Bottom) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{
              y: 0,
              height: isExpanded ? '92dvh' : '390px'
            }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full sm:max-w-md bg-white dark:bg-[#111827] rounded-t-[2rem] sm:rounded-3xl border-t sm:border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden transition-[height] duration-300"
          >
            {/* Upper Drag Header Area: pulls upward to open full drawer */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={() => setIsExpanded((prev) => !prev)}
              className="w-full pt-3 pb-1.5 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none shrink-0 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
              title={isExpanded ? 'Tap or pull down to collapse' : 'Tap or pull upward for full drawer'}
            >
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                {isExpanded ? (
                  <>
                    <ChevronDown size={12} />
                    <span>Pull down to collapse</span>
                  </>
                ) : (
                  <>
                    <ChevronUp size={12} />
                    <span>Pull up for full drawer</span>
                  </>
                )}
              </div>
            </div>

            {/* Header */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="px-5 py-3 border-b border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center shadow-xs">
                  <Heart size={18} className="fill-rose-500 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white leading-none">
                    Likes
                  </h2>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 inline-block">
                    {users.length} {users.length === 1 ? 'person' : 'people'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Expand / Collapse Button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  aria-label={isExpanded ? 'Collapse drawer' : 'Expand full drawer'}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-transform active:scale-90"
                >
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-transform active:scale-90"
                >
                  <X size={16} strokeWidth={2.4} />
                </button>
              </div>
            </div>

            {/* Scrollable User List Body */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 [scrollbar-width:none]">
              {isLoading ? (
                <div className="py-14 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 size={28} className="animate-spin text-rose-500" />
                  <span className="text-xs font-medium">Loading likes...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-1">
                  <Heart size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No likes yet</p>
                  <p className="text-xs text-slate-400">Be the first to like this post!</p>
                </div>
              ) : (
                users.map((u, idx) => {
                  const isCurrent = currentUserId && u.id === currentUserId;
                  return (
                    <div
                      key={u.id || idx}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                    >
                      <Link
                        href={`/platform/profile/${u.id}`}
                        onClick={onClose}
                        className="flex items-center gap-3 min-w-0 flex-1 group"
                      >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={u.full_name || 'Member'}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <User size={18} className="text-slate-400" />
                          )}
                        </div>

                        {/* Name & Headline */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-rose-500 transition-colors">
                              {u.full_name || 'Member'}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.2 rounded-md">
                                You
                              </span>
                            )}
                            {u.is_wipa_recommended && (
                              <span title="WIPA Recommended">
                                <Star
                                  size={12}
                                  className="fill-amber-400 text-amber-400 shrink-0"
                                />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {u.practice_area || 'IP Professional'}
                          </p>
                        </div>
                      </Link>

                      {/* View Profile Button */}
                      <Link
                        href={`/platform/profile/${u.id}`}
                        onClick={onClose}
                        className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 active:scale-95"
                      >
                        <span>Profile</span>
                        <ExternalLink size={11} />
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
