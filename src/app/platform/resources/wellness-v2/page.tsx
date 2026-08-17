// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Headphones, Heart, Activity, Play, Sparkles, Smile, Coffee, Sun, Moon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FOCUS_AREAS = [
  { id: 'all', name: 'All Wellness' },
  { id: 'mental-health', name: 'Mental Health' },
  { id: 'work-life', name: 'Work-Life Balance' },
  { id: 'stress', name: 'Stress Management' },
  { id: 'physical', name: 'Physical Wellbeing' },
  { id: 'gut-hormone', name: 'Gut & Hormone Health' },
  { id: 'nutrition', name: 'Nutrition' }
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
  "Wellness Webinar",
  "Service"
];

const MOCK_WELLNESS_RESOURCES = [
  {
    id: 'jel-1to1',
    title: "1:1 Services with Jel",
    type: "Service",
    topic: "Gut & Hormone Health",
    subcategory: "gut-hormone",
    expert: "Jel · Budding Minds",
    time: "From £690",
    featured: true,
    image: "/resourceimg1.jpg",
    tags: ["Member Offer"]
  },
  {
    id: 'burnout-guide',
    title: "Navigating Burnout: A Practical Guide for IP Professionals",
    type: "Wellness Webinar",
    topic: "Mental Health & Burnout",
    subcategory: "mental-health",
    expert: "Dr. Elena Rostova",
    time: "45 min watch",
    featured: true,
    image: "/resourceimg2.jpg",
    tags: []
  },
  {
    id: 'jel-group',
    title: "Group Programmes",
    type: "Service",
    topic: "Mental Health",
    subcategory: "mental-health",
    expert: "Jel · Budding Minds",
    time: "Live Zoom Sessions",
    featured: false,
    image: "/resourceimg1.jpg",
    tags: ["Member Offer"]
  },
  {
    id: 'jel-events',
    title: "Wellness Events: Sensory Vibes",
    type: "Service",
    topic: "Physical Wellbeing",
    subcategory: "physical",
    expert: "Jel · Budding Minds",
    time: "In-Person Event",
    featured: false,
    image: "/wellbeing.jpg",
    tags: ["Member Offer"]
  },
  {
    id: 'jel-retreats',
    title: "International Retreats",
    type: "Service",
    topic: "Work-Life Balance",
    subcategory: "work-life",
    expert: "Jel · Budding Minds",
    time: "Multi-Day Retreat",
    featured: false,
    image: "/resourceimg2.jpg",
    tags: ["Member Offer"]
  },
  {
    id: 'jel-podcast',
    title: "Budding Minds Podcast",
    type: "Podcast",
    topic: "Mental Health",
    subcategory: "mental-health",
    expert: "Jel · Budding Minds",
    time: "Listen Now",
    featured: false,
    image: "/resourceimg1.jpg",
    tags: []
  },
  {
    id: 'jel-guide',
    title: "Budding Minds Blog & Guides",
    type: "Guide",
    topic: "Nutrition",
    subcategory: "nutrition",
    expert: "Jel · Budding Minds",
    time: "Read Now",
    featured: false,
    image: "/wellbeing.jpg",
    tags: []
  }
];

import { supabase } from "@/lib/supabase";

export default function WellnessHubPageV2() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [dbResources, setDbResources] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLiveWellness() {
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("*")
          .eq("category", "wellness")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            type: d.resource_type || "Guide",
            topic: d.tags?.[0] || "Wellbeing",
            subcategory: d.subcategory || "mental-health",
            expert: d.author_name || "Wellness Expert",
            time: d.read_time || "Read Now",
            featured: d.is_featured || false,
            image: d.cover_image_url || "/wellbeing.jpg",
            tags: d.tags || [],
            is_splash_sponsored: d.is_splash_sponsored,
            splash_tagline: d.splash_tagline,
            splash_cta_text: d.splash_cta_text,
            splash_cta_url: d.splash_cta_url,
          }));
          setDbResources(mapped);
        } else {
          setDbResources(MOCK_WELLNESS_RESOURCES);
        }
      } catch (err) {
        setDbResources(MOCK_WELLNESS_RESOURCES);
      }
    }
    fetchLiveWellness();
  }, []);

  const resourcesToFilter = dbResources.length > 0 ? dbResources : MOCK_WELLNESS_RESOURCES;

  const filteredResources = resourcesToFilter.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    return matchesSearch && matchesSub && matchesType;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#0a0a0f] flex flex-col font-sans overflow-hidden relative">
      
      {/* 2.0 Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00d26a]/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#6b21a8]/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />

      {/* Hero Section */}
      <div className="w-full relative z-10 pt-16 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00d26a]/20 to-[#00d26a]/5 border border-[#00d26a]/20 text-[#00d26a] px-5 py-2.5 rounded-full font-bold text-sm mb-8 backdrop-blur-md">
            <Sparkles size={16} /> Prioritize Your Peace
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d26a] to-[#20c997]">Balance</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12">
            Curated resources and expert-led support focused on mental health, gut & hormone health, and thriving as an IP professional. Take a moment for yourself.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 pb-24 relative z-10">
        
        {/* Wellbeing Expert Module */}
        <div className="w-full bg-white/60 dark:bg-[#1a1a24]/60 backdrop-blur-xl rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-8 md:p-12 shadow-sm mb-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-[#00d26a]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shrink-0 border-4 border-white dark:border-[#2a2a36] shadow-xl relative z-10">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Jel" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 text-center md:text-left relative z-10">
            <div className="inline-block bg-[#00d26a]/10 text-[#00d26a] font-bold text-xs px-3 py-1.5 rounded-full mb-4">WIPA Wellbeing Partner</div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">Meet Jel — Budding Minds</h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold mb-6 text-sm uppercase tracking-wider">Registered Nutritional Therapist · Gut, Hormone & Nervous System Health</p>
            
            <blockquote className="text-xl text-gray-700 dark:text-gray-300 font-medium italic leading-relaxed mb-8 border-l-4 border-[#00d26a] pl-6">
              "My work is about the whole person — mind, body and soul. Understanding how your lifestyle, mindset and nervous system connect to your health is key to lasting change."
            </blockquote>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link href="/platform/resources/wellness-v2/jel-services" className="bg-[#00d26a] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-[#00d26a]/25 hover:shadow-xl hover:shadow-[#00d26a]/40 hover:-translate-y-1 transition-all w-full sm:w-auto text-center">
                Explore Her Services
              </Link>
              <Link href="/platform/resources/wellness-v2/jel-story" className="text-gray-600 dark:text-gray-300 font-bold hover:text-[#00d26a] transition-colors flex items-center gap-2">
                Read Her Story <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* 2.0 Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          
          {/* Daily Check-in Module */}
          <div className="col-span-1 lg:col-span-2 bg-white/60 dark:bg-[#1a1a24]/60 backdrop-blur-xl rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-8 shadow-sm flex flex-col justify-center">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">How are you feeling today?</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">Take a moment to check in with yourself.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { id: 'great', icon: Sun, label: 'Great', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-500/20' },
                { id: 'good', icon: Smile, label: 'Good', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10', border: 'border-green-200 dark:border-green-500/20' },
                { id: 'tired', icon: Coffee, label: 'Tired', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-600/10', border: 'border-amber-200 dark:border-amber-600/20' },
                { id: 'stressed', icon: Moon, label: 'Stressed', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-500/20' },
              ].map(mood => (
                <button 
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 ${
                    selectedMood === mood.id 
                      ? `${mood.border} ${mood.bg} shadow-lg transform -translate-y-1` 
                      : 'border-gray-100 dark:border-white/5 bg-white dark:bg-[#22222f] hover:border-gray-200 dark:hover:border-white/10 hover:-translate-y-1'
                  }`}
                >
                  <mood.icon size={32} className={`${mood.color} mb-3`} />
                  <span className={`font-bold ${selectedMood === mood.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Audio Module */}
          <div className="col-span-1 bg-gradient-to-br from-[#00d26a] to-[#20c997] rounded-[2.5rem] p-8 shadow-xl shadow-[#00d26a]/20 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mb-6">
                <Headphones size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black mb-2 leading-tight">Daily Mindfulness Minute</h3>
              <p className="text-white/80 font-medium text-sm">A quick guided reset for your workday.</p>
            </div>
            
            <button className="w-full mt-8 bg-white text-[#00d26a] hover:bg-gray-50 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md">
              <Play size={18} fill="currentColor" /> Play Now
            </button>
          </div>
          
        </div>

        {/* Explore Resources Section */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Enhanced Filters Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-8 bg-white/60 dark:bg-[#1a1a24]/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-gray-200 dark:border-white/10">
              <h3 className="font-black text-gray-900 dark:text-white text-xl mb-6 flex items-center gap-2">
                <Filter className="text-[#00d26a]" size={20} /> Explore
              </h3>

              <div className="relative mb-8 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400 group-focus-within:text-[#00d26a]" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#22222f] border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#00d26a]/20 outline-none transition-all shadow-inner"
                />
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Focus Area</h4>
                <div className="flex flex-col gap-2">
                  {FOCUS_AREAS.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSub(sub.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        activeSub === sub.id
                          ? 'bg-[#00d26a] text-white shadow-md shadow-[#00d26a]/20'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
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
                  <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full bg-white dark:bg-[#22222f] border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-[#00d26a]/20 outline-none"
                  >
                    {CONTENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-1 min-w-0">
            
            {/* Editor's Picks */}
            {featuredResources.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                  <Heart className="text-pink-500" fill="currentColor" /> Editor's Picks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredResources.map(resource => (
                    <Link key={resource.id} href={`/platform/resources/wellness-v2/${resource.id}`} className="group block relative rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-sm hover:shadow-2xl hover:shadow-[#00d26a]/20 transition-all duration-500 border border-gray-100 dark:border-white/10">
                      <img src={resource.image} alt={resource.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
                      
                      <div className="absolute top-6 left-6 flex flex-col gap-2 items-start">
                        <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">
                          {resource.type}
                        </span>
                        {resource.tags && resource.tags.map(tag => (
                          <span key={tag} className="bg-pink-500/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-pink-500/30 shadow-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-2xl font-black text-white mb-3 leading-tight">{resource.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-white/80 font-medium">
                          <span className="bg-[#00d26a]/20 px-2 py-1 rounded-md text-[#00d26a] bg-white backdrop-blur-md font-bold shadow-sm">
                            {resource.topic}
                          </span>
                          <span className="font-bold">{resource.time}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Resources */}
            <div>
              <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                All Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularResources.map(resource => (
                  <Link key={resource.id} href={`/platform/resources/wellness-v2/${resource.id}`} className="group bg-white/60 dark:bg-[#1a1a24]/60 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 hover:border-[#00d26a]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#00d26a]/10 flex flex-col h-full relative overflow-hidden">
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-col gap-2 items-start">
                        <span className="inline-block bg-green-50 dark:bg-[#00d26a]/10 text-[#00d26a] text-xs font-bold px-3 py-1.5 rounded-xl border border-green-100 dark:border-green-500/20">
                          {resource.type}
                        </span>
                        {resource.tags && resource.tags.map(tag => (
                          <span key={tag} className="inline-block bg-pink-50 text-pink-500 text-xs font-bold px-3 py-1.5 rounded-xl border border-pink-100 shadow-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                        {resource.time}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-[#00d26a] transition-colors">{resource.title}</h3>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d26a] to-[#20c997] flex items-center justify-center text-white font-bold text-xs shadow-md shadow-[#00d26a]/20">
                          {resource.expert.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{resource.expert}</span>
                      </div>
                    </div>
                  </Link>
                ))}

                {regularResources.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-white/60 dark:bg-[#1a1a24]/60 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10">
                    <Activity size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No resources found</h3>
                    <p className="text-gray-500">Try adjusting your filters on the left.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
