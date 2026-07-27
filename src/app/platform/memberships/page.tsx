'use client';

import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Check, Briefcase, Building2, GraduationCap, ArrowRight } from 'lucide-react';

export default function MembershipsPage() {
  const { user } = useAppStore();
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembership = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from('profiles')
        .select('membership_tier')
        .eq('id', user.id)
        .single();
      
      if (data?.membership_tier) {
        setCurrentTier(data.membership_tier);
      }
      setIsLoading(false);
    };
    fetchMembership();
  }, [user]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="font-bold text-gray-500">Loading Memberships...</p></div>;
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Hi, {user?.name ? user.name.split(' ')[0] : 'there'}!
        </h1>
        <p className="text-xl font-bold text-gray-600 max-w-2xl mx-auto">
          Manage your membership and upgrade your experience.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* STUDENTS PLAN */}
        <div className={`bg-white rounded-[2rem] border-4 ${currentTier === 'student' ? 'border-[#5a32fa] shadow-[8px_8px_0px_0px_#5a32fa]' : 'border-[#131313] shadow-[8px_8px_0px_0px_#131313]'} p-8 flex flex-col relative overflow-hidden transition-all`}>
          {currentTier === 'student' && (
            <div className="absolute top-0 right-0 bg-[#5a32fa] text-white text-xs font-black px-4 py-2 rounded-bl-xl border-b-4 border-l-4 border-[#5a32fa]">
              CURRENT PLAN
            </div>
          )}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
              <GraduationCap className="text-[#5a32fa]" size={28} /> Students
            </h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-gray-900">£99</span>
              <span className="text-lg font-bold text-gray-500">/year</span>
            </div>
            <p className="text-sm font-bold text-gray-500 mt-4">For students and recent graduates pursuing careers in IP.</p>
          </div>
          
          <div className="flex-1 space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Access to Jobs Board</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Mentorship Opportunities</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Basic Networking</span>
            </div>
          </div>
          
          <button className={`w-full py-4 rounded-xl font-black text-lg transition-colors border-2 ${currentTier === 'student' ? 'bg-gray-200 text-gray-500 border-transparent cursor-not-allowed' : 'bg-white text-[#131313] border-[#131313] hover:bg-gray-50'}`}>
            {currentTier === 'student' ? 'Active' : 'Get Student Tier'}
          </button>
        </div>

        {/* STARTUPS PLAN */}
        <div className={`bg-white rounded-[2rem] border-4 ${currentTier === 'startup' ? 'border-[#ffc900] shadow-[8px_8px_0px_0px_#ffc900]' : 'border-[#131313] shadow-[8px_8px_0px_0px_#131313]'} p-8 flex flex-col relative overflow-hidden transition-all md:-translate-y-4`}>
          {currentTier === 'startup' && (
            <div className="absolute top-0 right-0 bg-[#ffc900] text-[#131313] text-xs font-black px-4 py-2 rounded-bl-xl border-b-4 border-l-4 border-[#ffc900]">
              CURRENT PLAN
            </div>
          )}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
              <Building2 className="text-[#ffc900]" size={28} /> Start-Ups
            </h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-gray-900">£295</span>
              <span className="text-lg font-bold text-gray-500">/year</span>
            </div>
            <p className="text-sm font-bold text-gray-500 mt-4">For founders, innovators, and emerging IP businesses.</p>
          </div>
          
          <div className="flex-1 space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Company Page Listing</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Direct Messaging</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Access to Resource Library</span>
            </div>
          </div>
          
          <button className={`w-full py-4 rounded-xl font-black text-lg transition-colors border-2 ${currentTier === 'startup' ? 'bg-gray-200 text-gray-500 border-transparent cursor-not-allowed' : 'bg-[#ffc900] text-[#131313] border-[#131313] hover:bg-[#e6b500]'}`}>
            {currentTier === 'startup' ? 'Active' : 'Get Start-Up Tier'}
          </button>
        </div>

        {/* IP PROFESSIONALS PLAN */}
        <div className={`bg-white rounded-[2rem] border-4 ${currentTier === 'ip_professional' ? 'border-[#00d26a] shadow-[8px_8px_0px_0px_#00d26a]' : 'border-[#131313] shadow-[8px_8px_0px_0px_#131313]'} p-8 flex flex-col relative overflow-hidden transition-all`}>
          {currentTier === 'ip_professional' && (
            <div className="absolute top-0 right-0 bg-[#00d26a] text-white text-xs font-black px-4 py-2 rounded-bl-xl border-b-4 border-l-4 border-[#00d26a]">
              CURRENT PLAN
            </div>
          )}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
              <Briefcase className="text-[#00d26a]" size={28} /> IP Professionals
            </h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-gray-900">£395</span>
              <span className="text-lg font-bold text-gray-500">/year</span>
            </div>
            <p className="text-sm font-bold text-gray-500 mt-4">For IP lawyers, attorneys, and patent professionals.</p>
          </div>
          
          <div className="flex-1 space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Verified Professional Badge</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Global Directory Listing</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Unlimited Platform Access</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Advanced Analytics</span>
            </div>
          </div>
          
          <button className={`w-full py-4 rounded-xl font-black text-lg transition-colors border-2 ${currentTier === 'ip_professional' ? 'bg-gray-200 text-gray-500 border-transparent cursor-not-allowed' : 'bg-[#131313] text-white border-[#131313] hover:bg-black'}`}>
            {currentTier === 'ip_professional' ? 'Active' : 'Get Professional Tier'}
          </button>
        </div>

      </div>
    </div>
  );
}
