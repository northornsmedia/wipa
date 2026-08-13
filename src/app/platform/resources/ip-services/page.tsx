'use client';

import React, { useState } from 'react';
import { Search, Building, ChevronRight, FileText, Download, Shield, Book, Briefcase, ChevronDown, FolderOpen, Video, Users, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const MOCK_SUBCATEGORIES = [
  { id: 'all', name: 'All Services', icon: FolderOpen },
  { id: 'trademark', name: 'Trademarks', icon: Shield },
  { id: 'patent', name: 'Patents', icon: FileText },
  { id: 'copyright', name: 'Copyrights', icon: Book },
  { id: 'consulting', name: 'Consulting', icon: Briefcase }
];

const CONTENT_TYPES = [
  "All Types",
  "Service",
  "Consulting",
  "Audit",
  "Filing",
  "Strategy"
];

const MOCK_COMPANIES = [
  {
    id: "pss-solutions",
    title: "PSS Solutions",
    type: "Enterprise IP Solutions",
    subcategory: "all",
    location: "Global",
    sponsored: true,
    logo: "https://cdn.prod.website-files.com/64c4a14aa0442cfa0e0c62e9/6593a22b139e1daa37dd5974_PSS_Pfront_BLUE%20(1).svg",
    description: "PSS Solutions provides premier intellectual property services, focusing on comprehensive global trademark registration and patent drafting."
  },
  {
    id: "tech-protect-llp",
    title: "TechProtect LLP",
    type: "Digital IP Specialists",
    subcategory: "copyright",
    location: "San Francisco, CA",
    sponsored: false,
    description: "Specializing in copyright protection for digital assets, software patents, and AI-generated content licensing."
  },
  {
    id: "innovate-partners",
    title: "Innovate Partners",
    type: "Consulting & Strategy",
    subcategory: "consulting",
    location: "London, UK",
    sponsored: false,
    description: "Strategic IP consulting firm helping startups and enterprises maximize the valuation of their intellectual property assets."
  },
  {
    id: "global-marks",
    title: "GlobalMarks Inc.",
    type: "Trademark Agency",
    subcategory: "trademark",
    location: "New York, NY",
    sponsored: false,
    description: "Filing and protecting your brand identity across 150+ international jurisdictions with seamless tracking."
  }
];

export default function IPServicesPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const filteredResources = MOCK_COMPANIES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type.includes(typeFilter) || typeFilter === 'All Types';
    
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
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 relative z-10 flex flex-col items-center justify-center h-full mt-8 md:mt-12">
           <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-lg shadow-sky-500/10 backdrop-blur-md">
             <Shield size={14} /> Enterprise IP Solutions
           </div>
           
           <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-sky-700 to-cyan-500 dark:from-white dark:via-sky-200 dark:to-cyan-400">
               IP Services
             </h1>
             <p className="text-lg md:text-xl lg:text-2xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto">
               Access expert consulting, trademark registration, patent filing, and comprehensive IP audits.
             </p>
             
             {/* Search & Dropdown */}
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl mt-12">
               <div className="relative group w-full">
                 <div className="absolute inset-0 bg-sky-500 rounded-full blur-md opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                 <div className="relative flex items-center bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-full overflow-hidden backdrop-blur-xl shadow-xl dark:shadow-none transition-all">
                   <Search size={16} className="text-slate-400 dark:text-slate-500 ml-4 shrink-0" />
                   <input 
                     type="text" 
                     placeholder="Search services..." 
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
             {MOCK_SUBCATEGORIES.map(sub => {
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
            <Link 
              href={`/platform/resources/ip-services/${resource.id}`}
              key={resource.id} 
              className={`group relative bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col h-full ${resource.sponsored ? 'md:col-span-2 bg-gradient-to-br from-white to-sky-50 dark:from-slate-900 dark:to-sky-950/30 border-sky-200 dark:border-sky-800' : ''}`}
            >
              {/* Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl ${resource.sponsored ? 'bg-white shadow-lg shadow-sky-500/30 w-16 h-16 flex items-center justify-center' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-sky-100 dark:group-hover:bg-sky-900/50 group-hover:text-sky-600 dark:group-hover:text-sky-400'} transition-colors duration-300`}>
                    {resource.logo ? (
                      <img src={resource.logo} alt={resource.title} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Building size={24} />
                    )}
                  </div>
                  {resource.sponsored && (
                    <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">Sponsored</span>
                  )}
                </div>
                
                <h3 className={`font-black text-slate-900 dark:text-white leading-tight mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors ${resource.sponsored ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                  {resource.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <Briefcase size={14} className="text-sky-500" /> {resource.type}
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm md:text-base leading-relaxed line-clamp-3">
                  {resource.description}
                </p>
                
                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{resource.location}</span>
                  </div>
                  <button className="h-10 px-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shadow-sm gap-2">
                    View Profile <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </Link>
          ))}

          {filteredResources.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-white/5">
                <Search size={32} className="text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No services found</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
