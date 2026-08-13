'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Mic, Play, Pause, ChevronDown, ListMusic, Headphones, PlayCircle, Clock, Volume2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const MOCK_PODCASTS_SUBCATEGORIES = [
  { id: 'all', name: 'All Episodes' },
  { id: 'podcasts', name: 'Podcasts' },
  { id: 'video', name: 'Video Interviews' },
  { id: 'expert', name: 'Expert Discussions' },
  { id: 'member', name: 'Member Spotlight' }
];

const CONTENT_TYPES = [
  "All Types",
  "Podcast Episode",
  "Audio Interview",
  "Video Interview",
  "Leadership Conversation",
  "Member Conversation",
  "Expert Discussion"
];

export default function PodcastsHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null); // Paused by default

  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPodcasts() {
      const { data, error } = await supabase.from('podcasts').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const formattedData = data.map(dbItem => ({
          id: dbItem.id,
          title: dbItem.title,
          type: dbItem.content_type,
          topic: dbItem.topic_tag || dbItem.custom_topic,
          subcategory: dbItem.subcategory,
          host: dbItem.host_name,
          guest: dbItem.guest_names,
          time: dbItem.duration,
          featured: dbItem.is_featured,
          image: dbItem.cover_image_url
        }));
        setPodcasts(formattedData);
      }
      setLoading(false);
    }
    fetchPodcasts();
  }, []);

  const filteredResources = podcasts.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = activeSub === 'all' || r.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    
    return matchesSearch && matchesSub && matchesType;
  });

  const mainFeature = filteredResources.find(r => r.featured) || filteredResources[0];
  const otherResources = filteredResources.filter(r => r.id !== mainFeature?.id);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-white font-sans selection:bg-[#f59e0b]/30 flex flex-col pb-24">
      
      {/* Streaming App Style Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 py-4">
        <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">

            <h1 className="text-xl font-bold tracking-tight hidden sm:block text-gray-900 dark:text-white">Podcasts & Conversations</h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400 dark:text-white/40" />
            </div>
            <input 
              type="text" 
              placeholder="Search episodes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-white/10 border-transparent focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] rounded-full py-2.5 pl-11 pr-4 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/40 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 pt-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={48} className="animate-spin text-[#f59e0b] mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Loading Episodes...</h3>
          </div>
        ) : mainFeature && (
          <div className="relative rounded-3xl overflow-hidden mb-12 shadow-sm border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#181818]">
            {/* Blurred background effect */}
            <div className="absolute inset-0 opacity-20 dark:opacity-30">
              <img src={mainFeature.image} alt="Background blur" className="w-full h-full object-cover blur-3xl scale-110" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#181818]" />

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-end gap-8">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden shrink-0 shadow-2xl relative group">
                <img src={mainFeature.image} alt={mainFeature.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <Link href={`/platform/resources/podcasts-conversations/${mainFeature.id}`}>
                     <div className="w-16 h-16 rounded-full bg-[#f59e0b] flex items-center justify-center text-white hover:scale-105 transition-transform shadow-xl">
                       <Play size={28} fill="currentColor" className="ml-1" />
                     </div>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col flex-1 pb-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#f59e0b] mb-3">{mainFeature.type}</span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4 tracking-tight drop-shadow-sm dark:drop-shadow-none">
                  {mainFeature.title}
                </h2>
                
                <div className="flex items-center gap-4 text-gray-600 dark:text-white/70 mb-6 font-medium text-sm">
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#f59e0b] to-yellow-400 flex items-center justify-center text-white text-[10px] font-bold">
                       {mainFeature.host.charAt(0)}
                     </div>
                     <span className="font-bold text-gray-900 dark:text-white">{mainFeature.host}</span>
                   </div>
                   <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></span>
                   <span>Guest: {mainFeature.guest}</span>
                   <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></span>
                   <span>{mainFeature.topic}</span>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setPlayingId(playingId === mainFeature.id ? null : mainFeature.id)}
                    className="w-14 h-14 rounded-full bg-[#f59e0b] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                  >
                    {playingId === mainFeature.id ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                  </button>
                  <Link href={`/platform/resources/podcasts-conversations/${mainFeature.id}`} className="px-6 py-3 rounded-full border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-bold text-sm hover:border-gray-400 dark:hover:border-white/40 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                    View Show Notes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Badges (Spotify style) */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
          {MOCK_PODCASTS_SUBCATEGORIES.map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveSub(sub.id)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap border ${
                activeSub === sub.id
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black dark:border-white'
                  : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:border-white/10'
              }`}
            >
              {sub.name}
            </button>
          ))}
          
          <div className="relative ml-auto hidden sm:block">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-transparent border border-gray-300 dark:border-white/20 rounded-full px-5 py-2 text-sm font-bold text-gray-700 dark:text-white/70 hover:border-gray-400 dark:hover:border-white/40 flex items-center gap-2 transition-all"
            >
              {typeFilter}
              <ChevronDown size={14} className={isDropdownOpen ? 'rotate-180' : ''} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#282828] border border-gray-100 dark:border-white/5 rounded-xl shadow-xl overflow-hidden z-20">
                {CONTENT_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setTypeFilter(type);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                      typeFilter === type 
                        ? 'text-[#f59e0b] bg-gray-50 dark:bg-white/5' 
                        : 'text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tracklist layout for all episodes */}
        <div className="mb-12">
          
          {/* Table Header */}
          <div className="flex items-center px-4 py-2 border-b border-gray-200 dark:border-white/10 mb-4 text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">
            <div className="w-12 text-center">#</div>
            <div className="flex-1">Title</div>
            <div className="w-48 hidden md:block">Topic</div>
            <div className="w-48 hidden lg:block">Type</div>
            <div className="w-24 text-right flex justify-end"><Clock size={14} /></div>
          </div>

          <div className="flex flex-col">
            {otherResources.map((resource, index) => {
              const isPlaying = playingId === resource.id;
              return (
                <div 
                  key={resource.id} 
                  className={`group flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/5 ${isPlaying ? 'bg-gray-50 dark:bg-white/5' : ''}`}
                >
                  
                  {/* Number / Play Button */}
                  <div className="w-12 text-center flex items-center justify-center shrink-0">
                    <span className={`text-base font-medium ${isPlaying ? 'text-[#f59e0b] hidden group-hover:block' : 'text-gray-400 dark:text-white/40 group-hover:hidden'}`}>
                      {index + 1}
                    </span>
                    {isPlaying && <Volume2 size={18} className="text-[#f59e0b] group-hover:hidden animate-pulse" />}
                    
                    <button 
                      onClick={() => setPlayingId(isPlaying ? null : resource.id)}
                      className={`text-gray-900 dark:text-white hover:text-[#f59e0b] dark:hover:text-[#f59e0b] ${isPlaying ? 'hidden group-hover:block' : 'hidden group-hover:block'}`}
                    >
                      {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                    </button>
                  </div>

                  {/* Title & Image */}
                  <div className="flex-1 min-w-0 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-200 dark:bg-white/10 shrink-0">
                      <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0 pr-4">
                      <Link href={`/platform/resources/podcasts-conversations/${resource.id}`} className={`font-bold text-base truncate hover:underline ${isPlaying ? 'text-[#f59e0b]' : 'text-gray-900 dark:text-white'}`}>
                        {resource.title}
                      </Link>
                      <span className="text-sm text-gray-500 dark:text-white/50 truncate">
                        {resource.host} • {resource.guest}
                      </span>
                    </div>
                  </div>

                  {/* Topic */}
                  <div className="w-48 hidden md:block shrink-0">
                    <span className="text-sm font-medium text-gray-600 dark:text-white/60">{resource.topic}</span>
                  </div>

                  {/* Type */}
                  <div className="w-48 hidden lg:block shrink-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">{resource.type}</span>
                  </div>

                  {/* Duration */}
                  <div className="w-24 text-right shrink-0">
                    <span className="text-sm font-medium text-gray-500 dark:text-white/50">{resource.time}</span>
                  </div>
                </div>
              );
            })}

            {otherResources.length === 0 && (
              <div className="py-24 text-center">
                <Mic size={48} className="mx-auto text-gray-300 dark:text-white/10 mb-6" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No episodes found</h3>
                <p className="text-gray-500 dark:text-white/40 font-medium text-sm">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
