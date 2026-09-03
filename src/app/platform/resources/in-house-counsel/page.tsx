'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Building, ChevronRight, FileText, Download, Users, Video, Book, Briefcase, ChevronDown, FolderOpen, MoreHorizontal, Shield, Sparkles, Scale } from 'lucide-react';
import Link from 'next/link';

const MOCK_INHOUSE_SUBCATEGORIES = [
  { id: 'all', name: 'All Documents', icon: FolderOpen },
  { id: 'playbooks', name: 'Playbooks', icon: Book },
  { id: 'leadership', name: 'Leadership & Strategy', icon: Briefcase },
  { id: 'operations', name: 'IP Operations', icon: Building },
  { id: 'toolkits', name: 'Templates & Tools', icon: FileText }
];

const CONTENT_TYPES = [
  "All Types",
  "Corporate IP Playbook",
  "GC Roundtable",
  "Chief IP Counsel Interview",
  "Ask an In-House Counsel",
  "Guide",
  "Template",
  "Checklist",
  "Case Study",
  "Webinar",
  "Video"
];

const MOCK_INHOUSE_RESOURCES = [
  {
    id: 1,
    title: "The 2026 Corporate IP Strategy Playbook",
    type: "Corporate IP Playbook",
    topic: "IP Operations",
    subcategory: "playbooks",
    contributor: "Corporate Practice Team",
    organisation: "WIPA",
    featured: true,
    date: "Oct 24, 2025",
    size: "2.4 MB"
  },
  {
    id: 2,
    title: "GC Roundtable: Managing IP Budgets in a Downturn",
    type: "GC Roundtable",
    topic: "Leadership & Strategy",
    subcategory: "leadership",
    contributor: "Panel of 4 General Counsels",
    organisation: "Tech Industry Forum",
    featured: true,
    date: "Sep 15, 2025",
    size: "45 Min Video"
  },
  {
    id: 3,
    title: "Chief IP Counsel Interview: Building a Culture of Innovation",
    type: "Chief IP Counsel Interview",
    topic: "Leadership",
    subcategory: "leadership",
    contributor: "Sarah Jenkins",
    organisation: "Global Motors Inc.",
    featured: false,
    date: "Aug 02, 2025",
    size: "Read"
  },
  {
    id: 4,
    title: "Outside Counsel Guidelines Template",
    type: "Template",
    topic: "IP Operations",
    subcategory: "toolkits",
    contributor: "Legal Ops Group",
    organisation: "WIPA Standards",
    featured: false,
    date: "Jul 18, 2025",
    size: "145 KB (Word)"
  },
  {
    id: 5,
    title: "Ask an In-House Counsel: How to Handle Trade Secret Audits",
    type: "Ask an In-House Counsel",
    topic: "Trade Secrets",
    subcategory: "operations",
    contributor: "Marcus Vance",
    organisation: "DataCorp",
    featured: false,
    date: "Jun 30, 2025",
    size: "Read"
  },
  {
    id: 6,
    title: "Case Study: Streamlining Patent Harvesting Workflows",
    type: "Case Study",
    topic: "IP Operations",
    subcategory: "operations",
    contributor: "Innovation Team",
    organisation: "PharmaBio",
    featured: false,
    date: "Jun 12, 2025",
    size: "1.2 MB"
  }
];

import { supabase } from '@/lib/supabase';

export default function InHouseCounselHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [dbResources, setDbResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveInHouse() {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('category', 'in-house-counsel')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            type: d.resource_type || "Corporate Playbook",
            topic: d.tags?.[0] || "In-House Counsel",
            subcategory: d.subcategory || "operations",
            contributor: d.author_name || "WIPA Corporate Counsel",
            organisation: d.organization || d.author_title || "Official",
            featured: d.is_featured || false,
            date: new Date(d.created_at || Date.now()).toLocaleDateString(),
            size: d.read_time || "Read",
            image: d.cover_image_url || "/resourceimg1.jpg",
            is_splash_sponsored: d.is_splash_sponsored,
            splash_tagline: d.splash_tagline,
            splash_cta_text: d.splash_cta_text,
            splash_cta_url: d.splash_cta_url,
          }));
          setDbResources(mapped);
        } else {
          setDbResources(MOCK_INHOUSE_RESOURCES);
        }
      } catch (err) {
        setDbResources(MOCK_INHOUSE_RESOURCES);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveInHouse();
  }, []);

  const resourcesList = dbResources.length > 0 ? dbResources : MOCK_INHOUSE_RESOURCES;

  const filteredResources = resourcesList.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-sky-500/30 overflow-x-hidden transition-colors duration-300 pb-20">
      
      {/* Cinematic Hero Header (Ice Blue Theme) */}
      <div className="relative min-h-[350px] md:min-h-[450px] w-full flex flex-col justify-center pb-12 pt-8 border-b border-slate-200 dark:border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-slate-100 dark:from-[#082f49] dark:via-[#020617] dark:to-black z-0 transition-colors duration-300"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-300/30 dark:bg-sky-600/20 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-cyan-300/20 dark:bg-cyan-900/30 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"></div>
        
        {/* Ice crystals overlay pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] bg-[url('/patterns/cubes.png')] z-0 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 relative z-10 flex flex-col items-center justify-center h-full mt-8 md:mt-12">
           <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-lg shadow-sky-500/10 backdrop-blur-md">
             <Shield size={14} /> Enterprise Knowledge Base
           </div>
           
           <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-sky-700 to-cyan-500 dark:from-white dark:via-sky-200 dark:to-cyan-400">
               In-House Counsel
             </h1>
             <p className="text-lg md:text-xl lg:text-2xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto">
               Access and download exclusive playbooks, templates, and corporate IP insights.
             </p>
             
             {/* Search & Dropdown */}
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl mt-12">
               <div className="relative group w-full">
                 <div className="absolute inset-0 bg-sky-500 rounded-full blur-md opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                 <div className="relative flex items-center bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-full overflow-hidden backdrop-blur-xl shadow-xl dark:shadow-none transition-all">
                   <Search size={16} className="text-slate-400 dark:text-slate-500 ml-4 shrink-0" />
                   <input 
                     type="text" 
                     placeholder="Search database..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-transparent py-3.5 pl-3 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:outline-none placeholder-slate-500 dark:placeholder-slate-400"
                   />
                 </div>
               </div>
               
               <div className="relative w-full sm:w-48 shrink-0">
                  <select 
                     value={typeFilter}
                     onChange={(e) => setTypeFilter(e.target.value)}
                     className="appearance-none w-full bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-full px-6 py-3.5 pr-12 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 cursor-pointer backdrop-blur-xl shadow-xl dark:shadow-none transition-all"
                   >
                     {CONTENT_TYPES.map(type => (
                       <option key={type} value={type} className="dark:bg-slate-900">{type}</option>
                     ))}
                   </select>
                   <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
               </div>
             </div>

           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 py-12 relative z-10">
        
        {/* Navigation & Filters (Horizontal) */}
        <div className="mb-12">
           <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 w-full">
             {MOCK_INHOUSE_SUBCATEGORIES.map(sub => {
               const Icon = sub.icon;
               return (
                 <button
                   key={sub.id}
                   onClick={() => setActiveSub(sub.id)}
                   className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                     activeSub === sub.id 
                       ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105' 
                       : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5'
                   }`}
                 >
                   <Icon size={16} className={activeSub === sub.id ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
                   {sub.name}
                 </button>
               )
             })}
           </div>
        </div>

        {/* Ice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map(resource => (
            <div 
              key={resource.id} 
              className="group relative bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col h-full"
            >
              {/* Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl ${resource.featured ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-sky-100 dark:group-hover:bg-sky-900/50 group-hover:text-sky-600 dark:group-hover:text-sky-400'} transition-colors duration-300`}>
                    {resource.type === 'Video' || resource.type === 'GC Roundtable' ? (
                       <Video size={24} />
                    ) : resource.type === 'Ask an In-House Counsel' ? (
                       <Users size={24} />
                    ) : (
                       <FileText size={24} />
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{resource.date}</span>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {resource.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <Building size={14} className="text-slate-400" /> {resource.organisation}
                </div>
                
                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{resource.type}</span>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    {resource.size.includes('Video') || resource.size === 'Read' ? <ChevronRight size={18} /> : <Download size={18} />}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredResources.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-white/5">
                <Search size={32} className="text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No documents found</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
