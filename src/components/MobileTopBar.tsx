// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, MessageSquare, Menu, X, Sparkles, User, ArrowRight, Globe, Plus } from 'lucide-react';
import { NotificationIcon } from '@/components/icons/NotificationIcon';
import { SquaresPlusIcon } from '@/components/icons/SquaresPlusIcon';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { searchGlobal } from '@/app/actions/profiles';
import MobileDrawerMenu from './MobileDrawerMenu';

export default function MobileTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Auto-hide top bar on scroll down, reveal on scroll up
  useEffect(() => {
    const threshold = 6;

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;

          // Always show when at or near the top
          if (currentScrollY <= 20) {
            setIsVisible(true);
            setIsScrolled(false);
            lastScrollY.current = currentScrollY;
            ticking.current = false;
            return;
          }

          setIsScrolled(true);
          const delta = currentScrollY - lastScrollY.current;

          if (Math.abs(delta) >= threshold) {
            if (delta > 0) {
              // Scrolling down -> hide
              setIsVisible(false);
            } else {
              // Scrolling up -> reveal
              setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
          }

          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset to visible on route transition
  useEffect(() => {
    setIsVisible(true);
    setIsScrolled(false);
    lastScrollY.current = 0;
  }, [pathname]);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open-mobile-search', handleOpenSearch);
    return () => window.removeEventListener('open-mobile-search', handleOpenSearch);
  }, []);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Fetch unread notifications count only on mobile screens
  useEffect(() => {
    if (!user?.id || !isMobile) return;
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

    const notificationChannel = supabase
      .channel(`mobile-notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        fetchCounts
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationChannel);
    };
  }, [user?.id, pathname]);

  // Live search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchGlobal(searchQuery, user?.id);
        setSearchResults(results || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, user?.id]);

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

  // Hide on full-screen standalone pages that have their own custom top header
  const isFullScreenModalPage = pathname === '/platform/create-post' || pathname.startsWith('/platform/messages') || pathname === '/platform/more';
  if (isFullScreenModalPage) {
    return null;
  }

  return (
    <>
      {/* FEED PAGE CUSTOM MOBILE TOP BAR (Matches user screenshot) */}
      {pathname === '/platform' ? (
        <header className={`md:hidden sticky top-0 left-0 right-0 z-40 bg-white dark:bg-[#0b0f19] pt-safe px-3.5 pb-0 transition-transform duration-300 ease-in-out w-full max-w-full box-border ${
          isVisible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        } ${
          isScrolled && isVisible ? 'border-b border-slate-200/80 dark:border-white/10 shadow-sm' : 'border-0 shadow-none'
        }`}>
          <div className="h-14 flex items-center justify-between w-full">
            {/* Left: More Menu button (SquaresPlus with W gradient) + Home title */}
            <div className="flex items-center gap-3">
              <Link
                href="/platform/more"
                aria-label="More Menu"
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5a32fa] via-[#ff2a5f] to-[#ff90e8] text-white flex items-center justify-center shadow-md shadow-[#5a32fa]/25 active:scale-90 transition-transform"
              >
                <SquaresPlusIcon size={20} strokeWidth={1.8} />
              </Link>
              <h1 
                onClick={handleLogoTap} 
                className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight select-none cursor-pointer font-instagram-headline"
                style={{ fontFamily: "var(--font-instagram-headline), 'Instagram Sans Headline', sans-serif" }}
              >
                Alliance
              </h1>
            </div>

            {/* Right: Round Bell (with small top badge) and Round + Post Button */}
            <div className="flex items-center gap-2">
              <Link
                href="/platform/notifications"
                aria-label="Notifications"
                className="relative w-10 h-10 rounded-full bg-white dark:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center shadow-sm border border-slate-100 dark:border-white/10 active:scale-90 transition-transform backdrop-blur-md"
              >
                <NotificationIcon size={19} />
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#ff2a5f] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-[#0b0f19] leading-none pointer-events-none">
                  {unreadNotificationsCount > 0 ? unreadNotificationsCount : 3}
                </span>
              </Link>

              <Link
                href="/platform/create-post"
                aria-label="Create Post"
                className="w-10 h-10 rounded-full bg-white dark:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center shadow-sm border border-slate-100 dark:border-white/10 active:scale-90 transition-transform backdrop-blur-md"
              >
                <Plus size={20} strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        </header>
      ) : (
        /* STANDARD MOBILE TOP BAR FOR ALL OTHER PAGES */
        <header className={`md:hidden sticky top-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800/80 px-3.5 pt-safe flex flex-col justify-end transition-transform duration-300 ease-in-out w-full max-w-full box-border ${
          isVisible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}>
          <div className="h-14 flex items-center justify-between w-full">
            {/* Left Zone: More Menu (SquaresPlus with W gradient) + Brand Zone */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/platform/more"
                aria-label="More Menu"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5a32fa] via-[#ff2a5f] to-[#ff90e8] text-white flex items-center justify-center shadow-md shadow-[#5a32fa]/25 active:scale-90 transition-transform"
              >
                <SquaresPlusIcon size={18} strokeWidth={1.8} />
              </Link>

              <Link 
                href="/platform" 
                onClick={handleLogoTap}
                title="Double tap to toggle Light / Dark mode"
                className="flex items-center active:scale-95 transition-transform select-none cursor-pointer"
              >
                <span className="font-black text-base tracking-tight text-gray-900 dark:text-white flex items-center">
                  WIPA<span className="text-[#ff2a5f] text-xs ml-0.5 font-bold">●</span>
                </span>
              </Link>
            </div>

            {/* Right Action Hub */}
            <div className="flex items-center gap-1.5">
              {/* Create Post Button (+) */}
              <Link
                href="/platform/create-post"
                aria-label="Create Post"
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-transform active:scale-90"
              >
                <Plus size={18} strokeWidth={2.4} />
              </Link>

              {/* Notifications Bell */}
              <Link
                href="/platform/notifications"
                aria-label="Notifications"
                className="relative w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-transform active:scale-90"
              >
                <NotificationIcon size={18} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ff2a5f] rounded-full ring-2 ring-white dark:ring-[#0b0f19] pointer-events-none" />
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
            </div>
          </div>
        </header>
      )}

      {/* Full-Screen Mobile Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[120] bg-white dark:bg-[#0b0f19] pt-safe flex flex-col">
          <div className="p-3.5 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 bg-white dark:bg-[#0b0f19]">
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

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-[#0b0f19]">
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
                    { label: 'Sally 4.1 Pro AI Assistant', path: '/platform/ai' }
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
            ) : isSearching ? (
              <div className="py-16 text-center text-xs font-bold text-gray-400">Searching WIPA…</div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Search results</p>
                {searchResults.map((result: any) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelectResult(result.path)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                      {result.imageUrl ? (
                        <img src={result.imageUrl} alt={result.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      ) : (
                        result.title?.charAt(0) || 'W'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{result.title}</h4>
                        <span className="rounded-full bg-[#5a32fa]/10 px-2 py-0.5 text-[9px] font-bold text-[#5a32fa]">{result.type}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{result.subtitle}</p>
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
