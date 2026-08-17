'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Download, ChevronRight, FileText, BarChart2, BookOpen, Clock, Users, Building, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const MOCK_RESEARCH_SUBCATEGORIES = [
  { id: 'all', name: 'All Reports' },
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
  "WIPA Research",
  "Partner Research",
  "Case Study"
];

const MOCK_RESEARCH_RESOURCES = [
  {
    id: 1,
    title: "Global Intellectual Property Market Outlook 2026-2030",
    type: "Market Report",
    topic: "Global IP",
    subcategory: "market-data",
    author: "WIPA Intelligence Unit",
    time: "Published Oct 2026",
    featured: true,
    image: "/resourceimg1.jpg"
  },
  {
    id: 2,
    title: "The Impact of Generative AI on Copyright Systems",
    type: "White Paper",
    topic: "AI in IP",
    subcategory: "wipa-research",
    author: "Dr. Elena Rostova",
    time: "Published Sep 2026",
    featured: true,
    image: "/resourceimg2.jpg"
  },
  {
    id: 3,
    title: "Annual Global IP Counsel Salary Survey 2026",
    type: "Survey",
    topic: "Career & Leadership",
    subcategory: "wipa-research",
    author: "WIPA Careers Team",
    time: "Published Aug 2026",
    featured: false,
    image: "/resource3.jpg"
  },
  {
    id: 4,
    title: "Patent Litigation Trends in the Tech Sector",
    type: "Partner Research",
    topic: "IP Litigation",
    subcategory: "partner",
    author: "LexisNexis & Tech IP Group",
    time: "Published Jul 2026",
    featured: false,
    image: "/resourceimg1.jpg"
  },
  {
    id: 5,
    title: "Quantifying Trademark Dilution in the Metaverse",
    type: "Academic Research",
    topic: "Brand Protection",
    subcategory: "academic",
    author: "Stanford Law School",
    time: "Published Jun 2026",
    featured: false,
    image: "/resourceimg2.jpg"
  },
  {
    id: 6,
    title: "Startups vs Non-Practicing Entities: A Decade in Review",
    type: "Research Paper",
    topic: "Patent Law",
    subcategory: "academic",
    author: "MIT Innovation Lab",
    time: "Published May 2026",
    featured: false,
    image: "/resource3.jpg"
  }
];

import { supabase } from '@/lib/supabase';

export default function ResearchReportsHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [dbResources, setDbResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveReports() {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('category', 'research-reports')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            type: d.resource_type || "Research Report",
            topic: d.tags?.[0] || "Industry Data",
            subcategory: d.subcategory || "wipa",
            author: d.author_name || "WIPA Analytics",
            time: d.read_time || "30 Pages (PDF)",
            featured: d.is_featured || false,
            image: d.cover_image_url || "/resourceimg2.jpg",
            is_splash_sponsored: d.is_splash_sponsored,
            splash_tagline: d.splash_tagline,
            splash_cta_text: d.splash_cta_text,
            splash_cta_url: d.splash_cta_url,
          }));
          setDbResources(mapped);
        } else {
          setDbResources(MOCK_RESEARCH_RESOURCES);
        }
      } catch (err) {
        setDbResources(MOCK_RESEARCH_RESOURCES);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveReports();
  }, []);

  const resourcesList = dbResources.length > 0 ? dbResources : MOCK_RESEARCH_RESOURCES;

  const filteredResources = resourcesList.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-red-500/30 pb-24">
      
      {/* Archive Header - Huge and Minimalist */}
      <div className="bg-white dark:bg-[#111] border-b border-gray-200 dark:border-white/10 pt-12 pb-16">
        <div className="max-w-[1200px] mx-auto px-6">

          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
             <div>
               <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
                 Research <br className="hidden md:block"/> <span className="text-red-500">& Reports</span>
               </h1>
               <p className="text-lg font-medium text-gray-500 dark:text-gray-400 max-w-lg">
                 Access our comprehensive archive of market data, academic papers, and in-depth industry analysis.
               </p>
             </div>
             
             {/* Big Library Search */}
             <div className="w-full md:w-96 relative group">
                <div className="absolute inset-0 bg-red-500 rounded-full blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                <div className="relative bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-full p-2 flex items-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-[#222] flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                    <Search size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search the archive..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent pl-4 pr-4 py-2 font-bold text-gray-900 dark:text-white focus:outline-none placeholder-gray-400"
                  />
                </div>
             </div>
          </div>
          
          {/* Minimalist Tab Navigation */}
          <div className="flex gap-8 overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-white/10">
            {MOCK_RESEARCH_SUBCATEGORIES.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className={`pb-4 text-sm font-black uppercase tracking-widest transition-colors whitespace-nowrap relative ${
                  activeSub === sub.id ? 'text-red-500' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {sub.name}
                {activeSub === sub.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-16">
        
        {/* Featured Report (Book/Cover style) */}
        {featuredResources.length > 0 && (
          <div className="mb-20">
            <h2 className="text-xl font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Featured Publication
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Report Cover Visualization */}
              <div className="lg:col-span-5 relative group cursor-pointer">
                 <div className="absolute inset-0 bg-red-500 rounded-xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
                 <div className="relative aspect-[3/4] rounded-r-xl rounded-l-md overflow-hidden border-l-8 border-gray-900 shadow-2xl shadow-black/20 group-hover:-translate-y-2 group-hover:shadow-red-500/10 transition-all duration-500">
                   <img src={featuredResources[0].image} alt={featuredResources[0].title} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                   <div className="absolute top-6 left-6">
                      <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">{featuredResources[0].type}</span>
                   </div>
                   <div className="absolute bottom-8 left-8 right-8">
                     <h3 className="text-3xl font-black text-white leading-tight mb-2 drop-shadow-md">{featuredResources[0].title}</h3>
                     <p className="text-red-300 font-bold text-sm tracking-widest uppercase">{featuredResources[0].author}</p>
                   </div>
                 </div>
              </div>
              
              {/* Report Details */}
              <div className="lg:col-span-7">
                 <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-[1.1]">{featuredResources[0].title}</h3>
                 <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 font-medium leading-relaxed">
                   This comprehensive report provides a deep dive into the current landscape of {featuredResources[0].topic.toLowerCase()}, featuring exclusive market data, expert analysis, and actionable insights for practitioners and policymakers.
                 </p>
                 
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                   <div className="bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-white/10">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Published</div>
                     <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"><Clock size={14} className="text-red-500"/> {featuredResources[0].time.replace('Published ', '')}</div>
                   </div>
                   <div className="bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-white/10">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Author</div>
                     <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"><Building size={14} className="text-red-500"/> {featuredResources[0].author}</div>
                   </div>
                   <div className="bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-white/10 md:col-span-1 col-span-2">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Format</div>
                     <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"><FileText size={14} className="text-red-500"/> PDF (12MB)</div>
                   </div>
                 </div>
                 
                 <Link href={`/platform/resources/research-reports/${featuredResources[0].id}`} className="inline-flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-lg shadow-red-500/25 transition-all hover:scale-105">
                   <Download size={18} /> Download Full Report
                 </Link>
              </div>
            </div>
          </div>
        )}

        {/* Database List View */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h2 className="text-xl font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-gray-400"></span> Database Archive
            </h2>
            {/* Minimal Type Filter */}
            <div className="relative group w-full md:w-auto">
               <select 
                 value={typeFilter}
                 onChange={(e) => setTypeFilter(e.target.value)}
                 className="appearance-none w-full md:w-auto bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-full px-5 py-2.5 pr-10 text-sm font-bold text-gray-600 dark:text-gray-300 focus:outline-none focus:border-red-500 cursor-pointer shadow-sm"
               >
                 {CONTENT_TYPES.map(type => (
                   <option key={type} value={type}>{type}</option>
                 ))}
               </select>
               <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#111] rounded-[2rem] border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 md:p-8 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-[10px] font-black uppercase tracking-widest text-gray-400">
               <div className="col-span-5">Document Title</div>
               <div className="col-span-3">Publisher / Author</div>
               <div className="col-span-2">Date</div>
               <div className="col-span-2 text-right">Action</div>
            </div>
            
            {/* Table Rows */}
            <div className="flex flex-col">
               {regularResources.map((resource, idx) => (
                 <Link key={resource.id} href={`/platform/resources/research-reports/${resource.id}`} className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 md:px-8 md:py-6 border-b border-gray-100 dark:border-white/5 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors">
                    
                    <div className="md:col-span-5 flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors shrink-0">
                         <FileText size={20} />
                       </div>
                       <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">{resource.type}</div>
                         <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 md:line-clamp-1">{resource.title}</h4>
                       </div>
                    </div>
                    
                    <div className="md:col-span-3 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-2 md:mt-0">
                       <span className="hidden md:inline"><Building size={14} /></span> {resource.author}
                    </div>
                    
                    <div className="md:col-span-2 text-sm font-bold text-gray-400 mt-1 md:mt-0">
                       {resource.time.replace('Published ', '')}
                    </div>
                    
                    <div className="md:col-span-2 flex justify-end mt-4 md:mt-0">
                       <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 text-gray-400 group-hover:bg-red-500 group-hover:border-red-500 group-hover:text-white transition-all shadow-sm">
                          <Download size={16} />
                       </div>
                    </div>
                 </Link>
               ))}
               
               {regularResources.length === 0 && (
                 <div className="p-16 text-center">
                   <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 text-gray-400">
                     <Search size={24} />
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No documents found</h3>
                   <p className="text-gray-500 font-medium">Try adjusting your search criteria in the database.</p>
                 </div>
               )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
