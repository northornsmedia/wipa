'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Mic, Play, Pause, ChevronDown, ListMusic, Headphones, PlayCircle, Clock, Volume2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// MOCK categories removed in favor of dynamic albums from DB

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null); // Paused by default

  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPodcasts() {
      const [podcastsRes, albumsRes] = await Promise.all([
        supabase.from('podcasts').select('*').order('created_at', { ascending: false }),
        supabase.from('podcast_albums').select('*').order('name', { ascending: true })
      ]);

      if (!podcastsRes.error && podcastsRes.data) {
        const formattedData = podcastsRes.data.map(dbItem => ({
          id: dbItem.id,
          title: dbItem.title,
          type: dbItem.content_type,
          topic: dbItem.topic_tag || dbItem.custom_topic,
          subcategory: dbItem.subcategory,
          host: dbItem.host_name,
          guest: dbItem.guest_names,
          time: dbItem.duration,
          featured: dbItem.is_featured,
          image: dbItem.cover_image_url,
          media: dbItem.media_file_url,
          category: dbItem.category
        }));
        setPodcasts(formattedData);
      }
      
      if (!albumsRes.error && albumsRes.data) {
        setAlbums(albumsRes.data);
      }
      
      setLoading(false);
    }
    fetchPodcasts();
  }, []);

  const filteredResources = podcasts.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    const matchesCat = selectedCategory ? r.category === selectedCategory : true;
    
    return matchesSearch && matchesType && matchesCat;
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
        
        {/* Filter Badges (Spotify style) */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
          <button
            onClick={() => {
              setActiveSub('all');
              setSelectedCategory('');
            }}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap border ${
              activeSub === 'all' && !selectedCategory
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black dark:border-white'
                : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:border-white/10'
            }`}
          >
            All Episodes
          </button>
          
          <button
            onClick={() => {
              setActiveSub('categories');
              setSelectedCategory('');
            }}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap border ${
              activeSub === 'categories' && !selectedCategory
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black dark:border-white'
                : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:border-white/10'
            }`}
          >
            All Categories
          </button>
          
          {activeSub === 'all' && (
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
          )}
        </div>

        {activeSub === 'categories' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {albums.map((album) => (
              <div 
                key={album.id}
                onClick={() => { setSelectedCategory(album.name); setActiveSub('all'); }}
                className="bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition-colors cursor-pointer group flex flex-col"
              >
                {/* Image Container with Hover Play Button */}
                <div className="relative w-full aspect-square rounded-md overflow-hidden bg-[#27272a] shadow-lg mb-4 shrink-0">
                   {album.cover_image_url ? (
                     <img src={album.cover_image_url} alt={album.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-500">
                       <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                     </div>
                   )}
                   
                   {/* Spotify-style Play Button */}
                   <div className="absolute bottom-2 right-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10 shadow-xl">
                     <button className="w-12 h-12 bg-[#1ed760] rounded-full flex items-center justify-center hover:bg-[#1fdf64] hover:scale-105 transition-all text-black shadow-lg">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                     </button>
                   </div>
                </div>
                
                {/* Text Content */}
                <div className="flex flex-col flex-1">
                  <h3 className="text-base font-bold text-white mb-1 truncate">{album.name}</h3>
                  <p className="text-[13px] font-medium text-gray-400 line-clamp-2">{album.description || "No description provided."}</p>
                </div>
              </div>
            ))}
            
            {albums.length === 0 && !loading && (
              <div className="col-span-full py-12 text-center">
                <p className="text-gray-500 dark:text-white/40">No albums have been created yet.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 size={48} className="animate-spin text-[#f59e0b] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Loading Episodes...</h3>
              </div>
            ) : mainFeature && !selectedCategory && (
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

        {/* Tracklist layout for all episodes */}
        <div className="mb-12">
          
          {selectedCategory && (
            <div className="flex flex-col gap-2 mb-8 mt-4">
              <button onClick={() => { setSelectedCategory(''); setActiveSub('categories'); }} className="w-fit text-gray-500 dark:text-white/50 hover:text-[#f59e0b] dark:hover:text-[#f59e0b] flex items-center gap-1 text-sm font-bold transition-colors">
                <ArrowLeft size={16} /> Back to Albums
              </button>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{selectedCategory}</h2>
            </div>
          )}

          {/* Table Header */}
          <div className="flex items-center px-4 py-2 border-b border-gray-200 dark:border-white/10 mb-4 text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">
            <div className="w-12 text-center shrink-0">#</div>
            <div className="flex-1 min-w-0">Title</div>
            <div className="w-40 hidden md:block shrink-0">Topic</div>
            <div className="w-36 hidden lg:block shrink-0">Type</div>
            <div className="w-40 hidden lg:block shrink-0">Album</div>
            <div className="w-24 text-right flex justify-end shrink-0"><Clock size={14} /></div>
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
                  <div className="w-40 hidden md:block shrink-0">
                    <span className="text-sm font-medium text-gray-600 dark:text-white/60 truncate block">{resource.topic}</span>
                  </div>

                  {/* Type */}
                  <div className="w-36 hidden lg:block shrink-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 truncate block">{resource.type}</span>
                  </div>

                  {/* Album */}
                  <div className="w-40 hidden lg:block shrink-0 pr-4">
                    {resource.category ? (
                      <span className="text-xs font-bold text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-1 rounded-md truncate max-w-full inline-block">{resource.category}</span>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-white/30 italic">None</span>
                    )}
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
        </>
        )}

      </div>

      {/* Hidden Audio Player */}
      {playingId && podcasts.find(p => p.id === playingId)?.media && (
        <audio 
          src={podcasts.find(p => p.id === playingId)?.media} 
          autoPlay 
          onEnded={() => setPlayingId(null)}
          className="hidden"
        />
      )}
    </div>
  );
}
