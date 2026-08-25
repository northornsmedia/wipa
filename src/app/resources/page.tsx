'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, PlayCircle, FileText, Download, Sparkles, Activity, Bot, ShieldCheck, Search } from 'lucide-react';
import { useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

const CATEGORIES = ["All Resources", "Patents", "Trademarks", "AI & Copyright", "Career & Leadership", "Publications"];

const RESOURCE_ITEMS = [
  {
    category: "Patents",
    type: "PDF GUIDE",
    title: "The Strategic Guide to Patent Prosecution & Examination",
    description: "Master the intricacies of the USPTO and EPO examination process and overcome Alice/Section 101 rejections effectively.",
    tag: "USPTO & EPO",
    action: "Download Guide",
    href: "/platform/resources/guides-toolkits"
  },
  {
    category: "Trademarks",
    type: "WEBINAR REPLAY",
    title: "Navigating Cross-Border Trademarks & Madrid Protocol",
    description: "Expert panel discussing multinational trademark clearance, opposition battles, and digital marketplace brand defense.",
    tag: "EUIPO & WIPO",
    action: "Watch Session",
    href: "/platform/resources/webinars"
  },
  {
    category: "AI & Copyright",
    type: "RESEARCH REPORT",
    title: "Generative AI Inventorship & Copyright Clearance in Europe",
    description: "In-depth analysis evaluating training data rights, AI inventorship legal frameworks, and landmark court rulings.",
    tag: "AI Legal Tech",
    action: "Read Report",
    href: "/platform/resources/research-reports"
  },
  {
    category: "Publications",
    type: "ANNUAL EDITION",
    title: "Women's IP World Annual Flagship Edition",
    description: "Over 200 pages of exclusive thought leadership articles from managing partners across 45+ jurisdictions.",
    tag: "35% Discount",
    action: "Explore Edition",
    href: "/publications"
  },
  {
    category: "Career & Leadership",
    type: "LEADERSHIP TOOLKIT",
    title: "IP Partnership & In-House Counsel Roadmap",
    description: "Actionable frameworks for transitioning from associate to equity partner or general counsel in tech.",
    tag: "Career Series",
    action: "View Toolkit",
    href: "/platform/resources/career-leadership"
  },
  {
    category: "Patents",
    type: "CONTRACT TEMPLATE",
    title: "Founder IP Assignment & Licensing Agreement Template",
    description: "Standard, customizable legal agreement template for transferring intellectual property from founders to corporate entities.",
    tag: "Legal Template",
    action: "Download Template",
    href: "/platform/resources/guides-toolkits"
  }
];

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Resources");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = RESOURCE_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "All Resources" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#060608] text-slate-900 dark:text-white font-sans overflow-x-hidden flex flex-col transition-colors duration-300 relative selection:bg-pink-500 selection:text-white">
      
      {/* Background Glowing Wavy Line Gradient SVG */}
      <div className="absolute top-16 left-0 right-0 w-full overflow-hidden pointer-events-none opacity-85 z-0">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-44 sm:h-64 stroke-current">
          <defs>
            <linearGradient id="resourceWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2a70" />
              <stop offset="50%" stopColor="#ff7836" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path d="M-20,30 Q80,130 200,60 T440,80 T550,20" fill="none" stroke="url(#resourceWaveGradient)" strokeWidth="3.5" strokeLinecap="round" />
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
        
        {/* Hero Section */}
        <section className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 px-4 py-1.5 mb-6 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#ff2a70] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-500 to-purple-600 dark:from-pink-400 dark:via-orange-300 dark:to-purple-400">
              IP Knowledge Ecosystem
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.12] mb-6 max-w-4xl mx-auto tracking-tight">
            Knowledge is Your <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a70] via-[#ff7836] to-[#a855f7]">
              Most Powerful Asset
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            Access curated legal briefs, patent prosecution toolkits, trademark webinars, and AI intelligence developed by world-renowned IP leaders.
          </p>

          {/* Search Bar & Category Filters */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patent guides, webinars, contract templates..."
                className="w-full bg-slate-50 dark:bg-[#0c101d] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 rounded-full py-3.5 pl-12 pr-6 text-sm font-medium outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-md"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Resources Grid */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-[2rem] bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.08] shadow-md hover:shadow-xl dark:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400">
                      {item.type}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-bold">{item.tag}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-6">
                    {item.description}
                  </p>
                </div>

                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 group-hover:gap-3 transition-all pt-4 border-t border-slate-100 dark:border-white/5"
                >
                  <span>{item.action}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Grand CTA Banner */}
        <section className="w-full rounded-[2.5rem] bg-gradient-to-r from-[#d946ef] via-[#ff2a70] to-[#f97316] p-[2px] shadow-2xl mb-12">
          <div className="bg-slate-900 rounded-[2.4rem] p-10 md:p-16 text-white text-center relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Unlock The Full Intelligence Library
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
              Gain unrestricted access to hundreds of patent guides, trademark briefs, 1:1 mentorship, and 30-second live news feeds.
            </p>
            <Link
              href="/signup"
              className="p-[2px] inline-block rounded-full bg-gradient-to-r from-[#d946ef] via-[#ff2a70] to-[#f97316] shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <div className="bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm">
                Become a Member Today
              </div>
            </Link>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
