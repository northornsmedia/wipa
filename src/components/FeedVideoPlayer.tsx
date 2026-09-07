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
  const [isNearViewport, setIsNearViewport] = useState(false);
  const userPausedRef = useRef(false);
  const isIntersectingRef = useRef(false);

  // Proactive Lookahead Observer: preloads video ~2 screens ahead (1200px margin)
  // This guarantees the video is already buffered in memory before the user scrolls to it!
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const proximityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsNearViewport(true);
        } else {
          // Scrolled far away: pause video to free decoders and save battery
          setIsNearViewport(false);
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { rootMargin: '1200px 0px 1200px 0px' }
    );

    proximityObserver.observe(container);
    return () => proximityObserver.disconnect();
  }, []);

  // Synchronize muted state directly on DOM element for WebKit/Android compatibility
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setIsPlaying(true);
    } catch {
      // Autoplay safety: ensure muted and retry
      if (!video.muted) {
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(false);
      }
    }
  }, []);

  const pauseVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);
  }, []);

  // Viewport IntersectionObserver: autoplays when visible in view (>= 35%), pauses when scrolled away (< 20%)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            isIntersectingRef.current = true;
            if (!userPausedRef.current) {
              playVideo();
            }
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
            isIntersectingRef.current = false;
            pauseVideo();
            userPausedRef.current = false;
          }
        });
      },
      {
        threshold: [0.2, 0.35],
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [playVideo, pauseVideo]);

  // Tab switch handling
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

  // Check if video is already ready when component mounts or updates
  const handleLoadedData = () => {
    setIsLoaded(true);
  };

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

  // Toggle Play / Pause
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

      {/* 2. Hardware-accelerated Video Element */}
      <video
        ref={videoRef}
        src={isNearViewport ? src : undefined}
        poster={TRANSPARENT_POSTER}
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        x5-playsinline="true"
        loop
        muted={isMuted}
        preload={isNearViewport ? 'auto' : preload}
        onLoadedData={handleLoadedData}
        onCanPlay={handleLoadedData}
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
