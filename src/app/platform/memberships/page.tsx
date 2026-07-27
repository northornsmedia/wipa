'use client';

import { useAppStore } from '@/store/useAppStore';
import { Check, X, Star, Zap } from 'lucide-react';

export default function MembershipsPage() {
  const { user } = useAppStore();

  return (
    <div className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Hi, {user?.name ? user.name.split(' ')[0] : 'there'}!
        </h1>
        <p className="text-xl font-bold text-gray-600 max-w-2xl mx-auto">
          Ready to upgrade your experience? Choose the plan that best fits your networking and professional goals.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* FREE PLAN */}
        <div className="bg-white rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] p-8 flex flex-col relative overflow-hidden">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Basic</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-gray-900">$0</span>
              <span className="text-lg font-bold text-gray-500">/month</span>
            </div>
            <p className="text-sm font-bold text-gray-500 mt-4">Perfect for getting started and exploring the network.</p>
          </div>
          
          <div className="flex-1 space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Post up to 7 messages per month</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Basic profile setup</span>
            </div>
            <div className="flex items-start gap-3 opacity-50">
              <X className="text-red-500 mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700 line-through">Unlimited messaging</span>
            </div>
            <div className="flex items-start gap-3 opacity-50">
              <X className="text-red-500 mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700 line-through">Profile analytics</span>
            </div>
          </div>
          
          <button className="w-full py-4 bg-gray-200 text-gray-500 rounded-xl font-black text-lg border-2 border-transparent cursor-not-allowed">
            Current Plan
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="bg-[#5a32fa] rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] p-8 flex flex-col relative transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-[#ffc900] text-[#131313] text-xs font-black px-4 py-2 rounded-bl-xl border-b-4 border-l-4 border-[#131313]">
            MOST POPULAR
          </div>
          
          <div className="mb-8 mt-4">
            <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
              Pro <Zap className="text-[#ffc900]" size={24} fill="#ffc900" />
            </h2>
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-5xl font-black">$19</span>
              <span className="text-lg font-bold opacity-80">/month</span>
            </div>
            <p className="text-sm font-bold text-white/80 mt-4">For active professionals looking to expand their reach.</p>
          </div>
          
          <div className="flex-1 space-y-4 mb-8 text-white">
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold">Unlimited messaging & posts</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold">See who viewed your profile</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold">Access to exclusive groups</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold">Advanced networking analytics</span>
            </div>
          </div>
          
          <button className="w-full py-4 bg-[#ffc900] text-[#131313] rounded-xl font-black text-lg border-2 border-[#131313] hover:shadow-[4px_4px_0px_0px_#131313] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none">
            Upgrade to Pro
          </button>
        </div>

        {/* ELITE PLAN */}
        <div className="bg-white rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] p-8 flex flex-col relative overflow-hidden">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
              Elite <Star className="text-[#ff90e8]" size={24} fill="#ff90e8" />
            </h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-gray-900">$49</span>
              <span className="text-lg font-bold text-gray-500">/month</span>
            </div>
            <p className="text-sm font-bold text-gray-500 mt-4">The ultimate package for industry leaders and mentors.</p>
          </div>
          
          <div className="flex-1 space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Everything in Pro</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">1-on-1 Mentorship Matchmaking</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Prioritized Event Registration</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-[#00d26a] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
              <span className="font-bold text-gray-700">Verified Profile Badge Checkmark</span>
            </div>
          </div>
          
          <button className="w-full py-4 bg-white text-[#131313] rounded-xl font-black text-lg border-4 border-[#131313] hover:bg-[#131313] hover:text-white transition-colors">
            Get Elite
          </button>
        </div>

      </div>
    </div>
  );
}
