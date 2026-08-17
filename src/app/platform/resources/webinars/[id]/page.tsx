'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Play, Calendar, Clock, MonitorPlay, Users, Radio, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function WebinarDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAppStore();
  const [webinar, setWebinar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('scheduled');
  const [recordings, setRecordings] = useState<any[]>([]);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    async function fetchWebinar() {
      setLoading(true);
      const { data } = await supabase
        .from('resources')
        .select('*, author:profiles(first_name, last_name, avatar_url, job_title)')
        .eq('id', params.id)
        .single();
        
      if (data) {
        setWebinar(data);
        setStatus(data.webinar_status || 'scheduled');
        
        // Fetch registrations
        const { count } = await supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('resource_id', data.id);
        if (count) setRegisteredCount(count);
        
        if (user?.id) {
          const { data: regData } = await supabase.from('event_registrations').select('*').eq('resource_id', data.id).eq('user_id', user.id).single();
          if (regData) setIsRegistered(true);
        }
      }
      setLoading(false);
    }
    fetchWebinar();
  }, [params.id, user?.id]);

  useEffect(() => {
    if (!webinar?.meetn_room_id || status === 'ended') return;

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/meetn/get-status?room_id=${webinar.meetn_room_id}`);
        const data = await res.json();
        if (data.success && data.data.status) {
          setStatus(data.data.status);
          if (data.data.status === 'ended' && webinar.id) {
            // Update DB if it changed
            await supabase.from('resources').update({ webinar_status: 'ended' }).eq('id', webinar.id);
            // Fetch recordings
            const recRes = await fetch(`/api/meetn/recordings?room_id=${webinar.meetn_room_id}`);
            const recData = await recRes.json();
            if (recData.success) {
              setRecordings(recData.data.recordings || []);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    const interval = setInterval(pollStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [webinar?.meetn_room_id, status, webinar?.id]);

  useEffect(() => {
    if (webinar?.scheduled_at && status === 'scheduled') {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(webinar.scheduled_at).getTime();
        const diff = target - now;
        if (diff <= 0) {
          setCountdown('Starting soon...');
          clearInterval(timer);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown(`${days > 0 ? days + 'd ' : ''}${hours}h ${mins}m ${secs}s`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [webinar?.scheduled_at, status]);

  useEffect(() => {
    // If initially loaded as ended, fetch recordings immediately
    if (webinar?.meetn_room_id && status === 'ended' && recordings.length === 0) {
      fetch(`/api/meetn/recordings?room_id=${webinar.meetn_room_id}`)
        .then(r => r.json())
        .then(d => {
          if (d.success) setRecordings(d.data.recordings || []);
        });
    }
  }, [webinar?.meetn_room_id, status, recordings.length]);

  const handleRegister = async () => {
    if (!user?.id) return;
    const { error } = await supabase.from('event_registrations').insert({
      resource_id: webinar.id,
      user_id: user.id
    });
    if (!error) {
      setIsRegistered(true);
      setRegisteredCount(prev => prev + 1);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]"><div className="animate-spin w-10 h-10 border-4 border-[#ff2a5f] border-t-transparent rounded-full"></div></div>;
  }

  if (!webinar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f172a] p-4 text-center">
        <MonitorPlay size={64} className="text-gray-300 dark:text-gray-700 mb-6" />
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Webinar Not Found</h1>
        <Link href="/platform/resources/webinars" className="bg-[#ff2a5f] text-white px-6 py-3 rounded-xl font-bold mt-4">Back to Webinars</Link>
      </div>
    );
  }

  const isHost = user?.id === webinar.author_id;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] font-sans pb-24">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[500px] flex flex-col justify-between">
        <div className="absolute inset-0 z-0 bg-black">
          <img src={webinar.url || "/resourceimg1.jpg"} alt={webinar.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-transparent dark:from-[#0f172a] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9fa] via-transparent dark:from-[#0f172a] to-transparent" />
        </div>

        <div className="relative z-10 p-6">
          <Link href="/platform/resources/webinars" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-gray-900 dark:text-white px-4 py-2 rounded-full font-bold text-sm transition-colors border border-gray-900/10 dark:border-white/10">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 w-full pb-12 flex flex-col md:flex-row gap-8 items-end justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              {status === 'scheduled' && <span className="bg-blue-500 text-white text-xs font-black uppercase px-3 py-1 rounded-sm shadow-md flex items-center gap-1.5"><Calendar size={14} /> Scheduled</span>}
              {status === 'live' && <span className="bg-red-500 text-white text-xs font-black uppercase px-3 py-1 rounded-sm shadow-md flex items-center gap-1.5 animate-pulse"><Radio size={14} /> LIVE NOW 🔴</span>}
              {status === 'ended' && <span className="bg-gray-500 text-white text-xs font-black uppercase px-3 py-1 rounded-sm shadow-md flex items-center gap-1.5"><Clock size={14} /> Ended</span>}
              
              <span className="bg-white/20 backdrop-blur-md text-gray-900 dark:text-white text-xs font-bold uppercase px-3 py-1 rounded-sm border border-gray-900/10 dark:border-white/10 flex items-center gap-1.5">
                <Users size={14} /> {registeredCount} Registered
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-4 drop-shadow-lg">
              {webinar.title}
            </h1>
            
            {status === 'scheduled' && countdown && (
              <div className="text-2xl font-black text-[#ff2a5f] drop-shadow-md mb-6 flex items-center gap-3">
                <Clock size={24} /> Starts in: {countdown}
              </div>
            )}
            
            <div className="flex items-center gap-4 mt-8">
              {status === 'live' && webinar.meetn_room_url && (
                <a href={webinar.meetn_room_url} target="_blank" rel="noreferrer" className="bg-[#ff2a5f] hover:bg-[#e02553] text-white px-8 py-4 rounded-full font-black flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl animate-pulse">
                  <Play size={20} fill="currentColor" /> JOIN NOW
                </a>
              )}
              
              {status === 'scheduled' && !isRegistered && !isHost && (
                <button onClick={handleRegister} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-black flex items-center gap-2 transition-transform hover:scale-105 shadow-xl">
                  Register for Webinar
                </button>
              )}
              
              {status === 'scheduled' && isRegistered && !isHost && (
                <div className="bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/50 px-8 py-4 rounded-full font-black flex items-center gap-2">
                  <Calendar size={20} /> Registered
                </div>
              )}
              
              {isHost && webinar.meetn_host_url && (status === 'scheduled' || status === 'live') && (
                <a href={webinar.meetn_host_url} target="_blank" rel="noreferrer" className="bg-gray-900 text-white dark:bg-white dark:text-black px-8 py-4 rounded-full font-black flex items-center gap-2 transition-transform hover:scale-105 shadow-xl">
                  <MonitorPlay size={20} /> Start / Host Webinar
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1 space-y-12">
          
          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">About this session</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {webinar.description || "No description provided for this session."}
            </div>
          </section>

          {status === 'ended' && (
            <section className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Play className="text-[#ff2a5f]" fill="currentColor" /> Recordings
              </h2>
              
              {recordings.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400 italic">No recordings available yet. They will appear here once processed.</div>
              ) : (
                <div className="space-y-4">
                  {recordings.map((rec, i) => (
                    <a key={rec.id} href={rec.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-[#ff2a5f] transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#ff2a5f]/10 text-[#ff2a5f] rounded-full flex items-center justify-center group-hover:bg-[#ff2a5f] group-hover:text-white transition-colors">
                          <Play size={20} fill="currentColor" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">Session Recording Part {i + 1}</div>
                          <div className="text-sm text-gray-500">Duration: {Math.floor(rec.duration_seconds / 60)} mins</div>
                        </div>
                      </div>
                      <ExternalLink size={20} className="text-gray-400 group-hover:text-[#ff2a5f]" />
                    </a>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
            <h3 className="font-black text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-sm text-gray-500">Host</h3>
            
            {webinar.author ? (
              <Link href={`/platform/profile/${webinar.author_id}`} className="flex items-center gap-4 group">
                <img src={webinar.author.avatar_url || `https://ui-avatars.com/api/?name=${webinar.author.first_name}+${webinar.author.last_name}`} alt="Host Avatar" className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-[#ff2a5f] transition-colors">
                    {webinar.author.first_name} {webinar.author.last_name}
                  </div>
                  <div className="text-gray-500 text-sm">{webinar.author.job_title}</div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-400">
                  <Users size={24} />
                </div>
                <div className="font-bold text-gray-400">Unknown Host</div>
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
            <h3 className="font-black text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-sm text-gray-500">Details</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Scheduled For</div>
                <div className="font-bold text-gray-900 dark:text-white">{new Date(webinar.scheduled_at).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Duration</div>
                <div className="font-bold text-gray-900 dark:text-white">{webinar.duration_minutes || 60} minutes</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Attendees</div>
                <div className="font-bold text-gray-900 dark:text-white">{webinar.max_attendees || 100} slots</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Platform</div>
                <div className="font-bold text-gray-900 dark:text-white capitalize">{webinar.webinar_platform || 'meetn'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
