'use client';

import { useEffect, useState } from 'react';
import { 
  ArrowLeft, Heart, Send, Share2, Bookmark, 
  CheckCircle2, Copy, Check, ShieldCheck, MoreHorizontal 
} from 'lucide-react';
import Comment03Icon from '@/components/icons/Comment03Icon';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import ProgressiveFeedImage from '@/components/ProgressiveFeedImage';
import FeedVideoPlayer from '@/components/FeedVideoPlayer';
import FormattedPostText from '@/components/FormattedPostText';
import { supabase } from '@/lib/supabase';
import { recordPostImpressions } from '@/lib/analytics';
import { useAppStore } from '@/store/useAppStore';
import BookmarkIcon from '@/components/icons/BookmarkIcon';
import { toggleBookmark, getSavedPostIds } from '@/lib/bookmarks';

export default function SharedPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let active = true;
    const loadPost = async () => {
      const { data } = await supabase
        .from('feed_posts')
        .select(`
          id, author_id, content, media_urls, media_type, document_name,
          likes_count, comments_count, created_at,
          author:profiles!feed_posts_author_id_fkey(id, full_name, avatar_url, practice_area, is_wipa_recommended, company, role)
        `)
        .eq('id', params.id)
        .maybeSingle();
      
      if (active) {
        setPost(data);
        setLikesCount(data?.likes_count || 0);
        setLoading(false);
        if (data?.id && data?.author_id) {
          void recordPostImpressions([{ postId: data.id, authorId: data.author_id }]);
        }
      }
    };
    if (params.id) void loadPost();
    return () => { active = false; };
  }, [params.id]);

  useEffect(() => {
    if (!user?.id || !params.id) return;
    getSavedPostIds(user.id).then(ids => {
      setIsSaved(ids.includes(String(params.id)));
    });

    const handleBookmarkEvent = (e: any) => {
      const { postId, isSaved: saved } = e.detail || {};
      if (String(postId) === String(params.id)) {
        setIsSaved(saved);
      }
    };
    window.addEventListener('wipa:bookmarks-updated', handleBookmarkEvent);
    return () => window.removeEventListener('wipa:bookmarks-updated', handleBookmarkEvent);
  }, [user?.id, params.id]);

  const author = Array.isArray(post?.author) ? post.author[0] : post?.author;

  const handleLike = () => {
    setLiked(prev => !prev);
    setLikesCount(prev => liked ? Math.max(0, prev - 1) : prev + 1);
  };

  const handleToggleSave = async () => {
    if (!user?.id || !post?.id) return;
    setIsSaved(prev => !prev);
    await toggleBookmark(String(post.id), user.id);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white font-sans selection:bg-[#5a32fa]/20 pb-24 transition-colors duration-300">
      
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-8 backdrop-blur-md dark:border-white/10 dark:bg-[#0c1220]/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>
          <span className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></span>
          <h1 className="text-sm font-black text-slate-900 dark:text-white hidden sm:block">
            Intellectual Property Feed Post
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>

          <Link
            href="/platform"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-purple-600 text-white font-black text-xs shadow-md shadow-purple-500/20 active:scale-95 transition-all"
          >
            Live Feed
          </Link>
        </div>
      </header>

      {/* Main Post Container */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <div className="w-10 h-10 rounded-full border-3 border-purple-500 border-t-transparent animate-spin"></div>
            <span className="text-xs font-bold text-slate-400">Loading Post Content…</span>
          </div>
        ) : !post ? (
          <div className="mx-auto max-w-md px-6 py-24 text-center bg-white dark:bg-[#0c1220] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center mx-auto">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Post Unavailable</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This publication may have been removed or is no longer publicly visible.
            </p>
            <Link
              href="/platform"
              className="inline-flex px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-black shadow-md transition-all"
            >
              Return to Community Feed
            </Link>
          </div>
        ) : (
          <article className="bg-white dark:bg-[#0c1220] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-lg shadow-purple-900/5 p-6 sm:p-8 space-y-6 animate-fadeIn">
            
            {/* Author Profile Header */}
            <div className="flex items-center justify-between gap-3">
              <Link 
                href={author?.id ? `/platform/profile/${author.id}` : '#'} 
                className="group flex items-center gap-3.5 min-w-0"
              >
                <div className="relative shrink-0">
                  {author?.avatar_url ? (
                    <img 
                      src={author.avatar_url} 
                      alt={author.full_name || 'Author'} 
                      className="h-12 w-12 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shadow-xs" 
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 font-black text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      {author?.full_name?.charAt(0) || 'W'}
                    </div>
                  )}
                  {author?.is_wipa_recommended && (
                    <div className="absolute -bottom-1 -right-1 p-0.5 bg-purple-600 text-white rounded-full ring-2 ring-white dark:ring-[#0c1220]">
                      <CheckCircle2 size={11} />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-black text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center gap-1.5">
                    <span>{author?.full_name || 'WIPA Member'}</span>
                    {author?.is_wipa_recommended && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        VERIFIED
                      </span>
                    )}
                  </h2>
                  <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                    {author?.role || author?.practice_area || 'Intellectual Property Specialist'} {author?.company && `• ${author.company}`}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatDistanceToNow(parseISO(post.created_at), { addSuffix: true })}
                  </p>
                </div>
              </Link>
            </div>

            {/* Post Content */}
            {post.content && (
              <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-100 font-medium whitespace-pre-wrap">
                <FormattedPostText text={post.content} />
              </div>
            )}

            {/* Media Attachments */}
            {post.media_urls?.map((url: string, index: number) => post.media_type === 'video' ? (
              <div key={url} className="w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-md">
                <FeedVideoPlayer
                  src={url}
                  preload="metadata"
                  className="w-full max-w-full h-auto max-h-[75vh] sm:max-h-[560px] object-contain rounded-2xl block mx-auto"
                />
              </div>
            ) : (
              <div key={url} className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5">
                <ProgressiveFeedImage src={url} alt={`Post image ${index + 1}`} eager={index === 0} />
              </div>
            ))}

            {/* Document Attachment if any */}
            {post.document_name && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-white truncate">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    PDF
                  </span>
                  <span className="truncate">{post.document_name}</span>
                </div>
              </div>
            )}

            {/* Social Engagement Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    liked 
                      ? 'text-rose-500 font-black scale-105' 
                      : 'hover:text-rose-500 hover:scale-105'
                  }`}
                >
                  <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                  <span>{likesCount} Likes</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <Comment03Icon size={18} />
                  <span>{post.comments_count || 0} Comments</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    isSaved
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-slate-500 hover:text-amber-500 dark:hover:text-amber-400'
                  }`}
                  aria-label={isSaved ? 'Remove saved post' : 'Save post'}
                  title={isSaved ? 'Remove from saved' : 'Save post'}
                >
                  <BookmarkIcon size={20} filled={isSaved} />
                </button>
              </div>
            </div>

          </article>
        )}
      </div>

    </main>
  );
}
