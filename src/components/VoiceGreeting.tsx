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

    // Check session storage to avoid repeating every navigation
    const alreadyPlayed = sessionStorage.getItem('wipa_tts_played_session');
    if (alreadyPlayed || hasAttemptedRef.current) return;

    // Wait until user profile name is available
    const firstName = user?.name?.trim().split(/\s+/)[0];
    if (!firstName) return;

    hasAttemptedRef.current = true;
    let hasSpoken = false;

    const selectMostHumanVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
      if (!voices || voices.length === 0) return null;

      // STRICT BLACKLIST: Filter out notorious robotic desktop legacy voices
      const nonRobotic = voices.filter(v => {
        const n = v.name.toLowerCase();
        return !n.includes('desktop') && 
               !n.includes('zira') && 
               !n.includes('david') && 
               !n.includes('mark') && 
               !n.includes('sapi') &&
               !n.includes('espeak');
      });

      const pool = nonRobotic.length > 0 ? nonRobotic : voices;

      // Tier 1: Microsoft Natural Online Voices (Aria, Jenny, Sonia, Libby - sound like real human speakers)
      const tier1 = pool.find(v => {
        const n = v.name.toLowerCase();
        const l = v.lang.toLowerCase();
        return l.startsWith('en') && (n.includes('natural') || n.includes('neural')) && 
          (n.includes('aria') || n.includes('jenny') || n.includes('sonia') || n.includes('libby') || n.includes('ava') || n.includes('michelle'));
      });
      if (tier1) return tier1;

      // Tier 2: Any Microsoft / Edge Natural Online voice
      const tier2 = pool.find(v => {
        const n = v.name.toLowerCase();
        const l = v.lang.toLowerCase();
        return l.startsWith('en') && (n.includes('natural') || n.includes('neural'));
      });
      if (tier2) return tier2;

      // Tier 3: Google UK English Female / Google US English (High quality Chrome neural voice)
      const tier3 = pool.find(v => {
        const n = v.name.toLowerCase();
        return n.includes('google') && (n.includes('uk english female') || n.includes('us english') || n.includes('female'));
      });
      if (tier3) return tier3;

      // Tier 4: Apple Siri / Enhanced / Premium voices (macOS / iOS)
      const tier4 = pool.find(v => {
        const n = v.name.toLowerCase();
        const l = v.lang.toLowerCase();
        return l.startsWith('en') && (n.includes('siri') || n.includes('samantha') || n.includes('karen') || n.includes('victoria') || n.includes('serena'));
      });
      if (tier4) return tier4;

      // Tier 5: Any English female voice that is not a desktop robot
      const tier5 = pool.find(v => {
        const n = v.name.toLowerCase();
        const l = v.lang.toLowerCase();
        return l.startsWith('en') && (n.includes('female') || n.includes('woman'));
      });
      if (tier5) return tier5;

      // Tier 6: Any English voice
      const tier6 = pool.find(v => v.lang.toLowerCase().startsWith('en'));
      if (tier6) return tier6;

      return pool[0] || null;
    };

    const speakNow = () => {
      if (hasSpoken) return;

      try {
        window.speechSynthesis.resume();
        window.speechSynthesis.cancel();

        // Natural, friendly human phrasing with conversational intonation
        const greetingText = `Hi, ${firstName}! Welcome back to the Women's IP Alliance. It's lovely to have you here today.`;
        
        const utterance = new SpeechSynthesisUtterance(greetingText);
        (window as any)._wipaUtterance = utterance;
        
        // Human conversational cadence
        utterance.rate = 0.92;
        utterance.pitch = 1.02;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const humanVoice = selectMostHumanVoice(voices);

        if (humanVoice) {
          utterance.voice = humanVoice;
          console.log('[WIPA Voice Greeting]: Using high-definition voice:', humanVoice.name);
        }

        utterance.onstart = () => {
          hasSpoken = true;
          sessionStorage.setItem('wipa_tts_played_session', 'true');
        };

        utterance.onerror = (e) => {
          console.warn('[WIPA Voice Greeting]: Speech error or blocked:', e);
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

    // 2. Try speaking automatically after brief hydration delay
    const autoTimer = setTimeout(() => {
      speakNow();
    }, 600);

    // 3. User interaction gesture fallback (to unlock audio if browser autoplay blocked it)
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
