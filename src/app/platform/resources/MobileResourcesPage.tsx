'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, BriefcaseBusiness, Building2, FileText, GraduationCap, HeartPulse, Mic2, Newspaper, Play, Plus, Search, Wrench, X, Layers } from 'lucide-react';

const spaces = [
  { title: 'Webinars', detail: 'Live sessions and masterclasses', meta: '42 sessions', href: '/platform/resources/webinars', icon: Play, color: '#7c3aed', tint: '#f0eafe' },
  { title: 'Education', detail: 'Courses for every career stage', meta: '19 courses', href: '/platform/resources/education', icon: GraduationCap, color: '#6654d9', tint: '#efedff' },
  { title: 'Articles', detail: 'Analysis and fresh perspectives', meta: '86 reads', href: '/platform/resources/articles-insights', icon: FileText, color: '#1677ff', tint: '#eaf3ff' },
  { title: 'IP News', detail: 'Updates from around the world', meta: 'Updated daily', href: '/platform/resources/ip-news', icon: Newspaper, color: '#f05b44', tint: '#fff0ec' },
  { title: 'Research', detail: 'Reports, trends and industry data', meta: '17 reports', href: '/platform/resources/research-reports', icon: BookOpen, color: '#3758c8', tint: '#eaf0ff' },
  { title: 'Guides & Toolkits', detail: 'Practical templates and playbooks', meta: '31 toolkits', href: '/platform/resources/guides-toolkits', icon: Wrench, color: '#d97706', tint: '#fff5dc' },
  { title: 'Career', detail: 'Grow your path and leadership', meta: '34 resources', href: '/platform/resources/career-leadership', icon: BriefcaseBusiness, color: '#ba4d89', tint: '#f9eaf3' },
  { title: 'In-House Counsel', detail: 'Built for corporate IP teams', meta: '22 resources', href: '/platform/resources/in-house-counsel', icon: Building2, color: '#0f8495', tint: '#e4f5f7' },
  { title: 'Podcasts', detail: 'Conversations with IP leaders', meta: '28 episodes', href: '/platform/resources/podcasts-conversations', icon: Mic2, color: '#e74887', tint: '#fdebf3' },
  { title: 'IP Services', detail: 'Tools and trusted providers', meta: 'Partner directory', href: '/platform/resources/ip-services', icon: Layers, color: '#9a5b13', tint: '#fff3df' },
  { title: 'IP Firms', detail: 'Find specialist firms worldwide', meta: 'Global directory', href: '/platform/resources/ip-firms', icon: Building2, color: '#3d5366', tint: '#edf2f5' },
  { title: 'Wellbeing', detail: 'Balance, focus and mental health', meta: '24 resources', href: '/platform/resources/wellness', icon: HeartPulse, color: '#089b75', tint: '#e6f7f1' },
];

const quickSpaces = [spaces[0], spaces[1], spaces[2], spaces[8]];

export default function MobileResourcesPage() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    return value ? spaces.filter((space) => `${space.title} ${space.detail} ${space.meta}`.toLowerCase().includes(value)) : spaces;
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f7f7fb] px-4 pb-8 pt-5 text-[#151525] dark:bg-[#0b0d16] dark:text-white sm:hidden">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#7c3aed] dark:text-[#c4b5fd]">WIPA Library</p>
          <h1 className="text-[28px] font-black leading-none tracking-[-0.04em]">Resources</h1>
        </div>
      </header>

      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#89899a]" size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the library" aria-label="Search the resource library" className="h-12 w-full rounded-[18px] border border-black/[0.04] bg-white pl-11 pr-11 text-sm font-medium outline-none shadow-[0_5px_20px_rgba(30,24,60,0.05)] placeholder:text-[#9695a3] focus:border-[#7c3aed]/30 dark:border-white/[0.08] dark:bg-white/[0.06]" />
        {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#f0eff4] text-[#747281] dark:bg-white/10"><X size={14} /></button>}
      </div>

      {!query && (
        <>
          <Link href="/platform/resources/webinars" className="group relative mt-5 block min-h-[210px] overflow-hidden rounded-[28px] bg-[#171426] p-5 text-white shadow-[0_18px_40px_rgba(32,20,73,0.22)] active:scale-[0.99]">
            <Image src="/resource3.jpg" alt="AI in Patent Law masterclass" fill priority sizes="100vw" className="object-cover opacity-55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161321] via-[#161321]/75 to-black/5" />
            <div className="relative flex min-h-[170px] flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em]"><span className="h-1.5 w-1.5 rounded-full bg-[#ff4d88]" />Featured masterclass</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#171426]"><Play size={14} className="ml-0.5 fill-current" /></span>
              </div>
              <div>
                <p className="mb-1.5 text-[11px] font-bold text-[#f1a7c7]">Trending now</p>
                <h2 className="text-[22px] font-black leading-[1.08] tracking-[-0.03em]">AI in Patent Law &amp; Cross-Border Prosecution</h2>
                <p className="mt-2 text-xs font-semibold text-white/65">48 min · WIPA Masterclass</p>
              </div>
            </div>
          </Link>

          <section className="mt-7">
            <h2 className="text-[17px] font-extrabold tracking-[-0.02em]">Jump back in</h2>
            <p className="mt-0.5 text-xs font-medium text-[#858493] dark:text-white/45">Your most-used spaces</p>
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {quickSpaces.map((space) => {
                const Icon = space.icon;
                return <Link key={space.title} href={space.href} className="min-w-0 text-center active:scale-95"><div className="mx-auto flex aspect-square w-full max-w-[76px] items-center justify-center rounded-[21px]" style={{ backgroundColor: space.tint, color: space.color }}><Icon size={22} strokeWidth={2.1} /></div><span className="mt-2 block truncate text-[11px] font-bold text-[#515060] dark:text-white/70">{space.title}</span></Link>;
              })}
            </div>
          </section>
        </>
      )}

      <section className={query ? 'mt-7' : 'mt-8'}>
        <div className="mb-3 flex items-center justify-between">
          <div><h2 className="text-[17px] font-extrabold tracking-[-0.02em]">{query ? 'Search results' : 'Explore the library'}</h2><p className="mt-0.5 text-xs font-medium text-[#858493] dark:text-white/45">{query ? `${results.length} spaces found` : 'Everything you need, in one place'}</p></div>
          {!query && <span className="rounded-full bg-[#ebe8fb] px-2.5 py-1 text-[10px] font-extrabold text-[#6d49d8] dark:bg-[#7c3aed]/20 dark:text-[#c4b5fd]">12 spaces</span>}
        </div>
        {results.length ? (
          <div className="grid grid-cols-2 gap-3">
            {results.map((space) => {
              const Icon = space.icon;
              return <Link key={space.title} href={space.href} className="flex min-h-[166px] flex-col rounded-[23px] border border-black/[0.045] bg-white p-4 shadow-[0_7px_24px_rgba(30,24,60,0.045)] active:scale-[0.98] dark:border-white/[0.07] dark:bg-white/[0.055]"><div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: space.tint, color: space.color }}><Icon size={21} /></div><ArrowRight size={15} className="mt-1 text-[#c1bfca]" /></div><div className="mt-auto pt-4"><h3 className="text-[14px] font-extrabold leading-tight">{space.title}</h3><p className="mt-1 line-clamp-2 text-[11px] font-medium leading-[1.35] text-[#888795] dark:text-white/45">{space.detail}</p><p className="mt-2 text-[10px] font-bold" style={{ color: space.color }}>{space.meta}</p></div></Link>;
            })}
          </div>
        ) : (
          <div className="flex min-h-[230px] flex-col items-center justify-center rounded-[26px] bg-white px-6 text-center dark:bg-white/[0.05]"><Search size={25} className="text-[#aaa7b4]" /><h3 className="mt-3 text-base font-extrabold">Nothing found</h3><p className="mt-1 text-sm text-[#898795] dark:text-white/45">Try “webinar,” “career,” or “wellbeing.”</p><button type="button" onClick={() => setQuery('')} className="mt-4 text-sm font-bold text-[#6d49d8]">Clear search</button></div>
        )}
      </section>
    </div>
  );
}
