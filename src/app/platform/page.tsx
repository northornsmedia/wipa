'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { useAppStore } from '@/store/useAppStore';
import { 
  Search, Bell, LayoutGrid, BookOpen, Calendar, Users, Info, Settings, 
  Hash, BellOff, ArrowUpRight, CheckCircle2, Circle, Image as ImageIcon, Video, Smile,
  Bookmark, MoreVertical, Heart, MessageCircle, Gift, LogOut, Pencil, Copy, MessageSquareOff, Trash2, Globe, Lock, Shield,
  FileText, PlayCircle, Plus, Send, X, Mail, ThumbsUp, UsersRound, MessageSquare, Briefcase, GraduationCap, Home, Star, Paperclip,
  Share2, Repeat2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdSlot from '@/components/AdSlot';
import FeedStoriesCarousel from '@/components/FeedStoriesCarousel';
import MobileCommentDrawer from '@/components/MobileCommentDrawer';
import ProgressiveFeedImage from '@/components/ProgressiveFeedImage';
import FeedShareSheet from '@/components/FeedShareSheet';
import FeedQuickComposer from '@/components/FeedQuickComposer';
import FormattedPostText, { getPostPreview } from '@/components/FormattedPostText';
import { optimizeFeedUpload, readCachedFeed, writeCachedFeed } from '@/lib/feedPerformance';
import { recordPostImpressions } from '@/lib/analytics';

const FEED_PAGE_SIZE = 8;

export default function PlatformPage() {
  const { user, posts, likedPostIds, toggleLike, setUser, isDarkMode, isCreatePostOpen, setIsCreatePostOpen } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams?.get('tag') || searchParams?.get('hashtag') || null;
  const [activeTab, setActiveTab] = useState('Latest');
  const [feedSearchQuery, setFeedSearchQuery] = useState('');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const isModalOpen = isCreatePostModalOpen || isCreatePostOpen;
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [postPrivacy, setPostPrivacy] = useState<'Anyone' | 'Followers only'>('Anyone');
  const [isPrivacyDropdownOpen, setIsPrivacyDropdownOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [postContent, setPostContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [feedPosts, setFeedPosts] = useState<any[]>(() => (useAppStore.getState().cachedFeedPosts || []).slice(0, FEED_PAGE_SIZE));
  const [isLoadingFeed, setIsLoadingFeed] = useState(() => !(useAppStore.getState().cachedFeedPosts?.length > 0));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isLoadingMoreRef = useRef(false);
  const [hasMoreFeed, setHasMoreFeed] = useState(true);
  const feedCursorRef = useRef<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [dbLikedPostIds, setDbLikedPostIds] = useState<Set<string>>(new Set());
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [activeCommentPost, setActiveCommentPost] = useState<any | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isDesktopViewport, setIsDesktopViewport] = useState<boolean | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [postComments, setPostComments] = useState<Record<string, any[]>>({});
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isUpdatingPost, setIsUpdatingPost] = useState(false);
  const [isIpWisdomModalOpen, setIsIpWisdomModalOpen] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const [sharePost, setSharePost] = useState<any | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [userBusiness, setUserBusiness] = useState<any>(null);
  const [postAsId, setPostAsId] = useState<string>('user'); // 'user' or business.id
  const [trendingForums, setTrendingForums] = useState<any[]>([]);
  const [animatingHeartPostIds, setAnimatingHeartPostIds] = useState<Set<string>>(new Set());
  const lastTapMapRef = useRef<Record<string, number>>({});
  const [pullDistance, setPullDistance] = useState(0);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const pullStartRef = useRef({ x: 0, y: 0, active: false });
  const pullDistanceRef = useRef(0);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const syncViewport = () => setIsDesktopViewport(media.matches);
    syncViewport();
    media.addEventListener('change', syncViewport);
    return () => media.removeEventListener('change', syncViewport);
  }, []);

  const handlePostDoubleTap = (postId: string, event: React.MouseEvent<HTMLElement>) => {
    if (!user) return;
    // Editing, selecting text, or double-clicking any control must never count as a post like.
    if (editingPost?.id === postId) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, a, input, textarea, select, label, video, [contenteditable="true"], [data-no-double-like]')) return;
    if (typeof window !== 'undefined' && window.getSelection()?.toString()) return;
    const now = Date.now();
    const lastTap = lastTapMapRef.current[postId] || 0;

    if (now - lastTap < 380) {
      // Double tap detected!
      lastTapMapRef.current[postId] = 0;

      // Haptic vibration feedback on touch devices
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([35, 25, 35]);
      }

      // 1. Auto-like if not already liked (Double tap NEVER unlikes)
      if (!dbLikedPostIds.has(postId)) {
        const newLiked = new Set(dbLikedPostIds);
        newLiked.add(postId);
        setDbLikedPostIds(newLiked);
        setFeedPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p));
        supabase.from('feed_likes').insert({ post_id: postId, user_id: user.id }).then();
      }

      // 2. Trigger Big Heart Animation overlay
      setAnimatingHeartPostIds(prev => new Set(prev).add(postId));
      setTimeout(() => {
        setAnimatingHeartPostIds(prev => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      }, 950);
    } else {
      lastTapMapRef.current[postId] = now;
    }
  };

  const toggleExpandPost = (postId: string) => {
    setExpandedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    const storageKey = `wipa_saved_posts_${user.id}`;
    let localIds: string[] = [];
    try {
      localIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!cancelled) setSavedPostIds(new Set(localIds.map(String)));
    } catch {}

    const hydrateSavedPosts = async () => {
      const { data, error } = await supabase
        .from('saved_posts')
        .select('post_id')
        .eq('user_id', user.id);
      if (cancelled || error || !data) return;
      const merged = [...new Set([...localIds.map(String), ...data.map((row: any) => String(row.post_id))])];
      setSavedPostIds(new Set(merged));
      localStorage.setItem(storageKey, JSON.stringify(merged));
    };
    void hydrateSavedPosts();
    return () => { cancelled = true; };
  }, [user?.id]);

  const handleToggleSavePost = async (postId: string) => {
    if (!user?.id) return;
    const normalizedId = String(postId);
    const wasSaved = savedPostIds.has(normalizedId);
    const next = new Set(savedPostIds);
    if (wasSaved) next.delete(normalizedId);
    else next.add(normalizedId);
    setSavedPostIds(next);
    localStorage.setItem(`wipa_saved_posts_${user.id}`, JSON.stringify([...next]));
    if (navigator.vibrate) navigator.vibrate(18);

    const { error } = wasSaved
      ? await supabase.from('saved_posts').delete().match({ user_id: user.id, post_id: normalizedId })
      : await supabase.from('saved_posts').upsert(
          { user_id: user.id, post_id: normalizedId },
          { onConflict: 'user_id,post_id', ignoreDuplicates: true }
        );

    // Local persistence keeps Save functional during a transient outage or before a migration reaches production.
    if (error) console.warn('Saved post will sync when database persistence is available:', error.message);
  };
  
  const fetchFeed = useCallback(async (append = false) => {
    if (append && isLoadingMoreRef.current) return;
    if (append) {
      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);
    }
    else setIsLoadingFeed((current) => current);

    try {
      let query = supabase
        .from('feed_posts')
        .select(`
          id, author_id, content, media_urls, media_type, document_name, privacy,
          likes_count, comments_count, comments_disabled, created_at, group_id, post_to_feed,
          author:profiles!feed_posts_author_id_fkey(full_name, avatar_url, practice_area, created_at, is_wipa_recommended)
        `)
        .or('group_id.is.null,post_to_feed.eq.true')
        .order('created_at', { ascending: false })
        .limit(FEED_PAGE_SIZE);

      if (append && feedCursorRef.current) query = query.lt('created_at', feedCursorRef.current);
      const { data, error } = await query;

      if (data && Array.isArray(data)) {
        const nextPage = data;
        feedCursorRef.current = nextPage.length ? nextPage[nextPage.length - 1].created_at : feedCursorRef.current;
        setHasMoreFeed(nextPage.length === FEED_PAGE_SIZE);
        setFeedPosts((current) => {
          const merged = append
            ? [...current, ...nextPage.filter((post) => !current.some((existing) => existing.id === post.id))]
            : nextPage;
          queueMicrotask(() => {
            useAppStore.getState().setCachedFeedPosts(merged.slice(0, FEED_PAGE_SIZE));
            void writeCachedFeed(merged);
          });
          return merged;
        });

        if (nextPage.length) {
          const impressions = nextPage
            .filter((p: any) => p.id && p.author_id)
            .map((p: any) => ({ postId: p.id, authorId: p.author_id }));
          void recordPostImpressions(impressions, user?.id);
        }

        if (user?.id && nextPage.length) {
          const { data: likesData } = await supabase
            .from('feed_likes')
            .select('post_id')
            .eq('user_id', user.id)
            .in('post_id', nextPage.map((post) => post.id));
          if (likesData) {
            setDbLikedPostIds((current) => new Set([...current, ...likesData.map((like) => like.post_id)]));
          }
        }
      }
      if (error) {
        console.error("Error fetching feed:", error);
      }
    } catch (err) {
      console.error("Feed error:", err);
    }

    if (!append) {
      const { data: trendingData } = await supabase
        .from('forum_posts')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
      if (trendingData) setTrendingForums(trendingData);
    }

    setIsLoadingFeed(false);
    isLoadingMoreRef.current = false;
    setIsLoadingMore(false);
  }, [user?.id]);

  const refreshFeedFromPull = useCallback(async () => {
    if (isPullRefreshing) return;
    setIsPullRefreshing(true);
    setPullDistance(58);
    pullDistanceRef.current = 58;
    feedCursorRef.current = null;
    setHasMoreFeed(true);
    if (navigator.vibrate) navigator.vibrate(25);

    await Promise.all([
      fetchFeed(false),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ]);

    setIsPullRefreshing(false);
    setPullDistance(0);
    pullDistanceRef.current = 0;
  }, [fetchFeed, isPullRefreshing]);

  const handlePullStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (isPullRefreshing || isModalOpen || window.innerWidth >= 768) return;
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
    let scrollParent: HTMLElement | null = target;
    while (scrollParent && scrollParent !== document.body) {
      const style = window.getComputedStyle(scrollParent);
      const canScroll = /(auto|scroll)/.test(style.overflowY) && scrollParent.scrollHeight > scrollParent.clientHeight + 2;
      if (canScroll && scrollParent.scrollTop > 1) return;
      scrollParent = scrollParent.parentElement;
    }
    if (Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop) > 1) return;
    const touch = event.touches[0];
    pullStartRef.current = { x: touch.clientX, y: touch.clientY, active: true };
  };

  const handlePullMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!pullStartRef.current.active || isPullRefreshing) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - pullStartRef.current.x;
    const deltaY = touch.clientY - pullStartRef.current.y;

    if (deltaY <= 0 || Math.abs(deltaX) > deltaY || Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop) > 1) {
      pullStartRef.current.active = false;
      setPullDistance(0);
      pullDistanceRef.current = 0;
      return;
    }

    if (event.cancelable) event.preventDefault();
    const resistedDistance = Math.min(104, deltaY * 0.42);
    pullDistanceRef.current = resistedDistance;
    setPullDistance(resistedDistance);
  };

  const handlePullEnd = () => {
    if (!pullStartRef.current.active) return;
    pullStartRef.current.active = false;
    if (pullDistanceRef.current >= 68) {
      void refreshFeedFromPull();
    } else {
      pullDistanceRef.current = 0;
      setPullDistance(0);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const hydrateThenRefresh = async () => {
      if (feedPosts.length === 0) {
        const cached = await readCachedFeed<any>();
        if (!cancelled && cached.length) {
          setFeedPosts(cached);
          setIsLoadingFeed(false);
        }
      }
      if (!cancelled) await fetchFeed(false);
    };
    void hydrateThenRefresh();
    
    // Fetch business profile if exists
    const fetchBusiness = async () => {
      if (user?.business_profile_id) {
        const { data } = await supabase.from('business_profiles').select('id, name, logo_url').eq('id', user.business_profile_id).single();
        if (data) setUserBusiness(data);
      }
    };
    fetchBusiness();
    return () => { cancelled = true; };
  }, [fetchFeed, user?.business_profile_id]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMoreFeed || isLoadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void fetchFeed(true);
      },
      { rootMargin: '700px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchFeed, feedPosts.length, hasMoreFeed, isLoadingMore]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen && !isClosingModal) {
        setIsClosingModal(true);
        setTimeout(() => {
          setIsCreatePostModalOpen(false);
          setIsCreatePostOpen(false);
          setPublishSuccess(false);
          setPostContent('');
          setUploadError(null);
          setIsClosingModal(false);
        }, 200);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isClosingModal, setIsCreatePostOpen]);
  
  const [attachedMedia, setAttachedMedia] = useState<{
    file: File;
    previewUrl: string;
    type: 'image' | 'video' | 'doc';
    name: string;
    size?: string;
  } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'doc') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = type === 'doc' ? '' : URL.createObjectURL(file);
    const sizeInKb = (file.size / 1024).toFixed(1) + ' KB';
    setAttachedMedia({
      file,
      previewUrl,
      type,
      name: file.name,
      size: sizeInKb
    });
    setUploadError(null);
  };

  const handleCloseModal = () => {
    if (isClosingModal) return;
    setIsClosingModal(true);
    setTimeout(() => {
      setIsCreatePostModalOpen(false);
      setIsCreatePostOpen(false);
      setPublishSuccess(false);
      setPostContent('');
      setAttachedMedia(null);
      setShowEmojiPicker(false);
      setUploadError(null);
      setIsClosingModal(false);
    }, 200);
  };
  
  const handlePublish = async () => {
    if (!postContent.trim() && !attachedMedia) return;
    if (!user) {
      alert("You must be logged in to post!");
      return;
    }
    
    setIsPublishing(true);
    setUploadError(null);
    
    const authorId = postAsId === 'user' ? user.id : postAsId;
    let mediaUrls: string[] = [];
    let mediaType = attachedMedia?.type || null;
    let docName = attachedMedia?.name || null;

    try {
      if (attachedMedia?.file) {
        const uploadFile = attachedMedia.type === 'image'
          ? await optimizeFeedUpload(attachedMedia.file)
          : attachedMedia.file;
        const safeName = uploadFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${authorId}/${Date.now()}-${safeName}`;
        const { error: uploadErr } = await supabase.storage
          .from('feed-media')
          .upload(fileName, uploadFile, {
            upsert: false,
            cacheControl: '31536000, public, immutable',
            contentType: uploadFile.type || undefined,
          });

        if (uploadErr) {
          console.error("Storage upload error:", uploadErr);
          setUploadError('Failed to upload attachment: ' + uploadErr.message);
          setIsPublishing(false);
          return;
        }

        const { data: urlData } = supabase.storage.from('feed-media').getPublicUrl(fileName);
        if (urlData?.publicUrl) {
          mediaUrls = [urlData.publicUrl];
        }
      }

      const { error } = await supabase.from('feed_posts').insert({
        author_id: authorId,
        content: postContent,
        privacy: postPrivacy,
        media_urls: mediaUrls,
        media_type: mediaType,
        document_name: docName
      });
      
      setIsPublishing(false);
      
      if (error) {
        setUploadError('Failed to publish post: ' + error.message);
        return;
      }
      
      // Award XP
      try {
        await fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: authorId,
            xpAmount: 25,
            reason: 'First Post',
            referenceId: null
          })
        });
      } catch (e) {
        console.error("Failed to award XP:", e);
      }
      
      setPublishSuccess(true);
      setPostContent('');
      setAttachedMedia(null);
      setShowEmojiPicker(false);
      setUploadError(null);
      fetchFeed();
    } catch (err: any) {
      console.error("Error publishing post:", err);
      setUploadError(err.message || 'An error occurred while publishing.');
      setIsPublishing(false);
    }
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
      .select('*, author:profiles!feed_comments_author_id_fkey(full_name, avatar_url, is_wipa_recommended)')
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
    setCommentError('');
    const content = commentText.trim();
    const commentId = crypto.randomUUID();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      setIsSubmittingComment(false);
      setCommentError('Your session expired. Please sign in again.');
      return;
    }

    let result: any = null;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      result = await supabase.from('feed_comments').insert({
        id: commentId,
        post_id: postId,
        author_id: session.user.id,
        content
      }).select('*, author:profiles!feed_comments_author_id_fkey(full_name, avatar_url, is_wipa_recommended)').single();
      if (!result.error || result.error.code === '23505') break;
      const transient = /load failed|failed to fetch|network|connection/i.test(result.error.message || '');
      if (!transient || attempt === 3) break;
      await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
    }
    
    setIsSubmittingComment(false);
    
    if (result?.error && result.error.code !== '23505') {
      console.error("Failed to post comment:", result.error);
      setCommentError('Comment was not posted. Please tap send to try again.');
      return;
    }

    setCommentText('');
    if (result?.data) {
      setPostComments((previous) => ({ ...previous, [postId]: [...(previous[postId] || []), result.data] }));
      setFeedPosts((previous) => previous.map((post) => post.id === postId ? { ...post, comments_count: (post.comments_count || 0) + 1 } : post));
    } else {
      await fetchComments(postId);
    }
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
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  const normalizedTag = selectedTag ? selectedTag.toLowerCase() : null;
  const normalizedFeedSearch = feedSearchQuery.trim().toLowerCase();
  
  const visibleFeedPosts = feedPosts.filter((post) => {
    const author = post.author || {};
    
    // Tag filter
    if (normalizedTag) {
      const content = String(post.content || '').toLowerCase();
      if (!content.includes(`#${normalizedTag}`) && !content.includes(normalizedTag)) {
        return false;
      }
    }

    // Text search query
    if (normalizedFeedSearch) {
      const matchesSearch = [post.content, author.full_name, author.practice_area]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedFeedSearch));
      if (!matchesSearch) return false;
    }

    return true;
  });

  return (
    <div
      className="relative w-full max-w-full font-sans flex flex-col min-h-screen overflow-x-clip overscroll-y-contain"
      onTouchStart={handlePullStart}
      onTouchMove={handlePullMove}
      onTouchEnd={handlePullEnd}
      onTouchCancel={handlePullEnd}
    >
      <div
        aria-hidden={pullDistance === 0 && !isPullRefreshing}
        className="pointer-events-none fixed left-1/2 top-[max(14px,env(safe-area-inset-top))] z-[70] md:hidden"
        style={{
          opacity: Math.min(1, pullDistance / 34),
          transform: `translate3d(-50%, ${Math.max(-52, pullDistance - 52)}px, 0) scale(${Math.min(1, 0.72 + pullDistance / 240)})`,
          transition: pullStartRef.current.active ? 'none' : 'transform 240ms cubic-bezier(.2,.8,.2,1), opacity 180ms ease',
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/95 shadow-[0_5px_20px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95">
          <Loader2
            size={20}
            className={`text-[#6600FF] ${isPullRefreshing ? 'animate-spin' : ''}`}
            style={!isPullRefreshing ? { transform: `rotate(${Math.min(300, pullDistance * 4)}deg)` } : undefined}
          />
        </div>
      </div>
      <div className="w-full max-w-full bg-white dark:bg-[#0f172a] flex flex-col flex-1 min-w-0">
        
        {/* MAIN LAYOUT */}
        <div className="flex flex-1 w-full max-w-full min-w-0">
          
          {/* MAIN CONTENT AREA */}
          <main className="flex-1 w-full max-w-full min-w-0 bg-[#f8f9fa] dark:bg-[#070b14] md:bg-slate-50/50 md:dark:bg-[#0b1120] p-0 sm:p-6 md:p-8 flex flex-col xl:flex-row gap-0 xl:gap-8 items-start">
            
            {/* LEFT COLUMN */}
            <div className="flex-1 w-full max-w-full min-w-0 flex justify-center pb-36 sm:pb-24 md:pb-20 box-border">
              <div className="w-full max-w-full sm:max-w-4xl min-w-0 space-y-0 sm:space-y-6 box-border">

              {/* MOBILE INSTAGRAM-STYLE STORIES & SUB-HEADER (MOBILE ONLY) */}
              <div className="md:hidden w-full max-w-full overflow-hidden bg-gradient-to-b from-[#b6e0fe]/30 via-[#dbeafe]/15 to-transparent px-2.5 pt-1 pb-2 border-0 border-none shadow-none">
                {/* 1. Stories Carousel */}
                <FeedStoriesCarousel onOpenCreatePost={() => setIsCreatePostModalOpen(true)} />
              </div>
              
              {/* DESKTOP PREMIUM HERO BANNER (DESKTOP ONLY) */}
              <div className="hidden md:block relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] dark:from-[#0a0a0f] dark:to-[#12121a] p-6 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/50 dark:border-white/5 group">
                {/* Animated Mesh Background */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                   <div className="absolute -top-[50%] -right-[20%] w-[80%] h-[200%] bg-gradient-to-br from-[#5a32fa] to-[#ff90e8] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-20 dark:opacity-30 animate-[spin_20s_linear_infinite] transform-gpu"></div>
                   <div className="absolute -bottom-[50%] -left-[20%] w-[80%] h-[200%] bg-gradient-to-br from-[#00d26a] to-[#00b8ff] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-20 dark:opacity-30 animate-[spin_25s_linear_infinite_reverse] transform-gpu"></div>
                                   {/* Glassmorphic Grain Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('/patterns/stardust.png')] z-0 mix-blend-overlay"></div>
                 </div>
                
                {/* IP Wisdom Card - Top Right (9:16 Thumbnail) */}
                <div 
                  onClick={() => setIsIpWisdomModalOpen(true)}
                  className="hidden sm:block absolute top-6 right-6 sm:top-8 sm:right-8 z-20 w-[120px] aspect-[9/16] rounded-[1.5rem] overflow-hidden cursor-pointer group shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/40 dark:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(90,50,250,0.3)] hover:border-[#ff90e8]/50"
                >
                  {/* Thumbnail Image */}
                  <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400&h=700" alt="IP Wisdom Insight" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Sleek Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-[#0a0a0a]/90"></div>
                  <div className="absolute inset-0 bg-[#5a32fa]/10 mix-blend-overlay group-hover:bg-[#5a32fa]/0 transition-colors duration-500"></div>
                  
                  {/* Glowing Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.2)] group-hover:bg-white/30 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-all duration-300">
                      <PlayCircle className="text-white relative z-10" size={26} strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  {/* Text Container at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-center">
                    <span className="bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] text-white px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-1.5 shadow-sm transform group-hover:-translate-y-0.5 transition-transform duration-300">
                      IP Wisdom
                    </span>
                    <p className="text-[14px] font-black text-white leading-tight drop-shadow-md text-center group-hover:text-[#ff90e8] transition-colors">Daily Insight</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="lg:w-[70%]">
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-2 leading-[1.1] transition-transform duration-500 group-hover:scale-[1.01] origin-left">
                      Hello{user?.name ? ` ${user.name}` : ''},<br/>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5a32fa] via-[#ff90e8] to-[#5a32fa] animate-gradient bg-[length:200%_auto]">Welcome to WIPA</span>
                    </h1>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 tracking-tight">Building the Future of Innovation Together</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-4 sm:w-5/6 font-medium">
                      Connect with innovators, IP professionals, founders, researchers, and investors to share knowledge, collaborate, and turn ideas into impact.
                    </p>
                  </div>
                </div>
                
                {/* Premium iOS-style Segmented Tabs & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 relative z-10">
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
                    {['Latest', 'Trending', 'Following', 'Saved'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-6 py-2.5 text-sm font-bold transition-all duration-300 ease-out whitespace-nowrap rounded-xl z-10 ${
                          activeTab === tab 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                      >
                        {activeTab === tab && (
                          <div className="absolute inset-0 bg-white dark:bg-[#1e293b] rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.4)] border border-black/5 dark:border-white/5 -z-10 animate-in zoom-in-95 duration-200" />
                        )}
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="relative shrink-0 group/search">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] rounded-2xl blur opacity-0 group-hover/search:opacity-20 transition-opacity duration-500"></div>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    <input 
                      type="text" 
                      placeholder="Search feeds..." 
                      value={feedSearchQuery}
                      onChange={(event) => setFeedSearchQuery(event.target.value)}
                      className="relative z-10 pl-11 pr-5 py-3 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/50 focus:border-transparent transition-all shadow-sm font-medium placeholder:text-gray-400" 
                    />
                  </div>
                </div>
              </div>

              {/* DESKTOP ENHANCED COMPOSER */}
              <FeedQuickComposer user={user} />

              {/* DESKTOP STORIES (DESKTOP ONLY) */}
              <div className="hidden md:block">
                <FeedStoriesCarousel onOpenCreatePost={() => router.push('/platform/create-post')} />
              </div>

              {/* FEED */}
              <div className="space-y-0 sm:space-y-4">
                {/* Active Hashtag Filter Banner */}
                {selectedTag && (
                  <div className="flex items-center justify-between p-3.5 sm:p-4 mb-3 sm:mb-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-[#5a32fa] dark:text-purple-300 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#5a32fa] text-white shadow-xs">
                        <Hash size={16} />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block">Filtered by Hashtag</span>
                        <span className="text-sm font-black text-gray-900 dark:text-white">#{selectedTag}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/platform')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-xs cursor-pointer"
                    >
                      <X size={14} /> Clear filter
                    </button>
                  </div>
                )}

                {isLoadingFeed ? (
                  <div className="flex items-center justify-center py-20 text-gray-400">
                    <Loader2 size={32} className="animate-spin text-[#5a32fa]" />
                  </div>
                ) : feedPosts.length === 0 ? (
                  <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-10 text-center border border-gray-100 dark:border-white/10">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No posts yet. Be the first to share something!</p>
                  </div>
                ) : visibleFeedPosts.length === 0 ? (
                  <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-10 text-center border border-gray-100 dark:border-white/10">
                    <Search size={28} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-bold text-gray-500">
                      {selectedTag 
                        ? `No posts found tagged with #${selectedTag}` 
                        : `No feed posts match “${feedSearchQuery}”`}
                    </p>
                  </div>
                ) : visibleFeedPosts.map((post, index) => {
                  const isLiked = dbLikedPostIds.has(post.id);
                  const author = post.author || {};
                  const authorName = author.full_name || 'Anonymous User';
                  const initial = authorName.charAt(0).toUpperCase();
                  const timeAgo = formatDistanceToNow(parseISO(post.created_at), { addSuffix: true });
                  const isExpanded = expandedPosts.has(post.id);
                  const { preview, hasMore } = getPostPreview(post.content || '');
                  const displayContent = isExpanded ? (post.content || '') : preview;
                    
                  return (
                    <React.Fragment key={post.id}>
                    <div 
                      onClick={(event) => handlePostDoubleTap(post.id, event)}
                      className="w-full max-w-full min-w-0 bg-white dark:bg-[#0b0f19] sm:bg-white sm:dark:bg-[#151c2c] rounded-none sm:rounded-2xl md:rounded-[2rem] border-b first:border-t-0 sm:border border-gray-100/60 dark:border-white/[0.06] sm:border-gray-200/80 sm:dark:border-gray-800/80 px-4 py-4 sm:p-6 mb-0 sm:mb-4 shadow-none sm:shadow-[0_4px_20px_rgb(0,0,0,0.03)] sm:dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all box-border relative overflow-hidden select-none"
                    >
                      {/* Sleek Minimal Double-Tap Heart Animation */}
                      {animatingHeartPostIds.has(post.id) && (
                        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center animate-in zoom-in-50 duration-150">
                          <div className="relative flex items-center justify-center">
                            <div className="absolute w-16 h-16 bg-rose-500/60 rounded-full blur-xl animate-ping"></div>
                            <Heart 
                              size={48} 
                              className="fill-rose-500 text-white drop-shadow-md scale-110 transform transition-transform duration-200"
                            />
                          </div>
                        </div>
                      )}

                      {/* Post Header */}
                      <div className="w-full max-w-full min-w-0 flex items-center justify-between mb-3 box-border">
                        <div className="flex items-center gap-2.5">
                          <Link href={`/platform/profile/${post.author_id}`} className="shrink-0 hover:opacity-80 transition-opacity block">
                            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15 bg-slate-800">
                              {author.avatar_url ? (
                                <img src={author.avatar_url} alt={authorName} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" className="block h-full w-full rounded-full object-cover object-center" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                                  {initial}
                                </div>
                              )}
                            </div>
                          </Link>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <Link href={`/platform/profile/${post.author_id}`} className="hover:underline hover:text-[#5a32fa] transition-colors flex items-center gap-1">
                                <span className="font-bold text-[13px] sm:text-[14px] text-gray-900 dark:text-white leading-tight">{authorName}</span>
                                {author.is_wipa_recommended && (
                                  <span title="WIPA Recommended">
                                    <Star size={12} className="fill-yellow-400 text-yellow-400 shrink-0" />
                                  </span>
                                )}
                              </Link>
                            </div>
                            <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              {timeAgo}
                              <span>•</span>
                              <span className="truncate max-w-[140px] sm:max-w-none capitalize">{author.practice_area || 'IP Professional'}</span>
                            </span>
                          </div>
                        </div>

                        {/* More Post Options Menu */}
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {activeMenuPostId === post.id && (
                            <div className="absolute right-0 top-7 w-44 bg-white dark:bg-[#1f293d] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                              <button 
                                onClick={() => handleCopyLink(post.id)}
                                className="w-full px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                              >
                                <Copy size={13} /> Copy Link
                              </button>
                              {user?.id === post.author_id && (
                                <>
                                  <button 
                                    onClick={() => {
                                      setActiveMenuPostId(null);
                                      setEditingPost(post);
                                      setEditContent(post.content);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                                  >
                                    <Pencil size={13} /> Edit Post
                                  </button>
                                  <button 
                                    onClick={() => handleToggleComments(post.id, post.comments_disabled)}
                                    className="w-full px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                                  >
                                    <MessageSquareOff size={13} /> {post.comments_disabled ? 'Enable Comments' : 'Disable Comments'}
                                  </button>
                                  <button 
                                    onClick={() => handleDeletePost(post.id)}
                                    className="w-full px-3 py-2 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
                                  >
                                    <Trash2 size={13} /> Delete Post
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* LinkedIn-Style Post Text (ABOVE the Media) */}
                      {editingPost?.id === post.id ? (
                        <div className="space-y-2 mb-3 px-3 sm:px-0">
                          <textarea 
                            value={editContent} 
                            onChange={(e) => setEditContent(e.target.value)}
                            onFocus={(e) => {
                              e.currentTarget.style.height = 'auto';
                              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                            }}
                            onInput={(e) => {
                              e.currentTarget.style.height = 'auto';
                              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                            }}
                            className="min-h-[180px] w-full select-text overflow-hidden p-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm sm:text-[15px] leading-relaxed text-gray-900 dark:text-white outline-none resize-none [field-sizing:content]"
                            rows={7}
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingPost(null)} className="px-3 py-1 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
                            <button onClick={submitEditPost} disabled={isUpdatingPost} className="px-3.5 py-1 rounded-lg text-xs font-bold bg-[#5a32fa] text-white">Save</button>
                          </div>
                        </div>
                      ) : (
                        post.content && (
                          <div className="mb-2.5">
                            <div className="text-[13px] sm:text-[14px] text-gray-900 dark:text-gray-100 leading-relaxed font-normal inline">
                              <FormattedPostText text={displayContent} />
                              {hasMore && !isExpanded && (
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpandPost(post.id);
                                  }} 
                                  className="inline text-gray-500 hover:text-[#5a32fa] dark:text-gray-400 dark:hover:text-[#ff90e8] font-bold text-xs ml-1 cursor-pointer transition-colors"
                                >
                                  ...read more
                                </button>
                              )}
                            </div>
                            {hasMore && isExpanded && (
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpandPost(post.id);
                                }} 
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-medium mt-1.5 block cursor-pointer"
                              >
                                Show less
                              </button>
                            )}
                          </div>
                        )
                      )}

                      {/* Post Media Attachments (100% Uncropped Whole Image/Video in Phone Frame) */}
                      {post.media_urls && post.media_urls.length > 0 && (
                        <div className="w-full max-w-full my-2.5 min-w-0">
                          {post.media_urls.map((url: string, mIdx: number) => {
                            const isVideo = post.media_type === 'video' || url.match(/\.(mp4|webm|mov|ogg)$/i);
                            const isDoc = post.media_type === 'doc' || url.match(/\.(pdf|doc|docx|txt)$/i);

                            if (isVideo) {
                              return (
                                <div key={mIdx} className="w-full max-w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm p-0.5 min-w-0">
                                  <video 
                                    src={url} 
                                    controls 
                                    playsInline 
                                    preload={index === 0 ? 'metadata' : 'none'}
                                    className="w-full max-w-full h-auto max-h-[75vh] sm:max-h-[560px] object-contain rounded-xl block mx-auto" 
                                  />
                                </div>
                              );
                            }

                            if (isDoc) {
                              return (
                                <a 
                                  key={mIdx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 hover:border-[#5a32fa] transition-all group/doc shadow-sm min-w-0"
                                >
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#5a32fa] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                                      <FileText size={18} />
                                    </div>
                                    <div className="overflow-hidden">
                                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate group-hover/doc:text-[#5a32fa] transition-colors">
                                        {post.document_name || 'Legal Document / PDF'}
                                      </h4>
                                      <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">Click to view document</p>
                                    </div>
                                  </div>
                                  <ArrowUpRight size={15} className="text-gray-400 group-hover/doc:text-[#5a32fa] shrink-0" />
                                </a>
                              );
                            }

                            return (
                              <div key={mIdx} className="w-full max-w-full min-w-0 overflow-hidden rounded-xl">
                                <ProgressiveFeedImage
                                  src={url}
                                  alt={`${authorName}'s post attachment`}
                                  eager={index === 0 && mIdx === 0}
                                  onClick={() => {
                                    if (typeof window !== 'undefined' && window.innerWidth >= 768) setPreviewModalImage(url);
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                        {/* Executive Clean 4-Column Control Bar */}
                        <div className="w-full grid grid-cols-4 gap-1 pt-2.5 mt-2.5 border-t border-gray-100/60 dark:border-white/[0.06] text-xs font-semibold">
                          {/* Applaud */}
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-colors active:scale-95 ${
                              isLiked
                                ? 'text-rose-500 font-bold bg-rose-500/10'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/[0.05]'
                            }`}
                            aria-label="Applaud post"
                          >
                            <ThumbsUp size={15} className={isLiked ? "fill-rose-500 text-rose-500" : ""} />
                            <span className="text-[12px]">{post.likes_count ? post.likes_count : ''} Applaud</span>
                          </button>

                          {/* Discuss */}
                          <button
                            onClick={() => {
                              if (post.comments_disabled) return;
                              setActiveCommentPost(post);
                              fetchComments(post.id);
                            }}
                            disabled={post.comments_disabled}
                            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-colors active:scale-95 ${
                              post.comments_disabled
                                ? 'opacity-30 cursor-not-allowed text-gray-600'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/[0.05]'
                            }`}
                            aria-label="Comment on post"
                          >
                            <MessageSquare size={15} />
                            <span className="text-[12px]">{post.comments_count ? post.comments_count : ''} Discuss</span>
                          </button>

                          {/* Share */}
                          <button
                            onClick={() => setSharePost(post)}
                            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/[0.05] transition-colors active:scale-95"
                            aria-label="Share post"
                          >
                            <Share2 size={15} />
                            <span className="text-[12px]">Share</span>
                          </button>

                          {/* Save */}
                          <button
                            onClick={() => void handleToggleSavePost(post.id)}
                            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-colors active:scale-95 ${
                              savedPostIds.has(String(post.id))
                                ? 'text-amber-500 font-bold bg-amber-500/10'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/[0.05]'
                            }`}
                            aria-label={savedPostIds.has(String(post.id)) ? 'Remove saved post' : 'Save post'}
                          >
                            <Bookmark size={15} className={savedPostIds.has(String(post.id)) ? 'fill-amber-500 text-amber-500' : ''} />
                            <span className="text-[12px]">{savedPostIds.has(String(post.id)) ? 'Saved' : 'Save'}</span>
                          </button>
                        </div>
                      </div>
                    {/* Dynamic Sponsored Native Content Placement after every 4 posts */}
                    {(index + 1) % 4 === 0 && (
                      <div className="w-full max-w-full min-w-0 shrink-0 box-border">
                        <AdSlot placement="feed_native" />
                      </div>
                    )}
                    </React.Fragment>
                  );
                })}
                {feedPosts.length > 0 && (
                  <div ref={loadMoreRef} className="flex min-h-16 items-center justify-center py-4" aria-live="polite">
                    {isLoadingMore && <Loader2 size={24} className="animate-spin text-[#5a32fa]" />}
                    {hasMoreFeed && !isLoadingMore && (
                      <button
                        type="button"
                        onClick={() => void fetchFeed(true)}
                        className="rounded-full px-5 py-2 text-xs font-semibold text-[#6600FF] transition-colors hover:bg-[#6600FF]/5 active:bg-[#6600FF]/10"
                      >
                        Load more posts
                      </button>
                    )}
                    {!hasMoreFeed && <span className="text-xs font-medium text-gray-400">You're all caught up</span>}
                  </div>
                )}
              </div>

              </div>
            </div>

            {/* RIGHT SIDEBAR - Sticky & Sticks to bottom content */}
            <aside className="hidden xl:flex flex-col w-[320px] shrink-0 space-y-6 sticky top-[min(1.5rem,calc(100vh-100%-1.5rem))] self-start pb-6 pr-1">
                
                {/* Dynamic Advertisement Space */}
                <AdSlot placement="sidebar_banner" className="w-full shrink-0" />

                {/* Profile Completion / Welcome */}
                <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Enhance your feed</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">Follow more people and join groups to see more relevant content.</p>
                  <div className="space-y-3">
                    <button className="w-full py-2 bg-[#5a32fa]/10 text-[#5a32fa] font-bold rounded-xl text-sm hover:bg-[#5a32fa]/20 transition-colors">
                      Discover Connections
                    </button>
                    <button className="w-full py-2 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-200 font-bold rounded-xl text-sm hover:bg-gray-100 dark:bg-white/10 transition-colors">
                      Browse Groups
                    </button>
                  </div>
                </div>

                {/* Trending Topics */}
                <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Trending in Forums</h3>
                  <div className="space-y-4">
                    {trendingForums.length > 0 ? trendingForums.map((post) => (
                      <Link href={`/platform/forums/post/${post.id}`} key={post.id} className="block group cursor-pointer">
                        <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#5a32fa] transition-colors line-clamp-2">{post.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{post.replies_count || 0} replies</p>
                      </Link>
                    )) : (
                      <p className="text-sm text-gray-500">No trending topics right now.</p>
                    )}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start group cursor-pointer">
                      <div className="bg-[#ff90e8]/10 text-[#ff90e8] rounded-lg p-2 text-center min-w-[48px] shrink-0">
                        <p className="text-[10px] font-bold uppercase">Aug</p>
                        <p className="text-lg font-black leading-none">12</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#5a32fa] transition-colors line-clamp-2">Global IP Conference 2026</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Virtual • 10:00 AM EST</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start group cursor-pointer">
                      <div className="bg-[#00d26a]/10 text-[#00d26a] rounded-lg p-2 text-center min-w-[48px] shrink-0">
                        <p className="text-[10px] font-bold uppercase">Aug</p>
                        <p className="text-lg font-black leading-none">18</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#5a32fa] transition-colors line-clamp-2">Networking Mixer: Tech Law</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">New York, NY • 6:00 PM</p>
                      </div>
                    </div>
                    <button className="w-full py-2 mt-2 text-[#5a32fa] font-bold text-sm hover:underline transition-all">
                      View all events
                    </button>
                  </div>
                </div>

                {/* Helpful Links / Footer-ish */}
                <div className="px-2 pb-6">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <a href="#" className="hover:text-gray-900 dark:text-white">About</a>
                    <a href="#" className="hover:text-gray-900 dark:text-white">Help Center</a>
                    <a href="#" className="hover:text-gray-900 dark:text-white">Privacy & Terms</a>
                    <a href="#" className="hover:text-gray-900 dark:text-white">Advertising</a>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">© 2026 WIPA. All rights reserved.</p>
                </div>

              </aside>

          </main>
        </div>
      </div>
      
      {/* Comment Modal */}
      {activeCommentPost && isDesktopViewport === true && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-[24px] shadow-2xl w-full max-w-[620px] overflow-hidden flex flex-col max-h-[85vh] border border-gray-100 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10 shrink-0 bg-white dark:bg-[#0f172a]">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-[#5a32fa] dark:text-[#ff90e8]" />
                <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                  Comments <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">({postComments[activeCommentPost.id]?.length || 0})</span>
                </h2>
              </div>
              <button 
                onClick={() => {
                  setActiveCommentPost(null);
                  setCommentText('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors group/close"
              >
                <X size={18} className="text-gray-400 group-hover/close:text-gray-900 dark:group-hover/close:text-white transition-colors" />
              </button>
            </div>
            
            {/* Original Post Context */}
            <div className="p-5 border-b border-gray-100 dark:border-white/10 bg-gray-50/80 dark:bg-[#151c2c]/80 shrink-0">
              <div className="flex items-center gap-3 mb-2.5">
                {activeCommentPost.author?.avatar_url ? (
                  <img src={activeCommentPost.author.avatar_url} alt="Author" className="w-9 h-9 rounded-full object-cover shadow-sm ring-1 ring-black/5 dark:ring-white/10" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {activeCommentPost.author?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-[13px] text-gray-900 dark:text-white leading-none">{activeCommentPost.author?.full_name || 'Anonymous User'}</h3>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{formatDistanceToNow(parseISO(activeCommentPost.created_at), { addSuffix: true })}</span>
                </div>
              </div>
              <p className="text-[13px] text-gray-800 dark:text-gray-200 leading-relaxed font-normal whitespace-pre-wrap">
                {activeCommentPost.content}
              </p>
            </div>

            {/* Comments List Area */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-white dark:bg-[#0b101d] [scrollbar-width:thin]">
              {!postComments[activeCommentPost.id] || postComments[activeCommentPost.id].length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-white/5 text-indigo-500 dark:text-[#ff90e8] flex items-center justify-center mx-auto mb-3">
                    <MessageCircle size={22} />
                  </div>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No comments yet</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Be the first to share your thoughts!</p>
                </div>
              ) : (
                postComments[activeCommentPost.id].map(comment => {
                  const commentAuthor = comment.author || {};
                  const cName = commentAuthor.full_name || 'Anonymous User';
                  const cInitial = cName.charAt(0).toUpperCase();
                  const cTime = formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true });
                  
                  return (
                    <div key={comment.id} className="flex gap-3 items-start">
                      {commentAuthor.avatar_url ? (
                        <img src={commentAuthor.avatar_url} alt={cName} className="w-8 h-8 rounded-full object-cover shadow-sm mt-0.5 ring-1 ring-black/5 dark:ring-white/10" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm mt-0.5">
                          {cInitial}
                        </div>
                      )}
                      <div className="flex-1 bg-gray-50 dark:bg-[#151c2c] p-3.5 rounded-2xl rounded-tl-none border border-gray-100 dark:border-white/10">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-[13px] text-gray-900 dark:text-white leading-none flex items-center gap-1.5">
                            {cName}
                            {commentAuthor.is_wipa_recommended && <span className="text-[9px] bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">⭐ WIPA</span>}
                          </h4>
                          <span className="text-[11px] text-gray-400 font-medium leading-none">{cTime}</span>
                        </div>
                        <p className="text-[13px] text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Add Comment Input Area (Footer) */}
            <div className="p-5 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#0f172a] shrink-0">
              <div className="flex gap-3">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user?.name || 'User'} className="w-9 h-9 rounded-full object-cover shadow-sm mt-0.5 ring-1 ring-black/5 dark:ring-white/10" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff90e8] to-[#ff4b4b] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm mt-0.5">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex-1 flex flex-col items-end gap-2.5">
                  <textarea 
                    className="w-full min-h-[75px] max-h-[160px] resize-none outline-none text-[13px] text-gray-900 dark:text-white placeholder-gray-400 bg-gray-50 dark:bg-[#151c2c] p-3 rounded-xl border border-gray-200 dark:border-white/10 focus:border-[#5a32fa] dark:focus:border-[#5a32fa] focus:ring-1 focus:ring-[#5a32fa] transition-all disabled:opacity-50"
                    placeholder={activeCommentPost.comments_disabled ? "Comments are turned off" : "Write a comment..."}
                    autoFocus
                    disabled={activeCommentPost.comments_disabled}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        if (commentText.trim() && !isSubmittingComment && !activeCommentPost.comments_disabled) {
                          handleCommentSubmit(activeCommentPost.id);
                        }
                      }
                    }}
                  ></textarea>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] text-gray-400">Press Ctrl+Enter to post</span>
                    <button 
                      className="bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] text-white px-5 py-2 rounded-xl text-[13px] font-bold shadow-md hover:shadow-indigo-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                      disabled={!commentText.trim() || isSubmittingComment || activeCommentPost.comments_disabled}
                      onClick={() => handleCommentSubmit(activeCommentPost.id)}
                    >
                      {isSubmittingComment ? <Loader2 size={14} className="animate-spin" /> : <Send size={13} />}
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f172a] rounded-[24px] shadow-2xl w-full max-w-[400px] overflow-hidden flex flex-col p-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Post?</h2>
            <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-8 leading-relaxed px-2">
              Are you sure you want to delete this post? Once deleted, it cannot be recovered.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setPostToDelete(null)}
                className="flex-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
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

      {/* IP Wisdom Video Modal */}
      {isIpWisdomModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsIpWisdomModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-[400px] h-[80vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsIpWisdomModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>
            <video 
              src="https://www.w3schools.com/html/mov_bbb.mp4" 
              className="w-full h-full object-cover"
              controls
              autoPlay
              onEnded={() => setIsIpWisdomModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Comment Bottom Drawer */}
      {isDesktopViewport === false && (
        <MobileCommentDrawer
          isOpen={Boolean(activeCommentPost)}
          onClose={() => setActiveCommentPost(null)}
          post={activeCommentPost}
          comments={activeCommentPost ? (postComments[activeCommentPost.id] || []) : []}
          commentText={commentText}
          setCommentText={setCommentText}
          onSubmitComment={() => activeCommentPost && handleCommentSubmit(activeCommentPost.id)}
          isSubmitting={isSubmittingComment}
          error={commentError}
        />
      )}

      <FeedShareSheet
        open={Boolean(sharePost)}
        post={sharePost}
        user={user}
        onClose={() => setSharePost(null)}
      />

      {/* Desktop Image Lightbox Preview Modal */}
      {previewModalImage && (
        <div 
          className="hidden md:flex fixed inset-0 z-[120] bg-black/90 backdrop-blur-md items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setPreviewModalImage(null)}
        >
          <button 
            onClick={() => setPreviewModalImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all active:scale-95 shadow-lg border border-white/20 z-20 cursor-pointer"
            title="Close preview (Esc)"
          >
            <X size={22} />
          </button>
          <div 
            className="relative max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={previewModalImage} 
              alt="Enlarged Post View" 
              className="w-auto h-auto max-w-full max-h-[88vh] object-contain rounded-2xl" 
            />
          </div>
        </div>
      )}

    </div>
  );
}
