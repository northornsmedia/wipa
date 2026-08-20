'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export default function NativeBackHandler() {
  const pathname = usePathname();
  const router = useRouter();
  const lastBackPress = useRef(0);
  const [showExitHint, setShowExitHint] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let hintTimer: ReturnType<typeof setTimeout> | undefined;
    const listener = App.addListener('backButton', ({ canGoBack }) => {
      const isPlatformHome = pathname === '/platform';
      const isRootScreen = pathname === '/' || pathname === '/login';

      if (!isPlatformHome && !isRootScreen) {
        if (canGoBack) router.back();
        else if (pathname.startsWith('/platform/')) router.replace('/platform');
        else router.replace('/');
        return;
      }

      const now = Date.now();
      if (now - lastBackPress.current < 1800) {
        App.exitApp();
        return;
      }

      lastBackPress.current = now;
      setShowExitHint(true);
      if (hintTimer) clearTimeout(hintTimer);
      hintTimer = setTimeout(() => setShowExitHint(false), 1800);
    });

    return () => {
      if (hintTimer) clearTimeout(hintTimer);
      listener.then((handle) => handle.remove());
    };
  }, [pathname, router]);

  if (!showExitHint) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-[20000] flex justify-center px-4">
      <div className="rounded-full bg-black/85 px-5 py-2.5 text-sm font-medium text-white shadow-xl backdrop-blur-md">
        Press back again to exit WIPA
      </div>
    </div>
  );
}
