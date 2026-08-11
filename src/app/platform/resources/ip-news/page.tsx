'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Newspaper, Activity, Globe, Scale, ArrowRight, Zap, TrendingUp, Filter } from 'lucide-react';
import Link from 'next/link';

const MOCK_NEWS_SUBCATEGORIES = [
  { id: 'all', name: 'All News' },
  { id: 'global', name: 'Global Updates' },
  { id: 'us', name: 'US Updates' },
  { id: 'eu', name: 'EU Updates' },
  { id: 'uk', name: 'UK Updates' }
];

const CONTENT_TYPES = [
  "All Types",
  "News",
  "Legal Update",
  "Case Law Update",
  "Regulatory Update",
  "Legislative Update",
  "IP Office Update",
  "Jurisdiction Update",
  "Case Summary"
];

const MOCK_NEWS_RESOURCES = [
  {
    id: 1,
    title: "Supreme Court Rules on AI Inventorship",
    type: "Case Law Update",
    jurisdiction: "US",
    subcategory: "us",
    date: "2 hours ago",
    featured: true,
    image: "/resourceimg1.jpg"
  },
  {
    id: 2,
    title: "EPO Releases New Guidelines for Biotech Patents",
    type: "IP Office Update",
    jurisdiction: "EU",
    subcategory: "eu",
    date: "4 hours ago",
    featured: true,
    image: "/resourceimg2.jpg"
  },
  {
    id: 3,
    title: "UKIPO Launches Green Tech Fast-Track",
    type: "Regulatory Update",
    jurisdiction: "UK",
    subcategory: "uk",
    date: "1 day ago",
    featured: false,
    image: "/resource3.jpg"
  },
  {
    id: 4,
    title: "WIPO Reports Record Global Filings in 2026",
    type: "News",
    jurisdiction: "Global",
    subcategory: "global",
    date: "2 days ago",
    featured: false,
    image: "/resourceimg1.jpg"
  },
  {
    id: 5,
    title: "Major Tech Giants Settle Standard Essential Patent Dispute",
    type: "Case Summary",
    jurisdiction: "US",
    subcategory: "us",
    date: "3 days ago",
    featured: false,
    image: "/resourceimg2.jpg"
  },
  {
    id: 6,
    title: "New EU Design Directive Comes Into Force",
    type: "Legislative Update",
    jurisdiction: "EU",
    subcategory: "eu",
    date: "1 week ago",
    featured: false,
    image: "/resource3.jpg"
  }
];

export default function IPNewsHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const filteredResources = MOCK_NEWS_RESOURCES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-orange-500/30 pb-20 overflow-x-hidden">
      
      {/* Ticker Tape */}
      <div className="w-full bg-orange-600 text-white overflow-hidden py-2 border-b-4 border-gray-900 dark:border-black flex items-center">
         <div className="flex whitespace-nowrap animate-marquee gap-12 font-black uppercase text-[10px] tracking-widest">
           {/* Duplicate content to make it scroll seamlessly */}
           {MOCK_NEWS_RESOURCES.map(r => (
             <span key={`t1-${r.id}`} className="flex items-center gap-2"><Zap size={12}/> {r.title}</span>
           ))}
           {MOCK_NEWS_RESOURCES.map(r => (
             <span key={`t2-${r.id}`} className="flex items-center gap-2"><Zap size={12}/> {r.title}</span>
           ))}
         </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>

      {/* Terminal Header */}
      <div className="border-b-2 border-gray-900 dark:border-white/20 bg-white dark:bg-[#111]">
        <div className="max-w-[1500px] mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div>

             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none flex items-center gap-4">
               Live <span className="text-orange-500">Updates</span>
             </h1>
           </div>
           
           <div className="w-full md:w-80 flex items-center border-2 border-gray-900 dark:border-white/20 bg-gray-50 dark:bg-[#0a0a0a] rounded-sm">
             <Search size={16} className="text-gray-400 ml-4 shrink-0" />
             <input 
               type="text" 
               placeholder="Search terminal..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-transparent p-3 text-sm font-bold focus:outline-none placeholder-gray-400"
             />
           </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 pt-12 flex flex-col lg:flex-row gap-12">
        
        {/* Left Nav (Filters) */}
        <div className="w-full lg:w-48 shrink-0">
          <div className="sticky top-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2 border-b-2 border-gray-200 dark:border-white/10 pb-2">
              <Filter size={12} /> Jurisdictions
            </h3>
            <div className="flex flex-col gap-2 mb-10">
              {MOCK_NEWS_SUBCATEGORIES.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSub(sub.id)}
                  className={`text-left text-sm font-bold transition-all px-3 py-2 border-l-4 ${
                    activeSub === sub.id
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2 border-b-2 border-gray-200 dark:border-white/10 pb-2">
               Type
            </h3>
            <div className="flex flex-col gap-1">
              {CONTENT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`text-left text-xs font-bold transition-all px-3 py-2 rounded-sm ${
                    typeFilter === type
                      ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 min-w-0 flex flex-col gap-12">
          
          {/* Breaking Feature */}
          {featuredResources.length > 0 && (
            <Link href={`/platform/resources/ip-news/${featuredResources[0].id}`} className="group block bg-white dark:bg-[#111] border-2 border-gray-900 dark:border-white/20 p-6 md:p-8 hover:border-orange-500 transition-colors relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
               <div className="flex flex-col xl:flex-row gap-8 items-center">
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-6 text-[10px] font-black uppercase tracking-widest">
                     <span className="text-white bg-orange-500 px-3 py-1"><Globe size={10} className="inline mr-1 mb-0.5" />{featuredResources[0].jurisdiction}</span>
                     <span className="text-orange-500 flex items-center gap-1 animate-pulse"><Activity size={12}/> Breaking</span>
                   </div>
                   <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-none mb-8 group-hover:text-orange-500 transition-colors uppercase">
                     {featuredResources[0].title}
                   </h2>
                   <div className="flex items-center gap-4 text-xs font-bold text-gray-400 border-t-2 border-gray-100 dark:border-white/10 pt-4 uppercase tracking-widest">
                     <span>{featuredResources[0].type}</span>
                     <span>&bull;</span>
                     <span>{featuredResources[0].date}</span>
                   </div>
                 </div>
                 <div className="w-full xl:w-72 h-48 xl:h-auto shrink-0 border-2 border-gray-900 dark:border-white/10 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img src={featuredResources[0].image} alt={featuredResources[0].title} className="absolute inset-0 w-full h-full object-cover" />
                 </div>
               </div>
            </Link>
          )}

          {/* Terminal List */}
          <div className="flex flex-col">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
              Live Feed
            </h3>
            <div className="flex flex-col border-t-4 border-gray-900 dark:border-white">
              {regularResources.map((resource, idx) => (
                <Link key={resource.id} href={`/platform/resources/ip-news/${resource.id}`} className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-6 border-b border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-[#111] transition-colors px-4 -mx-4">
                  
                  <div className="w-24 shrink-0 text-xs font-black text-gray-400 uppercase tracking-widest">
                    {resource.date}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-orange-500">
                       <span>{resource.jurisdiction}</span>
                       <span>/</span>
                       <span>{resource.type}</span>
                    </div>
                    <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none group-hover:text-orange-500 transition-colors truncate">
                      {resource.title}
                    </h4>
                  </div>
                  
                  <div className="shrink-0 text-gray-300 dark:text-gray-700 group-hover:text-orange-500 transition-colors hidden md:block">
                    <ArrowRight size={24} />
                  </div>
                </Link>
              ))}

              {regularResources.length === 0 && (
                <div className="py-16 text-center text-gray-400 font-bold uppercase tracking-widest">
                  No Updates Found
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Sidebar (Stats / Market) */}
        <div className="w-full lg:w-72 shrink-0">
           <div className="bg-gray-900 text-white dark:bg-[#111] dark:border dark:border-white/20 p-6 sticky top-8 rounded-sm">
             <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-orange-500">
               <TrendingUp size={16} /> Jurisdiction Activity
             </h3>
             <div className="flex flex-col gap-4 text-sm font-bold">
               <div className="flex justify-between items-center border-b border-white/10 pb-3">
                 <span>Global (WIPO)</span>
                 <span className="text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-sm">+12%</span>
               </div>
               <div className="flex justify-between items-center border-b border-white/10 pb-3">
                 <span>United States (USPTO)</span>
                 <span className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded-sm">+5%</span>
               </div>
               <div className="flex justify-between items-center border-b border-white/10 pb-3">
                 <span>European Union (EPO)</span>
                 <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded-sm">-2%</span>
               </div>
               <div className="flex justify-between items-center border-b border-white/10 pb-3">
                 <span>United Kingdom (UKIPO)</span>
                 <span className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded-sm">+1%</span>
               </div>
             </div>
             
             <div className="mt-8 pt-6 border-t border-white/10 text-[10px] text-gray-500 font-black uppercase tracking-widest leading-relaxed">
               Data updated dynamically based on recent news volume and litigation filings.
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
