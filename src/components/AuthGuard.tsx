// @ts-nocheck
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import AppLaunchSplash from '@/components/AppLaunchSplash';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const [splashFinished, setSplashFinished] = useState(false);
  const splashFinishedRef = useRef(splashFinished);
  splashFinishedRef.current = splashFinished;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('splash') === 'done') {
        setSplashFinished(true);
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    let authListener: any = null;
    
    const checkAuthAndOnboarding = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setUser(null);
          // Queue redirect to /login so splash completes mandatory 4.2s without being cut off
          setPendingRedirect('/login?splash=done');
          return;
        }

        const userId = session.user.id;
        const email = session.user.email || '';
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
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

          const pendingTier = session?.user?.user_metadata?.pending_tier;
          if (pendingTier && (profile.membership_tier === 'free' || !profile.membership_tier)) {
            const isReturningFromStripe = window.location.search.includes('success=true') || window.location.search.includes('canceled=true');
            if (!isReturningFromStripe) {
              setPendingRedirect(`/api/checkout?tier=${pendingTier}&userId=${userId}`);
              return;
            }
          }

          if (!profile.onboarding_completed && window.location.pathname !== '/onboarding') {
            setPendingRedirect('/onboarding?splash=done');
            return;
          }
        }
      } catch (err) {
        console.error("Failed to check auth/onboarding status", err);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndOnboarding();

    const setupListener = async () => {
      const { supabase } = await import('@/lib/supabase');
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_OUT') {
            setUser(null);
            if (splashFinishedRef.current) {
              router.push('/login?splash=done');
            } else {
              setPendingRedirect('/login?splash=done');
            }
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
  }, [router, setUser]);

  // Underlying platform is ready when mounted and initial auth check is complete
  const isPlatformReady = mounted && !isChecking;

  return (
    <>
      {/* 1. Underlying Platform Content (Preloads and renders in background behind the splash) */}
      {children}

      {/* 2. Mandatory 4.2-Second Aperture Iris Splash Overlay */}
      {!splashFinished && (
        <AppLaunchSplash
          isReady={isPlatformReady}
          minDurationMs={4200}
          message={isChecking ? 'Verifying secure session…' : 'Launching WIPA Platform…'}
          onComplete={() => {
            setSplashFinished(true);
            if (pendingRedirect) {
              router.replace(pendingRedirect);
            }
          }}
        />
      )}
    </>
  );
}
