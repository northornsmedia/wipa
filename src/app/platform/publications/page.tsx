import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgePercent, BookOpenText, Cpu, Globe2, Sparkles } from "lucide-react";
import { publications, type PublicationTheme } from "@/lib/publications";

export const metadata: Metadata = {
  title: "Publications | WIPA",
  description: "Exclusive publication and visibility opportunities for Women’s IP Alliance members.",
};

const cardStyles: Record<PublicationTheme, { glow: string; coverGlow: string; icon: string; link: string; number: string }> = {
  rose: {
    // Women's IP World: Purple
    glow: "from-purple-600/30 via-violet-500/10 to-transparent",
    coverGlow: "from-purple-600/35 via-violet-500/25 to-transparent",
    icon: "bg-gradient-to-br from-[#5a32fa] via-purple-600 to-indigo-700 text-white shadow-purple-500/35",
    link: "text-purple-600 dark:text-purple-300",
    number: "text-purple-100 dark:text-purple-400/15",
  },
  violet: {
    // Global IP Magazine: Ice Blue
    glow: "from-sky-400/35 via-cyan-400/15 to-transparent",
    coverGlow: "from-sky-400/35 via-cyan-300/30 to-transparent",
    icon: "bg-gradient-to-br from-sky-400 via-cyan-400 to-sky-500 text-white shadow-sky-400/35",
    link: "text-sky-600 dark:text-sky-300",
    number: "text-sky-100 dark:text-sky-400/15",
  },
  cyan: {
    // IP Tech & Innovation: Dark Blue
    glow: "from-blue-900/40 via-indigo-950/20 to-transparent",
    coverGlow: "from-blue-800/35 via-indigo-950/30 to-transparent",
    icon: "bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white shadow-blue-950/45",
    link: "text-blue-800 dark:text-blue-300",
    number: "text-blue-100 dark:text-blue-500/15",
  },
};

const icons = [BookOpenText, Globe2, Cpu];

export default function PlatformPublicationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-950 dark:bg-[#0f172a] dark:text-white">
      
      {/* ULTRA-COOL FULL-WIDTH HERO BANNER */}
      <section className="w-full relative overflow-hidden border-b border-slate-200/90 dark:border-white/10 bg-gradient-to-br from-white via-slate-50/95 to-purple-50/50 dark:from-[#131b2e] dark:via-[#111728] dark:to-[#1e1533] shadow-xs">
        
        {/* Full-Bleed Ambient Lighting & Blueprint Grid */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[560px] w-[560px] rounded-full bg-gradient-to-br from-[#5a32fa]/20 via-[#7c3aed]/15 to-transparent blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -left-28 -bottom-28 h-[480px] w-[480px] rounded-full bg-gradient-to-tr from-[#ff2a5f]/15 via-purple-500/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#5a32fa_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.035] dark:opacity-[0.07]" />

        <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-5 sm:px-8 lg:px-12 py-12 md:py-16 lg:py-20 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-14">
          
          {/* Left Content Area */}
          <div className="flex-1 max-w-2xl 2xl:max-w-3xl space-y-6">
            
            {/* Top Pill Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5a32fa]/25 bg-gradient-to-r from-[#5a32fa]/15 via-purple-500/10 to-transparent px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#5a32fa] dark:text-violet-300 shadow-2xs backdrop-blur-md">
                <Sparkles size={13} className="text-[#5a32fa] animate-spin [animation-duration:8s]" /> 
                Member Opportunities
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                2026 Editions Now Open
              </span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="text-3xl font-black leading-[1.05] tracking-[-0.035em] sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white">
              Publications that make your expertise{' '}
              <span className="relative inline-block bg-gradient-to-r from-[#5a32fa] via-[#9055ff] to-[#ff2a5f] bg-clip-text text-transparent">
                visible.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg font-normal leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
              Explore three specialist IP publications where Alliance members can publish insight, showcase achievements, and strengthen organizational authority with an exclusive <strong className="text-slate-900 dark:text-white font-bold">35% member saving</strong>.
            </p>

            {/* Value Props Chips */}
            <div className="pt-1 flex flex-wrap gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                <BadgePercent size={15} className="text-[#5a32fa]" />
                <span>35% WIPA Member Rate</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                <Globe2 size={15} className="text-cyan-500" />
                <span>Global IP Distribution</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                <BookOpenText size={15} className="text-purple-500" />
                <span>Annual Print &amp; Digital</span>
              </div>
            </div>

            {/* Interactive CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href="#publications-grid"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#5a32fa] via-[#7c3aed] to-[#ff2a5f] hover:opacity-95 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all cursor-pointer group"
              >
                <span>Explore Publications</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>

              <Link
                href="/platform/memberships"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200/90 dark:border-white/10 transition-all cursor-pointer shadow-2xs"
              >
                <span>Member Rates &amp; Tiers</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Area with 3D Depth & Floating Glass Badges */}
          <div className="relative flex items-center justify-center lg:justify-end shrink-0 mt-6 lg:mt-0">
            
            {/* Dynamic Glow Halo behind covers */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#5a32fa]/30 via-[#ff90e8]/25 to-cyan-400/20 blur-3xl rounded-full scale-110 pointer-events-none" />

            {/* Floating Glass Badge: Top Right */}
            <div className="absolute -top-4 right-2 sm:right-6 z-20 hidden sm:flex items-center gap-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-purple-200/80 dark:border-purple-500/30 px-4 py-2.5 shadow-lg shadow-purple-500/10 animate-bounce [animation-duration:4s]">
              <BadgePercent size={18} className="text-[#5a32fa]" />
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none">Alliance Advantage</p>
                <p className="text-xs font-black text-slate-900 dark:text-white">Save 35% on Ad &amp; Articles</p>
              </div>
            </div>

            {/* Main Magazine Cover Composite Image */}
            <div className="relative z-10 transition-transform duration-500 hover:scale-[1.03] group">
              <img
                src="/images/publications-hero.png"
                alt="WIPA IP Publications"
                className="w-84 sm:w-[420px] md:w-[480px] lg:w-[540px] xl:w-[600px] 2xl:w-[650px] max-h-[460px] md:max-h-[500px] h-auto object-contain drop-shadow-[0_25px_50px_rgba(90,50,250,0.25)] select-none"
              />
            </div>

            {/* Floating Glass Badge: Bottom Left */}
            <div className="absolute -bottom-3 -left-2 sm:left-4 z-20 flex items-center gap-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 px-4 py-2.5 shadow-xl shadow-slate-900/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#5a32fa] to-[#7c3aed] text-white shadow-xs">
                <BookOpenText size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">3 Flagship Titles</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Print + Digital + Global Reach</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-5 sm:px-8 lg:px-12 py-12 md:py-16">
        <section id="publications-grid" className="scroll-mt-8">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5a32fa]">Choose a publication</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">Three platforms. One member advantage.</h2>
            </div>
            
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/90 bg-violet-50/80 px-3.5 py-1.5 shadow-xs transition hover:border-[#5a32fa]/40 self-start sm:self-auto dark:border-violet-500/20 dark:bg-violet-950/40">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#5a32fa] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-xs">
                <BadgePercent size={13} /> 35% Saving
              </span>
              <span className="text-xs sm:text-sm font-bold text-violet-950 dark:text-violet-200">
                Alliance Member Exclusive
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:gap-8">
            {publications.map((publication, index) => {
              const Icon = icons[index];
              const style = cardStyles[publication.theme];
              const coverImageMap: Record<string, string> = {
                'womens-ip-world': '/images/womens-ip-world-cover.png',
                'global-ip-magazine': '/images/global-ip-magazine-cover.png',
                'ip-tech-innovation-annual': '/images/ip-tech-annual-cover.png',
                'ip-tech-innovation-services-annual': '/images/ip-tech-annual-cover.png',
              };
              const coverImage = coverImageMap[publication.slug] || null;
              
              return (
                <Link
                  key={publication.slug}
                  href={`/${publication.slug}`}
                  className="group relative flex flex-col md:flex-row md:items-center justify-between overflow-hidden rounded-[2.25rem] md:rounded-[2.75rem] border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-[#172033]"
                >
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-64 md:inset-y-0 md:right-0 md:left-auto md:w-1/2 md:h-full bg-gradient-to-b md:bg-gradient-to-l ${style.glow}`} />
                  <div className={`pointer-events-none absolute right-4 md:right-8 top-2 text-[7rem] sm:text-[9rem] md:text-[11rem] font-black leading-none tracking-tighter ${style.number}`}>0{index + 1}</div>
                  
                  {/* Left Content Area */}
                  <div className="relative z-10 flex flex-col flex-1 max-w-2xl">
                    <span className={`publication-card-icon publication-card-icon-${publication.theme} flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl shadow-lg ${style.icon}`}>
                      <Icon size={27} className="publication-card-icon-glyph" />
                    </span>
                    <div className="mt-6 md:mt-8">
                      <p className={`text-xs font-black uppercase tracking-[0.18em] ${style.link}`}>{publication.edition}</p>
                      <h3 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.035em]">{publication.shortTitle}</h3>
                      <p className="mt-3.5 text-sm sm:text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300">{publication.summary}</p>
                    </div>
                    <div className="mt-6 md:mt-8">
                      <span className={`inline-flex items-center gap-2 text-sm font-black ${style.link}`}>
                        Open publication <ArrowRight size={17} className="transition-transform group-hover:translate-x-1.5" />
                      </span>
                    </div>
                  </div>

                  {/* Right Magazine Showcase Column */}
                  <div className="relative z-10 mt-6 md:mt-0 flex items-center justify-center md:justify-end shrink-0 md:min-w-[260px] lg:min-w-[320px]">
                    {coverImage ? (
                      <div className="relative flex items-center justify-center">
                        <div className={`absolute inset-0 bg-gradient-to-tr ${style.coverGlow} blur-3xl rounded-full scale-125 pointer-events-none`} />
                        <img
                          src={coverImage}
                          alt={`${publication.shortTitle} Cover`}
                          className="relative z-10 w-48 sm:w-56 md:w-64 lg:w-72 max-h-[290px] md:max-h-[330px] h-auto object-contain drop-shadow-2xl rotate-[22deg] group-hover:rotate-[16deg] group-hover:scale-105 transition-all duration-500 select-none"
                        />
                      </div>
                    ) : (
                      <div className="relative flex flex-col items-center justify-center w-48 sm:w-56 md:w-64 h-56 sm:h-64 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] p-4 text-center group-hover:border-[#5a32fa]/40 transition-colors">
                        <Icon size={34} className={`opacity-40 mb-2 ${style.link}`} />
                        <p className="text-xs font-black text-slate-400 dark:text-slate-400">Magazine Cover</p>
                        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">{publication.edition}</p>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10 flex flex-col gap-5 rounded-[2rem] bg-slate-950 px-6 py-8 text-white md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">Alliance advantage</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Ready to turn expertise into visibility?</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-300">Speak with the Alliance team about editorial, profile, technology showcase and advertising opportunities.</p>
          </div>
          <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-violet-100">
            Contact the team <ArrowRight size={17} />
          </Link>
        </section>
      </main>
    </div>
  );
}
