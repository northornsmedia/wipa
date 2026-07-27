'use client';

import { useState, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Image as ImageIcon, Video, Calendar, Newspaper, ThumbsUp, MessageCircle, Share2, Send, Bookmark,
  BadgeCheck, LayoutGrid, User, Users, Mail, UserPlus, UsersRound, MessageSquare, FileText, Briefcase, GraduationCap,
  MoreHorizontal, Eye, X, Sparkles
, BookOpen, Home
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PlatformPage() {
  const { user, posts, likedPostIds, toggleLike } = useAppStore();
  const [postContent, setPostContent] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const [displayedPeople, setDisplayedPeople] = useState([
    { id: 1, name: 'Emily Chen', role: 'Senior IP Counsel at Innovatech', initial: 'E', color: '#ff90e8' },
    { id: 2, name: 'Nina Patel', role: 'Trademark Attorney', initial: 'N', color: '#b892ff' },
    { id: 3, name: 'Marie Dubois', role: 'IP Strategist at Global IP', initial: 'M', color: '#ffc900' }
  ]);
  const [peoplePool, setPeoplePool] = useState([
    { id: 4, name: 'David Lee', role: 'Patent Engineer', initial: 'D', color: '#00d26a' },
    { id: 5, name: 'Sarah Jones', role: 'IP Consultant', initial: 'S', color: '#5a32fa' },
    { id: 6, name: 'Alex Wong', role: 'Copyright Specialist', initial: 'A', color: '#ff4b4b' }
  ]);
  const [connectingId, setConnectingId] = useState<number | null>(null);
  const [isSuggestedModalOpen, setIsSuggestedModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState<{id: number, postId: number, author: string, initial: string, color: string, content: string, time: string}[]>([
    { id: 1, postId: 1, author: 'Alex Wong', initial: 'A', color: '#ff4b4b', content: 'I highly recommend looking into IPfolio. It integrates seamlessly with Salesforce.', time: '2 hours ago' },
    { id: 2, postId: 1, author: 'Nina Patel', initial: 'N', color: '#b892ff', content: 'We use Anaqua and it has been great for our team as we scaled.', time: '1 hour ago' }
  ]);

  const handleEnhanceWithAI = () => {
    if (!postContent.trim() || isEnhancing) return;
    setIsEnhancing(true);
    
    setTimeout(() => {
      const enhanced = `🚀 Excited to share some thoughts on this! \n\n${postContent.trim()}\n\nWhat are your perspectives? Let's discuss in the comments! 👇\n\n#Innovation #ProfessionalGrowth #Networking`;
      setPostContent(enhanced);
      setIsEnhancing(false);
    }, 1500);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim() && selectedPostId) {
      setPostComments([...postComments, {
        id: Date.now(),
        postId: selectedPostId,
        author: 'You',
        initial: 'Y',
        color: '#5a32fa',
        content: commentText,
        time: 'Just now'
      }]);
      setCommentText('');
    }
  };

  const handleConnectClick = (id: number) => {
    setConnectingId(id);
    setTimeout(() => {
      setDisplayedPeople(prev => prev.filter(p => p.id !== id));
      if (peoplePool.length > 0) {
        setDisplayedPeople(prev => {
          const newArr = prev.filter(p => p.id !== id);
          return [...newArr, peoplePool[0]];
        });
        setPeoplePool(prev => prev.slice(1));
      }
      setConnectingId(null);
    }, 800);
  };
  
  const [modalSentRequests, setModalSentRequests] = useState<number[]>([]);
  
  const handleModalConnectClick = (id: number) => {
    if (!modalSentRequests.includes(id)) {
      setModalSentRequests(prev => [...prev, id]);
    }
  };
  
  const handleModalUnsendClick = (id: number) => {
    setModalSentRequests(prev => prev.filter(reqId => reqId !== id));
  };
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setMediaType(type);
    }
  };

  const removeMedia = () => {
    setMediaPreview(null);
    setMediaType(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      
      {/* FIXED LEFT SIDEBAR */}
      <div className="hidden md:block fixed left-0 top-[72px] bottom-0 w-[260px] lg:w-[280px] z-40">
        <div className="bg-white rounded-tr-[2rem] rounded-br-none rounded-l-none border-t-2 border-r-2 border-l-0 border-b-0 border-[#131313] shadow-[4px_0px_0px_0px_#131313] p-4 h-full flex flex-col">
          {/* Profile Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#5a32fa] text-white flex items-center justify-center text-lg font-bold border-2 border-[#131313] flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-[14px] text-gray-900 truncate flex items-center gap-1">
                {user?.name || 'Loading...'}
                <BadgeCheck size={14} className="text-[#5a32fa] flex-shrink-0" />
              </h2>
              <p className="text-[11px] text-gray-500 font-medium truncate">IP Counsel</p>
              <p className="text-[11px] text-gray-500 font-medium truncate">WIPA Member</p>
            </div>
          </div>
          <button onClick={() => router.push('/platform/profile')} className="block text-center w-full py-1.5 border-2 border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:border-[#5a32fa] hover:text-[#5a32fa] transition-all mb-4">
            View Profile
          </button>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-2 px-2">MAIN NAVIGATION</p>
            <nav className="space-y-0.5">
              <Link href="/platform" className="flex items-center gap-3 px-3 py-2 bg-[#5a32fa]/10 text-[#5a32fa] rounded-xl font-bold text-sm transition-colors">
                <LayoutGrid size={16} /> Feed
              </Link>
              <Link href="/platform/liked-threads" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <ThumbsUp size={16} /> Liked Threads
              </Link>
              <Link href="/platform/network" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <UsersRound size={16} /> My Network
              </Link>
              <Link href="/platform/members" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <Users size={16} /> Members
              </Link>
              <Link href="/platform/messages" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <div className="flex items-center gap-3">
                  <Mail size={16} /> Messages
                </div>
                <span className="bg-[#5a32fa] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">2</span>
              </Link>
              <Link href="/platform/groups" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <UsersRound size={16} /> Groups
              </Link>
              <Link href="/platform/forums" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <MessageSquare size={16} /> Discussion Forums
              </Link>
              <Link href="/platform/resources" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <BookOpen size={16} /> Resource Library
              </Link>
              <Link href="/platform/events" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <Calendar size={16} /> Events
              </Link>
              <Link href="/platform/memberships" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <FileText size={16} /> Memberships
              </Link>
              <Link href="/platform/jobs" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <Briefcase size={16} /> Jobs Board
              </Link>
              <Link href="/platform/mentorship" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <div className="flex items-center gap-3">
                  <GraduationCap size={16} /> Mentorship
                </div>
                <span className="bg-[#00d26a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">NEW</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* FIXED RIGHT SIDEBAR */}
      <div className="hidden lg:block fixed right-0 top-[72px] bottom-0 w-[260px] xl:w-[320px] z-40">
        <div className="bg-[#f8f9fa] rounded-tl-[2rem] border-t-2 border-l-2 border-[#131313] shadow-[-4px_0px_0px_0px_#131313] p-5 h-full flex flex-col overflow-y-auto no-scrollbar gap-6">
          
          {/* Active Groups */}
          <div className="bg-white p-4 rounded-[1.5rem] border-2 border-[#131313] shadow-[4px_4px_0px_0px_#131313]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900">Active Groups</h3>
              <button className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Trade Marks', members: '1,345', icon: '©️', color: '#b892ff' },
                { name: 'Women in Leadership', members: '897', icon: '👩‍💼', color: '#ff90e8' },
                { name: 'Artificial Intelligence', members: '1,105', icon: '🤖', color: '#5a32fa' },
                { name: 'Patent Law', members: '1,245', icon: '📜', color: '#5a32fa' },
                { name: 'Start-ups & Innovation', members: '764', icon: '🚀', color: '#ffc900' }
              ].map((group, i) => (
                <div key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 border-transparent group-hover:border-[#131313] transition-all" style={{ backgroundColor: `${group.color}20`, color: group.color }}>
                    {group.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#5a32fa] transition-colors">{group.name}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{group.members} members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Discussions */}
          <div className="bg-white p-4 rounded-[1.5rem] border-2 border-[#131313] shadow-[4px_4px_0px_0px_#131313]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900">Trending Discussions</h3>
              <button onClick={() => router.push('/platform/forums')} className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'How is AI changing patent landscapes globally?', comments: '128' },
                { title: 'The future of trademark law in digital markets', comments: '96' },
                { title: 'Building personal brand in IP profession', comments: '74' }
              ].map((disc, i) => (
                <div key={i} onClick={() => router.push('/platform/forums')} className="cursor-pointer group">
                  <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#5a32fa] transition-colors leading-tight mb-1">
                    <span className="text-[#00d26a] mr-1">▶</span>{disc.title}
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium">{disc.comments} comments</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white p-4 rounded-[1.5rem] border-2 border-[#131313] shadow-[4px_4px_0px_0px_#131313]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900">Upcoming Events</h3>
              <button onClick={() => router.push('/platform/events')} className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { month: 'JUL', day: '22', title: 'Women in AI & IP Leadership', loc: 'London, UK', time: '10:00 AM GMT' },
                { month: 'AUG', day: '05', title: 'Global Trademark Trends 2025', loc: 'Online Webinar', time: '03:00 PM GMT' },
                { month: 'AUG', day: '19', title: 'IP Strategy for Start-ups', loc: 'New York, USA', time: '11:00 AM EST' }
              ].map((event, i) => (
                <div 
                  key={i} 
                  onClick={() => router.push(`/platform/events/${i + 1}`)}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className="flex flex-col items-center justify-center border-2 border-[#131313] rounded-xl overflow-hidden min-w-[45px]">
                    <div className="bg-[#5a32fa] text-white text-[9px] font-bold w-full text-center py-0.5">{event.month}</div>
                    <div className="bg-white text-gray-900 text-sm font-black py-1">{event.day}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-bold text-gray-900 leading-tight mb-0.5">{event.title}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{event.loc}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{event.time}</p>
                  </div>
                  <button className="bg-[#5a32fa] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#4020ca] transition-colors">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* People You May Know */}
          <div className="bg-white p-4 rounded-[1.5rem] border-2 border-[#131313] shadow-[4px_4px_0px_0px_#131313] mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900">People You May Know</h3>
              <button onClick={() => setIsSuggestedModalOpen(true)} className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4 overflow-hidden">
              {displayedPeople.map((person) => {
                const isConnecting = connectingId === person.id;
                return (
                  <div key={person.id} className={`flex items-center gap-3 transition-all duration-500 ${isConnecting ? 'opacity-0 scale-95 -translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full border-2 border-[#131313] flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: person.color }}>
                        {person.initial}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00d26a] border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[13px] font-bold text-gray-900 truncate">{person.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium truncate">{person.role}</p>
                    </div>
                    <button 
                      onClick={() => handleConnectClick(person.id)}
                      disabled={isConnecting}
                      className={`border-2 text-[11px] font-bold px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                        isConnecting 
                          ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' 
                          : 'border-gray-200 text-[#5a32fa] hover:border-[#5a32fa]'
                      }`}
                    >
                      {isConnecting ? 'Request Sent' : 'Connect'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* MAIN SCROLLABLE CONTENT */}
      <div className="w-full md:pl-[260px] lg:pl-[280px] lg:pr-[260px] xl:pr-[320px] min-h-screen">
        <div className="max-w-[900px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
          
          {/* Composer */}
          <div className="bg-white p-4 md:p-6 rounded-[2rem] border-4 border-[#131313] md:shadow-[8px_8px_0px_0px_#131313] mb-8 relative">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b892ff] to-[#5a32fa] text-white flex items-center justify-center text-xl font-bold flex-shrink-0 border-2 border-[#131313]">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <textarea 
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share a thought, ask a question, or post an update..." 
                  className="w-full bg-transparent text-gray-900 text-lg placeholder-gray-400 border-none focus:ring-0 resize-none h-14 md:h-20 focus:outline-none"
                />
              </div>
            </div>
            
            {mediaPreview && (
              <div className="mt-4 relative rounded-xl overflow-hidden border-2 border-[#131313] inline-block max-w-full">
                <button 
                  onClick={removeMedia}
                  className="absolute top-2 right-2 bg-[#131313] text-white p-1 rounded-lg hover:bg-[#ff4b4b] transition-colors z-10"
                >
                  <X size={16} />
                </button>
                {mediaType === 'image' ? (
                  <img src={mediaPreview} alt="Preview" className="max-h-64 object-contain" />
                ) : (
                  <video src={mediaPreview} controls className="max-h-64 object-contain" />
                )}
              </div>
            )}
            
            <div className="flex flex-wrap items-center justify-between mt-4 border-t-2 border-gray-100 pt-4 gap-y-3">
              <div className="flex gap-1 md:gap-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={imageInputRef} 
                  onChange={(e) => handleFileChange(e, 'image')}
                />
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  ref={videoInputRef} 
                  onChange={(e) => handleFileChange(e, 'video')}
                />
                <button 
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#5a32fa] hover:bg-[#b892ff]/10 px-3 py-2 rounded-xl transition-all"
                >
                  <ImageIcon size={18} /> <span className="hidden sm:inline">Photo</span>
                </button>
                <button 
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#5a32fa] hover:bg-[#b892ff]/10 px-3 py-2 rounded-xl transition-all"
                >
                  <Video size={18} /> <span className="hidden sm:inline">Video</span>
                </button>
                <button 
                  onClick={() => router.push('/platform/events?create=true')}
                  className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#5a32fa] hover:bg-[#b892ff]/10 px-3 py-2 rounded-xl transition-all"
                >
                  <Calendar size={18} /> <span className="hidden sm:inline">Event</span>
                </button>
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#5a32fa] hover:bg-[#b892ff]/10 px-3 py-2 rounded-xl transition-all">
                    <FileText size={18} className="text-[#00d26a]" /> <span className="hidden sm:inline">Attach Doc</span>
                  </button>
                  <input 
                    type="file" 
                    accept=".doc,.docx,.pdf" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Upload Word or PDF document"
                  />
                </div>
              </div>
              
              <div className={`transition-all duration-300 ease-out ml-2 flex items-center gap-1.5 md:gap-2 ${postContent.trim() ? 'opacity-100 visible' : 'opacity-0 invisible hidden'}`}>
                <button 
                  type="button"
                  onClick={handleEnhanceWithAI}
                  disabled={isEnhancing}
                  className="bg-white text-[#5a32fa] px-2.5 py-1.5 md:px-4 md:py-2 rounded-xl font-black text-[10px] md:text-sm border-2 border-[#131313] hover:shadow-[2px_2px_0px_0px_#131313] hover:-translate-y-[1px] hover:-translate-x-[1px] transition-all flex items-center gap-1 md:gap-2 whitespace-nowrap disabled:opacity-70 disabled:cursor-wait"
                >
                  <Sparkles size={12} className={`md:w-4 md:h-4 ${isEnhancing ? "animate-spin" : ""}`} /> 
                  {isEnhancing ? "Enhancing..." : "Enhance with AI"}
                </button>
                <button 
                  onClick={() => setPostContent('')}
                  className="bg-[#00d26a] text-[#131313] px-4 py-1.5 md:px-6 md:py-2 rounded-xl font-black text-[10px] md:text-sm border-2 border-[#131313] hover:shadow-[2px_2px_0px_0px_#131313] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none whitespace-nowrap"
                >
                  PUBLISH
                </button>
              </div>
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-6 pb-24">
            {posts.map((post) => {
              const isLiked = likedPostIds.includes(post.id);
              return (
                <div key={post.id} className="bg-white rounded-[2rem] border-4 border-[#131313] md:shadow-[8px_8px_0px_0px_#131313] overflow-hidden">
                  {/* Post Header */}
                  <div className="p-6 pb-4 flex items-start justify-between border-b-2 border-gray-100">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full text-[#131313] flex items-center justify-center text-xl font-black border-2 border-[#131313]"
                        style={{ backgroundColor: post.color }}
                      >
                        {post.initial}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-[15px] hover:underline cursor-pointer">{post.name}</h3>
                        <p className="text-[13px] text-gray-500 font-medium">{post.title}</p>
                        <p className="text-[11px] text-gray-400 font-bold mt-0.5">{post.time}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
    
                  {/* Post Content */}
                  <div className="p-6 pt-4 text-gray-800 text-[15px] leading-relaxed">
                    {post.content}
                  </div>
    
                  {/* Post Actions */}
                  <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-t-2 border-[#131313]">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 border-transparent hover:border-gray-300 ${
                          isLiked 
                            ? 'bg-[#ff90e8]/20 text-[#ff90e8] hover:border-[#ff90e8]' 
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <ThumbsUp size={18} className={isLiked ? "fill-current" : ""} /> Like {post.likes > 0 && `(${post.likes})`}
                      </button>
                      <button 
                        onClick={() => setSelectedPostId(post.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-gray-600 transition-all hover:bg-gray-200 border-2 border-transparent hover:border-gray-300"
                      >
                        <MessageCircle size={18} /> Comment {post.comments + postComments.filter(c => c.postId === post.id && c.author === 'You').length > 0 && `(${post.comments + postComments.filter(c => c.postId === post.id && c.author === 'You').length})`}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 font-bold text-sm text-gray-500">
                      <Eye size={18} /> {post.likes * 14 + 132} Impressions
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Suggested Connections Modal */}
      {isSuggestedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131313]/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] flex flex-col max-h-[75vh]">
            <div className="flex justify-between items-center p-6 border-b-4 border-[#131313]">
              <h2 className="text-2xl font-black text-gray-900">Suggested Connections</h2>
              <button 
                onClick={() => setIsSuggestedModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 border-2 border-transparent hover:border-[#131313] hover:bg-gray-200 transition-all"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              {[...displayedPeople, ...peoplePool].map((person) => {
                const isSent = modalSentRequests.includes(person.id);
                return (
                  <div key={`modal-${person.id}`} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="w-12 h-12 rounded-full border-2 border-[#131313] flex items-center justify-center font-bold text-white text-lg flex-shrink-0" style={{ backgroundColor: person.color }}>
                      {person.initial}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-black text-gray-900 truncate">{person.name}</p>
                      <p className="text-xs font-bold text-gray-500 truncate">{person.role}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <button 
                        onClick={() => handleModalConnectClick(person.id)}
                        disabled={isSent}
                        className={`px-4 py-2 rounded-xl font-black text-xs border-2 border-[#131313] transition-colors whitespace-nowrap shadow-[2px_2px_0px_0px_#131313] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none ${
                          isSent 
                            ? 'bg-[#5a32fa] text-white hover:bg-[#5a32fa]' 
                            : 'bg-[#00d26a] text-[#131313] hover:bg-[#00e373]'
                        }`}
                      >
                        {isSent ? 'Sent' : 'Connect'}
                      </button>
                      {isSent && (
                        <button 
                          onClick={() => handleModalUnsendClick(person.id)}
                          className="text-[10px] font-bold text-[#ff4b4b] hover:underline mt-0.5"
                        >
                          Unsend
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}


      {/* Post Comments Modal */}
      {selectedPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131313]/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-start p-6 border-b-4 border-[#131313]">
              {(() => {
                const post = posts.find(p => p.id === selectedPostId);
                if (!post) return null;
                return (
                  <div className="w-full pr-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full border-2 border-[#131313] flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ backgroundColor: post.color }}>
                        {post.initial}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 leading-tight">{post.name}</h4>
                        <p className="text-[11px] text-gray-500 font-medium">{post.title}</p>
                      </div>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">{post.content}</p>
                  </div>
                );
              })()}
              <button 
                onClick={() => setSelectedPostId(null)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 border-2 border-transparent hover:border-[#131313] hover:bg-gray-200 transition-all shrink-0"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {postComments.filter(c => c.postId === selectedPostId).map(comment => (
                <div key={comment.id} className="bg-white p-5 rounded-2xl border-2 border-gray-200 flex gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-[#131313] flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ backgroundColor: comment.color }}>
                    {comment.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{comment.author}</h4>
                      <span className="text-xs font-medium text-gray-400">{comment.time}</span>
                    </div>
                    <p className="text-gray-700 text-[14px] leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
              {postComments.filter(c => c.postId === selectedPostId).length === 0 && (
                <p className="text-center text-gray-500 font-medium py-8">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>

            <div className="p-6 border-t-4 border-[#131313] bg-white rounded-b-[2rem]">
              <div className="flex gap-3">
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..." 
                  className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-colors resize-none h-[52px]"
                />
                <button 
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                  className={`bg-[#5a32fa] text-white px-6 py-0 h-[52px] rounded-xl font-black text-sm border-2 border-[#131313] transition-all flex items-center gap-2 shrink-0 ${
                    !commentText.trim() 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-[4px_4px_0px_0px_#131313] hover:-translate-y-1'
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
