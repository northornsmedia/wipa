'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, MessageSquare, Search, Plus, Clock, MessageCircle, TrendingUp, Filter } from 'lucide-react';
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Fetch forum details
      const { data: forumData } = await supabase
        .from('forums')
        .select('*')
        .eq('id', params.forumId)
        .single();
      
      if (forumData) {
        setForum(forumData);
        // Fetch posts for this forum
        const { data: postsData } = await supabase
          .from('forum_posts')
          .select(`
            *,
            author:profiles(full_name),
            forum_replies(count),
            forum_post_likes(count)
          `)
          .eq('forum_id', params.forumId)
          .order('created_at', { ascending: false });
        
        if (postsData) {
          setTopics(postsData.map((p: any) => ({
            id: p.id,
            title: p.title,
            author: p.author?.full_name || 'Unknown',
            replies: p.forum_replies?.[0]?.count || 0,
            likes: p.forum_post_likes?.[0]?.count || 0,
            lastActivity: new Date(p.created_at).toLocaleDateString(),
            content: p.content,
            isHot: (p.forum_replies?.[0]?.count || 0) > 5
          })));
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [params.forumId]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newTopic.title || !newTopic.content) return;
    
    const { data: post, error } = await supabase
      .from('forum_posts')
      .insert({
        forum_id: params.forumId,
        author_id: user.id,
        title: newTopic.title,
        content: newTopic.content
      })
      .select(`
        *,
        author:profiles(full_name),
        forum_replies(count),
        forum_post_likes(count)
      `)
      .single();
      
    if (post) {
      setTopics([{
        id: post.id,
        title: post.title,
        author: post.author?.full_name || 'You',
        replies: 0,
        likes: 0,
        lastActivity: 'Just now',
        content: post.content,
        isHot: false
      }, ...topics]);
      setIsModalOpen(false);
      setNewTopic({ title: '', content: '' });
    }
  };

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8 relative z-10">
        
        <button 
          onClick={() => router.push('/platform/forums')}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold mb-6 hover:text-gray-900 dark:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back to Forums
        </button>

        {forum && (
          <div className="mb-12 bg-white/60 dark:bg-[#1e293b]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-xl shadow-indigo-900/5 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group">
            <div className="relative z-10">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block">
                {forum.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
                {forum.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium text-lg max-w-xl">{forum.description}</p>
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-black shadow-xl shadow-gray-900/20 dark:shadow-white/20 hover:scale-105 transition-all duration-300"
              >
                <Plus size={20} strokeWidth={3} className="text-[#ff90e8] dark:text-indigo-600" />
                <span>New Topic</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 mb-10 items-center">
          <div className="relative flex-1 w-full max-w-lg mx-auto md:ml-auto md:mx-0 group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-[#ff90e8] rounded-2xl blur-md opacity-20 group-focus-within:opacity-40 transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm transition-all">
              <Search className="w-5 h-5 text-gray-400 ml-5 shrink-0 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search topics..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-4 pl-4 pr-5 font-bold text-gray-900 dark:text-white focus:outline-none placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {filteredTopics.map((topic) => (
            <Link href={`/platform/forums/${params.forumId}/${topic.id}`} key={topic.id} className="block">
              <div className="bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 p-6 md:p-8 shadow-sm hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-900/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center cursor-pointer group">
                <div className="flex-1">
                  {topic.isHot && (
                    <span className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit mb-3">
                      <TrendingUp size={14} /> Hot Topic
                    </span>
                  )}
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-[10px] font-black">
                      {topic.author.charAt(0)}
                    </div>
                    Started by <span className="font-bold text-gray-900 dark:text-gray-200">{topic.author}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-sm font-bold text-gray-500 dark:text-gray-400 shrink-0 bg-gray-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-gray-100 dark:border-white/5 w-full md:w-auto">
                  <div className="flex flex-col items-center gap-1">
                    <MessageCircle size={20} className="text-indigo-500 mb-1" />
                    <span className="text-gray-900 dark:text-white text-lg leading-none">{topic.replies}</span>
                    <span className="text-xs uppercase tracking-wider">Replies</span>
                  </div>
                  <div className="w-px h-12 bg-gray-200 dark:bg-white/10"></div>
                  <div className="flex flex-col items-center gap-1">
                    <TrendingUp size={20} className="text-gray-400 mb-1" />
                    <span className="text-gray-900 dark:text-white text-lg leading-none">{topic.likes}</span>
                    <span className="text-xs uppercase tracking-wider">Likes</span>
                  </div>
                  <div className="w-px h-12 bg-gray-200 dark:bg-white/10"></div>
                  <div className="flex flex-col items-end gap-1 min-w-[80px]">
                    <Clock size={20} className="text-gray-400 mb-1" />
                    <span className="text-gray-900 dark:text-white text-sm whitespace-nowrap">{topic.lastActivity}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filteredTopics.length === 0 && !isLoading && (
            <div className="py-24 text-center bg-white/50 dark:bg-[#1e293b]/50 backdrop-blur-md rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-[#0f172a] rounded-full flex items-center justify-center mb-6">
                <MessageSquare size={40} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No topics yet</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Be the first to start a new topic.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-8 w-full max-w-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 font-bold text-xl">X</button>
            <h2 className="text-2xl font-bold mb-6">Create New Topic</h2>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Title</label>
                <input 
                  required
                  type="text" 
                  value={newTopic.title}
                  onChange={e => setNewTopic({...newTopic, title: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/20 rounded-xl px-4 py-3"
                  placeholder="Topic title..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Content</label>
                <textarea 
                  required
                  value={newTopic.content}
                  onChange={e => setNewTopic({...newTopic, content: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 h-32 resize-none"
                  placeholder="What do you want to discuss?"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl">Post Topic</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
