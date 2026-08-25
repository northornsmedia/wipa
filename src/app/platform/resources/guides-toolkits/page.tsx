'use client';

import React, { useState, useEffect } from 'react';
import { Search, Command, FileCode, CheckSquare, DownloadCloud, Box, LayoutTemplate, Zap, Folder, Sparkles, Layers3, BookOpenCheck, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const MOCK_GUIDES_SUBCATEGORIES = [
  { id: 'all', name: 'All Resources' },
  { id: 'guides', name: 'Practice Guides' },
  { id: 'templates', name: 'Templates' },
  { id: 'toolkits', name: 'Toolkits' },
  { id: 'playbooks', name: 'Playbooks' }
];

const CONTENT_TYPES = [
  "All Types",
  "PDF Guide",
  "Toolkit",
  "Checklist",
  "Template",
  "Playbook",
  "Workbook",
  "FAQ",
  "Glossary"
];

type GuideResource = {
  id: string | number;
  title: string;
  type: string;
  topic: string;
  subcategory: string;
  author: string;
  time: string;
  featured: boolean;
  image: string;
  is_splash_sponsored?: boolean;
  splash_tagline?: string | null;
  splash_cta_text?: string | null;
  splash_cta_url?: string | null;
};

type GuideResourceRow = {
  id: string;
  title: string;
  resource_type?: string | null;
  tags?: string[] | null;
  subcategory?: string | null;
  author_name?: string | null;
  read_time?: string | null;
  is_featured?: boolean | null;
  cover_image_url?: string | null;
  is_splash_sponsored?: boolean;
  splash_tagline?: string | null;
  splash_cta_text?: string | null;
  splash_cta_url?: string | null;
};

const MOCK_GUIDES_RESOURCES: GuideResource[] = [
  {
    id: 1,
    title: "AI Patent Strategy Playbook",
    type: "Playbook",
    topic: "AI in IP",
    subcategory: "playbooks",
    author: "WIPA Tech Group",
    time: "24 Pages",
    featured: true,
    image: "/resourceimg1.jpg"
  },
  {
    id: 2,
    title: "In-House Counsel IP Audit Toolkit",
    type: "Toolkit",
    topic: "IP Strategy",
    subcategory: "toolkits",
    author: "Corporate Practice Team",
    time: "5 Templates",
    featured: true,
    image: "/resourceimg2.jpg"
  },
  {
    id: 3,
    title: "SaaS Licensing Agreement Template",
    type: "Template",
    topic: "Licensing",
    subcategory: "templates",
    author: "Contracts Division",
    time: "DOCX",
    featured: false,
    image: "/resource3.jpg"
  },
  {
    id: 4,
    title: "Defensive Publication Checklist",
    type: "Checklist",
    topic: "Patent Law",
    subcategory: "guides",
    author: "Innovation Team",
    time: "PDF",
    featured: false,
    image: "/resourceimg1.jpg"
  },
  {
    id: 5,
    title: "Navigating the UPC: A Practical Guide",
    type: "PDF Guide",
    topic: "IP Litigation",
    subcategory: "guides",
    author: "EU Litigation Desk",
    time: "45 Pages",
    featured: false,
    image: "/resourceimg2.jpg"
  },
  {
    id: 6,
    title: "Global IP Filing Glossary 2026",
    type: "Glossary",
    topic: "Global IP",
    subcategory: "guides",
    author: "WIPA Editorial",
    time: "Interactive",
    featured: false,
    image: "/resource3.jpg"
  }
];

import { supabase } from '@/lib/supabase';

export default function GuidesToolkitsHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dbResources, setDbResources] = useState<GuideResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveGuides() {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('category', 'guides-toolkits')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = (data as GuideResourceRow[]).map((d) => ({
            id: d.id,
            title: d.title,
            type: d.resource_type || "Toolkit",
            topic: d.tags?.[0] || "IP Practice",
            subcategory: d.subcategory || "due-diligence",
            author: d.author_name || "WIPA Practice Guides",
            time: d.read_time || "Downloadable Pack",
            featured: d.is_featured || false,
            image: d.cover_image_url || "/resourceimg1.jpg",
            is_splash_sponsored: d.is_splash_sponsored,
            splash_tagline: d.splash_tagline,
            splash_cta_text: d.splash_cta_text,
            splash_cta_url: d.splash_cta_url,
          }));
          setDbResources(mapped);
        } else {
          setDbResources(MOCK_GUIDES_RESOURCES);
        }
      } catch {
        setDbResources(MOCK_GUIDES_RESOURCES);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveGuides();
  }, []);

  const resourcesList = dbResources.length > 0 ? dbResources : MOCK_GUIDES_RESOURCES;

  const filteredResources = resourcesList.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-[#f5f8f7] dark:bg-[#07100f] text-gray-900 dark:text-gray-100 font-sans selection:bg-teal-500/30">
      
      {/* App Header */}
      <div className="sticky top-[var(--platform-header-height)] z-30 border-b border-gray-200/80 bg-white/85 shadow-[0_8px_30px_rgba(15,23,42,0.035)] backdrop-blur-xl dark:border-white/10 dark:bg-[#07100f]/85 dark:shadow-none">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">

            <div className="flex items-center gap-3">
               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20">
                 <Command size={18} />
               </div>
               <div>
                 <h1 className="mb-1 text-base font-black leading-none tracking-tight md:text-lg">Guides & Toolkits</h1>
                 <p className="hidden text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-teal-600 sm:block dark:text-teal-400">Practice Resource Studio</p>
               </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl relative group hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 group-focus-within:text-teal-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search templates, guides, playbooks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-16 text-sm font-medium shadow-inner outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-white/5 dark:bg-white/5 dark:focus:bg-[#0b1715]"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
               <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-gray-400 shadow-sm dark:border-white/10 dark:bg-white/10">⌘K</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-500"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Folder size={20} />
          </button>
        </div>

        {/* Mobile Search Bar (visible only on small screens) */}
        <div className="md:hidden px-4 pb-4">
           <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-white/5 border border-transparent focus:border-teal-500 rounded-lg py-2 pl-9 pr-3 text-sm font-medium transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[1600px] flex-col gap-8 px-4 pb-24 pt-6 md:px-6 md:pt-10 lg:flex-row lg:items-start lg:gap-10">
        
        {/* Notion-style Sidebar */}
        <div className={`w-full shrink-0 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm lg:sticky lg:top-[calc(var(--platform-header-height)+96px)] lg:w-64 dark:border-white/10 dark:bg-[#0b1715] ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
           <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 mb-4 px-3">Directory</h3>
           <div className="flex flex-col gap-1">
             {MOCK_GUIDES_SUBCATEGORIES.map(sub => (
               <button
                 key={sub.id}
                 onClick={() => {
                   setActiveSub(sub.id);
                   setIsSidebarOpen(false);
                 }}
                 className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                   activeSub === sub.id
                     ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold'
                     : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                 }`}
               >
                 <Folder size={16} className={activeSub === sub.id ? 'text-teal-500' : 'text-gray-400'} />
                 {sub.name}
               </button>
             ))}
           </div>
           
           <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 mb-4 px-3 mt-8 md:mt-10">File Type</h3>
           <div className="flex flex-col gap-1">
             {CONTENT_TYPES.map(type => (
               <button
                 key={type}
                 onClick={() => {
                   setTypeFilter(type);
                   setIsSidebarOpen(false);
                 }}
                 className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                   typeFilter === type
                     ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold'
                     : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                 }`}
               >
                 {type}
                 {typeFilter === type && <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>}
               </button>
             ))}
           </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 min-w-0">

           {/* Editorial hero */}
           <section className="relative mb-10 overflow-hidden rounded-[2rem] border border-teal-300/15 bg-[#062d2a] px-6 py-9 text-white shadow-2xl shadow-teal-950/10 md:px-10 md:py-12 lg:min-h-[360px] lg:px-12">
             <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-teal-400/20 blur-[80px]" />
             <div className="pointer-events-none absolute -bottom-48 left-1/4 h-80 w-80 rounded-full bg-emerald-300/10 blur-[90px]" />
             <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.45)_1px,transparent_1px)] [background-size:36px_36px]" />

             <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
               <div>
                 <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-teal-100 backdrop-blur">
                   <Sparkles size={14} /> Built for practical action
                 </span>
                 <h2 className="mt-6 max-w-3xl text-4xl font-black leading-[1.03] tracking-[-0.045em] md:text-6xl">
                   Turn complex IP work into <span className="text-teal-300">confident action.</span>
                 </h2>
                 <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-teal-50/75 md:text-base">
                   Practice-ready guides, reusable templates and expert-built toolkits designed to help you move from question to outcome faster.
                 </p>
                 <div className="mt-7 flex flex-wrap gap-3">
                   <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3.5 py-2.5 text-xs font-bold text-white/85"><BookOpenCheck size={16} className="text-teal-300" /> {loading ? 'Loading' : resourcesList.length} resources</span>
                   <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3.5 py-2.5 text-xs font-bold text-white/85"><Layers3 size={16} className="text-teal-300" /> Four collections</span>
                   <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3.5 py-2.5 text-xs font-bold text-white/85"><DownloadCloud size={16} className="text-teal-300" /> Ready to use</span>
                 </div>
               </div>

               <div className="relative hidden h-64 lg:block" aria-hidden="true">
                 <div className="absolute left-8 top-8 w-60 -rotate-6 rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:-rotate-3">
                   <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-300 text-teal-950"><CheckSquare size={20} /></span><span className="text-[10px] font-black uppercase tracking-widest text-teal-100/60">Checklist</span></div>
                   <div className="mt-8 h-2 w-4/5 rounded-full bg-white/25" /><div className="mt-3 h-2 w-3/5 rounded-full bg-white/10" />
                 </div>
                 <div className="absolute bottom-0 right-1 w-64 rotate-6 rounded-2xl border border-white/20 bg-white p-5 text-slate-900 shadow-2xl transition-transform duration-500 hover:rotate-3">
                   <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white"><LayoutTemplate size={20} /></span><ArrowUpRight size={18} className="text-teal-600" /></div>
                   <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-teal-600">Practice template</p>
                   <p className="mt-2 text-lg font-black leading-tight">Expert resources, ready when you are.</p>
                 </div>
               </div>
             </div>
           </section>
           
           {/* Featured "Hero Widgets" */}
           {featuredResources.length > 0 && (
             <div className="mb-12 md:mb-16">
               <div className="mb-6 flex items-end justify-between gap-4">
                 <div>
                   <p className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">Editor’s selection</p>
                   <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">Featured resources</h2>
                 </div>
                 <span className="hidden text-xs font-bold text-gray-400 sm:inline">Curated by WIPA practice teams</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                 {featuredResources.map(resource => (
                   <Link key={resource.id} href={`/platform/resources/guides-toolkits/${resource.id}`} className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-teal-400 hover:shadow-2xl hover:shadow-teal-500/10 dark:border-white/10 dark:bg-[#0b1715] dark:hover:border-teal-500/50">
                     <div className="relative h-48 w-full overflow-hidden bg-gray-100 md:h-56 dark:bg-[#10201d]">
                       {/* Dynamic cover URLs can come from member-managed Supabase content. */}
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={resource.image} alt={resource.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#041b19]/95 via-[#041b19]/20 to-transparent" />
                       <div className="absolute bottom-5 left-5 flex items-center gap-2">
                         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-white shadow-lg shadow-teal-500/20">
                            <Zap size={16} />
                         </div>
                         <span className="text-xs font-black uppercase tracking-[0.14em] text-white">{resource.type}</span>
                       </div>
                     </div>
                     <div className="flex flex-1 flex-col p-6">
                       <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">{resource.topic}</p>
                       <h3 className="mb-4 line-clamp-2 text-xl font-black leading-snug transition-colors group-hover:text-teal-600 md:text-2xl dark:group-hover:text-teal-400">{resource.title}</h3>
                       <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-medium text-gray-500 dark:border-white/5 dark:text-gray-400">
                         <span className="flex items-center gap-1.5"><Box size={14}/> {resource.author}</span>
                         <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 font-mono text-[10px] uppercase text-gray-600 dark:bg-white/10 dark:text-gray-300">{resource.time}</span>
                       </div>
                     </div>
                   </Link>
                 ))}
               </div>
             </div>
           )}

           {/* Grid "App" Directory */}
           <div>
             <div className="mb-6 flex items-end justify-between gap-4 border-b border-gray-200 pb-5 dark:border-white/10">
               <div>
                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">Browse the library</p>
                 <h2 className="mt-2 flex items-center gap-3 text-xl font-black md:text-2xl">Directory items <span className="rounded-lg border border-gray-200 bg-white px-2 py-1 font-mono text-xs text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">{regularResources.length}</span></h2>
               </div>
               <SlidersHorizontal size={19} className="text-gray-400" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
               {regularResources.map(resource => (
                 <Link key={resource.id} href={`/platform/resources/guides-toolkits/${resource.id}`} className="group relative flex min-h-[250px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-400 hover:shadow-xl hover:shadow-teal-500/5 dark:border-white/10 dark:bg-[#0b1715] dark:hover:border-teal-500/40">
                   
                   <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-[100%] bg-gradient-to-bl from-teal-400/15 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                   <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-teal-500 to-emerald-400 transition-transform duration-300 group-hover:scale-x-100" />
                   
                   <div className="flex items-start justify-between mb-4">
                     <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-all group-hover:scale-105 group-hover:bg-teal-50 group-hover:text-teal-600 dark:bg-white/5 dark:group-hover:bg-teal-500/10 dark:group-hover:text-teal-400">
                       {resource.type === 'Template' ? <LayoutTemplate size={20} /> : resource.type === 'Checklist' ? <CheckSquare size={20} /> : <FileCode size={20} />}
                     </div>
                     <span className="text-[10px] font-mono uppercase bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 px-2 py-1 rounded border border-gray-200 dark:border-white/5">{resource.time}</span>
                   </div>
                   
                   <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-teal-600 dark:text-teal-400">{resource.topic}</p>
                   <h3 className="mb-3 text-base font-black leading-snug transition-colors group-hover:text-teal-600 md:text-lg dark:group-hover:text-teal-400">{resource.title}</h3>
                   
                   <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                     <span>{resource.author}</span>
                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all group-hover:bg-teal-500 group-hover:text-white dark:bg-white/5"><DownloadCloud size={14} /></span>
                   </div>
                 </Link>
               ))}
               
               {regularResources.length === 0 && (
                 <div className="col-span-full py-16 text-center border border-dashed border-gray-300 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-[#111]">
                   <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center mx-auto mb-4 text-gray-400">
                     <Search size={20} />
                   </div>
                   <h3 className="text-sm font-bold mb-1">No items match your filter</h3>
                   <p className="text-xs text-gray-500">Try selecting a different directory or file type.</p>
                 </div>
               )}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
