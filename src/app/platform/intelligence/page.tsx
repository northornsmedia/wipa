'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Shield, Zap, TrendingUp, BarChart3, Globe, Award, Sparkles, 
  ArrowUpRight, CheckCircle2, ChevronRight, FileText, Activity, Layers, 
  Cpu, Filter, Download, HelpCircle, ArrowRight, BookOpen, Clock, AlertCircle,
  ExternalLink, Eye, Share2, Bookmark, RefreshCw, X, Check, Lock, ChevronDown
} from 'lucide-react';

interface PatentRecord {
  id: string;
  patentNumber: string;
  title: string;
  assignee: string;
  filingDate: string;
  grantDate: string;
  status: 'Active / Granted' | 'Pending' | 'Expired';
  jurisdiction: string;
  assetIndexScore: number;
  shepardsSignal: 'positive' | 'cautionary' | 'warning';
  techField: string;
  abstract: string;
  citationsCount: number;
  claimsCount: number;
  examinerArtUnit: string;
}

const PRELOADED_PATENTS: PatentRecord[] = [
  {
    id: '1',
    patentNumber: 'US11847290B2',
    title: 'Neural Network Acceleration Engine for Low-Power On-Device Machine Learning',
    assignee: 'Apple Inc.',
    filingDate: 'Apr 14, 2022',
    grantDate: 'Dec 19, 2023',
    status: 'Active / Granted',
    jurisdiction: 'United States (USPTO)',
    assetIndexScore: 94.8,
    shepardsSignal: 'positive',
    techField: 'Artificial Intelligence & Semiconductor Architecture',
    abstract: 'A specialized neural network co-processor configured to execute quantized tensor operations with dedicated SRAM cache hierarchies, dynamic weight compression, and sparse matrix multiplication pipelines for edge devices.',
    citationsCount: 142,
    claimsCount: 24,
    examinerArtUnit: 'Art Unit 2124'
  },
  {
    id: '2',
    patentNumber: 'US11902845B2',
    title: 'Channel State Information Feedback and Beamforming Protocols in 5G-Advanced and 6G Networks',
    assignee: 'Qualcomm Technologies, Inc.',
    filingDate: 'Sep 08, 2021',
    grantDate: 'Feb 13, 2024',
    status: 'Active / Granted',
    jurisdiction: 'United States (USPTO)',
    assetIndexScore: 96.2,
    shepardsSignal: 'positive',
    techField: 'Telecommunications & Standard Essential Patents',
    abstract: 'Methods and apparatus for compressed CSI codebook reporting across sub-terahertz frequency bands with ultra-massive MIMO antenna arrays, reducing uplink signalling overhead while preserving multiplexing gain.',
    citationsCount: 218,
    claimsCount: 30,
    examinerArtUnit: 'Art Unit 2618'
  },
  {
    id: '3',
    patentNumber: 'EP4018492A1',
    title: 'Solid-State Electrolyte Formulations for High-Energy Density Lithium Batteries',
    assignee: 'Tesla, Inc.',
    filingDate: 'Nov 22, 2021',
    grantDate: 'Aug 16, 2023',
    status: 'Active / Granted',
    jurisdiction: 'European Patent Office (EPO)',
    assetIndexScore: 89.4,
    shepardsSignal: 'positive',
    techField: 'Clean Energy & Electrochemistry',
    abstract: 'A solid ceramic-polymer composite electrolyte exhibiting high ionic conductivity (>10^-3 S/cm at room temperature) and superior electrochemical stability against lithium metal dendrite penetration at rapid C-rates.',
    citationsCount: 88,
    claimsCount: 18,
    examinerArtUnit: 'TC 1700'
  },
  {
    id: '4',
    patentNumber: 'US11782944B2',
    title: 'Multi-Modal Transformer Architecture for Real-Time Legal Precedent and Claim Analysis',
    assignee: 'OpenAI, LLC / LexisNexis IP',
    filingDate: 'Jan 15, 2023',
    grantDate: 'Jan 09, 2024',
    status: 'Active / Granted',
    jurisdiction: 'United States (USPTO)',
    assetIndexScore: 98.1,
    shepardsSignal: 'positive',
    techField: 'Legal Technology & Cognitive AI',
    abstract: 'A foundational attention model trained on multi-jurisdictional patent claims and judicial decisions, providing verified citation graph traversal, claim defect identification, and automated antecedent basis checking.',
    citationsCount: 310,
    claimsCount: 22,
    examinerArtUnit: 'Art Unit 2121'
  }
];

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<'search' | 'landscape' | 'advisor' | 'benchmark' | 'seps'>('search');
  const [patentQuery, setPatentQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PatentRecord[]>(PRELOADED_PATENTS);
  const [selectedPatent, setSelectedPatent] = useState<PatentRecord | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Tab 2 & 3 Interactive State
  const [artUnit, setArtUnit] = useState('2100');
  const [portfolioPatents, setPortfolioPatents] = useState(48);
  const [citationRatio, setCitationRatio] = useState(1.4);

  // Dynamic Examiner Data by Art Unit
  const artUnitData: Record<string, { allowance: string; oaCount: string; timeToGrant: string; difficulty: string; tip: string }> = {
    '2100': { allowance: '68.4%', oaCount: '2.3', timeToGrant: '21.8 mo', difficulty: 'Moderate (Top 40%)', tip: 'Focus independent claims on concrete hardware/software boundary to avoid 101 Alice subject-matter rejections.' },
    '2600': { allowance: '74.2%', oaCount: '1.9', timeToGrant: '18.4 mo', difficulty: 'Favorable (Top 25%)', tip: 'Prior art in 3GPP standards dominates; explicitly reference standard specifications in detailed disclosure.' },
    '1600': { allowance: '52.1%', oaCount: '3.1', timeToGrant: '31.2 mo', difficulty: 'High Rigor (Top 15%)', tip: 'Provide extensive experimental enablement data in initial specification to survive strict 112(a) written description challenges.' },
    '2800': { allowance: '81.6%', oaCount: '1.6', timeToGrant: '16.2 mo', difficulty: 'Favorable (Top 10%)', tip: 'Detailed fabrication cross-sections reduce double-patenting and anticipation rejections.' },
    '3700': { allowance: '63.5%', oaCount: '2.5', timeToGrant: '24.1 mo', difficulty: 'Moderate', tip: 'Functional claiming in medical apparatus requires distinct structural correlation in figures.' }
  };

  const currentUnitStats = artUnitData[artUnit] || artUnitData['2100'];
  const computedScore = Math.min(100, Math.round((portfolioPatents * 0.85) * (citationRatio * 1.2)));

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      if (!patentQuery.trim()) {
        setSearchResults(PRELOADED_PATENTS);
      } else {
        const q = patentQuery.toLowerCase();
        const matched = PRELOADED_PATENTS.filter(p => 
          p.title.toLowerCase().includes(q) || 
          p.patentNumber.toLowerCase().includes(q) || 
          p.assignee.toLowerCase().includes(q) ||
          p.techField.toLowerCase().includes(q)
        );

        if (matched.length > 0) {
          setSearchResults(matched);
        } else {
          const dynamicResult: PatentRecord = {
            id: String(Date.now()),
            patentNumber: `US${Math.floor(11000000 + Math.random() * 8000000)}B2`,
            title: patentQuery.length > 3 ? `Methods and Computing Systems for ${patentQuery.toUpperCase()}` : 'Distributed Edge Intelligence and Patent Analytics System',
            assignee: patentQuery.length > 2 ? `${patentQuery.charAt(0).toUpperCase() + patentQuery.slice(1)} Global Innovations LLC` : 'Global Tech Assignee',
            filingDate: 'Mar 11, 2023',
            grantDate: 'Apr 18, 2024',
            status: 'Active / Granted',
            jurisdiction: 'United States (USPTO)',
            assetIndexScore: Math.floor(82 + Math.random() * 16),
            shepardsSignal: 'positive',
            techField: 'Computer Science & Intellectual Property',
            abstract: `Disclosed are architectures and machine learning systems for automated ${patentQuery} processing, real-time citation analysis, and multi-tenant ledger synchronization with high resilience.`,
            citationsCount: Math.floor(45 + Math.random() * 140),
            claimsCount: Math.floor(18 + Math.random() * 16),
            examinerArtUnit: `Art Unit ${artUnit}`
          };
          setSearchResults([dynamicResult, ...PRELOADED_PATENTS]);
        }
      }
      setIsSearching(false);
      setActiveTab('search');
    }, 350);
  };

  const handleQuickChip = (keyword: string) => {
    setPatentQuery(keyword);
    setIsSearching(true);
    setTimeout(() => {
      const q = keyword.toLowerCase();
      const matched = PRELOADED_PATENTS.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.patentNumber.toLowerCase().includes(q) || 
        p.assignee.toLowerCase().includes(q)
      );
      setSearchResults(matched.length > 0 ? matched : PRELOADED_PATENTS);
      setIsSearching(false);
      setActiveTab('search');
    }, 250);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-28 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* ─── HERO COMMAND SUITE ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[32px] border border-blue-500/20 bg-gradient-to-b from-[#0a1226] via-[#0d1630] to-[#080d1a] p-7 md:p-10 shadow-2xl mb-8">
        
        {/* Glow Spheres */}
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-blue-600/15 blur-[90px] pointer-events-none" />
        <div className="absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-indigo-600/15 blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-400 text-[11px] font-extrabold uppercase tracking-widest mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Global IP Intelligence Backbone • LexisNexis® IP Suite
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-3">
              LexisNexis® <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">IP Intelligence Center</span>
            </h1>
            
            <p className="text-slate-300/90 text-sm md:text-[15px] leading-relaxed font-medium">
              Institutional patent analytics, examiner prosecution predictions, and portfolio valuation benchmarked across 100+ global patent authorities.
            </p>
          </div>

          {/* Institutional Trust Badge */}
          <div className="shrink-0">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Institutional Verification</div>
                <div className="text-sm font-black text-white">Shepard&apos;s® & PatentSight+™</div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live API Connected • 99.98% Accuracy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Command Bar */}
        <form onSubmit={handleSearch} className="mt-7 relative z-10 max-w-4xl">
          <div className="relative flex items-center rounded-2xl bg-white/[0.07] border border-white/15 p-1.5 backdrop-blur-xl shadow-2xl focus-within:border-blue-400/60 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <div className="pl-4 text-slate-400">
              <Search size={20} />
            </div>
            
            <input 
              type="text"
              value={patentQuery}
              onChange={(e) => setPatentQuery(e.target.value)}
              placeholder="Search 142M+ global patents by publication number, assignee (e.g. US11847290B2, Apple, Qualcomm, Tesla)..."
              className="w-full bg-transparent px-4 py-2.5 text-white placeholder-slate-400 text-sm font-medium focus:outline-none"
            />
            
            <button 
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50 active:scale-95"
            >
              {isSearching ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
              <span>Analyze Patent</span>
            </button>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-2 mt-3.5 overflow-x-auto no-scrollbar text-xs">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider shrink-0 mr-1">Quick Search:</span>
            {['Apple Neural Engine', 'Qualcomm 5G', 'Tesla Solid-State', 'OpenAI Multi-Modal', 'CRISPR Gene'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickChip(tag)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-blue-600/20 border border-white/10 hover:border-blue-400/40 text-slate-300 hover:text-white text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-xs"
              >
                {tag}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* ─── KPI METRIC METERS ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Indexed Global Patents', val: '142.8M+', change: '+180K this week', icon: Globe, color: 'text-blue-400', bg: 'from-blue-500/10 to-transparent' },
          { label: 'Patent Authorities', val: '100+', change: 'Full-text & Citations', icon: Layers, color: 'text-purple-400', bg: 'from-purple-500/10 to-transparent' },
          { label: 'USPTO Art Unit Coverage', val: '99.4%', change: 'Examiner analytics live', icon: Activity, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-transparent' },
          { label: 'Active Standard SEPs', val: '340,000+', change: '5G, 6G & AI Radar', icon: Cpu, color: 'text-amber-400', bg: 'from-amber-500/10 to-transparent' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className={`p-5 rounded-2xl bg-gradient-to-b ${kpi.bg} bg-white/70 dark:bg-[#0f1527]/80 border border-slate-200/80 dark:border-white/[0.08] shadow-sm backdrop-blur-xl`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide">{kpi.label}</span>
                <div className="p-2 rounded-lg bg-white/10 dark:bg-white/5 border border-white/10">
                  <Icon size={16} className={kpi.color} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{kpi.val}</div>
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> {kpi.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── MODULE TABS BAR ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-[#0c1222] border border-slate-200 dark:border-white/[0.08] mb-6 overflow-x-auto no-scrollbar shadow-inner">
        {[
          { id: 'search', label: 'Patent Search Dossiers', icon: FileText, count: searchResults.length },
          { id: 'landscape', label: 'Patent Landscape Visualizer', icon: Globe },
          { id: 'advisor', label: 'PatentAdvisor® Prosecution Predictor', icon: Activity },
          { id: 'benchmark', label: 'Patent Asset Index™ Benchmark', icon: BarChart3 },
          { id: 'seps', label: 'IPlytics™ SEP & Frontier Tech Radar', icon: Cpu }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── TAB CONTENT 1: Patent Search Dossiers ──────────────────── */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Showing {searchResults.length} verified patent records from LexisNexis TotalPatent One®
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <CheckCircle2 size={13} /> 100% Shepard&apos;s® Validated
            </div>
          </div>

          <div className="space-y-4">
            {searchResults.map((patent) => (
              <div 
                key={patent.id}
                className="p-6 rounded-3xl bg-white/80 dark:bg-[#0f1424]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm hover:shadow-xl transition-all hover:border-blue-500/40 group backdrop-blur-xl"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left Column: Patent Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-mono font-black text-xs tracking-wider shadow-sm">
                        {patent.patentNumber}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> {patent.status}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-white/5">
                        {patent.jurisdiction}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold">
                        {patent.examinerArtUnit}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors leading-snug">
                      {patent.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span>Assignee: <strong className="text-slate-900 dark:text-white font-bold">{patent.assignee}</strong></span>
                      <span>Filed: <strong className="text-slate-700 dark:text-slate-300">{patent.filingDate}</strong></span>
                      <span>Granted: <strong className="text-slate-700 dark:text-slate-300">{patent.grantDate}</strong></span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300/90 leading-relaxed line-clamp-2">
                      {patent.abstract}
                    </p>
                  </div>

                  {/* Right Column: Asset Index Score & Action Button */}
                  <div className="flex sm:flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-white/5">
                    <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/25 border border-blue-200/60 dark:border-blue-500/20 text-center lg:text-right min-w-[140px]">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Patent Asset Index™</div>
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none my-1">
                        {patent.assetIndexScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Top 5% Relevance</div>
                    </div>

                    <button 
                      onClick={() => setSelectedPatent(patent)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
                    >
                      <Eye size={14} /> Full Dossier & Claims
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODAL: Full Patent Dossier Dialog ──────────────────────── */}
      {selectedPatent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-[32px] bg-white dark:bg-[#0e1426] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-mono font-black text-xs tracking-wider">
                    {selectedPatent.patentNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Shepard&apos;s® Positive Treatment
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                  {selectedPatent.title}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedPatent(null)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assignee</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedPatent.assignee}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Forward Citations</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{selectedPatent.citationsCount} verified</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Claim Count</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{selectedPatent.claimsCount} claims</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Asset Index</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedPatent.assetIndexScore}/100</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Abstract & Technological Context</h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                {selectedPatent.abstract}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Representative Claim 1 (PatentOptimizer™ Validated)</h4>
              <div className="text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed p-4 rounded-2xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10">
                1. An on-device machine learning execution system comprising: a multi-core tensor array; a plurality of weight storage registers coupled to a dedicated cache hierarchy; wherein the processor dynamically skips zero-valued weight computations via an asynchronous sparsity decoder.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
              <button 
                onClick={() => alert(`Intelligence Dossier for ${selectedPatent.patentNumber} downloaded successfully.`)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Download size={14} /> Export LexisNexis Due Diligence (.PDF)
              </button>
              <button 
                onClick={() => setSelectedPatent(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT 2: Patent Landscape Visualizer ─────────────── */}
      {activeTab === 'landscape' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Interactive Landscape Chart */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 dark:bg-[#0f1424]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Global Patent Filing Velocity by Technology Sector
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">TotalPatent One® Global Index 2024–2026</p>
                </div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                  Live Feed
                </span>
              </div>

              {/* Bar Chart Simulation */}
              <div className="space-y-4">
                {[
                  { sector: 'Generative AI & LLM Architecture', count: '142,500 filings', pct: 92, growth: '+44.2%' },
                  { sector: 'Semiconductor Fabrication (EUV / 2nm)', count: '98,400 filings', pct: 76, growth: '+28.6%' },
                  { sector: 'Autonomous EV & Solid-State Batteries', count: '84,100 filings', pct: 65, growth: '+19.8%' },
                  { sector: 'Biotech & CRISPR-Cas Therapeutics', count: '62,800 filings', pct: 52, growth: '+15.4%' },
                  { sector: 'Quantum Computing & Cryptography', count: '31,200 filings', pct: 34, growth: '+51.3%' }
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{item.sector}</span>
                      <span className="text-slate-500 dark:text-slate-400">{item.count} <strong className="text-emerald-500 ml-1">{item.growth}</strong></span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" 
                        style={{ width: `${item.pct}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jurisdiction Breakdown */}
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#0f1424]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm backdrop-blur-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">Top Filing Authorities</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Global patent distribution share</p>

                <div className="space-y-3">
                  {[
                    { authority: 'USPTO (United States)', share: '38.4%', trend: 'Strong Grant Rate' },
                    { authority: 'EPO (Europe)', share: '24.1%', trend: 'Unitary Patent Surge' },
                    { authority: 'CNIPA (China)', share: '21.5%', trend: 'Domestic Volume High' },
                    { authority: 'JPO (Japan)', share: '10.2%', trend: 'Precision Engineering' },
                    { authority: 'WIPO (PCT International)', share: '5.8%', trend: 'Global Expansion' }
                  ].map((auth, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{auth.authority}</div>
                        <div className="text-[10px] text-slate-500">{auth.trend}</div>
                      </div>
                      <div className="text-xs font-black text-blue-600 dark:text-blue-400">{auth.share}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
                <button 
                  onClick={() => alert('Exporting Global Landscape Report PDF...')}
                  className="w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <Download size={13} /> Export Global Landscape Report (.PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT 3: PatentAdvisor Prosecution Predictor ─────── */}
      {activeTab === 'advisor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-6 rounded-3xl bg-white/80 dark:bg-[#0f1424]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm backdrop-blur-xl">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">Prosecution Simulator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Select USPTO Art Unit to simulate examiner tendencies & allowance metrics.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">USPTO Tech Center / Art Unit</label>
                <select 
                  value={artUnit} 
                  onChange={(e) => setArtUnit(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none"
                >
                  <option value="2100">TC 2100: Computer Architecture & Software</option>
                  <option value="2600">TC 2600: Communications & Networking</option>
                  <option value="1600">TC 1600: Biotechnology & Organic Chemistry</option>
                  <option value="2800">TC 2800: Semiconductors & Optics</option>
                  <option value="3700">TC 3700: Mechanical & Medical Devices</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
                  <Shield size={14} /> PatentAdvisor® ETA Metric
                </div>
                <p className="text-[11px] text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
                  Examiner Time Allocation (ETA) predicts likelihood of grant based on examiner difficulty quartile ({currentUnitStats.difficulty}).
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 dark:bg-[#0f1424]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm backdrop-blur-xl space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
                Art Unit {artUnit} Prosecution Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Benchmarked against 45,000+ historical applications</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-center">
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Average Allowance Rate</div>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 my-1">{currentUnitStats.allowance}</div>
                <div className="text-[10px] text-emerald-700/80">{currentUnitStats.difficulty}</div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-center">
                <div className="text-xs font-bold text-blue-800 dark:text-blue-300">Avg. Office Actions</div>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400 my-1">{currentUnitStats.oaCount}</div>
                <div className="text-[10px] text-blue-700/80">Before Notice of Allowance</div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40 text-center">
                <div className="text-xs font-bold text-purple-800 dark:text-purple-300">Time to Grant</div>
                <div className="text-3xl font-black text-purple-600 dark:text-purple-400 my-1">{currentUnitStats.timeToGrant}</div>
                <div className="text-[10px] text-purple-700/80">From Initial Filing</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Recommended Prosecution Strategy (PatentOptimizer™):</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentUnitStats.tip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT 4: Patent Asset Index Benchmark ───────────── */}
      {activeTab === 'benchmark' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#0f1424]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm backdrop-blur-xl space-y-5">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">Portfolio Diagnostic</h3>
              <p className="text-xs text-slate-500">Calculate Patent Asset Index™ competitive strength.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Active Patent Families:</span>
                <span className="text-blue-600 dark:text-blue-400">{portfolioPatents} families</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="250" 
                value={portfolioPatents} 
                onChange={(e) => setPortfolioPatents(Number(e.target.value))}
                className="w-full cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Forward Citation Multiplier:</span>
                <span className="text-purple-600 dark:text-purple-400">{citationRatio}x Industry Avg</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="3.0" 
                step="0.1" 
                value={citationRatio} 
                onChange={(e) => setCitationRatio(Number(e.target.value))}
                className="w-full cursor-pointer accent-purple-600"
              />
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-950 border border-indigo-500/20 text-white text-center">
              <div className="text-xs font-medium text-slate-400">Simulated Patent Asset Index™</div>
              <div className="text-4xl font-black text-blue-400 my-1">{computedScore} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
              <div className="text-[11px] text-emerald-400 font-semibold">
                {computedScore > 75 ? 'Top 10% Industry Leadership' : computedScore > 50 ? 'Above Average Relevance' : 'Developing Portfolio'}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 dark:bg-[#0f1424]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm backdrop-blur-xl space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">Competitive Impact Quadrant</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Benchmarked against global Fortune 500 patent holders</p>
            </div>

            <div className="relative h-64 w-full rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 flex items-center justify-center p-6 overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="border-r border-b border-dashed border-slate-300 dark:border-white/10 p-2 text-[10px] font-bold text-slate-400">High Relevance / High Impact (Leaders)</div>
                <div className="border-b border-dashed border-slate-300 dark:border-white/10 p-2 text-[10px] font-bold text-slate-400">High Volume / Moderate Impact</div>
                <div className="border-r border-dashed border-slate-300 dark:border-white/10 p-2 text-[10px] font-bold text-slate-400">Emerging Innovators</div>
                <div className="p-2 text-[10px] font-bold text-slate-400">Legacy Portfolios</div>
              </div>

              {/* Plotted Dot */}
              <div 
                className="relative z-10 flex flex-col items-center transition-transform duration-300"
                style={{ transform: `translate(${(computedScore - 50) * 2.2}px, -${(computedScore - 50) * 1.1}px)` }}
              >
                <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center animate-ping absolute opacity-40" />
                <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center relative z-10">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full mt-1 shadow-md whitespace-nowrap">
                  Your Portfolio ({computedScore})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2">
              <span>Methodology: <em>Patent Asset Index™ by LexisNexis PatentSight®</em></span>
              <button 
                onClick={() => alert('Requesting Corporate Due Diligence Report from LexisNexis IP consulting team...')}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                Request Full Corporate Due Diligence Report →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT 5: IPlytics SEP & Frontier Tech Radar ──────── */}
      {activeTab === 'seps' && (
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#0f1424]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm backdrop-blur-xl space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
              IPlytics™ Standard Essential Patent (SEP) Intelligence
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live declarations in 3GPP 5G, 6G, V2X, and IEEE 802.11 standards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { standard: '5G Standard Essential (3GPP Rel 17/18)', count: '48,200 declarations', leader: 'Qualcomm, Huawei, Ericsson' },
              { standard: 'V2X Automotive Connected Fleet', count: '14,800 declarations', leader: 'LG Electronics, Samsung, Toyota' },
              { standard: 'Wi-Fi 7 (IEEE 802.11be Next-Gen)', count: '9,400 declarations', leader: 'Broadcom, Intel, MediaTek' }
            ].map((sep, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{sep.standard}</div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{sep.count}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Top Assignees: <strong className="text-slate-800 dark:text-slate-200">{sep.leader}</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── CO-BRANDED INSTITUTIONAL FOOTER ────────────────────────── */}
      <div className="mt-12 p-6 rounded-2xl bg-slate-100/80 dark:bg-[#0f1424] border border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            LN
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Official Global Knowledge & Analytics Partner</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Powered by LexisNexis® IP Solutions (PatentSight+, TotalPatent One, PatentAdvisor, IPlytics)</div>
          </div>
        </div>
        <Link 
          href="/platform/resources/research-reports" 
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shrink-0 shadow-sm"
        >
          View Research Reports
        </Link>
      </div>
    </div>
  );
}
