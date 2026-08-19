'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';

interface MobilePullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  pullThreshold?: number;
}

export default function MobilePullToRefresh({
  children,
  onRefresh,
  pullThreshold = 75,
}: MobilePullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const isPullingRef = useRef(false);
  const startYRef = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 1 && !isRefreshing) {
        isPullingRef.current = true;
        startYRef.current = e.touches[0].clientY;
        setStartY(e.touches[0].clientY);
      } else {
        isPullingRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPullingRef.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const rawDelta = currentY - startYRef.current;

      if (rawDelta > 0 && window.scrollY <= 1) {
        // Prevent mobile Chrome / Safari from taking over with their native loader!
        if (e.cancelable) {
          e.preventDefault();
        }

        // Apply smooth rubber-band resistance curve
        const dampened = Math.min(120, Math.pow(rawDelta, 0.82) * 2.2);
        setPullDistance(dampened);

        // Haptic feedback tick
        if (dampened >= pullThreshold && typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate?.(12);
          } catch {}
        }
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPullingRef.current) return;
      isPullingRef.current = false;

      if (pullDistance >= pullThreshold && !isRefreshing) {
        setIsRefreshing(true);
        setPullDistance(pullThreshold);

        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate?.([15, 35, 15]);
          } catch {}
        }

        try {
          if (onRefresh) {
            await onRefresh();
          } else {
            await new Promise((resolve) => setTimeout(resolve, 800));
            window.location.reload();
          }
        } catch (err) {
          console.error("Pull to refresh error:", err);
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
    };

    // Attach touch listeners with passive: false to allow e.preventDefault()
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing, pullThreshold, onRefresh]);

  const progress = Math.min(1, pullDistance / pullThreshold);
  const isReady = pullDistance >= pullThreshold;

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden touch-pan-y">
      {/* FLOATING PULL-DOWN CAT MASCOT DRAWER (Mobile Only) */}
      <AnimatePresence>
        {(pullDistance > 10 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="fixed top-14 inset-x-0 mx-auto w-[92%] max-w-sm z-50 md:hidden pointer-events-none"
          >
            <div className="relative overflow-hidden rounded-3xl p-3.5 bg-slate-950/95 border border-[#5a32fa]/40 shadow-2xl shadow-[#5a32fa]/30 backdrop-blur-xl flex items-center justify-between gap-3">
              
              {/* Dynamic Breathing Gradient Background */}
              <div className="absolute inset-0 opacity-60 pointer-events-none">
                <AnimatedGradientBackground
                  startingGap={90}
                  Breathing={true}
                  animationSpeed={0.06}
                  gradientColors={[
                    "#5a32fa",
                    "#ff90e8",
                    "#ffc900",
                    "#00d26a",
                    "#7952ff",
                    "#0f172a",
                    "#050811"
                  ]}
                  gradientStops={[15, 30, 48, 65, 80, 92, 100]}
                />
              </div>

              {/* Cat Avatar Mascot Icon */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  
                  {/* Glowing Aura Ring */}
                  <motion.div
                    animate={{
                      scale: isRefreshing ? [1, 1.25, 1] : 1 + progress * 0.25,
                      rotate: isRefreshing ? 360 : progress * 180,
                    }}
                    transition={isRefreshing ? { repeat: Infinity, duration: 1.5, ease: 'linear' } : {}}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#5a32fa] via-[#ff90e8] to-[#00d26a] opacity-70 blur-sm"
                  />

                  <motion.div
                    animate={{
                      scale: isRefreshing ? [1, 1.08, 1] : 0.85 + progress * 0.25,
                      rotate: isReady ? [0, -6, 6, -3, 0] : 0,
                    }}
                    transition={{ repeat: isRefreshing ? Infinity : 0, duration: 0.8 }}
                    className="w-11 h-11 rounded-2xl bg-white dark:bg-[#151c2c] border border-white/40 shadow-md flex items-center justify-center relative overflow-hidden"
                  >
                    {/* SVG Cat Mascot */}
                    <svg viewBox="0 0 64 64" className="w-8 h-8">
                      {/* Ears */}
                      <path d="M14 26 L22 10 L30 24 Z" fill="#ff90e8" />
                      <path d="M17 24 L22 14 L27 23 Z" fill="#ffffff" opacity="0.6" />
                      <path d="M50 26 L42 10 L34 24 Z" fill="#ff90e8" />
                      <path d="M47 24 L42 14 L37 23 Z" fill="#ffffff" opacity="0.6" />

                      {/* Head */}
                      <circle cx="32" cy="36" r="20" fill="#5a32fa" />

                      {/* Eyes */}
                      {isReady || isRefreshing ? (
                        <>
                          <path d="M22 34 Q26 28 30 34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                          <path d="M34 34 Q38 28 42 34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        </>
                      ) : (
                        <>
                          <circle cx="25" cy="33" r="3.5" fill="#ffffff" />
                          <circle cx="26" cy="32" r="1.5" fill="#151c2c" />
                          <circle cx="39" cy="33" r="3.5" fill="#ffffff" />
                          <circle cx="40" cy="32" r="1.5" fill="#151c2c" />
                        </>
                      )}

                      {/* Blushing Cheeks */}
                      <ellipse cx="20" cy="40" rx="3.5" ry="2" fill="#ff90e8" opacity="0.9" />
                      <ellipse cx="44" cy="40" rx="3.5" ry="2" fill="#ff90e8" opacity="0.9" />

                      {/* Nose & Mouth */}
                      <polygon points="32,38 30,35 34,35" fill="#ffc900" />
                      <path d="M30 40 Q32 43 34 40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />

                      {/* Whiskers */}
                      <line x1="12" y1="36" x2="20" y2="38" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                      <line x1="12" y1="42" x2="20" y2="41" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                      <line x1="52" y1="36" x2="44" y2="38" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                      <line x1="52" y1="42" x2="44" y2="41" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                    </svg>

                    {/* Sparkle Badge */}
                    {isReady && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-0.5 right-0.5 text-yellow-300"
                      >
                        <Sparkles size={11} className="animate-spin" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Text Description */}
                <div>
                  <h4 className="text-xs font-black text-white tracking-wide flex items-center gap-1.5">
                    {isRefreshing ? (
                      <>
                        <RefreshCw size={12} className="animate-spin text-[#ff90e8]" />
                        Updating WIPA Feed
                      </>
                    ) : isReady ? (
                      <>Release to Refresh 🐾</>
                    ) : (
                      <>Pull down to refresh</>
                    )}
                  </h4>
                  <p className="text-[10px] text-gray-300 font-medium">
                    {isRefreshing ? 'Fetching latest posts & updates...' : 'Release whenever you are ready'}
                  </p>
                </div>
              </div>

              {/* Progress Indicator Gauge */}
              <div className="relative z-10 w-9 h-9 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 36 36" className="w-8 h-8 transform -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#pullProgressGradient)"
                    strokeWidth="3.5"
                    strokeDasharray={`${progress * 100}, 100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="pullProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff90e8" />
                      <stop offset="100%" stopColor="#5a32fa" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT SLIDE DOWN EFFECT */}
      <motion.div
        animate={{
          y: isRefreshing ? 70 : pullDistance * 0.45,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </div>
  );
}
