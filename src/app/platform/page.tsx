'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { useAppStore } from '@/store/useAppStore';
import { 
  Search, Bell, LayoutGrid, BookOpen, Calendar, Users, Info, Settings, 
  Hash, BellOff, ArrowUpRight, CheckCircle2, Circle, Image as ImageIcon, Video, Smile,
  Bookmark, MoreVertical, Heart, MessageCircle, Gift, LogOut,
  ThumbsUp, UsersRound, Mail, MessageSquare, FileText, Briefcase, GraduationCap, Home, Star, X, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PlatformPage() {
  const { user, posts, likedPostIds, toggleLike, setUser } = useAppStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Latest');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [postPrivacy, setPostPrivacy] = useState<'Anyone' | 'Followers only'>('Anyone');
  const [isPrivacyDropdownOpen, setIsPrivacyDropdownOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [postContent, setPostContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  
  const fetchFeed = useCallback(async () => {
    setIsLoadingFeed(true);
    const { data, error } = await supabase
      .from('feed_posts')
      .select(`
        *,
        author:profiles!feed_posts_author_id_fkey(full_name, avatar_url, practice_area, created_at)
      `)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching feed:", error);
    } else {
      setFeedPosts(data || []);
    }
    setIsLoadingFeed(false);
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);
  
  const handleCloseModal = () => {
    setIsCreatePostModalOpen(false);
    setPublishSuccess(false);
    setPostContent('');
    setUploadError(null);
  };
  
  const handlePublish = async () => {
    if (!postContent.trim()) return;
    if (!user) {
      alert("You must be logged in to post!");
      return;
    }
    
    setIsPublishing(true);
    
    const { error } = await supabase.from('feed_posts').insert({
      author_id: user.id,
      content: postContent,
      privacy: postPrivacy,
      media_urls: []
    });
    
    setIsPublishing(false);
    
    if (error) {
      setUploadError('Failed to publish post: ' + error.message);
      return;
    }
    
    setPublishSuccess(true);
    setPostContent('');
    setUploadError(null);
    fetchFeed();
  };
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'doc') => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    
    const sizeMB = file.size / (1024 * 1024);
    if (type === 'image' && sizeMB > 5) {
      setUploadError('Images up to 5MB are allowed.');
      return;
    }
    if (type === 'video' && sizeMB > 15) {
      setUploadError('Videos up to 15MB are allowed.');
      return;
    }
    if (type === 'doc' && sizeMB > 5) {
      setUploadError('Documents up to 5MB are allowed.');
      return;
    }
    // Proceed with upload in a real implementation
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="w-full bg-white font-sans flex flex-col h-[calc(100vh-73px)] overflow-hidden">
      <div className="w-full bg-white flex flex-col flex-1 overflow-hidden">
        


        {/* MAIN LAYOUT */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* LEFT SIDEBAR */}
          <aside className="w-[260px] hidden lg:flex flex-col border-r border-gray-100 overflow-y-auto no-scrollbar py-6 shrink-0 bg-white">
            
            <div className="px-4 mb-8">
              <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 px-3 uppercase">MAIN NAVIGATION</p>
              <nav className="space-y-1">
                <Link href="/platform" className="flex items-center gap-3 px-3 py-2.5 bg-[#f0ebff] text-[#5a32fa] rounded-xl font-bold text-[13px] transition-colors">
                  <LayoutGrid size={18} /> Feed
                </Link>
                <Link href="/platform/liked-threads" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <ThumbsUp size={18} /> Liked Threads
                </Link>
                <Link href="/platform/network" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <UsersRound size={18} /> My Network
                </Link>
                <Link href="/platform/members" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <Users size={18} /> Members
                </Link>
                <Link href="/platform/messages" className="flex items-center justify-between px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail size={18} /> Messages
                  </div>
                  <span className="w-5 h-5 flex items-center justify-center bg-[#5a32fa] text-white text-[10px] font-bold rounded-full">2</span>
                </Link>
                <Link href="/platform/groups" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <UsersRound size={18} /> Groups
                </Link>
                <Link href="/platform/forums" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <MessageSquare size={18} /> Discussion Forums
                </Link>
                <Link href="/platform/resources" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <BookOpen size={18} /> Resource Library
                </Link>
                <Link href="/platform/events" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <Calendar size={18} /> Events
                </Link>
                <Link href="/platform/memberships" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <FileText size={18} /> Memberships
                </Link>
                <Link href="/platform/jobs" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <Briefcase size={18} /> Jobs Board
                </Link>
                <Link href="/platform/mentorship" className="flex items-center justify-between px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <div className="flex items-center gap-3">
                    <GraduationCap size={18} /> Mentorship
                  </div>
                  <span className="px-2 py-0.5 bg-[#00d26a] text-white text-[10px] font-bold rounded-full">NEW</span>
                </Link>
              </nav>
            </div>

            <div className="px-4 mb-8">
              <p className="text-[13px] font-bold text-[#131313] mb-4 px-3">All Channels</p>
              <nav className="space-y-1">
                <Link href="/platform/channels/general" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors group">
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-gray-400" /> General
                  </div>
                </Link>
                <Link href="/platform/channels/daily-highlights" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors group">
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-gray-400" /> daily-highlights
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  </div>
                </Link>
                <Link href="/platform/channels/time-tracking" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors group">
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-gray-400" /> time-tracking
                  </div>
                  <BellOff size={14} className="text-gray-400" />
                </Link>
                <Link href="/platform/channels/productivity-systems" className="flex items-center justify-between px-3 py-2 text-gray-900 bg-gray-50 rounded-xl font-medium text-[13px] transition-colors group">
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-gray-400" /> productivity-systems
                  </div>
                </Link>
              </nav>
            </div>

            <div className="px-4 mb-8">
              <p className="text-[13px] font-bold text-[#131313] mb-4 px-3">Links</p>
              <nav className="space-y-1">
                <Link href="/ios-app" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <div className="flex items-center gap-2">
                     iOS App
                  </div>
                  <ArrowUpRight size={14} className="text-gray-400" />
                </Link>
                <Link href="/android-app" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <div className="flex items-center gap-2">
                     Android App
                  </div>
                  <ArrowUpRight size={14} className="text-gray-400" />
                </Link>
              </nav>
            </div>

            <div className="px-7 mt-auto mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Complete Your Intro</h3>
                <div className="w-4 h-4 rounded-full border-2 border-[#00d26a] border-t-transparent animate-spin-slow"></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Circle size={16} className="text-gray-300 mt-0.5 shrink-0" />
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900 underline decoration-gray-300 underline-offset-4">Watch intro video</a>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-gray-900 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-900 font-medium">React to a post</span>
                </div>
              </div>
            </div>

          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 bg-slate-50/50 overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar">
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
              
              {/* HERO BANNER */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full overflow-hidden opacity-40 pointer-events-none">
                   {/* Abstract shapes matching the screenshot style */}
                   <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-[#ffcc00] rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform -rotate-45"></div>
                   <div className="absolute top-[-30%] right-[20%] w-[40%] h-[120%] bg-[#ff4b4b] rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform rotate-12"></div>
                   <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[80%] bg-[#5a32fa] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                </div>
                
                <div className="relative z-10 lg:w-2/3">
                  <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">Hello{user?.name ? ` ${user.name}` : ''},<br/>Welcome to WIPA</h1>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Building the Future of Innovation Together</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 sm:w-5/6">
                    Connect with innovators, IP professionals, founders, researchers, and investors to share knowledge, collaborate, and turn ideas into impact.
                  </p>
                </div>
                
                {/* Tabs & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 border-b border-gray-100 pb-0 relative z-10">
                  <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                    {['Latest', 'Trending', 'Following', 'Saved'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm transition-colors whitespace-nowrap ${
                          activeTab === tab 
                            ? 'font-bold text-gray-900 border-b-2 border-[#5a32fa]' 
                            : 'font-medium text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="relative pb-3 shrink-0">
                    <Search className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search feeds" 
                      className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-sm w-full sm:w-48 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* COMPOSER */}
              <div 
                className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex flex-col overflow-hidden cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-gray-200 transition-all duration-300 relative group"
                onClick={() => setIsCreatePostModalOpen(true)}
              >
                {/* Accent Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#131313] via-[#5a32fa] to-[#ff90e8] opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Input Area */}
                <div className="flex gap-4 p-5 pb-4 border-b border-gray-50 pt-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff90e8] to-[#ff4b4b] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-1 shadow-sm shadow-[#ff90e8]/30">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 bg-gray-50 hover:bg-gray-100 transition-colors rounded-2xl p-4 min-h-[80px] border border-gray-100 group-hover:border-gray-200">
                    <span className="text-gray-500 font-medium text-[15px]">What's on your mind?</span>
                  </div>
                </div>
                
                {/* Options Area */}
                <div className="flex items-center justify-between gap-1 sm:gap-2 px-4 py-2 bg-gray-50/30">
                  <button className="flex-1 flex items-center justify-center gap-2 p-2.5 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-xl transition-colors font-medium text-[13px]">
                    <ImageIcon size={18} className="text-[#00d26a]" />
                    <span className="hidden sm:block">Photo</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 p-2.5 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-xl transition-colors font-medium text-[13px]">
                    <Video size={18} className="text-[#ff4b4b]" />
                    <span className="hidden sm:block">Video</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 p-2.5 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-xl transition-colors font-medium text-[13px]">
                    <Calendar size={18} className="text-[#ffc900]" />
                    <span className="hidden sm:block">Event</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 p-2.5 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-xl transition-colors font-medium text-[13px]">
                    <FileText size={18} className="text-[#5a32fa]" />
                    <span className="hidden sm:block">Attach</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 p-2.5 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-xl transition-colors font-medium text-[13px]">
                    <Smile size={18} className="text-[#ff90e8]" />
                    <span className="hidden sm:block">Feeling</span>
                  </button>
                </div>
              </div>

              {/* CREATE POST MODAL */}
              {isCreatePostModalOpen && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-0 transition-opacity">
                  <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col transform transition-transform scale-100 border border-white/50 relative group">
                    
                    {publishSuccess ? (
                      <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle2 size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Post Published!</h2>
                        <p className="text-gray-500 mb-8">Your post has been successfully shared to the feed.</p>
                        <button 
                          onClick={handleCloseModal}
                          className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between p-5 border-b border-gray-50 pt-6">
                          <h2 className="text-xl font-black text-gray-900 tracking-tight">Create Post</h2>
                          <button 
                            onClick={handleCloseModal}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors group/close"
                          >
                            <X size={20} className="text-gray-400 group-hover/close:text-gray-900 transition-colors" />
                          </button>
                        </div>
                    
                    <div className="p-5 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff90e8] to-[#ff4b4b] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md shadow-[#ff90e8]/30">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-[15px] text-gray-900 leading-tight">{user?.name || 'User'}</p>
                        <div className="relative">
                          <div 
                            className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer px-2.5 py-1 rounded-lg mt-1 w-fit"
                            onClick={() => setIsPrivacyDropdownOpen(!isPrivacyDropdownOpen)}
                          >
                            <Users size={12} className="text-gray-600" />
                            <span className="text-[11px] font-bold text-gray-600">{postPrivacy}</span>
                            <span className="text-[10px] text-gray-400 ml-0.5">▼</span>
                          </div>
                          
                          {isPrivacyDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                              <button 
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50"
                                onClick={() => {
                                  setPostPrivacy('Anyone');
                                  setIsPrivacyDropdownOpen(false);
                                }}
                              >
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <Users size={14} className="text-gray-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900">Anyone</p>
                                  <p className="text-[11px] text-gray-500">Anyone on or off WIPA</p>
                                </div>
                              </button>
                              <button 
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                onClick={() => {
                                  setPostPrivacy('Followers only');
                                  setIsPrivacyDropdownOpen(false);
                                }}
                              >
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <UsersRound size={14} className="text-gray-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900">Followers only</p>
                                  <p className="text-[11px] text-gray-500">Only your connections</p>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-5 pb-2">
                      <textarea 
                        className="w-full min-h-[160px] resize-none outline-none text-xl text-gray-900 placeholder-gray-300 font-medium leading-relaxed bg-transparent"
                        placeholder="What's on your mind?"
                        autoFocus
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="px-5 pb-5 relative">
                      <div className="absolute inset-x-5 inset-y-0 bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] rounded-2xl blur opacity-20 pointer-events-none"></div>
                      <div className="relative flex items-center justify-between border border-white/50 bg-white/80 backdrop-blur-xl rounded-2xl p-3 shadow-lg shadow-[#5a32fa]/5">
                        <span className="font-bold text-[13px] text-gray-600 pl-2">Add to your post</span>
                        <div className="flex items-center gap-1">
                          <input type="file" accept="image/*" className="hidden" id="modal-image-upload" onChange={(e) => handleUpload(e, 'image')} />
                          <input type="file" accept="video/*" className="hidden" id="modal-video-upload" onChange={(e) => handleUpload(e, 'video')} />
                          <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" id="modal-doc-upload" onChange={(e) => handleUpload(e, 'doc')} />
                          
                          <label htmlFor="modal-image-upload" className="p-2.5 hover:bg-[#00d26a]/10 rounded-xl transition-colors group/icon cursor-pointer"><ImageIcon size={22} className="text-[#00d26a] group-hover/icon:scale-110 transition-transform" /></label>
                          <label htmlFor="modal-video-upload" className="p-2.5 hover:bg-[#ff4b4b]/10 rounded-xl transition-colors group/icon cursor-pointer"><Video size={22} className="text-[#ff4b4b] group-hover/icon:scale-110 transition-transform" /></label>
                          <label htmlFor="modal-doc-upload" className="p-2.5 hover:bg-[#5a32fa]/10 rounded-xl transition-colors group/icon cursor-pointer"><FileText size={22} className="text-[#5a32fa] group-hover/icon:scale-110 transition-transform" /></label>
                          <button className="p-2.5 hover:bg-[#ff90e8]/10 rounded-xl transition-colors group/icon"><Smile size={22} className="text-[#ff90e8] group-hover/icon:scale-110 transition-transform" /></button>
                        </div>
                      </div>
                    </div>
                    
                    {uploadError && (
                      <div className="px-5 pb-3">
                        <p className="text-red-500 text-[13px] font-bold bg-red-50 border border-red-100 p-2.5 rounded-xl">{uploadError}</p>
                      </div>
                    )}
                    
                    <div className="p-5 pt-0">
                      <button 
                        className="w-full bg-gradient-to-r from-[#5a32fa] to-[#b892ff] text-white py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-[#5a32fa]/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handlePublish}
                        disabled={!postContent.trim() || isPublishing}
                      >
                        {isPublishing ? (
                          <>
                            <Loader2 size={18} className="animate-spin" /> Publishing...
                          </>
                        ) : (
                          <>
                            Publish Post <ArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
                  </div>
                </div>
              )}

              {/* FEED */}
              <div className="space-y-4">
                {isLoadingFeed ? (
                  <div className="flex items-center justify-center py-20 text-gray-400">
                    <Loader2 size={32} className="animate-spin" />
                  </div>
                ) : feedPosts.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                    <p className="text-gray-500 font-medium">No posts yet. Be the first to share something!</p>
                  </div>
                ) : feedPosts.map((post) => {
                  const isLiked = likedPostIds.includes(post.id); // Will update to real likes soon
                  const author = post.author || {};
                  const authorName = author.full_name || 'Anonymous User';
                  const initial = authorName.charAt(0).toUpperCase();
                  const timeAgo = formatDistanceToNow(parseISO(post.created_at), { addSuffix: true });
                  const memberSince = author.created_at 
                    ? format(parseISO(author.created_at), 'MMMM d, yyyy') 
                    : 'Unknown';
                    
                  return (
                    <div key={post.id} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {author.avatar_url ? (
                            <img src={author.avatar_url} alt={authorName} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                              {initial}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-[14px] text-gray-900 leading-none">{authorName}</h3>
                              <span className="text-gray-300 text-xs">•</span>
                              <span className="text-xs text-gray-500 font-medium leading-none">{timeAgo}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">
                              {author.practice_area ? `${author.practice_area} • ` : ''}Member since {memberSince}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <button className="p-1.5 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors"><Bookmark size={18} /></button>
                          <button className="p-1.5 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors"><MoreVertical size={18} /></button>
                        </div>
                      </div>
                      
                      <p className="text-[14px] text-gray-800 leading-relaxed mb-6 font-medium whitespace-pre-wrap">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-3 sm:gap-4 text-gray-400">
                          <button 
                            onClick={() => toggleLike(post.id)} 
                            className={`hover:text-red-500 transition-colors flex items-center gap-1.5 ${isLiked ? 'text-red-500' : ''}`}
                          >
                            <Heart size={20} className={isLiked ? "fill-current" : ""} />
                            <span className="text-xs font-bold">{post.likes_count || 0}</span>
                          </button>
                          <button className="hover:text-gray-900 transition-colors flex items-center gap-1.5">
                            <MessageCircle size={20} />
                            <span className="text-xs font-bold">{post.comments_count || 0}</span>
                          </button>
                          <button className="hover:text-gray-900 transition-colors">
                            <Gift size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
