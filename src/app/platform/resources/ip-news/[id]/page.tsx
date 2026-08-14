'use client';

import React from 'react';
import { ArrowLeft, Globe, Calendar, Link as LinkIcon, FileText, ChevronRight, Scale, AlertCircle, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'dompurify';

export default function IPNewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  // Mock data for the specific news resource
  const newsItem = {
    id: id,
    title: "Supreme Court Rules on AI Inventorship: Humans Only",
    type: "Case Law Update",
    jurisdiction: "United States",
    date: "October 15, 2026",
    summary: "In a landmark 8-1 decision, the Supreme Court upheld the USPTO's stance that only a natural person can be named as an inventor on a patent application. The ruling in *Thaler v. Vidal* solidifies the requirement for human conception, rejecting arguments that advanced AI systems should be granted legal inventorship status for novel outputs.",
    implications: [
      "Companies relying heavily on generative AI for R&D must establish rigorous internal protocols to document the specific human contributions to any patentable invention.",
      "The ruling creates a potential divergence in global IP strategy, as jurisdictions like South Africa have previously allowed AI inventorship.",
      "Patent applications currently pending that list an AI as a sole inventor will face immediate rejection under 35 U.S.C. § 100(f)."
    ],
    fullText: `
      <p class="mb-4">The long-awaited Supreme Court decision in <em>Thaler v. Vidal</em> has finally provided clarity on one of the most debated topics in modern IP law: AI inventorship.</p>
      <p class="mb-4">Justice Kagan, writing for the majority, emphasized that the statutory language of the Patent Act unambiguously refers to an "individual" as a natural person. "While technology evolves, the statutory foundation of patent law requires legislative action, not judicial reinterpretation, to accommodate non-human entities," the opinion stated.</p>
      <p class="mb-4">The case centered around Stephen Thaler's AI system, DABUS, which autonomously generated two inventions. Thaler argued that recognizing AI as an inventor would incentivize innovation. However, the USPTO and lower courts maintained that human conception is the bedrock of the US patent system.</p>
      <p class="mb-4">Legal experts warn that while the ruling provides immediate clarity, it shifts the burden to corporations to meticulously track the prompt engineering, data curation, and problem-solving steps undertaken by human operators using AI tools. The standard for what constitutes sufficient human contribution remains an area ripe for future litigation.</p>
    `,
    references: [
      { title: "Supreme Court Opinion: Thaler v. Vidal (PDF)", link: "#" },
      { title: "USPTO Guidance on AI-Assisted Inventions", link: "#" },
      { title: "35 U.S.C. § 100(f) Statutory Text", link: "#" }
    ],
    related: [
      { id: '2', title: "EPO Releases New Guidelines for Biotech Patents", type: "IP Office Update" },
      { id: '3', title: "Major Tech Giants Settle Standard Essential Patent Dispute", type: "Case Summary" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20">
      
      {/* Header Area */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 pt-8 pb-12">
        <div className="w-full max-w-[900px] mx-auto p-4 md:p-6 lg:p-8">
          <Link href="/platform/resources/ip-news" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#f97316] font-bold text-sm mb-10 transition-colors">
            <ArrowLeft size={16} />
            Back to News & Updates
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold mb-6">
            <span className="bg-[#f97316]/10 px-3 py-1 rounded-md uppercase tracking-wider text-[10px] text-[#f97316]">{newsItem.type}</span>
            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-md">
              <Globe size={14} /> {newsItem.jurisdiction}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            {newsItem.title}
          </h1>

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/10 pt-6">
            <div className="flex items-center gap-2 text-gray-500 font-medium">
              <Calendar size={18} className="text-[#f97316]" />
              <span>{newsItem.date}</span>
            </div>
            
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-[#f97316] hover:border-[#f97316] transition-all">
                <Bookmark size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-[#f97316] hover:border-[#f97316] transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[900px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        {/* Executive Summary */}
        <div className="bg-gradient-to-br from-[#f97316]/10 to-transparent p-8 rounded-3xl border border-[#f97316]/20 shadow-sm mb-10">
          <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <FileText className="text-[#f97316]" size={20} /> Executive Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-medium">
            {newsItem.summary}
          </p>
        </div>

        {/* Implications for Practice */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 shadow-sm border border-gray-200 dark:border-white/10 mb-10">
          <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={24} /> Implications for Practice
          </h2>
          <ul className="space-y-4">
            {newsItem.implications.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-black shrink-0 mt-0.5">
                  !
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed pt-1">{imp}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Detailed Analysis / Full Text */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-200 dark:border-white/10 mb-12">
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Scale className="text-[#f97316]" size={24} /> Detailed Analysis
          </h2>
          <div 
            className="prose prose-lg dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-300 max-w-none"
            dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(newsItem.fullText) : newsItem.fullText }}
          />
        </div>

        {/* Two-Column Footer: References & Related Updates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* References */}
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
            <h3 className="font-black text-xl text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
              <LinkIcon size={20} className="text-[#f97316]" /> Primary Sources
            </h3>
            <div className="flex flex-col gap-3">
              {newsItem.references.map((ref, idx) => (
                <a key={idx} href={ref.link} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f172a] border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-colors group">
                  <div className="p-2 rounded-lg bg-[#f97316]/10 text-[#f97316] shrink-0 mt-0.5">
                    <FileText size={16} />
                  </div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-[#f97316] transition-colors leading-snug pt-1">{ref.title}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Related Updates */}
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
            <h3 className="font-black text-xl text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
              <ArrowLeft size={20} className="text-[#f97316] rotate-180" /> Related Updates
            </h3>
            <div className="flex flex-col gap-4">
              {newsItem.related.map(item => (
                <Link key={item.id} href={`/platform/resources/ip-news/${item.id}`} className="group block">
                  <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-[#f97316]/50 hover:bg-[#f97316]/5 transition-all">
                    <span className="text-[10px] font-black uppercase text-[#f97316] mb-2 block">{item.type}</span>
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-[#f97316] transition-colors line-clamp-2">
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
  );
}
