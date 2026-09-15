'use client';

import React, { useState, useEffect, useRef } from 'react';
import './aperture-loader.css';

export interface SplashLoaderProps {
  /** Callback fired after the loader finishes shrinking away */
  onComplete?: () => void;
  /** Primary gradient background style */
  background?: string;
  /** Custom logo or icon in the center (defaults to the SVG W logo) */
  logo?: React.ReactNode;
  /** Counter tick interval speed in ms (optional override) */
  speedMs?: number;
  /** Optional loading or status message */
  message?: string;
  /** Minimum total hold duration in ms (mandatory 4200ms = 4.2 seconds) */
  minDurationMs?: number;
  /** Pass whether the underlying page/auth/data has finished loading (defaults to true) */
  isReady?: boolean;
}

export default function ApertureSplashLoader({
  onComplete,
  background = 'linear-gradient(135deg, #18153c 0%, #0c0a24 50%, #060515 100%)',
  logo,
  speedMs = 25,
  message,
  minDurationMs = 4200,
  isReady = true,
}: SplashLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Store refs so parent re-renders never cancel, restart, or stutter the timer
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const isReadyRef = useRef(isReady);
  isReadyRef.current = isReady;

  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  // Trigger completion sequence (100% -> hold 180ms -> iris aperture shrink -> unmount)
  const triggerCompletion = useRef(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    setProgress(100);

    // Phase 1: Brief 180ms hold at 100% so user registers 100
    setTimeout(() => {
      setIsLoaded(true);
    }, 180);

    // Phase 2: Unmount after the iris shrink transition completes (1100ms)
    setTimeout(() => {
      setIsDone(true);
      onCompleteRef.current?.();
    }, 180 + 1100);
  });

  useEffect(() => {
    startTimeRef.current = Date.now();
    completedRef.current = false;

    const targetMinDuration = minDurationMs;

    const interval = setInterval(() => {
      if (completedRef.current) {
        clearInterval(interval);
        return;
      }

      const elapsed = Date.now() - (startTimeRef.current ?? Date.now());

      if (elapsed < targetMinDuration) {
        // Smooth non-linear progress from 0% to 99% across the mandatory 4.2 seconds
        const fraction = elapsed / targetMinDuration;
        const currentProgress = Math.min(99, Math.floor(Math.pow(fraction, 0.88) * 100));
        setProgress(currentProgress);
      } else {
        // Minimum 4.2 seconds have elapsed!
        if (isReadyRef.current) {
          // Underlying page is ready -> trigger aperture reveal immediately
          clearInterval(interval);
          triggerCompletion.current();
        } else {
          // Page behind is still taking time -> hold at 99% with active spinner
          setProgress(99);
        }
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [minDurationMs, speedMs]);

  // If the page was still loading at 4.2s, react the exact moment isReady becomes true
  useEffect(() => {
    if (isReady && startTimeRef.current && !completedRef.current) {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= minDurationMs) {
        triggerCompletion.current();
      }
    }
  }, [isReady, minDurationMs]);

  if (isDone) return null;

  return (
    <div
      className={`aperture-loader-overlay ${isLoaded ? '-loaded' : ''}`}
      style={{ background }}
    >
      {/* Center Animated Logo: Modern Geometric W Mark */}
      <div className="aperture-logo-wrapper">
        {logo ? (
          logo
        ) : (
          <div className="aperture-w-wrapper">
            <svg
              className="aperture-w-glyph"
              width="64"
              height="52"
              viewBox="0 0 64 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="wGlowGrad" x1="0" y1="0" x2="64" y2="52" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#EDE9FE" />
                  <stop offset="100%" stopColor="#C4B5FD" />
                </linearGradient>
                <filter id="wHalo" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#8B5CF6" floodOpacity="0.65" />
                  <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#FFFFFF" floodOpacity="0.8" />
                </filter>
              </defs>
              <path
                d="M4.5 4.5C4.5 2.57 6.07 1 8 1H10.5C12.3 1 13.9 2.1 14.6 3.8L22.8 28.5L27.6 11.2C28.2 9.4 29.8 8.2 31.7 8.2H32.3C34.2 8.2 35.8 9.4 36.4 11.2L41.2 28.5L49.4 3.8C50.1 2.1 51.7 1 53.5 1H56C57.93 1 59.5 2.57 59.5 4.5C59.5 5.7 58.9 6.8 57.9 7.5L46.2 44.5C45.4 46.8 43.2 48.4 40.8 48.4C38.4 48.4 36.2 46.8 35.4 44.5L32 30.5L28.6 44.5C27.8 46.8 25.6 48.4 23.2 48.4C20.8 48.4 18.6 46.8 17.8 44.5L6.1 7.5C5.1 6.8 4.5 5.7 4.5 4.5Z"
                fill="url(#wGlowGrad)"
                filter="url(#wHalo)"
              />
            </svg>
            <span className="aperture-wipa-wordmark">WIPA</span>
          </div>
        )}
      </div>

      {/* Inner Rotating Gyro Ring */}
      <div className="aperture-circle -small">
        <svg viewBox="0 0 287 287" fill="none">
          <circle cx="143.5" cy="143.5" r="143" stroke="white" strokeOpacity="0.12" />
          <path
            d="M143.5 0.5C222.477 0.5 286.5 64.5233 286.5 143.5C286.5 222.477 222.477 286.5 143.5 286.5"
            stroke="url(#ringGlow1)"
            strokeOpacity="0.8"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="ringGlow1" x1="143.5" y1="287" x2="151.5" y2="4.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Outer Rotating Ambient Ring */}
      <div className="aperture-circle -large">
        <svg viewBox="0 0 945 945" fill="none">
          <circle cx="472.5" cy="472.5" r="472" stroke="white" strokeOpacity="0.08" />
          <path
            d="M472.5 944.5C211.822 944.5 0.50001 733.178 0.50001 472.5C0.50001 211.822 211.822 0.5 472.5 0.5"
            stroke="url(#ringGlow2)"
            strokeOpacity="0.65"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="ringGlow2" x1="472.5" y1="0" x2="446" y2="945" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Bottom Counter & Status */}
      <div className="aperture-counter">
        <div className="aperture-counter__numbers">
          <span className="aperture-counter__value">
            {String(progress).padStart(3, '0')}
          </span>
          <span className="aperture-counter__max">100</span>
        </div>
        {message && (
          <span className="aperture-loader-message">
            {progress >= 99 && !isReady ? 'Finalizing interface…' : message}
          </span>
        )}
      </div>
    </div>
  );
}
