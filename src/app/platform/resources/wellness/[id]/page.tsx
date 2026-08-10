'use client';

import React from 'react';
import { ArrowLeft, BookOpen, Download, FileText, Video, Headphones, CheckSquare, BarChart, ExternalLink, Play, User } from 'lucide-react';
import Link from 'next/link';

// Using a mock ID to simulate dynamic data
export default function WellnessResourceDetail({ params }: { params: { id: string } }) {
  
  // Mock Data
  const resource = {
    id: params.id || '1',
    title: "Navigating Burnout: A Practical Guide for IP Professionals",
    type: "Wellness Webinar",
    topic: "Mental Health & Burnout",
    category: "Wellness & Wellbeing",
    color: "#00d26a",
    expert: {
      name: "Dr. Elena Rostova",
      role: "Clinical Psychologist & Wellbeing Consultant",
      image: "https://i.pravatar.cc/150?img=47"
    },
    overview: "In this comprehensive session, Dr. Elena Rostova explores the unique stressors faced by intellectual property professionals. We delve into identifying the early signs of burnout, establishing healthy boundaries, and practical techniques to manage high-pressure deadlines without compromising your mental health.",
    publishDate: "August 12, 2026",
    
    // Practical Tips
    practicalTips: [
      "Set strict 'offline' hours to mentally detach from case work.",
      "Incorporate 5-minute mindfulness breathing exercises between meetings.",
      "Delegate administrative tasks to focus on high-impact strategic work.",
      "Regularly communicate capacity limits to your team to prevent overload."
    ],
    
    // Downloadable Guides (Toolkit, Checklist, Infographic)
    downloads: [
      { id: 1, title: "Daily Wellbeing Checklist", type: "Checklist", icon: CheckSquare, size: "120 KB" },
      { id: 2, title: "Burnout Prevention Toolkit", type: "Toolkit", icon: BookOpen, size: "2.4 MB" },
      { id: 3, title: "Stress Response Infographic", type: "Infographic", icon: BarChart, size: "850 KB" }
    ],

    // Related Resources
    related: [
      { id: '101', title: "Meditation for Lawyers", type: "Podcast", time: "20 min listen" },
      { id: '102', title: "Work-Life Balance Workshop", type: "Video", time: "45 min watch" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col pb-20">
      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <Link href="/platform/resources" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#5a32fa] font-bold text-sm mb-6 transition-colors">
            <ArrowLeft size={16} />
            Back to Resources
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg" style={{ color: resource.color, backgroundColor: `${resource.color}15` }}>
              {resource.type}
            </span>
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300">
              {resource.topic}
            </span>
            <span className="text-sm font-bold text-gray-400 ml-auto">{resource.publishDate}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-gray-100 leading-tight mb-6">
            {resource.title}
          </h1>
          
          {/* Expert Details */}
          <div className="flex items-center gap-4 bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-100 dark:border-white/10 w-fit shadow-sm">
            <img src={resource.expert.image} alt={resource.expert.name} className="w-12 h-12 rounded-full border-2 border-[#00d26a]" />
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-100">{resource.expert.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{resource.expert.role}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Media Player Mockup (Video/Audio) */}
            <div className="w-full aspect-video bg-gray-900 rounded-[2rem] overflow-hidden relative shadow-lg group border border-gray-200 dark:border-white/10">
              <img src="/resourceimg2.jpg" alt="Video Thumbnail" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 border border-white/30 shadow-2xl">
                  <Play size={36} className="ml-2 fill-white" />
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-2 bg-white/20">
                <div className="h-full bg-[#00d26a] w-1/3" />
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm">
              <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FileText className="text-[#00d26a]" /> Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-medium text-lg leading-relaxed">
                {resource.overview}
              </p>
            </div>

            {/* Practical Tips */}
            <div className="bg-gradient-to-br from-[#00d26a]/10 to-transparent p-8 rounded-[2rem] border border-[#00d26a]/20 shadow-sm">
              <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <CheckSquare className="text-[#00d26a]" /> Practical Tips
              </h2>
              <ul className="space-y-4">
                {resource.practicalTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-4 bg-white dark:bg-[#0f172a] p-4 rounded-xl shadow-sm border border-[#00d26a]/10">
                    <div className="w-8 h-8 rounded-full bg-[#00d26a]/20 flex items-center justify-center text-[#00d26a] font-black shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="font-bold text-gray-700 dark:text-gray-200 text-lg leading-snug pt-1">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            
            {/* Downloadable Guides */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm">
              <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Download className="text-[#00d26a]" /> Downloads
              </h3>
              <div className="flex flex-col gap-4">
                {resource.downloads.map(file => {
                  const Icon = file.icon;
                  return (
                    <a key={file.id} href="#" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-[#00d26a]/50 hover:bg-[#00d26a]/5 transition-all group">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-[#00d26a] group-hover:bg-[#00d26a]/10 transition-colors">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 dark:text-gray-100 truncate text-sm">{file.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-[#00d26a] uppercase">{file.type}</span>
                          <span className="text-[10px] font-medium text-gray-400">• {file.size}</span>
                        </div>
                      </div>
                      <Download size={16} className="text-gray-400 group-hover:text-[#00d26a]" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Related Resources */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm">
              <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-6">Related Resources</h3>
              <div className="flex flex-col gap-4">
                {resource.related.map(item => (
                  <Link key={item.id} href={`/platform/resources/wellness/${item.id}`} className="group block">
                    <div className="p-4 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase text-gray-500 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">
                          {item.type}
                        </span>
                        <span className="text-[10px] font-medium text-gray-400">{item.time}</span>
                      </div>
                      <p className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-[#5a32fa] transition-colors line-clamp-2">
                        {item.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
