'use client';

import { useState } from 'react';
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <MessageSquare size={32} className="text-[#5a32fa]" />
              Community Forums
            </h1>
            <p className="text-gray-600 font-medium mt-2">Ask questions, share insights, and discuss the latest in IP law.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[#5a32fa] text-white px-6 py-3 rounded-xl border border-gray-200 font-bold hover:bg-[#5a32fa] hover:opacity-90 transition-colors shadow-sm hover:translate-y-1 hover:shadow-none">
              <Plus size={20} strokeWidth={3} />
              New Topic
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {['Recent', 'Hot', 'Unanswered'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'Recent' | 'Hot' | 'Unanswered')}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-full md:rounded-xl font-bold md:font-bold text-xs md:text-base border-2 md:border-4 transition-all flex items-center gap-1.5 md:gap-2 whitespace-nowrap shrink-0 ${
                  activeTab === tab
                    ? 'bg-[#5a32fa] text-white border-[#131313]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'
                }`}
              >
                {tab === 'Hot' && <TrendingUp size={16} className="w-4 h-4 md:w-5 md:h-5" />}
                {tab === 'Recent' && <Clock size={16} className="w-4 h-4 md:w-5 md:h-5" />}
                {tab === 'Unanswered' && <Filter size={16} className="w-4 h-4 md:w-5 md:h-5" />}
                {tab}
              </button>
            ))}
          </div>

          <div className="relative flex-1 w-full max-w-md mx-auto md:ml-auto md:mx-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search discussions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#5a32fa]/20 shadow-sm"
            />
          </div>
        </div>

        {/* Forums List */}
        <div className="flex flex-col gap-4">
          {filteredTopics.map(topic => (
            <div 
              key={topic.id} 
              onClick={() => setSelectedTopicId(topic.id)}
              className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start md:items-center cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#fbe8d5] text-[#131313] text-xs font-bold px-3 py-1 rounded-lg ">
                    {topic.category}
                  </span>
                  {topic.isHot && (
                    <span className="bg-[#ff4b4b] text-white text-xs font-bold px-3 py-1 rounded-lg  flex items-center gap-1">
                      <TrendingUp size={12} /> Hot
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1 hover:text-[#5a32fa] transition-colors">{topic.title}</h3>
                <p className="text-sm text-gray-500 font-medium">Started by <span className="font-bold text-gray-800">{topic.author}</span></p>
              </div>

              <div className="flex items-center gap-6 text-sm font-bold text-gray-600 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 md:border-gray-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} className="text-[#5a32fa]" />
                  {topic.replies} <span className="hidden md:inline">replies</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{topic.views} views</span>
                </div>
                <div className="flex flex-col items-end text-xs">
                  <span className="text-gray-400">Last activity</span>
                  <span className="text-[#131313]">{topic.lastActivity}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredTopics.length === 0 && (
            <div className="py-20 text-center bg-white rounded-[2rem] border border-gray-200 border-dashed">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No discussions found</h3>
              <p className="text-gray-500 font-medium">Try adjusting your filters or start a new topic.</p>
            </div>
          )}
        </div>

      </div>

      {/* Topic Discussion Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5a32fa]/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] border border-gray-200 shadow-[8px_8px_0px_0px_#131313] flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
              <div>
                <span className="bg-[#fbe8d5] text-[#131313] text-xs font-bold px-3 py-1 rounded-lg  inline-block mb-2">
                  {selectedTopic.category}
                </span>
                <h2 className="text-2xl font-bold text-gray-800 leading-tight pr-8">{selectedTopic.title}</h2>
                <p className="text-sm text-gray-500 font-medium mt-2">Started by <span className="font-bold text-gray-800">{selectedTopic.author}</span></p>
              </div>
              <button 
                onClick={() => setSelectedTopicId(null)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 border-2 border-transparent hover:border-[#131313] hover:bg-gray-200 transition-all shrink-0"
              >
                <span className="font-bold text-xl">X</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {topicReplies.map(reply => (
                <div key={reply.id} className="bg-white p-5 rounded-2xl border-2 border-gray-200 flex gap-4">
                  <div className="w-10 h-10 rounded-full  flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ backgroundColor: reply.color }}>
                    {reply.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-800">{reply.author}</h4>
                      <span className="text-xs font-medium text-gray-400">{reply.time}</span>
                    </div>
                    {reply.replyTo && (
                      <div className="flex flex-col gap-1 text-xs font-bold text-[#5a32fa] bg-[#5a32fa]/5 px-3 py-2 rounded-lg w-full border-l-4 border-[#5a32fa] mb-2 mt-1">
                        <span>Replying to @{reply.replyTo.author}</span>
                        <p className="text-gray-600 font-medium line-clamp-1">{reply.replyTo.content}</p>
                      </div>
                    )}
                    <p className="text-gray-700 text-[15px] leading-relaxed">{reply.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button 
                        onClick={() => setReplyingTo({ author: reply.author, content: reply.content })}
                        className="text-xs font-bold text-gray-500 hover:text-[#5a32fa] transition-colors"
                      >
                        Reply
                      </button>
                      <button 
                        onClick={() => handleHelpfulClick(reply.id)}
                        className={`text-xs font-bold transition-colors ${reply.isHelpful ? 'text-[#5a32fa]' : 'text-gray-500 hover:text-[#5a32fa]'}`}
                      >
                        Helpful ({reply.helpfulCount})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white rounded-b-[2rem] flex flex-col gap-3">
              {replyingTo && (
                <div className="flex flex-col gap-1 text-xs font-bold text-[#5a32fa] bg-[#5a32fa]/10 px-4 py-2 rounded-xl w-full border-2 border-[#5a32fa]/20">
                  <div className="flex items-center justify-between">
                    <span>Replying to @{replyingTo.author}</span>
                    <button onClick={() => setReplyingTo(null)} className="hover:text-[#ff4b4b] transition-colors ml-1 px-1">X</button>
                  </div>
                  <p className="text-gray-600 font-medium line-clamp-1 border-l-2 border-[#5a32fa]/30 pl-2 mt-1">{replyingTo.content}</p>
                </div>
              )}
              <div className="flex gap-3">
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..." 
                  className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors resize-none h-[52px]"
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
