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
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white pb-24 font-sans selection:bg-emerald-500/20">
      
      {/* Top Navbar */}
      <div className="border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link 
            href="/platform/resources/articles-insights" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Journal
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-gray-400 hidden sm:inline-flex items-center gap-1.5">
              <Sparkles size={13} className="text-emerald-500" />
              WIPA Visual Article Studio
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-black uppercase tracking-wider mb-3">
            <FileText size={13} /> Article Authoring
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Publish Your Article
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
            Type headlines and explanations, highlight text to make it bold or format headings visually, and send for editorial review.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Main Card: Headlines & Meta */}
          <div className="bg-white dark:bg-[#141414] p-6 sm:p-10 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
            
            {/* Title / Headline */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">
                Article Headline / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. How Generative AI is Reshaping Cross-Border Patent Litigation in 2026"
                className="w-full text-xl sm:text-2xl font-black px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder-gray-400"
              />
            </div>

            {/* Subtitle / Summary */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">
                Subtitle & Summary *
              </label>
              <textarea
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Provide a concise 1–2 sentence explanation summarizing the core premise and key takeaways."
                className="w-full text-sm font-medium px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder-gray-400"
              />
            </div>

            {/* Categories & Resource Types */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">
                  Subcategory *
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="thought-leadership">Thought Leadership</option>
                  <option value="case-studies">Case Studies</option>
                  <option value="opinions">Opinions</option>
                  <option value="guides">Expert Guides</option>
                  <option value="lexisnexis-exclusives">LexisNexis® Exclusives</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">
                  Format / Type *
                </label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Read Time
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-xs font-bold text-gray-600 dark:text-gray-300">
                  <Clock size={14} className="text-emerald-500" />
                  <span>{readTime}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Tag size={13} /> Article Tags & Topics
              </label>
              
              {/* Selected tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-emerald-500 hover:text-rose-500 font-bold ml-1 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              {/* Tag Input & Suggestions */}
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
                  placeholder="Type a topic and press Enter..."
                  className="flex-1 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(tagInput)}
                  className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Add Tag
                </button>
              </div>

              {/* Suggestions */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-400">
                <span className="font-bold">Quick add:</span>
                {TOPIC_SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddTag(s)}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 underline decoration-dotted cursor-pointer mr-1.5"
                  >
                    +{s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card: VISUAL WYSIWYG Article Editor */}
          <div className="bg-white dark:bg-[#141414] p-6 sm:p-10 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Type size={18} className="text-emerald-500" /> Visual Article Editor
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select text with your cursor and click <strong>Bold</strong>, <strong>Headings</strong>, or <strong>Quote</strong> to format visually in real time.
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-bold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'write' 
                      ? 'bg-white dark:bg-[#222] text-gray-900 dark:text-white shadow-xs' 
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Edit3 size={13} /> Visual Editor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    syncEditorState();
                    setActiveTab('preview');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'preview' 
                      ? 'bg-white dark:bg-[#222] text-emerald-600 dark:text-emerald-400 shadow-xs' 
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Eye size={13} /> Final Reader Preview
                </button>
              </div>
            </div>

            {/* Visual WYSIWYG Toolbar */}
            {activeTab === 'write' && (
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-200 sticky top-18 z-20 shadow-xs">
                {/* Bold */}
                <button
                  type="button"
                  title="Make Selected Text Bold (Ctrl+B)"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('bold');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                    isBold 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'hover:bg-white dark:hover:bg-white/10 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <Bold size={15} /> Bold
                </button>

                {/* Italic */}
                <button
                  type="button"
                  title="Make Selected Text Italic (Ctrl+I)"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('italic');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    isItalic 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'hover:bg-white dark:hover:bg-white/10 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <Italic size={15} /> Italic
                </button>

                {/* Underline */}
                <button
                  type="button"
                  title="Underline Selected Text (Ctrl+U)"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('underline');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    isUnderline 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'hover:bg-white dark:hover:bg-white/10 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <Underline size={15} /> Underline
                </button>

                <span className="w-px h-5 bg-gray-300 dark:bg-white/10 mx-1" />

                {/* Heading 2 */}
                <button
                  type="button"
                  title="Turn current block into Major Section Headline"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    formatBlockTag('h2');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    isH2 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'hover:bg-white dark:hover:bg-white/10 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <Heading2 size={16} /> Section Headline
                </button>

                {/* Heading 3 */}
                <button
                  type="button"
                  title="Turn current block into Sub-heading"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    formatBlockTag('h3');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isH3 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'hover:bg-white dark:hover:bg-white/10 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <Heading3 size={16} /> Sub-heading
                </button>

                {/* Normal Paragraph */}
                <button
                  type="button"
                  title="Normal Body Text"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    formatBlockTag('p');
                  }}
                  className="px-2.5 py-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer text-gray-500"
                >
                  Normal
                </button>

                <span className="w-px h-5 bg-gray-300 dark:bg-white/10 mx-1" />

                {/* Blockquote */}
                <button
                  type="button"
                  title="Turn block into Expert Pull Quote"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    formatBlockTag('blockquote');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    isQuote 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'hover:bg-white dark:hover:bg-white/10 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <Quote size={15} /> Quote
                </button>

                {/* Bullet List */}
                <button
                  type="button"
                  title="Bullet List"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('insertUnorderedList');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    isBulletList 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'hover:bg-white dark:hover:bg-white/10 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <List size={15} /> Bullet List
                </button>

                {/* Numbered List */}
                <button
                  type="button"
                  title="Numbered List"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('insertOrderedList');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    isNumberedList 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'hover:bg-white dark:hover:bg-white/10 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <ListOrdered size={15} /> Numbered
                </button>

                {/* Divider Line */}
                <button
                  type="button"
                  title="Insert Horizontal Divider Line"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('insertHorizontalRule');
                  }}
                  className="px-2.5 py-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-300"
                >
                  <Minus size={15} /> Divider
                </button>

                <span className="w-px h-5 bg-gray-300 dark:bg-white/10 mx-1" />

                {/* Link */}
                <button
                  type="button"
                  title="Insert Hyperlink"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleInsertLink();
                  }}
                  className="px-3 py-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Link2 size={15} /> Link
                </button>

                {/* Clear Formatting */}
                <button
                  type="button"
                  title="Clear formatting"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('removeFormat');
                    formatBlockTag('p');
                  }}
                  className="px-2 py-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer text-gray-400 hover:text-rose-500"
                >
                  <RemoveFormatting size={14} />
                </button>
              </div>
            )}

            {/* Visual Editor Canvas vs Full Reader Preview */}
            {activeTab === 'write' ? (
              <div className="relative">
                {/* Visual Placeholder Overlay */}
                {(!contentHtml || contentHtml === '<br>' || contentHtml === '<p><br></p>' || !editorRef.current?.innerText?.trim()) && (
                  <div className="absolute top-6 left-6 sm:top-8 sm:left-8 pointer-events-none text-gray-400 dark:text-gray-500 italic select-none text-base">
                    Start typing your article here... Highlight any words to make them Bold, Headings, or Quotes.
                  </div>
                )}
                {/* ContentEditable Visual Surface */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={syncEditorState}
                  onKeyUp={syncEditorState}
                  onMouseUp={syncEditorState}
                  className="w-full min-h-[380px] p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#181818] focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-emerald-500/50 focus:outline-none transition-all text-base leading-relaxed text-gray-800 dark:text-gray-100 font-sans 
                    [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-black [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-gray-900 [&_h2]:dark:text-white [&_h2]:border-b [&_h2]:border-gray-200 [&_h2]:dark:border-white/10 [&_h2]:pb-2
                    [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-gray-900 [&_h3]:dark:text-white
                    [&_p]:mb-4 [&_p]:leading-relaxed
                    [&_blockquote]:my-6 [&_blockquote]:p-4 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-emerald-500/10 [&_blockquote]:rounded-r-2xl [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:dark:text-gray-300
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
                    [&_li]:mb-1
                    [&_strong]:font-black [&_strong]:text-gray-900 [&_strong]:dark:text-white
                    [&_b]:font-black [&_b]:text-gray-900 [&_b]:dark:text-white
                    [&_a]:text-emerald-600 [&_a]:underline [&_a]:font-bold
                    [&_hr]:my-8 [&_hr]:border-gray-200 [&_hr]:dark:border-white/10"
                />

                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2.5 px-1 font-medium">
                  <span>{wordCount} {wordCount === 1 ? 'word' : 'words'} &bull; {readTime}</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles size={12} /> True Visual WYSIWYG
                  </span>
                </div>
              </div>
            ) : (
              /* Reader Preview */
              <div className="p-6 sm:p-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212] min-h-[400px]">
                <div className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-4">
                  Final Journal Reader Preview
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                  {title || 'Untitled Article'}
                </h1>
                {summary && (
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-300 border-l-2 border-emerald-500 pl-4 mb-8 italic">
                    {summary}
                  </p>
                )}
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none text-base text-gray-800 dark:text-gray-200
                    [&_h2]:text-2xl [&_h2]:font-black [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:pb-2
                    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2
                    [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-emerald-500/10 [&_blockquote]:p-4 [&_blockquote]:rounded-r-2xl [&_blockquote]:italic
                    [&_strong]:font-black
                    [&_b]:font-black
                  "
                  dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(contentHtml) : contentHtml }}
                />
              </div>
            )}
          </div>

          {/* Card: Cover Image */}
          <div className="bg-white dark:bg-[#141414] p-6 sm:p-10 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Article Cover Image</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Select an image displayed in the journal feed and at the top of your article.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PRESET_COVERS.map(preset => (
                <div
                  key={preset.url}
                  onClick={() => setCoverImageUrl(preset.url)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                    coverImageUrl === preset.url 
                      ? 'border-emerald-500 ring-4 ring-emerald-500/20' 
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-28 object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/30 flex items-end p-2.5">
                    <span className="text-white text-xs font-bold">{preset.label}</span>
                  </div>
                  {coverImageUrl === preset.url && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-md">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Custom URL or Upload */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="Or enter image URL (https://...)"
                  className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <label className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 text-xs font-bold cursor-pointer transition-colors">
                <Upload size={14} />
                {uploadingCover ? 'Uploading…' : 'Upload Cover File'}
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

          {/* Card: Author Credentials */}
          <div className="bg-white dark:bg-[#141414] p-6 sm:p-10 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Author Credentials</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Byline details displayed alongside the published article.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">
                  Author Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full text-xs font-bold px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  value={authorTitle}
                  onChange={(e) => setAuthorTitle(e.target.value)}
                  placeholder="e.g. Partner, Innovation IP Law"
                  className="w-full text-xs font-bold px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">
                  Organization / Firm
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Innovation IP Law LLP"
                  className="w-full text-xs font-bold px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submission Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
            <Link
              href="/platform/resources/articles-insights"
              className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel & Discard
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting Article…
                </>
              ) : (
                <>
                  <Send size={15} /> Send For Review
                </>
              )}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
