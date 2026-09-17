'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  ChevronRight, 
  FileText, 
  BarChart2, 
  BarChart3,
  BookOpen, 
  Clock, 
  Users,
  User, 
  Building, 
  ChevronDown,
  LayoutGrid,
  List,
  Upload,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Tag
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const RESEARCH_SUBCATEGORIES = [
  { id: 'all', name: 'All Reports' },
  { id: 'lexisnexis-exclusives', name: 'LexisNexis® Exclusives' },
  { id: 'wipa-research', name: 'WIPA Research' },
  { id: 'partner', name: 'Partner Research' },
  { id: 'market-data', name: 'Market Data' },
  { id: 'academic', name: 'Academic' }
];

const CONTENT_TYPES = [
  "All Types",
  "Research Paper",
  "White Paper",
  "Industry Report",
  "Survey",
  "Academic Research",
  "Market Report",
  "Case Study"
];

const FLAGSHIP_RESEARCH_RESOURCES = [
  {
    id: "flagship-1",
    title: "The 2026 Innovation Momentum: Global Top 100",
    type: "Research Report",
    topic: "Global IP",
    subcategory: "lexisnexis-exclusives",
    author: "David Felconi",
    author_title: "Global Head of IP Analytics",
    organization: "LexisNexis® PatentSight+™",
    time: "36 Pages (PDF)",
    format: "PDF (12MB)",
    summary: "This comprehensive report provides a deep dive into the current landscape of research, featuring exclusive market data, expert analysis, and actionable insights for practitioners and policymakers.",
    featured: true,
    image: "/resourceimg1.jpg",
    download_url: "https://www.wipo.int/edocs/pubdocs/en/wipo_pub_941_2023.pdf"
  },
  {
    id: "flagship-2",
    title: "5G & 6G Standard Essential Patents (SEPs): IPlytics™ Industry Benchmark",
    type: "White Paper",
    topic: "AI in IP",
    subcategory: "lexisnexis-exclusives",
    author: "Dr. Tim Pohlmann",
    author_title: "CEO & Founder",
    organization: "IPlytics™ by LexisNexis®",
    time: "48 Pages (PDF)",
    format: "PDF (8.5MB)",
    summary: "Empirical analysis tracking essentiality declared patents, licensing pool distributions, and fair reasonable non-discriminatory (FRAND) judicial developments.",
    featured: false,
    image: "/resourceimg2.jpg",
    download_url: "https://www.wipo.int/edocs/pubdocs/en/wipo_pub_941_2023.pdf"
  },
  {
    id: "flagship-3",
    title: "USPTO Examiner Prosecution Trends: PatentAdvisor® Efficiency Playbook",
    type: "Industry Report",
    topic: "Patent Law",
    subcategory: "lexisnexis-exclusives",
    author: "LexisNexis® IP Solutions",
    author_title: "Prosecution Research Desk",
    organization: "LexisNexis® Solutions",
    time: "28 Pages (PDF)",
    format: "PDF (6.2MB)",
    summary: "Actionable prosecution metrics across USPTO Technology Centers. Analyze allowance rates, office action timing, and appeal board reversal trends.",
    featured: false,
    image: "/resource3.jpg",
    download_url: "https://www.wipo.int/edocs/pubdocs/en/wipo_pub_941_2023.pdf"
  },
  {
    id: "flagship-4",
    title: "Global Intellectual Property Market Outlook 2026-2030",
    type: "Market Report",
    topic: "Global IP",
    subcategory: "market-data",
    author: "WIPA Intelligence Unit",
    author_title: "Strategic Foresight Group",
    organization: "Women's IP Alliance",
    time: "52 Pages (PDF)",
    format: "PDF (14MB)",
    summary: "Five-year macro forecasts evaluating patent filing velocity, cross-border trademark filings, and dispute costs across 50 international jurisdictions.",
    featured: false,
    image: "/resourceimg1.jpg",
    download_url: "https://www.wipo.int/edocs/pubdocs/en/wipo_pub_941_2023.pdf"
  },
  {
    id: "flagship-5",
    title: "The Impact of Generative AI on Copyright Systems & Fair Use",
    type: "White Paper",
    topic: "AI in IP",
    subcategory: "wipa-research",
    author: "Dr. Elena Rostova",
    author_title: "Senior Research Fellow",
    organization: "WIPA Academic Council",
    time: "32 Pages (PDF)",
    format: "PDF (5.1MB)",
    summary: "Doctrinal analysis addressing synthetic training data, substantial similarity frameworks, and statutory safe harbors across US and European jurisdictions.",
    featured: false,
    image: "/resourceimg2.jpg",
    download_url: "https://www.wipo.int/edocs/pubdocs/en/wipo_pub_941_2023.pdf"
  },
  {
    id: "flagship-6",
    title: "Quantifying Trademark Dilution in Virtual & Decentralized Environments",
    type: "Academic Research",
    topic: "Brand Protection",
    subcategory: "academic",
    author: "Prof. Marcus Vance",
    author_title: "Professor of Law",
    organization: "Stanford Law IP Initiative",
    time: "44 Pages (PDF)",
    format: "PDF (7.8MB)",
    summary: "Empirical methodology evaluating consumer confusion metrics, trade dress protections, and jurisdiction over decentralized virtual commerce nodes.",
    featured: false,
    image: "/resource3.jpg",
    download_url: "https://www.wipo.int/edocs/pubdocs/en/wipo_pub_941_2023.pdf"
  }
];

export default function ResearchReportsHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Supabase resources table and merge with flagships
  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('category', 'research-reports')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const approvedCommunity = data
            .filter((d: any) => d.approval_status === 'approved' || !d.approval_status)
            .map((d: any) => ({
              id: d.id,
              slug: d.slug || d.id,
              title: d.title,
              type: d.resource_type || "Research Report",
              topic: d.tags?.[0] || "Global IP",
              subcategory: d.subcategory || "wipa-research",
              author: d.author_name || "WIPA Contributor",
              author_title: d.author_title || "Research Analyst",
              organization: d.organization || "WIPA Member",
              time: d.read_time || "24 Pages (PDF)",
              format: d.read_time?.includes('PDF') ? d.read_time : "PDF (Document)",
              summary: d.summary || d.description || "In-depth research briefing featuring verified dataset metrics and practitioner analysis.",
              featured: d.is_featured || false,
              image: d.cover_image_url || "/resourceimg1.jpg",
              download_url: d.url || d.attachment_url || `/platform/resources/research-reports/${d.slug || d.id}`,
              isCommunity: true
            }));

          // Merge: Community reports placed at top, followed by flagships
          setResources([...approvedCommunity, ...FLAGSHIP_RESEARCH_RESOURCES]);
        } else {
          setResources(FLAGSHIP_RESEARCH_RESOURCES);
        }
      } catch (err) {
        console.error("Error loading research reports:", err);
        setResources(FLAGSHIP_RESEARCH_RESOURCES);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  // Filter logic
  const filteredResources = resources.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = q === '' || 
      r.title.toLowerCase().includes(q) || 
      r.summary.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q) ||
      (r.organization && r.organization.toLowerCase().includes(q));

    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;

    return matchesSearch && matchesSub && matchesType;
  });

  // Featured Hero item (first matching featured item, or first item in filtered list)
  const featuredItem = filteredResources.find(r => r.featured) || filteredResources[0];
  const remainingArchiveItems = filteredResources.filter(r => r.id !== featuredItem?.id);

  // Subcategory count calculator
  const getSubCount = (subId: string) => {
    if (subId === 'all') return resources.length;
    return resources.filter(r => r.subcategory === subId).length;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#5a32fa]/20 pb-28 overflow-x-hidden">
      
      {/* Top Hero Banner & Institutional Header */}
      <div className="bg-white dark:bg-[#0d1322] border-b border-slate-200 dark:border-white/10 pt-10 pb-12 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-6">
          
          {/* Badge & Title Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-wider">
                  <BarChart3 size={13} /> Institutional Research Repository
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5a32fa] animate-ping" />
                  {resources.length} Published Reports
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-slate-900 dark:text-white">
                Research <span className="bg-gradient-to-r from-[#5a32fa] via-indigo-500 to-purple-600 bg-clip-text text-transparent">& Reports</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 max-w-2xl">
                Access our comprehensive archive of market data, academic papers, and in-depth industry analysis covering global patent trends and technology forecasts.
              </p>
            </div>

            {/* Right Header Actions: Search & "Publish Your Research" */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Search Box */}
              <div className="relative flex-1 sm:w-80 flex items-center border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900/90 rounded-2xl px-3.5 py-2.5 shadow-2xs focus-within:border-[#5a32fa] focus-within:ring-2 focus-within:ring-[#5a32fa]/10 transition-all">
                <Search size={16} className="text-slate-400 mr-2 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search the archive..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none placeholder-slate-400 text-slate-900 dark:text-white"
                />
              </div>

              {/* Publish Your Research CTA Button */}
              <Link
                href="/platform/resources/research-reports/create"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5a32fa] hover:bg-[#4a26e0] active:scale-95 text-white px-5 py-3 text-xs font-black uppercase tracking-wider shadow-md shadow-indigo-500/25 transition-all shrink-0 cursor-pointer"
              >
                <Upload size={14} />
                <span>Publish Your Research</span>
              </Link>
            </div>
          </div>

          {/* Subcategory Navigation Tabs */}
          <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-white/10 pt-2 pb-1">
            {RESEARCH_SUBCATEGORIES.map(sub => {
              const isLexis = sub.id === 'lexisnexis-exclusives';
              const isActive = activeSub === sub.id;
              const count = getSubCount(sub.id);

              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSub(sub.id)}
                  className={`pb-3.5 px-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap relative flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? (isLexis ? 'text-blue-600 dark:text-blue-400' : 'text-[#5a32fa] dark:text-indigo-400') 
                      : (isLexis ? 'text-blue-600/70 hover:text-blue-600 dark:text-blue-400/80' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white')
                  }`}
                >
                  {isLexis && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                  <span>{sub.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold transition-all ${
                    isActive 
                      ? (isLexis ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300' : 'bg-indigo-500/15 text-[#5a32fa] dark:text-indigo-300') 
                      : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                  }`}>
                    {count}
                  </span>

                  {isActive && (
                    <span className={`absolute bottom-0 left-0 right-0 h-1 rounded-t-full ${isLexis ? 'bg-blue-600' : 'bg-[#5a32fa]'}`} />
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-12">
        
        {/* Featured Publication Hero Section */}
        {featuredItem && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5a32fa] animate-pulse"></span> Featured Publication
              </h2>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0d1322] shadow-xl p-6 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                
                {/* 3D-angled Tablet / Report Cover Visualization */}
                <div className="lg:col-span-5 relative group">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-transparent rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition duration-700"></div>
                  
                  <div className="relative aspect-[3/4] max-h-[440px] mx-auto rounded-2xl overflow-hidden border-2 border-slate-900 dark:border-slate-800 shadow-2xl shadow-black/40 group-hover:-translate-y-1.5 transition-all duration-500 bg-slate-950">
                    <img 
                      src={featuredItem.image} 
                      alt={featuredItem.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    {/* Floating Top Badge */}
                    <div className="absolute top-5 left-5 flex items-center gap-2">
                      <span className="bg-[#5a32fa] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-md">
                        {featuredItem.type}
                      </span>
                    </div>

                    {/* Bottom Title on Cover */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2 drop-shadow-md">
                        {featuredItem.title}
                      </h3>
                      <p className="text-indigo-300 font-bold text-xs tracking-widest uppercase flex items-center gap-1.5">
                        <User size={12} /> {featuredItem.author}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Report Details & Metadata Cards */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-4">
                      {featuredItem.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
                      {featuredItem.summary}
                    </p>
                  </div>

                  {/* Metadata Cards Grid (Published, Author, Format) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xs">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Published</div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock size={14} className="text-[#5a32fa] shrink-0" />
                        <span className="truncate">{featuredItem.time}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xs">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Author</div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Building size={14} className="text-[#5a32fa] shrink-0" />
                        <span className="truncate">{featuredItem.author}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xs">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Format</div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText size={14} className="text-[#5a32fa] shrink-0" />
                        <span className="truncate">{featuredItem.format || "PDF (12MB)"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href={featuredItem.download_url}
                      target={featuredItem.download_url?.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 bg-[#5a32fa] hover:bg-[#4a26e0] text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Download size={16} />
                      <span>Download Full Report</span>
                    </a>

                    <Link
                      href={`/platform/resources/research-reports/${featuredItem.id}`}
                      className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                    >
                      <BookOpen size={14} />
                      <span>Executive Abstract</span>
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* Database Archive Section */}
        <div className="space-y-6">
          
          {/* Header Row with View Mode Switcher and Classification Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck size={20} className="text-[#5a32fa]" /> Database Archive & Publications
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Showing {filteredResources.length} verified research papers and analytics dossiers.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Type Filter */}
              <div className="relative">
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 pr-9 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#5a32fa] cursor-pointer shadow-2xs"
                >
                  {CONTENT_TYPES.map(type => (
                    <option key={type} value={type} className="bg-slate-900 text-white">{type}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-[#5a32fa] shadow-2xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                  }`}
                  title="Grid Cards View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-[#5a32fa] shadow-2xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                  }`}
                  title="Table List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Render Active View */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-8 w-8 rounded-full border-2 border-[#5a32fa] border-t-transparent animate-spin" />
              <p className="text-xs font-bold text-slate-400">Loading research archive...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="p-16 text-center rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1322]">
              <FileText size={36} className="mx-auto text-slate-400 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No research publications found</h3>
              <p className="text-xs text-slate-500">Try selecting "All Types" or clearing your search filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveSub('all'); setTypeFilter('All Types'); }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#5a32fa] text-white text-xs font-bold hover:bg-[#4a26e0] transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid Cards View: Magazine Dossier Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((item) => (
                <div 
                  key={item.id}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0d1322] overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 hover:border-[#5a32fa]/40 hover:-translate-y-1"
                >
                  <div>
                    {/* Cover Preview Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="bg-[#5a32fa] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-sm">
                          {item.type}
                        </span>
                        <span className="bg-slate-900/80 backdrop-blur border border-white/10 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          {item.topic || "Global IP"}
                        </span>
                      </div>

                      {/* Format Pill on Cover */}
                      <div className="absolute bottom-3 right-3 text-[10px] font-bold text-white/90 bg-black/60 backdrop-blur px-2 py-0.5 rounded-md">
                        {item.format || item.time}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <h3 className="text-base sm:text-lg font-black leading-snug tracking-tight text-slate-900 dark:text-white group-hover:text-[#5a32fa] transition-colors mb-2 line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2 mb-4">
                        {item.summary}
                      </p>

                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 pt-1">
                        <Building size={13} className="text-[#5a32fa] shrink-0" />
                        <span className="truncate">{item.author} &bull; {item.organization}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 px-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between gap-3">
                    <Link
                      href={`/platform/resources/research-reports/${item.id}`}
                      className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#5a32fa] transition-colors inline-flex items-center gap-1"
                    >
                      <span>Abstract</span>
                      <ChevronRight size={13} />
                    </Link>

                    <a
                      href={item.download_url}
                      target={item.download_url?.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#5a32fa] text-white dark:bg-white dark:text-slate-900 dark:hover:bg-[#5a32fa] dark:hover:text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    >
                      <Download size={12} />
                      <span>Download</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            /* Table / Archive List View */
            <div className="bg-white dark:bg-[#0d1322] rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Document Title</th>
                      <th className="py-4 px-4">Author / Institution</th>
                      <th className="py-4 px-4">Format & Pages</th>
                      <th className="py-4 px-6 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
                    {filteredResources.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                        
                        <td className="py-4 px-6">
                          <Link href={`/platform/resources/research-reports/${item.id}`} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-[#5a32fa] flex items-center justify-center shrink-0">
                              <FileText size={18} />
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#5a32fa] block">
                                {item.type}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white group-hover:text-[#5a32fa] transition-colors block text-sm line-clamp-1">
                                {item.title}
                              </span>
                            </div>
                          </Link>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900 dark:text-white block">{item.author}</span>
                          <span className="text-slate-400 text-[11px] block">{item.organization}</span>
                        </td>

                        <td className="py-4 px-4 font-mono font-semibold text-slate-500 dark:text-slate-400">
                          {item.format || item.time}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <a
                            href={item.download_url}
                            target={item.download_url?.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:bg-[#5a32fa] hover:border-[#5a32fa] hover:text-white transition-all shadow-2xs"
                            title="Download Report"
                          >
                            <Download size={14} />
                          </a>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
