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
    <div className="min-h-screen bg-[#f8f9fa]"><div className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Hi, {user?.name ? user.name.split(' ')[0] : 'there'}!
        </h1>
        <p className="text-xl font-bold text-gray-600 max-w-2xl mx-auto">
          Manage your membership and upgrade your experience.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* STUDENTS PLAN */}
        <div className={`bg-white rounded-[2rem] border-2 ${currentTier === 'student' ? 'border-[#5a32fa] shadow-md ring-4 ring-[#5a32fa]/10' : 'border-gray-100 shadow-sm hover:shadow-md'} p-8 flex flex-col relative overflow-hidden transition-all`}>
          {currentTier === 'student' && (
            <div className="absolute top-0 right-0 bg-[#5a32fa] text-white text-xs font-bold px-4 py-2 rounded-bl-xl border-b border-l border-[#5a32fa]">
              CURRENT PLAN
            </div>
          )}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <GraduationCap className="text-[#5a32fa]" size={28} /> Students
            </h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-gray-900">£99</span>
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
          
          <button className={`w-full py-4 rounded-xl font-bold text-lg transition-colors border-2 ${currentTier === 'student' ? 'bg-gray-200 text-gray-500 border-transparent cursor-not-allowed' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
            {currentTier === 'student' ? 'Active' : 'Get Student Tier'}
          </button>
        </div>

        {/* STARTUPS PLAN */}
        <div className={`bg-white rounded-[2rem] border-2 ${currentTier === 'startup' ? 'border-[#ffc900] shadow-md ring-4 ring-[#ffc900]/10' : 'border-gray-100 shadow-sm hover:shadow-md'} p-8 flex flex-col relative overflow-hidden transition-all md:-translate-y-4`}>
          {currentTier === 'startup' && (
            <div className="absolute top-0 right-0 bg-[#ffc900] text-gray-900 text-xs font-bold px-4 py-2 rounded-bl-xl border-b border-l border-[#ffc900]">
              CURRENT PLAN
            </div>
          )}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Building2 className="text-[#ffc900]" size={28} /> Start-Ups
            </h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-gray-900">£295</span>
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
          
          <button className={`w-full py-4 rounded-xl font-bold text-lg transition-colors border-2 ${currentTier === 'startup' ? 'bg-gray-200 text-gray-500 border-transparent cursor-not-allowed' : 'bg-[#ffc900] text-gray-900 border-[#ffc900] hover:bg-[#e6b500]'}`}>
            {currentTier === 'startup' ? 'Active' : 'Get Start-Up Tier'}
          </button>
        </div>

        {/* IP PROFESSIONALS PLAN */}
        <div className={`bg-white rounded-[2rem] border-2 ${currentTier === 'ip_professional' ? 'border-[#00d26a] shadow-md ring-4 ring-[#00d26a]/10' : 'border-gray-100 shadow-sm hover:shadow-md'} p-8 flex flex-col relative overflow-hidden transition-all`}>
          {currentTier === 'ip_professional' && (
            <div className="absolute top-0 right-0 bg-[#00d26a] text-white text-xs font-bold px-4 py-2 rounded-bl-xl border-b border-l border-[#00d26a]">
              CURRENT PLAN
            </div>
          )}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Briefcase className="text-[#00d26a]" size={28} /> IP Professionals
            </h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-gray-900">£395</span>
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
          
          <button className={`w-full py-4 rounded-xl font-bold text-lg transition-colors border-2 ${currentTier === 'ip_professional' ? 'bg-gray-200 text-gray-500 border-transparent cursor-not-allowed' : 'bg-[#131313] text-white border-[#131313] hover:bg-black'}`}>
            {currentTier === 'ip_professional' ? 'Active' : 'Get Professional Tier'}
          </button>
        </div>

      </div>

      {/* Mindblowing Advertisement Banner */}
      <div className="mt-16 w-full rounded-[2.5rem] bg-[#0f172a] p-[2px] relative group overflow-hidden shadow-[0_20px_60px_-15px_rgba(90,50,250,0.3)] hover:shadow-[0_20px_80px_-10px_rgba(255,144,232,0.4)] transition-all duration-700">
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5a32fa] via-[#ff90e8] to-[#00d26a] opacity-60 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
        
        <div className="relative bg-[#0f172a] rounded-[2.4rem] h-full w-full p-10 md:p-14 overflow-hidden flex flex-col md:flex-row items-center gap-10">
          {/* Animated Background Spheres */}
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-[#5a32fa] rounded-full blur-[120px] opacity-40 group-hover:bg-[#ff90e8] transition-colors duration-1000 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-80 h-80 bg-[#00d26a] rounded-full blur-[100px] opacity-30 group-hover:bg-[#5a32fa] transition-colors duration-1000"></div>

          {/* Left Content */}
          <div className="flex-1 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#ff90e8] animate-ping"></span>
              Official Enterprise Partner
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Scale Your IP Practice with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff90e8] to-[#5a32fa]">Advitam AI</span>
            </h2>
            
            <p className="text-gray-400 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto md:mx-0">
              Automate trademark searches, draft patents in minutes, and manage your global portfolio from a single intuitive dashboard. Join 500+ leading law firms.
            </p>
            
            <button className="relative overflow-hidden bg-white text-[#131313] px-8 py-4 rounded-2xl font-black text-lg group/btn hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              <span className="relative z-10 flex items-center justify-center gap-2">Request VIP Demo <ArrowRight size={20} /></span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff90e8] to-[#5a32fa] opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Right Visual / 3D Element */}
          <div className="w-full md:w-[400px] relative z-10 hidden md:block">
            <div className="w-full aspect-square relative group-hover:rotate-3 group-hover:scale-105 transition-transform duration-700 ease-out">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] rounded-3xl opacity-20 blur-xl group-hover:opacity-60 transition-opacity duration-700"></div>
              
              <div className="relative w-full h-full bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 backdrop-blur-sm">
                
                <div className="relative text-center z-10">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#5a32fa] to-[#ff90e8] rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(90,50,250,0.6)] animate-bounce border border-white/20">
                    <Briefcase size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Advitam AI Suite</h3>
                  <p className="text-[#00d26a] font-bold text-sm bg-[#00d26a]/10 px-3 py-1 rounded-full inline-flex items-center gap-1 border border-[#00d26a]/20 mt-2 shadow-sm">
                    <Check size={14} /> 99.9% Accuracy Rate
                  </p>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-8 left-8 w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center backdrop-blur-md shadow-lg transform -rotate-12 group-hover:rotate-12 transition-transform duration-700">
                  <span className="text-[#ff90e8] font-black text-xl">AI</span>
                </div>
                <div className="absolute bottom-8 right-8 w-14 h-14 bg-white/5 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md shadow-lg transform rotate-12 group-hover:-rotate-12 transition-transform duration-700">
                  <Building2 className="text-[#5a32fa]" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
