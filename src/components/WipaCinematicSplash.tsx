'use client';

import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

export default function WipaCinematicSplash({ preview = false }: { preview?: boolean }) {
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#6600FF] text-white">
      <div className="relative z-10 flex h-28 items-center justify-center" aria-label="WIPA">
        <motion.span
          className="block text-[4.3rem] font-black leading-none"
          initial={{ opacity: 0, scaleX: .18, scaleY: .35, x: 24, transformOrigin: 'left bottom' }}
          animate={{ opacity: 1, scaleX: 1, scaleY: 1, x: 0 }}
          transition={{ delay: .35, duration: .85, ease }}
        >
          W
        </motion.span>

        <motion.div
          className="relative ml-[.1em] overflow-hidden text-[4.3rem] font-black leading-none tracking-[.04em]"
          initial={{ width: 0 }} animate={{ width: '2.5em' }}
          transition={{ delay: 1.35, duration: 1.15, ease }}
        >
          <span className="block -translate-y-[1px]">IPA</span>
          {[0, 1, 2, 3].map((slice) => (
            <motion.span
              key={slice}
              className="absolute left-0 h-[9px] w-full bg-[#6600FF]"
              style={{ top: `${20 + slice * 18}%` }}
              initial={{ x: '-105%' }} animate={{ x: '110%' }}
              transition={{ delay: 1.15 + slice * .12, duration: .7, ease }}
            />
          ))}
        </motion.div>

      </div>

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
