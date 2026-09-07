// @ts-nocheck
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function MoreMenuPage() {
  const router = useRouter();
  const setIsLexIQOpen = useAppStore((state) => state.setIsLexIQOpen);

  return (
    <div className="w-full max-w-full min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white pb-32 sm:pb-24">
      {/* Top Header: Just "More" centered, no extra icons */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-4 pt-safe">
        <div className="max-w-4xl mx-auto flex items-center justify-center h-14">
          <h1 
            className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-instagram-headline"
            style={{ fontFamily: "var(--font-instagram-headline), 'Instagram Sans Headline', sans-serif" }}
          >
            More
          </h1>
        </div>
      </header>

      {/* Main Bento Grid */}
      <main className="max-w-4xl mx-auto px-3.5 sm:px-4 pt-4 sm:pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
          
          {/* 1. Sally 4.1 Pro AI - Big Hero Box (Spans 2 cols, prominent) */}
          <div
            onClick={() => {
              if (typeof setIsLexIQOpen === 'function') {
                setIsLexIQOpen(true);
              } else {
                router.push('/platform/ai');
              }
            }}
            className="col-span-2 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#120826] via-[#1a0f35] to-[#25124a] text-white border border-[#5a32fa]/40 shadow-md shadow-[#5a32fa]/15 cursor-pointer active:scale-[0.99] transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px]"
          >
            {/* Ambient Background Accents */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#ff2a5f]/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#5a32fa]/35 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-[#ff2a5f] to-[#ff90e8] text-white tracking-widest uppercase">
                  AI ASSISTANT
                </span>
                <h2 className="text-lg sm:text-xl font-black tracking-tight mt-2">
                  Sally 4.1 Pro
                </h2>
              </div>
              <span className="text-xs font-bold text-[#ff90e8] bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
                Launch ↗
              </span>
            </div>

            <div className="relative z-10 mt-3">
              <p className="text-xs text-slate-300 line-clamp-2">
                Ask patent claims, trademark clearance, IP licensing clauses & litigation strategies in seconds.
              </p>
            </div>
          </div>

          {/* 2. 11 Resource Verticals - Wide Featured Box (Spans 2 cols) */}
          <Link
            href="/platform/resources"
            className="col-span-2 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#ff2a5f]/15 via-[#5a32fa]/15 to-[#ff90e8]/15 border border-[#ff2a5f]/30 dark:border-white/10 shadow-sm active:scale-[0.99] transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden group"
          >
            <div className="flex items-start justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#ff2a5f] text-white">
                Core Hub
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                Explore ↗
              </span>
            </div>
            <div className="mt-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#ff2a5f] transition-colors">
                11 Resource Verticals
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                Articles, Webinars, Podcasts, Firm Guides, Wellness & toolkits across all IP domains.
              </p>
            </div>
          </Link>

          {/* 3. Publications - Wide Card (Spans 2 cols) */}
          <Link
            href="/platform/publications"
            className="col-span-2 p-4 sm:p-5 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-purple-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[130px] group"
          >
            <div className="flex items-start justify-between">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                Editorial
              </span>
              <span className="text-xs text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white">↗</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Publications
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                Curated journals, editorial insights, research & whitepapers
              </p>
            </div>
          </Link>

          {/* 4. Members Directory - Wide Card (Spans 2 cols) */}
          <Link
            href="/platform/members"
            className="col-span-2 p-4 sm:p-5 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-sky-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[130px] group"
          >
            <div className="flex items-start justify-between">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20">
                Global Roster
              </span>
              <span className="text-xs text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white">↗</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Members Directory
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                Search, filter & connect with verified IP attorneys and counsel
              </p>
            </div>
          </Link>

          {/* 5. Discussion Forums - 1 Col Box */}
          <Link
            href="/platform/forums"
            className="col-span-1 p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-amber-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[125px] group"
          >
            <span className="self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20">
              Hot
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Forums
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                Legal debates
              </p>
            </div>
          </Link>

          {/* 6. Specialty Groups - 1 Col Box */}
          <Link
            href="/platform/groups"
            className="col-span-1 p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-purple-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[125px] group"
          >
            <span className="self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
              Groups
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Specialty
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                Practice niches
              </p>
            </div>
          </Link>

          {/* 7. Mentorship Hub - 1 Col Box */}
          <Link
            href="/platform/mentorship"
            className="col-span-1 p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-teal-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[125px] group"
          >
            <span className="self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20">
              1-on-1
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Mentorship
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                Senior guidance
              </p>
            </div>
          </Link>

          {/* 8. Liked Threads - 1 Col Box */}
          <Link
            href="/platform/liked-threads"
            className="col-span-1 p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-rose-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[125px] group"
          >
            <span className="self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20">
              Saved
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Liked
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                Your bookmarks
              </p>
            </div>
          </Link>

          {/* 9. Jobs Board - 1 Col Box */}
          <Link
            href="/platform/jobs"
            className="col-span-1 p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[125px] group"
          >
            <span className="self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
              Hiring
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Jobs Board
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                In-house & firms
              </p>
            </div>
          </Link>

          {/* 10. Events & Calendar - 1 Col Box */}
          <Link
            href="/platform/events"
            className="col-span-1 p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-pink-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[125px] group"
          >
            <span className="self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-pink-500/10 text-pink-600 dark:text-pink-300 border border-pink-500/20">
              Live
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                Events
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                Webinars & summits
              </p>
            </div>
          </Link>

          {/* 11. IP Law Firms - 1 Col Box */}
          <Link
            href="/platform/resources/ip-firms"
            className="col-span-1 p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[125px] group"
          >
            <span className="self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
              Firms
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                IP Firms
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                Law directory
              </p>
            </div>
          </Link>

          {/* 12. My Network - 1 Col Box */}
          <Link
            href="/platform/network"
            className="col-span-1 p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-blue-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[125px] group"
          >
            <span className="self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
              Radar
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                My Network
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                Connections graph
              </p>
            </div>
          </Link>

          {/* 13. Business Profiles - 1 Col Box */}
          <Link
            href="/platform/business"
            className="col-span-1 p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-orange-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[125px] group"
          >
            <span className="self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-300 border border-orange-500/20">
              Market
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                Business
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                Corporate profiles
              </p>
            </div>
          </Link>

          {/* 14. Board of Directors - 1 Col Box */}
          <Link
            href="/platform/board-members"
            className="col-span-1 p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-yellow-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[125px] group"
          >
            <span className="self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-yellow-500/10 text-yellow-600 dark:text-yellow-300 border border-yellow-500/20">
              Board
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                Directors
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                WIPA leadership
              </p>
            </div>
          </Link>

          {/* 15. Quizzes & XP - 1 Col Box */}
          <Link
            href="/platform/quizzes"
            className="col-span-1 p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-violet-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[125px] group"
          >
            <span className="self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20">
              XP
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                Quizzes
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                Knowledge testing
              </p>
            </div>
          </Link>

          {/* 16. Leaderboard - 1 Col Box */}
          <Link
            href="/platform/leaderboard"
            className="col-span-1 p-4 rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-amber-500/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between min-h-[125px] group"
          >
            <span className="self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20">
              Rank
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Leaderboard
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                Top contributors
              </p>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}
