'use client';

import React from 'react';
import { ArrowLeft, Building, Target, CheckCircle, FileText, Download, PlayCircle, Users, Briefcase, Info } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'dompurify';

export default function InHouseCounselDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  // Mock data for the specific in-house resource
  const resource = {
    id: id,
    title: "GC Roundtable: Managing IP Budgets in a Downturn",
    type: "GC Roundtable",
    corporateTopic: "Leadership & Strategy",
    contributor: {
      name: "Panel of 4 General Counsels",
      role: "Moderated by WIPA",
      organisation: "Tech Industry Forum",
      image: "https://i.pravatar.cc/150?img=33"
    },
    practicalGuidance: [
      "Prioritize offensive filings over defensive ones when capital is restricted.",
      "Consolidate outside counsel to negotiate bulk-rate discounts on standard prosecution matters.",
      "Implement a quarterly, rather than annual, review of the foreign filing strategy to quickly abandon low-value assets."
    ],
    content: `
      <p class="mb-6 text-lg text-gray-600 dark:text-gray-300">In this exclusive roundtable discussion, four General Counsels from leading Fortune 500 tech companies candidly discuss the realities of managing intellectual property budgets during periods of economic uncertainty.</p>
      
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 mt-8">The Shift to In-House Prosecution</h3>
      <p class="mb-6">One of the most heavily debated topics during the roundtable was the balance between in-house and outside counsel for patent prosecution. Panelists agreed that while shifting routine prosecution in-house reduces immediate hourly costs, the hidden costs of overhead and talent retention must be carefully modeled.</p>
      
      <div class="my-8 p-6 bg-[#10b981]/10 border-l-4 border-[#10b981] rounded-r-xl">
        <p class="italic font-medium text-gray-700 dark:text-gray-300">"We found that bringing trademark prosecution in-house saved us 30% in year one, but the real ROI came from our team's closer alignment with the marketing department's strategic goals." — GC, Enterprise Software Co.</p>
      </div>

      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 mt-8">Rationalizing the Foreign Portfolio</h3>
      <p class="mb-6">The panelists provided actionable frameworks for auditing foreign portfolios. The consensus was to move away from 'blanket' filings in 15+ jurisdictions, instead adopting a tier-based system where only 'Tier 1' crown-jewel patents are maintained globally, while 'Tier 3' assets are aggressively abandoned in non-core markets to eliminate annuity fees.</p>
    `,
    downloads: [
      { title: "Roundtable Transcript", type: "PDF", size: "1.2 MB" },
      { title: "Tiered Foreign Filing Strategy Template", type: "XLSX", size: "850 KB" }
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder for demo
    related: [
      { id: '1', title: "The 2026 Corporate IP Strategy Playbook", type: "Playbook" },
      { id: '4', title: "Outside Counsel Guidelines Template", type: "Template" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20">
      
      {/* Header Area */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 pt-8 pb-12 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#10b981]/5 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/4 pointer-events-none"></div>

        <div className="w-full max-w-[1000px] mx-auto p-4 md:p-6 lg:p-8 relative z-10">
          <Link href="/platform/resources/in-house-counsel" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#10b981] font-bold text-sm mb-10 transition-colors">
            <ArrowLeft size={16} />
            Back to In-House Resources
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold mb-6">
            <span className="bg-[#10b981]/10 px-3 py-1 rounded-md uppercase tracking-wider text-[10px] text-[#10b981]">{resource.type}</span>
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-md">
              <Target size={14} className="text-[#10b981]" /> {resource.corporateTopic}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-8 leading-tight">
            {resource.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-gray-100 dark:border-white/10 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500">
                <Users size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">{resource.contributor.name}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1.5"><Building size={14} className="text-[#10b981]" /> {resource.contributor.organisation}</p>
              </div>
            </div>
            
            <button className="bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 shrink-0">
              <PlayCircle size={20} /> Watch Full Session
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1000px] mx-auto p-4 md:p-6 lg:p-8 pt-10">
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column (Content & Video) */}
          <div className="flex-1">
            
            {/* Embedded Video (If applicable for Roundtables/Webinars) */}
            {resource.videoUrl && (
              <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-white/10 mb-10 relative group">
                {/* Mock Video Player */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 cursor-pointer group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                    <PlayCircle size={40} className="text-white ml-2" />
                  </div>
                </div>
                <img src="/resourceimg2.jpg" alt="Video Thumbnail" className="w-full h-full object-cover opacity-60" />
              </div>
            )}

            {/* Practical Guidance */}
            <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-200 dark:border-white/10 mb-10">
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Info className="text-[#10b981]" size={24} /> Session Overview
              </h2>
              
              <div 
                className="prose prose-lg dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-300 max-w-none mb-10"
                dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(resource.content) : resource.content }}
              />

              <div className="bg-gray-50 dark:bg-[#0f172a] rounded-2xl p-8 border border-gray-100 dark:border-white/5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <Briefcase className="text-[#10b981]" size={20} /> Practical Guidance & Takeaways
                </h3>
                <ul className="space-y-4">
                  {resource.practicalGuidance.map((guidance, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981] shrink-0 mt-0.5">
                        <CheckCircle size={14} />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{guidance}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar Actions) */}
          <div className="w-full lg:w-[350px] flex flex-col gap-6">
            
            {/* Downloads Card */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-black text-xl text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Download size={20} className="text-[#10b981]" /> Session Downloads
              </h3>
              
              <div className="flex flex-col gap-3">
                {resource.downloads.map((doc, idx) => (
                  <button key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-[#10b981]/50 hover:bg-[#10b981]/5 transition-all group text-left w-full">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center text-gray-400 group-hover:text-[#10b981] transition-colors shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 dark:text-gray-100 truncate text-sm group-hover:text-[#10b981] transition-colors">{doc.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-[#10b981] uppercase">{doc.type}</span>
                        <span className="text-[10px] font-medium text-gray-400">• {doc.size}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contributor Profile */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center text-center">
              <h3 className="font-black text-sm text-gray-400 uppercase tracking-wider mb-6 w-full text-left">Contributor</h3>
              <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-4 border-4 border-[#10b981]/10">
                <Users size={32} />
              </div>
              <h4 className="font-black text-xl text-gray-900 dark:text-gray-100 mb-1">{resource.contributor.name}</h4>
              <p className="text-[#10b981] font-bold text-sm mb-4">{resource.contributor.role}</p>
              <div className="w-full p-3 bg-gray-50 dark:bg-[#0f172a] rounded-xl flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-medium text-sm">
                <Building size={16} /> {resource.contributor.organisation}
              </div>
            </div>

            {/* Related Resources */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-black text-xl text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Building size={20} className="text-[#10b981]" /> Related Content
              </h3>
              <div className="flex flex-col gap-4">
                {resource.related.map(item => (
                  <Link key={item.id} href={`/platform/resources/in-house-counsel/${item.id}`} className="group block">
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-[#10b981]/50 hover:bg-[#10b981]/5 transition-all">
                      <span className="text-[10px] font-black uppercase text-[#10b981] mb-2 block">{item.type}</span>
                      <p className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-[#10b981] transition-colors line-clamp-2">
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
