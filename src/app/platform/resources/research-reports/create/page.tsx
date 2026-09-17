// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Upload, 
  Send, 
  CheckCircle2, 
  Clock, 
  FileText,
  FileCheck,
  Building,
  User,
  Tag,
  Check,
  X,
  AlertCircle,
  Download,
  BookOpen,
  BarChart3,
  Layers,
  Sparkles,
  ShieldCheck,
  HardDrive
} from 'lucide-react';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

const SUBCATEGORIES = [
  { id: 'wipa-research', name: 'WIPA Research' },
  { id: 'lexisnexis-exclusives', name: 'LexisNexis® Exclusives' },
  { id: 'partner', name: 'Partner Research' },
  { id: 'market-data', name: 'Market Data' },
  { id: 'academic', name: 'Academic Research' }
];

const REPORT_TYPES = [
  "Research Paper",
  "White Paper",
  "Industry Report",
  "Survey",
  "Academic Research",
  "Market Report",
  "Case Study"
];

const PRESET_COVERS = [
  { url: '/resourceimg1.jpg', label: 'Global Top 100 Innovation (Tablet)' },
  { url: '/resourceimg2.jpg', label: 'Patent Asset Index Benchmark' },
  { url: '/resource3.jpg', label: 'Technology & Market Trends' }
];

const TOPIC_TAGS = [
  'Global IP',
  'AI in IP',
  'Patent Law',
  'FRAND & SEPs',
  'Litigation Data',
  'Licensing',
  'Brand Protection',
  'Market Forecast',
  'Startups & Tech'
];

export default function ResearchReportCreatePage() {
  const router = useRouter();
  const { user } = useAppStore();

  const [userProfile, setUserProfile] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subcategory, setSubcategory] = useState('wipa-research');
  const [resourceType, setResourceType] = useState('Research Paper');
  const [abstract, setAbstract] = useState('');
  const [keyFindings, setKeyFindings] = useState(['', '', '']);
  const [pageCount, setPageCount] = useState('24 Pages (PDF)');
  const [coverImageUrl, setCoverImageUrl] = useState('/resourceimg1.jpg');
  const [tags, setTags] = useState<string[]>(['Global IP', 'Patent Law']);
  const [tagInput, setTagInput] = useState('');

  // Author & Institution details
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [organization, setOrganization] = useState('');

  // Document upload state
  const [attachedDoc, setAttachedDoc] = useState<{
    file: File;
    name: string;
    sizeFormatted: string;
    sizeBytes: number;
    ext: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [docPublicUrl, setDocPublicUrl] = useState<string | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);

  // Load user profile
  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, title, organization, avatar_url, email')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserProfile(data);
          if (data.full_name && !authorName) setAuthorName(data.full_name);
          if (data.title && !authorTitle) setAuthorTitle(data.title);
          if (data.organization && !organization) setOrganization(data.organization);
        }
      } catch (err) {
        console.warn('Profile load error:', err);
      }
    }
    loadProfile();
  }, [user]);

  // Safe Document File Selection & Validation
  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 35MB
    if (file.size > 35 * 1024 * 1024) {
      alert('File size exceeds the 35MB limit. Please provide a document under 35MB.');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const allowed = ['pdf', 'docx', 'doc', 'epub', 'pptx'];
    if (!allowed.includes(ext)) {
      alert('Please upload a valid document format (.pdf, .docx, .doc, .pptx).');
      return;
    }

    // Format human-readable file size
    const sizeInMB = file.size / (1024 * 1024);
    const sizeFormatted = sizeInMB >= 1 
      ? `${sizeInMB.toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    setAttachedDoc({
      file,
      name: file.name,
      sizeFormatted,
      sizeBytes: file.size,
      ext: ext.toUpperCase()
    });

    // Auto-update read_time / page badge estimate
    if (!pageCount || pageCount === '24 Pages (PDF)') {
      setPageCount(`${ext.toUpperCase()} (${sizeFormatted})`);
    }
  };

  // Safe Image Compression using HTML5 Canvas for Cover Photos
  const compressAndUploadCover = async (file: File) => {
    return new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1600;
        const maxHeight = 1200;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else resolve(file);
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle Cover Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      // Compress image client-side to keep size small while crystal clear
      const compressedBlob = await compressAndUploadCover(file);
      const safeName = `report-cover-${Date.now()}.jpg`;

      const { error: uploadErr } = await supabase.storage
        .from('resources')
        .upload(safeName, compressedBlob, { contentType: 'image/jpeg', cacheControl: '3600', upsert: true });

      if (uploadErr) {
        const { error: altErr } = await supabase.storage
          .from('covers')
          .upload(safeName, compressedBlob, { contentType: 'image/jpeg', cacheControl: '3600', upsert: true });

        if (altErr) throw altErr;
        const { data } = supabase.storage.from('covers').getPublicUrl(safeName);
        if (data?.publicUrl) setCoverImageUrl(data.publicUrl);
      } else {
        const { data } = supabase.storage.from('resources').getPublicUrl(safeName);
        if (data?.publicUrl) setCoverImageUrl(data.publicUrl);
      }
    } catch (err: any) {
      alert('Failed to upload cover: ' + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  // Key findings list helper
  const handleFindingChange = (index: number, val: string) => {
    const updated = [...keyFindings];
    updated[index] = val;
    setKeyFindings(updated);
  };

  const handleAddFindingField = () => {
    if (keyFindings.length < 6) {
      setKeyFindings([...keyFindings, '']);
    }
  };

  // Tag Helpers
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

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a research paper or report headline.');
      return;
    }
    if (!abstract.trim()) {
      alert('Please enter an executive brief / abstract summarizing your research.');
      return;
    }

    setSubmitting(true);
    try {
      let finalDocUrl = docPublicUrl || '';

      // 1. Upload document file if attached (preserving exact binary integrity)
      if (attachedDoc && !finalDocUrl) {
        setUploadingDoc(true);
        const safeDocName = `research-doc-${Date.now()}-${attachedDoc.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        // Upload to resources bucket
        const { error: docUploadErr } = await supabase.storage
          .from('resources')
          .upload(safeDocName, attachedDoc.file, {
            contentType: attachedDoc.file.type || 'application/pdf',
            cacheControl: '3600',
            upsert: true
          });

        if (docUploadErr) {
          // Fallback to covers bucket
          const { error: altDocErr } = await supabase.storage
            .from('covers')
            .upload(safeDocName, attachedDoc.file, {
              contentType: attachedDoc.file.type || 'application/pdf',
              cacheControl: '3600',
              upsert: true
            });

          if (altDocErr) throw new Error('Document upload failed: ' + docUploadErr.message);
          const { data } = supabase.storage.from('covers').getPublicUrl(safeDocName);
          finalDocUrl = data?.publicUrl || '';
        } else {
          const { data } = supabase.storage.from('resources').getPublicUrl(safeDocName);
          finalDocUrl = data?.publicUrl || '';
        }
        setDocPublicUrl(finalDocUrl);
      }

      // 2. Prepare structured HTML content from abstract and key findings
      const validFindings = keyFindings.filter(f => f.trim().length > 0);
      const findingsHtml = validFindings.length > 0
        ? `<h3>Key Findings & Practice Highlights</h3><ul>${validFindings.map(f => `<li>${f.trim()}</li>`).join('')}</ul>`
        : '';

      const structuredHtml = `
        <div class="research-abstract">
          <p class="abstract-text">${abstract.trim()}</p>
        </div>
        ${findingsHtml}
      `;

      const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 55);
      const cleanSlug = `${slugBase}-${Date.now()}`;
      const formatStr = attachedDoc ? `${attachedDoc.ext} (${attachedDoc.sizeFormatted})` : pageCount;

      const payload = {
        title: title.trim(),
        slug: cleanSlug,
        category: 'research-reports',
        subcategory,
        resource_type: resourceType,
        type: resourceType,
        summary: abstract.trim(),
        description: abstract.trim(),
        content: structuredHtml,
        cover_image_url: coverImageUrl || '/resourceimg1.jpg',
        url: finalDocUrl,
        attachment_url: finalDocUrl,
        read_time: formatStr,
        author_name: authorName.trim() || userProfile?.full_name || 'WIPA Researcher',
        author_title: authorTitle.trim() || 'Senior Research Analyst',
        organization: organization.trim() || 'WIPA Intelligence Unit',
        author_avatar: userProfile?.avatar_url || null,
        author_id: user?.id || null,
        submitter_id: user?.id || null,
        submitter_name: authorName.trim() || userProfile?.full_name || user?.email || '',
        submitter_email: user?.email || userProfile?.email || '',
        tags,
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
      console.error('Error submitting research report:', err);
      alert('Failed to publish research report: ' + (err.message || err));
    } finally {
      setSubmitting(false);
      setUploadingDoc(false);
    }
  };

  // Success Confirmation Screen
  if (successData) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#070b14] flex items-center justify-center p-4 font-sans text-slate-900 dark:text-white">
        <div className="max-w-xl w-full bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center justify-center mx-auto shadow-sm">
            <FileCheck size={36} />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-3 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Clock size={13} />
              Under Peer & Editorial Review
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Research Report Submitted!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Your research publication has been uploaded and queued for editorial verification. The WIPA research desk verifies academic rigor and data integrity before publishing to the live global repository.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-left space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-red-500">Submitted Publication</div>
            <div className="font-bold text-base text-slate-900 dark:text-white">{successData.title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1">
              <span className="font-bold text-red-500">[{successData.resource_type}]</span> &bull; 
              <span>{successData.organization}</span> &bull; 
              <span>{successData.read_time}</span>
            </div>
            {successData.url && (
              <div className="pt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 size={13} /> Document securely stored in WIPA cloud repository
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/platform/resources/research-reports"
              className="px-6 py-3.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-500/20 transition-all text-center"
            >
              Return to Research Hub
            </Link>
            <button
              onClick={() => {
                setSuccessData(null);
                setTitle('');
                setAbstract('');
                setKeyFindings(['', '', '']);
                setAttachedDoc(null);
                setDocPublicUrl(null);
              }}
              className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 pb-24 font-sans selection:bg-red-500/20">
      
      {/* Top Navbar */}
      <div className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1322] sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link 
            href="/platform/resources/research-reports" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Archive
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline-flex items-center gap-1.5">
              <BookOpen size={13} className="text-red-500" />
              WIPA Global Research Desk
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[11px] font-black uppercase tracking-wider mb-3">
            <BarChart3 size={13} /> Institutional IP Publishing
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Publish Your <span className="text-red-500">Research</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
            Contribute peer-reviewed market data, white papers, or patent analytics to the global WIPA repository. Upload your executive brief and document for editorial approval.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Report Title & Classification */}
          <div className="bg-white dark:bg-[#0d1322] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            
            {/* Title / Headline */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  Report Title / Headline *
                </label>
                <span className="text-[11px] text-slate-400 font-semibold">{title.length}/160</span>
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cross-Border Standard Essential Patents (SEPs): 2026 Valuation & Licensing Benchmark"
                className="w-full text-xl sm:text-2xl font-black px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-slate-400 text-slate-900 dark:text-white"
              />
            </div>

            {/* Subcategory & Format Classification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                  Repository Category *
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full text-sm font-bold px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all text-slate-900 dark:text-white"
                >
                  {SUBCATEGORIES.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                  Publication Type *
                </label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full text-sm font-bold px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all text-slate-900 dark:text-white"
                >
                  {REPORT_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-slate-900 text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Executive Brief / Abstract */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  Executive Brief / Abstract *
                </label>
                <span className="text-[11px] text-slate-400 font-semibold">{abstract.length}/600</span>
              </div>
              <textarea
                required
                rows={4}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Provide a comprehensive abstract outlining the empirical methodology, dataset scope, jurisdictions investigated, and principal actionable takeaways for enterprise counsel and policymakers..."
                className="w-full text-sm font-medium px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-slate-400 text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            {/* Key Findings Highlights (Optional Bullets) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  Key Findings & Highlights
                </label>
                {keyFindings.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddFindingField}
                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                  >
                    + Add Bullet
                  </button>
                )}
              </div>
              <div className="space-y-2.5">
                {keyFindings.map((finding, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-black text-red-500 w-5 text-center">{idx + 1}.</span>
                    <input
                      type="text"
                      value={finding}
                      onChange={(e) => handleFindingChange(idx, e.target.value)}
                      placeholder={`Finding ${idx + 1}: e.g. Average global litigation duration decreased by 18% in participating trial venues...`}
                      className="flex-1 text-xs sm:text-sm font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Section 2: Document Upload & Compression Integrity */}
          <div className="bg-white dark:bg-[#0d1322] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  Upload Report Document (.PDF / .DOCX) *
                </label>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={13} /> Binary Integrity Guaranteed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Upload your publication document. Exact file structure and tables are preserved byte-for-byte in the cloud repository.
              </p>

              {/* Upload Dropzone */}
              {!attachedDoc ? (
                <label className="border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-red-500 dark:hover:border-red-500 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/30 text-center group">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.pptx"
                    onChange={handleDocSelect}
                    className="hidden"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Click to browse or drag & drop document
                  </div>
                  <div className="text-xs text-slate-400">
                    Supports PDF, DOCX, EPUB (Max 35MB)
                  </div>
                </label>
              ) : (
                <div className="p-5 rounded-2xl border border-red-500/30 bg-red-500/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                      {attachedDoc.ext}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                        {attachedDoc.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>{attachedDoc.sizeFormatted}</span>
                        <span>&bull;</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Ready for repository upload
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAttachedDoc(null);
                      setDocPublicUrl(null);
                    }}
                    className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    title="Remove document"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Page Count / Format Label Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                  Format / Page Badge *
                </label>
                <input
                  type="text"
                  required
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                  placeholder="e.g. 36 Pages (PDF) or PDF (12MB)"
                  className="w-full text-sm font-semibold px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                  Topic Keyword Tags
                </label>
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
                    placeholder="Type keyword and press Enter..."
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagInput)}
                    className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Tags Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {TOPIC_TAGS.map((t) => {
                const isSelected = tags.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => isSelected ? handleRemoveTag(t) : handleAddTag(t)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      isSelected 
                        ? 'bg-red-500 text-white shadow-xs' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{t}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Section 3: Cover Image & Author Credentials */}
          <div className="bg-white dark:bg-[#0d1322] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            
            {/* Cover Image Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-3">
                Publication Dossier Cover *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                {/* Preset Options */}
                {PRESET_COVERS.map((preset) => (
                  <button
                    type="button"
                    key={preset.url}
                    onClick={() => setCoverImageUrl(preset.url)}
                    className={`relative rounded-2xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer group text-left ${
                      coverImageUrl === preset.url
                        ? 'border-red-500 ring-2 ring-red-500/30'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-400'
                    }`}
                  >
                    <img src={preset.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-bold text-white truncate">{preset.label}</span>
                    </div>
                    {coverImageUrl === preset.url && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-sm">
                        <Check size={10} />
                      </div>
                    )}
                  </button>
                ))}

                {/* Upload Custom Cover with Canvas Compression */}
                <label className="relative rounded-2xl aspect-[4/3] border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-red-500 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center p-3 cursor-pointer transition-all text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                  {uploadingCover ? (
                    <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                  ) : (
                    <>
                      <Upload size={18} className="text-slate-400 mb-1" />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Upload Cover</span>
                      <span className="text-[9px] text-slate-400">Auto-compressed</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Author Byline & Organization */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-slate-200 dark:border-white/10">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                  Lead Author / Researcher *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Dr. Samuel Chen"
                  className="w-full text-sm font-semibold px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                  Author Professional Title
                </label>
                <input
                  type="text"
                  value={authorTitle}
                  onChange={(e) => setAuthorTitle(e.target.value)}
                  placeholder="e.g. Principal IP Economist"
                  className="w-full text-sm font-semibold px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">
                  Institution / Law Firm *
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Stanford Law School / WIPA"
                  className="w-full text-sm font-semibold px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

          </div>

          {/* Section 4: Submission Action Footer */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Peer Review & Editorial Verification</div>
                <div className="text-slate-500 dark:text-slate-400">All submissions pass through our verified WIPA research review desk before broadcasting live.</div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing to Repository...</span>
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

    </div>
  );
}
