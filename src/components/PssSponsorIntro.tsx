'use client';

import { ArrowUpRight, Network, ShieldCheck, Sparkles, X } from 'lucide-react';

type PssSponsorIntroProps = {
  fading: boolean;
  onDismiss: () => void;
};

const principles = [
  { label: 'People', icon: Network },
  { label: 'Structure', icon: ShieldCheck },
  { label: 'Strategy', icon: Sparkles },
];

export default function PssSponsorIntro({ fading, onDismiss }: PssSponsorIntroProps) {
  return (
    <div
      role="dialog"
      aria-label="PSS Solutions sponsor introduction"
      onClick={onDismiss}
      className={`fixed bottom-0 left-0 right-0 top-[var(--platform-header-height)] z-30 cursor-pointer overflow-hidden bg-white/95 p-5 backdrop-blur-xl transition-all duration-500 lg:left-[var(--desktop-sidebar-width)] dark:bg-[#020617]/95 ${
        fading ? 'pointer-events-none scale-[0.985] opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      <div className="pss-sponsor-grid pointer-events-none absolute inset-0 opacity-70 dark:opacity-40" />
      <div className="pss-sponsor-glow pointer-events-none absolute left-1/2 top-1/2 h-[430px] w-[680px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/30 blur-[90px] dark:bg-sky-500/15" />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDismiss();
        }}
        className="absolute right-5 top-5 z-50 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/75 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-500 backdrop-blur transition hover:border-sky-300 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-sky-300"
      >
        Skip <X size={13} />
      </button>

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <div className="pss-sponsor-kicker flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-slate-500 sm:text-sm dark:text-slate-400">
            <span className="h-px w-8 bg-slate-300 sm:w-14 dark:bg-white/20" />
            Sponsored by
            <span className="h-px w-8 bg-slate-300 sm:w-14 dark:bg-white/20" />
          </div>

          <div className="pss-sponsor-brand relative mt-5 max-w-full overflow-hidden px-4 py-2">
            <h2 className="relative z-10 whitespace-nowrap text-[clamp(2.7rem,8.5vw,7rem)] font-black leading-none tracking-[-0.065em]">
              <span className="text-[#075985] dark:text-sky-300">PSS</span>{' '}
              <span className="text-slate-950 dark:text-white">Solutions</span>
            </h2>
            <span aria-hidden="true" className="pss-sponsor-shimmer pointer-events-none absolute -bottom-2 -top-2 w-20 rotate-12 bg-gradient-to-r from-transparent via-white/80 to-transparent blur-sm dark:via-sky-200/30" />
          </div>

          <div className="mt-5 h-1 w-32 overflow-hidden rounded-full bg-slate-200 sm:w-48 dark:bg-white/10">
            <span className="pss-sponsor-progress block h-full origin-left rounded-full bg-gradient-to-r from-sky-600 via-cyan-400 to-indigo-500" />
          </div>

          <p className="pss-sponsor-subtitle mt-6 max-w-2xl px-5 text-sm font-semibold leading-6 text-slate-600 sm:text-base dark:text-slate-300">
            Independent IP operations consultancy bringing clarity to complex transformation.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 px-4">
            {principles.map(({ label, icon: Icon }, index) => (
              <span
                key={label}
                style={{ animationDelay: `${0.55 + index * 0.18}s` }}
                className="pss-sponsor-principle inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-3.5 py-2 text-xs font-extrabold text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                <Icon size={14} className="text-sky-600 dark:text-sky-300" /> {label}
              </span>
            ))}
          </div>

          <span className="pss-sponsor-hint mt-8 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            Continue to IP Services <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}
