'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, MessageSquare, Search, Plus, Clock, MessageCircle, TrendingUp, Filter, Heart, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForumThreadListPage({ params }: { params: { forumId: string } }) {
  const { user } = useAppStore();
  const router = useRouter();
  const [forum, setForum] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch forum details
        const { data: forumData } = await supabase
          .from('forums')
          .select('*')
          .eq('id', params.forumId)
          .single();
        
        if (forumData) {
          setForum(forumData);
          // Fetch posts for this forum with unambiguous relation
          const { data: postsData } = await supabase
            .from('forum_posts')
            .select(`
              *,
              author:profiles!forum_posts_author_id_fkey(id, full_name, avatar_url, role, company, is_wipa_recommended),
              forum_replies(count),
              forum_post_likes(count)
            `)
            .eq('forum_id', params.forumId)
            .order('created_at', { ascending: false });
          
          if (postsData) {
            setTopics(postsData.map((p: any) => ({
              id: p.id,
              title: p.title,
              author: p.author?.full_name || 'WIPA Member',
              author_avatar: p.author?.avatar_url,
              author_company: p.author?.company,
              author_is_wipa_recommended: p.author?.is_wipa_recommended,
              replies: p.forum_replies?.[0]?.count || 0,
              likes: p.forum_post_likes?.[0]?.count || 0,
              lastActivity: new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
              content: p.content,
              isHot: (p.forum_replies?.[0]?.count || 0) >= 2 || (p.forum_post_likes?.[0]?.count || 0) >= 2
            })));
          }
        }
      } catch (err) {
        console.error('Error fetching forum topics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.forumId]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.title.trim() || !newTopic.content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/forums/create-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forumId: params.forumId,
          title: newTopic.title.trim(),
          content: newTopic.content.trim(),
          authorId: user?.id
        })
      });

      const result = await res.json();
      if (result.success && result.post) {
        setTopics([{
          id: result.post.id,
          title: result.post.title,
          author: result.post.author?.full_name || user?.name || 'You',
          author_avatar: result.post.author?.avatar_url || user?.avatar_url,
          author_company: result.post.author?.company,
          author_is_wipa_recommended: result.post.author?.is_wipa_recommended,
          replies: 0,
          likes: 0,
          lastActivity: 'Just now',
          content: result.post.content,
          isHot: false
        }, ...topics]);
        setIsModalOpen(false);
        setNewTopic({ title: '', content: '' });
      }
    } catch (err) {
      console.error('Error creating topic:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0b0f19] text-slate-900 dark:text-white font-sans relative pb-20">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <button 
          onClick={() => router.push('/platform/forums')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>All Forums</span>
        </button>

        {forum && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800">
                  {forum.category} Channel
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {forum.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {forum.description}
              </p>
            </div>

            <div className="shrink-0">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>New Topic</span>
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search topics in this channel..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-xl pl-9 pr-3.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors shadow-xs"
          />
        </div>

        {/* Topics List */}
        <div className="space-y-3.5">
          {isLoading ? (
            <div className="p-16 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#5a32fa] mb-3" />
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading topics...</p>
            </div>
          ) : filteredTopics.map((topic) => (
            <Link 
              href={`/platform/forums?topic=${topic.id}`} 
              key={topic.id} 
              className="block group"
            >
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {(topic.author || 'U').charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{topic.author}</span>
                    {topic.author_company && (
                      <>
                        <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                        <span className="text-xs text-slate-400 dark:text-slate-400 truncate">{topic.author_company}</span>
                      </>
                    )}
                    <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                    <span className="text-xs text-slate-400 dark:text-slate-400">{topic.lastActivity}</span>
                  </div>

                  {topic.isHot && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <TrendingUp size={10} /> Trending
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-[17px] font-semibold text-slate-900 dark:text-white group-hover:text-[#5a32fa] dark:group-hover:text-purple-400 transition-colors leading-snug mb-1.5">
                  {topic.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {topic.content}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle size={14} className="text-slate-400" />
                      <span>{topic.replies} {topic.replies === 1 ? 'reply' : 'replies'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Heart size={14} className="text-slate-400" />
                      <span>{topic.likes}</span>
                    </span>
                  </div>

                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white flex items-center gap-1 transition-colors">
                    <span>View discussion</span>
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {filteredTopics.length === 0 && !isLoading && (
            <div className="p-16 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 text-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">No topics yet in this channel</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">Be the first to start a conversation in this area.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="py-2 px-4 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
              >
                Start Topic
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Topic Modal - Clean Solid Minimal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 w-full max-w-lg relative shadow-2xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Create Topic in {forum?.title}</h2>
              <button onClick={() => setIsModalOpen(false)} className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center transition-colors">
                <X size={14} />
              </button>
            </div>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input 
                  required
                  type="text" 
                  value={newTopic.title}
                  onChange={e => setNewTopic({...newTopic, title: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-slate-400 dark:focus:border-slate-600"
                  placeholder="Topic title..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Context</label>
                <textarea 
                  required
                  rows={4}
                  value={newTopic.content}
                  onChange={e => setNewTopic({...newTopic, content: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 resize-none"
                  placeholder="What would you like to ask or discuss?"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !newTopic.title.trim() || !newTopic.content.trim()}
                  className="bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white font-semibold text-xs py-2 px-5 rounded-full cursor-pointer shadow-xs disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Posting...' : 'Post Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
