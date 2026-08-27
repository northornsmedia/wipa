'use client';

import React, { use, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  Trash2, 
  Plus, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  Palette, 
  Layout, 
  FileText, 
  Tag, 
  Gift, 
  Users, 
  ShieldCheck, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Moon, 
  Sun, 
  Sparkles,
  Building,
  MapPin,
  Globe,
  Mail,
  Phone,
  CheckCircle2,
  Copy
} from 'lucide-react';
import Link from 'next/link';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { IPServiceConfig, parseIPServiceConfig, DEFAULT_PSS_CONFIG, DEFAULT_GENIE_CONFIG } from '@/lib/ip-services-config';

const COLOR_PRESETS = [
  { name: 'Purple (Genie)', hex: '#7c3aed', from: 'from-purple-100 dark:from-[#2e1065]/40', to: 'to-slate-100 dark:to-black' },
  { name: 'Sky Blue (PSS)', hex: '#0284c7', from: 'from-sky-100 dark:from-[#082f49]', to: 'to-slate-100 dark:to-black' },
  { name: 'WIPA Royal', hex: '#5a32fa', from: 'from-indigo-100 dark:from-[#1e1b4b]', to: 'to-slate-100 dark:to-black' },
  { name: 'Emerald Green', hex: '#059669', from: 'from-emerald-100 dark:from-[#064e3b]/40', to: 'to-slate-100 dark:to-black' },
  { name: 'Amber Gold', hex: '#d97706', from: 'from-amber-100 dark:from-[#78350f]/40', to: 'to-slate-100 dark:to-black' },
  { name: 'Rose Red', hex: '#e11d48', from: 'from-rose-100 dark:from-[#881337]/40', to: 'to-slate-100 dark:to-black' },
];

export default function AdminIPServiceEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;

  const [config, setConfig] = useState<IPServiceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'hero' | 'about' | 'metrics' | 'offer' | 'versions' | 'services' | 'expert'>('theme');
  const [previewMode, setPreviewMode] = useState<'split' | 'preview-only' | 'editor-only'>('split');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch or initialize config
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .or(`id.eq.${serviceId},slug.eq.${serviceId}`)
          .single();

        if (data) {
          setConfig(parseIPServiceConfig(data));
        } else if (serviceId === 'pss-solutions' || serviceId === '821d981f-54f5-4d57-976f-6fd1cb998022') {
          setConfig(DEFAULT_PSS_CONFIG);
        } else if (serviceId === 'genie-ai' || serviceId === '3022bf12-b177-4387-a478-1e86178adda2') {
          setConfig(DEFAULT_GENIE_CONFIG);
        } else {
          setConfig({
            ...DEFAULT_GENIE_CONFIG,
            id: serviceId,
            title: "New IP Service",
            slug: "new-service"
          });
        }
      } catch (err) {
        console.error("Error loading service config:", err);
        setConfig(DEFAULT_GENIE_CONFIG);
      }
      setLoading(false);
    };

    fetchConfig();
  }, [serviceId]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  // Storage cleanup helper: deletes old file from Supabase storage if it was stored there
  const deleteOldStorageFile = async (url?: string) => {
    if (!url) return;
    try {
      if (url.includes('/storage/v1/object/public/resources/')) {
        const path = url.split('/storage/v1/object/public/resources/')[1];
        if (path) {
          await supabase.storage.from('resources').remove([decodeURIComponent(path)]);
          console.log("Cleaned up previous storage file:", path);
        }
      }
    } catch (e) {
      console.warn("Could not delete old storage file:", e);
    }
  };

  // Logo upload handler with auto-delete of old file
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !config) return;
    setUploadingLogo(true);

    try {
      // 1. Delete previous file if in storage
      await deleteOldStorageFile(config.url);

      // 2. Upload new file
      const fileExt = file.name.split('.').pop();
      const fileName = `ip-services/logo-${config.slug || 'service'}-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('resources').upload(fileName, file, {
        upsert: true,
        cacheControl: '3600'
      });

      if (error) throw error;

      const { data: publicData } = supabase.storage.from('resources').getPublicUrl(fileName);
      const newUrl = publicData.publicUrl;

      setConfig(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          url: newUrl,
          hero: {
            ...prev.hero!,
            logoUrl: newUrl
          }
        };
      });

      showToast("Uploaded new logo & cleaned up old storage file!");
    } catch (err: any) {
      showToast("Upload failed: " + err.message, 'error');
    }
    setUploadingLogo(false);
  };

  // Avatar upload handler with auto-delete of old file
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !config) return;
    setUploadingAvatar(true);

    try {
      await deleteOldStorageFile(config.expert?.avatar);

      const fileExt = file.name.split('.').pop();
      const fileName = `ip-services/expert-${config.slug || 'service'}-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('resources').upload(fileName, file, {
        upsert: true,
        cacheControl: '3600'
      });

      if (error) throw error;

      const { data: publicData } = supabase.storage.from('resources').getPublicUrl(fileName);
      const newUrl = publicData.publicUrl;

      setConfig(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          expert: {
            ...prev.expert!,
            avatar: newUrl
          }
        };
      });

      showToast("Uploaded new expert photo!");
    } catch (err: any) {
      showToast("Upload failed: " + err.message, 'error');
    }
    setUploadingAvatar(false);
  };

  // Save all changes to Supabase
  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);

    try {
      const payload = {
        title: config.title,
        slug: config.slug,
        category: config.category,
        subcategory: config.subcategory,
        description: config.description,
        type: 'ip_services',
        url: config.url || config.hero?.logoUrl || '',
        external_url: config.external_url || config.hero?.ctaUrl || '',
        is_featured: config.is_featured,
        is_splash_sponsored: config.is_splash_sponsored,
        content: JSON.stringify(config),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('resources')
        .update(payload)
        .eq('id', config.id);

      if (error) throw error;

      showToast("All changes published successfully!");
    } catch (err: any) {
      showToast("Save failed: " + err.message, 'error');
    }
    setIsSaving(false);
  };

  if (loading || !config) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-[#5a32fa]" />
        <p className="text-gray-500 font-bold text-sm">Loading Visual Editor...</p>
      </div>
    );
  }

  const primaryColor = config.theme?.primaryColor || '#7c3aed';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {message && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-white font-bold animate-in fade-in slide-in-from-top-4 duration-300 ${
          message.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          {message.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/ip-services"
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                Editing: {config.title}
              </h1>
              <span className="text-xs font-mono bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md font-bold">
                /{config.slug}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Customize layout, colors, typography, marketing versions, and exclusive offers with live preview.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200 dark:border-white/10">
            <button
              onClick={() => setPreviewMode('editor-only')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                previewMode === 'editor-only' ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              Editor Only
            </button>
            <button
              onClick={() => setPreviewMode('split')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                previewMode === 'split' ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setPreviewMode('preview-only')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                previewMode === 'preview-only' ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              Live Preview
            </button>
          </div>

          <Link
            href={`/platform/resources/ip-services/${config.slug || config.id}`}
            target="_blank"
            className="px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <ExternalLink size={15} /> Public Link
          </Link>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#5a32fa] hover:bg-[#4924dc] text-white px-6 py-2.5 rounded-2xl font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Saving...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      {/* Main Workspace (Split Grid) */}
      <div className={`grid gap-8 ${
        previewMode === 'split' ? 'grid-cols-1 xl:grid-cols-12' : 'grid-cols-1'
      }`}>
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: EDITOR CONTROLS */}
        {/* ========================================================================= */}
        {(previewMode === 'split' || previewMode === 'editor-only') && (
          <div className={`${previewMode === 'split' ? 'xl:col-span-6' : 'max-w-4xl mx-auto w-full'} space-y-6`}>
            
            {/* Editor Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-white dark:bg-[#1e293b] p-2 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
              {[
                { id: 'theme', label: 'Theme & Brand', icon: Palette },
                { id: 'hero', label: 'Hero Banner', icon: Layout },
                { id: 'about', label: 'About & Text', icon: FileText },
                { id: 'metrics', label: 'Key Numbers', icon: Layers },
                { id: 'offer', label: 'Exclusive Offer', icon: Gift },
                { id: 'versions', label: 'Versions Copy', icon: Tag },
                { id: 'services', label: 'Capabilities', icon: ShieldCheck },
                { id: 'expert', label: 'Expert Card', icon: Users },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive 
                        ? 'bg-[#5a32fa] text-white shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: THEME & BRAND */}
            {activeTab === 'theme' && (
              <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Palette size={20} className="text-[#5a32fa]" /> Theme & Brand Palette
                </h3>

                {/* Color presets */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                    Primary Brand Color Preset
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => {
                          setConfig(prev => prev ? {
                            ...prev,
                            theme: {
                              ...prev.theme!,
                              primaryColor: preset.hex,
                              gradientFrom: preset.from,
                              gradientTo: preset.to
                            }
                          } : prev);
                        }}
                        className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                          primaryColor === preset.hex ? 'border-[#5a32fa] ring-2 ring-[#5a32fa]/30' : 'border-gray-200 dark:border-white/10'
                        }`}
                      >
                        <span className="w-7 h-7 rounded-full shadow-sm" style={{ backgroundColor: preset.hex }} />
                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 line-clamp-1">{preset.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Hex input */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                      Custom Primary Hex
                    </label>
                    <input 
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        theme: { ...prev.theme!, primaryColor: e.target.value }
                      } : prev)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-mono text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                      Badge Text
                    </label>
                    <input 
                      type="text"
                      value={config.theme?.badgeLabel || 'Official WIPA Partner'}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        theme: { ...prev.theme!, badgeLabel: e.target.value }
                      } : prev)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                    />
                  </div>
                </div>

                {/* Logo Uploader with Storage Cleanup */}
                <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                    Company Logo (PNG / SVG)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 flex items-center justify-center shrink-0">
                      {config.url ? (
                        <img src={config.url} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <Building size={30} className="text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-800 dark:text-white font-bold text-xs transition-colors">
                        <Upload size={15} />
                        {uploadingLogo ? 'Uploading & Cleaning Old File...' : 'Upload & Replace Logo'}
                        <input 
                          type="file" 
                          accept="image/*,.svg" 
                          onChange={handleLogoUpload} 
                          disabled={uploadingLogo} 
                          className="hidden" 
                        />
                      </label>
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        Replacing a logo automatically removes previous file storage to save quota.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Meta Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                      Company Name
                    </label>
                    <input 
                      type="text"
                      value={config.title}
                      onChange={(e) => setConfig(prev => prev ? { ...prev, title: e.target.value } : prev)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                      Location / Jurisdictions
                    </label>
                    <input 
                      type="text"
                      value={config.location || ''}
                      onChange={(e) => setConfig(prev => prev ? { ...prev, location: e.target.value } : prev)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                      Website URL
                    </label>
                    <input 
                      type="text"
                      value={config.website || ''}
                      onChange={(e) => setConfig(prev => prev ? { ...prev, website: e.target.value } : prev)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                      Subcategory Tag
                    </label>
                    <input 
                      type="text"
                      value={config.subcategory || ''}
                      onChange={(e) => setConfig(prev => prev ? { ...prev, subcategory: e.target.value } : prev)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: HERO BANNER */}
            {activeTab === 'hero' && (
              <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Layout size={20} className="text-[#5a32fa]" /> Hero Banner Section
                </h3>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                    Hero Headline *
                  </label>
                  <textarea 
                    rows={2}
                    value={config.hero?.headline || ''}
                    onChange={(e) => setConfig(prev => prev ? {
                      ...prev,
                      hero: { ...prev.hero!, headline: e.target.value }
                    } : prev)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                    Hero Subtitle / Description
                  </label>
                  <textarea 
                    rows={3}
                    value={config.hero?.subheadline || ''}
                    onChange={(e) => setConfig(prev => prev ? {
                      ...prev,
                      hero: { ...prev.hero!, subheadline: e.target.value }
                    } : prev)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                      Button CTA Label
                    </label>
                    <input 
                      type="text"
                      value={config.hero?.ctaText || 'Visit Website'}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        hero: { ...prev.hero!, ctaText: e.target.value }
                      } : prev)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                      Button Target URL
                    </label>
                    <input 
                      type="text"
                      value={config.hero?.ctaUrl || ''}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        hero: { ...prev.hero!, ctaUrl: e.target.value }
                      } : prev)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ABOUT */}
            {activeTab === 'about' && (
              <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText size={20} className="text-[#5a32fa]" /> About & Philosophy
                </h3>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                    Section Heading
                  </label>
                  <input 
                    type="text"
                    value={config.about?.heading || ''}
                    onChange={(e) => setConfig(prev => prev ? {
                      ...prev,
                      about: { ...prev.about!, heading: e.target.value }
                    } : prev)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                      Narrative Paragraphs
                    </label>
                    <button
                      type="button"
                      onClick={() => setConfig(prev => prev ? {
                        ...prev,
                        about: {
                          ...prev.about!,
                          paragraphs: [...(prev.about?.paragraphs || []), ""]
                        }
                      } : prev)}
                      className="text-xs font-bold text-[#5a32fa] flex items-center gap-1 hover:underline"
                    >
                      <Plus size={14} /> Add Paragraph
                    </button>
                  </div>

                  <div className="space-y-3">
                    {config.about?.paragraphs?.map((para, idx) => (
                      <div key={idx} className="flex gap-2">
                        <textarea 
                          rows={3}
                          value={para}
                          onChange={(e) => {
                            const newParas = [...(config.about?.paragraphs || [])];
                            newParas[idx] = e.target.value;
                            setConfig(prev => prev ? {
                              ...prev,
                              about: { ...prev.about!, paragraphs: newParas }
                            } : prev);
                          }}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newParas = config.about?.paragraphs?.filter((_, i) => i !== idx) || [];
                            setConfig(prev => prev ? {
                              ...prev,
                              about: { ...prev.about!, paragraphs: newParas }
                            } : prev);
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                    Highlight Pull Quote
                  </label>
                  <textarea 
                    rows={2}
                    value={config.about?.quote || ''}
                    onChange={(e) => setConfig(prev => prev ? {
                      ...prev,
                      about: { ...prev.about!, quote: e.target.value }
                    } : prev)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-medium italic"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: KEY NUMBERS & METRICS */}
            {activeTab === 'metrics' && (
              <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Layers size={20} className="text-[#5a32fa]" /> Scale & Stats Metrics
                  </h3>
                  <button
                    type="button"
                    onClick={() => setConfig(prev => prev ? {
                      ...prev,
                      metrics: [...(prev.metrics || []), { label: "Metric Label", value: "100+", icon: "Star" }]
                    } : prev)}
                    className="text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-purple-100"
                  >
                    <Plus size={14} /> Add Metric
                  </button>
                </div>

                <div className="space-y-4">
                  {config.metrics?.map((metric, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-4">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Value (e.g. 200,000+)</label>
                          <input 
                            type="text"
                            value={metric.value}
                            onChange={(e) => {
                              const newMetrics = [...(config.metrics || [])];
                              newMetrics[idx].value = e.target.value;
                              setConfig(prev => prev ? { ...prev, metrics: newMetrics } : prev);
                            }}
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Label (e.g. Active Users)</label>
                          <input 
                            type="text"
                            value={metric.label}
                            onChange={(e) => {
                              const newMetrics = [...(config.metrics || [])];
                              newMetrics[idx].label = e.target.value;
                              setConfig(prev => prev ? { ...prev, metrics: newMetrics } : prev);
                            }}
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-sm font-bold"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newMetrics = config.metrics?.filter((_, i) => i !== idx) || [];
                          setConfig(prev => prev ? { ...prev, metrics: newMetrics } : prev);
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: EXCLUSIVE OFFER */}
            {activeTab === 'offer' && (
              <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Gift size={20} className="text-[#5a32fa]" /> WIPA Exclusive Member Offer
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.offer?.enabled !== false} 
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        offer: { ...prev.offer!, enabled: e.target.checked }
                      } : prev)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5a32fa]"></div>
                    <span className="ml-3 text-xs font-bold text-gray-700 dark:text-gray-300">
                      {config.offer?.enabled !== false ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                      Offer Headline
                    </label>
                    <input 
                      type="text"
                      value={config.offer?.title || ''}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        offer: { ...prev.offer!, title: e.target.value }
                      } : prev)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                        Discount / Rate Callout (e.g. 50% Off)
                      </label>
                      <input 
                        type="text"
                        value={config.offer?.discount || ''}
                        onChange={(e) => setConfig(prev => prev ? {
                          ...prev,
                          offer: { ...prev.offer!, discount: e.target.value }
                        } : prev)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold text-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                        Promo Code (e.g. WIPA)
                      </label>
                      <input 
                        type="text"
                        value={config.offer?.promoCode || ''}
                        onChange={(e) => setConfig(prev => prev ? {
                          ...prev,
                          offer: { ...prev.offer!, promoCode: e.target.value }
                        } : prev)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-mono text-sm font-bold uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                      Offer Description & Terms
                    </label>
                    <textarea 
                      rows={3}
                      value={config.offer?.description || ''}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        offer: { ...prev.offer!, description: e.target.value }
                      } : prev)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                        Redemption URL
                      </label>
                      <input 
                        type="text"
                        value={config.offer?.ctaUrl || ''}
                        onChange={(e) => setConfig(prev => prev ? {
                          ...prev,
                          offer: { ...prev.offer!, ctaUrl: e.target.value }
                        } : prev)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                        Partnerships Contact Email
                      </label>
                      <input 
                        type="email"
                        value={config.offer?.contactEmail || ''}
                        onChange={(e) => setConfig(prev => prev ? {
                          ...prev,
                          offer: { ...prev.offer!, contactEmail: e.target.value }
                        } : prev)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: VERSIONS COPY */}
            {activeTab === 'versions' && (
              <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Tag size={20} className="text-[#5a32fa]" /> Multi-Version Messaging
                </h3>

                {/* Version 1 */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Version 1: Short and Simple (Blurb / Newsletter)
                  </span>
                  <textarea 
                    rows={3}
                    value={config.versions?.v1?.text || ''}
                    onChange={(e) => setConfig(prev => prev ? {
                      ...prev,
                      versions: {
                        ...prev.versions,
                        v1: { ...prev.versions?.v1, text: e.target.value }
                      }
                    } : prev)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-sm font-medium"
                  />
                </div>

                {/* Version 2 */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Version 2: Standard (Dedicated Email / Partner Page)
                  </span>
                  <textarea 
                    rows={4}
                    value={config.versions?.v2?.text || ''}
                    onChange={(e) => setConfig(prev => prev ? {
                      ...prev,
                      versions: {
                        ...prev.versions,
                        v2: { ...prev.versions?.v2, text: e.target.value }
                      }
                    } : prev)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-sm font-medium"
                  />
                </div>

                {/* Version 3 */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Version 3: Detailed with Full Terms
                  </span>
                  <textarea 
                    rows={5}
                    value={config.versions?.v3?.text || ''}
                    onChange={(e) => setConfig(prev => prev ? {
                      ...prev,
                      versions: {
                        ...prev.versions,
                        v3: { ...prev.versions?.v3, text: e.target.value }
                      }
                    } : prev)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-sm font-medium"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: SERVICES & CAPABILITIES */}
            {activeTab === 'services' && (
              <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck size={20} className="text-[#5a32fa]" /> Areas of Expertise
                  </h3>
                  <button
                    type="button"
                    onClick={() => setConfig(prev => prev ? {
                      ...prev,
                      services: [...(prev.services || []), "New Capability"]
                    } : prev)}
                    className="text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-xl flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {config.services?.map((svc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input 
                        type="text"
                        value={svc}
                        onChange={(e) => {
                          const newServices = [...(config.services || [])];
                          newServices[idx] = e.target.value;
                          setConfig(prev => prev ? { ...prev, services: newServices } : prev);
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newServices = config.services?.filter((_, i) => i !== idx) || [];
                          setConfig(prev => prev ? { ...prev, services: newServices } : prev);
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: EXPERT CARD */}
            {activeTab === 'expert' && (
              <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Users size={20} className="text-[#5a32fa]" /> Expert / Leadership Card
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.expert?.enabled !== false} 
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        expert: { ...prev.expert!, enabled: e.target.checked }
                      } : prev)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5a32fa]"></div>
                    <span className="ml-3 text-xs font-bold text-gray-700 dark:text-gray-300">
                      {config.expert?.enabled !== false ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                <div className="space-y-4">
                  {/* Photo Uploader */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 overflow-hidden shrink-0">
                      {config.expert?.avatar ? (
                        <img src={config.expert.avatar} alt="Expert" className="w-full h-full object-cover" />
                      ) : (
                        <Users size={30} className="text-gray-400 m-auto mt-4" />
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 font-bold text-xs">
                        <Upload size={14} />
                        {uploadingAvatar ? 'Uploading...' : 'Upload Expert Photo'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleAvatarUpload} 
                          disabled={uploadingAvatar} 
                          className="hidden" 
                        />
                      </label>
                      <p className="text-[11px] text-gray-400 mt-1">Automatically replaces old file in storage.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Expert Name</label>
                      <input 
                        type="text"
                        value={config.expert?.name || ''}
                        onChange={(e) => setConfig(prev => prev ? {
                          ...prev,
                          expert: { ...prev.expert!, name: e.target.value }
                        } : prev)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Role / Title</label>
                      <input 
                        type="text"
                        value={config.expert?.role || ''}
                        onChange={(e) => setConfig(prev => prev ? {
                          ...prev,
                          expert: { ...prev.expert!, role: e.target.value }
                        } : prev)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Contact Email</label>
                    <input 
                      type="email"
                      value={config.expert?.email || ''}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        expert: { ...prev.expert!, email: e.target.value }
                      } : prev)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: REAL-TIME LIVE PREVIEW PANE */}
        {/* ========================================================================= */}
        {(previewMode === 'split' || previewMode === 'preview-only') && (
          <div className={`${previewMode === 'split' ? 'xl:col-span-6' : 'max-w-5xl mx-auto w-full'} space-y-4`}>
            
            {/* Preview Toolbar */}
            <div className="bg-white dark:bg-[#1e293b] p-3 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Live Preview Mode
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {previewTheme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-500" />}
                  {previewTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>

            {/* Live Render Container */}
            <div className={`rounded-[2rem] border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl transition-colors ${
              previewTheme === 'dark' ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'
            } max-h-[850px] overflow-y-auto`}>
              
              {/* Preview Header Banner */}
              <div className="relative p-8 md:p-10 border-b border-white/10 overflow-hidden" style={{
                background: `linear-gradient(135deg, ${primaryColor}25 0%, transparent 100%)`
              }}>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-3 flex items-center justify-center shrink-0">
                    {config.url ? (
                      <img src={config.url} alt="Logo" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Building size={32} />
                    )}
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 backdrop-blur-md mb-2">
                      {config.theme?.badgeLabel || "Sponsored Partner"}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black">{config.title}</h2>
                    <p className="text-xs opacity-75 mt-1 flex items-center gap-2">
                      <MapPin size={13} /> {config.location || 'Global'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Body Content */}
              <div className="p-6 md:p-8 space-y-8">
                
                {/* 1. Hero Card */}
                <div className="p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden" style={{
                  background: `linear-gradient(135deg, ${primaryColor}15 0%, rgba(255,255,255,0.03) 100%)`
                }}>
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-70 mb-3 block">
                    Hero Section
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black leading-tight mb-3">
                    {config.hero?.headline || config.title}
                  </h3>
                  <p className="text-sm opacity-80 leading-relaxed mb-6 font-medium">
                    {config.hero?.subheadline || config.description}
                  </p>
                  <button 
                    className="px-6 py-3 rounded-xl font-black text-white text-xs shadow-lg flex items-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {config.hero?.ctaText || 'Visit Provider'} →
                  </button>
                </div>

                {/* 2. Metrics Bar */}
                {config.metrics && config.metrics.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {config.metrics.map((m, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                        <span className="text-xl font-black block" style={{ color: primaryColor }}>{m.value}</span>
                        <span className="text-[10px] font-bold opacity-70 uppercase tracking-wider">{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. About Section */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <h4 className="text-xl font-black">{config.about?.heading || "About"}</h4>
                  <div className="space-y-3 text-xs opacity-80 leading-relaxed font-medium">
                    {config.about?.paragraphs?.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  {config.about?.quote && (
                    <blockquote className="p-4 rounded-xl border-l-4 italic text-xs font-semibold bg-white/5" style={{ borderColor: primaryColor }}>
                      "{config.about.quote}"
                    </blockquote>
                  )}
                </div>

                {/* 4. Exclusive Offer Box */}
                {config.offer?.enabled !== false && (
                  <div className="p-6 md:p-8 rounded-3xl border text-white relative overflow-hidden shadow-xl" style={{
                    background: `linear-gradient(135deg, ${primaryColor}dd 0%, #0f172a 100%)`,
                    borderColor: `${primaryColor}66`
                  }}>
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase mb-3">
                      <Gift size={12} className="inline mr-1" /> {config.offer?.badge || "Exclusive Member Offer"}
                    </span>
                    <h4 className="text-2xl font-black mb-2">{config.offer?.title || "Special Member Offer"}</h4>
                    <p className="text-xs opacity-90 leading-relaxed mb-4 font-medium">{config.offer?.description}</p>
                    
                    {config.offer?.promoCode && (
                      <div className="inline-flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/20 mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Code:</span>
                        <span className="text-base font-mono font-black">{config.offer.promoCode}</span>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs shadow-md">
                        {config.offer?.ctaText || "Claim Offer"} →
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. Capabilities */}
                {config.services && config.services.length > 0 && (
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <h4 className="text-lg font-black flex items-center gap-2">
                      <ShieldCheck size={18} style={{ color: primaryColor }} /> Areas of Expertise
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {config.services.map((s, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/5 flex items-center gap-2 text-xs font-bold">
                          <CheckCircle2 size={14} style={{ color: primaryColor }} />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Expert Card */}
                {config.expert?.enabled !== false && config.expert?.name && (
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white/20">
                      {config.expert.avatar ? (
                        <img src={config.expert.avatar} alt={config.expert.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users size={24} className="m-auto mt-3" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-black text-base">{config.expert.name}</h5>
                      <p className="text-xs opacity-75 font-medium">{config.expert.role}</p>
                      {config.expert.email && (
                        <p className="text-[11px] font-mono mt-1 opacity-60">{config.expert.email}</p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
