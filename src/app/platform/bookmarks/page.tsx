// @ts-nocheck
'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { 
  ArrowLeft, Bookmark, Heart, MessageCircle, Share2, 
  Search, ShieldCheck, CheckCircle2, Trash2, ExternalLink,
  Sparkles, RefreshCw, Filter, Layers, Clock, AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { getBookmarkedPosts, toggleBookmark, BookmarkedPost } from '@/lib/bookmarks';
import FormattedPostText from '@/components/FormattedPostText';
import ProgressiveFeedImage from '@/components/ProgressiveFeedImage';
import FeedVideoPlayer from '@/components/FeedVideoPlayer';
import FeedShareSheet from '@/components/FeedShareSheet';
import BookmarkIcon from '@/components/icons/BookmarkIcon';
import Comment03Icon from '@/components/icons/Comment03Icon';
import ShareCircleLineIcon from '@/components/icons/ShareCircleLineIcon';

function BookmarksContent() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  const [posts, setPosts] = useState<BookmarkedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'media' | 'text'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sharePost, setSharePost] = useState<any | null>(null);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [undoToast, setUndoToast] = useState<{ post: BookmarkedPost; index: number } | null>(null);

  // Load Bookmarked Posts
  const loadBookmarks = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getBookmarkedPosts(user.id);
      setPosts(data);

      // Also load like states for these posts
      if (data.length > 0) {
        const postIds = data.map(p => p.id);
        const { data: likesData } = await supabase
          .from('feed_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);

        if (likesData) {
          setLikedPostIds(new Set(likesData.map((l: any) => String(l.post_id))));
        }
      }
    } catch (err) {
      console.error('Error loading bookmarks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Listen for real-time bookmark updates across tabs / components
  useEffect(() => {
    const handleBookmarkUpdate = (e: any) => {
      const { postId, isSaved } = e.detail || {};
      if (!isSaved) {
        setPosts(prev => prev.filter(p => String(p.id) !== String(postId)));
      } else {
        // If a new post was saved elsewhere, reload bookmarks
        loadBookmarks();
      }
    };

    window.addEventListener('wipa:bookmarks-updated', handleBookmarkUpdate);
    return () => {
      window.removeEventListener('wipa:bookmarks-updated', handleBookmarkUpdate);
    };
  }, [loadBookmarks]);

  // Handle Unsave with Undo option
  const handleUnsave = async (postToUnsave: BookmarkedPost) => {
    if (!user?.id) return;
    const postId = String(postToUnsave.id);
    const postIndex = posts.findIndex(p => String(p.id) === postId);

    // Optimistically remove from state
    setPosts(prev => prev.filter(p => String(p.id) !== postId));
    setUndoToast({ post: postToUnsave, index: postIndex });

    // Execute toggle
    await toggleBookmark(postId, user.id);

    // Auto-clear undo toast after 4.5 seconds
    setTimeout(() => {
      setUndoToast(prev => (prev?.post.id === postToUnsave.id ? null : prev));
    }, 4500);
  };

  // Undo Unsave
  const handleUndo = async () => {
    if (!undoToast || !user?.id) return;
    const { post, index } = undoToast;
    const postId = String(post.id);

    // Re-insert at original index
    setPosts(prev => {
      const copy = [...prev];
      copy.splice(index, 0, post);
      return copy;
    });

    setUndoToast(null);
    await toggleBookmark(postId, user.id);
  };

  // Handle Like
  const handleToggleLike = async (postId: string) => {
    if (!user?.id) return;
    const normalizedId = String(postId);
    const isLiked = likedPostIds.has(normalizedId);

    // Optimistic update
    setLikedPostIds(prev => {
      const next = new Set(prev);
      if (isLiked) next.delete(normalizedId);
      else next.add(normalizedId);
      return next;
    });

    setPosts(prev => prev.map(p => {
      if (String(p.id) === normalizedId) {
        return {
          ...p,
          likes_count: Math.max(0, (p.likes_count || 0) + (isLiked ? -1 : 1))
        };
      }
      return p;
    }));

    try {
      if (isLiked) {
        await supabase.from('feed_likes').delete().match({ user_id: user.id, post_id: normalizedId });
      } else {
        await supabase.from('feed_likes').upsert({ user_id: user.id, post_id: normalizedId });
      }
    } catch (err) {
      console.warn('Like toggle sync error:', err);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const contentMatch = post.content?.toLowerCase().includes(q);
      const authorMatch = post.author?.full_name?.toLowerCase().includes(q);
      const companyMatch = post.author?.company?.toLowerCase().includes(q);
      if (!contentMatch && !authorMatch && !companyMatch) return false;
    }

    // Media type filter
    if (filterType === 'media') {
      return (post.media_urls && post.media_urls.length > 0) || post.media_type === 'video';
    }
    if (filterType === 'text') {
      return (!post.media_urls || post.media_urls.length === 0) && post.media_type !== 'video';
    }

    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-black md:dark:bg-[#0f172a] text-zinc-900 dark:text-zinc-100 font-sans pb-24 lg:pb-12">
      
      {/* ========================================================
          TOP HEADER BAR (Instagram-style Clean Header)
          ======================================================== */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-black/95 md:dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-white/[0.08] md:dark:border-slate-800 px-4 py-3 sm:py-3.5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Link
              href="/platform"
              className="p-1 -ml-1 text-zinc-900 dark:text-white hover:opacity-70 transition-opacity"
              aria-label="Back to feed"
            >
              <ArrowLeft size={22} strokeWidth={2} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Saved Posts
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 md:dark:bg-[#1e293b] text-zinc-600 dark:text-zinc-400 border border-transparent dark:border-white/10 md:dark:border-slate-700/60">
                  {posts.length}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadBookmarks()}
              disabled={isLoading}
              title="Refresh saved posts"
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 md:dark:hover:bg-[#1e293b] text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
            >
              <RefreshCw size={17} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <Link
              href="/platform/settings"
              className="hidden sm:inline-flex text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-3xl mx-auto mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved posts or author..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100/80 dark:bg-zinc-900 md:dark:bg-[#1e293b] border border-transparent dark:border-white/10 md:dark:border-slate-700/60 focus:border-[#5a32fa] text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'media', label: 'Photos & Videos' },
              { id: 'text', label: 'Articles & Text' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-900 md:dark:bg-[#1e293b] border border-transparent dark:border-white/10 md:dark:border-slate-700/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 md:dark:hover:bg-[#334155]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN CONTENT AREA
          ======================================================== */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6">
        
        {/* Loading Skeleton */}
        {isLoading && posts.length === 0 ? (
          <div className="space-y-4 py-8">
            {[1, 2, 3].map((n) => (
              <div 
                key={n} 
                className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 md:dark:bg-[#1e293b]/40 border border-zinc-200/70 dark:border-zinc-800/70 md:dark:border-slate-700/50 animate-pulse space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 md:dark:bg-[#334155]" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-32 h-3.5 bg-zinc-200 dark:bg-zinc-800 md:dark:bg-[#334155] rounded-sm" />
                    <div className="w-20 h-2.5 bg-zinc-200 dark:bg-zinc-800 md:dark:bg-[#334155] rounded-sm" />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 md:dark:bg-[#334155] rounded-sm" />
                  <div className="w-4/5 h-3 bg-zinc-200 dark:bg-zinc-800 md:dark:bg-[#334155] rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          
          /* Empty State */
          <div className="py-20 px-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 md:dark:bg-[#1e293b] text-zinc-400 dark:text-zinc-500 flex items-center justify-center mx-auto ring-1 ring-zinc-200 dark:ring-zinc-800 md:dark:ring-slate-700/60">
              <Bookmark size={28} strokeWidth={1.5} />
            </div>

            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {searchQuery || filterType !== 'all' ? 'No matching saved posts' : 'No saved posts yet'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {searchQuery || filterType !== 'all'
                  ? 'Try adjusting your search terms or filter settings.'
                  : 'Tap the bookmark icon on any post in the community feed to save it for quick reference here.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/platform"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold transition-all shadow-xs"
              >
                <span>Explore Community Feed</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>

        ) : (

          /* Saved Posts Feed */
          <div className="space-y-5">
            {filteredPosts.map((post) => {
              const isLiked = likedPostIds.has(String(post.id));
              const hasMedia = post.media_urls && post.media_urls.length > 0;

              return (
                <article
                  key={post.id}
                  className="rounded-2xl bg-white dark:bg-black md:dark:bg-[#1e293b] border border-zinc-200/80 dark:border-white/[0.08] md:dark:border-slate-700/60 shadow-xs hover:border-zinc-300 dark:hover:border-white/20 md:dark:hover:border-slate-600 transition-colors overflow-hidden"
                >
                  {/* Card Header: Author Info */}
                  <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3">
                    <Link
                      href={post.author?.id ? `/platform/profile/${post.author.id}` : '#'}
                      className="flex items-center gap-3 min-w-0 group"
                    >
                      {post.author?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.author.avatar_url}
                          alt={post.author.full_name || 'Author'}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 md:dark:bg-[#334155] flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-bold text-sm shrink-0">
                          {post.author?.full_name?.charAt(0)?.toUpperCase() || 'W'}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-bold text-zinc-900 dark:text-white group-hover:underline truncate">
                            {post.author?.full_name || 'WIPA Member'}
                          </span>
                          {post.author?.is_wipa_recommended && (
                            <CheckCircle2 size={13} className="text-[#5a32fa] dark:text-purple-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          {post.author?.role || post.author?.company || 'IP Professional'}
                          {post.created_at && (
                            <span> • {formatDistanceToNow(parseISO(post.created_at), { addSuffix: true })}</span>
                          )}
                        </p>
                      </div>
                    </Link>

                    {/* Bookmark Status & Unsave Action */}
                    <button
                      type="button"
                      onClick={() => handleUnsave(post)}
                      className="p-1.5 rounded-lg text-amber-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                      title="Remove from saved posts"
                      aria-label="Remove saved post"
                    >
                      <BookmarkIcon size={20} filled={true} />
                    </button>
                  </div>

                  {/* Post Content Body */}
                  {post.content && (
                    <div className="px-4 sm:px-4.5 pb-3 text-[14px] sm:text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                      <FormattedPostText text={post.content} />
                    </div>
                  )}

                  {/* Media Attachments */}
                  {hasMedia && (
                    <div className="w-full bg-zinc-100 dark:bg-black md:dark:bg-[#0f172a] overflow-hidden">
                      {post.media_type === 'video' ? (
                        <FeedVideoPlayer
                          src={post.media_urls![0]}
                          className="w-full max-h-[500px] object-contain mx-auto"
                        />
                      ) : (
                        <div className="grid grid-cols-1 gap-1">
                          {post.media_urls!.map((url, idx) => (
                            <div key={url} className="relative max-h-[520px] overflow-hidden bg-black/5 flex items-center justify-center">
                              <ProgressiveFeedImage
                                src={url}
                                alt={`Saved post media ${idx + 1}`}
                                className="w-full h-auto max-h-[520px] object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Document Attachment if any */}
                  {post.document_name && (
                    <div className="mx-4 my-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 md:dark:bg-[#0f172a] border border-zinc-200/80 dark:border-white/10 flex items-center gap-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      <span className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 text-[10px] font-black">
                        DOC
                      </span>
                      <span className="truncate">{post.document_name}</span>
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="px-4 py-3 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-5">
                      
                      {/* Like */}
                      <button
                        type="button"
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                          isLiked 
                            ? 'text-rose-500 font-bold scale-105' 
                            : 'hover:text-rose-500'
                        }`}
                      >
                        <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                        <span>{post.likes_count || 0}</span>
                      </button>

                      {/* Comments */}
                      <Link
                        href={`/platform/post/${post.id}`}
                        className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#5a32fa] dark:hover:text-purple-400 transition-colors"
                      >
                        <Comment03Icon size={18} />
                        <span>{post.comments_count || 0}</span>
                      </Link>

                      {/* Share */}
                      <button
                        type="button"
                        onClick={() => setSharePost(post)}
                        className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#5a32fa] dark:hover:text-purple-400 transition-colors cursor-pointer"
                      >
                        <ShareCircleLineIcon size={18} />
                      </button>
                    </div>

                    <Link
                      href={`/platform/post/${post.id}`}
                      className="text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors flex items-center gap-1"
                    >
                      <span>View Thread</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* ========================================================
          UNDO TOAST NOTIFICATION
          ======================================================== */}
      {undoToast && (
        <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xl border border-zinc-800 dark:border-zinc-200">
            <div className="flex items-center gap-2 text-xs font-semibold truncate">
              <CheckCircle2 size={16} className="text-emerald-400 dark:text-emerald-600 shrink-0" />
              <span className="truncate">Post removed from Saved</span>
            </div>

            <button
              onClick={handleUndo}
              className="text-xs font-black uppercase tracking-wider text-amber-400 dark:text-amber-600 hover:underline cursor-pointer shrink-0"
            >
              Undo
            </button>
          </div>
        </div>
      )}

      {/* Share Sheet Modal */}
      {sharePost && (
        <FeedShareSheet
          post={sharePost}
          isOpen={!!sharePost}
          onClose={() => setSharePost(null)}
        />
      )}

    </div>
  );
}

export default function BookmarksPage() {
  return (
    <Suspense fallback={null}>
      <BookmarksContent />
    </Suspense>
  );
}
