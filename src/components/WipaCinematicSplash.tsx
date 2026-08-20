'use client';

import { motion } from 'framer-motion';

const nodes = [
  [14, 27], [27, 18], [43, 31], [62, 19], [82, 29],
  [18, 63], [35, 74], [55, 63], [72, 76], [87, 59],
];

export default function WipaCinematicSplash({ preview = false }: { preview?: boolean }) {
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#090018] text-white">
      <motion.div
        className="absolute inset-[-30%] bg-[conic-gradient(from_210deg_at_50%_50%,#090018,#5b16cb,#fa2b81,#27106f,#090018)] opacity-70 blur-3xl"
        animate={{ rotate: 360, scale: [1, 1.08, 1] }}
        transition={{ rotate: { duration: 18, repeat: Infinity, ease: 'linear' }, scale: { duration: 5, repeat: Infinity } }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#090018_72%)]" />

      <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {nodes.slice(0, -1).map((node, index) => {
          const next = nodes[(index + 3) % nodes.length];
          return (
            <motion.line
              key={`line-${index}`}
              x1={node[0]} y1={node[1]} x2={next[0]} y2={next[1]}
              stroke="url(#networkGlow)" strokeWidth=".16"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [.1, .8, .25] }}
              transition={{ duration: 1.3, delay: .12 * index, repeat: Infinity, repeatDelay: 1.6 }}
            />
          );
        })}
        <defs>
          <linearGradient id="networkGlow"><stop stopColor="#bd7cff"/><stop offset="1" stopColor="#ff3f94"/></linearGradient>
        </defs>
      </svg>

      {nodes.map(([left, top], index) => (
        <motion.span
          key={`${left}-${top}`}
          className="absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_4px_#c66cff]"
          style={{ left: `${left}%`, top: `${top}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.7, .8], opacity: [0, 1, .45] }}
          transition={{ duration: 1.5, delay: .08 * index, repeat: Infinity, repeatDelay: 1.45 }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          className="absolute h-48 w-48 rounded-full border border-fuchsia-300/20"
          initial={{ scale: .25, opacity: 0 }} animate={{ scale: [1, 1.55], opacity: [.65, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.div
          className="mb-3 text-[clamp(4.5rem,24vw,8rem)] font-black leading-none tracking-[-.08em]"
          initial={{ opacity: 0, scale: .65, filter: 'blur(18px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: .8, ease: [0.16, 1, 0.3, 1] }}
        >
          {'WIPA'.split('').map((letter, index) => (
            <motion.span
              key={letter}
              className="inline-block bg-gradient-to-b from-white via-white to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(220,130,255,.65)]"
              initial={{ y: 38, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: .18 + index * .1, duration: .65, ease: [0.16, 1, 0.3, 1] }}
            >{letter}</motion.span>
          ))}
          <motion.span className="ml-3 inline-block h-3 w-3 rounded-full bg-[#ff327f] shadow-[0_0_22px_8px_rgba(255,50,127,.55)]" animate={{ scale: [1, 1.45, 1] }} transition={{ duration: 1.1, repeat: Infinity }} />
        </motion.div>

        <motion.div className="h-px w-56 bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .65, duration: .65 }} />
        <motion.p className="mt-5 text-xs font-semibold uppercase tracking-[.34em] text-purple-100 sm:text-sm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .85, duration: .6 }}>
          Ideas connect. Impact begins.
        </motion.p>
        <motion.p className="mt-2 text-[10px] uppercase tracking-[.24em] text-white/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          Women in Intellectual Property Alliance
        </motion.p>
      </div>

      {preview && <div className="absolute bottom-5 z-20 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-widest text-white/55 backdrop-blur-md">Animation preview</div>}
    </div>
  );
}
