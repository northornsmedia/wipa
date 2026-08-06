'use client';

import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Search, Download, FileText, Video, Headphones, Bookmark, Plus } from 'lucide-react';
import Link from 'next/link';

const BASE_MOCK_RESOURCES = [
  {
    id: 1,
    title: "Global Trademark Registration Guide 2026",
    type: "PDF Guide",
    icon: FileText,
    color: "#5a32fa",
    author: "WIPA Policy Committee",
    date: "July 2026",
    downloads: 1245,
    description: "A comprehensive 50-page guide covering international trademark filing strategies and Madrid Protocol updates.",
    isSaved: true
  },
  {
    id: 2,
    title: "Masterclass: AI and Intellectual Property",
    type: "Webinar Recording",
    icon: Video,
    color: "#ff4b4b",
    author: "Dr. Sarah Jenkins",
    date: "June 2026",
    downloads: 830,
    description: "Watch the recording of our most popular webinar discussing AI-generated content and copyright.",
    isSaved: false
  },
  {
    id: 3,
    title: "WIPA Podcast: Interview with USPTO Director",
    type: "Audio",
    icon: Headphones,
    color: "#00d26a",
    author: "WIPA Media",
    date: "May 2026",
    downloads: 3200,
    description: "An exclusive 45-minute interview discussing the future of patent examination.",
    isSaved: true
  },
  {
    id: 4,
    title: "Sample IP Licensing Agreement",
    type: "Document Template",
    icon: FileText,
    color: "#ffc900",
    author: "David Chen",
    date: "April 2026",
    downloads: 410,
    description: "A standard, customizable template for software and technology licensing agreements.",
    isSaved: false
  },
  {
    id: 5,
    title: "Q1 2026 IP Litigation Trends Report",
    type: "Research Paper",
    icon: BookOpen,
    color: "#ff90e8",
    author: "WIPA Research Team",
    date: "March 2026",
    downloads: 950,
    description: "Statistical analysis of patent and trademark litigation outcomes in major jurisdictions.",
    isSaved: false
  }
];

const MOCK_RESOURCES = [
  ...BASE_MOCK_RESOURCES,
  ...Array.from({ length: 24 }).map((_, i) => ({
    ...BASE_MOCK_RESOURCES[i % 5],
    id: i + 6,
    title: `${BASE_MOCK_RESOURCES[i % 5].title} (Vol. ${Math.floor(i / 5) + 2})`
  }))
];

export default function ResourcesPage() {
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>('All');

  const toggleSave = (id: number) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, isSaved: !r.isSaved } : r
    ));
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'Saved') {
      matchesTab = r.isSaved;
    } else if (activeTab !== 'All') {
      matchesTab = r.type === activeTab;
    }

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-[#131313] via-[#5a32fa] to-[#ff90e8] tracking-tight">
              <div className="bg-[#5a32fa]/10 p-2.5 rounded-2xl flex items-center justify-center shrink-0">
                <BookOpen size={32} className="text-[#5a32fa]" />
              </div>
              Resource Library
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-3 text-lg">Access exclusive guides, templates, webinars, and reports.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="group relative flex items-center gap-2 bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] text-white px-7 py-3.5 rounded-2xl font-bold shadow-lg shadow-[#5a32fa]/25 hover:shadow-xl hover:shadow-[#5a32fa]/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-white dark:bg-[#0f172a]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Plus size={20} strokeWidth={3} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10">Upload Resource</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col xl:flex-row gap-5 mb-10 items-center">
          <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 no-scrollbar w-full xl:w-auto p-1">
            {['All', 'Saved', 'PDF Guide', 'Audio', 'Document Template', 'Webinar Recording', 'Research Paper'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#0f172a] text-[#5a32fa] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-white/10/50 scale-105'
                    : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#0f172a]/60 hover:text-gray-800 dark:text-gray-100 hover:shadow-sm border border-transparent'
                }`}
              >
                {tab === 'Saved' && <Bookmark size={16} className={activeTab === tab ? "fill-[#5a32fa] text-[#5a32fa]" : ""} />}
                {tab}
              </button>
            ))}
          </div>

          <div className="relative flex-1 w-full max-w-md ml-auto group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative flex items-center bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
              <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0 group-focus-within:text-[#5a32fa] transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-3.5 pl-3 pr-4 font-medium text-gray-800 dark:text-gray-100 focus:outline-none placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Horizontal Ad Banner */}
        <a href="https://advitamip.com/" target="_blank" rel="noopener noreferrer" className="block w-full h-24 md:h-32 rounded-3xl overflow-hidden mb-10 shadow-md relative group border border-gray-100 dark:border-white/10">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#5a32fa]/80 to-[#b892ff]/80 flex items-center justify-center text-white font-black text-2xl tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">AD SPACE</div>
          <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-wider shadow-sm">
            Sponsored
          </div>
        </a>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <React.Fragment key={resource.id}>
                <div 
                  className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-gray-200 dark:border-white/20 p-6 shadow-sm flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5a32fa]/10 transition-all duration-300 group"
                >
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white border border-gray-200 dark:border-white/20 shadow-sm"
                    style={{ backgroundColor: resource.color }}
                  >
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  
                  <button 
                    onClick={() => toggleSave(resource.id)}
                    className="p-2 text-gray-400 hover:text-[#5a32fa] transition-colors"
                  >
                    <Bookmark size={24} strokeWidth={2.5} className={resource.isSaved ? "fill-[#5a32fa] text-[#5a32fa]" : ""} />
                  </button>
                </div>

                <div className="bg-[#fbe8d5] text-[#131313] text-xs font-bold px-3 py-1 rounded-lg border border-gray-200 dark:border-white/20 w-fit mb-3">
                  {resource.type}
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-6 flex-1">{resource.description}</p>
                
                <div className="flex items-center justify-between mt-auto border-t-2 border-gray-100 dark:border-white/10 pt-4">
                  <div className="flex flex-col text-xs font-bold text-gray-500 dark:text-gray-400">
                    <span>{resource.author}</span>
                    <span>{resource.date}</span>
                  </div>
                  
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#5a32fa] text-white rounded-xl border border-gray-200 dark:border-white/20 font-bold text-sm hover:opacity-90 hover:border-[#5a32fa] transition-colors shadow-[2px_2px_0px_0px_#131313]">
                    <Download size={16} />
                    Download
                  </button>
                </div>
                </div>

                {(index % 5) === 3 && (
                  <div className="w-full bg-white dark:bg-[#0f172a] rounded-[2rem] overflow-hidden shadow-sm border border-gray-200 dark:border-white/20 relative group min-h-[300px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#5a32fa]/80 to-[#b892ff]/80 flex items-center justify-center text-white font-black text-xl tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">AD SPACE</div>
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {filteredResources.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-[#0f172a] rounded-[2rem] border border-gray-200 dark:border-white/20 border-dashed">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">No resources found</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Try adjusting your search filters to find what you're looking for.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
