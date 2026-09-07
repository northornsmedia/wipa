'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';

interface FeedVideoPlayerProps {
  src: string;
  className?: string;
  containerClassName?: string;
  preload?: 'none' | 'metadata' | 'auto';
}

export default function FeedVideoPlayer({
  src,
  className = 'w-full max-w-full h-auto max-h-[75vh] sm:max-h-[560px] object-contain rounded-xl block mx-auto',
  containerClassName = '',
  preload = 'metadata',
}: FeedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const userPausedRef = useRef(false);
  const isIntersectingRef = useRef(false);

  // Synchronize muted state directly on the DOM element for mobile Safari/WebKit compatibility
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
      // Browser autoplay policy might reject unmuted autoplay; ensure muted and retry
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

  // IntersectionObserver: automatically play when scrolling into view, pause when scrolling away
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
            // Reset user pause so when the user comes across this video again, it autoplays
            userPausedRef.current = false;
          }
        });
      },
      {
        threshold: [0.2, 0.35],
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [playVideo, pauseVideo]);

  // Handle tab visibility change (pause on tab switch, resume if still intersecting)
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

    // If user unmuted while video was paused, start playback
    if (video.paused) {
      userPausedRef.current = false;
      playVideo();
    }
  };

  // Toggle Play / Pause on video click
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
      className={`relative w-full overflow-hidden flex items-center justify-center select-none ${containerClassName}`}
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        loop
        muted={isMuted}
        preload={preload}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={`${className} cursor-pointer`}
      />

      {/* Centered Play Button indicator when video is paused */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md shadow-2xl transition-all duration-200 hover:bg-black/80 hover:scale-110 active:scale-95 z-10 cursor-pointer border border-white/20"
        >
          <Play size={24} className="fill-white translate-x-0.5 text-white" />
        </button>
      )}

      {/* Mute/Unmute button in bottom-right corner */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
        title={isMuted ? 'Unmute' : 'Mute'}
        className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md shadow-lg border border-white/20 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
      >
        {isMuted ? (
          <VolumeX size={18} className="text-white" />
        ) : (
          <Volume2 size={18} className="text-white" />
        )}
      </button>
    </div>
  );
}
