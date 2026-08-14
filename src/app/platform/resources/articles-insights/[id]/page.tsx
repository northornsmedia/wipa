'use client';

import React from 'react';
import { ArrowLeft, BookOpen, Download, FileText, User, ChevronRight, Tag, Share2, Bookmark, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'dompurify';

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  // Mock data for the specific article resource
  const article = {
    id: id,
    title: "Navigating AI Patents in 2026: Strategies for Tech Startups",
    type: "Thought Leadership",
    publicationDate: "Oct 15, 2026",
    readingTime: "7 min read",
    author: {
      name: "Elena Rostova",
      role: "Partner, Innovation IP Law",
      bio: "Elena specializes in advising hyper-growth startups on building defensive patent portfolios in the AI and machine learning sectors. She is a frequent contributor to IP World Magazine.",
      image: "https://i.pravatar.cc/150?img=47"
    },
    content: `
      <p class="mb-6 text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">As generative AI models continue to evolve at breakneck speed, patent offices worldwide are struggling to keep pace with the novel legal questions they raise. For tech startups, this creates a landscape of both unprecedented opportunity and significant risk.</p>
      
      <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 mt-10">The Authorship Dilemma</h3>
      <p class="mb-6">One of the most pressing issues in 2026 remains the question of inventorship. Can an AI be listed as an inventor? While the USPTO and EPO have largely maintained that inventors must be human, the nuance lies in how much human intervention is required to claim a patentably distinct invention generated with the aid of AI.</p>
      <p class="mb-6">Startups must meticulously document the human contribution to their AI-assisted inventions. This means maintaining clear records of the prompts used, the iterative refinement process, and the specific technical problems solved by the human operators.</p>

      <div class="my-10 p-6 bg-[#3b82f6]/10 border-l-4 border-[#3b82f6] rounded-r-2xl">
        <p class="text-lg italic font-medium text-gray-700 dark:text-gray-300">"The companies that will win the IP race in the next decade are those that seamlessly integrate AI into their R&D while maintaining rigorous, human-centric documentation protocols."</p>
      </div>

      <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 mt-10">Defensive Strategies</h3>
      <p class="mb-6">Building a defensive portfolio is no longer just for the tech giants. Startups need to adopt a proactive approach to IP strategy from day one. This involves not only filing for core patents but also actively publishing defensive publications to establish prior art and prevent competitors from patenting incremental improvements.</p>
      
      <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 mt-10">Conclusion</h3>
      <p class="mb-6">Navigating the AI patent landscape requires agility and foresight. By staying informed about the evolving legal standards and adopting robust documentation practices, tech startups can turn potential IP risks into powerful competitive advantages.</p>
    `,
    tags: ["AI", "Patent Law", "Startups", "IP Strategy", "Innovation"],
    attachments: [
      { title: "Defensive Publication Template", type: "DOCX", size: "150 KB" },
      { title: "2026 AI Patent Trends Report", type: "PDF", size: "3.2 MB" }
    ],
    related: [
      { id: '2', title: "The Fall of the Standard Essential Patent Monopoly", type: "Opinion" },
      { id: '3', title: "Tech Giants vs. Startups: A Patent Case Study", type: "Case Study" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20">
      
      {/* Header Area */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 pt-8 pb-12">
        <div className="w-full max-w-[900px] mx-auto p-4 md:p-6 lg:p-8">
          <Link href="/platform/resources/articles-insights" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#3b82f6] font-bold text-sm mb-10 transition-colors">
            <ArrowLeft size={16} />
            Back to Articles & Insights
          </Link>
          
          <div className="flex items-center gap-3 text-sm font-bold text-[#3b82f6] mb-6">
            <span className="bg-[#3b82f6]/10 px-3 py-1 rounded-md uppercase tracking-wider text-[10px] text-[#3b82f6]">{article.type}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-8 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-100 dark:border-white/10 pt-6">
            <div className="flex items-center gap-4">
              <img src={article.author.image} alt={article.author.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">{article.author.name}</p>
                <p className="text-sm text-gray-500">{article.author.role}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /> {article.publicationDate}</span>
              <span className="flex items-center gap-2"><Clock size={16} className="text-gray-400" /> {article.readingTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[900px] mx-auto p-4 md:p-6 lg:p-8 pt-12">
        
        {/* Floating Actions */}
        <div className="flex gap-4 justify-end mb-8">
          <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-[#3b82f6] hover:border-[#3b82f6] shadow-sm transition-all">
            <Bookmark size={18} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-[#3b82f6] hover:border-[#3b82f6] shadow-sm transition-all">
            <Share2 size={18} />
          </button>
        </div>

        {/* Article Body */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-white/10 mb-12">
          <div 
            className="prose prose-lg dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-300 max-w-none"
            dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(article.content) : article.content }}
          />
          
          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/10">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Tag size={16} /> Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Attachments & Author Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Author Bio */}
          <div className="bg-gradient-to-br from-[#3b82f6]/10 to-transparent p-8 rounded-3xl border border-[#3b82f6]/20 shadow-sm flex flex-col items-center text-center">
            <img src={article.author.image} alt={article.author.name} className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-[#0f172a] shadow-lg mb-4" />
            <h3 className="font-black text-xl text-gray-900 dark:text-gray-100 mb-1">{article.author.name}</h3>
            <p className="text-[#3b82f6] font-bold text-sm mb-4">{article.author.role}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
              {article.author.bio}
            </p>
            <button className="mt-auto px-6 py-2.5 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:text-[#3b82f6] hover:border-[#3b82f6] transition-all shadow-sm">
              View Full Profile
            </button>
          </div>

          {/* Attachments */}
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
            <h3 className="font-black text-xl text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Download size={20} className="text-[#3b82f6]" /> Article Attachments
            </h3>
            <div className="flex flex-col gap-4">
              {article.attachments.map((doc, idx) => (
                <a key={idx} href="#" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/5 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center text-gray-400 group-hover:text-[#3b82f6] transition-colors">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 dark:text-gray-100 truncate text-sm group-hover:text-[#3b82f6] transition-colors">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-[#3b82f6] uppercase">{doc.type}</span>
                      <span className="text-[10px] font-medium text-gray-400">• {doc.size}</span>
                    </div>
                  </div>
                  <Download size={18} className="text-gray-300 group-hover:text-[#3b82f6] transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Related Reads */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-12">
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
            <BookOpen className="text-[#3b82f6]" size={24} /> Related Reads
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {article.related.map(item => (
              <Link key={item.id} href={`/platform/resources/articles-insights/${item.id}`} className="group bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all">
                <span className="text-[10px] font-black uppercase text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-1 rounded-md mb-3 inline-block">{item.type}</span>
                <h4 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#3b82f6] transition-colors line-clamp-2">{item.title}</h4>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
