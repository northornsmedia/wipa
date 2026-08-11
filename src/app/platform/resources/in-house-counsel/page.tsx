'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Building, ChevronRight, FileText, Download, Users, Video, Book, Briefcase, ChevronDown, FolderOpen, MoreHorizontal } from 'lucide-react';
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

export default function InHouseCounselHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);

  const filteredResources = MOCK_INHOUSE_RESOURCES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 font-sans selection:bg-[#2563eb]/30 flex flex-col md:flex-row h-screen overflow-hidden">
      
      {/* Enterprise Sidebar (Dashboard Style) */}
      <aside className="w-full md:w-72 bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-white/10 flex flex-col shrink-0 h-auto md:h-screen sticky top-0 z-20">
        
        <div className="p-6 border-b border-gray-200 dark:border-white/10">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2563eb]/10 dark:bg-[#2563eb]/20 flex items-center justify-center text-[#2563eb] border border-[#2563eb]/20">
              <Building size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">In-House Counsel</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Enterprise Knowledge Base</p>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 px-3">Directories</div>
          <nav className="flex flex-col gap-1">
            {MOCK_INHOUSE_SUBCATEGORIES.map(sub => {
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSub(sub.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeSub === sub.id
                      ? 'bg-[#2563eb] text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon size={18} className={activeSub === sub.id ? 'text-white' : 'text-gray-400 dark:text-gray-500'} />
                  {sub.name}
                  {activeSub === sub.id && <ChevronRight size={16} className="ml-auto opacity-50" />}
                </button>
              )
            })}
          </nav>

          <div className="mt-8 border-t border-gray-100 dark:border-white/5 pt-6 px-3">
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Quick Stats</div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                 <div className="text-2xl font-bold text-gray-900 dark:text-white">142</div>
                 <div className="text-xs text-gray-500 font-medium">Resources</div>
               </div>
               <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                 <div className="text-2xl font-bold text-[#2563eb]">12</div>
                 <div className="text-xs text-gray-500 font-medium">New this week</div>
               </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navbar / Search */}
        <header className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 h-16 shrink-0 flex items-center justify-between px-6 z-10 shadow-sm dark:shadow-none">
          <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:flex">
            <span>Corporate IP</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900 dark:text-white font-bold">{MOCK_INHOUSE_SUBCATEGORIES.find(s => s.id === activeSub)?.name}</span>
          </div>

          <div className="flex-1 max-w-lg ml-auto relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400 group-focus-within:text-[#2563eb] transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search database..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-[#0f172a] border border-transparent focus:border-[#2563eb] focus:bg-white dark:focus:bg-[#1e293b] rounded-md py-1.5 pl-9 pr-4 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500 outline-none transition-all shadow-inner dark:shadow-none"
            />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-gray-50 dark:bg-[#0f172a]">
          
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Document Database</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Access and download templates, guides, and corporate insights.</p>
              </div>
              
              {/* Filter Dropdown */}
              <div className="relative hidden sm:block">
                <button 
                  onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
                  className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 rounded-md px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 transition-all shadow-sm"
                >
                  Filter: {typeFilter}
                  <ChevronDown size={14} className={isTypeMenuOpen ? 'rotate-180' : ''} />
                </button>
                
                {isTypeMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-56 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-md shadow-xl overflow-hidden z-20 max-h-64 overflow-y-auto py-1">
                    {CONTENT_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setTypeFilter(type);
                          setIsTypeMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                          typeFilter === type 
                            ? 'text-[#2563eb] bg-[#2563eb]/5' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enterprise Data Table View */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
              
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="col-span-12 md:col-span-6 lg:col-span-5">Name</div>
                <div className="col-span-3 hidden lg:block">Type</div>
                <div className="col-span-3 hidden md:block">Organization</div>
                <div className="col-span-1 hidden lg:block text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredResources.map(resource => (
                  <div key={resource.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-blue-50/50 dark:hover:bg-white/5 transition-colors group">
                    
                    {/* Name & Icon */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-5 flex items-start gap-4 min-w-0">
                      <div className={`mt-0.5 shrink-0 ${resource.type === 'Corporate IP Playbook' ? 'text-[#2563eb]' : 'text-gray-400'}`}>
                        {resource.type === 'Video' || resource.type === 'Webinar' || resource.type === 'GC Roundtable' ? (
                           <Video size={18} />
                        ) : resource.type === 'Ask an In-House Counsel' ? (
                           <Users size={18} />
                        ) : (
                           <FileText size={18} />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <Link href={`/platform/resources/in-house-counsel/${resource.id}`} className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#2563eb] dark:hover:text-[#2563eb] truncate transition-colors">
                          {resource.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                           {resource.featured && <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">Featured</span>}
                           <span>{resource.topic}</span>
                           <span className="opacity-50">•</span>
                           <span>{resource.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div className="col-span-3 hidden lg:flex items-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/5 truncate">
                        {resource.type}
                      </span>
                    </div>

                    {/* Organization */}
                    <div className="col-span-3 hidden md:flex flex-col">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{resource.organisation}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500 truncate">{resource.contributor}</span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 hidden lg:flex items-center justify-end gap-2">
                       <span className="text-xs text-gray-400 mr-2">{resource.size}</span>
                       <button className="text-gray-400 hover:text-[#2563eb] p-1 rounded transition-colors opacity-0 group-hover:opacity-100">
                         <Download size={16} />
                       </button>
                       <button className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded transition-colors opacity-0 group-hover:opacity-100">
                         <MoreHorizontal size={16} />
                       </button>
                    </div>

                  </div>
                ))}

                {filteredResources.length === 0 && (
                  <div className="px-6 py-16 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">No documents found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
