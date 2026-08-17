'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function BusinessRedirectPage() {
  const router = useRouter();
  const { user } = useAppStore();

  useEffect(() => {
    const checkBusiness = async () => {
      if (!user) {
        router.push('/platform');
        return;
      }
      
      if (user.business_profile_id) {
        const { data } = await supabase.from('business_profiles').select('slug').eq('id', user.business_profile_id).single();
        if (data?.slug) {
          router.push(`/platform/business/${data.slug}`);
          return;
        }
      }
      
      // If no business profile or couldn't find it, go to create
      router.push('/platform/business/create');
    };
    
    checkBusiness();
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-[#5a32fa]" />
    </div>
  );
}
