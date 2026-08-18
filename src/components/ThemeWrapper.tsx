'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useAppStore();
  
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);
  
  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark bg-[#0f172a] text-white' : 'bg-[#f8f9fa] text-gray-900'}`}>
      {children}
    </div>
  );
}
