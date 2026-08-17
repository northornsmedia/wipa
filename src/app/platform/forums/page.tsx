'use client';

import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Search, Plus, Filter, MessageCircle, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { supabase } from '@/lib/supabase';

export default function ForumsPage() {
  const [forums, setForums] = useState<any[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'Forums' | 'Trending'>('Forums');
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  React.useEffect(() => {
    const fetchForums = async () => {
      setIsLoading(true);
      const { data: forumsData } = await supabase
        .from('forums')
        .select(`
          *,
          forum_posts (count)
        `);
      
      if (forumsData) {
        setForums(forumsData.map((f: any) => ({
          ...f,
          postCount: f.forum_posts?.[0]?.count || 0
        })));
      }
      
      const { data: trendingData } = await supabase
        .from('forum_posts')
        .select('*, author:profiles(first_name, last_name, avatar_url), forum:forums(id, title)')
        .eq('is_trending', true)
        .order('trending_score', { ascending: false })
        .limit(20);
        
      if (trendingData) setTrendingPosts(trendingData);
      
      setIsLoading(false);
    };
    fetchForums();
  }, []);
  
  const filteredForums = forums.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ff90e8]/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8 relative z-10">
        
        {/* Cinematic Header Section */}
        <div className="mb-12 bg-white/60 dark:bg-[#1e293b]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-xl shadow-indigo-900/5 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4 text-gray-900 dark:text-white tracking-tight mb-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                <MessageSquare size={32} className="text-white" />
              </div>
              Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-[#ff90e8]">Forums</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-lg max-w-xl leading-relaxed">Join the conversation. Ask questions, share your expertise, and connect with IP law professionals worldwide.</p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <button className="group flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-black shadow-xl shadow-gray-900/20 dark:shadow-white/20 hover:scale-105 transition-all duration-300">
              <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500 text-[#ff90e8] dark:text-indigo-600" />
              <span>New Topic</span>
            </button>
          </div>
        </div>

        {/* Filters & Search - Glassmorphic */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 items-center">
          <div className="flex gap-3 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab('Forums')}
              className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${
                activeTab === 'Forums' 
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md' 
                  : 'bg-white dark:bg-[#1e293b] text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10'
              }`}
            >
              All Forums
            </button>
            <button
              onClick={() => setActiveTab('Trending')}
              className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'Trending' 
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' 
                  : 'bg-white dark:bg-[#1e293b] text-gray-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 border border-gray-200 dark:border-white/10 hover:text-orange-500 hover:border-orange-200'
              }`}
            >
              <TrendingUp size={18} /> Trending Posts
            </button>
          </div>

          <div className="relative flex-1 w-full max-w-lg mx-auto md:ml-auto md:mx-0 group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-[#ff90e8] rounded-2xl blur-md opacity-20 group-focus-within:opacity-40 transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm transition-all">
              <Search className="w-5 h-5 text-gray-400 ml-5 shrink-0 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search discussions, topics, or authors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-4 pl-4 pr-5 font-bold text-gray-900 dark:text-white focus:outline-none placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Forums List */}
        <div className="flex flex-col gap-5">
          
          {trendingPosts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                🔥 Trending Now
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingPosts.map(post => (
                  <Link href={`/platform/forums/${post.forum_id}/${post.id}`} key={post.id} className="block group">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-3xl border border-orange-200 dark:border-orange-500/20 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                          <TrendingUp size={12} /> Trending
                        </span>
                        <span className="text-xs text-gray-500 font-bold truncate">{post.forum?.title}</span>
                      </div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={post.author?.avatar_url || `https://ui-avatars.com/api/?name=${post.author?.first_name}+${post.author?.last_name}`} alt="Author" className="w-6 h-6 rounded-full" />
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{post.author?.first_name} {post.author?.last_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                          <span className="flex items-center gap-1"><MessageCircle size={12}/> {post.replies_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ad Space / Featured Banner */}
          <div className="w-full bg-gradient-to-br from-indigo-900 via-[#1e293b] to-[#1e293b] rounded-3xl overflow-hidden shadow-xl border border-indigo-500/20 relative h-32 md:h-40 mb-4 group cursor-pointer">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px] group-hover:bg-indigo-500/30 transition-colors mix-blend-screen" />
            <div className="absolute inset-0 flex items-center justify-between px-8 md:px-12 relative z-10">
              <div>
                <h3 className="text-white font-black text-2xl md:text-3xl tracking-tight mb-2">Master IP Strategy</h3>
                <p className="text-indigo-200 font-medium text-sm md:text-base">Enroll in the new UNH masterclass cohort today.</p>
              </div>
              <div className="hidden md:flex bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-bold group-hover:bg-white group-hover:text-indigo-900 transition-colors">
                Learn More
              </div>
            </div>
          </div>

          {/* Forums List */}
          {activeTab === 'Forums' ? (
            <>
              {filteredForums.map((forum) => (
                <Link href={`/platform/forums/${forum.id}`} key={forum.id} className="block">
                  <div 
                    className="bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 p-6 md:p-8 shadow-sm hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-900/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center cursor-pointer group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                          {forum.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                        {forum.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {forum.description}
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-sm font-bold text-gray-500 dark:text-gray-400 shrink-0 bg-gray-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-gray-100 dark:border-white/5 w-full md:w-auto">
                      <div className="flex flex-col items-center gap-1">
                        <MessageCircle size={20} className="text-indigo-500 mb-1" />
                        <span className="text-gray-900 dark:text-white text-lg leading-none">{forum.postCount}</span>
                        <span className="text-xs uppercase tracking-wider">Topics</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {filteredForums.length === 0 && !isLoading && (
                <div className="py-24 text-center bg-white/50 dark:bg-[#1e293b]/50 backdrop-blur-md rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-[#0f172a] rounded-full flex items-center justify-center mb-6">
                    <MessageSquare size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No forums found</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Try adjusting your search.</p>
                </div>
              )}
            </>
          ) : (
            <>
              {trendingPosts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(post => (
                <Link href={`/platform/forums/${post.forum_id}/${post.id}`} key={post.id} className="block group">
                  <div className="bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-xl rounded-3xl border border-orange-200 dark:border-orange-500/20 p-6 md:p-8 shadow-sm hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp size={14} /> Trending
                      </span>
                      <span className="text-sm text-gray-500 font-bold">in {post.forum?.title}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                      <div className="flex items-center gap-2">
                        <img src={post.author?.avatar_url || `https://ui-avatars.com/api/?name=${post.author?.first_name}+${post.author?.last_name}`} alt="Author" className="w-6 h-6 rounded-full" />
                        <span className="text-gray-600 dark:text-gray-300">{post.author?.first_name} {post.author?.last_name}</span>
                      </div>
                      <span className="flex items-center gap-1"><MessageCircle size={16}/> {post.replies_count || 0} Replies</span>
                    </div>
                  </div>
                </Link>
              ))}
              {trendingPosts.length === 0 && !isLoading && (
                <div className="py-24 text-center bg-white/50 dark:bg-[#1e293b]/50 backdrop-blur-md rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-6">
                    <TrendingUp size={40} className="text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No trending posts right now</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Check back later for hot discussions.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>

  );
}
