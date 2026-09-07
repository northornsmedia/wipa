'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';

interface FeedVideoPlayerProps {
  src: string;
  className?: string;
  containerClassName?: string;
  preload?: 'none' | 'metadata' | 'auto';
}

// 1x1 transparent GIF to prevent Android WebView / Chromium from rendering its default grey canvas & giant play button
const TRANSPARENT_POSTER =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export default function FeedVideoPlayer({
  src,
  className = 'w-full max-w-full h-auto max-h-[75vh] sm:max-h-[560px] object-contain rounded-xl block mx-auto',
  containerClassName = '',
  preload = 'auto',
}: FeedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const userPausedRef = useRef(false);
  const isIntersectingRef = useRef(false);

  // Synchronize muted state directly on DOM element for WebKit/Android compatibility
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.defaultMuted = isMuted;
    }
  }, [isMuted]);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = isMuted;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
      }
    } catch {
      // Autoplay safety: ensure muted and retry immediately
      try {
        video.muted = true;
        setIsMuted(true);
        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } catch {
        setIsPlaying(false);
      }
    }
  }, [isMuted]);

  const pauseVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);
  }, []);

  // When video data is loaded or can play, immediately start if in view
  const handleReadyToPlay = useCallback(() => {
    setIsLoaded(true);
    if (isIntersectingRef.current && !userPausedRef.current) {
      playVideo();
    }
  }, [playVideo]);

  // Viewport IntersectionObserver: autoplays when visible in view (>= 15%), pauses when scrolled away (< 10%)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check visibility immediately on mount so the first video plays directly when opening
    const checkImmediateVisibility = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top < vh * 0.9 && rect.bottom > vh * 0.1;
      if (isVisible) {
        isIntersectingRef.current = true;
        userPausedRef.current = false;
        playVideo();
      }
    };

    checkImmediateVisibility();
    // Also re-check slightly after layout settles
    const timer = setTimeout(checkImmediateVisibility, 150);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            isIntersectingRef.current = true;
            if (!userPausedRef.current) {
              playVideo();
            }
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.1) {
            isIntersectingRef.current = false;
            pauseVideo();
            // Reset manual pause state when scrolling away so it auto-plays next time user returns
            userPausedRef.current = false;
          }
        });
      },
      {
        threshold: [0, 0.1, 0.15, 0.35, 0.6],
      }
    );

    observer.observe(container);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [playVideo, pauseVideo]);

  // User scroll / touch awakening: ensure video plays as user scrolls down the feed
  useEffect(() => {
    const onScrollOrTouch = () => {
      if (isIntersectingRef.current && videoRef.current && videoRef.current.paused && !userPausedRef.current) {
        playVideo();
      }
    };

    window.addEventListener('scroll', onScrollOrTouch, { passive: true });
    window.addEventListener('touchmove', onScrollOrTouch, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScrollOrTouch);
      window.removeEventListener('touchmove', onScrollOrTouch);
    };
  }, [playVideo]);

  // Tab switch handling: pause when tab hidden, resume when visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseVideo();
      } else if (isIntersectingRef.current && !userPausedRef.current) {
        playVideo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [playVideo, pauseVideo]);

  // Toggle Mute / Unmute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (video.paused) {
      userPausedRef.current = false;
      playVideo();
    }
  };

  // Toggle Play / Pause on user click
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPausedRef.current = false;
      playVideo();
    } else {
      userPausedRef.current = true;
      pauseVideo();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden flex items-center justify-center select-none bg-slate-950 dark:bg-black rounded-xl min-h-[320px] sm:min-h-[440px] transform-gpu ${containerClassName}`}
    >
      {/* 1. Ghost Screen Placeholder (active until video first frame loads) */}
      {!isLoaded && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-[#131926] to-black overflow-hidden select-none"
          aria-hidden="true"
        >
          {/* Subtle diagonal shimmer sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-[shimmer_2s_infinite] pointer-events-none" />

          {/* Ghost Center Indicator Badge */}
          <div className="relative flex flex-col items-center gap-3 p-4">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 shadow-xl animate-pulse">
              <Play size={22} className="fill-white/30 text-white/30 translate-x-0.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
                Loading video...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hardware-accelerated Video Element with direct autoPlay */}
      <video
        ref={videoRef}
        src={src}
        poster={TRANSPARENT_POSTER}
        autoPlay
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        x5-playsinline="true"
        loop
        muted={isMuted}
        // @ts-ignore
        defaultMuted={true}
        preload={preload}
        onLoadedData={handleReadyToPlay}
        onCanPlay={handleReadyToPlay}
        onCanPlayThrough={handleReadyToPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        className={`${className} cursor-pointer transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 3. Centered Play Button (only shown once loaded and paused) */}
      {isLoaded && !isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/75 text-white shadow-2xl transition-all duration-200 hover:bg-black/90 hover:scale-110 active:scale-95 z-20 cursor-pointer border border-white/20"
        >
          <Play size={24} className="fill-white translate-x-0.5 text-white" />
        </button>
      )}

      {/* 4. Mute / Unmute Button (only shown once loaded) */}
      {isLoaded && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
          title={isMuted ? 'Unmute' : 'Mute'}
          className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/75 hover:bg-black/95 text-white shadow-lg border border-white/20 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          {isMuted ? (
            <VolumeX size={18} className="text-white" />
          ) : (
            <Volume2 size={18} className="text-white" />
          )}
        </button>
      )}
    </div>
  );
}
