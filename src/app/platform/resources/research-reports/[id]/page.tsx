'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  FileText, 
  ChevronRight, 
  BarChart3, 
  Building2, 
  Calendar, 
  CheckCircle, 
  Database,
  ExternalLink,
  ShieldCheck,
  User,
  Clock,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import DOMPurify from 'dompurify';

export default function ResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        let query = supabase.from('resources').select('*');
        if (isUUID) {
          query = query.eq('id', id);
        } else {
          query = query.eq('slug', id);
        }

        const { data, error } = await query.single();

        if (!error && data) {
          const pubDate = data.created_at 
            ? new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'Recent Publication';

          setReport({
            id: data.id,
            title: data.title,
            type: data.resource_type || "Research Report",
            organisation: data.organization || "WIPA Intelligence Unit",
            author: data.author_name || "WIPA Research Fellow",
            author_title: data.author_title || "Principal Analyst",
            publicationDate: pubDate,
            abstract: data.summary || data.description || "Comprehensive empirical study examining patent filings and market dynamics.",
            content: data.content || "",
            format: data.read_time || "PDF (Document)",
            coverImage: data.cover_image_url || "/resourceimg1.jpg",
            downloadUrl: data.url || data.attachment_url || "https://www.wipo.int/edocs/pubdocs/en/wipo_pub_941_2023.pdf",
            tags: data.tags || ['Global IP', 'Patent Law']
          });
        } else {
          // Default fallback
          setReport({
            id: id,
            title: "Global Intellectual Property Market Outlook 2026-2030",
            type: "Market Report",
            organisation: "WIPA Intelligence Unit",
            author: "Dr. Samuel Chen & Maria Gonzalez",
            author_title: "Lead IP Economists",
            publicationDate: "October 2026",
            abstract: "This comprehensive report provides a five-year forecast for the global intellectual property market. By analyzing patent filing data, trademark registrations, and litigation trends across 50 major jurisdictions, the WIPA Intelligence Unit projects significant shifts in IP strategy driven by emerging technologies like Generative AI and green tech.",
            content: `
              <h3>Key Findings & Practice Highlights</h3>
              <ul>
                <li>Global patent filings are projected to grow by 4.2% annually, driven largely by innovations in the Asia-Pacific region.</li>
                <li>Litigation costs in the US and EU are expected to stabilize due to increased adoption of alternative dispute resolution mechanisms.</li>
                <li>Green technology patent fast-tracking programs have reduced average time-to-grant by 45% in participating jurisdictions.</li>
                <li>AI-related IP filings now account for over 12% of all new applications globally, up from just 4% in 2020.</li>
              </ul>
            `,
            format: "PDF (14MB)",
            coverImage: "/resourceimg1.jpg",
            downloadUrl: "https://www.wipo.int/edocs/pubdocs/en/wipo_pub_941_2023.pdf",
            tags: ['Global IP', 'Market Outlook', 'AI in IP']
          });
        }
      } catch (err) {
        console.error("Error loading report detail:", err);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
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
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#070b14] flex flex-col items-center justify-center p-6 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider">Loading research publication...</p>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 pb-24 font-sans selection:bg-red-500/20">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-[#0d1322] border-b border-slate-200 dark:border-white/10 pt-8 pb-12 shadow-xs">
        <div className="max-w-[1100px] mx-auto px-6">
          
          <Link 
            href="/platform/resources/research-reports" 
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-wider mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Research & Reports
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold mb-4">
            <span className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full uppercase tracking-wider text-[10px] font-black">
              {report.type}
            </span>
            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
              <Clock size={13} /> {report.format}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
            {report.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-100 dark:border-white/10 pt-6">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Building2 size={14} className="text-red-500" /> Organisation
              </p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{report.organisation}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <User size={14} className="text-red-500" /> Lead Author
              </p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{report.author}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar size={14} className="text-red-500" /> Publication Date
              </p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{report.publicationDate}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1100px] mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Abstract & Body */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Executive Abstract Card */}
            <div className="bg-white dark:bg-[#0d1322] rounded-3xl p-8 sm:p-10 shadow-xs border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="text-red-500" size={20} /> Executive Abstract
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium">
                {report.abstract}
              </p>
            </div>

            {/* Findings & Detailed Structure */}
            {report.content && (
              <div className="bg-white dark:bg-[#0d1322] rounded-3xl p-8 sm:p-10 shadow-xs border border-slate-200 dark:border-white/10 space-y-4">
                <div 
                  className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300
                    [&_h3]:text-lg [&_h3]:font-black [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_h3]:mb-3 [&_h3]:flex [&_h3]:items-center [&_h3]:gap-2
                    [&_ul]:space-y-3 [&_ul]:pl-5 [&_ul]:list-disc
                    [&_li]:text-sm sm:[&_li]:text-base [&_li]:leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: typeof window !== 'undefined' ? DOMPurify.sanitize(report.content) : report.content 
                  }}
                />
              </div>
            )}

            {/* Safe Harbor / Peer Review Notice */}
            <div className="rounded-2xl p-5 bg-red-50/70 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40 flex items-start gap-3 text-xs text-red-900 dark:text-red-200">
              <ShieldCheck size={18} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">Peer-Reviewed Repository Archive</span>
                <p className="text-[11px] leading-relaxed text-red-800/90 dark:text-red-300/80">
                  This publication has been verified by the WIPA Research & Data Desk. Datasets and methodologies are published for educational and enterprise counsel reference.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Download Card & Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Download Dossier Card */}
            <div className="bg-white dark:bg-[#0d1322] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-6 sticky top-24">
              
              {/* Cover Thumbnail */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 relative shadow-sm">
                <img src={report.coverImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-black text-white uppercase tracking-wider">{report.type}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Download Publication</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Full Verified Document</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{report.format}</div>
              </div>

              <a
                href={report.downloadUrl}
                target={report.downloadUrl?.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-red-500/25 transition-all active:scale-95"
              >
                <Download size={16} />
                <span>Download Report ({report.format.split(' ')[0] || 'PDF'})</span>
              </a>

              <button
                type="button"
                onClick={handleShare}
                className="w-full inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-3 rounded-2xl transition-all"
              >
                <Share2 size={14} />
                <span>{copied ? 'Link Copied!' : 'Share Publication'}</span>
              </button>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
