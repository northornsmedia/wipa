'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from 'next/navigation';

export default function VoiceGreeting() {
  const user = useAppStore((state) => state.user);
  const pathname = usePathname();
  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!pathname?.startsWith('/platform')) return;

    // Check session storage to avoid repeating every page navigation
    const alreadyPlayed = sessionStorage.getItem('wipa_tts_played_session');
    if (alreadyPlayed || hasAttemptedRef.current) return;

    // Wait until user profile name is available
    const firstName = user?.name?.trim().split(/\s+/)[0];
    if (!firstName) return;

    hasAttemptedRef.current = true;
    let hasSpoken = false;

    const speakNow = () => {
      if (hasSpoken) return;

      try {
        window.speechSynthesis.resume();
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(
          `Hi, ${firstName}. Welcome back to WIPA. It's lovely to have you here.`
        );
        (window as any)._wipaUtterance = utterance;
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v => 
          v.name.includes('Aria') ||
          v.name.includes('Jenny') ||
          v.name.includes('Google UK English Female') ||
          v.name.includes('Google US English') ||
          v.name.includes('Samantha') ||
          v.name.includes('Zira') ||
          v.name.includes('Female') || 
          v.name.includes('Susan') || 
          v.name.includes('Victoria')
        );

        if (femaleVoice) utterance.voice = femaleVoice;

        utterance.onstart = () => {
          hasSpoken = true;
          sessionStorage.setItem('wipa_tts_played_session', 'true');
          console.log('[WIPA Voice Greeting]: Speaking greeting for', firstName);
        };

        utterance.onerror = (e) => {
          console.warn('[WIPA Voice Greeting]: Speech error or blocked by browser policy:', e);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[WIPA Voice Greeting] error:', err);
      }
    };

    // 1. If voices are not yet loaded, wait for voiceschanged
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speakNow();
      };
    }

    // 2. Try speaking automatically after a short delay
    const autoTimer = setTimeout(() => {
      speakNow();
    }, 600);

    // 3. Browser Autoplay policy fallback: If the browser blocks speech until a user interaction,
    // the very first click or keypress on the platform will immediately trigger it!
    const handleUserInteraction = () => {
      if (!hasSpoken) {
        speakNow();
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction, { once: true, passive: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true, passive: true });

    return () => {
      clearTimeout(autoTimer);
      cleanup();
    };
  }, [user?.name, pathname]);

  return null;
}
