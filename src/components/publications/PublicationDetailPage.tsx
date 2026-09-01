import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgePercent,
  BookOpenText,
  Check,
  Globe2,
  Sparkles,
} from "lucide-react";
import type { Publication, PublicationTheme } from "@/lib/publications";

const themeStyles: Record<PublicationTheme, {
  accent: string;
  badge: string;
  button: string;
  glow: string;
  icon: string;
  panel: string;
}> = {
  rose: {
    // Women's IP World: Purple
    accent: "text-purple-600 dark:text-purple-300",
    badge: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-400/20 dark:bg-purple-400/10 dark:text-purple-300",
    button: "bg-gradient-to-r from-[#5a32fa] to-purple-600 hover:from-[#4925d4] hover:to-purple-700 shadow-purple-600/25",
    glow: "from-purple-600/30 via-violet-400/15 to-transparent",
    icon: "bg-purple-100 text-purple-600 dark:bg-purple-400/10 dark:text-purple-300",
    panel: "border-purple-200/80 bg-purple-50/80 dark:border-purple-400/15 dark:bg-purple-400/5",
  },
  violet: {
    // Global IP Magazine: Ice Blue
    accent: "text-sky-600 dark:text-sky-300",
    badge: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300",
    button: "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 shadow-sky-500/25",
    glow: "from-sky-400/30 via-cyan-400/15 to-transparent",
    icon: "bg-sky-100 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300",
    panel: "border-sky-200/80 bg-sky-50/80 dark:border-sky-400/15 dark:bg-sky-400/5",
  },
  cyan: {
    // IP Tech & Innovation: Dark Blue
    accent: "text-blue-800 dark:text-blue-300",
    badge: "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-200",
    button: "bg-gradient-to-r from-blue-900 to-indigo-950 hover:from-blue-950 hover:to-slate-950 shadow-blue-900/30",
    glow: "from-blue-900/40 via-indigo-950/20 to-transparent",
    icon: "bg-blue-100 text-blue-900 dark:bg-blue-950/50 dark:text-blue-200",
    panel: "border-blue-200/80 bg-blue-50/80 dark:border-blue-500/20 dark:bg-blue-950/20",
  },
};

export default function PublicationDetailPage({ publication }: { publication: Publication }) {
  const theme = themeStyles[publication.theme];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-950 dark:bg-[#0f172a] dark:text-white">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#111827]/90">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link href="/publications" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#5a32fa] dark:text-slate-300">
            <ArrowLeft size={17} /> Publications
          </Link>
          <span className={`hidden rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] sm:inline-flex ${theme.badge}`}>
            Alliance member exclusive
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-5 pt-7 md:px-8 md:pt-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-10 text-white shadow-2xl shadow-slate-950/10 md:rounded-[2.75rem] md:px-12 md:py-16 lg:px-16 dark:border-white/10">
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.glow}`} />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 top-10 h-52 w-52 rounded-full border border-white/10" />
          <div className="relative z-10 max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white/85 backdrop-blur">
                {publication.edition}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white shadow-xs backdrop-blur">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                  <BadgePercent size={12} /> 35% Saving
                </span>
                <span className="text-white/90">Alliance Member Exclusive</span>
              </span>
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-7xl">
              {publication.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-slate-300 md:text-xl">
              {publication.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#overview" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black text-white shadow-lg transition ${theme.button}`}>
                Read the overview <ArrowUpRight size={17} />
              </Link>
              {publication.website && (
                <a href={publication.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10">
                  Visit publication <Globe2 size={17} />
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="-mt-1 grid grid-cols-1 gap-px overflow-hidden rounded-b-[2rem] border border-t-0 border-slate-200 bg-slate-200 shadow-sm sm:grid-cols-3 dark:border-white/10 dark:bg-white/10">
          {publication.stats.map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-7 dark:bg-[#172033]">
              <div className={`text-3xl font-black tracking-tight ${theme.accent}`}>{stat.value}</div>
              <div className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-8">
            <section id="overview" className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10 dark:border-white/10 dark:bg-[#172033]">
              <div className="mb-6 flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${theme.icon}`}><BookOpenText size={22} /></span>
                <div>
                  <p className={`text-xs font-black uppercase tracking-[0.2em] ${theme.accent}`}>Publication brief</p>
                  <h2 className="text-2xl font-black tracking-tight md:text-3xl">Overview</h2>
                </div>
              </div>
              <div className="space-y-5 text-[15px] font-medium leading-7 text-slate-600 md:text-base md:leading-8 dark:text-slate-300">
                {publication.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10 dark:border-white/10 dark:bg-[#172033]">
              <p className={`text-xs font-black uppercase tracking-[0.2em] ${theme.accent}`}>Inside the publication</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">About {publication.shortTitle}</h2>
              <div className="mt-6 space-y-5 text-[15px] font-medium leading-7 text-slate-600 md:text-base md:leading-8 dark:text-slate-300">
                {publication.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-white/10 dark:bg-[#172033]">
                <h2 className="text-xl font-black tracking-tight">{publication.opportunitiesTitle}</h2>
                <ul className="mt-6 space-y-4">
                  {publication.opportunities.map((item) => (
                    <li key={item} className="flex gap-3 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${theme.icon}`}><Check size={13} strokeWidth={3} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-white/10 dark:bg-[#172033]">
                <h2 className="text-xl font-black tracking-tight">{publication.reasonsTitle}</h2>
                <ul className="mt-6 space-y-4">
                  {publication.reasons.map((item) => (
                    <li key={item} className="flex gap-3 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${theme.icon}`}><Sparkles size={12} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {publication.rates && (
              <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#172033]">
                <div className="border-b border-slate-200 px-6 py-6 md:px-8 dark:border-white/10">
                  <p className={`text-xs font-black uppercase tracking-[0.2em] ${theme.accent}`}>Selected 2027 rates</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight">Your 35% member saving</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
                      <tr><th className="px-6 py-4">Opportunity</th><th className="px-6 py-4">Standard</th><th className="px-6 py-4">Member rate</th><th className="px-6 py-4">You save</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {publication.rates.map((rate) => (
                        <tr key={rate.opportunity}>
                          <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{rate.opportunity}</td>
                          <td className="px-6 py-4 text-slate-500 line-through dark:text-slate-400">{rate.standardRate}</td>
                          <td className={`px-6 py-4 font-black ${theme.accent}`}>{rate.memberRate}</td>
                          <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">{rate.saving}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className={`rounded-[2rem] border p-6 md:p-7 ${theme.panel}`}>
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.icon}`}><BadgePercent size={24} /></span>
              <p className={`mt-5 text-xs font-black uppercase tracking-[0.2em] ${theme.accent}`}>Member benefit</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">Save 35%</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-slate-600 dark:text-slate-300">{publication.memberBenefit}</p>
              <Link href="/contact" className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white shadow-lg transition ${theme.button}`}>
                Discuss an opportunity <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#172033]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Explore more</p>
              <Link href="/publications" className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#5a32fa] hover:underline">
                View all publications <ArrowUpRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
