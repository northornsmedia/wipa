'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Video, 
  Calendar, 
  FileText, 
  Smile, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

interface FeedQuickComposerProps {
  user: any;
  onOpenCreatePost?: (params?: { type?: string; topic?: string }) => void;
}

const INSPIRATION_PROMPTS = [
  "Share an IP insight, patent breakthrough, or case update...",
  "Ask a question to 5,000+ global IP women & legal leaders...",
  "Celebrate a new patent grant, trademark registration, or career win...",
  "Discuss emerging AI copyright guidelines & UPC court precedents...",
  "Share strategic advice with the next generation of IP counsel...",
  "Start a conversation with the WIPA community..."
];

const QUICK_ACTIONS = [
  { type: 'photo', label: 'Photo', icon: ImageIcon },
  { type: 'video', label: 'Video', icon: Video },
  { type: 'event', label: 'Event', icon: Calendar },
  { type: 'doc', label: 'Document', icon: FileText },
  { type: 'feeling', label: 'Feeling', icon: Smile },
];

export default function FeedQuickComposer({ user, onOpenCreatePost }: FeedQuickComposerProps) {
  const router = useRouter();
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % INSPIRATION_PROMPTS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (type?: string, topic?: string) => {
    if (onOpenCreatePost) {
      onOpenCreatePost({ type, topic });
      return;
    }
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (topic) params.set('topic', topic);
    const queryString = params.toString();
    router.push(`/platform/create-post${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="hidden md:flex flex-col bg-white dark:bg-[#0f172a] rounded-2xl md:rounded-3xl shadow-sm border border-slate-200/80 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-white/20 group/composer relative z-20">
      
      {/* Main Input Trigger Row */}
      <div 
        onClick={() => handleClick()}
        className="flex items-center gap-4 p-5 cursor-pointer border-b border-slate-100 dark:border-white/5"
      >
        {/* User Avatar with Subtle Border */}
        <div className="relative shrink-0">
          {user?.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user?.name || 'User'} 
              className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-white/10" 
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-[#5a32fa] text-white flex items-center justify-center font-bold text-base ring-2 ring-slate-100 dark:ring-white/10 shadow-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#0f172a]" />
        </div>

        {/* Input Box */}
        <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100/80 dark:hover:bg-slate-900 transition-all duration-200 rounded-xl py-3 px-4 border border-slate-200/60 dark:border-white/10 group-hover/composer:border-[#5a32fa]/40 flex items-center justify-between gap-3">
          
          {/* Animated Rotating Placeholder */}
          <div className="relative flex-1 h-5 overflow-hidden flex items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={promptIndex}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="text-slate-400 dark:text-slate-400 font-medium text-sm truncate block select-none"
              >
                {INSPIRATION_PROMPTS[promptIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClick('ai');
              }}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#5a32fa]/40 text-slate-600 dark:text-slate-300 hover:text-[#5a32fa] dark:hover:text-purple-400 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              <img src="/sally-logo.png" alt="Sally AI" className="w-3.5 h-3.5 object-contain block dark:hidden" />
              <img src="/sally-logo-white.png" alt="Sally AI" className="w-3.5 h-3.5 object-contain hidden dark:block" />
              <span>AI Assist</span>
            </button>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#5a32fa] hover:bg-[#4a24de] text-white font-semibold text-xs transition-all shadow-2xs">
              <span>Post</span>
              <ArrowRight size={12} />
            </div>
          </div>

        </div>
      </div>

      {/* Unified Action Buttons Row */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50/50 dark:bg-[#0b101d]/40">
        {QUICK_ACTIONS.map((btn) => (
          <button
            key={btn.type}
            onClick={() => handleClick(btn.type)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#5a32fa] dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all duration-150 cursor-pointer"
          >
            <btn.icon size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-[#5a32fa]" />
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
