import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Briefcase, Building2, Globe, ShieldCheck, Mail } from 'lucide-react';
import { Metadata } from 'next';

// Server-side Supabase client for data fetching (read-only, public anon key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

import { getProfileByIdOrMemberId } from '@/app/actions/profiles';

export async function generateMetadata({ params }: { params: Promise<{ member_id: string }> }): Promise<Metadata> {
  const { member_id } = await params;
  const profile = await getProfileByIdOrMemberId(member_id);

  if (!profile) return { title: 'WIPA Member | Women In Public Affairs' };

  return {
    title: `${profile.full_name} | WIPA Profile`,
    description: profile.bio || `${profile.full_name} is a verified member of the Women In Public Affairs (WIPA) network.`,
    openGraph: {
      title: `${profile.full_name} - WIPA`,
      description: profile.practice_area || 'Women In Public Affairs',
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ member_id: string }> }) {
  const { member_id } = await params;
  
  const profile = await getProfileByIdOrMemberId(member_id);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-[#5a32fa]/10 text-[#5a32fa] mx-auto flex items-center justify-center mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Member Profile Not Found</h1>
          <p className="text-xs text-gray-500 mb-6">
            The member ID or profile link you followed might have expired or does not exist.
          </p>
          <Link
            href="/platform/members"
            className="w-full py-3 rounded-xl bg-[#5a32fa] text-white font-bold text-xs shadow-md shadow-[#5a32fa]/20 hover:opacity-95 transition-all text-center block"
          >
            Explore WIPA Members Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col">
      {/* Top Banner CTA */}
      <div className="bg-[#5a32fa] text-white px-4 py-3 text-center sm:text-left shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[13px] font-medium leading-tight">
          <span className="font-bold">WIPA</span> is the exclusive network for Women In Public Affairs. Connect with {profile.full_name} and thousands of other professionals.
        </p>
        <Link 
          href="/auth" 
          className="bg-white text-[#5a32fa] px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap hover:bg-gray-50 transition-colors"
        >
          Apply to Join
        </Link>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          {/* Cover Photo */}
          <div className="h-32 sm:h-48 w-full bg-gradient-to-r from-[#e0d4ff] to-[#f0ebff] relative">
            {profile.cover_url && (
              <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="px-6 sm:px-10 pb-10 relative">
            {/* Avatar */}
            <div className="relative -mt-16 sm:-mt-20 mb-6">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name} 
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-sm bg-white"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-sm bg-[#131313] text-white flex items-center justify-center text-4xl sm:text-5xl font-bold">
                  {profile.full_name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-2 mb-1">
                {profile.full_name}
                {profile.verification_status === 'verified' && (
                  <ShieldCheck size={24} className="text-[#00d26a]" />
                )}
              </h1>
              
              <div className="flex items-center gap-2 text-sm font-bold text-[#5a32fa] bg-[#f0ebff] w-fit px-3 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5a32fa]"></span>
                Verified WIPA Member
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 font-medium mb-8">
                {profile.practice_area && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={16} className="text-gray-400" />
                    {profile.practice_area}
                  </div>
                )}
                {profile.industry_sector && (
                  <div className="flex items-center gap-1.5">
                    <Building2 size={16} className="text-gray-400" />
                    {profile.industry_sector}
                  </div>
                )}
                {profile.country && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-gray-400" />
                    {profile.country}
                  </div>
                )}
              </div>

              {profile.bio && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">About</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 font-medium whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                </div>
              )}

              {(profile.role || profile.company || profile.experience_years || profile.education) && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Experience & Education</h3>
                  <div className="bg-gray-50 border border-gray-100 rounded-[20px] p-6 space-y-4">
                    {(profile.role || profile.company) && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{profile.role || 'Professional Role'}</h4>
                        <p className="font-bold text-[#5a32fa]">{profile.company || 'Company Name'}</p>
                        {profile.experience_years ? (
                          <p className="text-sm font-bold text-gray-500 mt-1">{profile.experience_years} Years Experience</p>
                        ) : null}
                      </div>
                    )}
                    {profile.education && (
                      <div className="pt-4 border-t border-gray-200/60">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Education</h4>
                        <p className="font-bold text-gray-900">{profile.education}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {profile.skills && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.split(',').map((skill: string, idx: number) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(profile.linkedin_url || profile.website_url) && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {profile.linkedin_url && (
                      <a 
                        href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a66c2]"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        LinkedIn
                      </a>
                    )}
                    {profile.website_url && (
                      <a 
                        href={profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        <Globe size={16} className="text-gray-500" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Locked Content Banner */}
            <div className="mt-12 p-6 sm:p-8 bg-gray-50 border border-gray-100 rounded-[20px] text-center">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Mail size={20} className="text-[#5a32fa]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Connect with {profile.full_name}</h3>
              <p className="text-[15px] font-medium text-gray-600 max-w-md mx-auto mb-6">
                Join WIPA to send a direct message, view connections, and interact with exclusive posts.
              </p>
              <Link 
                href="/auth" 
                className="inline-block bg-[#131313] text-white px-8 py-3 rounded-xl text-[15px] font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                Join WIPA Now
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
