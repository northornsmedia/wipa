'use client';
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function AIPage() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Number Ticker Animation
  useEffect(() => {
    // Lock body scroll to prevent double scrollbars with iframe
    document.body.style.overflow = 'hidden';
    
    let current = 0;
    
    // We want to reach 100 in about 2.5 seconds.
    // Easing function to make it slow down near the end
    const tick = () => {
      const remaining = 100 - current;
      // move by 5% of the remaining distance, or at least 1
      const step = Math.max(1, Math.floor(remaining * 0.05));
      
      current += step;
      if (current >= 100) {
        current = 100;
        setProgress(current);
        // Wait a tiny bit after reaching 100 before showing the iframe
        setTimeout(() => setIsLoaded(true), 800);
      } else {
        setProgress(current);
        // speed depends on how close we are to 100 (gets slower at the end)
        setTimeout(tick, current > 80 ? 50 : 20);
      }
    };
    
    const timeout = setTimeout(tick, 100);
    
    // Listen for navigation messages from the proxy iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.action === 'navigate' && event.data?.url) {
        window.location.href = event.data.url;
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
      document.body.style.overflow = 'unset'; // Restore scroll on unmount
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0f]">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#5a32fa]/10 to-[#ff90e8]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-baseline">
            <span className="text-8xl md:text-9xl font-medium tracking-tighter whitespace-pre-wrap text-white">
              {progress}
            </span>
            <span className="text-6xl md:text-7xl font-medium tracking-tighter text-gray-500 ml-2">
              %
            </span>
          </div>

          <div className="mt-8 text-gray-400 font-bold tracking-[0.2em] uppercase text-sm flex items-center gap-2">
            Initializing LexIQ
            <span className="flex gap-1 ml-1">
              <span className="w-1 h-1 bg-[#5a32fa] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-[#ff90e8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 bg-[#5a32fa] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Once loaded, show the AI platform inside an iframe
  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#0f172a]">
      {/* Floating Back Button */}
      <a 
        href="/platform"
        className="absolute top-6 left-6 z-50 flex items-center justify-center w-12 h-12 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-full shadow-lg text-gray-500 hover:text-[#5a32fa] hover:scale-110 hover:-translate-x-1 transition-all duration-300"
        title="Back to Platform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </a>

      <iframe 
        src="/api/proxy-ai"
        className="w-full h-full border-none"
        title="WIPA AI Platform"
        allow="microphone; camera; display-capture"
      />
    </div>
  );
}
