// @ts-nocheck
'use client';

import React, { useEffect } from 'react';
import { X, Edit3, Video, MessageSquare, Mic, Briefcase, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

interface MobileCreationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction?: (action: string) => void;
}

export default function MobileCreationSheet({ isOpen, onClose, onSelectAction }: MobileCreationSheetProps) {
  const router = useRouter();
  const setIsLexIQOpen = useAppStore((state) => state.setIsLexIQOpen);

  // Prevent the large feed behind the sheet from scrolling/repainting while open.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleAction = (item: any) => {
    onClose();
    if (item.action === 'open_lexiq') {
      setIsLexIQOpen(true);
      return;
    }
    if (item.id === 'post' || item.path === '/platform/create-post') {
      router.push('/platform/create-post');
      return;
    }
    if (item.action && onSelectAction) {
      onSelectAction(item.action);
    }
    if (item.path) {
      router.push(item.path);
    }
  };

  const actionItems = [
    {
      id: 'lexiq',
      title: 'Ask Sally 4.1 Pro',
      desc: 'Research IP case law, patent drafting & legal analysis',
      image: '/sally-logo.png',
      color: 'from-[#5a32fa] via-purple-600 to-[#ff90e8]',
      bg: 'bg-gradient-to-tr from-[#5a32fa]/20 via-[#ff90e8]/20 to-purple-500/20 text-[#5a32fa] dark:text-[#ff90e8] border border-[#5a32fa]/30',
      action: 'open_lexiq',
      highlight: true
    },
    {
      id: 'post',
      title: 'Create a Post',
      desc: 'Share an insight, question, or update with the IP network',
      icon: Edit3,
      color: 'from-[#5a32fa] to-indigo-600',
      bg: 'bg-[#5a32fa]/10 text-[#5a32fa]',
      path: '/platform/create-post'
    },
    {
      id: 'webinar',
      title: 'Host a Webinar',
      desc: 'Schedule a live masterclass, panel, or presentation',
      icon: Video,
      color: 'from-[#ff2a5f] to-rose-600',
      bg: 'bg-[#ff2a5f]/10 text-[#ff2a5f]',
      path: '/platform/resources/webinars/host'
    },
    {
      id: 'forum',
      title: 'Start Discussion Topic',
      desc: 'Launch a forum debate in patent, trademark, or tech law',
      icon: MessageSquare,
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-500/10 text-amber-500',
      path: '/platform/forums'
    },
    {
      id: 'podcast',
      title: 'Upload Podcast / Audio',
      desc: 'Publish your audio interview or episode',
      icon: Mic,
      color: 'from-purple-500 to-fuchsia-600',
      bg: 'bg-purple-500/10 text-purple-500',
      path: '/platform/resources/podcasts-conversations/upload'
    },
    {
      id: 'job',
      title: 'Post a Job Listing',
      desc: 'Recruit top IP lawyers, patent agents, or in-house counsel',
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-500/10 text-emerald-500',
      path: '/platform/jobs'
    }
  ];

  if (!isOpen) return null;

  return (
        <div className="fixed inset-0 z-[100] md:hidden isolate">
          {/* Backdrop */}
          <div
            onPointerDown={onClose}
            className="absolute inset-0 bg-black/60 animate-in fade-in duration-100"
          />

          {/* Bottom Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#151c2c] rounded-t-3xl border-t border-gray-200 dark:border-gray-800 p-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] shadow-xl max-h-[85dvh] overflow-y-auto overscroll-contain touch-pan-y animate-in slide-in-from-bottom-8 duration-150 ease-out [contain:layout_paint] [transform:translateZ(0)]"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-sm shadow-md">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Create & Publish</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Select what you would like to share or explore</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {actionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleAction(item)}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-2xl border transition-all text-left active:scale-[0.98] ${
                      item.highlight
                        ? 'bg-gradient-to-r from-[#5a32fa]/10 via-[#ff90e8]/10 to-purple-500/10 border-[#5a32fa]/30 shadow-sm'
                        : 'bg-gray-50 dark:bg-white/[0.03] border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/15'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-1.5`}>
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                      ) : (
                        Icon && <Icon size={18} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{item.title}</h4>
                        {item.highlight && (
                          <span className="px-1.5 py-0.2 rounded-md bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] text-white text-[9px] font-black uppercase tracking-wider">
                            AI
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
  );
}
