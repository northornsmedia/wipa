'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import ProgressiveFeedImage from '@/components/ProgressiveFeedImage';
import { supabase } from '@/lib/supabase';

export default function SharedPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadPost = async () => {
      const { data } = await supabase
        .from('feed_posts')
        .select(`
          id, author_id, content, media_urls, media_type, document_name,
          likes_count, comments_count, created_at,
          author:profiles!feed_posts_author_id_fkey(full_name, avatar_url, practice_area, is_wipa_recommended)
        `)
        .eq('id', params.id)
        .maybeSingle();
      if (active) {
        setPost(data);
        setLoading(false);
      }
    };
    if (params.id) void loadPost();
    return () => { active = false; };
  }, [params.id]);

  const author = Array.isArray(post?.author) ? post.author[0] : post?.author;

  return (
    <main className="min-h-dvh bg-gray-50 pb-24 dark:bg-[#080d18]">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-100 bg-white/95 px-4 backdrop-blur dark:border-white/10 dark:bg-[#0f172a]/95">
        <button onClick={() => router.back()} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Go back"><ArrowLeft size={22} /></button>
        <h1 className="text-lg font-black">Post</h1>
      </header>

      {loading ? (
        <div className="flex justify-center py-32 text-[#6600FF]"><DotmCircular7 size={48} /></div>
      ) : !post ? (
        <div className="mx-auto max-w-xl px-6 py-32 text-center"><h2 className="font-black">Post unavailable</h2><p className="mt-2 text-sm text-gray-500">It may have been removed or is no longer visible.</p></div>
      ) : (
        <article className="mx-auto mt-3 max-w-xl bg-white px-4 py-5 shadow-sm dark:bg-[#0f172a] sm:rounded-3xl sm:px-5">
          <div className="flex items-center gap-3">
            {author?.avatar_url ? <img src={author.avatar_url} alt="" className="h-11 w-11 rounded-full object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 font-black text-[#6600FF]">{author?.full_name?.charAt(0) || 'W'}</div>}
            <div className="min-w-0"><h2 className="truncate font-black">{author?.full_name || 'WIPA Member'}</h2><p className="truncate text-xs text-gray-500">{author?.practice_area || 'WIPA'} · {formatDistanceToNow(parseISO(post.created_at), { addSuffix: true })}</p></div>
          </div>
          {post.content && <p className="whitespace-pre-wrap py-5 text-[15px] leading-relaxed">{post.content}</p>}
          {post.media_urls?.map((url: string, index: number) => post.media_type === 'video' ? (
            <video key={url} src={url} controls playsInline preload="metadata" className="mb-3 w-full rounded-2xl bg-black" />
          ) : (
            <div key={url} className="mb-3"><ProgressiveFeedImage src={url} alt={`Post image ${index + 1}`} eager={index === 0} /></div>
          ))}
          <div className="mt-4 flex items-center gap-7 border-t border-gray-100 pt-4 text-gray-600 dark:border-white/10 dark:text-gray-300">
            <span className="flex items-center gap-2"><Heart size={21} /> <small>{post.likes_count || 0}</small></span>
            <span className="flex items-center gap-2"><MessageCircle size={21} /> <small>{post.comments_count || 0}</small></span>
            <Send size={20} className="-rotate-12" />
          </div>
        </article>
      )}
    </main>
  );
}
