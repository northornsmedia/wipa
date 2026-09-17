// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Download, FileText, User, ChevronRight, Tag, Share2, Bookmark, Clock, Calendar, Check } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { supabase } from '@/lib/supabase';

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Fallback mock article if not found in database
  const DEFAULT_MOCK = {
    id: id,
    title: "Navigating AI Patents in 2026: Strategies for Tech Startups",
    type: "Thought Leadership",
    publicationDate: "Oct 15, 2026",
    readingTime: "7 min read",
    coverImage: "/resourceimg1.jpg",
    author: {
      name: "Elena Rostova",
      role: "Partner, Innovation IP Law",
      bio: "Elena specializes in advising hyper-growth startups on building defensive patent portfolios in the AI and machine learning sectors. She is a frequent contributor to IP World Magazine.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
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

  const [article, setArticle] = useState<any>(DEFAULT_MOCK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        let query = supabase.from('resources').select('*');
        if (isUUID) {
          query = query.eq('id', id);
        } else {
          query = query.or(`slug.eq.${id},id.eq.${id}`);
        }

        const { data, error } = await query.single();
        if (data && !error) {
          setArticle({
            id: data.id,
            title: data.title,
            type: data.resource_type || data.subcategory || "Expert Article",
            publicationDate: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readingTime: data.read_time || "6 min read",
            coverImage: data.cover_image_url || "/resourceimg1.jpg",
            author: {
              name: data.author_name || "WIPA Contributor",
              role: data.author_title ? `${data.author_title}${data.organization ? `, ${data.organization}` : ''}` : (data.organization || "IP Professional"),
              bio: data.summary || `${data.author_name || 'Contributor'} is a specialized intellectual property practitioner and active contributor to the WIPA Resource Library and Global IP Journal.`,
              image: data.author_avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
            },
            content: data.content || data.description || '',
            tags: data.tags || ["Patent Law", "Intellectual Property"],
            attachments: data.file_url ? [{ title: "Download Attached Resource", type: "FILE", size: "Direct" }] : [
              { title: "WIPA Thought Leadership Brief", type: "PDF", size: "1.8 MB" }
            ],
            related: [
              { id: '2', title: "The Fall of the Standard Essential Patent Monopoly", type: "Opinion" },
              { id: '3', title: "Tech Giants vs. Startups: A Patent Case Study", type: "Case Study" }
            ]
          });
        }
      } catch (e) {
        console.error('Error fetching article detail:', e);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const formatContentHtml = (raw: string) => {
    if (!raw) return '';
    if (raw.includes('<p') || raw.includes('<div') || raw.includes('<h3') || raw.includes('<h2')) {
      return typeof window !== 'undefined' ? DOMPurify.sanitize(raw) : raw;
    }
    // Markdown formatting converter
    const formatted = raw
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-black text-gray-900 dark:text-gray-100 mb-4 mt-10 border-b border-gray-100 dark:border-white/10 pb-2">$1</h2>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/^&gt; (.*$)/gim, '<div class="my-8 p-6 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-2xl"><p class="text-lg italic font-medium text-gray-800 dark:text-gray-200">$1</p></div>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-gray-700 dark:text-gray-300 my-1">$1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-600 underline font-semibold hover:text-emerald-700">$1</a>')
      .split('\n\n')
      .map(b => b.startsWith('<') ? b : `<p class="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">${b.replace(/\n/g, '<br/>')}</p>`)
      .join('\n');
    return typeof window !== 'undefined' ? DOMPurify.sanitize(formatted) : formatted;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] pb-20 font-sans">
      
      {/* Header Area */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 pt-8 pb-12">
        <div className="w-full max-w-[900px] mx-auto p-4 md:p-6 lg:p-8">
          <Link href="/platform/resources/articles-insights" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-wider mb-8 transition-colors">
            <ArrowLeft size={16} />
            Back to Articles & Insights
          </Link>
          
          <div className="flex items-center gap-3 text-sm font-bold text-emerald-600 mb-6">
            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-md uppercase tracking-wider text-[10px] font-black">{article.type}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-8 leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Author & Publication Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-100 dark:border-white/10 pt-6">
            <div className="flex items-center gap-4">
              <img src={article.author.image} alt={article.author.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/20" />
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">{article.author.name}</p>
                <p className="text-xs text-gray-500">{article.author.role}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5"><Calendar size={15} className="text-gray-400" /> {article.publicationDate}</span>
              <span className="flex items-center gap-1.5"><Clock size={15} className="text-gray-400" /> {article.readingTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[900px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        {/* Floating Actions */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Link
              href="/platform/resources/articles-insights/create"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Write your own article &rarr;
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setBookmarked(!bookmarked)}
              className={`w-10 h-10 rounded-full bg-white dark:bg-[#1e293b] border flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                bookmarked 
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' 
                  : 'border-gray-200 dark:border-white/10 text-gray-500 hover:text-emerald-600 hover:border-emerald-500'
              }`}
              title="Bookmark article"
            >
              <Bookmark size={18} className={bookmarked ? 'fill-emerald-600' : ''} />
            </button>
            <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-500 shadow-xs transition-all cursor-pointer relative"
              title="Share article link"
            >
              {copied ? <Check size={18} className="text-emerald-600" /> : <Share2 size={18} />}
            </button>
          </div>
        </div>

        {/* Cover image if present */}
        {article.coverImage && (
          <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden mb-10 shadow-sm border border-gray-200 dark:border-white/10">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Body */}
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 sm:p-12 shadow-sm border border-gray-100 dark:border-white/10 mb-12">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: formatContentHtml(article.content) }}
          />
          
          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/10">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag size={14} /> Topic Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Author Bio Card */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-8 rounded-3xl border border-emerald-500/20 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
          <img src={article.author.image} alt={article.author.name} className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-[#0f172a] shadow-md shrink-0" />
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1 block">Article Author</span>
            <h3 className="font-black text-xl text-gray-900 dark:text-gray-100 mb-1">{article.author.name}</h3>
            <p className="text-emerald-600 font-bold text-xs mb-3">{article.author.role}</p>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
              {article.author.bio}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
