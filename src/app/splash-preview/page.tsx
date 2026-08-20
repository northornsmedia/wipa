'use client';

import { useState } from 'react';
import WipaCinematicSplash from '@/components/WipaCinematicSplash';

export default function SplashPreviewPage() {
  const [run, setRun] = useState(0);

  return (
    <main className="relative min-h-[100dvh] bg-[#090018]">
      <WipaCinematicSplash key={run} preview />
      <button
        onClick={() => setRun((value) => value + 1)}
        className="fixed right-5 top-5 z-50 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xl transition hover:bg-white/15"
      >
        Replay
      </button>
    </main>
  );
}
