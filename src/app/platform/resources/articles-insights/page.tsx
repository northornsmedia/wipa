'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Bookmark, ChevronRight, PenTool, TrendingUp, Clock, BookOpen, Hash, Filter, ChevronDown, Check, X } from 'lucide-react';
import Link from 'next/link';

const MOCK_ARTICLE_SUBCATEGORIES = [
  { id: 'all', name: 'All Content' },
  { id: 'thought-leadership', name: 'Thought Leadership' },
  { id: 'case-studies', name: 'Case Studies' },
  { id: 'opinions', name: 'Opinions' },
  { id: 'guides', name: 'Expert Guides' },
  { id: 'lexisnexis-exclusives', name: 'LexisNexis® Exclusives' }
];

const CONTENT_TYPES = [
  "All Types",
  "Expert Article",
  "Opinion",
  "Thought Leadership",
  "Commentary",
  "Case Study",
  "Interview",
  "Guide",
  "Video Insight"
];

const MOCK_ARTICLE_RESOURCES = [
  {
    id: 101,
    title: "The Patent Asset Index™ 2026: Benchmark Analysis of Top Global Innovators",
    type: "Thought Leadership",
    topic: "Global IP",
    subcategory: "lexisnexis-exclusives",
    author: "LexisNexis® PatentSight+™ Research Institute",
    time: "8 min read",
    featured: true,
    image: "/resourceimg1.jpg"
  },
  {
    id: 102,
    title: "USPTO Examiner Prosecution Analytics & Allowance Strategies: PatentAdvisor® Playbook",
    type: "Expert Article",
    topic: "Patent Law",
    subcategory: "lexisnexis-exclusives",
    author: "LexisNexis® IP Solutions",
    time: "10 min read",
    featured: true,
    image: "/resourceimg2.jpg"
  },
  {
    id: 103,
    title: "Navigating 5G & 6G Standard Essential Patents with IPlytics™",
    type: "Case Study",
    topic: "AI in IP",
    subcategory: "lexisnexis-exclusives",
    author: "IPlytics™ by LexisNexis®",
    time: "6 min read",
    featured: false,
    image: "/resource3.jpg"
  },
  {
    id: 1,
    title: "Navigating AI Patents in 2026",
    type: "Thought Leadership",
    topic: "AI in IP",
    subcategory: "thought-leadership",
    author: "Elena Rostova",
    time: "7 min read",
    featured: true,
    image: "/resourceimg1.jpg"
  },
  {
    id: 2,
    title: "The Fall of the Standard Essential Patent Monopoly",
    type: "Opinion",
    topic: "IP Litigation",
    subcategory: "opinions",
    author: "Marcus Vance",
    time: "5 min read",
    featured: true,
    image: "/resourceimg2.jpg"
  },
  {
    id: 3,
    title: "Tech Giants vs. Startups: A Patent Case Study",
    type: "Case Study",
    topic: "Patent Law",
    subcategory: "case-studies",
    author: "Global Research Team",
    time: "12 min read",
    featured: false,
    image: "/resource3.jpg"
  },
  {
    id: 4,
    title: "How to Build a Defensive IP Portfolio",
    type: "Guide",
    topic: "IP Strategy",
    subcategory: "guides",
    author: "Sarah Jenkins",
    time: "15 min read",
    featured: false,
    image: "/resourceimg1.jpg"
  },
  {
    id: 5,
    title: "Interview with the Head of Patents at OpenAI",
    type: "Interview",
    topic: "AI in IP",
    subcategory: "thought-leadership",
    author: "IP World Staff",
    time: "10 min read",
    featured: false,
    image: "/resourceimg2.jpg"
  },
  {
    id: 6,
    title: "The Future of Trademark Law in Virtual Worlds",
    type: "Expert Article",
    topic: "Global IP",
    subcategory: "thought-leadership",
    author: "Dr. Alan Turing",
    time: "8 min read",
    featured: false,
    image: "/resource3.jpg"
  }
];

import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";
import { ShieldCheck, Plus } from 'lucide-react';

export default function ArticlesInsightsHubPage() {
  const { user } = useAppStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dbResources, setDbResources] = useState<any[]>([]);
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin, is_subadmin')
          .eq('id', user.id)
          .single();
        if (data?.is_admin || data?.is_subadmin) {
          setIsAdmin(true);
        }
      } catch (e) {
        // silent fallback
      }
    }
    checkAdminStatus();
  }, [user?.id]);

  useEffect(() => {
    async function fetchLiveArticles() {
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("*")
          .eq("category", "articles-insights")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          // Public feed only shows approved or legacy unflagged articles
          const approved = data.filter((d: any) => !d.approval_status || d.approval_status === 'approved');
          const mapped = approved.map((d: any) => ({
            id: d.id,
            title: d.title,
            type: d.resource_type || "Expert Article",
            topic: d.tags?.[0] || "Intellectual Property",
            subcategory: d.subcategory || "thought-leadership",
            author: d.author_name || "WIPA Contributor",
            time: d.read_time || "6 min read",
            featured: d.is_featured || false,
            image: d.cover_image_url || "/resourceimg1.jpg",
            summary: d.summary || d.description || "",
            is_splash_sponsored: d.is_splash_sponsored,
            splash_tagline: d.splash_tagline,
            splash_cta_text: d.splash_cta_text,
            splash_cta_url: d.splash_cta_url,
          }));
          setDbResources(mapped);

          // User's own submissions (including pending review)
          if (user?.id) {
            const mine = data
              .filter((d: any) => d.submitter_id === user.id)
              .map((d: any) => ({
                id: d.id,
                title: d.title,
                type: d.resource_type || "Expert Article",
                topic: d.tags?.[0] || "Intellectual Property",
                subcategory: d.subcategory || "thought-leadership",
                author: d.author_name || "You",
                time: d.read_time || "6 min read",
                featured: d.is_featured || false,
                image: d.cover_image_url || "/resourceimg1.jpg",
                summary: d.summary || d.description || "",
                approval_status: d.approval_status || 'approved',
                rejection_reason: d.rejection_reason || null,
                created_at: d.created_at,
              }));
            setMySubmissions(mine);
          }
        } else {
          setDbResources(MOCK_ARTICLE_RESOURCES);
        }
      } catch (err) {
        setDbResources(MOCK_ARTICLE_RESOURCES);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveArticles();
  }, [user?.id]);

  const allResources = activeSub === 'my-submissions' 
    ? mySubmissions 
    : (dbResources.length > 0 ? dbResources : MOCK_ARTICLE_RESOURCES);

  const filteredResources = allResources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || activeSub === 'my-submissions' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  const navCategories = [
    ...MOCK_ARTICLE_SUBCATEGORIES,
    ...(user ? [{ id: 'my-submissions', name: `My Submissions ${mySubmissions.length > 0 ? `(${mySubmissions.length})` : ''}` }] : [])
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] font-sans selection:bg-emerald-500/30 pb-24 text-gray-900 dark:text-gray-100">
      
      {/* Editorial Header */}
      <div className="border-b-4 border-gray-900 dark:border-white">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
           {/* Top Bar with Brand & Top-Right CTAs */}
           <div className="flex justify-between items-center mb-8 sm:mb-12">
             <div className="flex items-center gap-3">
               <span className="text-xs font-black uppercase tracking-widest text-emerald-600">The Journal</span>
               <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
               <span className="hidden sm:inline-block text-[11px] font-bold text-gray-400 uppercase tracking-wider">WIPA Global IP Editorial</span>
             </div>

             {/* Top Right Action Flow */}
             <div className="flex items-center gap-3">
               <Link 
                 href="/platform/resources/articles-insights/create"
                 className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff2a5f] hover:bg-[#e02553] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
               >
                 <PenTool size={14} className="group-hover:rotate-12 transition-transform" />
                 Publish Your Article
               </Link>
             </div>
           </div>
           
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-6">
             <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
               Articles & <br className="hidden md:block" /> Insights
             </h1>
             <div className="max-w-sm">
               <p className="text-lg font-medium text-gray-600 dark:text-gray-400 border-l-2 border-emerald-500 pl-4">
                 Expert opinions, detailed case studies, and thought leadership from the forefront of intellectual property.
               </p>
             </div>
           </div>
        </div>
      </div>

      {/* Modern Filter Nav */}
      <div className="border-b border-gray-200 dark:border-white/10 sticky top-0 bg-[#fafafa]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md z-40">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex gap-8 overflow-x-auto no-scrollbar w-full md:w-auto py-4">
            {navCategories.map(sub => {
              const isLexis = sub.id === 'lexisnexis-exclusives';
              const isMine = sub.id === 'my-submissions';
              const isActive = activeSub === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSub(sub.id)}
                  className={`relative text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive 
                      ? (isLexis ? 'text-blue-600 dark:text-blue-400' : isMine ? 'text-[#ff2a5f]' : 'text-emerald-600') 
                      : (isLexis ? 'text-blue-600/80 hover:text-blue-600 dark:text-blue-400/80' : isMine ? 'text-rose-400 hover:text-rose-600' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white')
                  }`}
                >
                  {isLexis && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                  {isMine && <span className="w-2 h-2 rounded-full bg-[#ff2a5f]" />}
                  <span>{sub.name}</span>
                  {isActive && (
                    <span className={`absolute -bottom-4 left-0 right-0 h-0.5 rounded-t-full ${isLexis ? 'bg-blue-600' : isMine ? 'bg-[#ff2a5f]' : 'bg-emerald-600'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Controls: Search & Filter Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end py-3">
            {/* Search Input */}
            <div className="w-full md:w-64 flex items-center bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-full px-4 py-2 shadow-xs transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
              <Search size={15} className="text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search journal..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-2.5 text-xs sm:text-sm font-bold focus:outline-none placeholder-gray-400 text-gray-900 dark:text-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter Button & Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                  typeFilter !== 'All Types'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20'
                    : isDropdownOpen
                    ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white border-gray-300 dark:border-white/20'
                    : 'bg-white dark:bg-[#111] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                <Filter size={13} className={typeFilter !== 'All Types' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'} />
                <span>{typeFilter === 'All Types' ? 'Filter' : typeFilter}</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-gray-400'}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filter By Format</span>
                    {typeFilter !== 'All Types' && (
                      <button
                        type="button"
                        onClick={() => {
                          setTypeFilter('All Types');
                          setIsDropdownOpen(false);
                        }}
                        className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="py-1 max-h-64 overflow-y-auto">
                    {CONTENT_TYPES.map(type => {
                      const isSelected = typeFilter === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setTypeFilter(type);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-black'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                          }`}
                        >
                          <span>{type}</span>
                          {isSelected && <Check size={14} className="text-emerald-600 dark:text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-12 flex flex-col xl:flex-row gap-12">
        
        {/* Main Content Column */}
        <div className="flex-1">
          {/* Featured Hero Article */}
          {featuredResources.length > 0 && activeSub !== 'my-submissions' && (
            <div className="mb-16">
              <Link href={`/platform/resources/articles-insights/${featuredResources[0].id}`} className="group block relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 transition-shadow hover:shadow-2xl hover:shadow-emerald-900/5">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-3/5 h-64 md:h-[450px] relative overflow-hidden">
                    <img src={featuredResources[0].image} alt={featuredResources[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-md">
                      Featured {featuredResources[0].type}
                    </div>
                  </div>
                  <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                       <span className="text-emerald-600">{featuredResources[0].topic}</span>
                       <span>&bull;</span>
                       <span className="flex items-center gap-1"><Clock size={14}/> {featuredResources[0].time}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-6 group-hover:text-emerald-600 transition-colors">
                      {featuredResources[0].title}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 line-clamp-3">
                      An in-depth look into the future of {featuredResources[0].topic.toLowerCase()} through the lens of industry experts and recent case studies. Read the full insights inside this exclusive editorial feature.
                    </p>
                    <div className="flex items-center gap-3 mt-auto pt-6 border-t border-gray-100 dark:border-white/10">
                       <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
                         <PenTool size={18} />
                       </div>
                       <div>
                         <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Author</div>
                         <div className="text-sm font-bold text-gray-900 dark:text-white">{featuredResources[0].author}</div>
                       </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Masonry / Grid for Regular Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(activeSub === 'my-submissions' ? filteredResources : regularResources).map(resource => (
              <Link key={resource.id} href={`/platform/resources/articles-insights/${resource.id}`} className="group flex flex-col relative overflow-hidden rounded-2xl bg-transparent transition-all">
                <div className="h-56 relative overflow-hidden rounded-2xl mb-5">
                   <img src={resource.image} alt={resource.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                   {resource.approval_status === 'in_review' && (
                     <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                       In Editorial Review
                     </div>
                   )}
                   {resource.approval_status === 'rejected' && (
                     <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                       Needs Revision
                     </div>
                   )}
                   {resource.approval_status === 'approved' && activeSub === 'my-submissions' && (
                     <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                       Live & Published
                     </div>
                   )}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    <Hash size={12} /> {resource.topic}
                  </div>
                  {resource.rejection_reason && (
                    <span className="text-[11px] font-bold text-rose-500 truncate max-w-[200px]" title={resource.rejection_reason}>
                      Feedback: {resource.rejection_reason}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black tracking-tight leading-snug mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {resource.title}
                </h3>
                {resource.summary && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                    {resource.summary}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-white/10">
                   <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center"><BookOpen size={10} className="text-gray-500" /></span>
                     {resource.author}
                   </span>
                   <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-[#111] px-2 py-1 rounded-md">{resource.time}</span>
                </div>
              </Link>
            ))}
          </div>

          {(activeSub === 'my-submissions' ? filteredResources : regularResources).length === 0 && (
             <div className="py-20 text-center border-t border-gray-200 dark:border-white/10 mt-8">
               <h3 className="text-2xl font-black text-gray-400">
                 {activeSub === 'my-submissions' ? "You haven't submitted any articles yet." : "No articles found"}
               </h3>
               {activeSub === 'my-submissions' && (
                 <Link 
                   href="/platform/resources/articles-insights/create" 
                   className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff2a5f] text-white font-bold text-xs uppercase tracking-wider"
                 >
                   <PenTool size={14} /> Draft Your First Article
                 </Link>
               )}
             </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="w-full xl:w-80 shrink-0">
           {/* Trending Now */}
           <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 mb-8 sticky top-32 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-2 border-b-2 border-emerald-500 pb-3 inline-flex">
                <TrendingUp className="text-emerald-500" size={18} /> Trending Now
              </h3>
              <div className="flex flex-col gap-8">
                 {filteredResources.slice(1, 5).map((resource, idx) => (
                   <Link key={resource.id} href={`/platform/resources/articles-insights/${resource.id}`} className="group flex gap-5 items-start">
                     <div className="text-4xl font-black text-gray-200 dark:text-white/10 group-hover:text-emerald-200 transition-colors mt-[-4px]">
                       0{idx + 1}
                     </div>
                     <div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">{resource.type}</div>
                       <h4 className="text-sm font-bold leading-snug group-hover:text-emerald-600 transition-colors">{resource.title}</h4>
                     </div>
                   </Link>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
