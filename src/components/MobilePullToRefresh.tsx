'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';

interface MobilePullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  pullThreshold?: number;
}

export default function MobilePullToRefresh({
  children,
  onRefresh,
  pullThreshold = 65,
}: MobilePullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isPullingRef = useRef(false);
  const startYRef = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 1 && !isRefreshing) {
        isPullingRef.current = true;
        startYRef.current = e.touches[0].clientY;
      } else {
        isPullingRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPullingRef.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const rawDelta = currentY - startYRef.current;

      if (rawDelta > 0 && window.scrollY <= 1) {
        if (e.cancelable) {
          e.preventDefault();
        }

        // Natural smooth resistance
        const dampened = Math.min(85, Math.pow(rawDelta, 0.8) * 1.8);
        setPullDistance(dampened);

        if (dampened >= pullThreshold && typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate?.(8);
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

        try {
          if (onRefresh) {
            await onRefresh();
          } else {
            await new Promise((resolve) => setTimeout(resolve, 750));
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
      {/* ULTRA-MINIMAL FLOATING PULL BADGE (Instagram/Threads Style) */}
      <AnimatePresence>
        {(pullDistance > 8 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: -20 }}
            animate={{
              opacity: 1,
              scale: isRefreshing ? 1 : 0.7 + progress * 0.35,
              y: isRefreshing ? 16 : Math.max(8, pullDistance * 0.65),
              rotate: isRefreshing ? 0 : progress * 240,
            }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-50 md:hidden pointer-events-none"
          >
            {/* Sleek 42px Circular Capsule */}
            <div className="relative w-11 h-11 rounded-full p-0.5 bg-slate-950/90 border border-white/20 shadow-xl shadow-black/40 backdrop-blur-md flex items-center justify-center overflow-hidden">
              
              {/* Subtle Breathing Gradient Aura inside */}
              <div className="absolute inset-0 opacity-80 pointer-events-none rounded-full overflow-hidden">
                <AnimatedGradientBackground
                  startingGap={90}
                  Breathing={true}
                  animationSpeed={0.08}
                  gradientColors={[
                    "#5a32fa",
                    "#ff90e8",
                    "#ffc900",
                    "#00d26a",
                    "#0a0a0f"
                  ]}
                  gradientStops={[20, 45, 65, 85, 100]}
                />
              </div>

              {/* Minimal Animated Mascot / Spinner Center */}
              <div className="relative z-10 w-7 h-7 flex items-center justify-center text-white">
                {isRefreshing ? (
                  <RefreshCw size={15} className="animate-spin text-white drop-shadow" />
                ) : (
                  <motion.div
                    animate={{
                      rotate: isReady ? [0, -12, 12, -6, 0] : 0,
                      scale: isReady ? 1.15 : 1,
                    }}
                    className="flex items-center justify-center text-white"
                  >
                    {/* Cute Minimal Cat Face SVG */}
                    <svg viewBox="0 0 32 32" className="w-5 h-5 drop-shadow">
                      {/* Ears */}
                      <polygon points="7,13 11,5 15,12" fill="#ff90e8" />
                      <polygon points="25,13 21,5 17,12" fill="#ff90e8" />
                      {/* Head */}
                      <circle cx="16" cy="18" r="10" fill="#ffffff" />
                      {/* Eyes */}
                      {isReady ? (
                        <>
                          <path d="M11 17 Q13 14 15 17" stroke="#151c2c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                          <path d="M17 17 Q19 14 21 17" stroke="#151c2c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </>
                      ) : (
                        <>
                          <circle cx="12.5" cy="17" r="1.5" fill="#151c2c" />
                          <circle cx="19.5" cy="17" r="1.5" fill="#151c2c" />
                        </>
                      )}
                      {/* Nose */}
                      <polygon points="16,20 15,18.5 17,18.5" fill="#5a32fa" />
                      {/* Cheeks */}
                      <ellipse cx="10" cy="20" rx="1.5" ry="1" fill="#ff90e8" opacity="0.8" />
                      <ellipse cx="22" cy="20" rx="1.5" ry="1" fill="#ff90e8" opacity="0.8" />
                    </svg>
                  </motion.div>
                )}
              </div>

              {/* Ultra-fine circular SVG stroke gauge */}
              <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="2.5"
                />
                {!isRefreshing && (
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#ff90e8"
                    strokeWidth="3"
                    strokeDasharray={`${progress * 100}, 100`}
                    strokeLinecap="round"
                  />
                )}
              </svg>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smooth Subtle Page Bounce */}
      <motion.div
        animate={{
          y: isRefreshing ? 38 : pullDistance * 0.28,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </div>
  );
}
