'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, MonitorPlay, Calendar, PlayCircle, Mic, ChevronDown, Star, Activity, Coffee, Users, Video } from 'lucide-react';
import Link from 'next/link';

const MOCK_WEBINAR_SUBCATEGORIES = [
  { id: 'all', name: 'All Webinars' },
  { id: 'ai-ip', name: 'AI in IP' },
  { id: 'litigation', name: 'IP Litigation' },
  { id: 'patent-law', name: 'Patent Law' },
  { id: 'ip-strategy', name: 'IP Strategy' }
];

const CONTENT_TYPES = [
  "All Types",
  "Upcoming Webinar",
  "Webinar Recording",
  "Masterclass",
  "Panel Discussion",
  "Workshop",
  "Video Session",
  "Presentation",
  "Audio Session"
];

const MOCK_WEBINAR_RESOURCES = [
  {
    id: 1,
    title: "AI in Patent Law: Opportunities and Risks",
    type: "Upcoming Webinar",
    topic: "AI in IP",
    subcategory: "ai-ip",
    expert: "Dr. Alan Turing, Esq.",
    time: "Oct 24 • 10:00 AM EST",
    featured: true,
    image: "/resourceimg1.jpg"
  },
  {
    id: 2,
    title: "Mastering IP Litigation Tactics",
    type: "Masterclass",
    topic: "IP Litigation",
    subcategory: "litigation",
    expert: "Sarah Jenkins & Co.",
    time: "3 hours watch",
    featured: true,
    image: "/resourceimg2.jpg"
  },
  {
    id: 3,
    title: "The Future of Trademarks in the Metaverse",
    type: "Panel Discussion",
    topic: "IP Strategy",
    subcategory: "ip-strategy",
    expert: "Tech IP Group",
    time: "1.5 hours watch",
    featured: false,
    image: "/resource3.jpg"
  },
  {
    id: 4,
    title: "Drafting Software Patents",
    type: "Workshop",
    topic: "Patent Law",
    subcategory: "patent-law",
    expert: "Robert Smith Esq.",
    time: "Nov 5 • 1:00 PM EST",
    featured: false,
    image: "/resourceimg1.jpg"
  },
  {
    id: 5,
    title: "State of Global IP 2025",
    type: "Webinar Recording",
    topic: "IP Strategy",
    subcategory: "ip-strategy",
    expert: "Global IP Forum",
    time: "45 min watch",
    featured: false,
    image: "/resourceimg2.jpg"
  },
  {
    id: 6,
    title: "Tech Giants and Standard Essential Patents",
    type: "Audio Session",
    topic: "IP Litigation",
    subcategory: "litigation",
    expert: "IP Podcast Series",
    time: "35 min listen",
    featured: false,
    image: "/resource3.jpg"
  }
];

export default function WebinarsHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredResources = MOCK_WEBINAR_RESOURCES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col pb-20">
      
      {/* Hero Header */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 pt-8 pb-12">
        <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
          <Link href="/platform/resources" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#ff90e8] font-bold text-sm mb-6 transition-colors">
            <ArrowLeft size={16} />
            Back to Resource Library
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#ff90e8] flex items-center justify-center text-gray-900 shadow-lg shadow-[#ff90e8]/20">
              <MonitorPlay size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100">Webinars & Learning</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mt-1">Interactive sessions, recordings, and expert panels.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col xl:flex-row gap-4 items-center mb-10 sticky top-4 z-10">
          
          {/* Subcategory Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 no-scrollbar w-full xl:w-auto">
            {MOCK_WEBINAR_SUBCATEGORIES.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  activeSub === sub.id
                    ? 'bg-[#ff90e8] text-gray-900 shadow-md'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          <div className="flex flex-1 w-full gap-4 xl:ml-auto">
            {/* Search */}
            <div className="relative flex-1 group">
              <div className="absolute -inset-0.5 bg-[#ff90e8] rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative flex items-center bg-gray-50 dark:bg-[#0f172a] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0 group-focus-within:text-[#ff90e8] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search webinars..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-2.5 pl-3 pr-4 font-medium text-gray-800 dark:text-gray-100 focus:outline-none placeholder-gray-400"
                />
              </div>
            </div>
            
            {/* Custom Type Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-gray-50 dark:bg-[#0f172a] border border-[#ff90e8] rounded-xl px-4 py-2.5 font-bold text-gray-800 dark:text-gray-100 flex items-center justify-between gap-3 min-w-[200px]"
              >
                {typeFilter}
                <ChevronDown size={18} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-20 max-h-[300px] overflow-y-auto">
                  {CONTENT_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setTypeFilter(type);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 font-medium transition-colors border-l-4 ${
                        typeFilter === type 
                          ? 'border-[#ff90e8] bg-[#ff90e8]/10 text-gray-900 dark:text-gray-100 font-bold' 
                          : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Cards (Top) */}
        {featuredResources.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Star className="text-[#ff90e8] fill-[#ff90e8]" /> Featured Sessions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredResources.map(resource => (
                <Link key={resource.id} href={`/platform/resources/webinars/${resource.id}`} className="group bg-white dark:bg-[#1e293b] rounded-[2rem] border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-[#ff90e8]/10 transition-all duration-300">
                  <div className="h-48 w-full relative">
                    <img src={resource.image} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="bg-[#ff90e8] text-gray-900 text-[10px] font-black uppercase px-2 py-1 rounded-md">{resource.type}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-[#ff90e8] transition-colors">{resource.title}</h3>
                    <div className="flex items-center justify-between mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5"><Users size={14} className="text-[#ff90e8]" /> {resource.expert}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#ff90e8]" /> {resource.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Resource Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Activity className="text-[#ff90e8]" /> All Sessions & Recordings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularResources.map(resource => (
              <Link key={resource.id} href={`/platform/resources/webinars/${resource.id}`} className="group bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase text-gray-900 dark:text-gray-100 bg-[#ff90e8] px-2 py-1 rounded-md">{resource.type}</span>
                    <span className="text-[10px] font-medium text-gray-400">{resource.time}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-[#ff90e8] transition-colors">{resource.title}</h3>
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5"><Video size={14} /> {resource.topic}</span>
                    <span className="text-[#ff90e8] text-sm font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">&rarr;</span>
                  </div>
                </div>
              </Link>
            ))}

            {regularResources.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 border-dashed">
                <Coffee size={40} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">No resources found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
