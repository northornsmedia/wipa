'use client';

import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import React, { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { 
  ArrowLeft, 
  Play, 
  Calendar, 
  Clock, 
  MonitorPlay, 
  Users, 
  Radio, 
  ExternalLink, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  FileText, 
  Tv,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function WebinarDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Properly unwrap params for Next.js 15/16 App Router
  const resolvedParams = use(params as Promise<{ id: string }>);
  const rawId = resolvedParams?.id;

  const { user } = useAppStore();
  const [webinar, setWebinar] = useState<any>(null);
  const [relatedWebinars, setRelatedWebinars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('upcoming');
  const [recordings, setRecordings] = useState<any[]>([]);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [countdown, setCountdown] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchWebinar() {
      if (!rawId) return;
      setLoading(true);
      try {
        // 1. Try fetching by ID or Slug from dedicated webinars table
        let queryData = null;

        // Check if rawId is a valid UUID
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId);

        if (isUuid) {
          const { data: webById } = await supabase
            .from('webinars')
            .select('*')
            .eq('id', rawId)
            .maybeSingle();
          queryData = webById;
        }

        if (!queryData) {
          const { data: webBySlug } = await supabase
            .from('webinars')
            .select('*')
            .eq('slug', rawId)
            .maybeSingle();
          queryData = webBySlug;
        }

        // 2. Fallback to resources table if not in webinars table
        if (!queryData && isUuid) {
          const { data: resById } = await supabase
            .from('resources')
            .select('*')
            .eq('id', rawId)
            .maybeSingle();
          queryData = resById;
        }

        if (!queryData) {
          const { data: resBySlug } = await supabase
            .from('resources')
            .select('*')
            .eq('slug', rawId)
            .maybeSingle();
          queryData = resBySlug;
        }

        if (queryData) {
          setWebinar(queryData);
          setStatus(queryData.webinar_status || 'upcoming');

          // Fetch registrations count
          const { count } = await supabase
            .from('event_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('resource_id', queryData.id);
          if (count) setRegisteredCount(count);

          if (user?.id) {
            const { data: regData } = await supabase
              .from('event_registrations')
              .select('*')
              .eq('resource_id', queryData.id)
              .eq('user_id', user.id)
              .maybeSingle();
            if (regData) setIsRegistered(true);
          }

          // Fetch related webinars
          const { data: related } = await supabase
            .from('webinars')
            .select('*')
            .neq('id', queryData.id)
            .limit(4);
          if (related) setRelatedWebinars(related);
        }
      } catch (err) {
        console.error('Error fetching webinar detail:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWebinar();
  }, [rawId, user?.id]);

  // Countdown logic for scheduled / upcoming webinars
  useEffect(() => {
    if (webinar?.scheduled_at) {
      const targetDate = new Date(webinar.scheduled_at).getTime();
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;
        if (diff <= 0) {
          setCountdown('Starting Now / In Session');
          clearInterval(timer);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown(`${days > 0 ? `${days}d ` : ''}${hours}h ${mins}m ${secs}s`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [webinar?.scheduled_at]);

  const handleRegister = async () => {
    if (!user?.id || !webinar?.id) return;
    const { error } = await supabase.from('event_registrations').insert({
      resource_id: webinar.id,
      user_id: user.id
    });
    if (!error) {
      setIsRegistered(true);
      setRegisteredCount(prev => prev + 1);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0c]">
        <DotmCircular7 size={40} className="text-[#6600FF]" />
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0a0a0c] p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#ff2a5f]/10 text-[#ff2a5f] flex items-center justify-center mb-6 shadow-xl shadow-[#ff2a5f]/10">
          <Tv size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Webinar Session Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
          The requested webinar or masterclass may have been rescheduled or moved to another topic.
        </p>
        <Link 
          href="/platform/resources/webinars" 
          className="bg-gradient-to-r from-[#ff2a5f] to-[#ff477e] hover:from-[#e02553] hover:to-[#ff2a5f] text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-[#ff2a5f]/25 transition-all"
        >
          Browse All Webinars
        </Link>
      </div>
    );
  }

  const joinUrl = webinar.url || webinar.meetn_room_url || webinar.external_url || '#';
  const coverImage = webinar.cover_image_url || webinar.image || '/resourceimg1.jpg';
  const speakerName = webinar.author_name || 'Dr. Alan Turing, Esq.';
  const speakerTitle = webinar.author_title || 'Global IP Counsel & Expert';
  const firmName = webinar.organization || 'WIPA IP Network';
  const subcategory = webinar.subcategory || webinar.topic || 'IP Strategy';
  const formatType = webinar.resource_type || webinar.type || 'Upcoming Webinar';
  const isLive = webinar.webinar_status === 'live';
  const isEnded = webinar.webinar_status === 'ended';

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans pb-28">
      
      {/* Top Header & Breadcrumb */}
      <div className="border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c0c0e] sticky top-0 z-30 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link 
            href="/platform/resources/webinars" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-[#ff2a5f] dark:hover:text-[#ff2a5f] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Webinars & Learning
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-bold transition-colors border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300"
            >
              <Share2 size={14} /> {copied ? 'Link Copied!' : 'Share'}
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-[#ff2a5f]/10 text-[#ff2a5f] border border-[#ff2a5f]/20">
              <Sparkles size={12} /> {subcategory}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* Webinar artwork hero */}
        <div className="relative w-full aspect-video md:aspect-[21/9] max-h-[540px] rounded-3xl overflow-hidden bg-black border border-gray-200 dark:border-white/10 shadow-2xl group">
          <img 
            src={coverImage} 
            alt={webinar.title} 
            className="w-full h-full object-cover opacity-85 group-hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => { e.currentTarget.src = '/resourceimg1.jpg'; }}
          />

          {/* Gradients Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/30" />

          {/* Top Badges */}
          <div className="absolute top-6 left-6 flex items-center gap-3">
            {isLive ? (
              <span className="bg-red-500 text-white text-xs font-black uppercase px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 animate-pulse">
                <Radio size={14} /> LIVE STREAMING NOW
              </span>
            ) : isEnded ? (
              <span className="bg-gray-800 text-white text-xs font-black uppercase px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 border border-white/10">
                <Clock size={14} /> SESSION RECORDING
              </span>
            ) : (
              <span className="bg-[#ff2a5f] text-white text-xs font-black uppercase px-3.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 shadow-[#ff2a5f]/30">
                <Calendar size={14} /> {formatType}
              </span>
            )}

            {registeredCount > 0 && (
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/15 flex items-center gap-1.5">
                <Users size={13} /> {registeredCount} Enrolled
              </span>
            )}
          </div>

          {/* Bottom Hero Title & Metadata */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="text-xs font-bold text-[#ff2a5f] uppercase tracking-wider">
                {subcategory} • {webinar.read_time || `${webinar.duration_minutes || 45} mins`}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-md">
                {webinar.title}
              </h1>
            </div>

            {/* Countdown Badge */}
            {countdown && !isEnded && (
              <div className="bg-black/80 backdrop-blur-md border border-[#ff2a5f]/40 px-5 py-3 rounded-2xl shrink-0">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                  <Clock size={11} className="text-[#ff2a5f]" /> Starts In
                </div>
                <div className="text-base font-black text-[#ff2a5f] font-mono">
                  {countdown}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Overview / Summary Box */}
            <div className="bg-white dark:bg-[#121215] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
                <Tv className="text-[#ff2a5f]" size={22} /> About this Masterclass & Session
              </h2>

              <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                {webinar.summary || webinar.description || "Comprehensive deep dive into contemporary intellectual property law, strategy, and cross-border innovation trends."}
              </p>

              {/* Action Buttons Bar */}
              <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center gap-4">
                {joinUrl && joinUrl !== '#' ? (
                  <a
                    href={joinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff2a5f] to-[#ff477e] hover:from-[#e02553] hover:to-[#ff2a5f] text-white font-extrabold text-sm shadow-xl shadow-[#ff2a5f]/25 transition-all transform hover:scale-[1.02]"
                  >
                    <Play size={18} fill="currentColor" /> {isLive ? "Join Live Stream Now" : isEnded ? "Watch Session Recording" : "Access Webinar Room"}
                  </a>
                ) : null}

                {!isRegistered ? (
                  <button
                    onClick={handleRegister}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold text-sm transition-colors border border-gray-200 dark:border-white/10"
                  >
                    <Calendar size={18} className="text-[#ff2a5f]" /> Register / Save My Spot
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-500/30">
                    <CheckCircle2 size={18} /> You are Registered
                  </div>
                )}
              </div>
            </div>

            {/* Agenda Breakdown & Learning Objectives */}
            {webinar.content && (
              <div className="bg-white dark:bg-[#121215] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
                  <FileText className="text-[#ff2a5f]" size={22} /> Key Discussion Points & Takeaways
                </h2>

                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                  {webinar.content}
                </div>
              </div>
            )}

            {/* Related Sessions */}
            {relatedWebinars.length > 0 && (
              <div className="space-y-6 pt-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
                  <Sparkles className="text-[#ff2a5f]" size={20} /> More in Webinars & Learning
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedWebinars.map((item) => (
                    <Link
                      key={item.id}
                      href={`/platform/resources/webinars/${item.id}`}
                      className="group bg-white dark:bg-[#121215] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-[#ff2a5f]/40 transition-all flex flex-col"
                    >
                      <div className="relative aspect-video bg-gray-100 dark:bg-white/5 overflow-hidden">
                        <img 
                          src={item.cover_image_url || '/resourceimg1.jpg'} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded">
                          {item.read_time || '45:00'}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#ff2a5f] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-semibold">{item.author_name || 'WIPA Expert'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Column (1 Col) */}
          <div className="space-y-8">
            
            {/* Featured Speaker Card */}
            <div className="bg-white dark:bg-[#121215] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Featured Host / Speaker</span>
                <span className="w-2 h-2 rounded-full bg-[#ff2a5f]" />
              </div>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff2a5f] to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0 overflow-hidden">
                  {webinar.author_avatar ? (
                    <img src={webinar.author_avatar} alt={speakerName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{speakerName.charAt(0)}</span>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-gray-900 dark:text-white text-base leading-snug">
                    {speakerName}
                  </h3>
                  <p className="text-xs font-bold text-[#ff2a5f]">
                    {speakerTitle}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <Building2 size={12} /> {firmName}
                  </p>
                </div>
              </div>
            </div>

            {/* Session Metadata & Schedule Details */}
            <div className="bg-white dark:bg-[#121215] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-5">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-4">
                Session Logistics
              </h3>

              <div className="space-y-4 text-xs font-semibold">
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-[#ff2a5f] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-[11px]">Scheduled Date & Time</p>
                    <p className="text-gray-900 dark:text-white font-bold">
                      {webinar.scheduled_at ? new Date(webinar.scheduled_at).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZoneName: 'short'
                      }) : 'On Demand / Flexible Access'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-[#ff2a5f] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-[11px]">Session Duration</p>
                    <p className="text-gray-900 dark:text-white font-bold">
                      {webinar.read_time || `${webinar.duration_minutes || 60} Minutes`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users size={16} className="text-[#ff2a5f] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-[11px]">Attendee Capacity</p>
                    <p className="text-gray-900 dark:text-white font-bold">
                      {webinar.max_attendees || 500} Participants Max
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MonitorPlay size={16} className="text-[#ff2a5f] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-[11px]">Broadcast Format</p>
                    <p className="text-gray-900 dark:text-white font-bold capitalize">
                      {webinar.resource_type || 'Live Virtual Interactive Room'}
                    </p>
                  </div>
                </div>
              </div>

              {joinUrl && joinUrl !== '#' && (
                <div className="pt-3">
                  <a
                    href={joinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-[#ff2a5f] hover:text-white dark:hover:bg-[#ff2a5f] text-gray-900 dark:text-white font-extrabold text-xs transition-all border border-gray-200 dark:border-white/10"
                  >
                    <ExternalLink size={14} /> Open Live Meeting Link
                  </a>
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
