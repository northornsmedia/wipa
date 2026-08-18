// @ts-nocheck
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, MessageCircle, Heart, Star, ShieldCheck } from 'lucide-react';
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
}

export default function MobileCommentDrawer({
  isOpen,
  onClose,
  post,
  comments,
  commentText,
  setCommentText,
  onSubmitComment,
  isSubmitting
}: MobileCommentDrawerProps) {
  const user = useAppStore((state) => state.user);

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Bottom Drawer Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg mx-auto bg-white dark:bg-[#151c2c] rounded-t-[2rem] border-t border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Grab Handle & Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-[#5a32fa] dark:text-[#ff90e8]" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Comments <span className="text-xs text-gray-500 font-normal">({comments.length})</span>
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors active:scale-90"
              >
                <X size={16} />
              </button>
            </div>

            {/* Original Post Snippet */}
            <div className="p-3 bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-gray-800/60 shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {post.author?.full_name || 'Author'}
                </span>
                <span className="text-[10px] text-gray-500">
                  {post.created_at ? formatDistanceToNow(parseISO(post.created_at), { addSuffix: true }) : ''}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 [scrollbar-width:none]">
              {comments.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-1">
                  <MessageCircle size={32} className="mx-auto opacity-30 mb-2" />
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-300">No comments yet</p>
                  <p className="text-[11px] text-gray-400">Be the first to share your thoughts!</p>
                </div>
              ) : (
                comments.map((comment: any) => {
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
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151c2c] pb-safe shrink-0">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 rounded-2xl p-1.5 pl-3 border border-transparent focus-within:border-[#5a32fa] transition-all">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSubmitComment();
                    }
                  }}
                  placeholder="Write a comment..."
                  className="flex-1 bg-transparent text-xs text-gray-900 dark:text-white placeholder:text-gray-400 outline-none"
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
