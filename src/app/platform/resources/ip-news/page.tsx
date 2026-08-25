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
  TrendingUp, 
  Filter, 
  RefreshCw, 
  Sparkles, 
  BookOpen, 
  Layers3, 
  Clock, 
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const JURISDICTION_FILTERS = [
  { id: 'all', name: 'All Jurisdictions' },
  { id: 'global', name: 'Global' },
  { id: 'us', name: 'United States' },
  { id: 'eu', name: 'European Union' },
  { id: 'uk', name: 'United Kingdom' },
  { id: 'asia-pacific', name: 'Asia-Pacific' }
];

const CONTENT_TYPES = [
  "All Types",
  "Breaking News",
  "Case Law Update",
  "IP Office Update",
  "Regulatory Update",
  "Legislative Update",
  "Patent Watch",
  "Trademark Bulletin"
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

  // 1. Fetch live news items directly from Supabase
  const loadNewsFromDatabase = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .or('category.eq.ip-news,type.eq.ip_news')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          slug: d.slug || d.id,
          type: d.resource_type || "Breaking News",
          jurisdiction: d.tags?.[1] || d.tags?.[0] || (d.subcategory ? d.subcategory.toUpperCase() : "Global"),
          subcategory: d.subcategory || "global",
          date: d.created_at ? new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
          featured: d.is_featured || false,
          image: d.cover_image_url || "/resourceimg1.jpg",
          summary: d.summary || d.description || "",
          read_time: d.read_time || "4 min read",
          tags: d.tags || ['Intellectual Property', 'Legal']
        }));
        setNewsItems(mapped);
      }
    } catch (err) {
      console.error('Error fetching IP news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Trigger background continuous sync runner (never fails)
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
          setSyncSuccessMessage(`Added ${data.inserted_count} new intellectual property intelligence briefings`);
          setTimeout(() => setSyncSuccessMessage(null), 4000);
        } else if (manual) {
          setSyncSuccessMessage('All latest global IP intelligence is fully up to date');
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

  // Initial Load + Auto Background Runner
  useEffect(() => {
    loadNewsFromDatabase();
    
    // Auto-trigger background sync in fire-and-forget mode
    const syncTimeout = setTimeout(() => {
      triggerBackgroundSync(false);
    }, 1200);

    // Continuous interval background runner every 5 minutes
    const interval = setInterval(() => {
      triggerBackgroundSync(false);
    }, 300000);

    return () => {
      clearTimeout(syncTimeout);
      clearInterval(interval);
    };
  }, [loadNewsFromDatabase, triggerBackgroundSync]);

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSub = activeSub === 'all' || item.subcategory === activeSub;
    const matchesType = typeFilter === 'All Types' || item.type === typeFilter;

    return matchesSearch && matchesSub && matchesType;
  });

  const featuredItem = filteredNews.find(n => n.featured) || filteredNews[0];
  const listItems = filteredNews.filter(n => n.id !== featuredItem?.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans pb-24 overflow-x-hidden selection:bg-orange-500/20">
      
      {/* Ticker Tape */}
      <div className="w-full bg-slate-950 text-white overflow-hidden py-2.5 border-b border-orange-500/30 flex items-center shadow-xs">
        <div className="flex whitespace-nowrap animate-marquee gap-12 font-black uppercase text-[11px] tracking-wider text-slate-200">
          {newsItems.slice(0, 8).map((r, i) => (
            <span key={`ticker-1-${r.id || i}`} className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="font-bold text-orange-400">[{r.type}]</span> {r.title}
            </span>
          ))}
          {newsItems.slice(0, 8).map((r, i) => (
            <span key={`ticker-2-${r.id || i}`} className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="font-bold text-orange-400">[{r.type}]</span> {r.title}
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
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header Area */}
      <div className="border-b border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0d1322] shadow-xs">
        <div className="max-w-[1440px] mx-auto px-5 py-8 md:py-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                <Activity size={13} className="animate-pulse" /> Continuous Live Feed
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Synced {lastSyncTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              IP News & Legal <span className="text-orange-500">Intelligence</span>
            </h1>
            <p className="mt-2 text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 max-w-2xl">
              Curated global developments, case law precedents, patent office circulars, and regulatory updates for intellectual property professionals.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-80 flex items-center border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900/90 rounded-xl px-3.5 py-2.5 shadow-2xs focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
              <Search size={16} className="text-slate-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Search IP briefings, cases..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none placeholder-slate-400 text-slate-900 dark:text-white"
              />
            </div>

            {/* Sync Button */}
            <button
              onClick={() => triggerBackgroundSync(true)}
              disabled={isSyncing}
              title="Sync Latest News"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-4 py-2.5 text-xs font-black shadow-sm transition-all disabled:opacity-60 shrink-0"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Refresh"}</span>
            </button>
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
        <div className="w-full lg:w-60 shrink-0">
          <div className="sticky top-20 space-y-6">
            
            {/* Jurisdictions Filter */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0d1322] p-4 shadow-xs">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2">
                <Globe size={13} className="text-orange-500" /> Jurisdictions
              </h3>
              <div className="flex flex-col gap-1">
                {JURISDICTION_FILTERS.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSub(sub.id)}
                    className={`text-left text-xs font-bold transition-all px-3 py-2 rounded-xl flex items-center justify-between ${
                      activeSub === sub.id
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{sub.name}</span>
                    {activeSub === sub.id && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0d1322] p-4 shadow-xs">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2">
                <Scale size={13} className="text-orange-500" /> Briefing Type
              </h3>
              <div className="flex flex-col gap-1">
                {CONTENT_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`text-left text-xs font-semibold transition-all px-3 py-2 rounded-xl flex items-center justify-between ${
                      typeFilter === type
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold border border-orange-200 dark:border-orange-900/50'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{type}</span>
                  </button>
                ))}
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
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No intelligence briefings found</h3>
              <p className="text-xs text-slate-500 mb-6">Try broadening your search query or jurisdiction filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveSub('all'); setTypeFilter('All Types'); }}
                className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured / Lead Story */}
              {featuredItem && (
                <Link 
                  href={`/platform/resources/ip-news/${featuredItem.id}`}
                  className="group relative block overflow-hidden rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0d1322] shadow-sm hover:shadow-xl transition-all duration-300 hover:border-orange-500/50"
                >
                  <div className="flex flex-col xl:flex-row items-stretch">
                    <div className="xl:w-1/2 relative min-h-[260px] xl:min-h-[380px] overflow-hidden bg-slate-900">
                      <img 
                        src={featuredItem.image} 
                        alt={featuredItem.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="rounded-full bg-orange-500 text-white px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-md">
                          Lead Intelligence
                        </span>
                        <span className="rounded-full bg-slate-900/80 backdrop-blur text-white px-2.5 py-1 text-[10px] font-bold">
                          {featuredItem.jurisdiction}
                        </span>
                      </div>
                    </div>

                    <div className="xl:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2.5">
                          <span>{featuredItem.type}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400 font-medium">
                            <Clock size={12} /> {featuredItem.read_time}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors mb-4">
                          {featuredItem.title}
                        </h2>
                        <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {featuredItem.summary}
                        </p>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">
                          {featuredItem.date}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                          Read Briefing <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid of Remaining Stories */}
              {listItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listItems.map((item) => (
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

                      <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-400">{item.date}</span>
                        <span className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                          View Analysis <ArrowRight size={13} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

        </div>

      </div>

    </div>
  );
}
