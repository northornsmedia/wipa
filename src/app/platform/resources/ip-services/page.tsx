'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Building, Briefcase, FileCheck, ChevronDown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const MOCK_SUBCATEGORIES = [
  { id: 'all', name: 'All Services' },
  { id: 'trademark', name: 'Trademarks' },
  { id: 'patent', name: 'Patents' },
  { id: 'copyright', name: 'Copyrights' },
  { id: 'consulting', name: 'Consulting' }
];

const CONTENT_TYPES = [
  "All Types",
  "Service",
  "Consulting",
  "Audit",
  "Filing",
  "Strategy"
];

const MOCK_SERVICES = [
  {
    id: 1,
    title: "Global Trademark Registration & Management",
    type: "Service",
    topic: "Trademarks",
    subcategory: "trademark",
    expert: "WIPA Legal Team",
    time: "Available",
    featured: true,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Comprehensive Patent Drafting and Filing",
    type: "Filing",
    topic: "Patents",
    subcategory: "patent",
    expert: "WIPA Engineering & Legal",
    time: "Available",
    featured: true,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "IP Portfolio Audit & Strategy Review",
    type: "Audit",
    topic: "Consulting",
    subcategory: "consulting",
    expert: "Senior IP Strategists",
    time: "Consultation",
    featured: false,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Copyright Protection for Digital Assets",
    type: "Service",
    topic: "Copyrights",
    subcategory: "copyright",
    expert: "WIPA Digital Rights Team",
    time: "Available",
    featured: false,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2112&auto=format&fit=crop"
  }
];

export default function IPServicesPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredResources = MOCK_SERVICES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    return matchesSearch && matchesSub && matchesType;
  });

  const mainFeatures = filteredResources.filter(r => r.featured);
  const otherResources = filteredResources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-white font-sans selection:bg-[#1dd1a1]/30 flex flex-col pb-24">
      
      {/* Header Area */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#121212] dark:to-[#18181b] border-b border-gray-200 dark:border-white/5 pt-8 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1dd1a1]/5 blur-[100px] rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10">
          <Link href="/platform/resources" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#1dd1a1] font-bold text-sm mb-8 transition-colors">
            <ArrowLeft size={16} />
            Back to Resource Library
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1dd1a1]/10 flex items-center justify-center">
                  <Building size={20} className="text-[#1dd1a1]" />
                </div>
                <span className="text-[#1dd1a1] font-black tracking-widest uppercase text-sm">Services & Consulting</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                Expert IP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1dd1a1] to-[#0abde3]">Services</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                Explore our specialized IP services, consulting, and management solutions tailored for your business needs.
              </p>
            </div>
            
            <div className="w-full md:w-auto flex-shrink-0">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-[#1dd1a1] transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search services..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-80 bg-white dark:bg-[#1e1e20] border border-gray-200 dark:border-white/10 focus:border-[#1dd1a1] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 outline-none transition-all shadow-sm focus:shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 pt-12">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {MOCK_SUBCATEGORIES.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap border ${
                  activeSub === sub.id
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black dark:border-white shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-transparent dark:text-gray-400 dark:border-white/10 dark:hover:bg-white/5'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full md:w-auto bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-full px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 flex items-center justify-between md:justify-start gap-3 transition-all"
            >
              {typeFilter}
              <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-full md:w-48 bg-white dark:bg-[#1e1e20] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-20">
                {CONTENT_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setTypeFilter(type);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors ${
                      typeFilter === type 
                        ? 'text-[#1dd1a1] bg-gray-50 dark:bg-white/5' 
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

        {/* Featured Services (Top Grid) */}
        {mainFeatures.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <CheckCircle2 className="text-[#1dd1a1]" size={24} /> Recommended Services
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mainFeatures.map((resource) => (
                <Link href={`/platform/resources/ip-services/${resource.id}`} key={resource.id} className="group flex flex-col md:flex-row bg-white dark:bg-[#18181b] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto relative overflow-hidden">
                    <img src={resource.image} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                    <div className="absolute top-4 left-4 md:hidden">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="hidden md:flex items-center gap-3 mb-4">
                        <span className="bg-[#1dd1a1]/10 text-[#1dd1a1] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                          {resource.type}
                        </span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{resource.topic}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-[#1dd1a1] transition-colors">{resource.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-6 flex items-center gap-2">
                        <Briefcase size={16} /> By {resource.expert}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-5 mt-auto">
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{resource.time}</span>
                      <span className="text-sm font-bold text-[#1dd1a1] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore <span className="text-lg leading-none">&rarr;</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Regular Services Grid */}
        {otherResources.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <FileCheck className="text-[#1dd1a1]" size={24} /> All Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherResources.map((resource) => (
                <Link href={`/platform/resources/ip-services/${resource.id}`} key={resource.id} className="group bg-white dark:bg-[#18181b] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="w-full aspect-video relative overflow-hidden">
                    <img src={resource.image} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-bold text-[#1dd1a1] uppercase tracking-wider mb-2 block">{resource.topic}</span>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-[#1dd1a1] transition-colors">{resource.title}</h3>
                    
                    <div className="mt-auto pt-5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <p className="text-gray-500 dark:text-gray-400 font-medium text-xs flex items-center gap-1.5 truncate pr-4">
                        <Briefcase size={14} className="shrink-0" /> <span className="truncate">{resource.expert}</span>
                      </p>
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 shrink-0">{resource.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {filteredResources.length === 0 && (
          <div className="py-24 text-center bg-white dark:bg-[#18181b] rounded-3xl border border-gray-200 dark:border-white/5 border-dashed mb-12">
            <Building size={48} className="mx-auto text-gray-300 dark:text-white/10 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No services found</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Try adjusting your search criteria or changing categories.</p>
          </div>
        )}

      </div>
    </div>
  );
}
