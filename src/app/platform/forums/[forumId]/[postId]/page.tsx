'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, MessageSquare, Plus, Clock, MessageCircle, TrendingUp, Heart, Share2, Check, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForumPostDetailPage({ params }: { params: { forumId: string, postId: string } }) {
  const user = useAppStore((state) => state.user);
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [podcastResource, setPodcastResource] = useState<any>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Track view
      const viewKey = `forum_view_${params.postId}`;
      if (!sessionStorage.getItem(viewKey)) {
        try {
          await fetch('/api/forums/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: params.postId })
          });
          sessionStorage.setItem(viewKey, 'true');
        } catch (e) {
          console.error('Failed to track view', e);
        }
      }

      try {
        // Fetch post with unambiguous author relation
        const { data: postData } = await supabase
          .from('forum_posts')
          .select(`
            *,
            author:profiles!forum_posts_author_id_fkey(id, full_name, avatar_url, role, company, is_wipa_recommended),
            forum:forums(id, title, category),
            forum_post_likes(count)
          `)
          .eq('id', params.postId)
          .single();
        
        if (postData) {
          setPost({
            ...postData,
            authorName: postData.author?.full_name || 'WIPA Member',
            authorAvatar: postData.author?.avatar_url,
            authorCompany: postData.author?.company,
            authorRole: postData.author?.role,
            author_is_wipa_recommended: postData.author?.is_wipa_recommended,
            forumTitle: postData.forum?.title,
            forumCategory: postData.forum?.category,
            time: new Date(postData.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          });
          setLikesCount(postData.forum_post_likes?.[0]?.count || 0);
        }

        // Fetch if liked by current user
        if (user?.id) {
          const { data: likeData } = await supabase
            .from('forum_post_likes')
            .select('*')
            .eq('post_id', params.postId)
            .eq('user_id', user.id)
            .maybeSingle();
          if (likeData) setIsLiked(true);
        }

        // Check if there is a podcast created from this post
        const { data: podcastData } = await supabase
          .from('resources')
          .select('id, title')
          .eq('source_forum_post_id', params.postId)
          .eq('type', 'podcast')
          .maybeSingle();
          
        if (podcastData) {
          setPodcastResource(podcastData);
        }

        // Fetch replies with unambiguous relation
        const { data: repliesData } = await supabase
          .from('forum_replies')
          .select(`
            *,
            author:profiles!forum_replies_author_id_fkey(id, full_name, avatar_url, role, company, is_wipa_recommended)
          `)
          .eq('post_id', params.postId)
          .order('created_at', { ascending: true });
          
        if (repliesData) {
          setReplies(repliesData.map((r: any) => ({
            ...r,
            authorName: r.author?.full_name || 'WIPA Practitioner',
            authorAvatar: r.author?.avatar_url,
            authorCompany: r.author?.company,
            authorRole: r.author?.role,
            author_is_wipa_recommended: r.author?.is_wipa_recommended,
            time: new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            initial: (r.author?.full_name || 'W').charAt(0).toUpperCase()
          })));
        }
      } catch (err) {
        console.error('Error loading forum thread:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.postId, user?.id]);

  const handleReplySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;
    setIsSubmittingReply(true);

    try {
      const res = await fetch('/api/forums/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: params.postId,
          content: replyText.trim(),
          authorId: user?.id
        })
      });

      const result = await res.json();
      if (result.success && result.reply) {
        const newR = {
          ...result.reply,
          authorName: result.reply.author?.full_name || user?.name || 'You',
          authorAvatar: result.reply.author?.avatar_url || user?.avatar_url,
          authorCompany: result.reply.author?.company,
          authorRole: result.reply.author?.role,
          author_is_wipa_recommended: result.reply.author?.is_wipa_recommended,
          time: 'Just now',
          initial: (result.reply.author?.full_name || user?.name || 'Y').charAt(0).toUpperCase()
        };
        setReplies(prev => [...prev, newR]);
        setReplyText("");
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleToggleLike = async () => {
    try {
      const res = await fetch('/api/forums/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: params.postId,
          userId: user?.id
        })
      });

      const result = await res.json();
      if (result.success) {
        setIsLiked(result.isLiked);
        setLikesCount(result.likesCount);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading || !post) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#070b14] flex items-center justify-center font-bold text-slate-500">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#5a32fa] mr-3" />
        <span>Loading Discussion...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#070b14] text-slate-900 dark:text-white font-sans relative pb-20">
      <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={() => router.push(`/platform/forums/${params.forumId}`)}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Channel Topics</span>
        </button>

        <div className="bg-white dark:bg-[#0c1020] w-full rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col mb-8 overflow-hidden">
          
          {podcastResource && (
            <div className="bg-gradient-to-r from-[#5a32fa] to-[#ff79c6] p-4 text-white font-bold flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-xl">🎙️</span>
                <span>This discussion was produced as a WIPA Podcast: <strong className="underline decoration-white/50">{podcastResource.title}</strong></span>
              </div>
              <Link 
                href={`/platform/resources/podcasts-conversations/${podcastResource.id}`}
                className="bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors shrink-0"
              >
                Listen Now
              </Link>
            </div>
          )}

          {/* Main Topic Question */}
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#5a32fa]/10 text-[#5a32fa] dark:text-purple-300 border border-[#5a32fa]/20 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                {post.forumCategory || 'Channel'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-400">{post.time}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt={post.authorName} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-white/10" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#5a32fa]/10 text-[#5a32fa] flex items-center justify-center font-black text-xs">
                  {post.authorName.charAt(0)}
                </div>
              )}
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{post.authorName}</span>
                {post.authorCompany && <span> · {post.authorCompany}</span>}
                {post.author_is_wipa_recommended && (
                  <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded-md font-bold ml-1.5">
                    ⭐ WIPA
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleToggleLike}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isLiked 
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' 
                      : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
                  <Heart size={14} className={isLiked ? 'fill-current text-rose-500' : ''} />
                  <span>{likesCount} Likes</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300 cursor-pointer"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
              </span>
            </div>
          </div>
          
          {/* Replies Thread */}
          <div className="p-6 sm:p-8 space-y-4 bg-slate-50 dark:bg-white/5">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 mb-4">
              Community Responses ({replies.length})
            </h3>

            {replies.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#0c1020] border border-dashed border-slate-200 dark:border-white/10 text-center">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No replies yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Be the first to share your thoughts on this topic.</p>
              </div>
            ) : (
              replies.map(reply => (
                <div key={reply.id} className="bg-white dark:bg-[#0c1020] p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {reply.authorAvatar ? (
                        <img src={reply.authorAvatar} alt={reply.authorName} className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-white/10" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-black flex items-center justify-center">
                          {reply.initial}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900 dark:text-white">{reply.authorName}</span>
                          {reply.author_is_wipa_recommended && (
                            <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1 py-0.2 rounded font-bold">
                              ⭐ WIPA
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{reply.authorRole || 'Practitioner'} {reply.authorCompany ? `· ${reply.authorCompany}` : ''}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{reply.time}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap pl-9">
                    {reply.content}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add Reply Bar */}
          <div className="p-6 sm:p-8 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0c1020]">
            <form onSubmit={handleReplySubmit} className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span>Add your perspective</span>
                <span>Responding as <strong className="text-slate-900 dark:text-white">{user?.name || 'WIPA Member'}</strong></span>
              </div>
              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Share your practical experience, case law citation, or strategy advice..." 
                rows={3}
                className="w-full bg-slate-50 dark:bg-[#12182c] border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#5a32fa] transition-colors resize-none"
              />
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={!replyText.trim() || isSubmittingReply}
                  className="bg-[#5a32fa] hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-purple-500/25"
                >
                  {isSubmittingReply ? (
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Send size={13} />
                  )}
                  <span>{isSubmittingReply ? 'Posting...' : 'Post Reply'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
