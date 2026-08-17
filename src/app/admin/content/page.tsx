'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Plus, Loader2, BookOpen, TrendingUp, Mic, X } from 'lucide-react';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'resources' | 'quizzes' | 'trending'>('resources');
  const [resources, setResources] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Podcast Conversion Modal
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [postToConvert, setPostToConvert] = useState<any>(null);
  const [podcastTitle, setPodcastTitle] = useState('');
  const [podcastNotes, setPodcastNotes] = useState('');
  const [podcastHost, setPodcastHost] = useState('WIPA Admin');
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      const { data: resData } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
      if (resData) setResources(resData);
      
      const { data: quizData } = await supabase.from('quizzes').select('*, questions:quiz_questions(count)').order('created_at', { ascending: false });
      if (quizData) setQuizzes(quizData);
      
      const { data: trendingData } = await supabase.from('forum_posts').select('*, forum_replies(content, author:profiles(first_name, last_name))').eq('is_trending', true).order('trending_score', { ascending: false });
      if (trendingData) setTrendingPosts(trendingData);
      
      setLoading(false);
    };
    fetchResources();
  }, []);

  const openConvertModal = (post: any) => {
    setPostToConvert(post);
    setPodcastTitle(post.title);
    
    // Generate show notes from top replies
    const notes = post.forum_replies?.map((r: any) => `- ${r.author?.first_name || 'User'} said: ${r.content}`).join('\n') || '';
    setPodcastNotes(`Discussion based on: ${post.title}\n\nKey points from community:\n${notes}`);
    
    setIsConvertModalOpen(true);
  };

  const handleConvert = async () => {
    if (!postToConvert || !podcastTitle.trim()) return;
    setIsConverting(true);
    
    const { error } = await supabase.from('resources').insert({
      title: podcastTitle,
      type: 'podcast',
      description: podcastNotes,
      source_forum_post_id: postToConvert.id,
      category: 'Community Discussions',
      published: true
    });
    
    setIsConverting(false);
    if (!error) {
      setIsConvertModalOpen(false);
      setPostToConvert(null);
      // Refresh to see the new podcast resource if switched to resources tab
    } else {
      alert("Error converting to podcast: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          {activeTab === 'resources' ? <FileText className="text-[#5a32fa]" /> : activeTab === 'quizzes' ? <BookOpen className="text-[#5a32fa]" /> : <TrendingUp className="text-[#5a32fa]" />} 
          Manage {activeTab === 'resources' ? 'Resources' : activeTab === 'quizzes' ? 'Quizzes' : 'Trending Discussions'}
        </h1>
        <button className="bg-[#5a32fa] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4a24db] transition-colors">
          <Plus size={18} /> Add {activeTab === 'resources' ? 'Resource' : 'Quiz'}
        </button>
      </div>

      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-2">
        <button 
          onClick={() => setActiveTab('resources')}
          className={`font-bold px-4 py-2 border-b-2 transition-colors ${activeTab === 'resources' ? 'border-[#5a32fa] text-[#5a32fa]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          All Resources
        </button>
        <button 
          onClick={() => setActiveTab('quizzes')}
          className={`font-bold px-4 py-2 border-b-2 transition-colors ${activeTab === 'quizzes' ? 'border-[#5a32fa] text-[#5a32fa]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Quizzes
        </button>
        <button 
          onClick={() => setActiveTab('trending')}
          className={`font-bold px-4 py-2 border-b-2 transition-colors ${activeTab === 'trending' ? 'border-[#5a32fa] text-[#5a32fa]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Trending Discussions
        </button>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {activeTab === 'resources' ? (
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Title</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Category</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Uploaded</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
                </tr>
              ) : activeTab === 'quizzes' ? (
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Title</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Category / Difficulty</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Questions</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Status</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
                </tr>
              ) : (
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Discussion Title</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Trending Score</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Trended At</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
                </tr>
              )}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center"><Loader2 size={32} className="mx-auto animate-spin text-[#5a32fa]" /></td>
                </tr>
              ) : activeTab === 'resources' ? (
                resources.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No resources found.</td>
                  </tr>
                ) : (
                  resources.map(resource => (
                    <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-bold text-gray-900 dark:text-white">
                        {resource.title}
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-medium text-gray-600 dark:text-gray-400">
                        {resource.category}
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 text-sm text-gray-500">
                        {new Date(resource.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 text-right">
                        <button className="text-sm font-bold text-[#5a32fa] hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))
                )
                )
              ) : activeTab === 'quizzes' ? (
                quizzes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No quizzes found.</td>
                  </tr>
                ) : (
                  quizzes.map(quiz => (
                    <tr key={quiz.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-bold text-gray-900 dark:text-white">
                        {quiz.title}
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-medium text-gray-600 dark:text-gray-400">
                        {quiz.category} <span className="text-gray-400 px-2">•</span> {quiz.difficulty}
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-medium text-gray-600 dark:text-gray-400">
                        {quiz.questions?.[0]?.count || 0} Questions
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${quiz.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {quiz.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 text-right">
                        <button className="text-sm font-bold text-[#5a32fa] hover:underline mr-4">Edit</button>
                        <button className="text-sm font-bold text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                trendingPosts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No trending discussions found.</td>
                  </tr>
                ) : (
                  trendingPosts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-bold text-gray-900 dark:text-white">
                        {post.title}
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-medium text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1 text-orange-500">
                          <TrendingUp size={14} /> {Math.round(post.trending_score)}
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-medium text-gray-600 dark:text-gray-400">
                        {new Date(post.trended_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 text-right">
                        <button 
                          onClick={() => openConvertModal(post)}
                          className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ml-auto"
                        >
                          <Mic size={14} /> Convert to Podcast
                        </button>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Convert to Podcast Modal */}
      {isConvertModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-[24px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Mic className="text-[#5a32fa]" /> Create Podcast Episode
              </h2>
              <button onClick={() => setIsConvertModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Episode Title</label>
                <input 
                  type="text" 
                  value={podcastTitle}
                  onChange={(e) => setPodcastTitle(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Host Name</label>
                <input 
                  type="text" 
                  value={podcastHost}
                  onChange={(e) => setPodcastHost(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Show Notes / Description</label>
                <textarea 
                  value={podcastNotes}
                  onChange={(e) => setPodcastNotes(e.target.value)}
                  className="w-full h-48 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 font-medium resize-none"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-[#0f172a]">
              <button 
                onClick={() => setIsConvertModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConvert}
                disabled={isConverting || !podcastTitle.trim()}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#5a32fa] hover:bg-[#4a24db] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isConverting ? <Loader2 size={18} className="animate-spin" /> : <Mic size={18} />}
                Confirm & Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
