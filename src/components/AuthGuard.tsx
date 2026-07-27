'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Initialize the idle timeout
  useIdleTimeout(15 * 60 * 1000); // 15 minutes

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // Prevent flash of protected content while checking or redirecting
  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbe8d5] bg-grid-pattern">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#5a32fa] border-t-transparent animate-spin"></div>
          <p className="font-bold text-gray-900 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
