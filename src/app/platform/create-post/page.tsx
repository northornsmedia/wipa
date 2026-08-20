// @ts-nocheck
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, Image as ImageIcon, Video, FileText, Sparkles, 
  Globe, Lock, MapPin, Users, Music, Smile, Loader2, 
  Trash2, Check, ArrowLeft, Send, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { optimizeFeedUpload } from '@/lib/feedPerformance';

const POPULAR_TOPICS = ['Patents', 'Trademarks', 'AI Law', 'Copyright', 'Litigation', 'Career Advice'];
const EMOJIS = ['💡', '⚖️', '📜', '✨', '🚀', '💼', '🎯', '🤝', '🔥', '👏', '🎉', '📈'];

export default function CreatePostPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  
  const [postContent, setPostContent] = useState('');
  const [postPrivacy, setPostPrivacy] = useState<'Anyone' | 'Followers only'>('Anyone');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [locationTag, setLocationTag] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [attachedMedia, setAttachedMedia] = useState<{
    file: File;
    previewUrl: string;
    type: 'image' | 'video' | 'doc';
    name: string;
    size?: string;
  } | null>(null);

  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea on load
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'doc') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = type === 'doc' ? '' : URL.createObjectURL(file);
    const sizeInKb = (file.size / 1024).toFixed(1) + ' KB';
    setAttachedMedia({
      file,
      previewUrl,
      type,
      name: file.name,
      size: sizeInKb
    });
    setUploadError(null);
  };

  const handleAiDraft = async () => {
    setIsAiGenerating(true);
    try {
      const topic = selectedTopic || 'Intellectual Property and technology innovation';
      const prompt = `Draft a concise, high-engagement professional LinkedIn/community post about ${topic} from a modern IP legal expert's perspective. Include relevant hashtags.`;
      
      const res = await fetch('/api/proxy-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'gemini-1.5-flash' })
      });
      
      const data = await res.json();
      if (data?.text) {
        setPostContent(data.text);
      } else {
        setPostContent(`Excited to share insights on ${topic}! Navigating international IP protection requires strategic foresight and cross-border alignment. What key trends are you observing in your practice? #IPLaw #IntellectualProperty #WIPA`);
      }
    } catch (e) {
      setPostContent(`Excited to share insights on ${selectedTopic || 'global IP trends'}! Navigating international IP protection requires strategic foresight and cross-border alignment. What key trends are you observing in your practice? #IPLaw #IntellectualProperty #WIPA`);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!postContent.trim() && !attachedMedia) return;
    if (!user?.id) {
      setUploadError('You must be logged in to post.');
      return;
    }

    setIsPublishing(true);
    setUploadError(null);

    let mediaUrls: string[] = [];
    let mediaType = attachedMedia?.type || null;
    let docName = attachedMedia?.name || null;

    try {
      // 1. Upload media if present
      if (attachedMedia?.file) {
        const uploadFile = attachedMedia.type === 'image'
          ? await optimizeFeedUpload(attachedMedia.file)
          : attachedMedia.file;
        const safeName = uploadFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${user.id}/${Date.now()}-${safeName}`;
        
        const { error: uploadErr } = await supabase.storage
          .from('feed-media')
          .upload(fileName, uploadFile, {
            upsert: false,
            cacheControl: '31536000',
            contentType: uploadFile.type || undefined,
          });

        if (uploadErr) {
          setUploadError('Failed to upload file: ' + uploadErr.message);
          setIsPublishing(false);
          return;
        }

        const { data: urlData } = supabase.storage.from('feed-media').getPublicUrl(fileName);
        if (urlData?.publicUrl) {
          mediaUrls = [urlData.publicUrl];
        }
      }

      // Build full content with tags if specified
      let finalContent = postContent;
      if (locationTag.trim()) {
        finalContent += `\n\n📍 ${locationTag.trim()}`;
      }
      if (selectedTopic) {
        if (!finalContent.includes(`#${selectedTopic.replace(/\s+/g, '')}`)) {
          finalContent += ` #${selectedTopic.replace(/\s+/g, '')}`;
        }
      }

      // 2. Insert into feed_posts
      const { error } = await supabase.from('feed_posts').insert({
        author_id: user.id,
        content: finalContent,
        privacy: postPrivacy,
        media_urls: mediaUrls,
        media_type: mediaType,
        document_name: docName
      });

      if (error) {
        setUploadError('Failed to publish post: ' + error.message);
        setIsPublishing(false);
        return;
      }

      // 3. Award XP
      try {
        await fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            xpAmount: 25,
            reason: 'First Post',
            referenceId: null
          })
        });
      } catch (e) {}

      setIsPublishing(false);
      setPublishSuccess(true);
      
      setTimeout(() => {
        router.push('/platform');
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Something went wrong while publishing.');
      setIsPublishing(false);
    }
  };

  const isPostEmpty = !postContent.trim() && !attachedMedia;

  return (
    <div className="fixed inset-0 z-50 h-[100dvh] max-h-[100dvh] w-full max-w-full min-w-0 bg-white dark:bg-[#0b0f19] text-gray-900 dark:text-white flex flex-col overflow-hidden box-border">
      
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={imageInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={(e) => handleMediaSelect(e, 'image')} 
      />
      <input 
        type="file" 
        ref={videoInputRef} 
        accept="video/*" 
        className="hidden" 
        onChange={(e) => handleMediaSelect(e, 'video')} 
      />
      <input 
        type="file" 
        ref={docInputRef} 
        accept=".pdf,.doc,.docx,.txt" 
        className="hidden" 
        onChange={(e) => handleMediaSelect(e, 'doc')} 
      />

      {/* TOP APP BAR (Instagram Style) */}
      <header className="shrink-0 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/80 px-4 h-14 flex items-center justify-between pt-safe z-10">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200 flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Cancel and close"
        >
          <X size={20} />
        </button>

        <h1 className="text-base font-black tracking-tight text-gray-900 dark:text-white">
          New post
        </h1>

        <button
          onClick={handlePublish}
          disabled={isPostEmpty || isPublishing || publishSuccess}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
            isPostEmpty || isPublishing
              ? 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-[#5a32fa] hover:bg-[#4a24db] text-white active:scale-95 shadow-[#5a32fa]/30'
          }`}
        >
          {isPublishing ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Sharing...</span>
            </>
          ) : publishSuccess ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span>Shared!</span>
            </>
          ) : (
            <span>Share</span>
          )}
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 max-w-2xl mx-auto w-full box-border [scrollbar-width:none]">
        
        {/* Error Alert */}
        {uploadError && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Success Alert */}
        {publishSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Post published to the feed! Returning home...</span>
          </div>
        )}

        {/* User Identity & Audience Selector */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-[#5a32fa] via-purple-600 to-[#ff90e8] p-0.5 shrink-0 shadow-sm">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-white dark:bg-[#0b0f19] flex items-center justify-center text-[#5a32fa] font-black text-base">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm text-gray-900 dark:text-white truncate">
              {user?.name || 'WIPA Member'}
            </h2>
            
            {/* Privacy Pill Dropdown */}
            <div className="relative inline-block mt-0.5">
              <button
                onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                {postPrivacy === 'Anyone' ? <Globe size={11} className="text-emerald-500" /> : <Lock size={11} className="text-amber-500" />}
                <span>{postPrivacy === 'Anyone' ? 'Public (Anyone)' : 'Followers only'}</span>
              </button>

              {isPrivacyOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-44 bg-white dark:bg-[#151c2c] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-1.5 z-30">
                  <button
                    onClick={() => { setPostPrivacy('Anyone'); setIsPrivacyOpen(false); }}
                    className={`w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold transition-colors ${
                      postPrivacy === 'Anyone' ? 'bg-[#5a32fa]/10 text-[#5a32fa]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <Globe size={14} className="text-emerald-500" />
                    <span>Public (Anyone)</span>
                  </button>
                  <button
                    onClick={() => { setPostPrivacy('Followers only'); setIsPrivacyOpen(false); }}
                    className={`w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold transition-colors ${
                      postPrivacy === 'Followers only' ? 'bg-[#5a32fa]/10 text-[#5a32fa]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <Lock size={14} className="text-amber-500" />
                    <span>Followers only</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Tag Pills (Instagram Style: Topic, People, Location, AI) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar [scrollbar-width:none]">
          {/* AI Drafting Pill */}
          <button
            onClick={handleAiDraft}
            disabled={isAiGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#5a32fa]/10 via-[#ff90e8]/10 to-purple-500/10 border border-[#5a32fa]/30 text-[#5a32fa] dark:text-[#ff90e8] text-xs font-bold shrink-0 active:scale-95 transition-transform"
          >
            {isAiGenerating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <img src="/lexiq.png" alt="LexIQ AI" className="w-4 h-4 object-contain rounded-full" />
            )}
            <span>{isAiGenerating ? 'Drafting...' : 'AI Assist'}</span>
          </button>

          {/* Topic Selector */}
          <button
            onClick={() => setShowTopicPicker(!showTopicPicker)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shrink-0 active:scale-95 transition-all ${
              selectedTopic 
                ? 'bg-[#5a32fa] text-white border-[#5a32fa]' 
                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Music size={13} />
            <span>{selectedTopic ? `#${selectedTopic}` : 'Topic'}</span>
          </button>

          {/* Location Tag */}
          <button
            onClick={() => setShowLocationInput(!showLocationInput)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shrink-0 active:scale-95 transition-all ${
              locationTag 
                ? 'bg-rose-500 text-white border-rose-500' 
                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
            }`}
          >
            <MapPin size={13} />
            <span>{locationTag || 'Location'}</span>
          </button>

          {/* Emoji Pill */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold shrink-0 active:scale-95 transition-transform"
          >
            <Smile size={13} />
            <span>Feeling</span>
          </button>
        </div>

        {/* Location Input Drawer */}
        {showLocationInput && (
          <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <MapPin size={15} className="text-rose-500 shrink-0" />
            <input 
              type="text" 
              placeholder="Add your city, firm, or venue (e.g. London, UK)" 
              value={locationTag}
              onChange={(e) => setLocationTag(e.target.value)}
              className="flex-1 bg-transparent text-xs font-medium focus:outline-none text-gray-900 dark:text-white"
            />
            {locationTag && (
              <button onClick={() => setLocationTag('')} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Topic Picker Drawer */}
        {showTopicPicker && (
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
            {POPULAR_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setSelectedTopic(selectedTopic === topic ? null : topic);
                  setShowTopicPicker(false);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedTopic === topic 
                    ? 'bg-[#5a32fa] text-white shadow-sm' 
                    : 'bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                #{topic}
              </button>
            ))}
          </div>
        )}

        {/* Emoji Quick Picker */}
        {showEmojiPicker && (
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setPostContent(prev => prev + ' ' + emoji);
                  setShowEmojiPicker(false);
                }}
                className="w-8 h-8 rounded-xl bg-white dark:bg-white/10 text-base flex items-center justify-center hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Main Textarea (Full-height, frictionless typing) */}
        <div className="flex-1 min-h-[220px] flex flex-col">
          <textarea
            ref={textareaRef}
            rows={8}
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full flex-1 bg-transparent text-base sm:text-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none resize-none leading-relaxed border-none p-0 font-normal"
          />
        </div>

        {/* Attached Media Preview Box */}
        {attachedMedia && (
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 my-2">
            {attachedMedia.type === 'image' && (
              <div className="relative max-h-[350px] overflow-hidden flex items-center justify-center bg-black/5">
                <img src={attachedMedia.previewUrl} alt="Attached Preview" className="w-full h-auto max-h-[350px] object-cover rounded-xl" />
              </div>
            )}

            {attachedMedia.type === 'video' && (
              <div className="relative max-h-[350px] overflow-hidden flex items-center justify-center bg-black rounded-xl">
                <video src={attachedMedia.previewUrl} controls className="w-full h-auto max-h-[350px] rounded-xl" />
              </div>
            )}

            {attachedMedia.type === 'doc' && (
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{attachedMedia.name}</h4>
                  <p className="text-[10px] text-gray-400">{attachedMedia.size}</p>
                </div>
              </div>
            )}

            {/* Remove Media Button */}
            <button
              onClick={() => setAttachedMedia(null)}
              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md active:scale-90"
              title="Remove attachment"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </main>

      {/* BOTTOM FIXED TOOLBAR (Pinned cleanly to viewport bottom) */}
      <footer className="shrink-0 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800/80 px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)] flex items-center justify-between z-40 w-full">
        
        {/* Media Pickers */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Photo Button */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-[#5a32fa] dark:hover:text-[#ff90e8] flex items-center justify-center active:scale-90 transition-transform"
            title="Attach Photo"
          >
            <ImageIcon size={20} />
          </button>

          {/* Video Button */}
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-[#5a32fa] dark:hover:text-[#ff90e8] flex items-center justify-center active:scale-90 transition-transform"
            title="Attach Video"
          >
            <Video size={20} />
          </button>

          {/* Document Button */}
          <button
            type="button"
            onClick={() => docInputRef.current?.click()}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-[#5a32fa] dark:hover:text-[#ff90e8] flex items-center justify-center active:scale-90 transition-transform"
            title="Attach Document"
          >
            <FileText size={20} />
          </button>

          {/* LexIQ AI Button */}
          <button
            type="button"
            onClick={handleAiDraft}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5a32fa]/10 to-[#ff90e8]/10 text-[#5a32fa] dark:text-[#ff90e8] border border-[#5a32fa]/20 flex items-center justify-center active:scale-90 transition-transform p-2 overflow-hidden shadow-sm"
            title="LexIQ AI Post Assistant"
          >
            <img src="/lexiq.png" alt="LexIQ AI" className="w-full h-full object-contain" />
          </button>
        </div>

        {/* Final Share Button */}
        <button
          onClick={handlePublish}
          disabled={isPostEmpty || isPublishing || publishSuccess}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
            isPostEmpty || isPublishing
              ? 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-[#5a32fa] to-[#ff2a5f] text-white active:scale-95 shadow-[#5a32fa]/30'
          }`}
        >
          {isPublishing ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Sharing...</span>
            </>
          ) : (
            <>
              <span>Share Post</span>
              <Send size={13} />
            </>
          )}
        </button>
      </footer>

    </div>
  );
}
