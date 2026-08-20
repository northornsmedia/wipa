// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import AppLaunchSplash from '@/components/AppLaunchSplash';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isChecking, setIsChecking] = useState(() => !user?.id);

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
        setIsChecking(false);
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
  }, []);

  // If user is already loaded from persisted storage, render content IMMEDIATELY with zero splash delay!
  if (user?.id) {
    return <>{children}</>;
  }

  // Only show minimal subtle spinner if no user is cached and initial session check is running
  if (!mounted || isChecking) {
    return <AppLaunchSplash message="Opening your platform…" />;
  }

  return <>{children}</>;
}
