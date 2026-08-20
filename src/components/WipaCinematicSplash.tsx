'use client';

import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

export default function WipaCinematicSplash({ preview = false }: { preview?: boolean }) {
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#071078] text-white">
      <motion.div
        className="absolute -left-1/2 -top-1/3 h-[85vh] w-[85vh] rounded-full bg-[#7819e8]/55 blur-[110px]"
        animate={{ x: ['-8%', '12%', '-8%'], y: ['-5%', '8%', '-5%'], opacity: [.45, .7, .45] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-1/3 -right-1/2 h-[80vh] w-[80vh] rounded-full bg-[#3515bb]/50 blur-[120px]"
        animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 6, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,5,75,.42)_80%)]" />

      <div className="relative z-10 flex h-28 items-center justify-center" aria-label="WIPA">
        <div className="relative flex items-end gap-[3px] pr-1">
          {[18, 30, 44, 58].map((height, index) => (
            <motion.span
              key={height}
              className="block w-[7px] bg-white"
              style={{ height }}
              initial={{ opacity: 0, scaleY: 0, x: 24 - index * 8, y: 18 - index * 6 }}
              animate={{ opacity: 1, scaleY: 1, x: 0, y: 0 }}
              transition={{ delay: .35 + index * .13, duration: .55, ease }}
            />
          ))}
        </div>

        <motion.div
          className="relative overflow-hidden text-[4.3rem] font-black leading-none tracking-[-.09em]"
          initial={{ width: 0 }} animate={{ width: '2.32em' }}
          transition={{ delay: 1.35, duration: 1.15, ease }}
        >
          <span className="block -translate-y-[1px]">IPA</span>
          {[0, 1, 2, 3].map((slice) => (
            <motion.span
              key={slice}
              className="absolute left-0 h-[9px] w-full bg-[#071078]"
              style={{ top: `${20 + slice * 18}%` }}
              initial={{ x: '-105%' }} animate={{ x: '110%' }}
              transition={{ delay: 1.15 + slice * .12, duration: .7, ease }}
            />
          ))}
        </motion.div>

        <motion.span
          className="mb-[45px] ml-3 h-3 w-3 rounded-full bg-[#ff3b8d] shadow-[0_0_16px_4px_rgba(255,59,141,.45)]"
          initial={{ opacity: 0, scale: 0, x: -22 }}
          animate={{ opacity: 1, scale: [0, 1.35, 1], x: 0 }}
          transition={{ delay: 2.35, duration: .62, ease }}
        />
      </div>

      <motion.p
        className="absolute mt-32 text-[10px] font-semibold uppercase tracking-[.34em] text-white/65"
        initial={{ opacity: 0, y: 8, letterSpacing: '.1em' }}
        animate={{ opacity: 1, y: 0, letterSpacing: '.34em' }}
        transition={{ delay: 2.75, duration: .8, ease }}
      >
        Connect · Create · Lead
      </motion.p>

      <motion.div
        className="pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl"
        initial={{ left: '-25%' }} animate={{ left: '120%' }} transition={{ delay: 1.8, duration: 1.1, ease: 'easeInOut' }}
      />

      {preview && (
        <div className="absolute bottom-5 z-20 rounded-full border border-white/10 bg-black/10 px-4 py-2 text-[10px] uppercase tracking-widest text-white/45 backdrop-blur-md">
          Reference-inspired code preview
        </div>
      )}
    </div>
  );
}
