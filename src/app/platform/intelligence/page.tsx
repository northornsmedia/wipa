'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, Zap, TrendingUp, BarChart3, Globe, Award, Sparkles, 
  ArrowUpRight, CheckCircle2, ChevronRight, FileText, Activity, Layers, 
  Cpu, Download, HelpCircle, ArrowRight, BookOpen, Clock, AlertCircle,
  ExternalLink, Eye, Share2, Bookmark, RefreshCw, X, Check, Lock,
  Building2, Mail, Phone, User, CheckCircle, Search, Laptop, FileCheck,
  ShieldCheck, Star, BadgeCheck, Sliders, ChevronDown, CheckCheck,
  Sparkle, Compass, Play, FileCode2, Scale
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface ProductSolution {
  id: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  description: string;
  icon: any;
  accentColor: string;
  accentBg: string;
  badge: string;
  metrics: { label: string; value: string }[];
  keyFeatures: string[];
  useCase: string;
}

const PRODUCTS: ProductSolution[] = [
  {
    id: 'protege',
    name: 'Lexis+® with Protégé™',
    shortName: 'Agentic Legal AI',
    category: 'Generative AI',
    tagline: 'Personalized, Agentic Generative AI for Legal & IP Practice',
    description: 'Lexis+® with Protégé™ combines cutting-edge generative AI with the world’s most authoritative legal and patent databases. Autonomously draft complex patent claims, analyze contracts, and conduct multi-step legal research grounded entirely in cited Shepard’s® authority.',
    icon: Sparkles,
    accentColor: 'text-[#E8171F]',
    accentBg: 'bg-red-50 dark:bg-red-950/30',
    badge: 'NEW LAUNCH 2026',
    metrics: [
      { label: 'Proprietary Legal Corpus', value: '1.4B+ Records' },
      { label: 'Hallucination Prevention', value: '100% Shepard’s® Grounded' },
      { label: 'Drafting Efficiency Gain', value: 'Up to 5x Faster' }
    ],
    keyFeatures: [
      'Agentic AI workflows that plan and execute multi-step IP and litigation research',
      'Personalized drafting that adapts to your firm’s unique tone, precedents, and standards',
      '100% grounded in LexisNexis primary law with point-in-time citation verification',
      'Enterprise-grade security: Zero customer data shared or used to train public LLMs'
    ],
    useCase: 'IP Litigators, Managing Partners & Patent Counsel wanting to automate complex legal drafting and research.'
  },
  {
    id: 'patentsight',
    name: 'PatentSight+™',
    shortName: 'Portfolio Valuation',
    category: 'Strategic Valuation',
    tagline: 'Scientific Patent Portfolio Valuation & Patent Asset Index™',
    description: 'Transform subjective patent counts into objective commercial value. PatentSight+™ evaluates patent families using the globally validated Patent Asset Index™ to measure competitive impact and technology relevance.',
    icon: BarChart3,
    accentColor: 'text-[#E8171F]',
    accentBg: 'bg-red-50 dark:bg-red-950/30',
    badge: 'Flagship Valuation',
    metrics: [
      { label: 'Fortune 500 Index Coverage', value: '100%' },
      { label: 'Citation Weighting Ratio', value: 'Verified 4.2x' },
      { label: 'Global Ownership Trees', value: '450K+ Entities' }
    ],
    keyFeatures: [
      'Patent Asset Index™ scoring (Competitive Impact × Portfolio Size)',
      'Instant competitor portfolio benchmarking and technological gap analysis',
      'M&A due diligence intelligence and IP licensing valuation radar',
      'Harmonized global patent ownership tracking across corporate subsidiaries'
    ],
    useCase: 'Corporate IP Leaders & M&A Partners evaluating licensing value or benchmarking against top Fortune 500 innovators.'
  },
  {
    id: 'patentadvisor',
    name: 'PatentAdvisor®',
    shortName: 'Examiner Analytics',
    category: 'Prosecution Strategy',
    tagline: 'USPTO Examiner Analytics & Office Action Predictability',
    description: 'Eliminate prosecution guesswork. PatentAdvisor® leverages statistical modeling on 8,000+ USPTO examiners to forecast allowance rates, time-to-grant, and optimal response strategies.',
    icon: Activity,
    accentColor: 'text-[#E8171F]',
    accentBg: 'bg-red-50 dark:bg-red-950/30',
    badge: 'Examiner Intelligence',
    metrics: [
      { label: 'USPTO Examiners Indexed', value: '8,000+' },
      { label: 'ETA™ Predictive Accuracy', value: '98.6%' },
      { label: 'Avg. RCE Cycle Reduction', value: '32%' }
    ],
    keyFeatures: [
      'Examiner Time Allocation (ETA™) score predicting allowance difficulty',
      'Art Unit allowance trajectories, office action counts, and grant timelines',
      'Actionable decision tree: File RCE vs. Appeal Brief vs. Examiner Interview',
      'Pre-filing classification radar to steer applications away from difficult tech centers'
    ],
    useCase: 'Patent Attorneys & Law Firms looking to minimize costly prosecution cycles and secure faster notices of allowance.'
  },
  {
    id: 'totalpatent',
    name: 'TotalPatent One®',
    shortName: 'Global Search',
    category: 'Patent Search Engine',
    tagline: 'High-Speed Comprehensive Global Patent Search & Dossiers',
    description: 'Lightning-fast full-text patent search engine indexing over 140+ million patent documents across 100+ global patent authorities with real-time Shepard’s® citation signals.',
    icon: Globe,
    accentColor: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    badge: '140M+ Patents',
    metrics: [
      { label: 'Patent Authorities', value: '100+' },
      { label: 'Full-Text Documents', value: '140M+' },
      { label: 'Shepard’s® Validated', value: '100% Real-time' }
    ],
    keyFeatures: [
      'Comprehensive coverage: USPTO, EPO, WIPO, JPO, CNIPA, KIPO and regional offices',
      'High-speed Boolean, command-line syntax, and semantic natural language search',
      'Integrated Shepard’s® Citations for instant validity and legal treatment indicators',
      'Side-by-side claim comparison, high-resolution drawing exports, and legal dossiers'
    ],
    useCase: 'Patent Search Specialists, Litigators & Information Professionals requiring exhaustive prior art and validity searches.'
  },
  {
    id: 'iplytics',
    name: 'IPlytics™',
    shortName: '5G & SEPs Radar',
    category: 'Standards Intelligence',
    tagline: 'Standard Essential Patents (SEPs) & 5G/6G Standards Radar',
    description: 'The market-leading database for Standard Essential Patent declarations and standards contribution tracking across 3GPP, ETSI, IEEE, and emerging wireless architectures.',
    icon: Cpu,
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badge: '5G / 6G Essential',
    metrics: [
      { label: 'Active Standard SEPs', value: '340,000+' },
      { label: '3GPP Working Groups', value: '100% Tracked' },
      { label: 'FRAND Licensing Database', value: 'Global Lead' }
    ],
    keyFeatures: [
      'Verified SEP declaration mapping for 5G, 6G, Wi-Fi 7, V2X, and video codecs',
      'Track real technical engineering contributions to standards development bodies',
      'Empower fair, reasonable, and non-discriminatory (FRAND) licensing negotiations',
      'Early radar for AI telecommunications, autonomous mobility, and IoT standards'
    ],
    useCase: 'Licensing Executives, In-House Telecom Counsel & Litigators handling standard essential patent negotiations.'
  },
  {
    id: 'patentoptimizer',
    name: 'PatentOptimizer®',
    shortName: 'Claim Drafting QA',
    category: 'Drafting Quality',
    tagline: 'Patent Claim Drafting & Quality Assurance in MS Word',
    description: 'Seamlessly integrated drafting tool that eliminates antecedent basis defects, verifies claim consistency, and streamlines response drafting directly inside Microsoft Word.',
    icon: FileCheck,
    accentColor: 'text-rose-600 dark:text-rose-400',
    accentBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    badge: 'Word Plugin',
    metrics: [
      { label: 'Section 112 Errors Caught', value: '99.4%' },
      { label: 'Drafting Time Reduction', value: '4.5 hrs/app' },
      { label: 'Integrated Environment', value: 'MS Word / PDF' }
    ],
    keyFeatures: [
      'Direct Microsoft Word plugin for seamless drafting workflow integration',
      'Instant antecedent basis checking and automated term consistency validation',
      'Visual interactive claim tree diagrams with automatic claim renumbering',
      'Section 112 rejection prevention tools and patent specification analysis'
    ],
    useCase: 'Patent Prosecutors, Associates & Patent Agents drafting original patent specifications and office action responses.'
  }
];

export default function IntelligencePage() {
  const { user } = useAppStore();
  const [selectedProductId, setSelectedProductId] = useState('patentsight');

  // Interactive ROI Calculator State
  const [annualFilings, setAnnualFilings] = useState(35);
  const [hourlyRate, setHourlyRate] = useState(450);

  // Live Simulation Calculations
  const activeProduct = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];
  const estimatedHoursSaved = Math.round(annualFilings * 12.5);
  const estimatedCostSavings = Math.round(estimatedHoursSaved * hourlyRate * 0.45);

  // Lead-Gen & Trial Modal State
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [selectedProductForTrial, setSelectedProductForTrial] = useState('LexisNexis® Complete IP Suite');
  const [trialFormSubmitted, setTrialFormSubmitted] = useState(false);
  const [trialFormData, setTrialFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: (user as any)?.company || '',
    role: (user as any)?.role || '',
    notes: '',
    selectedProducts: ['PatentSight+™', 'PatentAdvisor®', 'TotalPatent One®']
  });

  const openTrialModal = (productName = 'LexisNexis® Complete IP Suite') => {
    setSelectedProductForTrial(productName);
    setTrialFormSubmitted(false);
    setIsTrialModalOpen(true);
  };

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrialFormSubmitted(true);
  };

  const toggleProductSelection = (prod: string) => {
    setTrialFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(prod)
        ? prev.selectedProducts.filter(p => p !== prod)
        : [...prev.selectedProducts, prod]
    }));
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 font-sans pb-24 transition-colors">
      
      {/* ─── MAIN WRAPPER ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {/* ─── HERO CO-BRANDED PARTNER BANNER ───────────────────────── */}
        <div className="bg-white dark:bg-[#151c2c] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden mb-8 relative">
          
          {/* Top LexisNexis Red & WIPA Purple Accent Strip */}
          <div className="h-2.5 w-full bg-gradient-to-r from-[#E8171F] via-[#5a32fa] to-[#ff90e8]" />

          {/* Ambient Background Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8171F]/5 dark:bg-[#E8171F]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#5a32fa]/5 dark:bg-[#5a32fa]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="p-6 sm:p-10 lg:p-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left 7 Columns: Co-Branded Header & Value Props */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Official Logo & Partnership Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-[#E8171F] text-xs font-extrabold border border-red-500/20 shadow-xs">
                    <img src="/lexisnexis-icon.png" alt="LexisNexis" className="w-4 h-4 object-contain" />
                    <span>Official Global IP Intelligence Partner</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active Member Benefit</span>
                  </div>
                </div>

                {/* Main Headline with Official Logo */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/lexisnexis-logo.png" 
                      alt="LexisNexis" 
                      className="h-10 sm:h-12 w-auto object-contain block dark:hidden" 
                    />
                    <img 
                      src="/lexisnexis-logo-white.png" 
                      alt="LexisNexis" 
                      className="h-10 sm:h-12 w-auto object-contain hidden dark:block" 
                    />
                    <span className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#E8171F] font-black text-[11px] tracking-wider uppercase border border-red-200 dark:border-red-900/50">
                      IP Solutions
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.15]">
                    IP Intelligence & <span className="text-[#E8171F]">Solutions Hub</span>
                  </h1>
                  <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
                    Institutional Patent Analytics, Prosecution Predictability & Portfolio Valuation for WIPA Members.
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                  Through our strategic alliance with <strong>LexisNexis® IP Solutions</strong>, verified WIPA practitioners and member firms receive direct VIP access to the world&apos;s leading patent search, examiner analytics, and portfolio valuation tools with exclusive preferred benefits.
                </p>

                {/* Quick Value Pillars */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-gray-700 dark:text-gray-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-[#00d26a]" /> 30-Day Full Guided Trial
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-[#00d26a]" /> Exclusive 20% Firm Discount
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-[#00d26a]" /> Shepard&apos;s® Verified Signals
                  </span>
                </div>

                {/* Action Buttons (Red Themed) */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={() => openTrialModal('LexisNexis® Complete IP Suite 30-Day Access')}
                    className="px-7 py-3.5 rounded-full bg-[#E8171F] hover:bg-[#c91219] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Sparkles size={16} /> Claim 30-Day WIPA VIP Pass
                  </button>

                  <button
                    onClick={() => openTrialModal('Enterprise Law Firm Demo & Pricing Consultation')}
                    className="px-6 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Building2 size={16} className="text-[#E8171F]" /> Book Enterprise Demo
                  </button>
                </div>

              </div>

              {/* Right 5 Columns: Digital VIP Member Access Pass Card (White in Light Theme / Dark in Dark Theme) */}
              <div className="lg:col-span-5 w-full">
                <div className="relative rounded-3xl bg-gray-50/90 dark:bg-[#111625] text-gray-900 dark:text-white p-6 sm:p-7 shadow-lg border border-gray-200 dark:border-gray-700/80 overflow-hidden">
                  
                  {/* Card Subtle Red Accents */}
                  <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#E8171F]/10 dark:bg-[#E8171F]/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-[#5a32fa]/5 dark:bg-[#5a32fa]/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 space-y-5">
                    
                    {/* Pass Header Lockup */}
                    <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src="/lexisnexis-icon.png" 
                          alt="LexisNexis" 
                          className="w-12 h-12 rounded-2xl shadow-sm object-contain bg-white dark:bg-white/5 p-1 border border-gray-200/60 dark:border-white/10" 
                        />
                        <div>
                          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8171F]">
                            WIPA VIP Access Pass
                          </div>
                          <div className="text-base font-black text-gray-900 dark:text-white">
                            LexisNexis® IP Suite
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-white/10 border border-emerald-200/80 dark:border-white/15 text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck size={22} className="text-[#00d26a]" />
                      </div>
                    </div>

                    {/* Member Pass Metadata */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                        <span>Pass Reference:</span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white bg-white dark:bg-white/10 px-2.5 py-0.5 rounded-lg border border-gray-200 dark:border-white/10 shadow-2xs">
                          LN-WIPA-2026-VIP
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                        <span>Member Privilege:</span>
                        <span className="font-bold text-[#E8171F]">Exclusive 20% Firm Discount</span>
                      </div>

                      <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                        <span>Trial Duration:</span>
                        <span className="font-bold text-gray-900 dark:text-white">30 Days Guided Access</span>
                      </div>

                      <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                        <span>Status:</span>
                        <span className="inline-flex items-center gap-1 font-bold text-[#00d26a]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00d26a] animate-pulse" /> Verified Eligible
                        </span>
                      </div>
                    </div>

                    {/* Included Solutions Chips */}
                    <div className="pt-2 border-t border-gray-200/80 dark:border-white/10 space-y-2">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Included Suite Products:
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        {['Lexis+® with Protégé™', 'PatentSight+™', 'PatentAdvisor®', 'TotalPatent One®', 'IPlytics™', 'PatentOptimizer®'].map((p) => (
                          <span key={p} className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 text-gray-700 dark:text-white font-semibold border border-gray-200 dark:border-white/10 shadow-2xs">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button inside Pass */}
                    <button
                      onClick={() => openTrialModal('LexisNexis® Complete IP Suite 30-Day VIP Pass')}
                      className="w-full py-3.5 rounded-full bg-[#E8171F] hover:bg-[#c91219] text-white font-extrabold text-xs shadow-md shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Sparkles size={14} /> Activate My 30-Day VIP Pass
                    </button>

                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ─── FEATURED SPOTLIGHT: LEXIS+® WITH PROTÉGÉ™ (NEW LAUNCH) ── */}
        <div className="bg-gradient-to-br from-white via-red-50/40 to-slate-50 dark:from-[#151c2c] dark:via-[#1c1825] dark:to-[#111625] rounded-3xl border-2 border-red-500/30 dark:border-red-500/40 shadow-xl p-6 sm:p-10 mb-10 relative overflow-hidden">
          
          {/* Glowing Red & Purple Mesh Background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8171F]/10 dark:bg-[#E8171F]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#5a32fa]/10 dark:bg-[#5a32fa]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Left Content */}
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8171F] text-white text-xs font-black uppercase tracking-wider shadow-sm shadow-red-500/25 animate-pulse">
                  <Sparkles size={13} /> NEW FLAGSHIP LAUNCH 2026
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 dark:bg-red-500/20 text-[#E8171F] text-xs font-bold border border-red-500/20">
                  <Zap size={13} /> Next-Gen Agentic Legal & IP AI
                </span>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  Lexis+® with <span className="text-[#E8171F]">Protégé™</span>
                </h2>
                <p className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-200">
                  Your personalized, agentic AI partner for complex IP drafting, patent claim generation, and legal research.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                Lexis+® with Protégé™ combines next-generation conversational generative AI with the world’s most authoritative legal and patent repository. Conduct multi-step IP research, draft responses that reflect your firm’s unique style, and verify citations with 100% Shepard’s® authority.
              </p>

              {/* 4 Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/10 text-xs text-gray-800 dark:text-gray-200 shadow-2xs">
                  <Cpu size={16} className="text-[#E8171F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 dark:text-white font-bold">Agentic Multi-Step Reasoning</strong>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Plans and executes complex patent & prior art research autonomously.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/10 text-xs text-gray-800 dark:text-gray-200 shadow-2xs">
                  <FileCheck size={16} className="text-[#E8171F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 dark:text-white font-bold">Personalized Firm Voice</strong>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Drafts arguments and claims adapted to your firm’s standards & precedents.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/10 text-xs text-gray-800 dark:text-gray-200 shadow-2xs">
                  <ShieldCheck size={16} className="text-[#00d26a] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 dark:text-white font-bold">100% Shepard’s® Grounded</strong>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Eliminates hallucinations with real-time verified legal authority citations.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/10 text-xs text-gray-800 dark:text-gray-200 shadow-2xs">
                  <Lock size={16} className="text-[#5a32fa] dark:text-[#ff90e8] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 dark:text-white font-bold">Enterprise Vault Security</strong>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Privileged attorney-client confidentiality; zero data training on public LLMs.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => openTrialModal('Lexis+® with Protégé™ VIP Preview & Pilot Access')}
                  className="px-7 py-3.5 rounded-full bg-[#E8171F] hover:bg-[#c91219] text-white font-black text-xs sm:text-sm shadow-md shadow-red-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Sparkles size={16} /> Request Protégé™ VIP Preview
                </button>

                <button
                  onClick={() => openTrialModal('Lexis+® with Protégé™ Live AI Demonstration')}
                  className="px-6 py-3.5 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Laptop size={16} className="text-[#E8171F]" /> Watch Live AI Demo
                </button>
              </div>

            </div>

            {/* Right KPI Box */}
            <div className="shrink-0 w-full lg:w-72 p-6 rounded-3xl bg-white dark:bg-[#111625] border border-gray-200 dark:border-gray-700/80 shadow-md flex flex-col justify-between gap-4">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#E8171F] flex items-center gap-1.5">
                <Sparkle size={14} /> Protégé™ Benchmarks
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/70 dark:border-gray-700">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Legal AI Corpus</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white">1.4B+ Records</div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/70 dark:border-gray-700">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Drafting Velocity</div>
                  <div className="text-xl font-black text-[#E8171F]">Up to 5x Faster</div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/70 dark:border-gray-700">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Citation Accuracy</div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">100% Shepard&apos;s®</div>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 dark:text-gray-400 text-center font-semibold">
                Available now for WIPA Law Firms
              </div>
            </div>

          </div>
        </div>

        {/* ─── WIPA MEMBER BENEFITS (3-CARD GRID) ───────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-[#151c2c] rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:border-[#E8171F]/40 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-red-500/10 text-[#E8171F] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <Sparkles size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">30-Day Guided Enterprise Trial</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
              Full enterprise access to PatentSight+™, PatentAdvisor®, and TotalPatent One® with a dedicated LexisNexis onboarding manager to tailor data to your practice.
            </p>
          </div>

          <div className="bg-white dark:bg-[#151c2c] rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:border-[#E8171F]/40 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-red-500/10 text-[#E8171F] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <Award size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">Exclusive 20% Law Firm Discount</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
              Verified WIPA members and member firms receive institutional preferred rates on all LexisNexis IP software contracts, seat expansions, and API bundles.
            </p>
          </div>

          <div className="bg-white dark:bg-[#151c2c] rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:border-[#E8171F]/40 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-red-500/10 text-[#E8171F] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">Certified Specialist Credential</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
              Complete co-branded WIPA × LexisNexis CLE masterclasses to display the verified <em>LexisNexis® Certified IP Specialist</em> badge directly on your profile.
            </p>
          </div>
        </div>

        {/* ─── INTERACTIVE PRODUCT COCKPIT & SHOWCASE ───────────────── */}
        <div className="bg-white dark:bg-[#151c2c] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8 mb-10">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8171F] mb-1">
                <Compass size={14} /> Interactive Solutions Explorer
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Explore the LexisNexis® IP Suite
              </h2>
            </div>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Click any solution below to preview capabilities
            </span>
          </div>

          {/* Interactive Product Selector Tabs */}
          <div className="flex items-center gap-2 pt-6 pb-6 overflow-x-auto no-scrollbar">
            {PRODUCTS.map((p) => {
              const Icon = p.icon;
              const isSelected = p.id === selectedProductId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8171F] text-white shadow-md shadow-red-500/20 scale-102'
                      : 'bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon size={16} className={isSelected ? 'text-white' : p.accentColor} />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Product Interactive Deep-Dive Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            
            {/* Left 7 Columns: Product Details & Features */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-[#E8171F] text-xs font-extrabold border border-red-500/20">
                    {activeProduct.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold">
                    {activeProduct.badge}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-snug">
                  {activeProduct.tagline}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {activeProduct.description}
                </p>
              </div>

              {/* Key Features Checklist */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Core Capabilities & Workflow Impact:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeProduct.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-xs text-gray-800 dark:text-gray-200">
                      <CheckCircle2 size={16} className="text-[#E8171F] shrink-0 mt-0.5" />
                      <span className="font-medium leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Law Firm Use Case Box */}
              <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-500/20 text-xs space-y-1">
                <span className="font-bold text-[#E8171F] flex items-center gap-1">
                  <Star size={13} /> Recommended Practice Workflow:
                </span>
                <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                  {activeProduct.useCase}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openTrialModal(`${activeProduct.name} 30-Day VIP Trial`)}
                  className="px-6 py-3 rounded-full bg-[#E8171F] hover:bg-[#c91219] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Sparkles size={15} /> Request {activeProduct.name} Trial
                </button>

                <button
                  onClick={() => openTrialModal(`${activeProduct.name} Live Enterprise Demo`)}
                  className="px-5 py-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Laptop size={15} /> Schedule Walkthrough
                </button>
              </div>
            </div>

            {/* Right 5 Columns: Live Metric Ticker & Interactive Diagnostic Preview */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              
              {/* Product KPI Stats Box */}
              <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Institutional Intelligence Metrics
                </div>

                <div className="space-y-3">
                  {activeProduct.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#151c2c] border border-gray-200/80 dark:border-gray-700 shadow-xs">
                      <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">{m.label}</span>
                      <span className="text-sm font-black text-[#E8171F]">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Law Firm ROI Diagnostic Teaser (Red Accent) */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#E8171F] to-[#991B1B] text-white shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                    Practice ROI Impact
                  </span>
                  <Zap size={16} className="text-yellow-300" />
                </div>
                <h4 className="text-base font-extrabold">Accelerate Patent Grant Times</h4>
                <p className="text-xs text-white/90 leading-relaxed font-normal">
                  Law firms leveraging LexisNexis® IP solutions experience up to <strong>35% faster prosecution</strong> and reduce unnecessary RCE filing costs.
                </p>
                <button
                  onClick={() => openTrialModal('Custom Law Firm ROI & Pricing Assessment')}
                  className="w-full py-2.5 rounded-full bg-white text-[#E8171F] font-extrabold text-xs hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                >
                  Request Firm ROI Assessment →
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* ─── CO-BRANDED RESEARCH REPORTS & WHITEPAPERS ─────────────── */}
        <div className="bg-white dark:bg-[#151c2c] rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8171F] mb-1">
                <BookOpen size={14} /> Knowledge & Thought Leadership
              </div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                LexisNexis® IP Intelligence Research Series
              </h3>
            </div>
            <Link
              href="/platform/resources/research-reports"
              className="text-xs font-bold text-[#E8171F] hover:underline flex items-center gap-1 shrink-0"
            >
              Browse All Research Reports <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 space-y-2.5 flex flex-col justify-between hover:border-[#E8171F]/40 transition-all">
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#E8171F]">Global Benchmark</div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                  Top 100 Global Innovators: Patent Asset Index™ Benchmark
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
                  Evaluating global innovation leaders through science-backed quality and market coverage metrics.
                </p>
              </div>
              <Link
                href="/platform/resources/research-reports"
                className="text-xs font-bold text-[#E8171F] flex items-center gap-1 hover:underline pt-2"
              >
                <Download size={13} /> Download Report (PDF)
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 space-y-2.5 flex flex-col justify-between hover:border-[#E8171F]/40 transition-all">
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#E8171F]">Standard Essential Patents</div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                  5G & Frontier Tech: SEP Ownership and Licensing Playbook
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
                  Comprehensive analysis of standard essential patent declarations across 3GPP and ETSI standards.
                </p>
              </div>
              <Link
                href="/platform/resources/research-reports"
                className="text-xs font-bold text-[#E8171F] flex items-center gap-1 hover:underline pt-2"
              >
                <Download size={13} /> Download Report (PDF)
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 space-y-2.5 flex flex-col justify-between hover:border-[#E8171F]/40 transition-all">
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#E8171F]">Prosecution Analytics</div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                  USPTO Examiner Tendencies: Data-Driven Prosecution Strategy
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
                  Strategies for navigating difficult examiner art units and streamlining notice of allowances.
                </p>
              </div>
              <Link
                href="/platform/resources/research-reports"
                className="text-xs font-bold text-[#E8171F] flex items-center gap-1 hover:underline pt-2"
              >
                <Download size={13} /> Download Report (PDF)
              </Link>
            </div>
          </div>
        </div>

        {/* ─── CO-BRANDED FOOTER BAR ─────────────────────────────────── */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#151c2c] border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img 
              src="/lexisnexis-icon.png" 
              alt="LexisNexis" 
              className="w-11 h-11 rounded-2xl shadow-sm object-contain bg-white dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700" 
            />
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">LexisNexis® Global IP Intelligence Partner</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">Official Strategic Partner of Women in Intellectual Property Alliance (WIPA)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/platform/resources/research-reports" 
              className="px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold transition-colors shrink-0"
            >
              Research Library
            </Link>
            <button 
              onClick={() => openTrialModal('LexisNexis® Complete IP Suite 30-Day VIP Pass')}
              className="px-6 py-2.5 rounded-full bg-[#E8171F] hover:bg-[#c91219] text-white text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer active:scale-95"
            >
              Claim 30-Day Pass
            </button>
          </div>
        </div>

      </div>

      {/* ─── MODAL: Lead-Gen Trial & Enterprise Access Form ──────────── */}
      {isTrialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#151c2c] border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-2xl space-y-6 text-gray-900 dark:text-white">
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <img 
                    src="/lexisnexis-logo.png" 
                    alt="LexisNexis" 
                    className="h-6 w-auto object-contain block dark:hidden" 
                  />
                  <img 
                    src="/lexisnexis-logo-white.png" 
                    alt="LexisNexis" 
                    className="h-6 w-auto object-contain hidden dark:block" 
                  />
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-[#E8171F] text-[10px] font-extrabold uppercase border border-red-500/20">
                    <Sparkles size={11} /> WIPA Member Advantage
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  {trialFormSubmitted ? 'Access Request Confirmed' : 'Claim LexisNexis® VIP Access'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {selectedProductForTrial}
                </p>
              </div>
              <button 
                onClick={() => setIsTrialModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {trialFormSubmitted ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-500/20">
                  <Check size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thank You, {trialFormData.name || 'Counsel'}!</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed font-normal">
                    Your WIPA partnership access pass has been registered. A LexisNexis IP Solutions Specialist will contact you at <strong>{trialFormData.email}</strong> within 1 business day with your credentials and 20% member discount.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-left text-xs text-gray-700 dark:text-gray-300 space-y-1 border border-gray-200 dark:border-gray-700">
                  <div className="font-bold text-[#E8171F]">Your Priority Reference:</div>
                  <div>VIP Pass ID: <span className="font-mono font-bold">WIPA-LN-2026-VIP</span></div>
                  <div>Selected Solutions: <span className="font-semibold">{trialFormData.selectedProducts.join(', ')}</span></div>
                </div>
                <button
                  onClick={() => setIsTrialModalOpen(false)}
                  className="w-full py-3 rounded-full bg-[#E8171F] hover:bg-[#c91219] text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Return to Solutions Hub
                </button>
              </div>
            ) : (
              <form onSubmit={handleTrialSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Select Solutions of Interest:</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['Lexis+® with Protégé™', 'PatentSight+™', 'PatentAdvisor®', 'TotalPatent One®', 'IPlytics™ (SEPs)', 'PatentOptimizer®'].map((p) => {
                      const checked = trialFormData.selectedProducts.includes(p);
                      return (
                        <div 
                          key={p}
                          onClick={() => toggleProductSelection(p)}
                          className={`p-2.5 rounded-xl border cursor-pointer font-semibold flex items-center gap-2 transition-all ${
                            checked 
                              ? 'bg-red-50 dark:bg-red-950/30 border-[#E8171F] text-[#E8171F]' 
                              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${checked ? 'bg-[#E8171F] border-[#E8171F] text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                            {checked && <Check size={12} />}
                          </div>
                          <span className="truncate">{p}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Your Full Name</label>
                    <input 
                      type="text"
                      required
                      value={trialFormData.name}
                      onChange={(e) => setTrialFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Jane Doe, Esq."
                      className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-[#E8171F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Work / Firm Email</label>
                    <input 
                      type="email"
                      required
                      value={trialFormData.email}
                      onChange={(e) => setTrialFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="jane@lawfirm.com"
                      className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-[#E8171F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Law Firm / Company</label>
                    <input 
                      type="text"
                      value={trialFormData.company}
                      onChange={(e) => setTrialFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="International IP Law LLP"
                      className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-[#E8171F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Practice Role</label>
                    <input 
                      type="text"
                      value={trialFormData.role}
                      onChange={(e) => setTrialFormData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="Partner / Senior IP Counsel"
                      className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-[#E8171F]"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                  By submitting, you authorize LexisNexis® IP Solutions to provision your 30-day guided trial and apply WIPA member preferred pricing.
                </p>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#E8171F] hover:bg-[#c91219] text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer active:scale-95"
                >
                  Activate My 30-Day VIP Pass →
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
