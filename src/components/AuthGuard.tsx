'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import OrbitingCirclesGlobe from '@/components/ui/orbiting-circles-02';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const hasSeenAnimation = typeof window !== 'undefined' ? sessionStorage.getItem('hasSeenAuthAnimation') === 'true' : false;

  // Initialize the idle timeout
  useIdleTimeout(15 * 60 * 1000); // 15 minutes

  useEffect(() => {
    setMounted(true);
    
    const checkOnboarding = async () => {
      // Check if they've already seen the animation this session

      if (!hasSeenAnimation && typeof window !== 'undefined') {
        sessionStorage.setItem('hasSeenAuthAnimation', 'true');
      }

      let shouldRedirect = false;
      try {
        const { supabase } = await import('@/lib/supabase');
        
        const { data: authData } = await supabase.auth.getUser();
        
        if (!authData.user) {
          router.push('/');
          return; // don't set isCheckingOnboarding to false, let it redirect
        }

        const userId = authData.user.id;
        
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_completed, membership_tier')
          .eq('id', userId)
          .single();
          
        if (!error && data) {
          const pendingTier = authData?.user?.user_metadata?.pending_tier;
          
          if (pendingTier && (data.membership_tier === 'free' || !data.membership_tier)) {
            // Check if they just returned from Stripe checkout to prevent infinite loops
            const isReturningFromStripe = window.location.search.includes('success=true') || window.location.search.includes('canceled=true');
            
            if (!isReturningFromStripe) {
              // Redirect to Stripe checkout
              window.location.href = `/api/checkout?tier=${pendingTier}&userId=${userId}`;
              return; // Don't set isCheckingOnboarding to false, let the redirect happen
            }
          }

          if (!data.onboarding_completed && window.location.pathname !== '/onboarding') {
            shouldRedirect = true;
          }
        }
      } catch (err) {
        console.error("Failed to check onboarding status", err);
      }
      
      if (shouldRedirect) {
        router.push('/onboarding');
      } else {
        setIsCheckingOnboarding(false);
      }
    };

    if (user !== undefined) {
      checkOnboarding();
    }
  }, [user, router]);

  // Prevent flash of protected content while checking or redirecting
  if (!mounted || !user || isCheckingOnboarding) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0f] relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#5a32fa]/5 to-[#ff90e8]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col items-center gap-6 z-20 mb-20 relative px-4 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-[#5a32fa] border-t-transparent animate-spin shadow-lg shadow-[#5a32fa]/20"></div>
          <div className="flex flex-col gap-2 mt-4">
            <p className="font-bold text-gray-900 dark:text-white text-lg tracking-wider uppercase animate-pulse">Authenticating...</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
              You're an IP professional, so we want your details to be strictly encrypted. Just running a quick authentication check!
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 w-full pointer-events-none">
          <OrbitingCirclesGlobe />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
