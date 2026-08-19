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
  pullThreshold = 80,
}: MobilePullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const isPullingRef = useRef(false);

  useEffect(() => {
    let touchStartHandler: (e: TouchEvent) => void;
    let touchMoveHandler: (e: TouchEvent) => void;
    let touchEndHandler: () => void;

    touchStartHandler = (e: TouchEvent) => {
      if (window.scrollY <= 0 && !isRefreshing) {
        isPullingRef.current = true;
        setStartY(e.touches[0].clientY);
      }
    };

    touchMoveHandler = (e: TouchEvent) => {
      if (!isPullingRef.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const rawDelta = currentY - startY;

      if (rawDelta > 0 && window.scrollY <= 0) {
        // Apply smooth rubber-band resistance curve
        const dampened = Math.min(130, Math.pow(rawDelta, 0.85) * 1.8);
        setPullDistance(dampened);

        // Haptic feedback when threshold reached
        if (dampened >= pullThreshold && typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate?.(10);
          } catch {}
        }
      } else {
        setPullDistance(0);
      }
    };

    touchEndHandler = async () => {
      if (!isPullingRef.current) return;
      isPullingRef.current = false;

      if (pullDistance >= pullThreshold && !isRefreshing) {
        setIsRefreshing(true);
        setPullDistance(pullThreshold);
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate?.([15, 30, 15]);
          } catch {}
        }

        try {
          if (onRefresh) {
            await onRefresh();
          } else {
            // Default smooth reload
            await new Promise((resolve) => setTimeout(resolve, 900));
            window.location.reload();
          }
        } catch (err) {
          console.error("Refresh error:", err);
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
    };

    window.addEventListener('touchstart', touchStartHandler, { passive: true });
    window.addEventListener('touchmove', touchMoveHandler, { passive: true });
    window.addEventListener('touchend', touchEndHandler);

    return () => {
      window.removeEventListener('touchstart', touchStartHandler);
      window.removeEventListener('touchmove', touchMoveHandler);
      window.removeEventListener('touchend', touchEndHandler);
    };
  }, [startY, pullDistance, isRefreshing, pullThreshold, onRefresh]);

  const progress = Math.min(1, pullDistance / pullThreshold);
  const isReady = pullDistance >= pullThreshold;

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* PULL TO REFRESH HEADER ANIMATION (Mobile Only) */}
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: Math.max(pullDistance, isRefreshing ? pullThreshold : 0),
            }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="w-full overflow-hidden relative flex flex-col items-center justify-center pointer-events-none z-40 md:hidden bg-slate-950/90 border-b border-[#5a32fa]/30 backdrop-blur-md"
          >
            {/* Dynamic Breathing Gradient Background */}
            <div className="absolute inset-0 opacity-70">
              <AnimatedGradientBackground
                startingGap={80}
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

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 py-2">
              
              {/* PLAYFUL ANIMATED CAT MASCOT */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                
                {/* Glowing Aura Ring */}
                <motion.div
                  animate={{
                    scale: isRefreshing ? [1, 1.25, 1] : 1 + progress * 0.25,
                    rotate: isRefreshing ? 360 : progress * 180,
                  }}
                  transition={isRefreshing ? { repeat: Infinity, duration: 1.5, ease: 'linear' } : {}}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#5a32fa] via-[#ff90e8] to-[#00d26a] opacity-60 blur-sm"
                />

                {/* Cat Avatar Container */}
                <motion.div
                  animate={{
                    scale: isRefreshing ? [1, 1.1, 1] : 0.8 + progress * 0.35,
                    rotate: isReady ? [0, -6, 6, -3, 0] : 0,
                    y: isRefreshing ? [0, -3, 0] : 0,
                  }}
                  transition={{ repeat: isRefreshing ? Infinity : 0, duration: 0.8 }}
                  className="w-11 h-11 rounded-2xl bg-white dark:bg-[#151c2c] border border-white/40 shadow-lg flex items-center justify-center relative overflow-hidden"
                >
                  {/* Cat SVG Illustration */}
                  <svg
                    viewBox="0 0 64 64"
                    className="w-8 h-8 transition-transform duration-200"
                    style={{ transform: `scale(${0.85 + progress * 0.2})` }}
                  >
                    {/* Cat Ears */}
                    <path d="M14 26 L22 10 L30 24 Z" fill="#ff90e8" />
                    <path d="M17 24 L22 14 L27 23 Z" fill="#ffffff" opacity="0.6" />
                    <path d="M50 26 L42 10 L34 24 Z" fill="#ff90e8" />
                    <path d="M47 24 L42 14 L37 23 Z" fill="#ffffff" opacity="0.6" />

                    {/* Cat Head */}
                    <circle cx="32" cy="36" r="20" fill="#5a32fa" />

                    {/* Cute Eyes (Winking / Blinking based on pull progress) */}
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

                  {/* Sparkle badge when ready */}
                  {isReady && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0 right-0 p-0.5 text-yellow-300"
                    >
                      <Sparkles size={10} className="animate-spin" />
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Status Label */}
              <div className="flex items-center gap-1.5">
                {isRefreshing ? (
                  <>
                    <RefreshCw size={11} className="animate-spin text-white" />
                    <span className="text-[11px] font-black text-white uppercase tracking-wider">
                      Updating WIPA Feed...
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] font-black text-white/90 uppercase tracking-wider drop-shadow-sm flex items-center gap-1">
                    {isReady ? 'Release to Refresh 🐾' : 'Pull down to refresh'}
                  </span>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN PAGE BODY (Sliding down on pull) */}
      <motion.div
        animate={{
          y: isRefreshing ? pullThreshold : pullDistance * 0.35,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
