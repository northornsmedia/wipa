// @ts-nocheck
'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Star, ShieldCheck } from 'lucide-react';
import Comment03Icon from '@/components/icons/Comment03Icon';
import ArrowUpDoubleIcon from '@/components/icons/ArrowUpDoubleIcon';
import Cancel02Icon from '@/components/icons/Cancel02Icon';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useAppStore } from '@/store/useAppStore';

interface MobileCommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  post: any | null;
  comments: any[];
  commentText: string;
  setCommentText: (val: string) => void;
  onSubmitComment: () => void;
  isSubmitting: boolean;
  error?: string;
}

export default function MobileCommentDrawer({
  isOpen,
  onClose,
  post,
  comments,
  commentText,
  setCommentText,
  onSubmitComment,
  isSubmitting,
  error
}: MobileCommentDrawerProps) {
  const user = useAppStore((state) => state.user);
  const [viewport, setViewport] = React.useState<{ height: number; top: number } | null>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isDismissing, setIsDismissing] = React.useState(false);

  // Preserve last valid post and comments so dismissal animation can finish with full content
  const lastPostRef = React.useRef(post);
  const lastCommentsRef = React.useRef(comments);

  if (post) {
    lastPostRef.current = post;
  }
  if (comments && comments.length > 0) {
    lastCommentsRef.current = comments;
  }

  const activePost = post || lastPostRef.current;
  const activeComments = (comments && comments.length > 0) ? comments : (lastCommentsRef.current || []);

  React.useEffect(() => {
    if (isOpen) {
      setIsExpanded(false);
      setIsDismissing(false);
    }
    const syncViewport = () => {
      const visual = window.visualViewport;
      setViewport({ height: visual?.height || window.innerHeight, top: visual?.offsetTop || 0 });
    };
    syncViewport();
    window.visualViewport?.addEventListener('resize', syncViewport);
    window.visualViewport?.addEventListener('scroll', syncViewport);
    return () => {
      window.visualViewport?.removeEventListener('resize', syncViewport);
      window.visualViewport?.removeEventListener('scroll', syncViewport);
    };
  }, [isOpen]);

  const triggerClose = React.useCallback(() => {
    if (isDismissing) return;
    setIsDismissing(true);
  }, [isDismissing]);

  if (!activePost) return null;

  const partialHeightPx = viewport ? Math.min(Math.round(viewport.height * 0.68), 580) : 520;
  const fullHeightPx = viewport ? viewport.height : (typeof window !== 'undefined' ? window.innerHeight : 800);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-x-0 top-0 z-[110] flex flex-col justify-end md:hidden select-none" style={{ height: viewport ? `${viewport.height}px` : '100dvh', transform: viewport?.top ? `translateY(${viewport.top}px)` : undefined }}>
          {/* Backdrop (solid GPU-friendly fade) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isDismissing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            onClick={triggerClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Bottom Drawer Sheet (GPU-accelerated slide up & pull-down dismiss animation) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{
              y: isDismissing ? '100%' : 0,
              height: isExpanded ? `${fullHeightPx}px` : `${partialHeightPx}px`
            }}
            exit={{ y: '100%' }}
            transition={{
              y: { duration: 0.32, ease: [0.32, 0.72, 0, 1] },
              height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
            }}
            onAnimationComplete={() => {
              if (isDismissing) {
                onClose();
                setIsDismissing(false);
              }
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 350) {
                triggerClose();
              }
            }}
            className={`relative z-10 w-full max-w-lg mx-auto bg-white dark:bg-black border-t border-gray-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden will-change-transform transform-gpu ${
              isExpanded ? 'rounded-t-none pt-safe' : 'rounded-t-[2rem]'
            }`}
          >
            {/* Grab Handle */}
            <div
              onClick={() => setIsExpanded(prev => !prev)}
              className="pt-2.5 pb-1 flex justify-center cursor-pointer active:opacity-60 touch-none shrink-0"
              aria-label={isExpanded ? "Collapse comment drawer" : "Expand comment drawer"}
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Comment03Icon size={18} className="text-[#5a32fa] dark:text-[#ff90e8]" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Comments <span className="text-xs text-gray-500 font-normal">({activeComments.length})</span>
                </h3>
              </div>

              {/* Animated Expand / Close Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isExpanded) {
                    setIsExpanded(true);
                  } else {
                    triggerClose();
                  }
                }}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors active:scale-90 cursor-pointer overflow-hidden"
                aria-label={isExpanded ? "Close comments" : "Open comments full screen"}
                title={isExpanded ? "Close comments" : "Open full screen"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {!isExpanded ? (
                    <motion.div
                      key="expand-arrows"
                      initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      <ArrowUpDoubleIcon size={18} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="close-cross"
                      initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      <Cancel02Icon size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Original Post Snippet */}
            <div className="p-3 bg-gray-50 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {activePost.author?.full_name || 'Author'}
                </span>
                <span className="text-[10px] text-gray-500">
                  {activePost.created_at ? formatDistanceToNow(parseISO(activePost.created_at), { addSuffix: true }) : ''}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {activePost.content}
              </p>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 [scrollbar-width:none]">
              {activeComments.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-1">
                  <Comment03Icon size={32} className="mx-auto opacity-30 mb-2" />
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-300">No comments yet</p>
                  <p className="text-[11px] text-gray-400">Be the first to share your thoughts!</p>
                </div>
              ) : (
                activeComments.map((comment: any) => {
                  const author = comment.author || {};
                  return (
                    <div key={comment.id} className="flex gap-2.5 items-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-sm">
                        {author.avatar_url ? (
                          <img src={author.avatar_url} alt={author.full_name} className="w-full h-full object-cover" />
                        ) : (
                          author.full_name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className="flex-1 bg-gray-100 dark:bg-white/5 rounded-2xl p-3 border border-gray-200/50 dark:border-white/5">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                            {author.full_name || 'Member'}
                            {author.is_wipa_recommended && (
                              <Star size={11} className="fill-yellow-400 text-yellow-400" />
                            )}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {comment.created_at ? formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true }) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Comment Composer Input */}
            <div className="p-3 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black pb-[max(env(safe-area-inset-bottom),12px)] shrink-0">
              {error && <p className="mb-2 px-1 text-xs font-semibold text-rose-500">{error}</p>}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 rounded-2xl p-1.5 pl-3 border border-transparent focus-within:border-[#5a32fa] transition-all">
                <textarea
                  rows={1}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSubmitComment();
                    }
                  }}
                  placeholder="Write a comment..."
                  className="max-h-24 min-h-6 flex-1 resize-none bg-transparent py-0.5 text-base leading-6 text-gray-900 caret-[#5a32fa] dark:text-white placeholder:text-gray-400 outline-none"
                />
                <button
                  onClick={onSubmitComment}
                  disabled={!commentText.trim() || isSubmitting}
                  className="w-8 h-8 rounded-xl bg-[#5a32fa] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-transform shadow-sm"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
