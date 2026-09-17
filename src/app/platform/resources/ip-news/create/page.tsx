// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Bold, 
  Italic, 
  Underline,
  Heading2, 
  Heading3, 
  Quote, 
  List, 
  ListOrdered, 
  Link2, 
  Eye, 
  Edit3, 
  Upload, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Tag, 
  Newspaper,
  ShieldCheck,
  RemoveFormatting,
  Type,
  Globe,
  Scale,
  RefreshCw,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import DOMPurify from 'dompurify';
import { refineNewsWithAI } from '@/app/actions/ai-news';

const JURISDICTIONS = [
  { id: 'global', name: 'Global Updates' },
  { id: 'us', name: 'US Updates (USPTO / Federal Circuit)' },
  { id: 'eu', name: 'EU Updates (EPO / CJEU / EUIPO)' },
  { id: 'uk', name: 'UK Updates (UKIPO / High Court)' },
  { id: 'asia-pacific', name: 'Asia-Pacific (APAC / CNIPA / JPO)' }
];

const CONTENT_TYPES = [
  "News",
  "Legal Update",
  "Case Law Update",
  "Regulatory Update",
  "Legislative Update",
  "IP Office Update",
  "Case Summary"
];

const PRESET_COVERS = [
  { url: '/resourceimg1.jpg', label: 'Global IP Hub' },
  { url: '/resourceimg2.jpg', label: 'Courtroom & Case Law' },
  { url: '/resource3.jpg', label: 'Patents & Tech Innovation' },
];

const TOPIC_TAGS = [
  'Patents',
  'Trademarks',
  'Litigation',
  'AI & IP',
  'Trade Secrets',
  'FRAND & SEPs',
  'Copyright',
  'Licensing',
  'IP Policy'
];

export default function IPNewsCreatePage() {
  const router = useRouter();
  const { user } = useAppStore();
  const editorRef = useRef<HTMLDivElement>(null);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [jurisdiction, setJurisdiction] = useState('global');
  const [resourceType, setResourceType] = useState('News');
  const [readTime, setReadTime] = useState('4 min read');
  const [coverImageUrl, setCoverImageUrl] = useState('/resourceimg1.jpg');
  const [tags, setTags] = useState<string[]>(['Patents', 'Litigation']);
  const [tagInput, setTagInput] = useState('');

  // Author & Source details
  const [authorName, setAuthorName] = useState('');
  const [organization, setOrganization] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  // Active toolbar states
  const [wordCount, setWordCount] = useState(0);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isH2, setIsH2] = useState(false);
  const [isH3, setIsH3] = useState(false);
  const [isQuote, setIsQuote] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);

  // Status & Submit
  const [uploadingCover, setUploadingCover] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);

  // AI Refine Modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiMode, setAiMode] = useState<'journalistic' | 'executive' | 'formal'>('journalistic');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    refinedTitle: string;
    refinedSummary: string;
    refinedContent: string;
    improvements: string[];
  } | null>(null);
  const [aiAppliedNotification, setAiAppliedNotification] = useState(false);

  // Load user profile
  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, title, organization, avatar_url, role, admin_role, email')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserProfile(data);
          if (data.full_name && !authorName) setAuthorName(data.full_name);
          if (data.organization && !organization) setOrganization(data.organization);
        }
      } catch (err) {
        console.warn('Profile load error:', err);
      }
    }
    loadProfile();
  }, [user]);

  // Update Toolbar formatting state on user selection
  const updateToolbarState = () => {
    if (typeof document === 'undefined') return;
    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      setIsBulletList(document.queryCommandState('insertUnorderedList'));
      setIsNumberedList(document.queryCommandState('insertOrderedList'));

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const parentNode = selection.anchorNode?.parentElement;
        const tagName = parentNode?.tagName?.toLowerCase();
        setIsH2(tagName === 'h2');
        setIsH3(tagName === 'h3');
        setIsQuote(tagName === 'blockquote' || Boolean(parentNode?.closest('blockquote')));
      }
    } catch (e) {}

    // Calculate live word count & reading time
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      const estMinutes = Math.max(1, Math.ceil(words / 180));
      setReadTime(`${estMinutes} min read`);
    }
  };

  // Visual Editor Command Handler
  const execCmd = (cmd: string, val: string | null = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    if (cmd === 'formatBlock') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const parent = selection.anchorNode?.parentElement;
        const currentTag = parent?.tagName?.toLowerCase();
        const targetTag = val?.replace(/[<>]/g, '').toLowerCase();

        if (currentTag === targetTag) {
          document.execCommand('formatBlock', false, '<p>');
        } else {
          document.execCommand('formatBlock', false, val || '<p>');
        }
      }
    } else {
      document.execCommand(cmd, false, val);
    }

    setTimeout(updateToolbarState, 10);
  };

  const handleCreateLink = () => {
    const url = prompt('Enter hyperlink URL (e.g. https://www.uspto.gov/...):');
    if (url) {
      execCmd('createLink', url.startsWith('http') ? url : `https://${url}`);
    }
  };

  // Tag Management
  const handleAddTag = (t: string) => {
    const cleaned = t.trim();
    if (cleaned && !tags.includes(cleaned) && tags.length < 8) {
      setTags([...tags, cleaned]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('File too large. Maximum size is 8MB.');
      return;
    }

    setUploadingCover(true);
    try {
      const ext = file.name.split('.').pop();
      const safeName = `news-cover-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('resources')
        .upload(safeName, file, { cacheControl: '3600', upsert: true });

      if (uploadErr) {
        const { error: altErr } = await supabase.storage
          .from('covers')
          .upload(safeName, file, { cacheControl: '3600', upsert: true });

        if (altErr) {
          alert('Upload failed: ' + uploadErr.message);
          return;
        }
        const { data } = supabase.storage.from('covers').getPublicUrl(safeName);
        if (data?.publicUrl) setCoverImageUrl(data.publicUrl);
      } else {
        const { data } = supabase.storage.from('resources').getPublicUrl(safeName);
        if (data?.publicUrl) setCoverImageUrl(data.publicUrl);
      }
    } catch (err: any) {
      alert('Error uploading cover image: ' + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  // Trigger AI Refinement
  const handleOpenAiModal = () => {
    setIsAiModalOpen(true);
    if (!aiResult) {
      handleRefineWithAI();
    }
  };

  const handleRefineWithAI = async (selectedMode = aiMode) => {
    setAiLoading(true);
    try {
      const currentHtml = editorRef.current?.innerHTML || contentHtml;
      const res = await refineNewsWithAI({
        title,
        summary,
        content: currentHtml,
        jurisdiction,
        mode: selectedMode
      });

      if (res.success) {
        setAiResult({
          refinedTitle: res.refinedTitle,
          refinedSummary: res.refinedSummary,
          refinedContent: res.refinedContent,
          improvements: res.improvements
        });
      } else {
        alert(res.error || 'Failed to refine news with AI. Please ensure you have entered a draft title or content.');
      }
    } catch (err: any) {
      alert('AI refinement error: ' + (err.message || err));
    } finally {
      setAiLoading(false);
    }
  };

  // Apply AI Refined Content to Editor
  const handleApplyAiChanges = () => {
    if (!aiResult) return;

    if (aiResult.refinedTitle) setTitle(aiResult.refinedTitle);
    if (aiResult.refinedSummary) setSummary(aiResult.refinedSummary);
    if (aiResult.refinedContent) {
      setContentHtml(aiResult.refinedContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = aiResult.refinedContent;
      }
    }

    setIsAiModalOpen(false);
    setAiAppliedNotification(true);
    setTimeout(() => setAiAppliedNotification(false), 4000);
    setTimeout(updateToolbarState, 50);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawText = editorRef.current?.innerText?.trim() || '';
    if (!title.trim()) {
      alert('Please enter a news headline.');
      return;
    }
    if (!rawText) {
      alert('Please write the news briefing explanation and body content.');
      return;
    }

    setSubmitting(true);
    try {
      const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
      const cleanSlug = `${slugBase}-${Date.now()}`;
      const finalHtml = editorRef.current?.innerHTML || contentHtml;

      const payload = {
        title: title.trim(),
        slug: cleanSlug,
        category: 'ip-news',
        subcategory: jurisdiction,
        resource_type: resourceType,
        type: resourceType,
        summary: summary.trim() || rawText.slice(0, 180) + '…',
        description: summary.trim() || rawText.slice(0, 180) + '…',
        content: finalHtml,
        read_time: readTime,
        cover_image_url: coverImageUrl || '/resourceimg1.jpg',
        tags,
        author_name: authorName.trim() || userProfile?.full_name || 'WIPA Contributor',
        author_title: 'IP Legal Contributor',
        organization: organization.trim() || 'Global IP Wire',
        author_avatar: userProfile?.avatar_url || null,
        author_id: user?.id || null,
        submitter_id: user?.id || null,
        submitter_name: authorName.trim() || userProfile?.full_name || user?.email || '',
        submitter_email: user?.email || userProfile?.email || '',
        approval_status: 'in_review',
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('resources')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      setSuccessData({
        ...payload,
        id: data?.id
      });
    } catch (err: any) {
      console.error('Error submitting IP news:', err);
      alert('Failed to submit news briefing: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (successData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex items-center justify-center p-4 font-sans text-slate-900 dark:text-white">
        <div className="max-w-xl w-full bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-3 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Clock size={13} />
              Under Editorial Review
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              News Briefing Submitted!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Thank you for contributing to the WIPA Global IP Intelligence Wire! The editorial board reviews incoming updates to ensure journalistic and statutory accuracy. Once approved, your news will appear live on the broadcast stream.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-left space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">Submitted Briefing</div>
            <div className="font-bold text-base text-slate-900 dark:text-white">{successData.title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1">
              <span className="font-bold text-orange-500">[{successData.resource_type}]</span> &bull; 
              <span>{successData.subcategory?.toUpperCase()}</span> &bull; 
              <span>{successData.read_time}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/platform/resources/ip-news"
              className="px-6 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all text-center"
            >
              Return to IP News Hub
            </Link>
            <button
              onClick={() => {
                setSuccessData(null);
                setTitle('');
                setSummary('');
                setContentHtml('');
                if (editorRef.current) editorRef.current.innerHTML = '';
              }}
              className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Submit Another Briefing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 pb-24 font-sans selection:bg-orange-500/20">
      
      {/* Top Navigation Bar */}
      <div className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1322] sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link 
            href="/platform/resources/ip-news" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Live Stream
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline-flex items-center gap-1.5">
              <Newspaper size={13} className="text-orange-500" />
              WIPA IP Newsroom Desk
            </span>

            {/* Top Bar Direct AI Refine Action */}
            <button
              type="button"
              onClick={handleOpenAiModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Sparkles size={13} className="animate-pulse" />
              <span>Refine with AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applied AI Toast */}
      {aiAppliedNotification && (
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Sparkles size={15} />
            <span>AI refinements applied to your news draft! Review and make any final personal adjustments.</span>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-[11px] font-black uppercase tracking-wider mb-3">
            <Globe size={13} /> Live Intelligence Contribution
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Publish Your <span className="text-orange-500">News</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
            Draft your breaking intellectual property briefing, case law update, or regulatory dispatch. Use our AI Refinement studio to elevate clarity before submitting for editorial review.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Card 1: Headline, Jurisdiction & Meta */}
          <div className="bg-white dark:bg-[#0d1322] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            
            {/* Headline / Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  News Headline / Breaking Story Title *
                </label>
                <span className="text-[11px] text-slate-400 font-semibold">{title.length}/150</span>
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. USITC Issues Exclusion Order in High-Stakes Semiconductor Patent Dispute"
                className="w-full text-xl sm:text-2xl font-black px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all placeholder-slate-400 text-slate-900 dark:text-white"
              />
            </div>

            {/* Jurisdiction & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                  Jurisdiction & IP Office *
                </label>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full text-sm font-bold px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all text-slate-900 dark:text-white"
                >
                  {JURISDICTIONS.map((j) => (
                    <option key={j.id} value={j.id} className="bg-slate-900 text-white">
                      {j.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                  Intelligence Classification *
                </label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full text-sm font-bold px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all text-slate-900 dark:text-white"
                >
                  {CONTENT_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-slate-900 text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Executive Summary / Key Takeaway */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  Briefing Summary / Executive Takeaway *
                </label>
                <span className="text-[11px] text-slate-400 font-semibold">{summary.length}/280</span>
              </div>
              <textarea
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A concise 1–2 sentence summary explaining the core development and immediate impact on patent holders or practitioners."
                className="w-full text-sm font-medium px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all placeholder-slate-400 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Card 2: Visual WYSIWYG Editor + AI Refine Button */}
          <div className="bg-white dark:bg-[#0d1322] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            
            {/* Editor Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Text Styles */}
                <button
                  type="button"
                  onClick={() => execCmd('bold')}
                  className={`p-2 rounded-xl transition-all font-bold text-xs ${
                    isBold ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                  title="Bold (Ctrl+B)"
                >
                  <Bold size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => execCmd('italic')}
                  className={`p-2 rounded-xl transition-all text-xs ${
                    isItalic ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                  title="Italic (Ctrl+I)"
                >
                  <Italic size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => execCmd('underline')}
                  className={`p-2 rounded-xl transition-all text-xs ${
                    isUnderline ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                  title="Underline (Ctrl+U)"
                >
                  <Underline size={15} />
                </button>

                <div className="w-px h-5 bg-slate-300 dark:bg-white/10 mx-1" />

                {/* Headings */}
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<h2>')}
                  className={`px-2.5 py-1.5 rounded-xl transition-all font-black text-xs ${
                    isH2 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                  title="Section Heading (H2)"
                >
                  <Heading2 size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<h3>')}
                  className={`px-2.5 py-1.5 rounded-xl transition-all font-black text-xs ${
                    isH3 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                  title="Subsection Heading (H3)"
                >
                  <Heading3 size={15} />
                </button>

                <div className="w-px h-5 bg-slate-300 dark:bg-white/10 mx-1" />

                {/* Quotes & Lists */}
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<blockquote>')}
                  className={`p-2 rounded-xl transition-all text-xs ${
                    isQuote ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                  title="Blockquote (Judicial citation / quote)"
                >
                  <Quote size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => execCmd('insertUnorderedList')}
                  className={`p-2 rounded-xl transition-all text-xs ${
                    isBulletList ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                  title="Bullet List"
                >
                  <List size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => execCmd('insertOrderedList')}
                  className={`p-2 rounded-xl transition-all text-xs ${
                    isNumberedList ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                  title="Numbered List"
                >
                  <ListOrdered size={15} />
                </button>

                <button
                  type="button"
                  onClick={handleCreateLink}
                  className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-xs"
                  title="Insert Link"
                >
                  <Link2 size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => execCmd('removeFormat')}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all text-xs"
                  title="Clear formatting"
                >
                  <RemoveFormatting size={15} />
                </button>
              </div>

              {/* Right side of toolbar: Word Count & AI Refine button */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400">
                  {wordCount} words &bull; {readTime}
                </span>

                {/* AI Refine Button in Toolbar */}
                <button
                  type="button"
                  onClick={handleOpenAiModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                >
                  <Sparkles size={13} />
                  <span>Refine with AI</span>
                </button>
              </div>
            </div>

            {/* Visual Editor Content Area */}
            <div className="p-6 sm:p-10 min-h-[360px] relative">
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onKeyUp={updateToolbarState}
                onMouseUp={updateToolbarState}
                onInput={(e) => {
                  setContentHtml(e.currentTarget.innerHTML);
                  updateToolbarState();
                }}
                data-placeholder="Write your news briefing here... Detail the factual background, key patent or trademark claims, court ruling, and implications for industry practitioners. Highlight text to format bold, headings, or quotes."
                className="w-full min-h-[300px] outline-none text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200 prose dark:prose-invert max-w-none
                  [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:border-b [&_h2]:border-slate-200 dark:[&_h2]:border-white/10 [&_h2]:pb-2
                  [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2
                  [&_p]:my-3
                  [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:bg-orange-500/10 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:my-4
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3
                  [&_strong]:font-black [&_strong]:text-slate-900 dark:[&_strong]:text-white
                  [&_b]:font-black [&_b]:text-slate-900 dark:[&_b]:text-white
                  empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
              />
            </div>
          </div>

          {/* Card 3: Cover Image & Source Credentials */}
          <div className="bg-white dark:bg-[#0d1322] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            
            {/* Cover Image Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-3">
                Cover Image *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                {/* Preset Options */}
                {PRESET_COVERS.map((preset) => (
                  <button
                    type="button"
                    key={preset.url}
                    onClick={() => setCoverImageUrl(preset.url)}
                    className={`relative rounded-2xl overflow-hidden aspect-video border-2 transition-all cursor-pointer group text-left ${
                      coverImageUrl === preset.url
                        ? 'border-orange-500 ring-2 ring-orange-500/30'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-400'
                    }`}
                  >
                    <img src={preset.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-bold text-white truncate">{preset.label}</span>
                    </div>
                    {coverImageUrl === preset.url && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-1">
                        <Check size={10} />
                      </div>
                    )}
                  </button>
                ))}

                {/* Upload Custom */}
                <label className="relative rounded-2xl aspect-video border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-orange-500 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center p-3 cursor-pointer transition-all text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                  {uploadingCover ? (
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                  ) : (
                    <>
                      <Upload size={18} className="text-slate-400 mb-1" />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Upload Image</span>
                      <span className="text-[9px] text-slate-400">Max 8MB</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Author Credentials & Organization */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-slate-200 dark:border-white/10">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                  Author / Reporter Byline *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins, Esq."
                  className="w-full text-sm font-semibold px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                  Organization / IP Wire *
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Global IP Wire / Firm Name"
                  className="w-full text-sm font-semibold px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                  Source / Gazette URL (Optional)
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-sm font-semibold px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Topic Tags */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                Topic Tags (Select or add custom)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {TOPIC_TAGS.map((t) => {
                  const isSelected = tags.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => isSelected ? handleRemoveTag(t) : handleAddTag(t)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        isSelected 
                          ? 'bg-orange-500 text-white shadow-xs' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{t}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                  placeholder="Add custom tag and press enter..."
                  className="text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(tagInput)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Submit Actions Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Editorial Review Guaranteed</div>
                <div className="text-slate-500 dark:text-slate-400">All submissions pass through our verified WIPA editor review desk before broadcasting live.</div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Briefing...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Submit for Review</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </main>

      {/* AI Refine Studio Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/10 w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-orange-500 flex items-center justify-center text-white shadow-sm">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    AI Newsroom Refinement Studio
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Polish your headline, elevate legal precision, and format structure to AP/Law360 standard.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mode Selector & Trigger Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#090e18] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Style:</span>
                {[
                  { id: 'journalistic', label: 'Journalistic Polish' },
                  { id: 'executive', label: 'Executive Briefing' },
                  { id: 'formal', label: 'Formal Legal Analysis' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      setAiMode(mode.id as any);
                      handleRefineWithAI(mode.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      aiMode === mode.id
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleRefineWithAI(aiMode)}
                disabled={aiLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all disabled:opacity-60"
              >
                <RefreshCw size={13} className={aiLoading ? "animate-spin" : ""} />
                <span>{aiLoading ? "Refining..." : "Re-Run Refinement"}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
              {aiLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-orange-500 flex items-center justify-center text-white shadow-lg animate-bounce">
                    <Sparkles size={28} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-base font-bold text-slate-900 dark:text-white">Refining with IP Legal Intelligence...</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                      Analyzing terminology, formatting section headers, and ensuring compliance with WIPA global journalism standards.
                    </div>
                  </div>
                </div>
              ) : aiResult ? (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Editorial Improvements Summary */}
                  {aiResult.improvements?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                      <div className="text-[11px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                        <Sparkles size={13} /> Key Editorial Improvements Made:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                        {aiResult.improvements.map((imp, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-purple-500 font-bold">•</span>
                            <span>{imp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Refined Headline Comparison */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">Refined Headline</div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {aiResult.refinedTitle}
                    </div>
                    {title && title !== aiResult.refinedTitle && (
                      <div className="text-xs text-slate-400 line-through pt-1">
                        Original: {title}
                      </div>
                    )}
                  </div>

                  {/* Refined Summary */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">Refined Executive Summary</div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic border-l-2 border-orange-500 pl-3">
                      {aiResult.refinedSummary}
                    </p>
                  </div>

                  {/* Refined Body Content (Reading View) */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Refined News Article Body (Formatted Preview)
                    </div>
                    <div
                      className="p-6 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/10 text-sm leading-relaxed text-slate-800 dark:text-slate-200 prose dark:prose-invert max-w-none shadow-xs
                        [&_h2]:text-lg [&_h2]:font-black [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:border-b [&_h2]:border-slate-200 dark:[&_h2]:border-white/10 [&_h2]:pb-1.5
                        [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-1.5
                        [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:bg-orange-500/10 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:my-3
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
                        [&_strong]:font-bold [&_strong]:text-slate-900 dark:[&_strong]:text-white"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(aiResult.refinedContent) }}
                    />
                  </div>

                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 text-xs">
                  Click &quot;Refine Now&quot; above to generate an elevated draft.
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#090e18] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                You can review and read the full refined piece above before applying.
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  Discard / Keep Original
                </button>
                <button
                  type="button"
                  disabled={!aiResult || aiLoading}
                  onClick={handleApplyAiChanges}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  <Check size={14} />
                  <span>Accept & Apply to Editor</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
