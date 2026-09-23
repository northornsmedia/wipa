'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { 
  Check, 
  SlidersHorizontal, 
  ArrowRight, 
  Bot, 
  FileText, 
  BookOpen, 
  Compass, 
  Zap, 
  ShieldCheck, 
  Layers, 
  CreditCard, 
  HelpCircle, 
  Crown, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';

export default function SallyIPPage() {
  const setIsLexIQOpen = useAppStore((state) => state.setIsLexIQOpen);
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);

  const [proTier, setProTier] = useState<'300' | '600'>('600');
  const [entTier, setEntTier] = useState<'900' | '1499'>('900');

  const wipaMemberPlan = {
    id: 'wipa-member',
    name: 'WIPA MEMBER',
    price: '£0',
    period: '/ month',
    badge: 'Current Included Benefit',
    badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    desc: 'Exclusive complimentary access for verified Women in IP Alliance members.',
    highlight: false,
    isCurrent: true,
    features: [
      'Login with your WIPA account',
      'Automatically receive access to Sally IP',
      'Access to basic Sally IP features',
      'Access to 20 documents from the 410-document library',
      '15 credits per month',
      '0.1 credit per prompt',
      '1 credit per generated/drafted document',
      'No separate Sally IP subscription required for basic access'
    ],
    cta: 'Active on Your Account'
  };

  const proPlans = {
    '300': {
      id: 'professional',
      name: 'PROFESSIONAL',
      price: '£499',
      period: '/ month',
      badge: 'Individual Practice',
      badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20',
      desc: 'Expanded research power and drafting capacity for solo practitioners and associates.',
      highlight: false,
      isCurrent: false,
      features: [
        'Access to 200 documents',
        '300 credits per month',
        '0.1 credit per prompt',
        '1 credit per generated/drafted document',
        'Advanced Sally IP drafting capabilities',
        'Premium document library access'
      ],
      cta: 'Upgrade to Professional'
    },
    '600': {
      id: 'business',
      name: 'BUSINESS',
      price: '£699',
      period: '/ month',
      badge: 'Most Popular',
      badgeColor: 'bg-gradient-to-r from-[#5a32fa] to-[#ff79c6] text-white border-transparent',
      desc: 'Enhanced volume and collaborative capabilities for boutique IP firms and corporate teams.',
      highlight: true,
      isCurrent: false,
      features: [
        'Access to 600 credits per month',
        'Expanded document access',
        'Advanced Sally IP drafting capabilities',
        'Higher usage limits',
        'Premium features'
      ],
      cta: 'Upgrade to Business'
    }
  };

  const entPlans = {
    '900': {
      id: 'enterprise',
      name: 'ENTERPRISE',
      price: '£999',
      period: '/ month',
      badge: 'Full Library',
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20',
      desc: 'Unrestricted access to the entire 410-document library with early feature access.',
      highlight: false,
      isCurrent: false,
      features: [
        '900 credits per month',
        'Access to all 410 documents',
        'Full Sally IP document library',
        'Advanced drafting capabilities',
        'Beta releases',
        'Early access to new features'
      ],
      cta: 'Upgrade to Enterprise'
    },
    '1499': {
      id: 'enterprise-plus',
      name: 'ENTERPRISE+',
      price: '£1,499',
      period: '/ month',
      badge: 'Maximum Allowance',
      badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
      desc: 'The pinnacle tier for high-volume enterprise IP departments and multinational teams.',
      highlight: false,
      isCurrent: false,
      features: [
        '1,499 credits per month',
        'Access to all 410 documents',
        'Full Sally IP document library',
        'Advanced drafting capabilities',
        'Beta releases',
        'Early access to new features',
        'Maximum monthly credit allowance'
      ],
      cta: 'Upgrade to Enterprise+'
    }
  };

  const currentPro = proPlans[proTier];
  const currentEnt = entPlans[entTier];

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] dark:bg-[#070b14] text-slate-900 dark:text-white font-sans relative overflow-x-hidden pb-24">
      
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[800px] rounded-full bg-gradient-to-b from-purple-500/15 via-pink-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-[900px] -left-40 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-[1400px] -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 relative z-10">

        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Logo & Partnership Tag */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#121829] border border-purple-200 dark:border-white/10 shadow-xs mb-6">
            <img src="/sally-logo.png" alt="Sally IP" className="w-5 h-5 object-contain dark:invert" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              WIPA × Sally IP
            </span>
            <span className="h-3 w-px bg-slate-200 dark:bg-white/10" />
            <span className="text-xs font-extrabold text-[#5a32fa] dark:text-purple-300">
              Member Benefit
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Your WIPA Membership Comes With <span className="bg-gradient-to-r from-[#5a32fa] via-purple-600 to-[#ff79c6] bg-clip-text text-transparent">Sally IP</span>
          </h1>

          <p className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-200 mt-4 tracking-tight">
            Turn Your IP Work Into a Smarter, Faster Workflow
          </p>

          {/* Complimentary Badge */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-black tracking-wide uppercase">
            <span>£0 ADDITIONAL COST</span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed max-w-2xl mx-auto">
            WIPA members get complimentary access to Sally IP Basic — an AI-powered IP co-pilot built to help you move from questions → research → professional drafts in one place.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://sallyip.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#5a32fa] via-purple-600 to-[#7c3aed] hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-black shadow-lg shadow-purple-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <img src="/sally-logo.png" alt="Sally" className="w-4 h-4 object-contain invert" />
              <span>Launch Sally 4.1 Pro</span>
              <ArrowRight size={15} />
            </a>

            <a
              href="https://sallyip.com/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#121829] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-white text-sm font-bold border border-slate-200/80 dark:border-white/10 shadow-xs active:scale-95 transition-all"
            >
              <span>View Pricing Plans</span>
              <ChevronRight size={15} className="text-slate-400" />
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* YOUR WIPA MEMBER ACCESS - HIGHLIGHT CARD */}
        {/* ============================================================ */}
        <div className="rounded-3xl border border-purple-100 dark:border-slate-800 bg-white dark:bg-[#0c1020] p-6 sm:p-8 md:p-10 shadow-xl shadow-purple-500/5 mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-white/10">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5a32fa] dark:text-purple-300">
                Included With Your Membership
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Your WIPA Member Access
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-xs font-bold text-[#5a32fa] dark:text-purple-300">
                15 Credits / Month Included
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-xs font-bold text-blue-600 dark:text-blue-300">
                20 Document Library
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-6">
            {[
              '15 Sally IP credits every month',
              '20 curated IP documents from the 410-document library',
              'AI-powered IP research assistance',
              'AI-powered document drafting',
              '0.1 credit per prompt',
              '1 credit per generated document',
              "Access to Sally IP's core IP workflows",
              'No separate Sally IP subscription required for basic access'
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                <div className="h-6 w-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* WHAT CAN SALLY HELP YOU DO? (5 CORE CAPABILITIES) */}
        {/* ============================================================ */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5a32fa] dark:text-purple-300">
              Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              What Can Sally Help You Do?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Designed specifically for the rigorous demands of Intellectual Property professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-[#5a32fa] dark:text-purple-300 flex items-center justify-center mb-4 border border-purple-200/60 dark:border-purple-800/40 group-hover:scale-105 transition-transform">
                  <Compass size={22} strokeWidth={2.4} />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
                  Explore IP Information
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ask Sally questions and work through IP concepts, terminology, and available resources with pinpoint precision.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] font-bold text-[#5a32fa] dark:text-purple-300 flex items-center gap-1">
                <span>Ask questions in natural language</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-4 border border-blue-200/60 dark:border-blue-800/40 group-hover:scale-105 transition-transform">
                  <BookOpen size={22} strokeWidth={2.4} />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
                  Work With Professional Resources
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Use your included document library to find relevant material instead of searching through scattered, unverified resources.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] font-bold text-blue-600 dark:text-blue-300 flex items-center gap-1">
                <span>Curated 410-document base</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-[#ff2a5f] dark:text-pink-300 flex items-center justify-center mb-4 border border-pink-200/60 dark:border-pink-800/40 group-hover:scale-105 transition-transform">
                  <FileText size={22} strokeWidth={2.4} />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
                  Start Documents Faster
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Give Sally your requirements and use its drafting capabilities to create a structured, legally sound starting point.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] font-bold text-[#ff2a5f] dark:text-pink-300 flex items-center gap-1">
                <span>1 credit per draft</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-4 border border-emerald-200/60 dark:border-emerald-800/40 group-hover:scale-105 transition-transform">
                  <SlidersHorizontal size={22} strokeWidth={2.4} />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
                  Refine Your Work
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Continue the conversation with Sally to improve, restructure, expand claims, or develop your legal drafts iteratively.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] font-bold text-emerald-600 dark:text-emerald-300 flex items-center gap-1">
                <span>Interactive iterative editing</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between md:col-span-2 lg:col-span-2">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-4 border border-amber-200/60 dark:border-amber-800/40 group-hover:scale-105 transition-transform">
                  <Zap size={22} strokeWidth={2.4} />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
                  Turn an Idea Into a Workflow
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                  Use Sally to help identify a practical next step when you are unsure where to begin — connecting research, drafting, and Alliance network resources seamlessly.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] font-bold text-amber-600 dark:text-amber-300 flex items-center gap-1">
                <span>From idea to finalized IP strategy</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* YOUR MONTHLY BENEFIT & WORKFLOW RIBBON */}
        {/* ============================================================ */}
        <div className="rounded-3xl bg-gradient-to-br from-[#120826] via-[#1a0f35] to-[#25124a] text-white p-6 sm:p-10 border border-purple-500/30 shadow-2xl relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#ff79c6]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#5a32fa]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-purple-200 border border-white/20">
              Core Monthly Allocation
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-3 mb-2">
              Your Monthly Benefit
            </h2>
            <p className="text-base sm:text-lg font-bold text-[#ff90e8]">
              15 Credits + 20 Documents + Sally IP's Core AI Capabilities
            </p>

            <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
              Use your credits across your Sally IP workflow:
            </p>

            {/* Workflow steps */}
            <div className="flex items-center gap-2 sm:gap-3 mt-4 flex-wrap text-xs sm:text-sm font-black">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">Ask Sally</span>
              <span className="text-[#ff90e8]">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">Explore</span>
              <span className="text-[#ff90e8]">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">Draft</span>
              <span className="text-[#ff90e8]">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">Refine</span>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-300 mb-1">
                And When You Need More...
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                If your IP work grows beyond the Basic Plan, you can upgrade to a paid Sally IP plan for more credits, more documents, advanced capabilities, and expanded access.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SALLY IP PRICING PLANS */}
        {/* ============================================================ */}
        <div id="pricing" className="scroll-mt-10 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5a32fa] dark:text-purple-300">
              Subscription Tiers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Sally IP Pricing Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Flexible access to AI-powered IP drafting and the Sally IP document library.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* CARD 1: WIPA MEMBER */}
            <div className="rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative bg-white dark:bg-[#0c1020] text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md">
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-black tracking-wider uppercase">
                    {wipaMemberPlan.name}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${wipaMemberPlan.badgeColor}`}>
                    {wipaMemberPlan.badge}
                  </span>
                </div>

                {/* Sub-pill to align with Card 2 & 3 toggles */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-2xl mb-4 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-bold min-h-[38px]">
                  <span>15 Credits Monthly</span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded-full">Included</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight">
                    {wipaMemberPlan.price}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {wipaMemberPlan.period}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  {wipaMemberPlan.desc}
                </p>

                {/* Features List */}
                <div className="space-y-2.5 mb-6 pt-4 border-t border-slate-100 dark:border-white/5">
                  {wipaMemberPlan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check 
                        size={14} 
                        className="shrink-0 mt-0.5 text-emerald-500" 
                        strokeWidth={2.8} 
                      />
                      <span className="text-xs leading-snug font-medium text-slate-700 dark:text-slate-300">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan Action CTA */}
              <div>
                <button
                  onClick={() => setIsLexIQOpen(true)}
                  className="w-full py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:bg-emerald-500/25 transition-colors"
                >
                  <CheckCircle2 size={15} />
                  <span>{wipaMemberPlan.cta}</span>
                </button>
              </div>
            </div>

            {/* CARD 2: PROFESSIONAL / BUSINESS (WITH CREDIT TOGGLE) */}
            <div
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                proTier === '600'
                  ? 'bg-white dark:bg-[#120826] text-slate-900 dark:text-white border-2 border-purple-500/80 shadow-xl shadow-purple-500/15'
                  : 'bg-white dark:bg-[#0c1020] text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md'
              }`}
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-black tracking-wider uppercase">
                    {currentPro.name}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${currentPro.badgeColor}`}>
                    {currentPro.badge}
                  </span>
                </div>

                {/* In-Card Toggle for Professional vs Business */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-4 border border-slate-200/80 dark:border-white/10 min-h-[38px] items-center">
                  <button
                    type="button"
                    onClick={() => setProTier('300')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      proTier === '300'
                        ? 'bg-blue-600 text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>300 Credits</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProTier('600')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      proTier === '600'
                        ? 'bg-gradient-to-r from-[#5a32fa] to-[#ff79c6] text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>600 Credits</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black tracking-tight ${proTier === '600' ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300'}`}>Popular</span>
                  </button>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight">
                    {currentPro.price}
                  </span>
                  <span className={`text-xs font-medium ${proTier === '600' ? 'text-slate-500 dark:text-purple-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {currentPro.period}
                  </span>
                </div>

                <p className="text-xs mb-6 text-slate-500 dark:text-slate-400">
                  {currentPro.desc}
                </p>

                {/* Features List */}
                <div className="space-y-2.5 mb-6 pt-4 border-t border-slate-100 dark:border-white/5">
                  {currentPro.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check 
                        size={14} 
                        className={`shrink-0 mt-0.5 ${proTier === '600' ? 'text-[#ff79c6]' : 'text-blue-500 dark:text-blue-400'}`} 
                        strokeWidth={2.8} 
                      />
                      <span className="text-xs leading-snug font-medium text-slate-700 dark:text-slate-300">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan Action CTA */}
              <div>
                <button
                  onClick={() => setSelectedPlanModal(currentPro.name)}
                  className={`w-full py-3 rounded-2xl text-xs font-black transition-all active:scale-98 cursor-pointer shadow-md ${
                    proTier === '600'
                      ? 'bg-gradient-to-r from-[#5a32fa] to-[#ff79c6] hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-500/30'
                      : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                  }`}
                >
                  {currentPro.cta}
                </button>
              </div>
            </div>

            {/* CARD 3: ENTERPRISE / ENTERPRISE+ (WITH CREDIT TOGGLE) */}
            <div
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                entTier === '1499'
                  ? 'bg-white dark:bg-[#161005] text-slate-900 dark:text-white border-2 border-amber-500/80 shadow-xl shadow-amber-500/15'
                  : 'bg-white dark:bg-[#0c1020] text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md'
              }`}
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-black tracking-wider uppercase">
                    {currentEnt.name}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${currentEnt.badgeColor}`}>
                    {currentEnt.badge}
                  </span>
                </div>

                {/* In-Card Toggle for Enterprise vs Enterprise+ */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-4 border border-slate-200/80 dark:border-white/10 min-h-[38px] items-center">
                  <button
                    type="button"
                    onClick={() => setEntTier('900')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      entTier === '900'
                        ? 'bg-purple-600 text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>900 Credits</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntTier('1499')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      entTier === '1499'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>1,499 Credits</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black tracking-tight ${entTier === '1499' ? 'bg-white/20' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'}`}>Max</span>
                  </button>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight">
                    {currentEnt.price}
                  </span>
                  <span className={`text-xs font-medium ${entTier === '1499' ? 'text-slate-500 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {currentEnt.period}
                  </span>
                </div>

                <p className="text-xs mb-6 text-slate-500 dark:text-slate-400">
                  {currentEnt.desc}
                </p>

                {/* Features List */}
                <div className="space-y-2.5 mb-6 pt-4 border-t border-slate-100 dark:border-white/5">
                  {currentEnt.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check 
                        size={14} 
                        className={`shrink-0 mt-0.5 ${entTier === '1499' ? 'text-amber-500 dark:text-amber-400' : 'text-purple-500 dark:text-purple-400'}`} 
                        strokeWidth={2.8} 
                      />
                      <span className="text-xs leading-snug font-medium text-slate-700 dark:text-slate-300">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan Action CTA */}
              <div>
                <button
                  onClick={() => setSelectedPlanModal(currentEnt.name)}
                  className={`w-full py-3 rounded-2xl text-xs font-black transition-all active:scale-98 cursor-pointer shadow-md ${
                    entTier === '1499'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/30'
                      : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                  }`}
                >
                  {currentEnt.cta}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ADDITIONAL CREDITS & DOCUMENT LIBRARY INFO */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Card: Additional Credits */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-[#5a32fa] dark:text-purple-300 flex items-center justify-center border border-purple-200/60 dark:border-purple-800/40">
                <CreditCard size={18} strokeWidth={2.4} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Additional Credits
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  On-demand usage top-ups
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Need more credits? Purchase additional credits without changing your plan.
            </p>

            <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5a32fa]" />
                <strong>0.1 credit</strong> per prompt
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5a32fa]" />
                <strong>1 credit</strong> per generated / drafted document
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5a32fa]" />
                Monthly credits reset with your billing cycle
              </li>
            </ul>
          </div>

          {/* Card: Document Library */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/80 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center border border-blue-200/60 dark:border-blue-800/40">
                <Layers size={18} strokeWidth={2.4} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Document Library
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  410 curated IP templates & resources
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Sally IP currently provides access to a library of <strong>410 documents</strong>, with the available document set determined by your plan.
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              From patent claim scaffolding to trademark co-existence agreements, commercial licensing schedules, and litigation notice templates.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CLOSING BANNER & LEGAL DISCLAIMER */}
        {/* ============================================================ */}
        <div className="text-center max-w-2xl mx-auto pt-6 border-t border-slate-200/80 dark:border-white/10">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#5a32fa] dark:text-purple-300 mb-2">
            ONE WIPA MEMBERSHIP. A WHOLE NEW IP WORKFLOW.
          </h3>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Join WIPA. Unlock Sally IP. Start working smarter.
          </p>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-6 leading-relaxed flex items-center justify-center gap-1.5">
            <Info size={13} className="shrink-0" />
            <span>
              Professional IP knowledge, powered by AI. AI-generated content is for informational and drafting assistance and should be reviewed by a qualified IP professional where appropriate.
            </span>
          </p>
        </div>

      </div>

      {/* Upgrade Inquiry Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200 dark:border-white/10 p-6 sm:p-7 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-[#5a32fa] dark:text-purple-300 flex items-center justify-center mx-auto mb-4 border border-purple-200 dark:border-purple-800/40">
              <Crown size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Upgrade to {selectedPlanModal}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 mb-6">
              To activate your {selectedPlanModal} tier or purchase additional credits for your team, our membership concierge will assist you immediately.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Close
              </button>
              <a
                href="https://sallyip.com/pricing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSelectedPlanModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] text-xs font-bold text-white shadow-md shadow-purple-500/25 hover:from-purple-600 hover:to-indigo-600 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Go to Pricing</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
