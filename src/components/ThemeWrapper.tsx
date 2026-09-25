'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useAppStore();
  
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode === true) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    }
  }, [isDarkMode]);
  
  return (
    <div className="theme-shell flex min-h-screen flex-col bg-slate-50 dark:bg-black md:dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {children}
    </div>
  );
}
