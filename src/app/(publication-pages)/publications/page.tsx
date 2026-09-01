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
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm md:rounded-[2.5rem] md:px-10 md:py-10 dark:border-white/10 dark:bg-[#172033]">
          <div className="pointer-events-none absolute -right-32 -top-40 h-[380px] w-[380px] rounded-full bg-[#5a32fa]/10 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
            <div className="flex-1 max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5a32fa]/15 bg-[#5a32fa]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#5a32fa] dark:text-violet-300">
                <Sparkles size={13} /> Member opportunities
              </span>
              <h1 className="mt-4 text-3xl font-black leading-[1.05] tracking-[-0.035em] sm:text-4xl md:text-5xl">
                Publications that make your expertise <span className="text-[#5a32fa]">visible.</span>
              </h1>
              <p className="mt-3.5 text-sm sm:text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                Explore three specialist IP publications where Alliance members can publish insight, showcase achievements and strengthen organisational visibility with an exclusive 35% saving.
              </p>
            </div>

            <div className="relative flex items-center justify-center md:justify-end shrink-0 translate-x-2 sm:translate-x-4 md:translate-x-7 lg:translate-x-8 translate-y-7 sm:translate-y-11 md:translate-y-14 lg:translate-y-16 -mr-2 sm:-mr-4 md:-mr-6 -mb-7 sm:-mb-11 md:-mb-14 lg:-mb-16">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#5a32fa]/25 via-[#ff90e8]/20 to-transparent blur-3xl rounded-full scale-110 pointer-events-none" />
              <img
                src="/images/publications-hero.png"
                alt="WIPA IP Publications"
                className="relative z-10 w-76 sm:w-96 md:w-[440px] lg:w-[540px] xl:w-[580px] max-h-[410px] md:max-h-[460px] h-auto object-contain drop-shadow-2xl rotate-0 hover:scale-105 transition-all duration-300 select-none"
              />
            </div>
          </div>
        </section>

        <section className="mt-10">
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
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#5a32fa]/20 via-[#ff90e8]/20 to-transparent blur-3xl rounded-full scale-110 pointer-events-none" />
                        <img
                          src={coverImage}
                          alt={`${publication.shortTitle} Cover`}
                          className="relative z-10 w-48 sm:w-56 md:w-64 lg:w-72 max-h-[290px] md:max-h-[330px] h-auto object-contain drop-shadow-2xl -rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 select-none"
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
