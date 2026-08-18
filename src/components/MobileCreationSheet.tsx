// @ts-nocheck
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Video, MessageSquare, Mic, Briefcase, Calendar, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MobileCreationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction?: (action: string) => void;
}

export default function MobileCreationSheet({ isOpen, onClose, onSelectAction }: MobileCreationSheetProps) {
  const router = useRouter();

  const handleAction = (path: string, actionType?: string) => {
    onClose();
    if (actionType && onSelectAction) {
      onSelectAction(actionType);
    }
    router.push(path);
  };

  const actionItems = [
    {
      id: 'post',
      title: 'Create a Post',
      desc: 'Share an insight, question, or update with the IP network',
      icon: Edit3,
      color: 'from-[#5a32fa] to-indigo-600',
      bg: 'bg-[#5a32fa]/10 text-[#5a32fa]',
      path: '/platform',
      action: 'open_composer'
    },
    {
      id: 'webinar',
      title: 'Host a Webinar',
      desc: 'Schedule a live masterclass, panel, or presentation',
      icon: Video,
      color: 'from-[#ff2a5f] to-rose-600',
      bg: 'bg-[#ff2a5f]/10 text-[#ff2a5f]',
      path: '/platform/resources/webinars'
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#151c2c] rounded-t-3xl border-t border-gray-200 dark:border-gray-800 p-6 pb-10 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-sm shadow-md">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Create & Publish</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Select what you would like to share with WIPA</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {actionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleAction(item.path, item.action)}
                    className="w-full flex items-center gap-4 p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/15 transition-all text-left active:scale-[0.98]"
                  >
                    <div className={`w-11 h-11 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
