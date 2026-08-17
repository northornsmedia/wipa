// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { ArrowLeft, PlayCircle, Clock, Users, Mic, AlignLeft, ChevronDown, ChevronUp, Music, Headphones } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PodcastDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [showTranscript, setShowTranscript] = useState(false);
  const [episode, setEpisode] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data: podcast } = await supabase
        .from('podcasts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (podcast) {
        setEpisode({
          id: podcast.id,
          title: podcast.title,
          type: podcast.content_type || "Podcast Episode",
          duration: podcast.duration || "N/A",
          publishedAt: new Date(podcast.created_at).toLocaleDateString(),
          host: {
            name: podcast.host_name || "Unknown",
            role: "Host",
            image: podcast.cover_image_url || "https://i.pravatar.cc/150?img=12"
          },
          guest: {
            name: podcast.guest_names || "Unknown",
            role: "Guest",
            image: "https://i.pravatar.cc/150?img=5"
          },
          description: podcast.description || "No description provided.",
          transcriptSummary: [],
          fullTranscript: podcast.transcript || "No transcript available.",
          audioUrl: podcast.media_file_url || "#",
          image: podcast.cover_image_url || null
        });
        
        // Fetch related
        const { data: relatedData } = await supabase
          .from('podcasts')
          .select('id, title, content_type')
          .neq('id', id)
          .limit(2);
          
        if (relatedData) {
          setRelated(relatedData.map(r => ({
            id: r.id,
            title: r.title,
            type: r.content_type
          })));
        }
      }
      setIsLoading(false);
    }
    fetchData();
  }, [id]);

  if (isLoading || !episode) {
    return <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex items-center justify-center font-bold text-gray-500">Loading Episode...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20">
      
      {/* Header Area */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 pt-8 pb-12 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f59e0b]/10 blur-[100px] rounded-full transform translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>

        <div className="w-full max-w-[900px] mx-auto p-4 md:p-6 lg:p-8 relative z-10">
          <Link href="/platform/resources/podcasts-conversations" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#f59e0b] font-bold text-sm mb-10 transition-colors">
            <ArrowLeft size={16} />
            Back to Podcasts & Conversations
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold mb-6">
            <span className="bg-[#f59e0b]/10 px-3 py-1 rounded-md uppercase tracking-wider text-[10px] text-[#f59e0b]">{episode.type}</span>
            <span className="text-gray-500 dark:text-gray-400 font-medium">{episode.publishedAt}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-8 leading-tight">
            {episode.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-100 dark:border-white/10 pt-6">
            <div className="flex items-center gap-6">
              {/* Host & Guest Avatars */}
              <div className="flex items-center">
                <img src={episode.host.image} alt={episode.host.name} className="w-12 h-12 rounded-full border-2 border-white dark:border-[#1e293b] relative z-10" />
                <img src={episode.guest.image} alt={episode.guest.name} className="w-12 h-12 rounded-full border-2 border-white dark:border-[#1e293b] -ml-4 relative z-0" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  <span className="text-gray-500">Host:</span> {episode.host.name}
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                  <span className="text-gray-500">Guest:</span> {episode.guest.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold text-sm bg-gray-50 dark:bg-[#0f172a] px-4 py-2 rounded-xl shrink-0">
              <Clock size={16} className="text-[#f59e0b]" />
              {episode.duration}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[900px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        {/* Media Player Card */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-white/10 mb-10 transform -translate-y-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] shadow-lg flex items-center justify-center shrink-0 overflow-hidden relative">
              {episode.image ? (
                <img src={episode.image} alt={episode.title} className="w-full h-full object-cover" />
              ) : (
                <Headphones size={64} className="text-white opacity-90" />
              )}
            </div>
            
            <div className="flex-1 w-full text-center md:text-left">
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">{episode.title}</h2>
              <p className="text-[#f59e0b] font-bold text-sm mb-6">{episode.host.name} ft. {episode.guest.name}</p>
              
              {/* Audio Player */}
              <div className="flex items-center gap-4 w-full">
                {episode.audioUrl !== '#' && (
                  <audio controls className="w-full h-12 outline-none" src={episode.audioUrl} />
                )}
                {episode.audioUrl === '#' && (
                  <div className="w-full bg-gray-100 dark:bg-[#0f172a] text-center p-3 rounded-xl text-gray-500 font-bold text-sm">
                    No Audio Available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 -mt-6">
          
          {/* Description */}
          <div className="md:col-span-2 bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 shadow-sm border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Mic className="text-[#f59e0b]" size={20} /> Episode Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {episode.description}
            </p>
          </div>

          {/* Guest Profile Mini */}
          <div className="bg-gradient-to-br from-[#f59e0b]/10 to-transparent rounded-[2rem] p-8 border border-[#f59e0b]/20 shadow-sm flex flex-col items-center text-center">
            <img src={episode.guest.image} alt={episode.guest.name} className="w-24 h-24 rounded-full border-4 border-white dark:border-[#1e293b] shadow-md mb-4" />
            <h3 className="font-black text-lg text-gray-900 dark:text-gray-100">{episode.guest.name}</h3>
            <p className="text-[#f59e0b] font-bold text-sm mb-4">{episode.guest.role}</p>
            <button className="mt-auto px-4 py-2 w-full bg-white dark:bg-[#1e293b] border border-[#f59e0b]/30 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:border-[#f59e0b] hover:text-[#f59e0b] transition-all text-sm">
              View Full Profile
            </button>
          </div>
        </div>

        {/* Transcript / Timestamps */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 shadow-sm border border-gray-200 dark:border-white/10 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <AlignLeft className="text-[#f59e0b]" size={24} /> Key Moments & Transcript
            </h2>
            <button 
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-2 text-sm font-bold text-[#f59e0b] hover:text-[#d97706] transition-colors bg-[#f59e0b]/10 px-4 py-2 rounded-lg"
            >
              {showTranscript ? (
                <>Hide Full Transcript <ChevronUp size={16} /></>
              ) : (
                <>Read Full Transcript <ChevronDown size={16} /></>
              )}
            </button>
          </div>
          
          {!showTranscript ? (
            <div className="space-y-4 relative before:absolute before:inset-y-2 before:left-[35px] before:w-0.5 before:bg-gray-100 dark:before:bg-white/5">
              {episode.transcriptSummary.map((item, idx) => (
                <div key={idx} className="relative flex items-center gap-6">
                  <div className="w-20 bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-lg py-1.5 px-3 text-center text-sm font-black text-gray-600 dark:text-gray-300 relative z-10">
                    {item.timestamp}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-[#0f172a] p-6 rounded-2xl border border-gray-200 dark:border-white/10">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {episode.fullTranscript}
              </pre>
            </div>
          )}
        </div>

        {/* Related Episodes */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-12">
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
            <Music className="text-[#f59e0b]" size={24} /> More Episodes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map(item => (
              <Link key={item.id} href={`/platform/resources/podcasts-conversations/${item.id}`} className="group block">
                <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1e293b] hover:border-[#f59e0b]/50 hover:shadow-md transition-all flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center shrink-0 text-gray-400 group-hover:text-[#f59e0b] group-hover:bg-[#f59e0b]/10 transition-colors">
                    <PlayCircle size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#f59e0b] mb-1 block">{item.type}</span>
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-[#f59e0b] transition-colors line-clamp-2">
                      {item.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
