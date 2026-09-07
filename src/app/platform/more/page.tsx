// @ts-nocheck
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, X, Sparkles, Users, MessageSquare, 
  UserCheck, Globe, Building2, Briefcase, Award, Calendar, 
  BookOpen, Heart, Star, Newspaper, Sun, Moon, Gift, 
  Settings, LogOut, ShieldCheck, ChevronRight, Zap, 
  Download, ArrowUpRight, Compass, Flame, GraduationCap
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

export default function MoreMenuPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const setIsLexIQOpen = useAppStore((state) => state.setIsLexIQOpen);
  
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    useAppStore.getState().setUser(null);
    router.push('/login');
  };

  const handleInstallApp = () => {
    if (typeof window !== 'undefined') {
      const promptEvent = (window as any).deferredInstallPrompt;
      if (promptEvent) {
        window.dispatchEvent(new Event('wipa_trigger_install'));
      } else {
        alert("To install WIPA App:\n• On Android/Chrome: Tap the 3 dots (⋮) ➔ 'Install App'\n• On iOS/Safari: Tap Share (⬆️) ➔ 'Add to Home Screen'");
      }
    }
  };

  // Bento navigation items categorized for filtering
  const allBentoItems = useMemo(() => [
    {
      id: 'forums',
      title: 'Discussion Forums',
      category: 'Community',
      description: 'Engage in lively IP legal debates & insights',
      icon: MessageSquare,
      path: '/platform/forums',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30',
      badge: 'Hot Topics',
      size: 'col-span-2 sm:col-span-1'
    },
    {
      id: 'specialty-groups',
      title: 'Specialty Groups',
      category: 'Community',
      description: 'Patents, Trademarks, BioTech & AI committees',
      icon: Users,
      path: '/platform/groups',
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-500 border-purple-500/30',
      badge: '24 Groups',
      size: 'col-span-2 sm:col-span-1'
    },
    {
      id: 'mentorship',
      title: 'Mentorship Hub',
      category: 'Community',
      description: '1-on-1 guidance with senior IP counsels & executives',
      icon: UserCheck,
      path: '/platform/mentorship',
      color: 'from-teal-500/20 to-emerald-500/20 text-teal-500 border-teal-500/30',
      badge: 'Active Matching',
      size: 'col-span-2 sm:col-span-1'
    },
    {
      id: 'liked-threads',
      title: 'Liked Threads',
      category: 'Community',
      description: 'Quick access to bookmarks & favorited discussions',
      icon: Heart,
      path: '/platform/liked-threads',
      color: 'from-rose-500/20 to-pink-500/20 text-rose-500 border-rose-500/30',
      badge: null,
      size: 'col-span-2 sm:col-span-1'
    },
    {
      id: 'members',
      title: 'Members Directory',
      category: 'Directory',
      description: 'Search & connect with verified global IP professionals',
      icon: Users,
      path: '/platform/members',
      color: 'from-sky-500/20 to-blue-500/20 text-sky-500 border-sky-500/30',
      badge: 'Global Roster',
      size: 'col-span-2'
    },
    {
      id: 'network',
      title: 'My Network',
      category: 'Directory',
      description: 'Manage peer connections, pending requests & graph',
      icon: Globe,
      path: '/platform/network',
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/30',
      badge: 'Radar',
      size: 'col-span-2 sm:col-span-1'
    },
    {
      id: 'ip-firms',
      title: 'IP Law Firms',
      category: 'Directory',
      description: 'Premier directory of specialized IP law practices',
      icon: Building2,
      path: '/platform/resources/ip-firms',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/30',
      badge: 'Verified',
      size: 'col-span-2 sm:col-span-1'
    },
    {
      id: 'business',
      title: 'Business Profiles',
      category: 'Directory',
      description: 'Corporate counsel, IP vendors & marketplace',
      icon: Briefcase,
      path: '/platform/business',
      color: 'from-orange-500/20 to-amber-500/20 text-orange-500 border-orange-500/30',
      badge: null,
      size: 'col-span-2 sm:col-span-1'
    },
    {
      id: 'board-members',
      title: 'Board of Directors',
      category: 'Directory',
      description: 'WIPA leadership council and executive chairs',
      icon: Star,
      path: '/platform/board-members',
      color: 'from-yellow-500/20 to-amber-500/20 text-yellow-500 border-yellow-500/30',
      badge: 'Leadership',
      size: 'col-span-2 sm:col-span-1'
    },
    {
      id: 'publications',
      title: 'Publications',
      category: 'Knowledge',
      description: 'Curated editorial insights, whitepapers & reports',
      icon: Newspaper,
      path: '/platform/publications',
      color: 'from-fuchsia-500/20 to-purple-500/20 text-fuchsia-500 border-fuchsia-500/30',
      badge: 'Featured',
      size: 'col-span-2'
    },
    {
      id: 'resources-hub',
      title: '11 Resource Verticals',
      category: 'Knowledge',
      description: 'Webinars, Podcasts, Toolkits, Firm directory & Guides',
      icon: BookOpen,
      path: '/platform/resources',
      color: 'from-[#ff2a5f]/20 via-[#5a32fa]/20 to-[#ff90e8]/20 text-[#ff2a5f] border-[#ff2a5f]/30',
      badge: 'Core Hub',
      size: 'col-span-2'
    },
    {
      id: 'jobs',
      title: 'Jobs Board',
      category: 'Career',
      description: 'Exclusive in-house counsel & associate openings',
      icon: Briefcase,
      path: '/platform/jobs',
      color: 'from-emerald-500/20 to-green-500/20 text-emerald-500 border-emerald-500/30',
      badge: 'Hiring',
      size: 'col-span-2 sm:col-span-1'
    },
    {
      id: 'events',
      title: 'Events & Calendar',
      category: 'Career',
      description: 'Upcoming summit webinars, conferences & summits',
      icon: Calendar,
      path: '/platform/events',
      color: 'from-rose-500/20 to-pink-500/20 text-rose-500 border-rose-500/30',
      badge: 'Live Dates',
      size: 'col-span-2 sm:col-span-1'
    },
    {
      id: 'quizzes',
      title: 'Quizzes & XP',
      category: 'Knowledge',
      description: 'Test your IP knowledge and earn professional badges',
      icon: Award,
      path: '/platform/quizzes',
      color: 'from-violet-500/20 to-purple-500/20 text-violet-500 border-violet-500/30',
      badge: 'Earn XP',
      size: 'col-span-2 sm:col-span-1'
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      category: 'Career',
      description: 'Top contributing attorneys & active IP mentors',
      icon: Flame,
      path: '/platform/leaderboard',
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-500 border-amber-500/30',
      badge: 'Rankings',
      size: 'col-span-2 sm:col-span-1'
    },
  ], []);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allBentoItems;
    const q = searchQuery.toLowerCase();
    return allBentoItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [searchQuery, allBentoItems]);

  return (
    <div className="w-full max-w-full min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white pb-32 sm:pb-24">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-4 pt-safe pb-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              aria-label="Back"
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center active:scale-90 transition-transform shadow-xs"
            >
              <ArrowLeft size={20} strokeWidth={2.2} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                More
                <span className="w-2 h-2 rounded-full bg-[#ff2a5f] animate-pulse" />
              </h1>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                All platform modules, tools & directories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center active:scale-90 transition-transform shadow-xs"
            >
              {isDarkMode ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} className="text-slate-600" />}
            </button>
            <Link
              href="/platform/settings"
              aria-label="Settings"
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center active:scale-90 transition-transform shadow-xs"
            >
              <Settings size={19} />
            </Link>
          </div>
        </div>

        {/* Live Filter Bar */}
        <div className="max-w-4xl mx-auto mt-2">
          <div className="relative flex items-center bg-slate-100 dark:bg-white/5 rounded-2xl px-3.5 py-2.5 border border-slate-200/80 dark:border-white/10 focus-within:border-[#5a32fa] transition-all">
            <Search size={18} className="text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search directories, tools, forums, jobs..."
              className="bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 p-0.5">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        {/* 1. Profile Hero Bento Card (User Identity) */}
        {user ? (
          <Link
            href="/platform/profile"
            className="block p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#5a32fa]/10 via-[#ff2a5f]/10 to-[#ff90e8]/10 dark:from-[#5a32fa]/20 dark:via-[#ff2a5f]/15 dark:to-[#ff90e8]/15 border border-[#5a32fa]/25 dark:border-white/10 shadow-sm hover:shadow-md transition-all active:scale-[0.99] group"
          >
            <div className="flex items-center gap-3.5">
              <div className="relative">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#5a32fa] shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-black text-xl shadow-md">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#070b14] rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {user.name || 'WIPA Member'}
                  </h2>
                  <ShieldCheck size={16} className="text-sky-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5a32fa]/15 text-[#5a32fa] dark:text-[#ff90e8] border border-[#5a32fa]/25">
                    {user.membership_tier || 'Verified Counsel'}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">View Profile →</span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white group-hover:translate-x-0.5 transition-transform shadow-xs">
                <ChevronRight size={18} />
              </div>
            </div>
          </Link>
        ) : (
          <div className="p-5 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Join the WIPA Community</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Sign in to unlock personalized networking & events</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-r from-[#5a32fa] to-[#ff2a5f] text-white font-bold text-xs shadow-md shadow-[#5a32fa]/20 active:scale-95 transition-transform"
            >
              Sign In / Register
            </Link>
          </div>
        )}

        {/* 2. Sally 4.1 Pro AI Super-Box (Hero Bento) */}
        <div
          onClick={() => {
            if (typeof setIsLexIQOpen === 'function') {
              setIsLexIQOpen(true);
            } else {
              router.push('/platform/ai');
            }
          }}
          className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#120826] via-[#1a0f35] to-[#25124a] text-white border border-[#5a32fa]/40 shadow-lg shadow-[#5a32fa]/20 cursor-pointer active:scale-[0.99] transition-all group"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#ff2a5f]/25 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-[#5a32fa]/35 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#5a32fa] via-[#ff2a5f] to-[#ff90e8] p-0.5 shadow-md shrink-0">
                <div className="w-full h-full rounded-2xl bg-[#0d071d] flex items-center justify-center p-2">
                  <img src="/lexiq.png" alt="Sally 4.1 Pro" className="w-full h-full object-contain" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-1.5">
                    Sally 4.1 Pro
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-[#ff2a5f] to-[#ff90e8] text-white tracking-widest uppercase">
                      AI COPILOT
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                  Ask patent claims, trademark clearance, IP licensing clauses & litigation strategies in seconds.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/20 border border-white/20 text-xs font-bold flex items-center justify-center gap-2 backdrop-blur-md shrink-0 active:scale-95 transition-transform self-start sm:self-auto"
            >
              <Sparkles size={14} className="text-[#ff90e8]" />
              <span>Launch Copilot</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Quick AI Prompts */}
          <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Ask:</span>
            {['Patent Claim Drafting', 'Trademark Similarity Check', 'IP Licensing Clauses'].map((chip, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 whitespace-nowrap"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Bento Grid of All Platform Modules */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {searchQuery ? `Results (${filteredItems.length})` : 'Ecosystem & Modules'}
            </h2>
            <span className="text-[11px] font-medium text-slate-400">Tap to open</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-2.5">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`${item.size} p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-[#5a32fa]/40 dark:hover:border-white/20 shadow-xs hover:shadow-md transition-all active:scale-[0.98] group flex flex-col justify-between relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/10">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#5a32fa] dark:group-hover:text-[#ff90e8] transition-colors">
                        {item.title}
                      </h3>
                      <ArrowUpRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. Utilities & App Actions */}
        <section className="space-y-2.5 pt-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
            Utilities & Shortcuts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Install PWA Card */}
            <div
              onClick={handleInstallApp}
              className="p-4 rounded-3xl bg-gradient-to-r from-[#5a32fa]/10 via-[#ff2a5f]/10 to-[#ff90e8]/10 border border-[#5a32fa]/25 dark:border-white/10 shadow-xs hover:shadow-md cursor-pointer active:scale-[0.98] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#5a32fa] text-white flex items-center justify-center shadow-sm">
                  <Download size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Install WIPA Mobile App</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Add to home screen for native experience</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#5a32fa] text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-xs">
                Install
              </span>
            </div>

            {/* Gift a Membership */}
            <Link
              href="/platform/gift"
              className="p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                  <Gift size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Gift a Membership</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Sponsor an IP colleague or mentee</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Account Settings */}
            <Link
              href="/platform/settings"
              className="p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <Settings size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Account & Privacy Settings</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Security, notification & billing preferences</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Sign Out Button */}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 shadow-xs hover:bg-rose-500/15 active:scale-[0.98] transition-all flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-500/20 flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Sign Out of WIPA</h4>
                    <p className="text-[11px] opacity-75">Securely log out from this session</p>
                  </div>
                </div>
                <ChevronRight size={18} className="opacity-60" />
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
