// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Search, Mic, Play, Pause, ChevronDown, ListMusic, Headphones, 
  PlayCircle, Clock, Volume2, VolumeX, SkipBack, SkipForward, Sparkles, 
  Share2, ExternalLink, Bookmark, CheckCircle2, LayoutGrid, List, Radio, 
  Disc, Award, Shield, FileText, ArrowRight, X, Gauge
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';

const CONTENT_TYPES = [
  "All Types",
  "Podcast Episode",
  "Audio Interview",
  "Video Interview",
  "Leadership Conversation",
  "Member Conversation",
  "Expert Discussion"
];

const FALLBACK_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const MOCK_EPISODES = [
  {
    id: 101,
    title: "IP TechNovation Talks – Season 1, Episode 3: AI Inventorship & Quantum IP",
    type: "Audio Interview",
    topic: "Technology in IP",
    subcategory: "tech-ip",
    host: "Dr Claudia Duffy",
    host_is_wipa_recommended: true,
    guest: "Nadine Stuttle (CEO PSS Solutions, Switzerland)",
    time: "32:40",
    featured: true,
    image: "/resourceimg1.jpg",
    media: FALLBACK_AUDIO,
    category: "The IP TechNovation Talks",
    summary: "Deep-dive conversation on how multinational corporations are adapting patent filing policies around autonomous AI systems, machine-generated claims, and European Patent Office guidelines."
  },
  {
    id: 102,
    title: "Women's IP World Podcast – Season 5: Brand Defense Across Borders",
    type: "Leadership Conversation",
    topic: "Trademarks & Luxury",
    subcategory: "trademarks",
    host: "Eleanor Vance",
    host_is_wipa_recommended: true,
    guest: "Claire Dupont (Head of Trademarks, LVMH)",
    time: "28:15",
    featured: false,
    image: "/resourceimg2.jpg",
    media: FALLBACK_AUDIO,
    category: "Women's IP World Podcast",
    summary: "Managing global trademark portfolios, 3D mark registrations, and customs enforcement strategies across 120+ jurisdictions."
  },
  {
    id: 103,
    title: "The Legal Edge – Episode 12: Structuring Outside Counsel Guidelines",
    type: "Expert Discussion",
    topic: "In-House Strategy",
    subcategory: "in-house",
    host: "Marcus Vance",
    host_is_wipa_recommended: false,
    guest: "Sarah Jenkins (Managing Partner)",
    time: "35:10",
    featured: false,
    image: "/resource3.jpg",
    media: FALLBACK_AUDIO,
    category: "The Legal Edge",
    summary: "How corporate IP legal departments use Alternative Fee Arrangements (AFAs) and fixed rate caps to eliminate runaway law firm billing."
  },
  {
    id: 104,
    title: "BioTech IP Insights: mRNA Patents & Vaccine Consortia",
    type: "Podcast Episode",
    topic: "Biotechnology & Life Sciences",
    subcategory: "biotech",
    host: "Beatrice Moreau",
    host_is_wipa_recommended: true,
    guest: "Dr. Olivia Thornton (AstraZeneca Biologics)",
    time: "41:00",
    featured: false,
    image: "/resourceimg1.jpg",
    media: FALLBACK_AUDIO,
    category: "BioTech IP Insights",
    summary: "Navigating patent term extensions (PTE), supplementary protection certificates (SPCs), and licensing partnerships in molecular therapies."
  }
];

export default function PodcastsHubPage() {
  const [activeSub, setActiveSub] = useState<'all' | 'categories'>('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Persistent Player State
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeTrack, setActiveTrack] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPodcasts() {
      try {
        const [podcastsRes, albumsRes, recommendedRes] = await Promise.all([
          supabase.from('podcasts').select('*').order('created_at', { ascending: false }),
          supabase.from('podcast_albums').select('*').order('name', { ascending: true }),
          supabase.from('profiles').select('full_name').eq('is_wipa_recommended', true)
        ]);

        const recommendedSet = new Set((recommendedRes.data || []).map(p => p.full_name));

        if (!podcastsRes.error && podcastsRes.data && podcastsRes.data.length > 0) {
          const formattedData = podcastsRes.data.map(dbItem => ({
            id: dbItem.id,
            title: dbItem.title,
            type: dbItem.content_type || "Podcast Episode",
            topic: dbItem.topic_tag || dbItem.custom_topic || "Intellectual Property",
            subcategory: dbItem.subcategory || "general",
            host: dbItem.host_name || "WIPA Host",
            host_is_wipa_recommended: recommendedSet.has(dbItem.host_name),
            guest: dbItem.guest_names || "Special Guest",
            time: dbItem.duration || "30:00",
            featured: dbItem.is_featured || false,
            image: dbItem.cover_image_url || "/resourceimg1.jpg",
            media: dbItem.media_file_url || FALLBACK_AUDIO,
            category: dbItem.category || "General Series",
            summary: dbItem.description || "In-depth discussion on global intellectual property developments, patent strategies, and legal practice."
          }));
          setPodcasts(formattedData);
        } else {
          setPodcasts(MOCK_EPISODES);
        }

        if (!albumsRes.error && albumsRes.data && albumsRes.data.length > 0) {
          setAlbums(albumsRes.data);
        } else {
          setAlbums([
            { id: 1, name: "The IP TechNovation Talks", description: "Pioneering technological shifts in patent law, AI, and software.", cover_image_url: "/resourceimg1.jpg" },
            { id: 2, name: "Women's IP World Podcast", description: "Executive leadership, trademark jurisprudence, and corporate advocacy.", cover_image_url: "/resourceimg2.jpg" },
            { id: 3, name: "The Legal Edge", description: "In-house operational frameworks, AFAs, and corporate practice.", cover_image_url: "/resource3.jpg" },
            { id: 4, name: "BioTech IP Insights", description: "Biopharma patent prosecution, mRNA technologies, and regulatory exclusivity.", cover_image_url: "/resourceimg1.jpg" }
          ]);
        }
      } catch (err) {
        setPodcasts(MOCK_EPISODES);
      } finally {
        setLoading(false);
      }
    }
    fetchPodcasts();
  }, []);

  // Audio Event Bindings
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleTogglePlay = (track: any) => {
    if (!audioRef.current) return;

    if (activeTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setActiveTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = track.media || FALLBACK_AUDIO;
          audioRef.current.playbackRate = playbackRate;
          audioRef.current.volume = isMuted ? 0 : volume;
          audioRef.current.play().catch(() => {});
        }
      }, 50);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    const target = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const handleSpeedToggle = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleToggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (secs: number) => {
    if (!Number.isFinite(secs) || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const filteredResources = podcasts.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = r.title.toLowerCase().includes(q) || 
                          (r.host && r.host.toLowerCase().includes(q)) ||
                          (r.guest && r.guest.toLowerCase().includes(q)) ||
                          (r.topic && r.topic.toLowerCase().includes(q));
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    const matchesCat = selectedCategory ? r.category === selectedCategory : true;
    
    return matchesSearch && matchesType && matchesCat;
  });

  const mainFeature = filteredResources.find(r => r.featured) || filteredResources[0];
  const otherResources = selectedCategory 
    ? filteredResources 
    : filteredResources.filter(r => r.id !== mainFeature?.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0d14] text-slate-900 dark:text-white font-sans selection:bg-amber-500/30 flex flex-col pb-32 transition-colors duration-300">
      
      {/* Audio Element Hidden Anchor */}
      <audio ref={audioRef} preload="metadata" />

      {/* Top Studio Navigation & Hero */}
      <div className="relative w-full border-b border-slate-200/80 dark:border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent dark:from-[#2a1705]/50 dark:via-[#140b04] dark:to-[#0a0d14] z-0"></div>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/15 dark:bg-amber-600/15 rounded-full blur-[110px] pointer-events-none z-0"></div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 relative z-10 flex flex-col items-center text-center">
          
          {/* Live Audio Network Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-wider mb-3">
            <span className="flex items-center gap-0.5 h-3">
              <span className="w-0.5 h-2 bg-amber-500 animate-pulse"></span>
              <span className="w-0.5 h-3.5 bg-amber-500 animate-pulse delay-75"></span>
              <span className="w-0.5 h-1.5 bg-amber-500 animate-pulse delay-150"></span>
            </span>
            <span>WIPA Audio Network &bull; Global IP Dialogues</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-2.5 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-amber-700 to-[#f59e0b] dark:from-white dark:via-amber-200 dark:to-amber-400">
            Podcasts & Conversations
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base font-medium text-slate-600 dark:text-white/60 max-w-2xl leading-relaxed mx-auto">
            In-depth conversations with global intellectual property pioneers, patent portfolio architects, General Counsels, and innovators shaping legal tech.
          </p>

          {/* Integrated Search & Actions Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-xl mt-6">
            <div className="relative w-full flex items-center bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500">
              <Search size={15} className="text-slate-400 dark:text-white/40 mr-2.5 shrink-0" />
              <input 
                type="text" 
                placeholder="Search by topic, guest, host, or episode title..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none placeholder-slate-400 dark:placeholder-white/40"
              />
            </div>
            
            <Link 
              href="/platform/resources/podcasts-conversations/upload" 
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Mic size={14} />
              <span>Submit Episode</span>
            </Link>
          </div>

          {/* Navigation Filter Pills */}
          <div className="mt-6 flex items-center justify-center max-w-full overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-2xs backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  setActiveSub('all');
                  setSelectedCategory('');
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  activeSub === 'all' && !selectedCategory
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs font-black' 
                    : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                }`}
              >
                <Disc size={14} />
                <span>All Episodes</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${activeSub === 'all' && !selectedCategory ? 'bg-white/25 text-white' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'}`}>
                  {podcasts.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveSub('categories');
                  setSelectedCategory('');
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  activeSub === 'categories'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs font-black' 
                    : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                }`}
              >
                <ListMusic size={14} />
                <span>Curated Series & Albums</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${activeSub === 'categories' ? 'bg-white/25 text-white' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'}`}>
                  {albums.length}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Studio Body */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* VIEW 1: ALBUMS / CURATED SERIES GRID                                      */}
        {/* ========================================================================= */}
        {activeSub === 'categories' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Curated Audio Series & Albums
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Select a flagship production to explore all seasonal releases and recordings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {albums.map((album) => (
                <div 
                  key={album.id}
                  onClick={() => { setSelectedCategory(album.name); setActiveSub('all'); }}
                  className="group relative bg-white dark:bg-[#111624] p-4 rounded-2xl border border-slate-200/90 dark:border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900 mb-4 shadow-md">
                    <img 
                      src={album.cover_image_url || "/resourceimg1.jpg"} 
                      alt={album.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-amber-500 transition-colors truncate">
                      {album.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {album.description || "Official WIPA syndicated intellectual property podcast series."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* FEATURED HEADLINER EPISODE (CINEMATIC STUDIO CARD)                        */}
            {/* ========================================================================= */}
            {mainFeature && !selectedCategory && (
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-[#111624]/90 shadow-lg shadow-amber-900/5 backdrop-blur-md">
                
                {/* Ambient Blurred Artwork Lighting */}
                <div className="absolute -top-12 -right-12 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-12 -left-12 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

                <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                  
                  {/* Artwork with 3D Reflection */}
                  <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl shrink-0 group">
                    <img 
                      src={mainFeature.image} 
                      alt={mainFeature.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    
                    {/* Hover Center Overlay */}
                    <div 
                      onClick={() => handleTogglePlay(mainFeature)}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                        {isPlaying && activeTrack?.id === mainFeature.id ? (
                          <Pause size={28} fill="currentColor" />
                        ) : (
                          <Play size={28} fill="currentColor" className="ml-1" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Headline & Episode Dossier */}
                  <div className="flex flex-col flex-1 space-y-3.5 text-left w-full">
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                        {mainFeature.type}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-white/50 flex items-center gap-1.5">
                        <Clock size={13} /> {mainFeature.time}
                      </span>
                      {mainFeature.topic && (
                        <span className="text-xs font-semibold text-slate-600 dark:text-white/70 bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 rounded-md">
                          {mainFeature.topic}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                      {mainFeature.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                      {mainFeature.summary}
                    </p>

                    {/* Host & Guest Strip */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                          {mainFeature.host.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          {mainFeature.host}
                          {mainFeature.host_is_wipa_recommended && (
                            <span className="text-[9px] bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 px-1.5 py-0.2 rounded-full font-black">
                              WIPA
                            </span>
                          )}
                        </span>
                      </div>

                      <span className="text-slate-300 dark:text-white/20">&bull;</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Guest:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{mainFeature.guest}</span>
                      </div>
                    </div>

                    {/* Action Bar: Play & Show Notes */}
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <button 
                        type="button"
                        onClick={() => handleTogglePlay(mainFeature)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        {isPlaying && activeTrack?.id === mainFeature.id ? (
                          <>
                            <Pause size={16} fill="currentColor" />
                            <span>Pause Listening</span>
                          </>
                        ) : (
                          <>
                            <Play size={16} fill="currentColor" className="ml-0.5" />
                            <span>Listen Now ({mainFeature.time})</span>
                          </>
                        )}
                      </button>

                      <Link 
                        href={`/platform/resources/podcasts-conversations/${mainFeature.id}`}
                        className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-xs border border-slate-200/80 dark:border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText size={14} />
                        <span>Show Notes & Transcript</span>
                      </Link>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* EPISODE DIRECTORY HEADER & CONTROLS                                       */}
            {/* ========================================================================= */}
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Headphones size={20} className="text-amber-500" />
                    <span>All Available Dispatches</span>
                    {selectedCategory && (
                      <span className="text-sm font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                        {selectedCategory}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Stream high-resolution audio interviews, keynote panels, and IP practice masterclasses.
                  </p>
                </div>

                {/* Filter & View Mode Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Content Type Filter */}
                  <div className="relative">
                    <button 
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:border-amber-500 transition-all cursor-pointer"
                    >
                      <span>{typeFilter}</span>
                      <ChevronDown size={13} className={isDropdownOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#111624] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-20 animate-scaleUp">
                        {CONTENT_TYPES.map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setTypeFilter(type);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                              typeFilter === type 
                                ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 font-bold' 
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <button 
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-amber-500 shadow-2xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
                      title="List View"
                    >
                      <List size={15} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-amber-500 shadow-2xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
                      title="Card Grid View"
                    >
                      <LayoutGrid size={15} />
                    </button>
                  </div>
                </div>

              </div>

              {selectedCategory && (
                <button 
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Show all episodes from all series</span>
                </button>
              )}

              {/* ========================================================================= */}
              {/* EPISODES DISPLAY: LIST VIEW OR GRID VIEW                                  */}
              {/* ========================================================================= */}
              {viewMode === 'list' ? (
                /* Sleek Tracklist Table */
                <div className="bg-white dark:bg-[#111624] rounded-2xl border border-slate-200/90 dark:border-white/10 overflow-hidden shadow-xs">
                  
                  {/* Table Headers */}
                  <div className="flex items-center px-5 py-3 border-b border-slate-100 dark:border-white/5 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    <div className="w-10 text-center shrink-0">#</div>
                    <div className="flex-1 min-w-0">Title & Dialogue</div>
                    <div className="w-36 hidden md:block shrink-0">Topic</div>
                    <div className="w-32 hidden lg:block shrink-0">Format</div>
                    <div className="w-36 hidden xl:block shrink-0">Series</div>
                    <div className="w-20 text-right flex justify-end shrink-0"><Clock size={13} /></div>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {otherResources.map((resource, index) => {
                      const isCurrentPlaying = isPlaying && activeTrack?.id === resource.id;
                      const isCurrentTrack = activeTrack?.id === resource.id;

                      return (
                        <div 
                          key={resource.id}
                          className={`group flex items-center px-5 py-3.5 transition-colors hover:bg-amber-500/5 ${isCurrentTrack ? 'bg-amber-500/10 dark:bg-amber-500/10' : ''}`}
                        >
                          {/* Play / Number Column */}
                          <div className="w-10 text-center flex items-center justify-center shrink-0">
                            {isCurrentPlaying ? (
                              <div className="flex items-center gap-0.5 h-4 group-hover:hidden">
                                <span className="w-1 h-3 bg-amber-500 animate-pulse"></span>
                                <span className="w-1 h-4 bg-amber-500 animate-pulse delay-75"></span>
                                <span className="w-1 h-2 bg-amber-500 animate-pulse delay-150"></span>
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-slate-400 group-hover:hidden">
                                {index + 1}
                              </span>
                            )}
                            
                            <button
                              type="button"
                              onClick={() => handleTogglePlay(resource)}
                              className="hidden group-hover:flex w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-white items-center justify-center transition-transform hover:scale-105 shadow-md cursor-pointer"
                              title={isCurrentPlaying ? "Pause" : "Play"}
                            >
                              {isCurrentPlaying ? (
                                <Pause size={13} fill="currentColor" />
                              ) : (
                                <Play size={13} fill="currentColor" className="ml-0.5" />
                              )}
                            </button>
                          </div>

                          {/* Cover Image & Title Details */}
                          <div className="flex-1 min-w-0 flex items-center gap-3 pr-4">
                            <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-200 dark:border-white/10">
                              <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <Link 
                                href={`/platform/resources/podcasts-conversations/${resource.id}`}
                                className={`text-xs sm:text-sm font-bold truncate hover:text-amber-500 transition-colors block ${isCurrentTrack ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}
                              >
                                {resource.title}
                              </Link>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">{resource.host}</span>
                                <span>&bull;</span>
                                <span className="truncate">{resource.guest}</span>
                              </div>
                            </div>
                          </div>

                          {/* Topic */}
                          <div className="w-36 hidden md:block shrink-0">
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate block">
                              {resource.topic}
                            </span>
                          </div>

                          {/* Format */}
                          <div className="w-32 hidden lg:block shrink-0">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate block">
                              {resource.type}
                            </span>
                          </div>

                          {/* Series */}
                          <div className="w-36 hidden xl:block shrink-0 pr-3">
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md truncate inline-block max-w-full">
                              {resource.category || "Official Series"}
                            </span>
                          </div>

                          {/* Duration */}
                          <div className="w-20 text-right shrink-0">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              {resource.time}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Card Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {otherResources.map(resource => {
                    const isCurrentPlaying = isPlaying && activeTrack?.id === resource.id;

                    return (
                      <div 
                        key={resource.id}
                        className="group relative bg-white dark:bg-[#111624] rounded-2xl border border-slate-200/90 dark:border-white/10 overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between"
                      >
                        <div className="p-4 flex-1 flex flex-col">
                          
                          {/* Image Container with Floating Play Button */}
                          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 mb-3.5 shadow-xs">
                            <img src={resource.image} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            
                            <button
                              type="button"
                              onClick={() => handleTogglePlay(resource)}
                              className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                            >
                              {isCurrentPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                              {resource.type}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                              <Clock size={11} /> {resource.time}
                            </span>
                          </div>

                          <Link 
                            href={`/platform/resources/podcasts-conversations/${resource.id}`}
                            className="text-sm font-black text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-amber-500 transition-colors mb-2"
                          >
                            {resource.title}
                          </Link>

                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                            {resource.summary}
                          </p>

                          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-slate-900 dark:text-white">{resource.host}</span>
                            <span className="text-slate-400"> &bull; {resource.guest}</span>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {otherResources.length === 0 && (
                <div className="py-20 text-center border border-dashed border-slate-300 dark:border-white/10 rounded-3xl bg-white/50 dark:bg-white/5">
                  <Mic size={36} className="mx-auto text-slate-400 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No episodes found</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search query or filters.</p>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* ========================================================================= */}
      {/* PERSISTENT FLOATING AUDIO PLAYER DOCK (NEXT-LEVEL STREAMING EXPERIENCE)   */}
      {/* ========================================================================= */}
      {activeTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0d121f]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] px-4 sm:px-6 py-3 animate-slideUp">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
            
            {/* Left: Active Episode Meta */}
            <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-200 dark:border-white/10 shadow-sm relative">
                <img src={activeTrack.image} alt={activeTrack.title} className="w-full h-full object-cover" />
                {isPlaying && (
                  <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="flex items-center gap-0.5 h-3">
                      <span className="w-0.5 h-2 bg-white animate-pulse"></span>
                      <span className="w-0.5 h-3 bg-white animate-pulse delay-75"></span>
                      <span className="w-0.5 h-1.5 bg-white animate-pulse delay-150"></span>
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {activeTrack.title}
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {activeTrack.host} &bull; {activeTrack.guest}
                </div>
              </div>
            </div>

            {/* Center: Controls & Scrub Bar */}
            <div className="flex flex-col items-center gap-1.5 w-full sm:w-1/3">
              <div className="flex items-center gap-4">
                <button 
                  type="button" 
                  onClick={() => handleSkip(-15)}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Rewind 15 seconds"
                >
                  <SkipBack size={18} />
                </button>

                <button 
                  type="button" 
                  onClick={() => handleTogglePlay(activeTrack)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-500/25 active:scale-95 transition-transform cursor-pointer"
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>

                <button 
                  type="button" 
                  onClick={() => handleSkip(15)}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Fast forward 15 seconds"
                >
                  <SkipForward size={18} />
                </button>
              </div>

              {/* Progress Slider */}
              <div className="flex items-center gap-2 w-full max-w-md">
                <span className="text-[10px] font-bold text-slate-400 w-8 text-right shrink-0">
                  {formatTime(currentTime)}
                </span>
                
                <input 
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />

                <span className="text-[10px] font-bold text-slate-400 w-8 text-left shrink-0">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Right: Audio Features (Speed, Volume, Close) */}
            <div className="flex items-center justify-end gap-3 w-full sm:w-1/3">
              {/* Playback Speed Toggle */}
              <button 
                type="button"
                onClick={handleSpeedToggle}
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-black hover:text-amber-500 transition-colors cursor-pointer"
                title="Playback Speed"
              >
                {playbackRate}x
              </button>

              {/* Volume Toggle */}
              <button 
                type="button"
                onClick={handleToggleMute}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              {/* Dismiss Player */}
              <button 
                type="button"
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setIsPlaying(false);
                  setActiveTrack(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close Player"
              >
                <X size={15} />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
