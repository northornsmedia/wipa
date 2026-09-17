'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, TrendingUp, ChevronDown, Activity, Coffee, Users, Video, Mic, FileText, Briefcase, PlayCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

const MOCK_CAREER_SUBCATEGORIES = [
  { id: 'all', name: 'All Resources' },
  { id: 'leadership', name: 'Leadership' },
  { id: 'career-growth', name: 'Career Growth' },
  { id: 'mentorship', name: 'Mentorship' }
];

const CONTENT_TYPES = [
  "All Types",
  "Leadership Article",
  "Career Guide",
  "Mentoring Resource",
  "Webinar",
  "Video",
  "Podcast",
  "Executive Playbook",
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
    type: "Executive Playbook",
    topic: "Career Growth",
    subcategory: "career-growth",
    expert: "Corporate Practice Team",
    time: "Executive Playbook",
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

import { supabase } from '@/lib/supabase';

export default function CareerLeadershipHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [dbResources, setDbResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveCareer() {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('category', 'career-leadership')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            type: d.resource_type || "Leadership Guide",
            topic: d.tags?.[0] || "Career Growth",
            subcategory: d.subcategory || "leadership",
            expert: d.author_name ? `${d.author_name}${d.author_title ? ', ' + d.author_title : ''}` : "WIPA Leadership Council",
            time: d.read_time || "10 min read",
            featured: d.is_featured || false,
            image: d.cover_image_url || "/resourceimg2.jpg",
            is_splash_sponsored: d.is_splash_sponsored,
            splash_tagline: d.splash_tagline,
            splash_cta_text: d.splash_cta_text,
            splash_cta_url: d.splash_cta_url,
          }));
          setDbResources(mapped);
        } else {
          setDbResources(MOCK_CAREER_RESOURCES);
        }
      } catch (err) {
        setDbResources(MOCK_CAREER_RESOURCES);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveCareer();
  }, []);

  const resourcesList = dbResources.length > 0 ? dbResources : MOCK_CAREER_RESOURCES;

  const filteredResources = resourcesList.filter(r => {
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
      <div className="relative min-h-[380px] md:min-h-[440px] w-full flex flex-col justify-center pb-12 pt-8 border-b border-gray-200 dark:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-gray-100 dark:from-[#1a0b2e] dark:via-[#0a0514] dark:to-black z-0 transition-colors duration-300"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-[140px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 relative z-10 flex flex-col items-center justify-center h-full">
           <div className="mt-6 w-full text-center flex flex-col items-center">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-wider mb-6">
               <Sparkles size={13} /> Executive Legal Advancement
             </div>

             <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-purple-700 to-purple-500 dark:from-white dark:via-purple-100 dark:to-purple-400">
               Career & Leadership
             </h1>
             <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-600 dark:text-white/60 max-w-3xl leading-relaxed mx-auto">
               Masterclasses, executive coaching, and in-depth playbooks to accelerate your trajectory in the global IP ecosystem.
             </p>
             
             {/* Search & Dropdown */}
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl mt-10">
               <div className="relative group w-full">
                 <div className="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                 <div className="relative flex items-center bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-full overflow-hidden backdrop-blur-md shadow-xl shadow-purple-500/5 dark:shadow-none transition-all">
                   <Search size={16} className="text-gray-400 dark:text-white/40 ml-4 shrink-0" />
                   <input 
                     type="text" 
                     placeholder="Search masterclasses, guides, playbooks..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-transparent py-3.5 pl-3 pr-4 text-sm font-bold text-gray-900 dark:text-white focus:outline-none placeholder-gray-500 dark:placeholder-white/50"
                   />
                 </div>
               </div>
               
               <div className="relative w-full sm:w-56 shrink-0">
                  <select 
                     value={typeFilter}
                     onChange={(e) => setTypeFilter(e.target.value)}
                     className="appearance-none w-full bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-full px-6 py-3.5 pr-12 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer backdrop-blur-md shadow-xl shadow-purple-500/5 dark:shadow-none transition-all"
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

      {/* Unboxed Full Canvas */}
      <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 py-12 relative z-10">
        
        {/* Navigation & Filters: Strictly 1 Single Line, Unconstrained & Fluid */}
        <div className="mb-14 w-full flex items-center justify-center">
          <div className="w-full flex items-center justify-start sm:justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-20 overflow-x-auto no-scrollbar py-3 px-2 flex-nowrap whitespace-nowrap">
            {MOCK_CAREER_SUBCATEGORIES.map(sub => {
              const isActive = activeSub === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setActiveSub(sub.id)}
                  className={`relative py-3 px-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 group ${
                    isActive 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-400/80 dark:text-white/30 hover:text-gray-800 dark:hover:text-white/80'
                  }`}
                >
                  <span className="relative z-10">{sub.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5a32fa] via-purple-500 to-indigo-500 rounded-full shadow-lg shadow-purple-500/30"></span>
                  )}
                  {!isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-1 bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-white/20 rounded-full transition-all"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masterclass Feature: Full Fluid Panoramic Display */}
        {featuredResources.length > 0 && (
          <div className="mb-20 md:mb-24 w-full">
             <div className="relative h-[440px] md:h-[620px] lg:h-[700px] w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group border border-gray-200 dark:border-white/10 shadow-2xl shadow-purple-900/10 dark:shadow-purple-900/30">
               <img src={featuredResources[0].image} alt={featuredResources[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
               <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay"></div>
               
               <div className="absolute inset-0 p-8 md:p-14 lg:p-20 flex flex-col justify-end text-white">
                 <div className="max-w-4xl">
                   <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                     <span className="bg-gradient-to-r from-[#5a32fa] to-purple-600 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-purple-500/30">{featuredResources[0].type}</span>
                     <span className="text-white/90 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"><Activity size={14}/> {featuredResources[0].time}</span>
                   </div>
                   <h2 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.05] mb-6 drop-shadow-2xl">{featuredResources[0].title}</h2>
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                       <Briefcase size={22} className="text-purple-300" />
                     </div>
                     <div>
                       <div className="text-white/60 text-[11px] font-black uppercase tracking-widest mb-0.5">Instructor / Expert</div>
                       <div className="text-base md:text-lg font-bold">{featuredResources[0].expert}</div>
                     </div>
                   </div>
                 </div>
                 
                 {/* Play Button Overlay */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 cursor-pointer shadow-[0_0_60px_rgba(168,85,247,0.6)] hidden sm:flex">
                   <PlayCircle size={48} className="ml-2" />
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* Resource Grid: Fluid Dynamic Unboxed Grid */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
