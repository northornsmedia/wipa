'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from 'next/navigation';

export default function VoiceGreeting() {
  const user = useAppStore((state) => state.user);
  const pathname = usePathname();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!pathname?.startsWith('/platform')) return;

    // Check session storage to avoid playing on every single tab navigation
    const sessionKey = 'wipa_voice_greeted_v3';
    if (sessionStorage.getItem(sessionKey) || hasTriggeredRef.current) return;

    const firstName = user?.name?.trim().split(/\s+/)[0];
    if (!firstName) return;

    hasTriggeredRef.current = true;
    let audioPlayed = false;

    const audioUrl = `/api/voice-greeting?name=${encodeURIComponent(firstName)}`;
    const audio = new Audio(audioUrl);
    audio.volume = 1.0;

    const tryPlayAudio = () => {
      if (audioPlayed) return;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audioPlayed = true;
            sessionStorage.setItem(sessionKey, 'true');
            console.log('[WIPA Voice Greeting]: Natural audio greeting playing for', firstName);
          })
          .catch((err) => {
            // Autoplay policy prevented immediate playback without user interaction
            console.log('[WIPA Voice Greeting]: Waiting for first user click/touch to play audio:', err.message);
          });
      }
    };

    // 1. Try playing right away after brief component hydration
    const timer = setTimeout(() => {
      tryPlayAudio();
    }, 400);

    // 2. Unlocking on first user gesture: If Chrome/Edge blocks background autoplay,
    // the very first interaction (click, key, touch) on the page instantly plays the voice!
    const handleGesture = () => {
      if (!audioPlayed) {
        audio.play().then(() => {
          audioPlayed = true;
          sessionStorage.setItem(sessionKey, 'true');
          console.log('[WIPA Voice Greeting]: Audio unlocked by gesture for', firstName);
        }).catch(() => {});
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('pointerdown', handleGesture);
    };

    window.addEventListener('click', handleGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleGesture, { once: true, passive: true });
    window.addEventListener('pointerdown', handleGesture, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [user?.name, pathname]);

  return null;
}
