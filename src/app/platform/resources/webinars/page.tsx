// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Play, Calendar, Clock, ChevronDown, MonitorPlay, Users, Filter, Tv, Eye, Plus, Loader2, Link as LinkIcon, X } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

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
  "Video Session"
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
    views: "1.2k attending",
    company: {
      logo: "/companylogo.png",
      name: "Turing IP Group",
      description: "Leading experts in artificial intelligence and intellectual property law."
    },
    image: "/resourceimg1.jpg"
  },
  {
    id: 2,
    title: "Mastering IP Litigation Tactics",
    type: "Masterclass",
    topic: "IP Litigation",
    subcategory: "litigation",
    expert: "Sarah Jenkins & Co.",
    time: "3:00:00", // Duration format for YT style
    featured: true,
    views: "8.5k views",
    company: {
      logo: "/companylogo.png",
      name: "Jenkins & Co.",
      description: "A premier litigation boutique specializing in high-stakes patent disputes."
    },
    image: "/resourceimg2.jpg"
  },
  {
    id: 3,
    title: "The Future of Trademarks in the Metaverse",
    type: "Panel Discussion",
    topic: "IP Strategy",
    subcategory: "ip-strategy",
    expert: "Tech IP Group",
    time: "1:30:00",
    featured: false,
    views: "4.2k views",
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
    views: "500 attending",
    image: "/resourceimg1.jpg"
  },
  {
    id: 5,
    title: "State of Global IP 2025",
    type: "Webinar Recording",
    topic: "IP Strategy",
    subcategory: "ip-strategy",
    expert: "Global IP Forum",
    time: "45:00",
    featured: false,
    views: "12k views",
    image: "/resourceimg2.jpg"
  },
  {
    id: 6,
    title: "Tech Giants and Standard Essential Patents",
    type: "Video Session",
    topic: "IP Litigation",
    subcategory: "litigation",
    expert: "IP Podcast Series",
    time: "35:00",
    featured: false,
    views: "3.1k views",
    image: "/resource3.jpg"
  }
];

export default function WebinarsHubPage() {
  const { user } = useAppStore();
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [resources, setResources] = useState<any[]>(MOCK_WEBINAR_RESOURCES);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', scheduled_at: '', duration_minutes: 60, max_attendees: 100, cover_image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const isAdmin = user && (user as any).is_admin; // Assuming is_admin is attached to user or handled via profile, for demo assume true if user exists. Wait, let's fetch profile.
  const [userProfile, setUserProfile] = useState<any>(null);

  React.useEffect(() => {
    async function fetchUser() {
      if (user?.id) {
        const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
        if (data) setUserProfile(data);
      }
    }
    fetchUser();
  }, [user?.id]);

  const canHost = userProfile?.is_admin;

  const handleHostWebinar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/meetn/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          host_user_id: user?.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessData(data.data);
        // Refresh webinars
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  async function fetchData() {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .or('category.eq.webinars,category.ilike.%Live Event%')
      .order('created_at', { ascending: false });
      
    if (data && data.length > 0) {
      setResources(data.map(d => ({
        ...d,
        expert: d.author_name || "Expert",
        time: d.scheduled_at ? new Date(d.scheduled_at).toLocaleDateString() : (d.read_time || "45:00"),
        image: d.cover_image_url || d.url || "/resourceimg1.jpg",
        type: d.webinar_status === 'live' ? 'Live Now' : (d.webinar_status === 'ended' ? 'Recording' : (d.resource_type || 'Upcoming Webinar'))
      })));
    }
  }

  React.useEffect(() => {
    fetchData();

    // Subscribe to realtime updates for webinar status changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'resources',
          filter: "category=ilike.%Live Event%"
        },
        (payload) => {
          setResources(current => current.map(r => {
            if (r.id === payload.new.id) {
              return {
                ...r,
                ...payload.new,
                type: payload.new.webinar_status === 'live' ? 'Live Now' : (payload.new.webinar_status === 'ended' ? 'Recording' : 'Upcoming Webinar')
              };
            }
            return r;
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  const mainFeature = filteredResources.find(r => r.featured);
  const otherResources = filteredResources.filter(r => r.id !== mainFeature?.id);

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] text-gray-900 dark:text-white font-sans selection:bg-[#ff2a5f]/30">
      
      {/* Cinematic Hero Feature */}
      {mainFeature && (
        <div className="relative w-full h-[70vh] min-h-[600px] flex flex-col justify-between pb-20">
          <div className="absolute inset-0 z-0 bg-gray-100 dark:bg-black">
            <img src={mainFeature.image} alt={mainFeature.title} className="w-full h-full object-cover opacity-90 dark:opacity-60" />
            {/* Reduced opacity on light mode via to stop it from washing out the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/40 dark:from-[#0f172a] dark:via-[#0f172a]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9fa]/80 via-[#f8f9fa]/20 dark:from-[#0f172a]/90 dark:via-[#0f172a]/50 to-transparent" />
          </div>

          {/* Search bar positioned relative to hero */}
          <div className="relative z-50 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-gray-300 dark:border-white/20 focus-within:border-gray-400 dark:focus-within:border-white/50 transition-all shadow-sm">
              <Search size={16} className="text-gray-600 dark:text-white/80" />
              <input 
                type="text" 
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 w-48"
              />
            </div>
            
            {canHost && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#ff2a5f] hover:bg-[#e02553] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Plus size={18} /> Host Webinar
              </button>
            )}
          </div>
          
          <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-8 items-end justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#ff2a5f] text-white text-xs font-black uppercase px-3 py-1 rounded-sm flex items-center gap-1.5 shadow-md">
                  <MonitorPlay size={14} /> {mainFeature.type}
                </span>
                {mainFeature.type === "Upcoming Webinar" && (
                  <span className="bg-gray-900/10 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white text-xs font-bold uppercase px-3 py-1 rounded-sm border border-gray-900/20 dark:border-white/20 flex items-center gap-1.5">
                    <Calendar size={14} /> {mainFeature.time}
                  </span>
                )}
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-6 drop-shadow-sm dark:drop-shadow-lg">
                {mainFeature.title}
              </h1>
              <p className="text-xl text-gray-800 dark:text-white/80 mb-8 max-w-2xl font-medium drop-shadow-sm dark:drop-shadow-md">
                Join {mainFeature.expert} for an in-depth dive into {mainFeature.topic}. {mainFeature.company?.description}
              </p>
              
              <div className="flex items-center gap-4">
                <Link href={`/platform/resources/webinars/${mainFeature.id}`} className="bg-gray-900 text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl">
                  <Play size={20} fill="currentColor" />
                  {mainFeature.type === "Upcoming Webinar" ? "Register Now" : "Watch Now"}
                </Link>
                <button className="bg-white/50 dark:bg-white/20 backdrop-blur-md hover:bg-white/80 dark:hover:bg-white/30 text-gray-900 dark:text-white px-8 py-4 rounded-full font-bold transition-colors border border-gray-300 dark:border-white/20 shadow-lg">
                  More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 py-8">
        
        {/* Streaming Service Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 bg-white dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto p-2">
            {MOCK_WEBINAR_SUBCATEGORIES.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeSub === sub.id
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
          
          <div className="relative pr-2">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-gray-100 dark:bg-black/50 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 rounded-xl px-5 py-2.5 font-bold text-gray-900 dark:text-white flex items-center gap-3 min-w-[200px] transition-all"
            >
              <Filter size={16} className="text-gray-500 dark:text-white/50" />
              <span className="flex-1 text-left">{typeFilter}</span>
              <ChevronDown size={18} className={`text-gray-500 dark:text-white/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-2 mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 min-w-[200px]">
                {CONTENT_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setTypeFilter(type);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 font-medium transition-colors border-l-2 ${
                      typeFilter === type 
                        ? 'border-[#ff2a5f] bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white' 
                        : 'border-transparent text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video Grid (YouTube Style) */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <Tv className="text-[#ff2a5f]" /> All Sessions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {otherResources.map(resource => (
              <Link key={resource.id} href={`/platform/resources/webinars/${resource.id}`} className="group flex flex-col gap-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-white/5">
                  <img src={resource.image} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 rounded-full bg-[#ff2a5f] text-white flex items-center justify-center pl-1 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
                    {resource.webinar_status === 'live' && (
                      <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-sm animate-pulse flex items-center gap-1">
                        <Radio size={10} /> LIVE
                      </span>
                    )}
                    {resource.type === "Upcoming Webinar" && (
                      <span className="bg-[#ff2a5f] text-white text-[10px] font-bold uppercase px-2 py-1 rounded-md shadow-sm">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-md">
                    {resource.time}
                  </div>
                </div>
                
                <div className="flex gap-3 items-start">
                  {/* Avatar / Channel Icon placeholder */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff2a5f] to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-inner mt-1">
                    {resource.expert.charAt(0)}
                  </div>
                  
                  <div className="flex flex-col">
                    <h3 className="text-gray-900 dark:text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-[#ff2a5f] transition-colors">{resource.title}</h3>
                    <div className="text-gray-500 dark:text-white/60 text-sm mt-1 flex flex-col">
                      <span className="hover:text-gray-900 dark:hover:text-white transition-colors">{resource.expert}</span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                        <span className="flex items-center gap-1"><Eye size={12} /> {resource.views}</span>
                        <span>•</span>
                        <span>{resource.topic}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {otherResources.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                <Tv size={48} className="text-gray-300 dark:text-white/20 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No videos found</h3>
                <p className="text-gray-500 dark:text-white/50">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* HOST WEBINAR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSubmitting && !successData && setIsModalOpen(false)}></div>
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 w-full max-w-2xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            {!successData && (
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            )}

            {successData ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play size={40} className="ml-2" fill="currentColor" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Webinar Scheduled!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">Your webinar has been successfully created. You can share the viewer URL or save your host URL.</p>
                
                <div className="space-y-4 mb-8 text-left">
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Host URL (Keep Secret)</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white dark:bg-black/40 px-3 py-2 rounded-xl text-sm font-mono truncate border border-gray-200 dark:border-white/10">{successData.host_url}</div>
                      <button onClick={() => navigator.clipboard.writeText(successData.host_url)} className="bg-[#ff2a5f] text-white px-4 py-2 rounded-xl font-bold text-sm">Copy</button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Public Viewer URL</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white dark:bg-black/40 px-3 py-2 rounded-xl text-sm font-mono truncate border border-gray-200 dark:border-white/10">{successData.room_url}</div>
                      <button onClick={() => navigator.clipboard.writeText(successData.room_url)} className="bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white px-4 py-2 rounded-xl font-bold text-sm">Copy</button>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setSuccessData(null);
                    setFormData({ title: '', description: '', scheduled_at: '', duration_minutes: 60, max_attendees: 100, cover_image: '' });
                  }}
                  className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Host a Webinar</h2>
                <form onSubmit={handleHostWebinar} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Webinar Title</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#ff2a5f]" placeholder="e.g. AI in Patent Law" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#ff2a5f]" placeholder="What will you cover?" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Date & Time</label>
                      <input type="datetime-local" required value={formData.scheduled_at} onChange={e => setFormData({...formData, scheduled_at: e.target.value})} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#ff2a5f]" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Duration (mins)</label>
                      <input type="number" required value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: Number(e.target.value)})} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#ff2a5f]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Max Attendees</label>
                      <input type="number" required value={formData.max_attendees} onChange={e => setFormData({...formData, max_attendees: Number(e.target.value)})} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#ff2a5f]" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Cover Image URL (optional)</label>
                      <input value={formData.cover_image} onChange={e => setFormData({...formData, cover_image: e.target.value})} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#ff2a5f]" placeholder="https://..." />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#ff2a5f] hover:bg-[#e02553] text-white px-6 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-70">
                      {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <MonitorPlay size={20} />}
                      Schedule Webinar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
