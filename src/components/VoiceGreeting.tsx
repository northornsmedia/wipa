'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from 'next/navigation';

export default function VoiceGreeting() {
  const user = useAppStore((state) => state.user);
  const pathname = usePathname();

  useEffect(() => {
    // Only speak on the platform home page, once per session
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (pathname !== '/platform' || !user?.name) return;

    const ttsPlayed = sessionStorage.getItem('wipa_tts_played');
    if (ttsPlayed) return;

    sessionStorage.setItem('wipa_tts_played', 'true');

    const timer = setTimeout(() => {
      try {
        window.speechSynthesis.cancel();
        let hasSpoken = false;
        let voiceFallbackTimer: ReturnType<typeof setTimeout> | undefined;

        const playGreeting = () => {
          if (hasSpoken) return;
          hasSpoken = true;
          if (voiceFallbackTimer) clearTimeout(voiceFallbackTimer);

          const firstName = user.name.trim().split(/\s+/)[0] || 'there';
          const utterance = new SpeechSynthesisUtterance(
            `Hi, ${firstName}. Welcome back to WIPA. It's lovely to have you here.`
          );
          (window as any)._wipaUtterance = utterance;
          utterance.rate = 0.84;
          utterance.pitch = 0.98;
          utterance.volume = 0.9;

          const voices = window.speechSynthesis.getVoices();
          // Prefer warm, natural English female voices
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
          window.speechSynthesis.speak(utterance);
        };

        if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            playGreeting();
            window.speechSynthesis.onvoiceschanged = null;
          };
          voiceFallbackTimer = setTimeout(playGreeting, 1500);
        } else {
          playGreeting();
        }
      } catch (err) {
        console.warn('Voice greeting error:', err);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [user?.name, pathname]);

  return null;
}
