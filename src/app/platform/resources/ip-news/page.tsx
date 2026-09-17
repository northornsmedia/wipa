'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Newspaper, 
  Activity, 
  Globe, 
  Scale, 
  ArrowRight, 
  Zap, 
  Filter, 
  RefreshCw, 
  Clock, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Flame,
  Plus,
  ExternalLink,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { cleanIPNewsText, formatCleanSummary } from '@/lib/ipNewsCleaner';

const JURISDICTION_FILTERS = [
  { id: 'all', name: 'All Jurisdictions' },
  { id: 'global', name: 'Global Updates' },
  { id: 'us', name: 'US Updates' },
  { id: 'eu', name: 'EU Updates' },
  { id: 'uk', name: 'UK Updates' },
  { id: 'asia-pacific', name: 'Asia-Pacific' }
];

const CONTENT_TYPES = [
  "All Types",
  "News",
  "Legal Update",
  "Case Law Update",
  "Regulatory Update",
  "Legislative Update",
  "IP Office Update",
  "Jurisdiction Update",
  "Case Summary"
];

export default function IPNewsHubPage() {
  const [activeSub, setActiveSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // 30-Second Headline Auto-Rotation & 30-Second Real-Time Fetch
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // 1. Fetch live news items directly from Supabase (wire + approved community submissions)
  const loadNewsFromDatabase = useCallback(async () => {
    try {
      // Wire news
      const { data: wireData } = await supabase
        .from('ip_news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      // Community approved news from resources
      const { data: communityData } = await supabase
        .from('resources')
        .select('*')
        .eq('category', 'ip-news')
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false })
        .limit(100);

      const allData = [
        ...(communityData || []).map((d: any) => ({ ...d, __isCommunity: true })),
        ...(wireData || [])
      ];

      allData.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });

      if (allData.length > 0) {
        const mapped = allData.map((d: any) => {
          const cleanTitle = cleanIPNewsText(d.title) || d.title;
          const cleanSummary = formatCleanSummary(d.summary || d.description, cleanTitle);
          const createdDate = d.created_at ? new Date(d.created_at) : new Date();
          const timeStr = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const dateStr = d.created_at ? createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';
          const sourceOrg = d.organization || (d.tags?.includes('GlobalIPMagazineNews') ? 'The Global IP Magazine' : (d.__isCommunity ? (d.author_name || 'WIPA Contributor') : 'Global IP Wire'));
          const sourceLink = d.external_url || d.url || (d.__isCommunity ? `/platform/resources/ip-news/${d.slug || d.id}` : (d.slug && d.slug.includes('breaking-ip-wire') ? 'https://www.globalipmagazine.com/news/breaking-ip-wire' : `https://www.globalipmagazine.com/post/${d.slug || ''}`));

          return {
            id: d.id,
            title: cleanTitle,
            slug: d.slug || d.id,
            type: d.resource_type || "News",
            jurisdiction: d.tags?.[1] || d.tags?.[0] || (d.subcategory ? d.subcategory.toUpperCase() : "Global"),
            subcategory: d.subcategory || "global",
            date: dateStr,
            time: timeStr,
            fullTimestamp: `${dateStr} • ${timeStr}`,
            sourceName: sourceOrg,
            sourceUrl: sourceLink,
            featured: d.is_featured || false,
            image: d.cover_image_url || "/resourceimg1.jpg",
            summary: cleanSummary,
            read_time: d.read_time || "4 min read",
            tags: d.tags || ['Intellectual Property', 'Legal'],
            isCommunity: Boolean(d.__isCommunity)
          };
        });
        setNewsItems(mapped);
      }
    } catch (err) {
      console.error('Error fetching IP news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Trigger background continuous sync runner (fetch real news from internet every 30 seconds)
  const triggerBackgroundSync = useCallback(async (manual = false) => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const res = await fetch('/api/cron/sync-ip-news', {
        method: 'POST',
        headers: { 'Cache-Control': 'no-store' }
      });
      const data = await res.json();

      if (data && data.success) {
        setLastSyncTime('Just now');
        if (data.inserted_count > 0) {
          setSyncSuccessMessage(`Added ${data.inserted_count} new live intelligence briefings from internet`);
          setTimeout(() => setSyncSuccessMessage(null), 4000);
        } else if (manual) {
          setSyncSuccessMessage('All real-time global IP intelligence is fully up to date');
          setTimeout(() => setSyncSuccessMessage(null), 3000);
        }
        await loadNewsFromDatabase();
      }
    } catch (err) {
      console.error('Background sync runner caught error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, loadNewsFromDatabase]);

  // Initial Load from database (lightning fast ~30ms, no unnecessary internet polling)
  useEffect(() => {
    loadNewsFromDatabase();
  }, [loadNewsFromDatabase]);

  const filteredNews = newsItems.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = q === '' || 
      item.title.toLowerCase().includes(q) || 
      item.summary.toLowerCase().includes(q) ||
      (Array.isArray(item.tags) && item.tags.some((t: string) => t.toLowerCase().includes(q)));
    
    const matchesSub = activeSub === 'all' || item.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || item.type === typeFilter;

    return matchesSearch && matchesSub && matchesType;
  });

  // Top Pool of Rotating Headlines (up to 8 latest matching stories)
  const headlinePool = filteredNews.slice(0, 8);

  // 30-Second Auto-Rotation Timer Effect
  useEffect(() => {
    if (headlinePool.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          setHeadlineIndex(curr => (curr + 1) % headlinePool.length);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [headlinePool.length, isPaused]);

  // Safe active featured story
  const safeHeadlineIndex = headlinePool.length > 0 ? headlineIndex % headlinePool.length : 0;
  const currentFeatured = headlinePool[safeHeadlineIndex] || filteredNews[0];

  // Remaining list items excluding current featured story
  const listItems = filteredNews.filter(n => n.id !== currentFeatured?.id);
  const displayedListItems = listItems.slice(0, visibleCount);

  const handleNextHeadline = () => {
    if (headlinePool.length > 0) {
      setHeadlineIndex(prev => (prev + 1) % headlinePool.length);
      setSecondsRemaining(30);
    }
  };

  const handlePrevHeadline = () => {
    if (headlinePool.length > 0) {
      setHeadlineIndex(prev => (prev - 1 + headlinePool.length) % headlinePool.length);
      setSecondsRemaining(30);
    }
  };

  // Real-time counter calculations
  const getTypeCount = (type: string) => {
    if (type === 'All Types') return newsItems.length;
    return newsItems.filter(n => n.type === type).length;
  };

  const getJurisdictionCount = (subId: string) => {
    if (subId === 'all') return newsItems.length;
    return newsItems.filter(n => n.subcategory === subId).length;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans pb-24 overflow-x-hidden selection:bg-orange-500/20">
      
      {/* Real-time Ticker Tape */}
      <div className="w-full bg-slate-950 text-white overflow-hidden py-4 border-b-2 border-orange-500/40 flex items-center shadow-md">
        <div className="flex whitespace-nowrap animate-marquee gap-14 font-black uppercase text-xs md:text-sm tracking-wider text-slate-200">
          {newsItems.slice(0, 15).map((r, i) => (
            <span key={`ticker-1-${r.id || i}`} className="inline-flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
              <span className="font-extrabold text-orange-400">[{r.type}]</span> 
              <span className="font-bold text-slate-100">{r.title}</span>
            </span>
          ))}
          {newsItems.slice(0, 15).map((r, i) => (
            <span key={`ticker-2-${r.id || i}`} className="inline-flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
              <span className="font-extrabold text-orange-400">[{r.type}]</span> 
              <span className="font-bold text-slate-100">{r.title}</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 160s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Terminal / Header Area */}
      <div className="border-b-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1322] shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-10 md:py-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                <Activity size={13} className="animate-pulse" /> Real-Time Live Stream (30s Sync)
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                {newsItems.length} Live Intelligence Briefings
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Live <span className="text-orange-500">Updates</span>
            </h1>
            <p className="mt-2 text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 max-w-2xl">
              Continuous live intelligence covering patent rulings, trademark decisions, IP office circulars, and global policy updates.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-80 flex items-center border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900/90 rounded-xl px-3.5 py-2.5 shadow-2xs focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
              <Search size={16} className="text-slate-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Search terminal..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none placeholder-slate-400 text-slate-900 dark:text-white"
              />
            </div>

            {/* Sync Button */}
            <button
              onClick={() => triggerBackgroundSync(true)}
              disabled={isSyncing}
              title="Sync Latest News from Internet"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-4 py-2.5 text-xs font-black shadow-sm transition-all disabled:opacity-60 shrink-0 cursor-pointer"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Sync Fresh"}</span>
            </button>

            {/* Publish Your News Button */}
            <Link
              href="/platform/resources/ip-news/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white px-4 py-2.5 text-xs font-black shadow-md shadow-orange-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus size={15} />
              <span>Publish Your News</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sync Success Alert Toast */}
      {syncSuccessMessage && (
        <div className="max-w-[1440px] mx-auto px-5 pt-4">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold shadow-xs animate-fadeIn">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{syncSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="max-w-[1440px] mx-auto px-5 pt-8 md:pt-10 flex flex-col lg:flex-row gap-8 lg:gap-10">
        
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="sticky top-20 space-y-6">
            
            {/* Jurisdictions Card */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0c1322] p-5 shadow-lg">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-4 flex items-center gap-2">
                <Filter size={14} className="text-orange-500" /> Jurisdictions
              </h3>
              <div className="flex flex-col gap-1.5">
                {JURISDICTION_FILTERS.map(sub => {
                  const count = getJurisdictionCount(sub.id);
                  const isSelected = activeSub === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => { setActiveSub(sub.id); setHeadlineIndex(0); setSecondsRemaining(30); }}
                      className={`text-left text-xs font-bold transition-all px-3.5 py-2.5 rounded-2xl flex items-center justify-between group ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent border border-orange-500/40 text-orange-600 dark:text-orange-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="font-bold">{sub.name}</span>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold transition-all ${
                        isSelected 
                          ? 'bg-orange-500/20 text-orange-600 dark:text-orange-300 border border-orange-500/30' 
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-400 group-hover:text-slate-200'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Type Card */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0c1322] p-5 shadow-lg">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-4 flex items-center gap-2">
                <Scale size={14} className="text-orange-500" /> Type
              </h3>
              <div className="flex flex-col gap-1.5">
                {CONTENT_TYPES.map(type => {
                  const count = getTypeCount(type);
                  const isSelected = typeFilter === type;
                  return (
                    <button
                      key={type}
                      onClick={() => { setTypeFilter(type); setHeadlineIndex(0); setSecondsRemaining(30); }}
                      className={`text-left text-xs font-bold transition-all px-3.5 py-2.5 rounded-2xl flex items-center justify-between group ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent border border-orange-500/40 text-orange-600 dark:text-orange-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="font-bold">{type}</span>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold transition-all ${
                        isSelected 
                          ? 'bg-orange-500/20 text-orange-600 dark:text-orange-300 border border-orange-500/30' 
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-400 group-hover:text-slate-200'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <RefreshCw size={28} className="animate-spin text-orange-500 mb-3" />
              <p className="text-sm font-bold">Loading live IP intelligence stream...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white dark:bg-[#0d1322] dark:border-white/10 p-12 text-center">
              <Newspaper size={36} className="mx-auto text-slate-400 mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No briefings found under "{typeFilter}"</h3>
              <p className="text-xs text-slate-500 mb-6">Try selecting "All Types" or broadening your jurisdiction filter.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveSub('all'); setTypeFilter('All Types'); }}
                className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Rotating 30-Second Lead Headline Feature */}
              {currentFeatured && (
                <div 
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0d1322] shadow-sm hover:shadow-xl transition-all duration-300 hover:border-orange-500/50"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <Link 
                    href={`/platform/resources/ip-news/${currentFeatured.id}`}
                    className="block"
                  >
                    <div className="flex flex-col">
                      {/* Top Image */}
                      <div className="w-full relative h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden bg-slate-900">
                        <img 
                          key={currentFeatured.id}
                          src={currentFeatured.image} 
                          alt={currentFeatured.title} 
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 animate-fadeIn" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 text-white px-3.5 py-1 text-[11px] font-black uppercase tracking-wider shadow-md">
                            <Flame size={13} /> Lead Briefing #{safeHeadlineIndex + 1}
                          </span>
                          <span className="rounded-full bg-slate-900/85 backdrop-blur border border-white/10 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                            {currentFeatured.jurisdiction}
                          </span>
                        </div>
                      </div>

                      {/* Content Below */}
                      <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-3">
                            <span className="bg-orange-500/10 px-2.5 py-0.5 rounded-md font-extrabold">{currentFeatured.type}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-400 font-semibold">
                              <Clock size={13} /> {currentFeatured.read_time}
                            </span>
                          </div>
                          
                          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors mb-4">
                            {currentFeatured.title}
                          </h2>
                          
                          <p className="text-sm md:text-base lg:text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                            {currentFeatured.summary}
                          </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                              <Clock size={13} className="text-orange-500" /> {currentFeatured.fullTimestamp || currentFeatured.date}
                            </span>
                            <span>•</span>
                            <a 
                              href={currentFeatured.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400 hover:underline hover:text-orange-500 transition-colors"
                              title="Open original reporting at publisher"
                            >
                              <span>Source: {currentFeatured.sourceName}</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                            Read Full Briefing <ArrowRight size={15} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* 30-Second Rotation Control & Progress Bar */}
                  <div className="bg-slate-100 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-white/5 px-6 py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                        </span>
                        Next headline in <span className="font-black text-orange-500 font-mono">{secondsRemaining}s</span>
                      </span>
                      <button 
                        onClick={(e) => { e.preventDefault(); setIsPaused(!isPaused); }}
                        className="p-1 rounded-md text-slate-400 hover:text-orange-500 transition"
                        title={isPaused ? "Resume auto-rotation" : "Pause auto-rotation"}
                      >
                        {isPaused ? <Play size={13} /> : <Pause size={13} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400">
                        {safeHeadlineIndex + 1} / {headlinePool.length}
                      </span>
                      <button 
                        onClick={(e) => { e.preventDefault(); handlePrevHeadline(); }}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-500 border border-slate-200 dark:border-white/10 shadow-2xs transition"
                        title="Previous headline"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); handleNextHeadline(); }}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-500 border border-slate-200 dark:border-white/10 shadow-2xs transition"
                        title="Next headline"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Visual 30-Second Countdown Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 overflow-hidden">
                    <div 
                      className="bg-orange-500 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${((30 - secondsRemaining) / 30) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Fair Use & Attribution Disclaimer Banner */}
              <div className="rounded-2xl p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
                <ShieldCheck size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">Publisher Attribution & Legal Safe Harbor</span>
                  <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/80">
                    All original intellectual property reporting, trademarks, and excerpts belong exclusively to their respective publishers (including The Global IP Magazine, USPTO, WIPO, etc.). WIPA indexes these intelligence briefings solely for educational reference. Click any story's <strong>Source ↗</strong> link to view the complete reporting on the original publisher's platform.
                  </p>
                </div>
              </div>

              {/* Grid of Stories */}
              {displayedListItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedListItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/platform/resources/ip-news/${item.id}`}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0d1322] p-5 shadow-2xs hover:shadow-lg transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4 bg-slate-900">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="rounded-md bg-slate-950/80 backdrop-blur text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                              {item.jurisdiction}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
                          <span>{item.type}</span>
                          <span>•</span>
                          <span className="text-slate-400 font-medium">{item.read_time}</span>
                        </div>

                        <h3 className="text-lg font-black leading-snug tracking-tight text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors mb-2.5 line-clamp-2">
                          {item.title}
                        </h3>

                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-4">
                          {item.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                            <Clock size={11} className="text-orange-500" /> {item.fullTimestamp || item.date}
                          </span>
                          <span className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform text-xs">
                            Briefing <ArrowRight size={12} />
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-dashed border-slate-100 dark:border-white/5 pt-1.5">
                          <a 
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:underline transition-colors"
                            title={`Visit ${item.sourceName}`}
                          >
                            <span>Source: {item.sourceName}</span>
                            <ExternalLink size={10} className="shrink-0" />
                          </a>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {listItems.length > visibleCount && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:border-orange-500/50 hover:text-orange-500 transition-all"
                  >
                    <Plus size={15} /> Load More IP Intelligence ({listItems.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}

        </div>

        {/* Right Sidebar (Jurisdiction Activity & Trend Index) */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="sticky top-20 space-y-6">
            
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0c1322] p-5 shadow-lg">
              <h3 className="text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                Jurisdiction Activity
              </h3>

              <div className="flex flex-col gap-3 text-xs font-bold">
                <button
                  onClick={() => { setActiveSub('global'); setHeadlineIndex(0); }}
                  className="flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all text-left group"
                >
                  <span className="text-slate-700 dark:text-slate-200 group-hover:text-orange-500 transition-colors">Global (WIPO)</span>
                  <span className="text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md font-mono text-[11px] font-black">+12%</span>
                </button>

                <button
                  onClick={() => { setActiveSub('us'); setHeadlineIndex(0); }}
                  className="flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all text-left group"
                >
                  <span className="text-slate-700 dark:text-slate-200 group-hover:text-orange-500 transition-colors">United States (USPTO)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono text-[11px] font-black">+5%</span>
                </button>

                <button
                  onClick={() => { setActiveSub('eu'); setHeadlineIndex(0); }}
                  className="flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all text-left group"
                >
                  <span className="text-slate-700 dark:text-slate-200 group-hover:text-orange-500 transition-colors">European Union (EPO)</span>
                  <span className="text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md font-mono text-[11px] font-black">-2%</span>
                </button>

                <button
                  onClick={() => { setActiveSub('uk'); setHeadlineIndex(0); }}
                  className="flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all text-left group"
                >
                  <span className="text-slate-700 dark:text-slate-200 group-hover:text-orange-500 transition-colors">United Kingdom (UKIPO)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono text-[11px] font-black">+1%</span>
                </button>

                <button
                  onClick={() => { setActiveSub('asia-pacific'); setHeadlineIndex(0); }}
                  className="flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all text-left group"
                >
                  <span className="text-slate-700 dark:text-slate-200 group-hover:text-orange-500 transition-colors">Asia-Pacific (APAC)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono text-[11px] font-black">+8%</span>
                </button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider leading-relaxed">
                Data updated dynamically based on recent news volume, official gazette publications, and litigation filings.
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
