import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';
import { getProfileByIdOrMemberId } from '@/app/actions/profiles';
import PublicProfileClient from './PublicProfileClient';

// Server-side Supabase client for analytics view recording (read-only, public anon key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ member_id: string }> }): Promise<Metadata> {
  const { member_id } = await params;
  const profile = await getProfileByIdOrMemberId(member_id);

  if (!profile) {
    return { 
      title: 'WIPA Member Pass | Women in Intellectual Property Alliance',
      description: 'Official verified digital member pass for the Women in Intellectual Property Alliance.'
    };
  }

  const name = profile.full_name || 'WIPA Member';
  const role = profile.role || 'IP Professional';
  const company = profile.company ? ` at ${profile.company}` : '';
  const description = profile.bio || `${name} (${role}${company}) is a verified executive member of the Women in Intellectual Property Alliance (WIPA).`;

  return {
    title: `${name} • WIPA Official Digital Pass`,
    description,
    openGraph: {
      title: `${name} • WIPA Digital Pass`,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} • WIPA Digital Pass`,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    }
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ member_id: string }> }) {
  const { member_id } = await params;
  
  const profile = await getProfileByIdOrMemberId(member_id);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white font-sans flex flex-col items-center justify-center p-6 selection:bg-[#5a32fa]">
        <div className="bg-[#131927] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-[#5a32fa]/20 text-[#5a32fa] mx-auto flex items-center justify-center mb-4 border border-[#5a32fa]/30">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Member Pass Not Found</h1>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            The member ID or profile link <code className="px-1.5 py-0.5 rounded bg-white/10 text-purple-300 font-mono text-[11px]">{member_id}</code> could not be found or has expired.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all text-center block"
            >
              Explore WIPA Community
            </Link>
            <Link
              href="/auth"
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all text-center block"
            >
              Apply for WIPA Membership
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Record public profile view
  try {
    await supabase.rpc('record_profile_view', {
      p_profile_id: profile.id,
      p_viewer_id: null,
      p_session_id: null,
    });
  } catch {
    // Non-blocking analytics
  }

  return <PublicProfileClient profile={profile} />;
}
