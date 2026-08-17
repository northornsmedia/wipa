// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import OrbitingCirclesGlobe from '@/components/ui/orbiting-circles-02';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const hasSeenAnimation = typeof window !== 'undefined' ? sessionStorage.getItem('hasSeenAuthAnimation') === 'true' : false;

  useEffect(() => {
    setMounted(true);

    let authListener: any = null;
    
    const checkAuthAndOnboarding = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setUser(null);
          router.push('/login');
          return;
        }

        const userId = session.user.id;
        const email = session.user.email || '';
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        const profile = data as any;
          
        if (!error && profile) {
          setUser({
            id: userId,
            email: email,
            name: profile.full_name || '',
            avatar_url: profile.avatar_url,
            cover_url: profile.cover_url,
            member_id: profile.member_id,
            membership_tier: profile.membership_tier,
            verification_status: profile.verification_status,
            onboarding_completed: profile.onboarding_completed,
            country: profile.country,
            practice_area: profile.practice_area,
            industry_sector: profile.industry_sector,
            bio: profile.bio
          });

          if (!hasSeenAnimation && typeof window !== 'undefined') {
            sessionStorage.setItem('hasSeenAuthAnimation', 'true');
          }

          const pendingTier = session?.user?.user_metadata?.pending_tier;
          if (pendingTier && (profile.membership_tier === 'free' || !profile.membership_tier)) {
            const isReturningFromStripe = window.location.search.includes('success=true') || window.location.search.includes('canceled=true');
            if (!isReturningFromStripe) {
              window.location.href = `/api/checkout?tier=${pendingTier}&userId=${userId}`;
              return;
            }
          }

          if (!profile.onboarding_completed && window.location.pathname !== '/onboarding') {
            router.push('/onboarding');
            return;
          }
        }
      } catch (err) {
        console.error("Failed to check auth/onboarding status", err);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkAuthAndOnboarding();

    const setupListener = async () => {
      const { supabase } = await import('@/lib/supabase');
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_OUT' || !session) {
            setUser(null);
            router.push('/login');
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            checkAuthAndOnboarding();
          }
        }
      );
      authListener = subscription;
    };
    
    setupListener();

    return () => {
      if (authListener) authListener.unsubscribe();
    };
  }, []); // Run once on mount

  // Prevent flash of protected content while checking or redirecting
  if (!mounted || isCheckingOnboarding) {
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
