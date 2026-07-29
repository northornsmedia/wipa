'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { useAppStore } from '@/store/useAppStore';
import { 
  Search, Bell, LayoutGrid, BookOpen, Calendar, Users, Info, Settings, 
  Hash, BellOff, ArrowUpRight, CheckCircle2, Circle, Image as ImageIcon, Video, Smile,
  Bookmark, MoreVertical, Heart, MessageCircle, Gift, LogOut, Pencil, Copy, MessageSquareOff, Trash2, Globe, Lock, Shield,
  FileText, Loader2, PlayCircle, Plus, Send, X, Mail, ThumbsUp, UsersRound, MessageSquare, Briefcase, GraduationCap, Home, Star
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
  const [dbLikedPostIds, setDbLikedPostIds] = useState<Set<string>>(new Set());
  const [activeCommentPost, setActiveCommentPost] = useState<any | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [postComments, setPostComments] = useState<Record<string, any[]>>({});
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isUpdatingPost, setIsUpdatingPost] = useState(false);
  
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
    
    if (user) {
      const { data: likesData } = await supabase
        .from('feed_likes')
        .select('post_id')
        .eq('user_id', user.id);
        
      if (likesData) {
        setDbLikedPostIds(new Set(likesData.map(l => l.post_id)));
      }
    }
    
    setIsLoadingFeed(false);
  }, [user]);

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
  
  const handleLikePost = async (postId: string) => {
    if (!user) return;
    
    const isLiked = dbLikedPostIds.has(postId);
    const newLiked = new Set(dbLikedPostIds);
    
    if (isLiked) {
      newLiked.delete(postId);
      setFeedPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) - 1) } : p));
    } else {
      newLiked.add(postId);
      setFeedPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p));
    }
    setDbLikedPostIds(newLiked);
    
    if (isLiked) {
      await supabase.from('feed_likes').delete().match({ post_id: postId, user_id: user.id });
    } else {
      await supabase.from('feed_likes').insert({ post_id: postId, user_id: user.id });
    }
  };

  const fetchComments = async (postId: string) => {
    const { data } = await supabase
      .from('feed_comments')
      .select('*, author:profiles!feed_comments_author_id_fkey(full_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (data) {
      setPostComments(prev => ({ ...prev, [postId]: data }));
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentText.trim() || !user) return;
    
    // Check if comments are disabled
    const targetPost = feedPosts.find(p => p.id === postId);
    if (targetPost?.comments_disabled) return;
    setIsSubmittingComment(true);
    
    const { error } = await supabase.from('feed_comments').insert({
      post_id: postId,
      author_id: user.id,
      content: commentText
    });
    
    setIsSubmittingComment(false);
    
    if (error) {
      console.error("Failed to post comment:", error);
      return;
    }
    
    setCommentText('');
    fetchComments(postId); // Refresh comments to show the new one
    fetchFeed(); // Update the comment count on the post
  };

  const handleDeletePost = (postId: string) => {
    setActiveMenuPostId(null);
    setPostToDelete(postId);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    const { error } = await supabase.from('feed_posts').delete().eq('id', postToDelete);
    if (!error) fetchFeed();
    setPostToDelete(null);
  };

  const handleToggleComments = async (postId: string, currentStatus: boolean) => {
    setActiveMenuPostId(null);
    const { error } = await supabase.from('feed_posts').update({ comments_disabled: !currentStatus }).eq('id', postId);
    if (!error) fetchFeed();
  };

  const handleCopyLink = (postId: string) => {
    setActiveMenuPostId(null);
    navigator.clipboard.writeText(`${window.location.origin}/platform/post/${postId}`);
    alert('Link copied to clipboard!');
  };

  const submitEditPost = async () => {
    if (!editingPost || !editContent.trim()) return;
    setIsUpdatingPost(true);
    const { error } = await supabase.from('feed_posts').update({ content: editContent }).eq('id', editingPost.id);
    setIsUpdatingPost(false);
    if (!error) {
      setEditingPost(null);
      fetchFeed();
    }
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
                  <Heart size={18} /> Liked Threads
                </Link>
                <Link href="/platform/network" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <Users size={18} /> My Network
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
                  <Users size={18} /> Groups
                </Link>
                <Link href="/platform/forums" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <MessageCircle size={18} /> Discussion Forums
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
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#131313] via-[#5a32fa] to-[#ff90e8] opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex gap-4 p-5 pb-4 border-b border-gray-50 pt-6">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user?.name || 'User'} className="w-10 h-10 rounded-full object-cover shrink-0 mt-1 shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff90e8] to-[#ff4b4b] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-1 shadow-sm shadow-[#ff90e8]/30">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex-1 bg-gray-50 hover:bg-gray-100 transition-colors rounded-2xl p-4 min-h-[80px] border border-gray-100 group-hover:border-gray-200">
                    <span className="text-gray-500 font-medium text-[15px]">What's on your mind?</span>
                  </div>
                </div>
                
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
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt={user?.name || 'User'} className="w-12 h-12 rounded-2xl object-cover shadow-md shadow-gray-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff90e8] to-[#ff4b4b] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md shadow-[#ff90e8]/30">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
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
                                  <Users size={14} className="text-gray-600" />
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
                  const isLiked = dbLikedPostIds.has(post.id);
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
                          <Link href={`/platform/profile/${post.author_id}`} className="shrink-0 hover:opacity-80 transition-opacity block">
                            {author.avatar_url ? (
                              <img src={author.avatar_url} alt={authorName} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                                {initial}
                              </div>
                            )}
                          </Link>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Link href={`/platform/profile/${post.author_id}`} className="hover:underline hover:text-[#5a32fa] transition-colors">
                                <h3 className="font-bold text-[14px] text-gray-900 leading-none">{authorName}</h3>
                              </Link>
                              <span className="text-gray-300 text-xs">•</span>
                              <span className="text-xs text-gray-500 font-medium leading-none">{timeAgo}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">
                              {author.practice_area ? `${author.practice_area} • ` : ''}Member since {memberSince}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 relative">
                          <button className="p-1.5 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors"><Bookmark size={18} /></button>
                          <button 
                            onClick={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}
                            className="p-1.5 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          {activeMenuPostId === post.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setActiveMenuPostId(null)}></div>
                              <div className="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
                                {user?.id === post.author_id && (
                                  <button 
                                    onClick={() => {
                                      setEditingPost(post);
                                      setEditContent(post.content);
                                      setActiveMenuPostId(null);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                  >
                                    <Pencil size={16} /> Edit Post
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleCopyLink(post.id)}
                                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <Copy size={16} /> Copy Link
                                </button>
                                {user?.id === post.author_id && (
                                  <>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button 
                                      onClick={() => handleToggleComments(post.id, !!post.comments_disabled)}
                                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                    >
                                      <MessageSquareOff size={16} /> {post.comments_disabled ? 'Turn On Comments' : 'Turn Off Comments'}
                                    </button>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button 
                                      onClick={() => handleDeletePost(post.id)}
                                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                    >
                                      <Trash2 size={16} /> Delete Post
                                    </button>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {editingPost?.id === post.id ? (
                        <div className="space-y-3">
                          <textarea 
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => setEditingPost(null)} className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={submitEditPost} disabled={isUpdatingPost} className="px-4 py-2 text-xs font-bold text-white bg-[#5a32fa] rounded-lg">
                              {isUpdatingPost ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[14px] text-gray-800 leading-relaxed mb-6 font-medium whitespace-pre-wrap">
                          {post.content}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-3 sm:gap-4 text-gray-400">
                          <button 
                            onClick={() => handleLikePost(post.id)} 
                            className={`hover:text-red-500 transition-colors flex items-center gap-1.5 ${isLiked ? 'text-red-500' : ''}`}
                          >
                            <Heart size={20} className={isLiked ? "fill-current" : ""} />
                            <span className="text-xs font-bold">{post.likes_count || 0}</span>
                          </button>
                          <button 
                            onClick={() => {
                              if (post.comments_disabled) return;
                              setActiveCommentPost(post);
                              fetchComments(post.id);
                            }}
                            className={`transition-colors flex items-center gap-1.5 ${post.comments_disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:text-[#5a32fa]'}`}
                          >
                            <MessageCircle size={20} />
                            <span className="text-xs font-bold">{post.comments_disabled ? 'Disabled' : (post.comments_count || 0)}</span>
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
      
      {/* Comment Modal */}
      {activeCommentPost && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-50 pt-6 shrink-0">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Comments</h2>
              <button 
                onClick={() => {
                  setActiveCommentPost(null);
                  setCommentText('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors group/close"
              >
                <X size={20} className="text-gray-400 group-hover/close:text-gray-900 transition-colors" />
              </button>
            </div>
            
            {/* Original Post Context */}
            <div className="p-5 border-b border-gray-50 bg-gray-50/50 shrink-0">
              <div className="flex items-center gap-3 mb-3">
                {activeCommentPost.author?.avatar_url ? (
                  <img src={activeCommentPost.author.avatar_url} alt="Author" className="w-8 h-8 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {activeCommentPost.author?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-[13px] text-gray-900 leading-none">{activeCommentPost.author?.full_name || 'Anonymous User'}</h3>
                  <span className="text-[11px] text-gray-500 font-medium">{formatDistanceToNow(parseISO(activeCommentPost.created_at), { addSuffix: true })}</span>
                </div>
              </div>
              <p className="text-[13px] text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
                {activeCommentPost.content}
              </p>
            </div>

            {/* Comments List Area */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {!postComments[activeCommentPost.id] || postComments[activeCommentPost.id].length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 text-[13px] font-medium">No comments yet. Be the first to reply!</p>
                </div>
              ) : (
                postComments[activeCommentPost.id].map(comment => {
                  const commentAuthor = comment.author || {};
                  const cName = commentAuthor.full_name || 'Anonymous User';
                  const cInitial = cName.charAt(0).toUpperCase();
                  const cTime = formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true });
                  
                  return (
                    <div key={comment.id} className="flex gap-3">
                      {commentAuthor.avatar_url ? (
                        <img src={commentAuthor.avatar_url} alt={cName} className="w-8 h-8 rounded-full object-cover shadow-sm mt-0.5" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm mt-0.5">
                          {cInitial}
                        </div>
                      )}
                      <div className="flex-1 bg-gray-50 p-3 rounded-2xl rounded-tl-none border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-[13px] text-gray-900 leading-none">{cName}</h4>
                          <span className="text-[11px] text-gray-400 font-medium leading-none">{cTime}</span>
                        </div>
                        <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Add Comment Input Area (Footer) */}
            <div className="p-5 border-t border-gray-50 bg-white shrink-0">
              <div className="flex gap-3">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user?.name || 'User'} className="w-8 h-8 rounded-full object-cover shadow-sm mt-0.5" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff90e8] to-[#ff4b4b] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm mt-0.5">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex-1 flex flex-col items-end gap-2">
                  <textarea 
                    className="w-full min-h-[80px] resize-none outline-none text-[13px] text-gray-900 placeholder-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 focus:border-gray-200 focus:bg-white transition-colors disabled:opacity-50"
                    placeholder={activeCommentPost.comments_disabled ? "Comments are turned off" : "Write a comment..."}
                    autoFocus
                    disabled={activeCommentPost.comments_disabled}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                  <button 
                    className="bg-gray-900 text-white px-5 py-2 rounded-xl text-[13px] font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                    disabled={!commentText.trim() || isSubmittingComment || activeCommentPost.comments_disabled}
                    onClick={() => handleCommentSubmit(activeCommentPost.id)}
                  >
                    {isSubmittingComment ? <Loader2 size={14} className="animate-spin" /> : null}
                    Post Reply
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] overflow-hidden flex flex-col p-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Post?</h2>
            <p className="text-[14px] text-gray-500 mb-8 leading-relaxed px-2">
              Are you sure you want to delete this post? Once deleted, it cannot be recovered.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setPostToDelete(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeletePost}
                className="flex-1 bg-red-500 text-white py-3.5 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-sm shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
