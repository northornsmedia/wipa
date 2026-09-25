'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    // Register Service Worker in the background for notifications and offline capability
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('WIPA PWA Service Worker Registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('WIPA Service Worker Registration Error:', err);
          });
      };

      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
      }
    }
  }, []);

  // Do not render any install prompt banner on mobile or desktop
  return null;
}

