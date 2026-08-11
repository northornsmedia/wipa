'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, TrendingUp, ChevronDown, Star, Activity, Coffee, Users, Video, Mic, FileText, Briefcase, PlayCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

const MOCK_CAREER_SUBCATEGORIES = [
  { id: 'all', name: 'All Resources' },
  { id: 'leadership', name: 'Leadership' },
  { id: 'career-growth', name: 'Career Growth' },
  { id: 'mentorship', name: 'Mentorship' },
  { id: 'toolkits', name: 'Toolkits & Guides' }
];

const CONTENT_TYPES = [
  "All Types",
  "Leadership Article",
  "Career Guide",
  "Mentoring Resource",
  "Webinar",
  "Video",
  "Podcast",
  "Toolkit",
  "Checklist",
  "Interview",
  "Leadership Profile"
];

const MOCK_CAREER_RESOURCES = [
  {
    id: 1,
    title: "Transitioning from Senior Counsel to Partner",
    type: "Career Guide",
    topic: "Career Growth",
    subcategory: "career-growth",
    expert: "David Chen, Managing Partner",
    time: "15 min read",
    featured: true,
    image: "/resourceimg1.jpg"
  },
  {
    id: 2,
    title: "Building Resilience in High-Stakes Litigation",
    type: "Webinar",
    topic: "Leadership",
    subcategory: "leadership",
    expert: "Sarah Jenkins",
    time: "45 min watch",
    featured: true,
    image: "/resourceimg2.jpg"
  },
  {
    id: 3,
    title: "The First 90 Days as Head of IP",
    type: "Toolkit",
    topic: "Career Growth",
    subcategory: "toolkits",
    expert: "Corporate Practice Team",
    time: "5 Templates + Guide",
    featured: false,
    image: "/resource3.jpg"
  },
  {
    id: 4,
    title: "How to Find (and Keep) a Legal Mentor",
    type: "Mentoring Resource",
    topic: "Mentorship",
    subcategory: "mentorship",
    expert: "WIPA Mentorship Committee",
    time: "10 min read",
    featured: false,
    image: "/resourceimg1.jpg"
  },
  {
    id: 5,
    title: "Leadership Profile: Eleanor Vance",
    type: "Leadership Profile",
    topic: "Leadership",
    subcategory: "leadership",
    expert: "IP World Magazine",
    time: "12 min read",
    featured: false,
    image: "/resourceimg2.jpg"
  },
  {
    id: 6,
    title: "Navigating Firm Politics",
    type: "Podcast",
    topic: "Career Growth",
    subcategory: "career-growth",
    expert: "The Legal Edge Podcast",
    time: "30 min listen",
    featured: false,
    image: "/resource3.jpg"
  }
];

export default function CareerLeadershipHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const filteredResources = MOCK_CAREER_RESOURCES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white font-sans selection:bg-purple-500/30 overflow-x-hidden transition-colors duration-300">
      
      {/* Cinematic Hero Header */}
      <div className="relative min-h-[350px] md:min-h-[400px] w-full flex flex-col justify-center pb-12 pt-8 border-b border-gray-200 dark:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-gray-100 dark:from-[#1a0b2e] dark:via-[#0a0514] dark:to-black z-0 transition-colors duration-300"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 relative z-10 flex flex-col items-center justify-center h-full">

           
           <div className="mt-8 max-w-5xl mx-auto text-center flex flex-col items-center">
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-purple-700 to-purple-500 dark:from-white dark:via-purple-100 dark:to-purple-400 whitespace-nowrap overflow-hidden text-ellipsis">
               Career & Leadership
             </h1>
             <p className="text-lg md:text-xl lg:text-2xl font-medium text-gray-600 dark:text-white/60 max-w-2xl leading-relaxed whitespace-normal mx-auto">
               Masterclasses, coaching, and in-depth guides to accelerate your trajectory in the legal industry.
             </p>
             
             {/* Search & Dropdown */}
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl mt-10">
               <div className="relative group w-full">
                 <div className="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                 <div className="relative flex items-center bg-white/60 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-full overflow-hidden backdrop-blur-md shadow-xl shadow-purple-500/5 dark:shadow-none transition-all">
                   <Search size={16} className="text-gray-400 dark:text-white/40 ml-4 shrink-0" />
                   <input 
                     type="text" 
                     placeholder="Search masterclasses..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-transparent py-3.5 pl-3 pr-4 text-sm font-bold text-gray-900 dark:text-white focus:outline-none placeholder-gray-500 dark:placeholder-white/50"
                   />
                 </div>
               </div>
               
               <div className="relative w-full sm:w-48 shrink-0">
                  <select 
                     value={typeFilter}
                     onChange={(e) => setTypeFilter(e.target.value)}
                     className="appearance-none w-full bg-white/60 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-full px-6 py-3.5 pr-12 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer backdrop-blur-md shadow-xl shadow-purple-500/5 dark:shadow-none transition-all"
                   >
                     {CONTENT_TYPES.map(type => (
                       <option key={type} value={type} className="dark:bg-gray-900">{type}</option>
                     ))}
                   </select>
                   <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 pointer-events-none" />
               </div>
             </div>

           </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 py-12 relative z-10">
        
        {/* Navigation & Filters */}
        <div className="mb-16">
           {/* Huge Category Text (Full Width) */}
           <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-4 md:gap-x-10 w-full">
             {MOCK_CAREER_SUBCATEGORIES.map(sub => (
               <button
                 key={sub.id}
                 onClick={() => setActiveSub(sub.id)}
                 className={`text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter transition-all duration-500 ${
                   activeSub === sub.id 
                     ? 'text-gray-900 dark:text-white' 
                     : 'text-gray-400 dark:text-white/20 hover:text-gray-600 dark:hover:text-white/60'
                 }`}
               >
                 {sub.name}
               </button>
             ))}
           </div>
        </div>

        {/* Masterclass Feature */}
        {featuredResources.length > 0 && (
          <div className="mb-20 md:mb-24">
             <div className="relative h-[400px] md:h-[600px] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden group border border-gray-200 dark:border-white/10 shadow-2xl shadow-purple-900/5 dark:shadow-purple-900/20">
               <img src={featuredResources[0].image} alt={featuredResources[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
               <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay"></div>
               
               <div className="absolute inset-0 p-6 md:p-12 lg:p-16 flex flex-col justify-end text-white">
                 <div className="max-w-3xl">
                   <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                     <span className="bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-purple-500/30">{featuredResources[0].type}</span>
                     <span className="text-white/80 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"><Activity size={14}/> {featuredResources[0].time}</span>
                   </div>
                   <h2 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6 drop-shadow-lg">{featuredResources[0].title}</h2>
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                       <Briefcase size={20} className="text-purple-400" />
                     </div>
                     <div>
                       <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-0.5">Instructor / Expert</div>
                       <div className="text-base md:text-lg font-bold">{featuredResources[0].expert}</div>
                     </div>
                   </div>
                 </div>
                 
                 {/* Play Button Overlay */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 cursor-pointer shadow-[0_0_50px_rgba(168,85,247,0.5)] hidden sm:flex">
                   <PlayCircle size={40} className="ml-2" />
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* Resource Grid (Bento/Staggered vibe) */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {regularResources.map((resource, i) => (
              <Link key={resource.id} href={`/platform/resources/career-leadership/${resource.id}`} className={`group relative rounded-[2rem] overflow-hidden bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-500 flex flex-col ${i === 0 ? 'md:col-span-2 lg:col-span-2 md:flex-row' : ''}`}>
                
                {resource.image && (
                  <div className={`relative ${i === 0 ? 'w-full md:w-1/2 h-48 md:h-full' : 'w-full h-48'}`}>
                    <img src={resource.image} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 dark:opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 dark:from-black/80 to-transparent"></div>
                  </div>
                )}
                
                <div className={`p-6 md:p-8 flex flex-col flex-1 ${i === 0 ? 'w-full md:w-1/2 justify-center bg-purple-50/50 dark:bg-gradient-to-br dark:from-[#120822] dark:to-[#0a0514]' : ''}`}>
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 px-3 py-1 rounded-full">{resource.type}</span>
                  </div>
                  <h3 className={`${i === 0 ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'} font-black tracking-tight leading-tight mb-4 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors`}>{resource.title}</h3>
                  <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-gray-500 dark:text-white/40">
                    <span className="flex items-center gap-2">
                      {resource.type === 'Webinar' || resource.type === 'Video' ? <Video size={14} className="text-purple-500"/> : resource.type === 'Podcast' ? <Mic size={14} className="text-purple-500"/> : <FileText size={14} className="text-purple-500"/>} 
                      {resource.expert}
                    </span>
                    <span className="uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md text-gray-600 dark:text-white/50">{resource.time}</span>
                  </div>
                </div>
              </Link>
            ))}

            {regularResources.length === 0 && (
              <div className="col-span-full py-24 text-center border border-dashed border-gray-300 dark:border-white/10 rounded-[3rem] bg-gray-50 dark:bg-white/5">
                <Coffee size={40} className="mx-auto text-gray-400 dark:text-white/20 mb-6" />
                <h3 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">No masterclasses found</h3>
                <p className="text-gray-500 dark:text-white/40 font-medium">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
