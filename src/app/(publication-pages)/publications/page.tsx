import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgePercent, BookOpenText, Cpu, Globe2, Sparkles } from "lucide-react";
import { publications, type PublicationTheme } from "@/lib/publications";

export const metadata: Metadata = {
  title: "Publications | WIPA",
  description: "Exclusive publication and visibility opportunities for Women’s IP Alliance members.",
};

const cardStyles: Record<PublicationTheme, { glow: string; icon: string; link: string; number: string }> = {
  rose: {
    glow: "from-rose-500/25 via-fuchsia-500/5 to-transparent",
    icon: "bg-rose-500 text-white shadow-rose-500/25",
    link: "text-rose-600 dark:text-rose-300",
    number: "text-rose-100 dark:text-rose-400/10",
  },
  violet: {
    glow: "from-violet-500/25 via-indigo-500/5 to-transparent",
    icon: "bg-violet-600 text-white shadow-violet-600/25",
    link: "text-violet-600 dark:text-violet-300",
    number: "text-violet-100 dark:text-violet-400/10",
  },
  cyan: {
    glow: "from-cyan-500/25 via-sky-500/5 to-transparent",
    icon: "bg-cyan-700 text-white shadow-cyan-700/25",
    link: "text-cyan-700 dark:text-cyan-300",
    number: "text-cyan-100 dark:text-cyan-400/10",
  },
};

const icons = [BookOpenText, Globe2, Cpu];

export default function PublicationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-950 dark:bg-[#0f172a] dark:text-white">
      <main className="mx-auto max-w-[1320px] px-5 py-8 md:px-8 md:py-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-10 shadow-sm md:rounded-[2.75rem] md:px-12 md:py-16 dark:border-white/10 dark:bg-[#172033]">
          <div className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-[#5a32fa]/15 blur-3xl" />
          <div className="relative z-10 max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#5a32fa]/15 bg-[#5a32fa]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#5a32fa] dark:text-violet-300">
              <Sparkles size={14} /> Member opportunities
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-7xl">
              Publications that make your expertise <span className="text-[#5a32fa]">visible.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-slate-600 md:text-xl dark:text-slate-300">
              Explore three specialist IP publications where Alliance members can publish insight, showcase achievements and strengthen organisational visibility with an exclusive 35% saving.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5a32fa]">Choose a publication</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">Three platforms. One member advantage.</h2>
            </div>
            
            <div className="relative group/discount inline-flex items-center self-start sm:self-auto">
              {/* Animated glowing backdrop aura */}
              <div className="crazy-discount-aura absolute -inset-1 rounded-full blur-md opacity-75 group-hover/discount:opacity-100 transition duration-500" />
              
              {/* Main pill container */}
              <div className="relative inline-flex items-center gap-2.5 rounded-full border border-white/80 dark:border-white/20 bg-white/95 dark:bg-slate-900/95 px-4 py-2 shadow-lg shadow-purple-500/20 backdrop-blur-xl transition-all duration-300 group-hover/discount:scale-105 group-hover/discount:shadow-xl group-hover/discount:shadow-pink-500/30">
                {/* Live ping beacon */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2a5f] opacity-80" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff2a5f]" />
                </span>

                {/* Crazy gradient percentage badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#ff2a5f] via-[#a855f7] to-[#5a32fa] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#ff2a5f]/40">
                  <Sparkles size={13} className="crazy-sparkle-spin text-amber-300" /> 35% OFF
                </span>

                {/* Text */}
                <span className="text-xs sm:text-sm font-black tracking-tight flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 dark:from-purple-300 dark:via-pink-300 dark:to-amber-300 bg-clip-text text-transparent font-black">
                    Member-Exclusive Saving
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-950/60 text-[#ff2a5f] dark:text-pink-300 uppercase tracking-widest border border-pink-200 dark:border-pink-800/60">
                    Active
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {publications.map((publication, index) => {
              const Icon = icons[index];
              const style = cardStyles[publication.theme];
              return (
                <Link
                  key={publication.slug}
                  href={`/${publication.slug}`}
                  className="group relative flex min-h-[470px] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl md:p-8 dark:border-white/10 dark:bg-[#172033]"
                >
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b ${style.glow}`} />
                  <div className={`pointer-events-none absolute right-4 top-0 text-[9rem] font-black leading-none tracking-tighter ${style.number}`}>0{index + 1}</div>
                  <div className="relative z-10 flex h-full flex-col">
                    <span className={`publication-card-icon publication-card-icon-${publication.theme} flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl shadow-lg ${style.icon}`}>
                      <Icon size={27} className="publication-card-icon-glyph" />
                    </span>
                    <div className="mt-20">
                      <p className={`text-xs font-black uppercase tracking-[0.18em] ${style.link}`}>{publication.edition}</p>
                      <h3 className="mt-3 text-3xl font-black leading-tight tracking-[-0.035em]">{publication.shortTitle}</h3>
                      <p className="mt-4 text-sm font-medium leading-7 text-slate-600 dark:text-slate-300">{publication.summary}</p>
                    </div>
                    <div className="mt-auto pt-8">
                      <span className={`inline-flex items-center gap-2 text-sm font-black ${style.link}`}>
                        Open publication <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
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
