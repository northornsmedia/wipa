'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Initialize the idle timeout
  useIdleTimeout(15 * 60 * 1000); // 15 minutes

  useEffect(() => {
    setMounted(true);
    
    const checkOnboarding = async () => {
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
