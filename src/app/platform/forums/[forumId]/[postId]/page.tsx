'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, MessageSquare, Plus, Clock, MessageCircle, TrendingUp, Filter, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForumPostDetailPage({ params }: { params: { forumId: string, postId: string } }) {
  const { user } = useAppStore();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [podcastResource, setPodcastResource] = useState<any>(null);

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

      // Fetch post
      const { data: postData } = await supabase
        .from('forum_posts')
        .select(`
          *,
          author:profiles(full_name, is_wipa_recommended),
          forum:forums(title, category),
          forum_post_likes(count)
        `)
        .eq('id', params.postId)
        .single();
      
      if (postData) {
        setPost({
          ...postData,
          authorName: postData.author?.full_name || 'Unknown',
          author_is_wipa_recommended: postData.author?.is_wipa_recommended,
          forumTitle: postData.forum?.title,
          forumCategory: postData.forum?.category,
          time: new Date(postData.created_at).toLocaleString()
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

      // Fetch replies
      const { data: repliesData } = await supabase
        .from('forum_replies')
        .select(`
          *,
          author:profiles(full_name, is_wipa_recommended)
        `)
        .eq('post_id', params.postId)
        .order('created_at', { ascending: true });
        
      if (repliesData) {
        setReplies(repliesData.map((r: any) => ({
          ...r,
          authorName: r.author?.full_name || 'Unknown',
          author_is_wipa_recommended: r.author?.is_wipa_recommended,
          time: new Date(r.created_at).toLocaleString(),
          color: ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'][Math.floor(Math.random() * 4)],
          initial: (r.author?.full_name || 'U').charAt(0).toUpperCase()
        })));
      }
      setIsLoading(false);
    };
    fetchData();
  }, [params.postId, user?.id]);

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !user?.id) return;
    
    const { data: newReply, error } = await supabase
      .from('forum_replies')
      .insert({
        post_id: params.postId,
        author_id: user.id,
        content: replyText
      })
      .select(`
        *,
        author:profiles(full_name, is_wipa_recommended)
      `)
      .single();

    if (newReply) {
      setReplies([...replies, {
        ...newReply,
        authorName: newReply.author?.full_name || 'You',
        author_is_wipa_recommended: newReply.author?.is_wipa_recommended,
        time: new Date(newReply.created_at).toLocaleString(),
        color: '#5a32fa',
        initial: (newReply.author?.full_name || 'Y').charAt(0).toUpperCase()
      }]);
      setReplyText("");
    }
  };

  const handleToggleLike = async () => {
    if (!user?.id) return;
    if (isLiked) {
      await supabase.from('forum_post_likes').delete().match({ post_id: params.postId, user_id: user.id });
      setLikesCount(likesCount - 1);
      setIsLiked(false);
    } else {
      await supabase.from('forum_post_likes').insert({ post_id: params.postId, user_id: user.id });
      setLikesCount(likesCount + 1);
      setIsLiked(true);
    }
  };

  if (isLoading || !post) {
    return <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex items-center justify-center font-bold text-gray-500">Loading Post...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col relative overflow-hidden">
      <div className="flex-1 w-full max-w-[1000px] mx-auto p-4 md:p-6 lg:p-8 pt-8 relative z-10">
        <button 
          onClick={() => router.push(`/platform/forums/${params.forumId}`)}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold mb-6 hover:text-gray-900 dark:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back to Topics
        </button>

        <div className="bg-white dark:bg-[#0f172a] w-full rounded-[2rem] border border-gray-200 dark:border-white/20 shadow-[8px_8px_0px_0px_#131313] flex flex-col mb-8">
          
          {podcastResource && (
            <div className="bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] p-4 text-white font-bold flex flex-col sm:flex-row items-center justify-between rounded-t-[2rem] gap-4">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <span className="text-2xl">🎙️</span>
                <span>This trending discussion became a Podcast: <span className="underline decoration-white/50">{podcastResource.title}</span></span>
              </div>
              <Link 
                href={`/platform/resources/podcasts-conversations/${podcastResource.id}`}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                Listen Now
              </Link>
            </div>
          )}

          <div className="p-8 border-b border-gray-100 dark:border-white/10">
            <span className="bg-[#fbe8d5] text-[#131313] text-xs font-bold px-3 py-1 rounded-lg inline-block mb-4">
              {post.forumCategory}
            </span>
            <h2 className="text-3xl font-black text-gray-800 dark:text-gray-100 leading-tight mb-4">{post.title}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-black text-xs">
                {post.authorName.charAt(0)}
              </div>
              <div>
                Started by <span className="font-bold text-gray-800 dark:text-gray-100 inline-flex items-center gap-1">{post.authorName}{post.author_is_wipa_recommended && <span className="text-[9px] bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-1 py-0.5 rounded-full whitespace-nowrap ml-1">⭐ WIPA</span>}</span>
                <span className="mx-2">•</span>
                {post.time}
              </div>
            </div>
            <p className="mt-6 text-gray-700 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
            <div className="mt-6 flex items-center gap-4">
              <button 
                onClick={handleToggleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border ${isLiked ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                Like ({likesCount})
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50 dark:bg-white/5">
            <h3 className="font-bold text-lg mb-4">{replies.length} Replies</h3>
            {replies.map(reply => (
              <div key={reply.id} className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border-2 border-gray-200 dark:border-white/20 flex gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ backgroundColor: reply.color }}>
                  {reply.initial}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-1">{reply.authorName}{reply.author_is_wipa_recommended && <span className="text-[9px] bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-1 py-0.5 rounded-full whitespace-nowrap ml-1">⭐ WIPA</span>}</h4>
                    <span className="text-xs font-medium text-gray-400">{reply.time}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#0f172a] rounded-b-[2rem] flex flex-col gap-3">
            <h3 className="font-bold text-lg mb-2">Add a reply</h3>
            <div className="flex gap-3">
              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..." 
                className="flex-1 bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white dark:bg-[#0f172a] transition-colors resize-none h-[100px]"
              />
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleReplySubmit}
                disabled={!replyText.trim()}
                className={`bg-[#5a32fa] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  !replyText.trim() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-sm hover:-translate-y-1'
                }`}
              >
                Post Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
