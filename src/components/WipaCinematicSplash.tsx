'use client';

import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

export default function WipaCinematicSplash({ preview = false }: { preview?: boolean }) {
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#6600FF] text-white">
      <div className="relative z-10 flex h-28 items-center justify-center text-[4.3rem] font-black leading-none" aria-label="WIPA">
        <motion.span
          className="block"
          initial={{ opacity: 0, scaleX: .18, scaleY: .35, x: 24, transformOrigin: 'left bottom' }}
          animate={{ opacity: 1, scaleX: 1, scaleY: 1, x: 0 }}
          transition={{ delay: .35, duration: .85, ease }}
        >
          W
        </motion.span>

        <motion.span
          className="relative ml-[.1em] block overflow-hidden tracking-[.04em]"
          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
          animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
          transition={{ delay: 1.35, duration: 1.15, ease }}
        >
          <span className="block">IPA</span>
          {[0, 1, 2, 3].map((slice) => (
            <motion.span
              key={slice}
              className="absolute left-0 h-[9px] w-full bg-[#6600FF]"
              style={{ top: `${20 + slice * 18}%` }}
              initial={{ x: '-105%' }} animate={{ x: '110%' }}
              transition={{ delay: 1.15 + slice * .12, duration: .7, ease }}
            />
          ))}
        </motion.span>

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
