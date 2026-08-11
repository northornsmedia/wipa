'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Star, Sparkles, TrendingUp, Users, BookOpen, Award } from 'lucide-react';
import Link from 'next/link';

const MOCK_WIPW_SUBCATEGORIES = [
  { id: 'all', name: 'All Content' },
  { id: 'annual-issues', name: 'Annual Issues' },
  { id: 'spotlights', name: 'Spotlights' },
  { id: 'interviews', name: 'Interviews' },
  { id: 'features', name: 'Features' }
];

const MOCK_WIPW_RESOURCES = [
  {
    id: 1,
    title: "Women's IP World Annual 2026",
    type: "Annual Issue",
    topic: "Global IP",
    subcategory: "annual-issues",
    expert: "WIPW Editorial",
    time: "2026 Edition",
    featured: true,
    image: "/Womens-IP-World-Award.webp",
    span: "col-span-12 md:col-span-8 row-span-2"
  },
  {
    id: 2,
    title: "Top 50 Women in Tech Law",
    type: "Ranking Feature",
    topic: "Industry Rankings",
    subcategory: "features",
    expert: "Research Team",
    time: "15 min read",
    featured: true,
    image: "/resourceimg1.jpg",
    span: "col-span-12 md:col-span-4 row-span-1"
  },
  {
    id: 3,
    title: "Breaking the Glass Ceiling",
    type: "Spotlight",
    topic: "Career",
    subcategory: "spotlights",
    expert: "Eleanor Vance",
    time: "10 min read",
    featured: false,
    image: "/resourceimg2.jpg",
    span: "col-span-12 md:col-span-4 row-span-1"
  },
  {
    id: 4,
    title: "Navigating Global Portfolios",
    type: "Interview",
    topic: "Global IP",
    subcategory: "interviews",
    expert: "Sarah Jenkins",
    time: "45 min watch",
    featured: false,
    image: "/resource3.jpg",
    span: "col-span-12 md:col-span-6 row-span-1"
  },
  {
    id: 6,
    title: "Diversity & Inclusion in IP 2026",
    type: "Feature",
    topic: "Trends",
    subcategory: "features",
    expert: "Policy Group",
    time: "8 min read",
    featured: false,
    image: "/resourceimg1.jpg",
    span: "col-span-12 md:col-span-6 row-span-1"
  }
];

export default function WomensIPWorldHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = MOCK_WIPW_RESOURCES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    return matchesSearch && matchesSub;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 font-sans selection:bg-pink-500/30 pb-20">
      
      {/* Modern Split Header */}
      <div className="border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#1e293b] sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">

            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="text-pink-500" size={24} />
                Women's IP World
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative group w-full md:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-[#0f172a] border border-transparent focus:border-pink-500 rounded-full py-2 pl-10 pr-4 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500 outline-none transition-all shadow-inner dark:shadow-none"
                />
             </div>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="max-w-[1400px] mx-auto px-6 flex gap-6 overflow-x-auto no-scrollbar border-t border-gray-100 dark:border-white/5">
          {MOCK_WIPW_SUBCATEGORIES.map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveSub(sub.id)}
              className={`py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
                activeSub === sub.id
                  ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-12">
        
        {/* Intro Section - Redesigned to be "More Cool" */}
        <div className="relative mb-16 rounded-[2.5rem] bg-gradient-to-br from-pink-50 to-white dark:from-[#1e293b] dark:to-[#0f172a] border border-pink-100 dark:border-white/5 overflow-hidden p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-sm">
           
           {/* Ambient Glows */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/20 dark:bg-pink-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-400/20 dark:bg-rose-400/10 blur-[80px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />
           
           <div className="relative z-10 max-w-2xl">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-black uppercase tracking-widest mb-6">
               <Star size={12} className="fill-current" />
               2026 Edition Live
             </div>
             <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-6">
               Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">female leaders</span> in IP.
             </h2>
             <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium max-w-xl">
               Discover exclusive interviews, annual spotlights, and leadership features celebrating women across the global intellectual property landscape.
             </p>
           </div>
           
           {/* Floating Decorative Elements */}
           <div className="relative z-10 hidden md:block shrink-0">
             <div className="w-56 h-56 rounded-full border-8 border-white dark:border-[#0f172a] shadow-2xl overflow-hidden relative -rotate-6 hover:rotate-0 transition-transform duration-500">
               <img src="/Womens-IP-World-Award.webp" alt="WIPW" className="w-full h-full object-cover scale-110" />
               <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/40 to-transparent mix-blend-overlay" />
             </div>
           </div>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-[250px]">
          {filteredResources.map((resource) => (
            <Link 
              key={resource.id} 
              href={`/platform/resources/womens-ip-world/${resource.id}`} 
              className={`group relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#1e293b] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-200 dark:border-white/10 ${resource.span}`}
            >
              <img 
                src={resource.image} 
                alt={resource.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 group-hover:rotate-1 transition-transform duration-700 ease-out" 
              />
              
              {/* Gradient Overlay tailored to the card size */}
              <div className={`absolute inset-0 bg-gradient-to-t ${resource.span.includes('row-span-2') ? 'from-black/90 via-black/40 to-transparent' : 'from-black/90 to-black/20'}`} />
              
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    {resource.type}
                  </span>
                  {resource.featured && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-md">
                      <Star size={12} className="text-white fill-white" />
                    </span>
                  )}
                </div>
                
                <h3 className={`font-black text-white leading-tight mb-3 group-hover:text-pink-200 transition-colors ${
                  resource.span.includes('col-span-8') ? 'text-3xl md:text-5xl max-w-2xl' : 'text-2xl md:text-3xl'
                }`}>
                  {resource.title}
                </h3>
                
                <div className="flex items-center gap-4 text-xs md:text-sm font-bold text-gray-300">
                  <span className="flex items-center gap-1.5 truncate"><Users size={14} className="text-pink-400" /> {resource.expert}</span>
                  <span className="opacity-50">&bull;</span>
                  <span className="shrink-0">{resource.time}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-[#1e293b] rounded-[2rem] border border-gray-200 dark:border-white/10 mt-6">
             <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-400" />
             </div>
             <p className="text-gray-900 dark:text-white text-lg font-bold">No content found matching your criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
}

