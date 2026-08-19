// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, MessageSquare, Menu, X, Sparkles, User, ArrowRight, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { searchProfiles } from '@/app/actions/profiles';
import MobileDrawerMenu from './MobileDrawerMenu';

export default function MobileTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch unread notifications count
  useEffect(() => {
    if (!user?.id) return;
    async function fetchCounts() {
      try {
        const { count: notifCount } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
        if (typeof notifCount === 'number') setUnreadNotificationsCount(notifCount);
      } catch (err) {
        console.error('Error fetching mobile notification count:', err);
      }
    }
    fetchCounts();
  }, [user?.id, pathname]);

  // Live search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const profiles = await searchProfiles(searchQuery);
        setSearchResults(profiles || []);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectResult = (path: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(path);
  };

  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const lastLogoTap = React.useRef(0);

  const handleLogoTap = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastLogoTap.current < 450) {
      e.preventDefault();
      toggleDarkMode();
      lastLogoTap.current = 0;
    } else {
      lastLogoTap.current = now;
    }
  };

  return (
    <>
      <header className="md:hidden sticky top-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800/80 px-3.5 pt-safe flex flex-col justify-end transition-all w-full max-w-full box-border">
        <div className="h-14 flex items-center justify-between w-full">
          {/* Left Brand Zone (Double-tap / double-click toggles Light/Dark theme) */}
          <Link 
            href="/platform" 
            onClick={handleLogoTap}
            title="Double tap to toggle Light / Dark mode"
            className="flex items-center gap-2 active:scale-95 transition-transform select-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5a32fa] via-[#ff2a5f] to-[#ff90e8] flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#5a32fa]/20">
              W
            </div>
            <span className="font-black text-base tracking-tight text-gray-900 dark:text-white flex items-center">
              WIPA<span className="text-[#ff2a5f] text-xs ml-0.5 font-bold">●</span>
            </span>
          </Link>

          {/* Right Action Hub */}
          <div className="flex items-center gap-1.5">
            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search WIPA"
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-transform active:scale-90"
            >
              <Search size={18} />
            </button>

            {/* Notifications Bell */}
            <Link
              href="/platform/notifications"
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-transform active:scale-90"
            >
              <Bell size={18} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ff2a5f] rounded-full ring-2 ring-white dark:ring-[#0b0f19]" />
              )}
            </Link>

            {/* My Network Link */}
            <Link
              href="/platform/network"
              aria-label="My Network"
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                pathname.startsWith('/platform/network')
                  ? 'bg-[#5a32fa] text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Globe size={18} />
            </Link>

            {/* Drawer Menu Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open Navigation Menu"
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-transform active:scale-90 ml-0.5 overflow-hidden ring-1 ring-gray-200 dark:ring-white/10"
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <Menu size={18} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[120] bg-white dark:bg-[#0b0f19] flex flex-col animate-in fade-in duration-150">
          <div className="p-3.5 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-white/5 rounded-2xl px-3.5 py-2.5 border border-transparent focus-within:border-[#5a32fa] transition-all">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search people, firms, events, jobs..."
                className="bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-500 outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400 p-1">
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!searchQuery.trim() ? (
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Quick Links</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Upcoming Webinars', path: '/platform/resources/webinars' },
                    { label: 'IP Law Firms', path: '/platform/resources/ip-firms' },
                    { label: 'Jobs Board', path: '/platform/jobs' },
                    { label: 'Mentorship', path: '/platform/mentorship' },
                    { label: 'Discussion Forums', path: '/platform/forums' },
                    { label: 'LexIQ AI Assistant', path: '/platform/ai' }
                  ].map((link, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectResult(link.path)}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between"
                    >
                      <span>{link.label}</span>
                      <ArrowRight size={12} className="text-gray-400 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Practitioners & Members</p>
                {searchResults.map((prof: any) => (
                  <button
                    key={prof.id}
                    onClick={() => handleSelectResult(prof.id ? `/platform/profile/${prof.id}` : `/platform/profile`)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                      {prof.avatar_url ? (
                        <img src={prof.avatar_url} alt={prof.full_name} className="w-full h-full object-cover" />
                      ) : (
                        prof.full_name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{prof.full_name}</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{prof.role || prof.company || 'WIPA Member'}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-gray-500">
                <Search size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-xs font-bold">No results found for &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-Over Drawer */}
      <MobileDrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
