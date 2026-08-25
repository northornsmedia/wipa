'use client';

import Link from 'next/link';
import { Check, GraduationCap, Building2, Briefcase, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

const TIERS = [
  {
    name: "Students & Trainees",
    price: "£99",
    period: "/year",
    description: "For law students, patent trainees, and recent graduates building their early careers in IP.",
    badge: "Aspiring Counsel",
    isPopular: false,
    icon: GraduationCap,
    features: [
      "Access to IP Jobs & Internships Board",
      "1:1 Mentorship with Managing Partners",
      "Entry to Student & Trainee Webinars",
      "Basic Directory Profile",
      "Community Forum & Networking Hub"
    ],
    cta: "Join as Student",
    tierParam: "student",
    href: "/signup?tier=student"
  },
  {
    name: "IP Professionals",
    price: "£395",
    period: "/year",
    description: "For practicing patent attorneys, trademark specialists, and corporate in-house counsel.",
    badge: "MOST POPULAR",
    isPopular: true,
    icon: Briefcase,
    features: [
      "Verified Professional Badge & Priority Listing",
      "Full Access to LexIQ AI Assistant",
      "Live 30-Second Continuous IP News Feed",
      "35% Exclusive Discount on Annual Publications",
      "Meetn Live Virtual Roundtables & Calendar Sync",
      "Unlimited Access to Resource Toolkits & Guides"
    ],
    cta: "Upgrade to Professional",
    tierParam: "professional",
    href: "/signup?tier=professional"
  },
  {
    name: "Firms & Corporate",
    price: "£1,495",
    period: "/year",
    description: "For boutique IP agencies, multinational law firms, and corporate legal departments.",
    badge: "Enterprise",
    isPopular: false,
    icon: Building2,
    features: [
      "Up to 5 Team Member Accounts Included",
      "Featured Verified Law Firm Directory Page",
      "Priority Event Sponsorship & Keynote Access",
      "Enterprise LexIQ AI Multi-Seat License",
      "Recruiting & Job Board Spotlight",
      "Dedicated Alliance Account Manager"
    ],
    cta: "Register Firm",
    tierParam: "corporate",
    href: "/signup?tier=corporate"
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#060608] text-slate-900 dark:text-white font-sans overflow-x-hidden flex flex-col transition-colors duration-300 relative selection:bg-pink-500 selection:text-white">
      
      {/* Background Glowing Wavy Line Gradient SVG */}
      <div className="absolute top-16 left-0 right-0 w-full overflow-hidden pointer-events-none opacity-85 z-0">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-44 sm:h-64 stroke-current">
          <defs>
            <linearGradient id="pricingWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2a70" />
              <stop offset="50%" stopColor="#ff7836" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path d="M-20,30 Q80,130 200,60 T440,80 T550,20" fill="none" stroke="url(#pricingWaveGradient)" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Ambient Radial Neon Glows */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-[#ff2a70]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 right-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <div className="w-full z-50 relative border-b border-slate-100 dark:border-white/5 bg-white/90 dark:bg-[#060608]/80 backdrop-blur-md">
        <PublicHeader />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 z-10 relative">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 px-4 py-1.5 mb-6 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#ff2a70] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-500 to-purple-600 dark:from-pink-400 dark:via-orange-300 dark:to-purple-400">
              Membership Plans & Access
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.12] mb-6 max-w-4xl mx-auto tracking-tight">
            Invest in Your <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a70] via-[#ff7836] to-[#a855f7]">
              Intellectual Property Career
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Choose the membership tier tailored to your practice. Unlock verified credentials, AI intelligence tools, and a global alliance across 45+ nations.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 items-stretch">
          {TIERS.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <div 
                key={idx}
                className={`rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-2 ${
                  tier.isPopular
                    ? "bg-gradient-to-b from-white via-white to-pink-50/30 dark:from-[#111726] dark:via-[#0c101d] dark:to-[#070a12] border-2 border-[#ff2a70] shadow-2xl shadow-pink-500/15"
                    : "bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] shadow-lg dark:shadow-2xl"
                }`}
              >
                {/* Popular Badge */}
                {tier.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ff2a70] to-[#f97316] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      tier.isPopular 
                        ? "bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30" 
                        : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                    }`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                      {tier.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-slate-100 dark:border-white/5">
                    <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                      {tier.price}
                    </span>
                    <span className="text-sm font-bold text-slate-500">{tier.period}</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link
                  href={tier.href}
                  className={`w-full py-3.5 rounded-full font-bold text-sm text-center transition-all flex items-center justify-center gap-2 ${
                    tier.isPopular
                      ? "bg-gradient-to-r from-[#d946ef] via-[#ff2a70] to-[#f97316] text-white shadow-lg shadow-pink-500/25 hover:scale-102 active:scale-98"
                      : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md"
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Corporate & Institutional Note */}
        <section className="p-8 sm:p-12 rounded-[2rem] bg-slate-50 dark:bg-[#0c101d] border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" /> Need Institutional Invoicing or Multi-Firm Enterprise Licensing?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              We provide custom VAT invoicing, PO billing, and multi-office jurisdictional arrangements.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full border border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white transition-all shrink-0"
          >
            Contact Enterprise Support
          </Link>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
