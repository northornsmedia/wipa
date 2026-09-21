'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  MessageCircle, 
  Clock, 
  TrendingUp, 
  Heart, 
  Share2, 
  X, 
  Check, 
  Send, 
  User, 
  Sparkles as _, // unused, strict rule reminder
  ArrowUpRight,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  Layers,
  Building2,
  GraduationCap,
  ShieldCheck,
  Globe2,
  ArrowRight,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import AdSlot from '@/components/AdSlot';

interface AuthorProfile {
  id?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  company?: string;
  is_wipa_recommended?: boolean;
}

interface ForumItem {
  id: string;
  title: string;
  description: string;
  category: string;
  postCount?: number;
}

interface ForumPostItem {
  id: string;
  forum_id: string;
  author_id: string;
  title: string;
  content: string;
  created_at: string;
  author?: AuthorProfile;
  forum?: {
    id: string;
    title: string;
    category: string;
  };
  repliesCount?: number;
  likesCount?: number;
  isLiked?: boolean;
  podcast?: {
    id: string;
    title: string;
  } | null;
}

interface ForumReplyItem {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: AuthorProfile;
}

function ForumsPageContent() {
  const searchParams = useSearchParams();
  const user = useAppStore((state) => state.user);

  const [forums, setForums] = useState<ForumItem[]>([]);
  const [posts, setPosts] = useState<ForumPostItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'channels'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Active Discussion Drawer/Modal State
  const [activeDiscussion, setActiveDiscussion] = useState<ForumPostItem | null>(null);
  const [replies, setReplies] = useState<ForumReplyItem[]>([]);
  const [isFetchingReplies, setIsFetchingReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Topic Modal State
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);
  const [newTopicData, setNewTopicData] = useState({
    forumId: '',
    title: '',
    content: ''
  });
  const [isSubmittingTopic, setIsSubmittingTopic] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Forums with post counts
        const { data: forumsData } = await supabase
          .from('forums')
          .select('*, forum_posts(count)');

        if (forumsData) {
          const mappedForums = forumsData.map((f: any) => ({
            id: f.id,
            title: f.title,
            description: f.description,
            category: f.category,
            postCount: f.forum_posts?.[0]?.count || 0
          }));
          setForums(mappedForums);
          if (mappedForums.length > 0 && !newTopicData.forumId) {
            setNewTopicData(prev => ({ ...prev, forumId: mappedForums[0].id }));
          }
        }

        // 2. Fetch Posts with relations
        const { data: postsData } = await supabase
          .from('forum_posts')
          .select(`
            *,
            author:profiles!forum_posts_author_id_fkey(id, full_name, avatar_url, role, company, is_wipa_recommended),
            forum:forums(id, title, category),
            forum_replies(count),
            forum_post_likes(count)
          `)
          .order('created_at', { ascending: false });

        if (postsData) {
          const mappedPosts: ForumPostItem[] = postsData.map((p: any) => ({
            id: p.id,
            forum_id: p.forum_id,
            author_id: p.author_id,
            title: p.title,
            content: p.content,
            created_at: p.created_at,
            author: p.author,
            forum: p.forum,
            repliesCount: p.forum_replies?.[0]?.count || 0,
            likesCount: p.forum_post_likes?.[0]?.count || 0,
            isLiked: false
          }));

          // Fetch user's likes if logged in
          if (user?.id) {
            const { data: userLikes } = await supabase
              .from('forum_post_likes')
              .select('post_id')
              .eq('user_id', user.id);
            
            if (userLikes && userLikes.length > 0) {
              const likedSet = new Set(userLikes.map((l: any) => l.post_id));
              mappedPosts.forEach(p => {
                p.isLiked = likedSet.has(p.id);
              });
            }
          }

          setPosts(mappedPosts);

          // Auto-open discussion if 'topic' param in URL
          const topicParam = searchParams.get('topic');
          if (topicParam) {
            const match = mappedPosts.find(p => p.id === topicParam);
            if (match) {
              handleOpenDiscussion(match);
            }
          }
        }
      } catch (err) {
        console.error('Error loading forums:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // Handle Open Discussion
  const handleOpenDiscussion = async (post: ForumPostItem) => {
    setActiveDiscussion(post);
    setReplies([]);
    setIsFetchingReplies(true);
    setReplyText('');

    // Track View
    fetch('/api/forums/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.id })
    }).catch(() => {});

    try {
      // Fetch replies
      const { data: repliesData } = await supabase
        .from('forum_replies')
        .select(`
          *,
          author:profiles!forum_replies_author_id_fkey(id, full_name, avatar_url, role, company, is_wipa_recommended)
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (repliesData) {
        setReplies(repliesData);
      }

      // Check if podcast exists for this post
      const { data: podcastData } = await supabase
        .from('resources')
        .select('id, title')
        .eq('source_forum_post_id', post.id)
        .eq('type', 'podcast')
        .maybeSingle();

      if (podcastData) {
        setActiveDiscussion(prev => prev ? ({ ...prev, podcast: podcastData }) : null);
      }
    } catch (err) {
      console.error('Error fetching replies:', err);
    } finally {
      setIsFetchingReplies(false);
    }
  };

  // Handle Post Reply
  const handleReplySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activeDiscussion || isSubmittingReply) return;
    setIsSubmittingReply(true);

    try {
      const res = await fetch('/api/forums/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: activeDiscussion.id,
          content: replyText.trim(),
          authorId: user?.id
        })
      });

      const result = await res.json();
      if (result.success && result.reply) {
        setReplies(prev => [...prev, result.reply]);
        setReplyText('');
        
        // Increment reply count in posts state
        setPosts(prev => prev.map(p => {
          if (p.id === activeDiscussion.id) {
            return {
              ...p,
              repliesCount: (p.repliesCount || 0) + 1
            };
          }
          return p;
        }));

        setActiveDiscussion(prev => prev ? ({
          ...prev,
          repliesCount: (prev.repliesCount || 0) + 1
        }) : null);
      }
    } catch (err) {
      console.error('Error posting reply:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Handle Like Toggle
  const handleToggleLike = async (postId: string) => {
    try {
      const res = await fetch('/api/forums/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          userId: user?.id
        })
      });

      const result = await res.json();
      if (result.success) {
        if (activeDiscussion && activeDiscussion.id === postId) {
          setActiveDiscussion(prev => prev ? ({
            ...prev,
            isLiked: result.isLiked,
            likesCount: result.likesCount
          }) : null);
        }

        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              isLiked: result.isLiked,
              likesCount: result.likesCount
            };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Handle Create Topic
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicData.forumId || !newTopicData.title.trim() || !newTopicData.content.trim() || isSubmittingTopic) return;
    setIsSubmittingTopic(true);

    try {
      const res = await fetch('/api/forums/create-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forumId: newTopicData.forumId,
          title: newTopicData.title.trim(),
          content: newTopicData.content.trim(),
          authorId: user?.id
        })
      });

      const result = await res.json();
      if (result.success && result.post) {
        const newPostItem: ForumPostItem = {
          ...result.post,
          repliesCount: 0,
          likesCount: 0,
          isLiked: false
        };

        setPosts(prev => [newPostItem, ...prev]);
        setIsNewTopicModalOpen(false);
        setNewTopicData({
          forumId: forums[0]?.id || '',
          title: '',
          content: ''
        });

        // Open newly created topic immediately
        handleOpenDiscussion(newPostItem);
      }
    } catch (err) {
      console.error('Error creating topic:', err);
    } finally {
      setIsSubmittingTopic(false);
    }
  };

  // Copy Permalink
  const handleCopyLink = (postId: string) => {
    const url = `${window.location.origin}/platform/forums?topic=${postId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filtered Posts Logic
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.forum_id !== selectedCategory) {
        return false;
      }
      // Tab filter
      if (activeTab === 'trending' && (p.repliesCount || 0) === 0 && (p.likesCount || 0) === 0) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesContent = p.content.toLowerCase().includes(q);
        const matchesAuthor = p.author?.full_name?.toLowerCase().includes(q);
        const matchesForum = p.forum?.title.toLowerCase().includes(q);
        return matchesTitle || matchesContent || matchesAuthor || matchesForum;
      }
      return true;
    });
  }, [posts, selectedCategory, activeTab, searchQuery]);

  // Helper for category badge styling - clean, minimal Apple-grade tags
  const getCategoryBadgeStyle = (title?: string) => {
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60';
  };

  // Helper for time format
  const formatTimeAgo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#070b14] text-slate-900 dark:text-white font-sans relative pb-20">
      
      {/* ============================================================ */}
      {/* ULTRA-SEXY FULL-WIDTH AMBIENT FORUMS HERO                     */}
      {/* ============================================================ */}
      <section className="w-full relative overflow-hidden border-b border-slate-200/90 dark:border-white/10 bg-gradient-to-br from-white via-slate-50/95 to-purple-50/50 dark:from-[#131b2e] dark:via-[#101627] dark:to-[#1e1333] shadow-xs">
        
        {/* Full-Bleed Ambient Lighting & Blueprint Grid */}
        <div className="pointer-events-none absolute left-1/2 -top-40 -translate-x-1/2 h-[500px] w-[720px] rounded-full bg-gradient-to-b from-[#5a32fa]/20 via-[#7c3aed]/10 to-transparent blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-[#ff2a5f]/10 via-purple-500/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-[360px] w-[360px] rounded-full bg-gradient-to-tl from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#5a32fa_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.035] dark:opacity-[0.07]" />

        <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-14 md:py-20 relative z-10 flex flex-col items-center justify-center text-center">
          
          {/* Centered Content Column */}
          <div className="max-w-3xl lg:max-w-4xl space-y-6 flex flex-col items-center text-center">
            
            {/* Top Pill Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#5a32fa]/30 bg-gradient-to-r from-[#5a32fa]/15 via-purple-500/10 to-transparent px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#5a32fa] dark:text-violet-300 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Global IP Practice Exchange
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                350+ Active Legal Debates
              </span>
            </div>

            {/* Sexy High-Impact Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] tracking-[-0.03em] text-slate-900 dark:text-white text-center max-w-3xl">
              Where IP leaders debate, advise &amp;{' '}
              <span className="relative inline-block bg-gradient-to-r from-[#5a32fa] via-[#9055ff] to-[#ff2a5f] bg-clip-text text-transparent">
                shape precedent.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg font-normal leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-center">
              Engage in high-stakes discussions on patent claim prosecution, UPC litigation tactics, AI inventorship, and in-house corporate transitions with verified IP peers worldwide.
            </p>

            {/* Value Props Chips */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                <ShieldCheck size={15} className="text-[#5a32fa]" />
                <span>100% Verified Counsel</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                <Globe2 size={15} className="text-cyan-500" />
                <span>Cross-Border Precedent</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                <MessageSquare size={15} className="text-purple-500" />
                <span>12 Practice Channels</span>
              </div>
            </div>

            {/* Interactive CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => setIsNewTopicModalOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#5a32fa] via-[#7c3aed] to-[#ff2a5f] hover:opacity-95 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all cursor-pointer group"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Start New Discussion</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('trending');
                  window.scrollTo({ top: 460, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200/90 dark:border-white/10 transition-all cursor-pointer shadow-2xs"
              >
                <TrendingUp size={16} className="text-amber-500" />
                <span>Explore Trending</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* FULL-WIDTH CONTENT BODY                                      */}
      {/* ============================================================ */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-10">

        {/* Categories / Channels Pills */}
        <div className="mb-6 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => {
                setSelectedCategory('all');
                if (activeTab === 'channels') setActiveTab('all');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span>All Discussions</span>
              <span className="text-[10px] font-semibold opacity-60">
                {posts.length}
              </span>
            </button>

            {forums.map((forum) => {
              const isSelected = selectedCategory === forum.id;
              const count = posts.filter(p => p.forum_id === forum.id).length;
              return (
                <button
                  key={forum.id}
                  onClick={() => {
                    setSelectedCategory(forum.id);
                    if (activeTab === 'channels') setActiveTab('all');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span>{forum.title}</span>
                  <span className="text-[10px] font-semibold opacity-60">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Apple-style Segmented View Switch & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-[#0f172a] rounded-xl border border-slate-200/70 dark:border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'trending'
                  ? 'bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp size={13} className={activeTab === 'trending' ? 'text-amber-500' : ''} />
              <span>Trending</span>
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'channels'
                  ? 'bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Categories
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, questions, or counsel..."
              className="w-full h-9 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-xl pl-9 pr-8 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Latham & Watkins Sponsored Placement */}
        <div className="mb-6">
          <AdSlot slotId="forums_banner" />
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="p-16 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#5a32fa] mb-3" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading forum discussions...</p>
          </div>
        ) : activeTab === 'channels' ? (
          /* ============================================================ */
          /* CATEGORIES OVERVIEW VIEW                                    */
          /* ============================================================ */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forums.map((forum) => {
              const channelPosts = posts.filter(p => p.forum_id === forum.id);
              const totalReplies = channelPosts.reduce((acc, p) => acc + (p.repliesCount || 0), 0);

              return (
                <div
                  key={forum.id}
                  onClick={() => {
                    setSelectedCategory(forum.id);
                    setActiveTab('all');
                  }}
                  className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800">
                        {forum.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MessageSquare size={12} /> {channelPosts.length} Topics
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-[#5a32fa] dark:group-hover:text-purple-400 transition-colors mb-1.5">
                      {forum.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {forum.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {totalReplies} community replies
                    </span>
                    <span className="text-xs font-medium text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                      Browse <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ============================================================ */
          /* DISCUSSIONS LIST VIEW                                        */
          /* ============================================================ */
          <div className="space-y-3.5">
            {filteredPosts.length === 0 ? (
              <div className="p-16 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 text-center">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <MessageSquare size={18} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">No discussions found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  Try clearing your search filters or start a new topic.
                </p>
                <button
                  onClick={() => setIsNewTopicModalOpen(true)}
                  className="py-2 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus size={14} /> Start a Topic
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isHot = (post.repliesCount || 0) >= 2 || (post.likesCount || 0) >= 3;

                return (
                  <div
                    key={post.id}
                    onClick={() => handleOpenDiscussion(post)}
                    className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c1220] border border-slate-200/90 dark:border-white/10 hover:border-[#5a32fa]/40 dark:hover:border-[#5a32fa]/50 shadow-xs hover:shadow-xl hover:shadow-[#5a32fa]/10 transition-all duration-200 cursor-pointer group"
                  >
                    {/* Top Meta Header: Author + Category + Time */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        {post.author?.avatar_url ? (
                          <img
                            src={post.author.avatar_url}
                            alt={post.author.full_name || 'Author'}
                            className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shrink-0 shadow-xs"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5a32fa]/20 to-purple-600/20 text-[#5a32fa] dark:text-purple-300 text-sm font-black flex items-center justify-center shrink-0 border border-[#5a32fa]/30 shadow-xs">
                            {(post.author?.full_name || 'U').charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-[#5a32fa] dark:group-hover:text-purple-400 transition-colors">
                              {post.author?.full_name || 'WIPA Member'}
                            </span>
                            {post.author?.is_wipa_recommended && (
                              <CheckCircle2 size={13} className="text-[#5a32fa] shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {post.author?.role || 'IP Practitioner'} {post.author?.company ? `· ${post.author.company}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Category Badge & Hot indicator */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isHot && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                            <TrendingUp size={12} /> Hot Topic
                          </span>
                        )}
                        <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-[#5a32fa]/10 text-[#5a32fa] dark:text-purple-300 border border-[#5a32fa]/20">
                          {post.forum?.title || 'General'}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                          {formatTimeAgo(post.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white group-hover:text-[#5a32fa] dark:group-hover:text-purple-400 transition-colors tracking-tight leading-snug mb-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal mb-4">
                      {post.content}
                    </p>

                    {/* Bottom Row: Metrics & Subtle CTA */}
                    <div className="pt-3.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-semibold hover:text-[#5a32fa] transition-colors">
                          <MessageCircle size={14} className="text-[#5a32fa]" />
                          <span>{post.repliesCount || 0} {post.repliesCount === 1 ? 'reply' : 'replies'}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-semibold">
                          <Heart size={14} className={post.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
                          <span>{post.likesCount || 0}</span>
                        </span>
                      </div>

                      <span className="text-xs font-bold text-[#5a32fa] dark:text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-all">
                        <span>Join Discussion</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* ACTIVE DISCUSSION SLIDE-OVER / MODAL (No Glassmorphism)     */}
      {/* ============================================================ */}
      {activeDiscussion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 animate-in fade-in duration-150">
          <div 
            className="w-full max-w-3xl rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 shrink-0 bg-white dark:bg-[#0f172a]">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800">
                    {activeDiscussion.forum?.title || 'General'}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-normal text-slate-400">
                    Posted {formatTimeAgo(activeDiscussion.created_at)}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {activeDiscussion.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveDiscussion(null)}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                title="Close discussion"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Discussion Body & Replies */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              
              {/* Author & Full Post Content */}
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4 mb-3.5">
                  <div className="flex items-center gap-2.5">
                    {activeDiscussion.author?.avatar_url ? (
                      <img
                        src={activeDiscussion.author.avatar_url}
                        alt={activeDiscussion.author.full_name || 'Author'}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                        {(activeDiscussion.author?.full_name || 'U').charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {activeDiscussion.author?.full_name || 'WIPA Member'}
                        </span>
                        {activeDiscussion.author?.is_wipa_recommended && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {activeDiscussion.author?.role || 'IP Professional'} {activeDiscussion.author?.company ? `· ${activeDiscussion.author.company}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Full Question / Query Content */}
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {activeDiscussion.content}
                </p>

                {/* Podcast Banner if attached */}
                {activeDiscussion.podcast && (
                  <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 dark:text-purple-300">
                      <span>Featured Podcast: {activeDiscussion.podcast.title}</span>
                    </div>
                    <Link
                      href={`/platform/resources/podcasts-conversations/${activeDiscussion.podcast.id}`}
                      className="px-3 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-semibold hover:opacity-90 transition-opacity shrink-0"
                    >
                      Listen
                    </Link>
                  </div>
                )}

                {/* Post Action Bar */}
                <div className="mt-4 pt-3.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleLike(activeDiscussion.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                        activeDiscussion.isLiked
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Heart size={13} className={activeDiscussion.isLiked ? 'fill-current text-rose-500' : ''} />
                      <span>{activeDiscussion.likesCount || 0} Likes</span>
                    </button>

                    <button
                      onClick={() => handleCopyLink(activeDiscussion.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 cursor-pointer transition-colors"
                    >
                      {copiedLink ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
                      <span>{copiedLink ? 'Copied' : 'Share'}</span>
                    </button>
                  </div>

                  <span className="text-xs text-slate-400">
                    {replies.length} {replies.length === 1 ? 'Response' : 'Responses'}
                  </span>
                </div>
              </div>

              {/* Replies Thread */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 mb-3.5">
                  Discussion Thread ({replies.length})
                </h3>

                {isFetchingReplies ? (
                  <div className="p-8 text-center">
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#5a32fa] mb-2" />
                    <p className="text-xs text-slate-400">Loading replies...</p>
                  </div>
                ) : replies.length === 0 ? (
                  <div className="p-8 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-dashed border-slate-200 dark:border-slate-800 text-center">
                    <MessageSquare size={20} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">No responses yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Be the first to share your perspective or practical experience.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {replies.map((r) => (
                      <div
                        key={r.id}
                        className="p-4 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800 shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {r.author?.avatar_url ? (
                              <img
                                src={r.author.avatar_url}
                                alt={r.author.full_name || 'Author'}
                                className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center">
                                {(r.author?.full_name || 'U').charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                  {r.author?.full_name || 'WIPA Practitioner'}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {r.author?.role || 'IP Professional'} {r.author?.company ? `· ${r.author.company}` : ''}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] text-slate-400 font-normal">
                            {formatTimeAgo(r.created_at)}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-8">
                          {r.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Reply Input Bar */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] shrink-0">
              <form onSubmit={handleReplySubmit} className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-0.5">
                  <span className="font-medium">Leave a response</span>
                  <span>Responding as <strong className="text-slate-900 dark:text-white font-semibold">{user?.name || 'WIPA Member'}</strong></span>
                </div>

                <div className="relative">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Share your practical experience, case law precedent, or strategy advice..."
                    rows={3}
                    className="w-full rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 p-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors resize-none shadow-xs"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-400">
                    Responses are shared directly with community counsel.
                  </p>
                  <button
                    type="submit"
                    disabled={!replyText.trim() || isSubmittingReply}
                    className="py-2 px-5 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    {isSubmittingReply ? (
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Send size={12} />
                    )}
                    <span>{isSubmittingReply ? 'Posting...' : 'Post Reply'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* NEW TOPIC CREATION MODAL (No Glassmorphism)                  */}
      {/* ============================================================ */}
      {isNewTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150">
          <div 
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5a32fa] dark:text-purple-400">
                  New Discussion
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Start a Forum Topic
                </h2>
              </div>
              <button
                onClick={() => setIsNewTopicModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Channel / Category
                </label>
                <select
                  value={newTopicData.forumId}
                  onChange={(e) => setNewTopicData(prev => ({ ...prev, forumId: e.target.value }))}
                  required
                  className="w-full bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-slate-400 dark:focus:border-slate-600"
                >
                  {forums.map((f) => (
                    <option key={f.id} value={f.id} className="bg-white dark:bg-[#0f172a]">
                      {f.title} ({f.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  required
                  value={newTopicData.title}
                  onChange={(e) => setNewTopicData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Best practices for responding to 35 U.S.C. § 101 rejections..."
                  className="w-full bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Discussion Context
                </label>
                <textarea
                  required
                  rows={4}
                  value={newTopicData.content}
                  onChange={(e) => setNewTopicData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Provide background, legal issues, or specific questions for community practitioners..."
                  className="w-full bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewTopicModalOpen(false)}
                  className="py-2 px-4 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTopic || !newTopicData.title.trim() || !newTopicData.content.trim()}
                  className="py-2 px-5 rounded-full bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  {isSubmittingTopic ? (
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Plus size={14} />
                  )}
                  <span>{isSubmittingTopic ? 'Publishing...' : 'Publish Discussion'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ForumsPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#070b14] flex items-center justify-center font-bold text-slate-500">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#5a32fa] mr-3" />
        <span>Loading Community Forums...</span>
      </div>
    }>
      <ForumsPageContent />
    </React.Suspense>
  );
}
