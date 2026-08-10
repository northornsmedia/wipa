'use client';

import React, { useState } from 'react';
import { ArrowLeft, PlayCircle, Clock, Users, Mic, AlignLeft, ChevronDown, ChevronUp, Music, Headphones } from 'lucide-react';
import Link from 'next/link';

export default function PodcastDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Mock data for the specific podcast/video resource
  const episode = {
    id: id,
    title: "The IP Innovators Series: AI and the Future of Copyright",
    type: "Podcast Episode",
    duration: "45 min listen",
    publishedAt: "2 days ago",
    host: {
      name: "WIPA Media",
      role: "Host",
      image: "https://i.pravatar.cc/150?img=12"
    },
    guest: {
      name: "Dr. Elena Rostova",
      role: "AI Law Expert, Stanford",
      image: "https://i.pravatar.cc/150?img=5"
    },
    description: "In this deeply technical yet accessible episode, Dr. Elena Rostova joins WIPA Media to unpack the complex collision between Generative AI and traditional copyright systems. We explore recent landmark court cases, the concept of 'fair use' in training datasets, and practical strategies for artists and corporations looking to protect their IP in an AI-driven landscape.",
    transcriptSummary: [
      { timestamp: "00:00", text: "Introduction and welcome to Dr. Elena Rostova." },
      { timestamp: "05:12", text: "The fundamental mismatch between 20th-century copyright law and 21st-century machine learning." },
      { timestamp: "18:45", text: "Deep dive into the NYT vs. OpenAI lawsuit and its potential global implications." },
      { timestamp: "29:30", text: "How in-house counsel should advise engineering teams on building proprietary datasets." },
      { timestamp: "41:15", text: "Closing thoughts and predictions for the next 5 years." }
    ],
    fullTranscript: `
      [00:00] Host: Welcome back to the IP Innovators Series. Today we are tackling the elephant in the room: Generative AI...
      [00:45] Guest: Thank you for having me. It's a fascinating time to be an IP lawyer, to say the least.
      [01:10] Host: Let's start with the basics. When an AI generates an image, who owns it?
      [01:25] Guest: Well, according to the US Copyright Office, no one. Human authorship is currently a prerequisite...
      [transcript truncated for demo purposes]
    `,
    audioUrl: "#", // Placeholder for actual audio file
    related: [
      { id: '5', title: "Audio Interview: Trademark Distinctiveness in Web3", type: "Audio Interview" },
      { id: '3', title: "Expert Discussion: Navigating the UPC", type: "Expert Discussion" }
    ]
  };

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
            <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] shadow-lg flex items-center justify-center shrink-0">
              <Headphones size={64} className="text-white opacity-90" />
            </div>
            
            <div className="flex-1 w-full text-center md:text-left">
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">{episode.title}</h2>
              <p className="text-[#f59e0b] font-bold text-sm mb-6">{episode.host.name} ft. {episode.guest.name}</p>
              
              {/* Fake Audio Player UI */}
              <div className="flex items-center gap-4">
                <button className="w-14 h-14 rounded-full bg-[#f59e0b] text-white flex items-center justify-center hover:bg-[#d97706] transition-colors shrink-0 shadow-md">
                  <PlayCircle size={32} className="ml-1" />
                </button>
                
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-2 bg-gray-100 dark:bg-[#0f172a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#f59e0b] w-1/3 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-400">
                    <span>15:00</span>
                    <span>45:00</span>
                  </div>
                </div>
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
            {episode.related.map(item => (
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
