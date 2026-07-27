'use client';

import Link from 'next/link';
import { Check, GraduationCap, Building2, Briefcase } from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fbe8d5] bg-grid-pattern font-sans overflow-x-hidden flex flex-col">
      
      <PublicHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 z-10 relative">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#b892ff] text-black font-black px-6 py-2 rounded-full text-sm border-4 border-[#131313] shadow-[4px_4px_0px_0px_#131313] mb-8 tracking-wider uppercase">
            Membership Plans
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-gray-900 mb-6 leading-[1.1]">
            Invest In Your IP Career
          </h1>
          <p className="text-xl font-bold text-gray-600 max-w-2xl mx-auto">
            Choose the membership tier that best fits your professional journey and unlock the power of a global network.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          
          {/* STUDENTS PLAN */}
          <div className="bg-white rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-2">
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
            
            <Link href="/signup?tier=student" className="w-full py-4 text-center rounded-xl font-black text-lg transition-colors border-4 border-[#131313] bg-white text-[#131313] hover:bg-gray-100">
              Purchase Now
            </Link>
          </div>

          {/* IP PROFESSIONALS PLAN */}
          <div className="bg-[#ffc900] rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-2 md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-[#131313] text-white text-xs font-black px-4 py-2 rounded-bl-xl border-b-4 border-l-4 border-[#131313]">
              MOST POPULAR
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[#131313] mb-2 flex items-center gap-2">
                <Briefcase className="text-[#131313]" size={28} /> IP Professionals
              </h2>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-[#131313]">£395</span>
                <span className="text-lg font-bold text-[#131313]/80">/year</span>
              </div>
              <p className="text-sm font-bold text-[#131313]/80 mt-4">For IP lawyers, attorneys, and patent professionals.</p>
            </div>
            
            <div className="flex-1 space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-[#131313] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
                <span className="font-bold text-[#131313]">Verified Professional Badge</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#131313] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
                <span className="font-bold text-[#131313]">Global Directory Listing</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#131313] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
                <span className="font-bold text-[#131313]">Unlimited Platform Access</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#131313] mt-0.5 flex-shrink-0" size={20} strokeWidth={3} />
                <span className="font-bold text-[#131313]">Advanced Analytics</span>
              </div>
            </div>
            
            <Link href="/signup?tier=ip_professional" className="w-full py-4 text-center rounded-xl font-black text-lg transition-colors border-4 border-[#131313] bg-[#131313] text-white hover:bg-black">
              Purchase Now
            </Link>
          </div>

          {/* STARTUPS PLAN */}
          <div className="bg-white rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-2">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                <Building2 className="text-[#ff5241]" size={28} /> Start-Ups
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
            
            <Link href="/signup?tier=startup" className="w-full py-4 text-center rounded-xl font-black text-lg transition-colors border-4 border-[#131313] bg-white text-[#131313] hover:bg-gray-100">
              Purchase Now
            </Link>
          </div>

        </div>
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto bg-white rounded-[2rem] border-4 border-[#131313] p-10 shadow-[8px_8px_0px_0px_#131313]">
          <h2 className="font-serif text-3xl font-bold mb-8 text-[#131313]">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-b-2 border-[#131313]/10 pb-6">
              <h3 className="text-xl font-bold text-[#131313] mb-2">Can I upgrade my plan later?</h3>
              <p className="text-gray-600 font-medium">Yes! You can upgrade your plan at any time from your account settings. We'll prorate the difference for the remainder of your billing cycle.</p>
            </div>
            <div className="border-b-2 border-[#131313]/10 pb-6">
              <h3 className="text-xl font-bold text-[#131313] mb-2">What qualifies me for the Student tier?</h3>
              <p className="text-gray-600 font-medium">You must be currently enrolled in an accredited university or law school, or have graduated within the last 12 months. We verify this during onboarding.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#131313] mb-2">Is this tax deductible?</h3>
              <p className="text-gray-600 font-medium">In many jurisdictions, professional networking and organization dues are tax-deductible as a business expense. Please consult with your tax advisor.</p>
            </div>
          </div>
        </div>

      </main>
      <PublicFooter />
    </div>
  );
}
