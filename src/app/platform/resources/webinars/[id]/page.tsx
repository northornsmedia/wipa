'use client';

import React from 'react';
import { ArrowLeft, Clock, User, Calendar, Download, ChevronRight, Video, PlayCircle, Users, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function WebinarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  // Mock data for the specific webinar resource
  const webinar = {
    id: id,
    title: "AI in Patent Law: Opportunities and Risks",
    organisation: "Global IP Forum",
    speakers: [
      {
        name: "Dr. Alan Turing, Esq.",
        role: "Chief AI Counsel, Tech IP Group",
        bio: "Dr. Turing brings 15 years of experience intersecting computer science and patent litigation.",
        image: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
      },
      {
        name: "Sarah Jenkins",
        role: "Partner, LegalTech Associates",
        bio: "Sarah specializes in advising startups on building robust IP portfolios using AI tools.",
        image: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
      }
    ],
    time: "Oct 24, 2026 • 10:00 AM EST",
    duration: "60 minutes",
    type: "Upcoming Webinar",
    overview: "As Artificial Intelligence continues to revolutionize industries, its impact on Intellectual Property law is undeniable. This exclusive webinar dives deep into how AI is changing the landscape of patent drafting, prior art searching, and litigation strategies. Join our panel of experts as they discuss the immediate opportunities and the hidden risks of integrating AI into your legal practice.",
    topics: [
      "The role of Generative AI in drafting patent claims.",
      "Navigating copyright issues with AI-generated outputs.",
      "Ethical considerations and bias in AI tools for legal research.",
      "Future regulatory landscapes for AI technologies."
    ],
    downloads: [
      { title: "Presentation Slides (PDF)", type: "PDF", size: "2.4 MB" },
      { title: "AI in IP Resource Guide", type: "Doc", size: "500 KB" }
    ],
    isVideoAvailable: false // Set to true if it's a recording
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20">
      
      {/* Top Navigation & Video/Hero Area */}
      <div className="bg-gray-900 border-b border-white/10 pt-8 pb-12">
        <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">
          <Link href="/platform/resources/webinars" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ff90e8] font-bold text-sm mb-8 transition-colors">
            <ArrowLeft size={16} />
            Back to Webinars Hub
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Video / Placeholder */}
            <div className="flex-1">
              <div className="w-full aspect-video bg-black rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl group flex items-center justify-center">
                {webinar.isVideoAvailable ? (
                  <>
                    <img src="/resourceimg1.jpg" alt="Video thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <button className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-[#ff90e8] flex items-center justify-center text-gray-900 shadow-xl group-hover:scale-110 transition-transform">
                        <PlayCircle size={40} className="ml-1" />
                      </div>
                    </button>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <Calendar size={64} className="text-white/20 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Upcoming Live Session</h3>
                    <p className="text-gray-400">{webinar.time}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Title & CTA */}
            <div className="w-full lg:w-[400px] flex flex-col justify-center">
              <div className="flex items-center gap-3 text-sm font-bold text-[#ff90e8] mb-4">
                <span className="bg-[#ff90e8]/20 px-3 py-1 rounded-full uppercase tracking-wider text-[10px] text-[#ff90e8]">{webinar.type}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                {webinar.title}
              </h1>

              <div className="flex items-center gap-2 text-gray-400 mb-8">
                <Users size={18} className="text-[#ff90e8]" />
                <span>Hosted by <strong className="text-white">{webinar.organisation}</strong></span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Date & Time</span>
                    <span className="text-white font-bold">{webinar.time}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-gray-400 text-sm">Duration</span>
                    <span className="text-white font-bold">{webinar.duration}</span>
                  </div>
                </div>
                
                <button className="w-full bg-[#ff90e8] hover:bg-[#e87bd2] text-gray-900 font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,144,232,0.3)] hover:shadow-[0_0_30px_rgba(255,144,232,0.5)] flex items-center justify-center gap-2 group">
                  {webinar.isVideoAvailable ? 'Watch Now' : 'Register Now'} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 pt-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column (Content) */}
          <div className="flex-1">
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-gray-200 dark:border-white/10 shadow-sm mb-8">
              <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-4">Session Overview</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-8">
                {webinar.overview}
              </p>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <CheckCircle className="text-[#ff90e8]" size={20} /> Key Topics Covered
              </h3>
              <ul className="space-y-4 mb-2">
                {webinar.topics.map((topic, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#0f172a] p-4 rounded-xl border border-gray-100 dark:border-white/5">
                    <span className="w-6 h-6 rounded-full bg-[#ff90e8]/20 text-[#ff90e8] flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                    <span className="font-medium pt-0.5">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Speaker Profiles */}
            <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
              <User className="text-[#ff90e8]" size={24} /> Meet the Speakers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {webinar.speakers.map((speaker, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <img src={speaker.image} alt={speaker.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#ff90e8]" />
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{speaker.name}</h4>
                      <p className="text-[#ff90e8] text-sm font-bold">{speaker.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{speaker.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-[350px] flex flex-col gap-6">
            
            {/* Downloads Card */}
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Download size={20} className="text-[#ff90e8]" /> Session Materials
              </h3>
              <p className="text-sm text-gray-500 mb-4">Slides and resources will be available to registered attendees.</p>
              <div className="space-y-3">
                {webinar.downloads.map((doc, idx) => (
                  <a key={idx} href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f172a] border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-colors group">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400 group-hover:text-[#ff90e8] transition-colors" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#ff90e8] transition-colors">{doc.title}</p>
                        <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Related Resources */}
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Video size={20} className="text-[#ff90e8]" /> Related Webinars
              </h3>
              <div className="space-y-4">
                <Link href="/platform/resources/webinars/2" className="block group">
                  <span className="text-[10px] font-black uppercase text-[#0984e3] mb-1 block">Masterclass</span>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#ff90e8] transition-colors line-clamp-2">Mastering IP Litigation Tactics</h4>
                </Link>
                <div className="border-t border-gray-100 dark:border-white/5"></div>
                <Link href="/platform/resources/webinars/3" className="block group">
                  <span className="text-[10px] font-black uppercase text-[#e84393] mb-1 block">Panel Discussion</span>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#ff90e8] transition-colors line-clamp-2">The Future of Trademarks in the Metaverse</h4>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
