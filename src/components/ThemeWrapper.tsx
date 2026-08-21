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
    <div className="theme-shell flex min-h-screen flex-col">
      {children}
    </div>
  );
}
