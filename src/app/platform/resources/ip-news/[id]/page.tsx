'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Globe, 
  Calendar, 
  FileText, 
  Scale, 
  AlertCircle, 
  Share2, 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { supabase } from '@/lib/supabase';
import { formatCleanSummary, formatCleanContent, cleanIPNewsText } from '@/lib/ipNewsCleaner';

export default function IPNewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadArticleData() {
      try {
        setLoading(true);
        
        // 1. Fetch the main article by ID or slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        let query = supabase.from('ip_news').select('*');
        
        if (isUUID) {
          query = query.eq('id', id);
        } else {
          query = query.eq('slug', id);
        }

        const { data, error } = await query.single();

        if (!error && data) {
          setArticle(data);

          // 2. Fetch related articles
          const { data: related } = await supabase
            .from('ip_news')
            .select('id, title, resource_type, subcategory, cover_image_url, created_at')
            .neq('id', data.id)
            .limit(3);

          if (related) {
            setRelatedArticles(related);
          }
        }
      } catch (err) {
        console.error('Error fetching IP news article:', err);
      } finally {
        setLoading(false);
      }
    }

    loadArticleData();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col items-center justify-center p-6 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider">Loading intelligence briefing...</p>
      </div>
    );
  }

  // Fallback if item was not found in DB
  const rawTitle = article?.title || "Global Intellectual Property Intelligence Briefing";
  const displayTitle = cleanIPNewsText(rawTitle) || "Global Intellectual Property Intelligence Briefing";
  const displayType = article?.resource_type || "Legal Update";
  const displayJurisdiction = article?.subcategory ? article.subcategory.toUpperCase() : "GLOBAL";
  const createdDate = article?.created_at ? new Date(article.created_at) : null;
  const displayDate = createdDate 
    ? createdDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recent Analysis';
  const displayTime = createdDate
    ? createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  const displayReadTime = article?.read_time || "4 min read";
  const displaySource = article?.organization || 'Global IP Wire';
  const displayExternalUrl = article?.external_url || article?.url || (article?.slug && article.slug.includes('breaking-ip-wire') ? 'https://www.globalipmagazine.com/news/breaking-ip-wire' : `https://www.globalipmagazine.com/post/${article?.slug || ''}`);
  const displaySummary = formatCleanSummary(article?.summary || article?.description, displayTitle);
  const displayContent = formatCleanContent(article?.content, displayTitle, displaySummary, article?.subcategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] pb-24 text-slate-900 dark:text-slate-100">
      
      {/* Top Header Navigation */}
      <div className="bg-white dark:bg-[#0d1322] border-b border-slate-200/80 dark:border-white/10 pt-8 pb-12 shadow-xs">
        <div className="max-w-[960px] mx-auto px-5">
          
          <Link 
            href="/platform/resources/ip-news" 
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-orange-500 font-bold text-xs uppercase tracking-wider mb-8 transition-colors"
          >
            <ArrowLeft size={15} /> Back to IP News & Intelligence
          </Link>
          
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold mb-4">
            <span className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full uppercase tracking-wider text-[10px] font-black">
              {displayType}
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full text-[11px] font-bold">
              <Globe size={13} /> {displayJurisdiction}
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Clock size={13} /> {displayReadTime}
            </span>
            <a
              href={displayExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-600 dark:text-orange-400 text-[11px] font-bold hover:bg-orange-500 hover:text-white transition-colors"
              title="Read full article on publisher site"
            >
              <span>Source: {displaySource}</span>
              <ExternalLink size={11} />
            </a>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            {displayTitle}
          </h1>

          <div className="flex flex-wrap items-center justify-between border-t border-slate-100 dark:border-white/5 pt-6 gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar size={15} className="text-orange-500" />
                <span>{displayDate}</span>
              </div>
              {displayTime && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock size={13} className="text-slate-400" />
                    <span>{displayTime}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setBookmarked(!bookmarked)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  bookmarked 
                    ? 'border-orange-500 bg-orange-500 text-white' 
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-orange-500'
                }`}
              >
                <Bookmark size={14} />
                <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
              </button>

              <button 
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-orange-500 text-xs font-bold transition-all"
              >
                <Share2 size={14} />
                <span>{copied ? 'Copied Link' : 'Share'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Article Body */}
      <div className="max-w-[960px] mx-auto px-5 pt-10">
        
        {/* Executive Summary Card */}
        <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent p-7 md:p-9 rounded-3xl border border-orange-500/20 shadow-xs mb-10">
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="text-orange-500" size={18} /> Executive Summary
          </h2>
          <p className="text-slate-700 dark:text-slate-200 text-base md:text-lg leading-relaxed font-medium">
            {displaySummary}
          </p>
        </div>

        {/* Detailed Analysis / Formatted HTML */}
        <div className="bg-white dark:bg-[#0d1322] rounded-3xl p-7 md:p-10 shadow-xs border border-slate-200/80 dark:border-white/10 mb-8">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
            <Scale className="text-orange-500" size={20} /> Legal Intelligence & Practice Analysis
          </h2>
          
          <div 
            className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-p:text-base prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300"
            dangerouslySetInnerHTML={{ 
              __html: typeof window !== 'undefined' ? DOMPurify.sanitize(displayContent) : displayContent 
            }}
          />
        </div>

        {/* Publisher Attribution & Legal Safe Harbor Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-100 to-amber-50/40 dark:from-[#0d1322] dark:to-amber-950/20 border border-slate-200 dark:border-white/10 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1">
            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
              Publisher Credit & Safe Harbor Notice
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              This intelligence briefing was originally published by <strong className="text-slate-900 dark:text-white">{displaySource}</strong>. All original reporting, trademarks, and copyright remain the exclusive property of the publisher. WIPA provides these curated excerpts for educational & informational reference.
            </p>
          </div>
          <a
            href={displayExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs shadow-md transition-all shrink-0"
          >
            <span>Read Original Article</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Related Intelligence Briefings */}
        {relatedArticles.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0d1322] p-7 md:p-8 shadow-xs">
            <h3 className="font-black text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <BookOpen size={18} className="text-orange-500" /> Related Intelligence Briefings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map(rel => (
                <Link 
                  key={rel.id} 
                  href={`/platform/resources/ip-news/${rel.id}`}
                  className="group block p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 hover:border-orange-500/40 hover:bg-orange-50/30 dark:hover:bg-orange-950/20 transition-all"
                >
                  <span className="text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 mb-1.5 block">
                    {rel.resource_type || "Update"}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-snug group-hover:text-orange-500 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
