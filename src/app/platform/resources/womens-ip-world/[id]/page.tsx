'use client';

import React from 'react';
import { ArrowLeft, BookOpen, Download, FileText, Video, Award, ChevronRight, User, Users, Star } from 'lucide-react';
import Link from 'next/link';

export default function WomensIPWorldDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  // Mock data for the specific Women's IP World resource
  const edition = {
    id: id,
    title: "Women's IP World Annual 2026",
    editionYear: "2026 Edition",
    type: "Annual Issue",
    coverImage: "/Womens-IP-World-Award.webp",
    overview: "The 2026 edition of Women's IP World celebrates the phenomenal achievements of female leaders across the global intellectual property landscape. This year's issue focuses on the intersection of IP and emerging technologies, featuring exclusive interviews with trailblazers who are reshaping patent law, trademark strategies, and diversity initiatives worldwide.",
    featuredContent: [
      "Top 50 Women in Tech Law Rankings",
      "Navigating the Metaverse: Trademark Challenges",
      "The State of Diversity & Inclusion in Global IP Firms"
    ],
    interviews: [
      { name: "Eleanor Vance", role: "Managing Partner, Vance & Co.", topic: "Breaking the Glass Ceiling" },
      { name: "Dr. Aisha Rahman", role: "Chief Patent Counsel", topic: "AI & Biotech Innovations" },
      { name: "Chloe Lin", role: "Head of Trademarks", topic: "Global Brand Protection" }
    ],
    previousEditions: [
      { year: "2025 Edition", title: "Global Innovators", link: "#" },
      { year: "2024 Edition", title: "Resilience in IP", link: "#" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20">
      
      {/* Top Header & Cover Area */}
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-b border-white/10 pt-8 pb-16 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#6366f1]/5 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
        
        <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 relative z-10">
          <Link href="/platform/resources/womens-ip-world" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#6366f1] font-bold text-sm mb-8 transition-colors">
            <ArrowLeft size={16} />
            Back to Women's IP World
          </Link>
          
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            {/* Cover Image */}
            <div className="w-full md:w-[350px] shrink-0">
              <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                <img src={edition.coverImage} alt={edition.title} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-[#6366f1]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <button className="bg-white text-gray-900 font-bold py-3 px-6 rounded-xl shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <BookOpen size={18} /> Read Preview
                  </button>
                </div>
              </div>
            </div>

            {/* Title & CTA */}
            <div className="flex-1 flex flex-col justify-center pt-4 md:pt-10">
              <div className="flex items-center gap-3 text-sm font-bold text-[#6366f1] mb-4">
                <span className="bg-[#6366f1]/20 px-3 py-1 rounded-full uppercase tracking-wider text-[10px] text-[#6366f1]">{edition.type}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{edition.editionYear}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                {edition.title}
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-2xl">
                Discover the insights, stories, and leadership journeys of the women shaping the future of Intellectual Property.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 group">
                  <Download size={20} /> Read / Download Annual
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2">
                  <Star size={20} /> Bookmark Issue
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
              <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-4">Issue Overview</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-8">
                {edition.overview}
              </p>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Award className="text-[#6366f1]" size={20} /> Featured Content
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                {edition.featuredContent.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#0f172a] p-4 rounded-xl border border-gray-100 dark:border-white/5">
                    <FileText className="text-[#6366f1] shrink-0 mt-0.5" size={18} />
                    <span className="font-bold text-gray-800 dark:text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Interviews Section */}
            <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Users className="text-[#6366f1]" size={24} /> Exclusive Interviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {edition.interviews.map((interview, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col gap-4 group cursor-pointer hover:border-[#6366f1]/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg group-hover:text-[#6366f1] transition-colors">{interview.name}</h4>
                      <p className="text-gray-500 text-sm font-medium mb-3">{interview.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center text-[#6366f1] group-hover:bg-[#6366f1] group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                  <div className="bg-[#6366f1]/5 rounded-xl p-3 border border-[#6366f1]/10">
                    <p className="text-sm font-bold text-[#6366f1] uppercase tracking-wide text-[10px] mb-1">Topic</p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{interview.topic}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-[350px] flex flex-col gap-6">
            
            {/* Previous Editions */}
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-black text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <BookOpen size={20} className="text-[#6366f1]" /> Previous Editions
              </h3>
              <div className="space-y-4">
                {edition.previousEditions.map((prev, idx) => (
                  <Link key={idx} href={prev.link} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f172a] border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-colors group">
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#6366f1] transition-colors">{prev.year}</p>
                      <p className="text-xs text-gray-500 font-medium">{prev.title}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-[#6366f1]" />
                  </Link>
                ))}
              </div>
              <button className="w-full mt-4 text-[#6366f1] font-bold text-sm py-2 hover:bg-[#6366f1]/5 rounded-lg transition-colors">
                View All Archive &rarr;
              </button>
            </div>

            {/* Related Profiles Quick Links */}
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <User size={20} className="text-[#6366f1]" /> Related Profiles
              </h3>
              <div className="space-y-4">
                <Link href="#" className="block group">
                  <span className="text-[10px] font-black uppercase text-pink-500 mb-1 block">Spotlight</span>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#6366f1] transition-colors line-clamp-2">Breaking the Glass Ceiling in Patent Law</h4>
                </Link>
                <div className="border-t border-gray-100 dark:border-white/5"></div>
                <Link href="#" className="block group">
                  <span className="text-[10px] font-black uppercase text-blue-500 mb-1 block">Video Interview</span>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#6366f1] transition-colors line-clamp-2">Fireside Chat: Navigating Global Portfolios</h4>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
