'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Command, ChevronRight, FileCode, CheckSquare, DownloadCloud, Box, LayoutTemplate, Zap, Folder, ChevronDown } from 'lucide-react';
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

const MOCK_GUIDES_RESOURCES = [
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

export default function GuidesToolkitsHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile

  const filteredResources = MOCK_GUIDES_RESOURCES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-teal-500/30">
      
      {/* App Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">

            <div className="h-6 w-px bg-gray-200 dark:bg-white/10"></div>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20 shrink-0">
                 <Command size={16} />
               </div>
               <div>
                 <h1 className="text-base md:text-lg font-bold leading-none mb-1">Guides & Toolkits</h1>
                 <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-none hidden sm:block">Resource Directory</p>
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
              className="w-full bg-gray-100 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-[#111] focus:border-teal-500 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium transition-all outline-none shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
               <span className="text-[10px] font-bold text-gray-400 bg-gray-200 dark:bg-white/10 px-2 py-1 rounded-md border border-gray-300 dark:border-white/5">⌘K</span>
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

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 pt-6 md:pt-10 pb-24 flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start relative">
        
        {/* Notion-style Sidebar */}
        <div className={`w-full lg:w-64 shrink-0 lg:sticky lg:top-32 flex flex-col ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
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
           
           {/* Featured "Hero Widgets" */}
           {featuredResources.length > 0 && (
             <div className="mb-12 md:mb-16">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                 {featuredResources.map(resource => (
                   <Link key={resource.id} href={`/platform/resources/guides-toolkits/${resource.id}`} className="group relative rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] overflow-hidden hover:border-teal-500 dark:hover:border-teal-500 transition-colors shadow-sm hover:shadow-xl hover:shadow-teal-500/10 flex flex-col">
                     <div className="h-40 md:h-48 w-full relative overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
                       <img src={resource.image} alt={resource.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                       <div className="absolute bottom-4 left-5 flex items-center gap-2">
                         <div className="w-8 h-8 rounded-md bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <Zap size={16} />
                         </div>
                         <span className="text-white text-xs font-bold tracking-wide">{resource.type}</span>
                       </div>
                     </div>
                     <div className="p-5 flex flex-col flex-1">
                       <h3 className="text-lg md:text-xl font-bold leading-snug mb-3 group-hover:text-teal-500 transition-colors line-clamp-2">{resource.title}</h3>
                       <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                         <span className="flex items-center gap-1.5"><Box size={14}/> {resource.author}</span>
                         <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 font-mono text-[10px] uppercase">{resource.time}</span>
                       </div>
                     </div>
                   </Link>
                 ))}
               </div>
             </div>
           )}

           {/* Grid "App" Directory */}
           <div>
             <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3 border-b border-gray-200 dark:border-white/10 pb-4">
               Directory Items
               <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-md font-mono border border-gray-200 dark:border-white/5">{regularResources.length}</span>
             </h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
               {regularResources.map(resource => (
                 <Link key={resource.id} href={`/platform/resources/guides-toolkits/${resource.id}`} className="group bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-white/10 p-5 hover:border-teal-500 transition-all hover:shadow-md flex flex-col relative overflow-hidden">
                   
                   <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 rounded-bl-[100%] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                   
                   <div className="flex items-start justify-between mb-4">
                     <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center text-gray-500 group-hover:text-teal-500 group-hover:bg-teal-50 dark:group-hover:bg-teal-500/10 transition-colors">
                       {resource.type === 'Template' ? <LayoutTemplate size={20} /> : resource.type === 'Checklist' ? <CheckSquare size={20} /> : <FileCode size={20} />}
                     </div>
                     <span className="text-[10px] font-mono uppercase bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 px-2 py-1 rounded border border-gray-200 dark:border-white/5">{resource.time}</span>
                   </div>
                   
                   <h3 className="text-sm md:text-base font-bold leading-snug mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{resource.title}</h3>
                   
                   <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                     <span>{resource.author}</span>
                     <DownloadCloud size={14} className="opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-teal-500 transition-all" />
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
