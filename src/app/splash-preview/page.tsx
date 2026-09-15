'use client';

import { useState } from 'react';
import AppLaunchSplash from '@/components/AppLaunchSplash';

export default function SplashPreviewPage() {
  const [run, setRun] = useState(0);

  return (
    <main className="relative min-h-[100dvh] bg-[#060515] flex items-center justify-center">
      <AppLaunchSplash key={run} onComplete={() => console.log('Aperture splash finished!')} />
      
      {/* Background preview content revealed underneath */}
      <div className="text-center text-white px-6">
        <h1 className="text-3xl font-bold mb-2">Aperture Splash Complete</h1>
        <p className="text-white/60 text-sm">Underlying application interface revealed smoothly through the iris.</p>
      </div>

      <button
        onClick={() => setRun((value) => value + 1)}
        className="fixed right-5 top-5 z-[100000] rounded-full border border-white/20 bg-black/40 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xl transition hover:bg-white/20 hover:scale-105 active:scale-95"
      >
        Replay Splash
      </button>
    </main>
  );
}
