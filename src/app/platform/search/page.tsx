'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, Search, X, CheckCircle2, Calendar, Video, 
  Newspaper, Wrench, Building2, Briefcase, Users, ArrowUpRight,
  Sparkles, ExternalLink, MapPin, Clock, Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

type CategoryKey = 'people' | 'events' | 'webinars' | 'news' | 'toolkits' | 'firms' | 'jobs';

interface CategoryPill {
  key: CategoryKey;
  label: string;
}

const CATEGORIES: CategoryPill[] = [
  { key: 'people', label: 'People' },
  { key: 'events', label: 'Events' },
  { key: 'webinars', label: 'Webinars' },
  { key: 'news', label: 'News' },
  { key: 'toolkits', label: 'Toolkits' },
  { key: 'firms', label: 'Firms' },
  { key: 'jobs', label: 'Jobs' },
];

export default function MobileSearchPage() {
  const router = useRouter();
  const currentUser = useAppStore((state) => state.user);
  
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('people');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Live search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  // Category data caches
  const [people, setPeople] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [webinars, setWebinars] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [toolkits, setToolkits] = useState<any[]>([]);
  const [firms, setFirms] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  // Follow states
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [followCounts, setFollowCounts] = useState<Record<string, number>>({});
  const [togglingFollowIds, setTogglingFollowIds] = useState<Set<string>>(new Set());

  // 1. Initial Load of Data
  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [
          profilesRes,
          eventsRes,
          newsRes,
          resourcesRes,
          firmsRes,
          jobsRes,
          followsRes
        ] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, full_name, avatar_url, role, company, practice_area, verification_status, country, skills, bio')
            .order('created_at', { ascending: false })
            .limit(200),
          supabase
            .from('events')
            .select('id, title, description, event_date, location, is_virtual, category, cover_image_url, current_attendees, slug')
            .order('event_date', { ascending: true })
            .limit(40),
          supabase
            .from('ip_news')
            .select('id, title, summary, organization, created_at, slug, cover_image_url, read_time')
            .order('created_at', { ascending: false })
            .limit(40),
          supabase
            .from('resources')
            .select('id, title, category, description, file_url, url, cover_image_url, created_at')
            .order('created_at', { ascending: false })
            .limit(50),
          supabase
            .from('business_profiles')
            .select('id, name, type, logo_url, slug')
            .limit(30),
          supabase
            .from('jobs')
            .select('id, title, company, location, created_at')
            .eq('is_active', true)
            .limit(30),
          currentUser?.id 
            ? supabase.from('follows').select('following_id').eq('follower_id', currentUser.id)
            : Promise.resolve({ data: [] })
        ]);

        if (!isMounted) return;

        // Follows
        if (followsRes?.data) {
          const ids = new Set<string>((followsRes.data as any[]).map(f => f.following_id));
          setFollowedIds(ids);
        }

        // People
        if (profilesRes.data) {
          const filtered = currentUser?.id 
            ? profilesRes.data.filter(p => p.id !== currentUser.id)
            : profilesRes.data;
          setPeople(filtered);
        }

        // Events & Webinars
        if (eventsRes.data) {
          setEvents(eventsRes.data);
          const virtualEvents = eventsRes.data.filter(e => e.is_virtual || e.category?.toLowerCase().includes('webinar'));
          const resourceWebinars = (resourcesRes.data || []).filter(r => r.category === 'webinars');
          setWebinars([...virtualEvents, ...resourceWebinars]);
        }

        // News
        if (newsRes.data) {
          setNews(newsRes.data);
        }

        // Toolkits
        if (resourcesRes.data) {
          const toolkitList = resourcesRes.data.filter(r => 
            r.category === 'guides-toolkits' || 
            r.category === 'research-reports' ||
            r.title?.toLowerCase().includes('toolkit') ||
            r.title?.toLowerCase().includes('checklist') ||
            r.title?.toLowerCase().includes('guide')
          );
          setToolkits(toolkitList.length > 0 ? toolkitList : resourcesRes.data.slice(0, 15));
        }

        // Firms & Jobs
        if (firmsRes.data) setFirms(firmsRes.data);
        if (jobsRes.data) setJobs(jobsRes.data);

        // Compute simulated/real follower counts
        try {
          const { data: allFollows } = await supabase.from('follows').select('following_id');
          if (allFollows) {
            const counts: Record<string, number> = {};
            allFollows.forEach((f: any) => {
              counts[f.following_id] = (counts[f.following_id] || 0) + 1;
            });
            setFollowCounts(counts);
          }
        } catch {}

      } catch (err) {
        console.error('Error loading search initial data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialData();
    return () => { isMounted = false; };
  }, [currentUser?.id]);

  // Follow / Unfollow Handler
  const handleToggleFollow = async (targetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser?.id) {
      router.push('/login');
      return;
    }

    const isCurrentlyFollowed = followedIds.has(targetId);
    setTogglingFollowIds(prev => new Set(prev).add(targetId));

    // Optimistic toggle
    setFollowedIds(prev => {
      const next = new Set(prev);
      if (isCurrentlyFollowed) next.delete(targetId);
      else next.add(targetId);
      return next;
    });

    setFollowCounts(prev => ({
      ...prev,
      [targetId]: Math.max(0, (prev[targetId] || 0) + (isCurrentlyFollowed ? -1 : 1))
    }));

    try {
      if (isCurrentlyFollowed) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', targetId);
      } else {
        await supabase
          .from('follows')
          .upsert(
            { follower_id: currentUser.id, following_id: targetId },
            { onConflict: 'follower_id,following_id', ignoreDuplicates: true }
          );

        // Notify
        await supabase.from('notifications').insert({
          user_id: targetId,
          actor_id: currentUser.id,
          type: 'new_follower',
          content: `${currentUser.name || 'Someone'} started following you on WIPA!`,
          link: `/platform/profile/${currentUser.id}`,
          is_read: false
        });
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      // Revert on error
      setFollowedIds(prev => {
        const next = new Set(prev);
        if (isCurrentlyFollowed) next.add(targetId);
        else next.delete(targetId);
        return next;
      });
      setFollowCounts(prev => ({
        ...prev,
        [targetId]: Math.max(0, (prev[targetId] || 0) + (isCurrentlyFollowed ? 1 : -1))
      }));
    } finally {
      setTogglingFollowIds(prev => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
    }
  };

  // 2. Real-time Live Supabase Search
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const pattern = `%${q}%`;
        if (activeCategory === 'people') {
          const { data } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, role, company, practice_area, verification_status, country, skills, bio')
            .or(`full_name.ilike.${pattern},role.ilike.${pattern},company.ilike.${pattern},practice_area.ilike.${pattern},country.ilike.${pattern}`)
            .limit(50);
          const filtered = currentUser?.id ? (data || []).filter(p => p.id !== currentUser.id) : (data || []);
          setSearchResults(filtered);
        } else if (activeCategory === 'events') {
          const { data } = await supabase
            .from('events')
            .select('id, title, description, event_date, location, is_virtual, category, cover_image_url, current_attendees, slug')
            .or(`title.ilike.${pattern},description.ilike.${pattern},location.ilike.${pattern},category.ilike.${pattern}`)
            .limit(40);
          setSearchResults(data || []);
        } else if (activeCategory === 'webinars') {
          const [evRes, resRes] = await Promise.all([
            supabase
              .from('events')
              .select('id, title, description, event_date, location, is_virtual, category, cover_image_url, current_attendees, slug')
              .or(`title.ilike.${pattern},description.ilike.${pattern}`)
              .limit(30),
            supabase
              .from('resources')
              .select('id, title, category, description, file_url, url, cover_image_url, created_at')
              .eq('category', 'webinars')
              .or(`title.ilike.${pattern},description.ilike.${pattern}`)
              .limit(30)
          ]);
          setSearchResults([...(evRes.data || []), ...(resRes.data || [])]);
        } else if (activeCategory === 'news') {
          const { data } = await supabase
            .from('ip_news')
            .select('id, title, summary, organization, created_at, slug, cover_image_url, read_time')
            .or(`title.ilike.${pattern},summary.ilike.${pattern},organization.ilike.${pattern}`)
            .limit(40);
          setSearchResults(data || []);
        } else if (activeCategory === 'toolkits') {
          const { data } = await supabase
            .from('resources')
            .select('id, title, category, description, file_url, url, cover_image_url, created_at')
            .or(`title.ilike.${pattern},description.ilike.${pattern}`)
            .limit(40);
          setSearchResults(data || []);
        } else if (activeCategory === 'firms') {
          const { data } = await supabase
            .from('business_profiles')
            .select('id, name, type, logo_url, slug')
            .or(`name.ilike.${pattern},type.ilike.${pattern}`)
            .limit(40);
          setSearchResults(data || []);
        } else if (activeCategory === 'jobs') {
          const { data } = await supabase
            .from('jobs')
            .select('id, title, company, location, created_at')
            .eq('is_active', true)
            .or(`title.ilike.${pattern},company.ilike.${pattern},location.ilike.${pattern}`)
            .limit(40);
          setSearchResults(data || []);
        }
      } catch (err) {
        console.error('Live search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory, currentUser?.id]);

  const currentItems = useMemo(() => {
    if (searchResults !== null) return searchResults;
    switch (activeCategory) {
      case 'people': return people;
      case 'events': return events;
      case 'webinars': return webinars;
      case 'news': return news;
      case 'toolkits': return toolkits;
      case 'firms': return firms;
      case 'jobs': return jobs;
      default: return [];
    }
  }, [searchResults, activeCategory, people, events, webinars, news, toolkits, firms, jobs]);

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/platform');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black md:dark:bg-[#090d16] text-slate-900 dark:text-white flex flex-col w-full max-w-full pb-20">
      
      {/* Top Header & Search Bar Bar Area */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 md:dark:bg-[#090d16]/95 backdrop-blur-xl border-b border-slate-100 dark:border-white/[0.08] pt-safe px-4 pb-2.5 shadow-xs">
        
        {/* Row 1: Back Button `<` and "Search" Title (Matches Screenshot) */}
        <div className="h-12 flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back"
            className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
          >
            <ChevronLeft size={28} strokeWidth={2.4} />
          </button>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white select-none">
            Search
          </h1>
        </div>

        {/* Row 2: Search Input Box */}
        <div className="mt-1 relative flex items-center w-full">
          <div className="w-full flex items-center gap-2.5 bg-slate-100 dark:bg-white/[0.08] rounded-2xl px-3.5 py-2.5 border border-transparent focus-within:border-[#5a32fa] focus-within:ring-2 focus-within:ring-[#5a32fa]/20 transition-all">
            <Search size={18} className="text-slate-400 dark:text-gray-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeCategory}...`}
              className="bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none w-full"
            />
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-[#5a32fa] border-t-transparent rounded-full animate-spin shrink-0" />
            ) : searchQuery ? (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSearchResults(null); }}
                className="w-5 h-5 rounded-full bg-slate-300 dark:bg-white/20 flex items-center justify-center text-slate-700 dark:text-white p-0.5 hover:opacity-80 transition-opacity"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            ) : null}
          </div>
        </div>

        {/* Row 3: Horizontal Scrollable Category Pills (People, Events, Webinars, News, Toolkits, etc.) */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 touch-pan-x">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer touch-manipulation ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm ring-1 ring-slate-900 dark:ring-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-white/[0.08] dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/[0.14] border border-slate-200/60 dark:border-white/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Category Specific Search Results */}
      <div className="flex-1 w-full max-w-xl mx-auto px-4 py-3">
        {isLoading || isSearching ? (
          // Skeleton Loading
          <div className="space-y-4 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10" />
                  <div className="space-y-2">
                    <div className="w-32 h-3.5 bg-slate-200 dark:bg-white/10 rounded-md" />
                    <div className="w-24 h-2.5 bg-slate-100 dark:bg-white/5 rounded-md" />
                  </div>
                </div>
                <div className="w-20 h-7 bg-slate-200 dark:bg-white/10 rounded-lg" />
              </div>
            ))}
          </div>
        ) : currentItems.length === 0 ? (
          // Empty State
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-gray-500 mb-3">
              <Search size={26} strokeWidth={1.8} />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              No {activeCategory} found
            </p>
            {searchQuery && (
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
                We couldn&apos;t find anything matching &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        ) : (
          <div>
            {/* 1. PEOPLE CATEGORY (Default - Matches Screenshot Exactly) */}
            {activeCategory === 'people' && (
              <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                {currentItems.map((person) => {
                  const isFollowed = followedIds.has(person.id);
                  const isToggling = togglingFollowIds.has(person.id);
                  const count = followCounts[person.id] || 0;
                  const followersDisplay = count > 0 
                    ? `${count} follower${count > 1 ? 's' : ''}`
                    : (person.country || 'WIPA Member');

                  return (
                    <div
                      key={person.id}
                      onClick={() => router.push(`/platform/profile/${person.id}`)}
                      className="flex items-center justify-between py-3 px-1 hover:bg-slate-50 dark:hover:bg-white/[0.02] rounded-2xl transition-colors cursor-pointer select-none active:opacity-80"
                    >
                      {/* Left: Avatar + Details */}
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 bg-gradient-to-tr from-[#5a32fa] via-purple-600 to-[#ff79c6] text-white flex items-center justify-center font-bold text-base shadow-xs">
                          {person.avatar_url ? (
                            <img
                              src={person.avatar_url}
                              alt={person.full_name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            person.full_name?.charAt(0) || 'W'
                          )}
                        </div>

                        <div className="min-w-0">
                          {/* Name + Verified Badge */}
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {person.full_name}
                            </span>
                            {person.verification_status === 'verified' && (
                              <CheckCircle2 size={14} className="fill-[#1d9bf0] text-white dark:text-[#090d16] shrink-0" />
                            )}
                          </div>

                          {/* Subtitle / Role */}
                          <p className="text-xs text-slate-500 dark:text-gray-400 truncate mt-0.5">
                            {person.role || person.company || person.practice_area || 'Intellectual Property Professional'}
                          </p>

                          {/* Followers count (from screenshot: '15 followers', '14K followers') */}
                          <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-0.5">
                            {followersDisplay}
                          </p>
                        </div>
                      </div>

                      {/* Right: Instagram-Style Follow Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFollow(person.id, e)}
                        disabled={isToggling}
                        className={`shrink-0 font-bold text-xs px-5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer touch-manipulation shadow-xs ${
                          isFollowed
                            ? 'bg-transparent border border-slate-300 dark:border-white/30 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                            : 'bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-gray-200'
                        }`}
                      >
                        {isToggling ? '...' : isFollowed ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. EVENTS CATEGORY */}
            {activeCategory === 'events' && (
              <div className="space-y-3 pt-1">
                {currentItems.map((event) => {
                  const eventDate = event.event_date ? new Date(event.event_date) : null;
                  const dateStr = eventDate ? eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming';
                  const timeStr = eventDate ? eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                  return (
                    <div
                      key={event.id}
                      onClick={() => router.push(`/platform/events/${event.id}`)}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.08] flex items-center justify-between gap-3 cursor-pointer hover:border-[#5a32fa]/40 transition-all active:scale-[0.99]"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {event.cover_image_url ? (
                          <img
                            src={event.cover_image_url}
                            alt={event.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-white/10"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#5a32fa] to-[#ff2a5f] text-white flex flex-col items-center justify-center shrink-0">
                            <Calendar size={18} />
                            <span className="text-[10px] font-bold mt-0.5">
                              {eventDate ? eventDate.toLocaleDateString('en-US', { month: 'short' }) : 'EVENT'}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#5a32fa]/10 text-[#5a32fa] dark:bg-[#5a32fa]/20 dark:text-[#a78bfa]">
                              {event.category || 'Event'}
                            </span>
                            {event.is_virtual && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                Virtual
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                            {event.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock size={12} />
                            {dateStr} {timeStr && `• ${timeStr}`}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/platform/events/${event.id}`);
                        }}
                        className="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#5a32fa] text-white hover:bg-[#4825d1] active:scale-95 transition-all shadow-xs"
                      >
                        View
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. WEBINARS CATEGORY */}
            {activeCategory === 'webinars' && (
              <div className="space-y-3 pt-1">
                {currentItems.map((webinar) => (
                  <div
                    key={webinar.id}
                    onClick={() => router.push(webinar.meeting_url || `/platform/events/${webinar.id}`)}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.08] flex items-center justify-between gap-3 cursor-pointer hover:border-purple-500/40 transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                        <Video size={22} />
                      </div>
                      <div className="min-w-0">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-300">
                          CLE Masterclass
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                          {webinar.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400 truncate mt-0.5">
                          {webinar.description || 'Interactive virtual CLE roundtable and workshop'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#5a32fa] to-purple-600 text-white shadow-xs"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 4. NEWS CATEGORY */}
            {activeCategory === 'news' && (
              <div className="space-y-3 pt-1">
                {currentItems.map((article) => {
                  const articleDate = article.created_at ? new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';
                  return (
                    <div
                      key={article.id}
                      onClick={() => router.push(`/platform/resources/ip-news/${article.slug || article.id}`)}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.08] flex items-center justify-between gap-3 cursor-pointer hover:border-blue-500/40 transition-all active:scale-[0.99]"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                          <Newspaper size={22} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                              {article.organization || 'Global IP Wire'}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-gray-500">
                              • {articleDate}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5 leading-snug">
                            {article.title}
                          </h3>
                        </div>
                      </div>

                      <div className="shrink-0 text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 5. TOOLKITS CATEGORY */}
            {activeCategory === 'toolkits' && (
              <div className="space-y-3 pt-1">
                {currentItems.map((toolkit) => (
                  <div
                    key={toolkit.id}
                    onClick={() => {
                      if (toolkit.file_url) window.open(toolkit.file_url, '_blank');
                      else router.push(`/platform/resources`);
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.08] flex items-center justify-between gap-3 cursor-pointer hover:border-pink-500/40 transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/20">
                        <Wrench size={22} />
                      </div>
                      <div className="min-w-0">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-pink-500/10 text-pink-600 dark:text-pink-400">
                          {toolkit.category || 'Toolkit'}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                          {toolkit.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                          {toolkit.description || 'Practical IP checklists, templates, and frameworks.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-xs"
                    >
                      Access
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 6. FIRMS CATEGORY */}
            {activeCategory === 'firms' && (
              <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                {currentItems.map((firm) => (
                  <div
                    key={firm.id}
                    onClick={() => router.push(`/platform/business/${firm.slug || firm.id}`)}
                    className="flex items-center justify-between py-3 px-1 hover:bg-slate-50 dark:hover:bg-white/[0.02] rounded-2xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 shrink-0 overflow-hidden font-bold text-sm">
                        {firm.logo_url && firm.logo_url.startsWith('http') ? (
                          <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={20} className="text-slate-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {firm.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400 capitalize mt-0.5">
                          {firm.type ? firm.type.replace('_', ' ') : 'IP Practice'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-white/30 text-slate-800 dark:text-white"
                    >
                      View Firm
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 7. JOBS CATEGORY */}
            {activeCategory === 'jobs' && (
              <div className="space-y-3 pt-1">
                {currentItems.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => router.push(`/platform/jobs`)}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.08] flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-500/40 transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <Briefcase size={22} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 truncate">
                          {job.company} • {job.location || 'Remote'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
