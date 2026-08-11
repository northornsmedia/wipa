'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Headphones, Heart, Activity, Play, ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';

const MOCK_WELLNESS_SUBCATEGORIES = [
  { id: 'all', name: 'All Wellness' },
  { id: 'mental-health', name: 'Mental Health' },
  { id: 'work-life', name: 'Work-Life Balance' },
  { id: 'stress', name: 'Stress Management' },
  { id: 'physical', name: 'Physical Wellbeing' }
];

const CONTENT_TYPES = [
  "All Types",
  "Wellness Article",
  "Guide",
  "Video",
  "Podcast",
  "Toolkit",
  "Checklist",
  "Infographic",
  "Wellness Webinar"
];

const MOCK_WELLNESS_RESOURCES = [
  {
    id: 1,
    title: "Navigating Burnout: A Practical Guide for IP Professionals",
    type: "Wellness Webinar",
    topic: "Mental Health & Burnout",
    subcategory: "mental-health",
    expert: "Dr. Elena Rostova",
    time: "45 min watch",
    featured: true,
    image: "/resourceimg1.jpg"
  },
  {
    id: 2,
    title: "The 10-Minute Desk Yoga Routine",
    type: "Video",
    topic: "Physical Wellbeing",
    subcategory: "physical",
    expert: "Sarah Jenkins",
    time: "10 min watch",
    featured: true,
    image: "/resourceimg2.jpg"
  },
  {
    id: 3,
    title: "Setting Boundaries with Demanding Clients",
    type: "Guide",
    topic: "Work-Life Balance",
    subcategory: "work-life",
    expert: "Marcus Thorne",
    time: "15 min read",
    featured: false,
    image: "/resourceimg1.jpg"
  },
  {
    id: 4,
    title: "Mindfulness Meditation for Focus",
    type: "Podcast",
    topic: "Stress Management",
    subcategory: "stress",
    expert: "Dr. Alistair Reed",
    time: "12 min listen",
    featured: false,
    image: "/resourceimg2.jpg"
  },
  {
    id: 5,
    title: "Nutrition for High Performers",
    type: "Wellness Article",
    topic: "Physical Wellbeing",
    subcategory: "physical",
    expert: "Chloe Lin",
    time: "8 min read",
    featured: false,
    image: "/resourceimg1.jpg"
  },
  {
    id: 6,
    title: "Sleep Optimization Strategies",
    type: "Toolkit",
    topic: "Mental Health & Burnout",
    subcategory: "mental-health",
    expert: "Dr. James Foster",
    time: "PDF Download",
    featured: false,
    image: "/resourceimg2.jpg"
  },
  {
    id: 7,
    title: "Daily IP Operations Checklist",
    type: "Checklist",
    topic: "Work-Life Balance",
    subcategory: "work-life",
    expert: "Marcus Thorne",
    time: "PDF Download",
    featured: false,
    image: "/resourceimg1.jpg"
  },
  {
    id: 8,
    title: "Mental Health Statistics in Law",
    type: "Infographic",
    topic: "Mental Health & Burnout",
    subcategory: "mental-health",
    expert: "Dr. Elena Rostova",
    time: "3 min read",
    featured: false,
    image: "/resourceimg2.jpg"
  },
  {
    id: 9,
    title: "Managing Remote Teams Effectively",
    type: "Wellness Webinar",
    topic: "Stress Management",
    subcategory: "stress",
    expert: "Sarah Jenkins",
    time: "30 min watch",
    featured: false,
    image: "/resourceimg1.jpg"
  },
  {
    id: 10,
    title: "Ergonomics for Home Offices",
    type: "Guide",
    topic: "Physical Wellbeing",
    subcategory: "physical",
    expert: "Chloe Lin",
    time: "10 min read",
    featured: false,
    image: "/resourceimg2.jpg"
  }
];

export default function WellnessHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredResources = MOCK_WELLNESS_RESOURCES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-[#f4f8f7] dark:bg-[#0b1310] flex flex-col font-sans selection:bg-[#00d26a]/30">
      
      {/* Split Hero Layout */}
      <div className="w-full bg-[#e8f3ef] dark:bg-[#111e19] overflow-hidden rounded-b-[3rem]">
        <div className="max-w-[1400px] mx-auto p-6 md:p-12 lg:p-16">
          


          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 max-w-2xl z-10">
              <div className="inline-flex items-center gap-2 bg-[#00d26a]/10 text-[#00d26a] px-4 py-2 rounded-full font-bold text-sm mb-6">
                <Sparkles size={16} /> Prioritize Your Peace
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6">
                Find Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d26a] to-[#20c997]">Balance</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                Curated resources focused on mental health, work-life balance, and thriving as an IP professional. Take a moment for yourself.
              </p>
            </div>

            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00d26a]/20 to-transparent rounded-[3rem] blur-3xl transform -rotate-6"></div>
              <img src="/wellness-illustration.webp" alt="Wellness" className="relative z-10 w-full h-[400px] object-cover rounded-[3rem] shadow-2xl border-4 border-white/50 dark:border-white/10" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop'; }} />
              

            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-12 flex flex-col lg:flex-row gap-10">
        
        {/* Left Sidebar Filter */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="sticky top-8 bg-white dark:bg-[#151c19] rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="font-black text-gray-900 dark:text-white text-xl mb-6 flex items-center gap-2">
              <Filter className="text-[#00d26a]" size={20} /> Explore
            </h3>

            {/* Search */}
            <div className="relative mb-8 group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-[#00d26a]" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0f1513] border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#00d26a]/20 outline-none"
              />
            </div>

            <div className="mb-8">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Focus Area</h4>
              <div className="flex flex-col gap-2">
                {MOCK_WELLNESS_SUBCATEGORIES.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSub(sub.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeSub === sub.id
                        ? 'bg-[#00d26a] text-white shadow-md shadow-[#00d26a]/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a231f]'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Content Type</h4>
              <div className="flex flex-col gap-2">
                {CONTENT_TYPES.map(type => (
                  <label key={type} className="flex items-center gap-3 p-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${typeFilter === type ? 'bg-[#00d26a] border-[#00d26a]' : 'border-gray-300 dark:border-gray-600 group-hover:border-[#00d26a]'}`}>
                      {typeFilter === type && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                    </div>
                    <span className={`text-sm font-medium ${typeFilter === type ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {type}
                    </span>
                    <input 
                      type="radio" 
                      name="type" 
                      className="hidden" 
                      checked={typeFilter === type}
                      onChange={() => setTypeFilter(type)}
                    />
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          
          {/* Featured Carousel Alternative (Grid for simplicity) */}
          {featuredResources.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                Editor's Picks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredResources.map(resource => (
                  <Link key={resource.id} href={`/platform/resources/wellness/${resource.id}`} className="group block relative rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-sm hover:shadow-2xl hover:shadow-[#00d26a]/20 transition-all duration-500">
                    <img src={resource.image} alt={resource.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">
                        {resource.type}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-black text-white mb-3 leading-tight">{resource.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-white/80 font-medium">
                        <span className="bg-[#00d26a]/20 px-2 py-1 rounded-md text-[#00d26a] bg-white backdrop-blur-md">
                          <Heart size={14} className="inline mr-1" />
                          {resource.topic}
                        </span>
                        <span>{resource.time}</span>
                      </div>
                    </div>

                    {resource.type.includes('Video') || resource.type.includes('Webinar') ? (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-[#00d26a] text-white flex items-center justify-center pl-1 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Play size={24} fill="currentColor" />
                        </div>
                      </div>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Soft Cards Grid */}
          <div>
            <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              All Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regularResources.map(resource => (
                <Link key={resource.id} href={`/platform/resources/wellness/${resource.id}`} className="group bg-white dark:bg-[#151c19] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 hover:border-[#00d26a]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#00d26a]/5 flex flex-col h-full">
                  
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-block bg-[#e8f3ef] dark:bg-[#00d26a]/10 text-[#00d26a] text-xs font-bold px-3 py-1.5 rounded-xl">
                      {resource.type}
                    </span>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-lg">
                      {resource.time}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-[#00d26a] transition-colors">{resource.title}</h3>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d26a] to-[#20c997] flex items-center justify-center text-white font-bold text-xs">
                        {resource.expert.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{resource.expert}</span>
                    </div>
                  </div>
                </Link>
              ))}

              {regularResources.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white dark:bg-[#151c19] rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10">
                  <Activity size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No resources found</h3>
                  <p className="text-gray-500">Try adjusting your filters on the left.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

