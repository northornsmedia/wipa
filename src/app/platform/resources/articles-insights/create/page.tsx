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
  FileText,
  ShieldCheck,
  RemoveFormatting,
  Type,
  Minus
} from 'lucide-react';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import DOMPurify from 'dompurify';

const TOPIC_SUGGESTIONS = [
  'AI in IP',
  'Patent Law',
  'Trade Secrets',
  'IP Strategy',
  'Copyright & Media',
  'FRAND & SEPs',
  'Litigation',
  'Startups & Tech',
  'Global Trademarks'
];

const PRESET_COVERS = [
  { url: '/resourceimg1.jpg', label: 'Corporate Office' },
  { url: '/resourceimg2.jpg', label: 'Legal Discussion' },
  { url: '/resource3.jpg', label: 'Tech & Innovation' },
];

export default function ArticleCreatePage() {
  const router = useRouter();
  const { user } = useAppStore();
  const editorRef = useRef<HTMLDivElement>(null);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [subcategory, setSubcategory] = useState('thought-leadership');
  const [resourceType, setResourceType] = useState('Expert Article');
  const [readTime, setReadTime] = useState('5 min read');
  const [coverImageUrl, setCoverImageUrl] = useState('/resourceimg1.jpg');
  const [tags, setTags] = useState<string[]>(['AI in IP', 'Patent Law']);
  const [tagInput, setTagInput] = useState('');

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

  // Author details
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [organization, setOrganization] = useState('');

  // Status & Submit
  const [publishDirectly, setPublishDirectly] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);

  // Load user profile
  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
          const isUserAdmin = Boolean(profile.is_admin || profile.is_subadmin);
          setIsAdmin(isUserAdmin);
          setAuthorName(profile.full_name || user.email?.split('@')[0] || 'WIPA Contributor');
          setAuthorTitle(profile.role || profile.headline || 'IP Professional');
          setOrganization(profile.company || 'WIPA Member');
        }
      } catch (err) {
        console.error('Error fetching author profile:', err);
      }
    }
    loadProfile();
  }, [user?.id]);

  // Sync content and word count from WYSIWYG editor
  const syncEditorState = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setContentHtml(html);

    const text = editorRef.current.innerText || '';
    const words = (text.trim().match(/\S+/g) || []).length;
    setWordCount(words);
    const mins = Math.max(1, Math.ceil(words / 200));
    setReadTime(`${mins} min read`);

    // Check formatting state
    if (typeof document !== 'undefined') {
      try {
        setIsBold(document.queryCommandState('bold'));
        setIsItalic(document.queryCommandState('italic'));
        setIsUnderline(document.queryCommandState('underline'));
        setIsBulletList(document.queryCommandState('insertUnorderedList'));
        setIsNumberedList(document.queryCommandState('insertOrderedList'));

        const block = (document.queryCommandValue('formatBlock') || '').toLowerCase();
        setIsH2(block === 'h2');
        setIsH3(block === 'h3');
        setIsQuote(block === 'blockquote');
      } catch (e) {
        // silent catch
      }
    }
  };

  // WYSIWYG Executive Command Handler (preserves text selection)
  const execFormat = (command: string, value: string | undefined = undefined) => {
    if (typeof document === 'undefined') return;
    if (editorRef.current && document.activeElement !== editorRef.current && !editorRef.current.contains(document.activeElement)) {
      editorRef.current.focus();
    }
    try {
      document.execCommand(command, false, value);
    } catch (err) {
      console.warn('execCommand failed for:', command, err);
    }
    syncEditorState();
  };

  // Dedicated block formatter with full cross-browser support
  const formatBlockTag = (tag: string) => {
    if (typeof document === 'undefined') return;
    if (editorRef.current && document.activeElement !== editorRef.current && !editorRef.current.contains(document.activeElement)) {
      editorRef.current.focus();
    }
    const cleanTag = tag.replace(/[<>]/g, '').toLowerCase();
    try {
      const ok = document.execCommand('formatBlock', false, `<${cleanTag}>`);
      if (!ok) {
        document.execCommand('formatBlock', false, cleanTag);
      }
    } catch (e) {
      try {
        document.execCommand('formatBlock', false, cleanTag);
      } catch (err) {
        console.warn('formatBlockTag failed:', err);
      }
    }
    syncEditorState();
  };

  // Insert Link dialog
  const handleInsertLink = () => {
    const url = prompt('Enter webpage link URL (https://...):', 'https://');
    if (url && url !== 'https://') {
      execFormat('createLink', url);
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const clean = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(clean);
  };

  // Add tag
  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Cover Image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const safeName = `article_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadErr } = await supabase.storage
        .from('resources')
        .upload(safeName, file, { upsert: true });

      if (uploadErr) {
        const { error: coverErr } = await supabase.storage
          .from('covers')
          .upload(safeName, file, { upsert: true });
        
        if (coverErr) {
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

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawText = editorRef.current?.innerText?.trim() || '';
    if (!title.trim()) {
      alert('Please enter an article headline.');
      return;
    }
    if (!rawText) {
      alert('Please write the article explanation and content.');
      return;
    }

    setSubmitting(true);
    try {
      const isApproved = isAdmin && publishDirectly;
      const initialStatus = isApproved ? 'approved' : 'in_review';
      const cleanSlug = `${slug || 'article'}-${Date.now()}`;
      const finalHtml = editorRef.current?.innerHTML || contentHtml;

      const payload = {
        title: title.trim(),
        slug: cleanSlug,
        category: 'articles-insights',
        subcategory,
        resource_type: resourceType,
        type: resourceType,
        summary: summary.trim() || rawText.slice(0, 200) + '…',
        description: summary.trim() || rawText.slice(0, 200) + '…',
        content: finalHtml,
        read_time: readTime,
        cover_image_url: coverImageUrl || '/resourceimg1.jpg',
        tags,
        author_name: authorName.trim() || userProfile?.full_name || 'WIPA Contributor',
        author_title: authorTitle.trim() || 'IP Professional',
        organization: organization.trim() || 'WIPA Member',
        author_avatar: userProfile?.avatar_url || null,
        author_id: user?.id || null,
        submitter_id: user?.id || null,
        submitter_name: authorName.trim() || userProfile?.full_name || user?.email || '',
        submitter_email: user?.email || userProfile?.email || '',
        approval_status: initialStatus,
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
        id: data?.id,
        is_approved: isApproved
      });
    } catch (err: any) {
      console.error('Error submitting article:', err);
      alert('Failed to submit article: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (successData) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center p-4 font-sans text-gray-900 dark:text-white">
        <div className="max-w-xl w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-3 ${
              successData.is_approved 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              <Clock size={13} />
              {successData.is_approved ? 'Live & Published' : 'Under Editorial Review'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {successData.is_approved ? 'Article Published Directly!' : 'Article Sent For Editorial Review!'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
              {successData.is_approved
                ? 'Your article is now live on the WIPA Articles & Insights Hub.'
                : 'Thank you for your contribution! The WIPA Editorial Board reviews articles within 24–48 hours to ensure compliance with our global IP publication standards.'
              }
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-left space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Article Title</div>
            <div className="font-bold text-base text-gray-900 dark:text-white">{successData.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 pt-1">
              <span>{successData.author_name}</span> &bull; <span>{successData.subcategory}</span> &bull; <span>{successData.read_time}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/platform/resources/articles-insights"
              className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all text-center"
            >
              Return to Articles Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-white pb-24 font-sans selection:bg-emerald-500/20">
      
      {/* Studio Header (Sticky Top Navbar) */}
      <header className="border-b border-slate-200/90 dark:border-white/[0.08] bg-white/95 dark:bg-[#0c1120]/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link 
              href="/platform/resources/articles-insights" 
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-white transition-colors shrink-0"
            >
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Journal</span>
            </Link>

            <span className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2 truncate">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 shrink-0">
                Editorial Studio
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 hidden md:inline truncate">
                {title ? title : 'Untitled Draft'}
              </span>
            </div>
          </div>

          {/* Top Actions: Preview Toggle & Submit */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-white/[0.06] rounded-xl text-xs font-bold border border-slate-200/70 dark:border-white/[0.06]">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'write' 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Edit3 size={13} /> <span className="hidden sm:inline">Editor</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  syncEditorState();
                  setActiveTab('preview');
                }}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'preview' 
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Eye size={13} /> <span className="hidden sm:inline">Preview</span>
              </button>
            </div>

            {/* Quick Top Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 sm:px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span className="hidden sm:inline">Submitting…</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Send For Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body: 2-Column Split Layout */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT: WRITING CANVAS (COL-SPAN-8)                                         */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Writing Document Sheet */}
            <div className="bg-white dark:bg-[#0c1120] rounded-2xl border border-slate-200/90 dark:border-white/[0.08] shadow-xs p-6 sm:p-10 lg:p-12 transition-all">
              
              {/* Article Headline / Title */}
              <div className="mb-4">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Article Headline / Title..."
                  className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 placeholder:text-slate-300 dark:placeholder:text-slate-700 tracking-tight leading-tight"
                />
              </div>

              {/* Subtitle & Summary */}
              <div className="mb-6">
                <textarea
                  required
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Add an executive subtitle or summary explaining the core takeaway..."
                  className="w-full text-base sm:text-lg text-slate-600 dark:text-slate-400 bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700 leading-relaxed font-normal"
                />
              </div>

              {/* Divider & Metadata Micro-Bar */}
              <div className="flex items-center justify-between py-3 border-y border-slate-100 dark:border-white/[0.06] text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-emerald-500" />
                    {readTime}
                  </span>
                  <span>•</span>
                  <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                  <Sparkles size={12} className="text-emerald-500" />
                  <span>Interactive Editor</span>
                </div>
              </div>

              {/* Formatting Toolbar */}
              {activeTab === 'write' && (
                <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-50 dark:bg-slate-900/90 rounded-xl border border-slate-200/80 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 mb-4 sticky top-20 z-20 shadow-xs backdrop-blur-md">
                  {/* Bold */}
                  <button
                    type="button"
                    title="Make Selected Text Bold (Ctrl+B)"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('bold');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isBold ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-white dark:hover:bg-white/10'
                    }`}
                  >
                    <Bold size={14} /> <span className="hidden sm:inline">Bold</span>
                  </button>

                  {/* Italic */}
                  <button
                    type="button"
                    title="Make Selected Text Italic (Ctrl+I)"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('italic');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      isItalic ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-white dark:hover:bg-white/10'
                    }`}
                  >
                    <Italic size={14} /> <span className="hidden sm:inline">Italic</span>
                  </button>

                  {/* Underline */}
                  <button
                    type="button"
                    title="Underline Selected Text (Ctrl+U)"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('underline');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      isUnderline ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-white dark:hover:bg-white/10'
                    }`}
                  >
                    <Underline size={14} />
                  </button>

                  <span className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />

                  {/* H2 */}
                  <button
                    type="button"
                    title="Turn block into Major Section Headline"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      formatBlockTag('h2');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isH2 ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-white dark:hover:bg-white/10'
                    }`}
                  >
                    <Heading2 size={14} /> <span className="hidden sm:inline">Headline</span>
                  </button>

                  {/* H3 */}
                  <button
                    type="button"
                    title="Turn block into Sub-heading"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      formatBlockTag('h3');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      isH3 ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-white dark:hover:bg-white/10'
                    }`}
                  >
                    <Heading3 size={14} /> <span className="hidden sm:inline">Sub-heading</span>
                  </button>

                  {/* Normal */}
                  <button
                    type="button"
                    title="Normal Body Text"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      formatBlockTag('p');
                    }}
                    className="px-2 py-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-xs font-medium transition-colors cursor-pointer text-slate-500"
                  >
                    Normal
                  </button>

                  <span className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />

                  {/* Quote */}
                  <button
                    type="button"
                    title="Turn block into Pull Quote"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      formatBlockTag('blockquote');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                      isQuote ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-white dark:hover:bg-white/10'
                    }`}
                  >
                    <Quote size={14} />
                  </button>

                  {/* Bullet */}
                  <button
                    type="button"
                    title="Bullet List"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('insertUnorderedList');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                      isBulletList ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-white dark:hover:bg-white/10'
                    }`}
                  >
                    <List size={14} />
                  </button>

                  {/* Numbered */}
                  <button
                    type="button"
                    title="Numbered List"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('insertOrderedList');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                      isNumberedList ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-white dark:hover:bg-white/10'
                    }`}
                  >
                    <ListOrdered size={14} />
                  </button>

                  {/* Divider */}
                  <button
                    type="button"
                    title="Insert Horizontal Divider Line"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('insertHorizontalRule');
                    }}
                    className="px-2 py-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-xs font-medium transition-colors cursor-pointer text-slate-500"
                  >
                    <Minus size={14} />
                  </button>

                  {/* Link */}
                  <button
                    type="button"
                    title="Insert Hyperlink"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleInsertLink();
                    }}
                    className="px-2 py-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Link2 size={14} />
                  </button>

                  {/* Remove Format */}
                  <button
                    type="button"
                    title="Clear formatting"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('removeFormat');
                      formatBlockTag('p');
                    }}
                    className="px-2 py-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-xs font-medium transition-colors cursor-pointer text-slate-400 hover:text-rose-500 ml-auto"
                  >
                    <RemoveFormatting size={14} />
                  </button>
                </div>
              )}

              {/* Editor Surface vs Reader Preview */}
              {activeTab === 'write' ? (
                <div className="relative">
                  {(!contentHtml || contentHtml === '<br>' || contentHtml === '<p><br></p>' || !editorRef.current?.innerText?.trim()) && (
                    <div className="absolute top-4 left-4 pointer-events-none text-slate-400 dark:text-slate-600 italic select-none text-base">
                      Start writing your article... Highlight text to format headlines, quotes, or lists.
                    </div>
                  )}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={syncEditorState}
                    onKeyUp={syncEditorState}
                    onMouseUp={syncEditorState}
                    className="w-full min-h-[500px] p-4 rounded-xl focus:outline-none transition-all text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200 font-sans
                      [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-black [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:border-b [&_h2]:border-slate-100 [&_h2]:dark:border-white/10 [&_h2]:pb-2
                      [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-slate-900 [&_h3]:dark:text-white
                      [&_p]:mb-5 [&_p]:leading-relaxed
                      [&_blockquote]:my-6 [&_blockquote]:p-4 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-emerald-500/10 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-slate-700 [&_blockquote]:dark:text-slate-300
                      [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-5
                      [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-5
                      [&_li]:mb-1.5
                      [&_strong]:font-black [&_strong]:text-slate-900 [&_strong]:dark:text-white
                      [&_b]:font-black [&_b]:text-slate-900 [&_b]:dark:text-white
                      [&_a]:text-emerald-600 [&_a]:underline [&_a]:font-bold
                      [&_hr]:my-8 [&_hr]:border-slate-200 [&_hr]:dark:border-white/10"
                  />
                </div>
              ) : (
                /* Reader Preview Mode */
                <div className="min-h-[500px] space-y-6">
                  <div className="text-xs font-black uppercase tracking-widest text-emerald-600">
                    Final Reader Preview
                  </div>
                  {coverImageUrl && (
                    <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                      <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {title || 'Untitled Article'}
                  </h1>
                  {summary && (
                    <p className="text-lg text-slate-600 dark:text-slate-300 border-l-2 border-emerald-500 pl-4 italic">
                      {summary}
                    </p>
                  )}
                  <div 
                    className="prose prose-slate dark:prose-invert max-w-none text-base sm:text-lg
                      [&_h2]:text-2xl [&_h2]:font-black [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:pb-2
                      [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2
                      [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-emerald-500/10 [&_blockquote]:p-4 [&_blockquote]:rounded-r-xl [&_blockquote]:italic
                    "
                    dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(contentHtml) : contentHtml }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: PUBLISHING SETTINGS SIDEBAR (COL-SPAN-4)                           */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* 1. Review & Submit Card */}
            <div className="bg-white dark:bg-[#0c1120] rounded-2xl border border-slate-200/90 dark:border-white/[0.08] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText size={14} className="text-emerald-500" /> Publication Status
                </h3>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
                  Draft
                </span>
              </div>

              {/* Admin Direct Publish Option */}
              {isAdmin && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Admin Publish</div>
                    <div className="text-[11px] text-slate-500">Bypass review queue</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={publishDirectly}
                    onChange={(e) => setPublishDirectly(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Submitting Article…
                  </>
                ) : (
                  <>
                    <Send size={15} /> {isAdmin && publishDirectly ? 'Publish Immediately' : 'Send For Review'}
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-400">
                <Link
                  href="/platform/resources/articles-insights"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Discard Draft
                </Link>
                <span>{wordCount} words</span>
              </div>
            </div>

            {/* 2. Cover Image Card */}
            <div className="bg-white dark:bg-[#0c1120] rounded-2xl border border-slate-200/90 dark:border-white/[0.08] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  Cover Image
                </h3>
                <span className="text-[11px] text-slate-400">16:9 Landscape</span>
              </div>

              {/* Cover Preview */}
              <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900 relative group">
                <img 
                  src={coverImageUrl} 
                  alt="Article Cover" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-3 text-[11px] font-bold text-white">
                  Selected Cover
                </div>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-3 gap-2">
                {PRESET_COVERS.map(preset => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setCoverImageUrl(preset.url)}
                    className={`relative rounded-lg overflow-hidden border text-left cursor-pointer transition-all ${
                      coverImageUrl === preset.url
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-12 object-cover" />
                  </button>
                ))}
              </div>

              {/* Upload or Custom URL */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="Paste image URL..."
                  className="flex-1 text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-emerald-500"
                />
                <label className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold cursor-pointer transition-colors">
                  <Upload size={13} />
                  <span>{uploadingCover ? '...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                </label>
              </div>
            </div>

            {/* 3. Taxonomy Card (Subcategory & Format) */}
            <div className="bg-white dark:bg-[#0c1120] rounded-2xl border border-slate-200/90 dark:border-white/[0.08] p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Taxonomy & Placement
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">
                  Subcategory *
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="thought-leadership">Thought Leadership</option>
                  <option value="case-studies">Case Studies</option>
                  <option value="opinions">Opinions</option>
                  <option value="guides">Expert Guides</option>
                  <option value="lexisnexis-exclusives">LexisNexis® Exclusives</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">
                  Format / Type *
                </label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Expert Article">Expert Article</option>
                  <option value="Thought Leadership">Thought Leadership</option>
                  <option value="Opinion">Opinion</option>
                  <option value="Case Study">Case Study</option>
                  <option value="Guide">Guide</option>
                  <option value="Commentary">Commentary</option>
                  <option value="Analysis">Analysis</option>
                </select>
              </div>
            </div>

            {/* 4. Tags Card */}
            <div className="bg-white dark:bg-[#0c1120] rounded-2xl border border-slate-200/90 dark:border-white/[0.08] p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-1.5">
                <Tag size={13} className="text-emerald-500" /> Topics & Tags
              </h3>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-emerald-500 hover:text-rose-500 ml-0.5 cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Tag Input */}
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
                  placeholder="Add a topic and Enter..."
                  className="flex-1 text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(tagInput)}
                  className="px-3 py-2 bg-slate-100 dark:bg-white/10 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-400">
                <span className="font-bold mr-1">Quick:</span>
                {TOPIC_SUGGESTIONS.slice(0, 5).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddTag(s)}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 underline decoration-dotted cursor-pointer mr-1"
                  >
                    +{s}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Author Byline Card */}
            <div className="bg-white dark:bg-[#0c1120] rounded-2xl border border-slate-200/90 dark:border-white/[0.08] p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Author Credentials
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={authorTitle}
                  onChange={(e) => setAuthorTitle(e.target.value)}
                  placeholder="e.g. Partner, IP Litigation"
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">
                  Organization / Firm
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Innovation IP Law LLP"
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

          </div>
        </form>
      </main>
    </div>
  );
}
