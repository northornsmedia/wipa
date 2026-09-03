import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

export function useIdleTimeout(timeoutMs: number = 15 * 60 * 1000) {
  const router = useRouter();
  const { setUser } = useAppStore();
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const handleIdle = useCallback(async () => {
    // Log the user out due to inactivity
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch {
      // Ignore
    }
    setUser(null);
    router.push('/login?message=You have been logged out due to inactivity.');
  }, [router, setUser]);

  const resetTimer = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(handleIdle, timeoutMs);
  }, [handleIdle, timeoutMs]);

  useEffect(() => {
    // Events that count as user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    // Setup initial timer
    resetTimer();

    // Attach event listeners
    const handleActivity = () => resetTimer();
    
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      // Cleanup
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);
}
