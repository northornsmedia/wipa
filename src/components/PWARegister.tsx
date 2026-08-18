'use client';

import { useEffect, useState } from 'react';
import { Download, X, Share, Smartphone, Plus } from 'lucide-react';

export default function PWARegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / running in standalone mode
    if (typeof window !== 'undefined') {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);

      // Detect iOS Safari
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
      setIsIOS(isIosDevice);

      // Register Service Worker
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then((reg) => {
              console.log('WIPA PWA Service Worker Registered:', reg.scope);
            })
            .catch((err) => {
              console.warn('WIPA Service Worker Registration Error:', err);
            });
        });
      }

      // Intercept beforeinstallprompt for Chrome / Android / Desktop
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        (window as any).deferredInstallPrompt = e;
        
        // Show banner only if user hasn't dismissed it recently
        const dismissedAt = localStorage.getItem('wipa_pwa_dismissed');
        if (!dismissedAt || Date.now() - parseInt(dismissedAt, 10) > 86400000 * 2) {
          setShowInstallBanner(true);
        }
      };

      // Custom event to trigger prompt from anywhere in the app
      const handleCustomTrigger = () => {
        const promptEvent = (window as any).deferredInstallPrompt;
        if (promptEvent) {
          promptEvent.prompt();
          promptEvent.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
              setShowInstallBanner(false);
            }
            (window as any).deferredInstallPrompt = null;
          });
        }
      };
      window.addEventListener('wipa_trigger_install', handleCustomTrigger);

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Show iOS prompt banner if on iOS and not standalone
      if (isIosDevice && !isStandaloneMode) {
        const dismissedAt = localStorage.getItem('wipa_pwa_dismissed');
        if (!dismissedAt || Date.now() - parseInt(dismissedAt, 10) > 86400000 * 2) {
          setShowInstallBanner(true);
        }
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('wipa_trigger_install', handleCustomTrigger);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('wipa_pwa_dismissed', Date.now().toString());
  };

  if (!showInstallBanner || isStandalone) return null;

  return (
    <div className="fixed bottom-20 left-3.5 right-3.5 md:left-auto md:right-6 md:bottom-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gradient-to-r from-[#0b0f19] to-[#151c2c] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-3 max-w-md mx-auto backdrop-blur-xl">
        {/* Left App Icon */}
        <div className="relative shrink-0">
          <img 
            src="/mobilelogowipa.png" 
            alt="WIPA App" 
            className="w-11 h-11 rounded-xl object-cover shadow-md ring-2 ring-[#5a32fa]/40" 
          />
        </div>

        {/* Middle Text */}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-white leading-tight flex items-center gap-1.5">
            Install WIPA App
            <span className="px-1.5 py-0.2 bg-[#5a32fa] text-[9px] font-extrabold rounded uppercase tracking-wider text-white">
              PWA
            </span>
          </h4>
          <p className="text-[11px] text-gray-300 truncate mt-0.5">
            {isIOS 
              ? 'Tap Share ➔ "Add to Home Screen"' 
              : 'Fast, full-screen native experience'}
          </p>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isIOS ? (
            <div className="flex items-center gap-1 bg-white/10 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl border border-white/10">
              <Share size={13} className="text-[#ff90e8]" />
              <span>Add</span>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#5a32fa] to-[#ff2a5f] hover:opacity-90 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md active:scale-95 transition-all"
            >
              <Download size={13} />
              <span>Install</span>
            </button>
          )}

          <button
            onClick={handleDismiss}
            aria-label="Close install prompt"
            className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
