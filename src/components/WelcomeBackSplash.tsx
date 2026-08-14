'use client';
import { useState, useEffect, useRef } from 'react';
import { Sparkles, PlayCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from 'next/navigation';

export default function WelcomeBackSplash() {
  const [showSplash, setShowSplash] = useState(false);
  const { user } = useAppStore();
  const pathname = usePathname();

  useEffect(() => {
    // 1. VISUAL SPLASH LOGIC (Only after 7 days of inactivity)
    const lastVisit = localStorage.getItem('wipa_last_visit');
    const now = Date.now();
    const SEVEN_DAYS = 604800000; // 7 days in ms
    
    if (!lastVisit || (now - parseInt(lastVisit, 10)) > SEVEN_DAYS) {
      setShowSplash(true);
    }
    localStorage.setItem('wipa_last_visit', now.toString());

    // 2. TTS AUDIO GREETING LOGIC (For everyone, once per session, from main page)
    const ttsPlayed = sessionStorage.getItem('wipa_tts_played');
    console.log('[TTS Debug] Checking TTS. ttsPlayed:', ttsPlayed, 'pathname:', pathname, 'userName:', user?.name);
    
    // Only attempt to play once the user's name is loaded so it doesn't say "Hello there"
    if (!ttsPlayed && pathname === '/platform' && user?.name) {
      console.log('[TTS Debug] Conditions met. Scheduling TTS in 500ms...');
      // Mark it immediately so subsequent renders in the next 500ms don't schedule multiple timeouts
      sessionStorage.setItem('wipa_tts_played', 'true');
      
      const playTTS = setTimeout(() => {
        console.log('[TTS Debug] Timeout finished. Attempting to play TTS.');
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          
          const playWithFemaleVoice = () => {
            const userName = user.name;
            const utterance = new SpeechSynthesisUtterance(`Hello ${userName}, welcome to the Women's IP Alliance.`);
            (window as any)._wipaUtterance = utterance;
            
            utterance.onstart = () => console.log('[TTS Debug] Audio started playing successfully!');
            utterance.onend = () => console.log('[TTS Debug] Audio finished playing.');
            utterance.onerror = (e) => console.error('[TTS Debug] Audio failed to play. Error:', e);
            
            const voices = window.speechSynthesis.getVoices();
            console.log('[TTS Debug] Available voices:', voices.length);
            
            // Target specific known female voices across Windows, Mac, and Chrome
            const femaleVoice = voices.find(v => 
              v.name.includes('Female') || 
              v.name.includes('Samantha') || // Mac female
              v.name.includes('Zira') ||     // Windows female
              v.name.includes('Susan') || 
              v.name.includes('Victoria') ||
              v.name.includes('Google US English') || // Chrome default is female
              v.name.includes('Google UK English Female')
            );
            
            if (femaleVoice) {
              utterance.voice = femaleVoice;
              console.log('[TTS Debug] Selected female voice:', femaleVoice.name);
            } else {
              console.log('[TTS Debug] No specific female voice found. Using system default.');
            }
            
            window.speechSynthesis.speak(utterance);
          };

          // Browsers often load voices asynchronously. If empty, we must wait.
          if (window.speechSynthesis.getVoices().length === 0) {
            console.log('[TTS Debug] Voices not loaded yet, waiting...');
            window.speechSynthesis.onvoiceschanged = () => {
              playWithFemaleVoice();
              window.speechSynthesis.onvoiceschanged = null; // cleanup
            };
            // Fallback just in case the event doesn't fire
            setTimeout(playWithFemaleVoice, 1500);
          } else {
            playWithFemaleVoice();
          }
        } else {
          console.error('[TTS Debug] speechSynthesis API not supported in this browser.');
        }
      }, 500);

      // Do NOT clearTimeout here. If the component re-renders quickly, we still want the audio to play!
      // Since we set 'wipa_tts_played' synchronously above, it won't be scheduled twice.
    }
  }, [user?.name, pathname]);

  const handleEnter = () => {
    setShowSplash(false);
  };

  if (!showSplash || pathname !== '/platform') return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-500">
      <div className="text-center max-w-lg p-8 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-[#ff90e8] to-[#5a32fa] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(90,50,250,0.5)] animate-pulse mb-8">
          <Sparkles size={40} className="text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          Welcome Back to the Women's IP Alliance!
        </h1>
        <p className="text-lg text-gray-300 mb-10 font-medium leading-relaxed">
          It's been a while since we last saw you. We've missed you! Catch up on the latest insights and discussions in the feed.
        </p>
        
        <button 
          onClick={handleEnter}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-[#5a32fa] rounded-2xl hover:bg-[#4a24db] hover:shadow-[0_10px_40px_rgba(90,50,250,0.4)] hover:-translate-y-1 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Enter Platform <PlayCircle size={20} className="group-hover:scale-110 transition-transform" />
          </span>
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
        </button>
      </div>
    </div>
  );
}
