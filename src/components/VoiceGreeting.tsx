'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from 'next/navigation';

export default function VoiceGreeting() {
  const user = useAppStore((state) => state.user);
  const pathname = usePathname();
  const lastGreetedUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Reset when user logs out so they are greeted again on next login
    if (!user) {
      lastGreetedUserRef.current = null;
      return;
    }

    if (!pathname?.startsWith('/platform')) return;

    // If this user was already greeted in this active session, don't repeat on every subpage
    if (lastGreetedUserRef.current === user.id) return;

    const firstName = user.name?.trim().split(/\s+/)[0] || 'there';
    lastGreetedUserRef.current = user.id;

    let hasPlayed = false;

    // Method A: Studio MP3 Audio Stream
    const audioUrl = `/api/voice-greeting?name=${encodeURIComponent(firstName)}`;
    const audio = new Audio(audioUrl);
    audio.volume = 1.0;

    // Method B: Browser Speech Synthesis Fallback (explicitly saying W. I. P. A.)
    const playSpeechFallback = () => {
      if (hasPlayed || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.resume();
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(
          `Hello ${firstName}, welcome back to W. I. P. A. It's wonderful to have you here.`
        );
        (window as any)._wipaUtterance = utterance;
        utterance.rate = 0.92;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const v = voices.find(v => 
          v.name.includes('Google US English') ||
          v.name.includes('Google UK English Female') ||
          v.name.includes('Jenny') ||
          v.name.includes('Aria') ||
          v.name.includes('Samantha') ||
          v.name.includes('Zira') ||
          v.name.includes('Female')
        );
        if (v) utterance.voice = v;

        utterance.onstart = () => {
          hasPlayed = true;
          console.log('[WIPA Voice Greeting]: Speech synthesis playing for', firstName);
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis fallback error:', e);
      }
    };

    const triggerPlay = () => {
      if (hasPlayed) return;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasPlayed = true;
            console.log('[WIPA Voice Greeting]: Studio audio greeting playing for', firstName);
          })
          .catch((err) => {
            console.log('[WIPA Voice Greeting]: Autoplay blocked, trying speech synthesis fallback:', err.message);
            playSpeechFallback();
          });
      } else {
        playSpeechFallback();
      }
    };

    // 1. Attempt playback immediately after component hydration
    const timer = setTimeout(() => {
      triggerPlay();
    }, 400);

    // 2. Immediate gesture unlock: If browser blocked autoplay on redirect,
    // the very first interaction (click anywhere, keydown, touch) immediately triggers the voice!
    const handleGesture = () => {
      if (!hasPlayed) {
        triggerPlay();
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
  }, [user, pathname]);

  return null;
}
