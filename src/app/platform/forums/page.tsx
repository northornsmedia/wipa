'use client';

import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Search, Plus, Filter, MessageCircle, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const MOCK_FORUM_TOPICS = [
  {
    id: 1,
    title: "Best practices for trademarking AI-generated logos?",
    category: "Trade Marks",
    author: "Elena Rodriguez",
    replies: 45,
    views: 1204,
    lastActivity: "2 hours ago",
    isHot: true,
  },
  {
    id: 2,
    title: "Navigating the new European Patent Office guidelines",
    category: "Patents",
    author: "Sarah Jenkins",
    replies: 12,
    views: 340,
    lastActivity: "5 hours ago",
    isHot: false,
  },
  {
    id: 3,
    title: "How to handle copyright infringement on social media platforms",
    category: "Copyright",
    author: "David Chen",
    replies: 89,
    views: 3100,
    lastActivity: "1 day ago",
    isHot: true,
  },
  {
    id: 4,
    title: "Seeking advice: Transitioning from private practice to in-house counsel",
    category: "Career Advice",
    author: "Jessica Alcott",
    replies: 34,
    views: 890,
    lastActivity: "2 days ago",
    isHot: false,
  },
  {
    id: 5,
    title: "Recent changes in pharmaceutical patent term extensions",
    category: "Life Sciences",
    author: "Michael Chang",
    replies: 8,
    views: 215,
    lastActivity: "3 days ago",
    isHot: false,
  }
];

export default function ForumsPage() {
  const [topics, setTopics] = useState(MOCK_FORUM_TOPICS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'Recent' | 'Hot' | 'Unanswered'>('Recent');
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<{author: string, content: string} | null>(null);
  
  
  const [topicReplies, setTopicReplies] = useState<{
    id: number;
    author: string;
    time: string;
    content: string;
    initial: string;
    color: string;
    helpfulCount: number;
    isHelpful: boolean;
    replyTo?: { author: string, content: string } | null;
  }[]>([
    { id: 1, author: 'Sarah Jenkins', time: '2 hours ago', content: 'In my experience, you should focus on the distinctiveness of the logo...', initial: 'S', color: '#ff90e8', helpfulCount: 4, isHelpful: false },
    { id: 2, author: 'David Chen', time: '1 hour ago', content: 'Agreed! Also make sure you have the copyright assignment from the AI platform if applicable.', initial: 'D', color: '#00d26a', helpfulCount: 2, isHelpful: false }
  ]);
  
  const handleReplySubmit = () => {
    if (replyText.trim()) {
      setTopicReplies([...topicReplies, {
        id: Date.now(),
        author: 'You',
        time: 'Just now',
        content: replyText,
        initial: 'Y',
        color: '#5a32fa',
        helpfulCount: 0,
        isHelpful: false,
        replyTo: replyingTo
      }]);
      setReplyText("");
      setReplyingTo(null);
    }
  };
  
  const handleHelpfulClick = (id: number) => {
    setTopicReplies(prev => prev.map(reply => {
      if (reply.id === id) {
        return {
          ...reply,
          isHelpful: !reply.isHelpful,
          helpfulCount: reply.isHelpful ? reply.helpfulCount - 1 : reply.helpfulCount + 1
        };
      }
      return reply;
    }));
  };
  
  const selectedTopic = topics.find(t => t.id === selectedTopicId);

  const filteredTopics = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'Hot') return matchesSearch && t.isHot;
    if (activeTab === 'Unanswered') return matchesSearch && t.replies === 0;
    return matchesSearch;
  });

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
            {['Recent', 'Hot', 'Unanswered'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'Recent' | 'Hot' | 'Unanswered')}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30 scale-[1.02]'
                    : 'bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md text-gray-600 dark:text-gray-300 border-white/50 dark:border-white/10 hover:border-indigo-400/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md'
                }`}
              >
                {tab === 'Hot' && <TrendingUp size={18} className={activeTab === tab ? 'text-white' : 'text-rose-500'} />}
                {tab === 'Recent' && <Clock size={18} className={activeTab === tab ? 'text-white' : 'text-indigo-500'} />}
                {tab === 'Unanswered' && <Filter size={18} className={activeTab === tab ? 'text-white' : 'text-emerald-500'} />}
                {tab}
              </button>
            ))}
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

          {filteredTopics.map((topic, index) => (
            <React.Fragment key={topic.id}>
              <div 
                onClick={() => setSelectedTopicId(topic.id)}
                className="bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 p-6 md:p-8 shadow-sm hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-900/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center cursor-pointer group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                      {topic.category}
                    </span>
                    {topic.isHot && (
                      <span className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                        <TrendingUp size={14} /> Hot Topic
                      </span>
                    )}
                  </div>
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
                    <span className="text-gray-900 dark:text-white text-lg leading-none">{topic.views}</span>
                    <span className="text-xs uppercase tracking-wider">Views</span>
                  </div>
                  <div className="w-px h-12 bg-gray-200 dark:bg-white/10"></div>
                  <div className="flex flex-col items-end gap-1 min-w-[80px]">
                    <Clock size={20} className="text-gray-400 mb-1" />
                    <span className="text-gray-900 dark:text-white text-sm whitespace-nowrap">{topic.lastActivity}</span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}

          {filteredTopics.length === 0 && (
            <div className="py-24 text-center bg-white/50 dark:bg-[#1e293b]/50 backdrop-blur-md rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-[#0f172a] rounded-full flex items-center justify-center mb-6">
                <MessageSquare size={40} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No discussions found</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Try adjusting your filters or be the first to start a new topic.</p>
            </div>
          )}
        </div>
      </div>

      {/* Topic Discussion Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5a32fa]/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] w-full max-w-2xl rounded-[2rem] border border-gray-200 dark:border-white/20 shadow-[8px_8px_0px_0px_#131313] flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-white/10">
              <div>
                <span className="bg-[#fbe8d5] text-[#131313] text-xs font-bold px-3 py-1 rounded-lg  inline-block mb-2">
                  {selectedTopic.category}
                </span>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight pr-8">{selectedTopic.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">Started by <span className="font-bold text-gray-800 dark:text-gray-100">{selectedTopic.author}</span></p>
              </div>
              <button 
                onClick={() => setSelectedTopicId(null)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:border-[#131313] hover:bg-gray-200 transition-all shrink-0"
              >
                <span className="font-bold text-xl">X</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-white/5">
              {topicReplies.map(reply => (
                <div key={reply.id} className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border-2 border-gray-200 dark:border-white/20 flex gap-4">
                  <div className="w-10 h-10 rounded-full  flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ backgroundColor: reply.color }}>
                    {reply.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-800 dark:text-gray-100">{reply.author}</h4>
                      <span className="text-xs font-medium text-gray-400">{reply.time}</span>
                    </div>
                    {reply.replyTo && (
                      <div className="flex flex-col gap-1 text-xs font-bold text-[#5a32fa] bg-[#5a32fa]/5 px-3 py-2 rounded-lg w-full border-l-4 border-[#5a32fa] mb-2 mt-1">
                        <span>Replying to @{reply.replyTo.author}</span>
                        <p className="text-gray-600 dark:text-gray-300 font-medium line-clamp-1">{reply.replyTo.content}</p>
                      </div>
                    )}
                    <p className="text-gray-700 dark:text-gray-200 text-[15px] leading-relaxed">{reply.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button 
                        onClick={() => setReplyingTo({ author: reply.author, content: reply.content })}
                        className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#5a32fa] transition-colors"
                      >
                        Reply
                      </button>
                      <button 
                        onClick={() => handleHelpfulClick(reply.id)}
                        className={`text-xs font-bold transition-colors ${reply.isHelpful ? 'text-[#5a32fa]' : 'text-gray-500 dark:text-gray-400 hover:text-[#5a32fa]'}`}
                      >
                        Helpful ({reply.helpfulCount})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#0f172a] rounded-b-[2rem] flex flex-col gap-3">
              {replyingTo && (
                <div className="flex flex-col gap-1 text-xs font-bold text-[#5a32fa] bg-[#5a32fa]/10 px-4 py-2 rounded-xl w-full border-2 border-[#5a32fa]/20">
                  <div className="flex items-center justify-between">
                    <span>Replying to @{replyingTo.author}</span>
                    <button onClick={() => setReplyingTo(null)} className="hover:text-[#ff4b4b] transition-colors ml-1 px-1">X</button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium line-clamp-1 border-l-2 border-[#5a32fa]/30 pl-2 mt-1">{replyingTo.content}</p>
                </div>
              )}
              <div className="flex gap-3">
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..." 
                  className="flex-1 bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white dark:bg-[#0f172a] transition-colors resize-none h-[52px]"
                />
                <button 
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim()}
                  className={`bg-[#5a32fa] text-white px-6 py-0 h-[52px] rounded-xl font-bold text-sm  transition-all flex items-center gap-2 shrink-0 ${
                    !replyText.trim() 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-sm hover:-translate-y-1'
                  }`}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
