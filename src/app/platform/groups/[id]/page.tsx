'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Plus, 
  Globe, 
  Lock, 
  ShieldCheck, 
  Check, 
  MessageSquare, 
  Heart, 
  Share2, 
  Image as ImageIcon, 
  FileText, 
  Send, 
  MoreHorizontal, 
  Sparkles, 
  Loader2, 
  X, 
  UserPlus, 
  Info, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  SlidersHorizontal,
  ThumbsUp,
  Bookmark
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { compressPostMedia } from '@/lib/imageCompressor';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface GroupData {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'Public' | 'Private';
  avatar_url?: string;
  icon: string;
  color: string;
  cover_url: string;
  members_count: number;
  created_at: string;
}

interface GroupPost {
  id: string;
  author_id: string;
  content: string;
  media_urls?: string[];
  media_type?: string;
  document_name?: string;
  privacy?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  post_to_feed?: boolean;
  group_id?: string;
  author?: {
    full_name: string;
    avatar_url: string;
    practice_area?: string;
    role?: string;
    is_wipa_recommended?: boolean;
  };
  hasLiked?: boolean;
}

const DEFAULT_GROUP_COVERS: Record<string, string> = {
  'trademarks-brand-protection': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1400',
  'patent-prosecution-strategies': 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1400',
  'women-in-ip-leadership': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1400',
  'ai-copyright-law': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1400',
  'life-sciences-biotech-ip': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1400',
  'startup-ip-strategy': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1400',
};

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = React.use(params);
  const router = useRouter();
  const user = useAppStore((state) => state.user);

  const [group, setGroup] = useState<GroupData | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTogglingJoin, setIsTogglingJoin] = useState(false);
  const [activeTab, setActiveTab] = useState<'discussion' | 'about' | 'members' | 'media'>('discussion');

  // Posts State
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // In-Group Post Composer State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postToFeed, setPostToFeed] = useState(false); // Default: OFF (group only)
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState('');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group Members List
  const [members, setMembers] = useState<any[]>([]);

  // 1. Fetch Group Details
  useEffect(() => {
    async function loadGroup() {
      setLoading(true);
      try {
        // Query by ID or Slug
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId);
        
        let query = supabase.from('groups').select('id, name, slug, description, type, icon, color, avatar_url, cover_url, members_count, created_at');
        if (isUuid) {
          query = query.or(`id.eq.${rawId},slug.eq.${rawId}`);
        } else {
          query = query.eq('slug', rawId);
        }

        const { data, error } = await query.maybeSingle();

        if (data) {
          const cover = data.cover_url || DEFAULT_GROUP_COVERS[data.slug] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1400';
          setGroup({
            id: data.id,
            name: data.name,
            slug: data.slug || data.id,
            description: data.description || '',
            type: data.type === 'Private' ? 'Private' : 'Public',
            avatar_url: data.avatar_url || '',
            icon: data.icon || '👥',
            color: data.color || '#5a32fa',
            cover_url: cover,
            members_count: data.members_count || 1,
            created_at: data.created_at
          });

          // Check if current user is member
          if (user?.id) {
            const { data: memberRow } = await supabase
              .from('group_members')
              .select('id')
              .eq('group_id', data.id)
              .eq('user_id', user.id)
              .maybeSingle();

            setIsJoined(!!memberRow);
          }

          // Fetch group posts
          loadGroupPosts(data.id);
          // Fetch members list
          loadGroupMembers(data.id);
        } else {
          setGroup(null);
        }
      } catch (err) {
        console.error('Error loading group:', err);
        setGroup(null);
      } finally {
        setLoading(false);
      }
    }

    loadGroup();
  }, [rawId, user?.id]);

  // 2. Fetch Group Posts
  const loadGroupPosts = async (groupId: string) => {
    setLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('feed_posts')
        .select(`
          id, author_id, content, media_urls, media_type, document_name, privacy,
          likes_count, comments_count, created_at, group_id, post_to_feed,
          author:profiles!feed_posts_author_id_fkey(full_name, avatar_url, practice_area, role, is_wipa_recommended)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Check liked status
        let userLikes = new Set<string>();
        if (user?.id) {
          const { data: likes } = await supabase
            .from('feed_likes')
            .select('post_id')
            .eq('user_id', user.id);

          if (likes) likes.forEach(l => userLikes.add(l.post_id));
        }

        const mapped = data.map((p: any) => ({
          ...p,
          hasLiked: userLikes.has(p.id)
        }));
        setPosts(mapped);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error('Error loading group posts:', err);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  // 3. Fetch Group Members
  const loadGroupMembers = async (groupId: string) => {
    try {
      const { data } = await supabase
        .from('group_members')
        .select(`
          role, joined_at,
          profile:profiles(id, full_name, avatar_url, role, company, practice_area)
        `)
        .eq('group_id', groupId)
        .limit(20);

      if (data) {
        setMembers(data.map((d: any) => ({
          ...d.profile,
          roleInGroup: d.role,
          joined_at: d.joined_at
        })).filter(Boolean));
      }
    } catch (err) {
      console.error('Error loading members:', err);
    }
  };

  // Toggle Join/Leave Group
  const handleToggleJoin = async () => {
    if (!user?.id) {
      alert("Please log in to join this group.");
      return;
    }
    if (!group) return;

    setIsTogglingJoin(true);
    const nextState = !isJoined;
    setIsJoined(nextState);
    setGroup(prev => prev ? {
      ...prev,
      members_count: nextState ? prev.members_count + 1 : Math.max(1, prev.members_count - 1)
    } : null);

    try {
      if (nextState) {
        await supabase.from('group_members').insert({
          group_id: group.id,
          user_id: user.id,
          role: 'member'
        });
        await supabase.from('groups').update({
          members_count: group.members_count + 1
        }).eq('id', group.id);
      } else {
        await supabase.from('group_members').delete()
          .eq('group_id', group.id)
          .eq('user_id', user.id);
        await supabase.from('groups').update({
          members_count: Math.max(1, group.members_count - 1)
        }).eq('id', group.id);
      }
      loadGroupMembers(group.id);
    } catch (err) {
      console.error('Error toggling join:', err);
    } finally {
      setIsTogglingJoin(false);
    }
  };

  // Create Post inside Group
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !selectedMediaUrl) return;
    if (!user?.id || !group) return;

    setIsPublishing(true);
    try {
      const newPostPayload = {
        author_id: user.id,
        content: postContent.trim(),
        media_urls: selectedMediaUrl ? [selectedMediaUrl] : [],
        media_type: selectedMediaUrl ? 'image' : null,
        group_id: group.id,
        post_to_feed: postToFeed, // User toggle setting
        privacy: group.type === 'Private' ? 'private' : 'public',
        likes_count: 0,
        comments_count: 0
      };

      const { data: createdPost, error } = await supabase
        .from('feed_posts')
        .insert(newPostPayload)
        .select(`
          id, author_id, content, media_urls, media_type, document_name, privacy,
          likes_count, comments_count, created_at, group_id, post_to_feed,
          author:profiles!feed_posts_author_id_fkey(full_name, avatar_url, practice_area, role, is_wipa_recommended)
        `)
        .single();

      if (error) throw error;

      if (createdPost) {
        setPosts(prev => [createdPost, ...prev]);
        setPostContent('');
        setSelectedMediaUrl('');
        setPostToFeed(false);
        setIsComposerOpen(false);
      }
    } catch (err) {
      console.error('Error publishing group post:', err);
      alert('Failed to publish post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle Image Upload with Automatic Smart Compression
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploadingMedia(true);
    try {
      // Auto-compress heavy images (2MB-200MB) down to optimized WebP/JPEG (< 400KB)
      const compressed = await compressPostMedia(file);

      const fileName = `group-${group?.id || 'post'}-${Date.now()}.webp`;
      const filePath = `posts/${fileName}`;

      const { data, error } = await supabase.storage
        .from('feed-media')
        .upload(filePath, compressed.blob, { 
          contentType: 'image/webp',
          cacheControl: '31536000, public, immutable', 
          upsert: true 
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('feed-media')
        .getPublicUrl(filePath);

      setSelectedMediaUrl(publicUrlData.publicUrl);
    } catch (err) {
      console.error('Error uploading compressed image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingMedia(false);
      e.target.value = '';
    }
  };

  // Handle Like Post
  const handleLikePost = async (postId: string) => {
    if (!user?.id) {
      alert("Please log in to like posts.");
      return;
    }

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked: nextLiked,
          likes_count: nextLiked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1)
        };
      }
      return p;
    }));

    try {
      const target = posts.find(p => p.id === postId);
      if (target?.hasLiked) {
        await supabase.from('feed_likes').delete().eq('post_id', postId).eq('user_id', user.id);
        await supabase.from('feed_posts').update({ likes_count: Math.max(0, target.likes_count - 1) }).eq('id', postId);
      } else {
        await supabase.from('feed_likes').insert({ post_id: postId, user_id: user.id });
        await supabase.from('feed_posts').update({ likes_count: (target?.likes_count || 0) + 1 }).eq('id', postId);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#07090e] flex flex-col items-center justify-center p-6 text-gray-900 dark:text-white">
        <Loader2 className="animate-spin text-[#5a32fa] mb-4" size={36} />
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Opening group...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#07090e] flex flex-col items-center justify-center p-6">
        <div className="bg-white dark:bg-[#11141f] p-12 rounded-[2rem] shadow-sm text-center max-w-lg mx-auto border border-gray-200 dark:border-white/10">
          <Users className="text-gray-300 dark:text-gray-600 mx-auto mb-4" size={54} />
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Group Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">This group may have been removed or does not exist.</p>
          <button 
            onClick={() => router.push('/platform/groups')}
            className="bg-[#5a32fa] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#4927cb] transition-colors cursor-pointer"
          >
            Back to Groups Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#07090e] text-gray-900 dark:text-gray-100 font-sans pb-24">
      
      {/* ========================================================================= */}
      {/* 1. FACEBOOK-STYLE GROUP HERO & BANNER */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#11141f] border-b border-gray-200 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8">
          
          {/* Group Cover Photo */}
          <div className="relative h-48 sm:h-72 md:h-80 w-full overflow-hidden rounded-none sm:rounded-b-3xl bg-gray-900">
            <OptimizedImage 
              src={group.cover_url} 
              alt={group.name} 
              className="w-full h-full object-cover object-center" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

            {/* Back Button */}
            <button 
              onClick={() => router.push('/platform/groups')}
              className="absolute top-4 left-4 z-20 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Groups
            </button>
          </div>

          {/* Group Header Info Row */}
          <div className="px-4 sm:px-6 pt-4 pb-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200 dark:border-white/10">
              
              {/* Left Identity: Avatar Icon + Title + Meta */}
              <div className="flex items-start sm:items-center gap-4">
                <div 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center font-black text-2xl sm:text-3xl text-white shadow-xl border-4 border-white dark:border-[#11141f] -mt-8 sm:-mt-10 relative z-10 shrink-0 overflow-hidden"
                  style={{ backgroundColor: group.color || '#5a32fa' }}
                >
                  {group.avatar_url ? (
                    <OptimizedImage src={group.avatar_url} alt={group.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{group.icon || group.name.charAt(0)}</span>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                    {group.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                    <span className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
                      {group.type === 'Public' ? <Globe size={14} className="text-emerald-500" /> : <Lock size={14} className="text-amber-500" />}
                      {group.type} group
                    </span>
                    <span>•</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {group.members_count.toLocaleString()} members
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Actions: Join/Joined Button + Invite */}
              <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
                
                {/* Join / Joined Button */}
                <button
                  onClick={handleToggleJoin}
                  disabled={isTogglingJoin}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
                    isJoined
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/50 hover:bg-red-50 hover:text-red-600 hover:border-red-300'
                      : 'bg-[#5a32fa] hover:bg-[#4927cb] text-white shadow-md shadow-indigo-500/25 active:scale-95'
                  }`}
                >
                  {isTogglingJoin ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isJoined ? (
                    <>
                      <Check size={16} strokeWidth={3} />
                      <span>Joined</span>
                    </>
                  ) : (
                    <>
                      <Users size={16} />
                      <span>Join Group</span>
                    </>
                  )}
                </button>

                {/* Invite Button */}
                <button
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Group link copied to clipboard! Share it with colleagues.");
                    }
                  }}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-800 dark:text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <UserPlus size={16} />
                  <span>Invite</span>
                </button>
              </div>

            </div>

            {/* Navigation Tabs (Facebook Style) */}
            <div className="flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar pt-1">
              {[
                { key: 'discussion', label: 'Discussion' },
                { key: 'about', label: 'About' },
                { key: 'members', label: `Members · ${group.members_count}` },
                { key: 'media', label: 'Media & Files' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-3.5 px-3 font-bold text-sm whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? 'border-[#5a32fa] text-[#5a32fa] dark:text-[#ff90e8]'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN LAYOUT (FEED + SIDEBAR) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: FEED & POSTS */}
          {/* ===================================================================== */}
          <div className="flex-1 min-w-0 w-full space-y-5">
            
            {/* TAB 1: DISCUSSION */}
            {activeTab === 'discussion' && (
              <>
                {/* 1. IN-GROUP POST COMPOSER */}
                {!isJoined ? (
                  /* User NOT in group prompt */
                  <div className="bg-white dark:bg-[#11141f] rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-[#5a32fa] dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                      <Lock size={22} />
                    </div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                      Join to post in {group.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                      Only verified group members can create posts, start discussions, and comment in this group.
                    </p>
                    <button
                      onClick={handleToggleJoin}
                      className="bg-[#5a32fa] hover:bg-[#4927cb] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
                    >
                      Join Group to Participate
                    </button>
                  </div>
                ) : (
                  /* User IS a member -> Composer Card */
                  <div className="bg-white dark:bg-[#11141f] rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                        {user?.avatar_url ? (
                          <img src={user.avatar_url} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          user?.name?.charAt(0) || 'U'
                        )}
                      </div>

                      <button
                        onClick={() => setIsComposerOpen(true)}
                        className="flex-1 bg-gray-100 dark:bg-black/30 hover:bg-gray-200 dark:hover:bg-black/50 text-left px-4 py-3 rounded-full text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                      >
                        Write something in {group.name}...
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-white/5 px-2">
                      <button 
                        onClick={() => { setIsComposerOpen(true); setTimeout(() => fileInputRef.current?.click(), 100); }}
                        className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors cursor-pointer"
                      >
                        <ImageIcon size={18} className="text-emerald-500" />
                        <span>Photo / Media</span>
                      </button>

                      <button 
                        onClick={() => setIsComposerOpen(true)}
                        className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors cursor-pointer"
                      >
                        <FileText size={18} className="text-indigo-500" />
                        <span>Share Document</span>
                      </button>

                      <button 
                        onClick={() => setIsComposerOpen(true)}
                        className="bg-[#5a32fa] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#4927cb] transition-colors cursor-pointer shadow-sm"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. GROUP POSTS STREAM */}
                {loadingPosts ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="bg-white dark:bg-[#11141f] rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-sm animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-4 w-36 bg-gray-200 dark:bg-white/10 rounded" />
                            <div className="h-3 w-24 bg-gray-200 dark:bg-white/10 rounded" />
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded" />
                          <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/10 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map(post => (
                      <div 
                        key={post.id} 
                        className="bg-white dark:bg-[#11141f] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden"
                      >
                        {/* Post Header */}
                        <div className="p-4 sm:p-5 pb-3 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-base shrink-0 overflow-hidden shadow-sm">
                              {post.author?.avatar_url ? (
                                <img src={post.author.avatar_url} alt={post.author.full_name} className="w-full h-full object-cover" />
                              ) : (
                                post.author?.full_name?.charAt(0) || 'M'
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                                  {post.author?.full_name || 'Group Member'}
                                </h4>
                                {post.author?.is_wipa_recommended && (
                                  <ShieldCheck size={14} className="text-[#00d26a]" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {post.author?.practice_area || post.author?.role || 'IP Professional'} · {new Date(post.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Post Privacy / Feed Indicator */}
                          <div className="flex items-center gap-1.5">
                            {post.post_to_feed ? (
                              <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                                In Group & Feed
                              </span>
                            ) : (
                              <span className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Group Only
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="px-4 sm:px-5 pb-4">
                          <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                            {post.content}
                          </p>
                        </div>

                        {/* Attached Media */}
                        {post.media_urls && post.media_urls.length > 0 && post.media_urls[0] && (
                          <div className="relative max-h-[420px] w-full bg-black/5 dark:bg-black/40 overflow-hidden">
                            <img 
                              src={post.media_urls[0]} 
                              alt="Post attachment" 
                              className="w-full h-full object-contain max-h-[420px]" 
                            />
                          </div>
                        )}

                        {/* Post Footer (Likes & Comments count) */}
                        <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-white/5">
                          <div className="flex items-center gap-1">
                            <ThumbsUp size={13} className="text-indigo-500 fill-indigo-500" />
                            <span>{post.likes_count} likes</span>
                          </div>
                          <span>{post.comments_count} comments</span>
                        </div>

                        {/* Action Buttons: Like / Comment / Share */}
                        <div className="px-4 sm:px-5 py-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-around">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-2 py-1.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              post.hasLiked
                                ? 'text-[#5a32fa] dark:text-[#ff90e8] bg-indigo-50 dark:bg-indigo-950/40'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                          >
                            <Heart size={16} className={post.hasLiked ? 'fill-current text-[#5a32fa]' : ''} />
                            <span>{post.hasLiked ? 'Liked' : 'Like'}</span>
                          </button>

                          <Link
                            href={`/platform/post/${post.id}`}
                            className="flex items-center gap-2 py-1.5 px-4 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                          >
                            <MessageSquare size={16} />
                            <span>Comment</span>
                          </Link>

                          <button
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(`${window.location.origin}/platform/post/${post.id}`);
                                alert("Post link copied to clipboard!");
                              }
                            }}
                            className="flex items-center gap-2 py-1.5 px-4 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                          >
                            <Share2 size={16} />
                            <span>Share</span>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty state */
                  <div className="bg-white dark:bg-[#11141f] rounded-2xl p-10 border border-gray-200 dark:border-white/10 shadow-sm text-center">
                    <MessageSquare size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">No posts in this group yet</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Be the first to share an insight or start a conversation in {group.name}.
                    </p>
                    {isJoined && (
                      <button
                        onClick={() => setIsComposerOpen(true)}
                        className="bg-[#5a32fa] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#4927cb] transition-colors cursor-pointer"
                      >
                        Create First Post
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* TAB 2: ABOUT */}
            {activeTab === 'about' && (
              <div className="bg-white dark:bg-[#11141f] rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About this Group</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                    {group.description || 'Dedicated forum for intellectual property professionals and WIPA members.'}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Globe className="text-emerald-500 shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{group.type} Group</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {group.type === 'Public' 
                          ? "Anyone on WIPA can see who's in the group and what they post."
                          : "Only approved group members can see who's in the group and view private group posts."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Eye className="text-indigo-500 shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">Visible</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Anyone can find and search for this group in the WIPA directory.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="text-purple-500 shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">Group History</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Created on {new Date(group.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MEMBERS */}
            {activeTab === 'members' && (
              <div className="bg-white dark:bg-[#11141f] rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Group Members</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{group.members_count.toLocaleString()} registered members</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {members.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                        {m.avatar_url ? (
                          <img src={m.avatar_url} alt={m.full_name} className="w-full h-full object-cover" />
                        ) : (
                          m.full_name?.charAt(0) || 'M'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{m.full_name || 'Member'}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{m.company || m.practice_area || 'IP Counsel'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: MEDIA */}
            {activeTab === 'media' && (
              <div className="bg-white dark:bg-[#11141f] rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Shared Media & Resources</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {posts.filter(p => p.media_urls && p.media_urls.length > 0).map((p, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden aspect-video bg-black/10 border border-gray-200 dark:border-white/10">
                      <img src={p.media_urls![0]} alt="Media" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                {posts.filter(p => p.media_urls && p.media_urls.length > 0).length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-12">No media files uploaded in this group yet.</p>
                )}
              </div>
            )}

          </div>

          {/* ===================================================================== */}
          {/* RIGHT SIDEBAR (ABOUT THIS GROUP - FACEBOOK STYLE) */}
          {/* ===================================================================== */}
          <div className="w-full lg:w-[360px] lg:sticky lg:top-6 space-y-5 shrink-0">
            
            {/* About Card */}
            <div className="bg-white dark:bg-[#11141f] rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">
                About this group
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {group.description || 'Welcome to this specialized community group.'}
              </p>

              <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-white/5 text-xs text-gray-600 dark:text-gray-400 font-medium">
                <div className="flex items-center gap-2.5">
                  {group.type === 'Public' ? <Globe size={16} className="text-emerald-500" /> : <Lock size={16} className="text-amber-500" />}
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">{group.type}</span>
                    <span>{group.type === 'Public' ? "Anyone can see who's in the group and what they post." : "Only members can see group posts."}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Eye size={16} className="text-indigo-500" />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">Visible</span>
                    <span>Anyone can find this group in search.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Group Rules & Guidelines */}
            <div className="bg-white dark:bg-[#11141f] rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-500" /> Group Guidelines
              </h3>
              
              <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Maintain professional and collegiate legal discourse.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Never disclose confidential client data or unpublished patent applications.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Cite relevant statutes and precedent cases when debating legal doctrine.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. IN-GROUP POST CREATION MODAL WITH "ALSO POST TO FEED" TOGGLE */}
      {/* ========================================================================= */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#11141f] rounded-[2rem] p-6 max-w-xl w-full border border-gray-200 dark:border-white/10 shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white overflow-hidden shrink-0"
                  style={{ backgroundColor: group.color || '#5a32fa' }}
                >
                  {group.avatar_url ? (
                    <img src={group.avatar_url} alt={group.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{group.icon || group.name.charAt(0)}</span>
                  )}
                </div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Post in {group.name}
                </h3>
              </div>
              <button 
                onClick={() => setIsComposerOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* User Info Bar */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    {user?.name || 'You'}
                  </h4>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-md font-medium">
                    Posting to {group.name}
                  </span>
                </div>
              </div>

              {/* Text Area */}
              <textarea
                required
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={`Share an insight, question, or case update with members of ${group.name}...`}
                className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 text-sm sm:text-base outline-none resize-none"
              />

              {/* Preview Selected Media */}
              {selectedMediaUrl && (
                <div className="relative rounded-xl overflow-hidden max-h-48 border border-gray-200 dark:border-white/10">
                  <img src={selectedMediaUrl} alt="Upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setSelectedMediaUrl('')}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Attachment Actions */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Add to your post</span>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingMedia}
                    className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    title="Add Photo"
                  >
                    {isUploadingMedia ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleMediaUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* ============================================================= */}
              {/* THE TOGGLE: "ALSO POST IN FEED" (REQUESTED BY USER) */}
              {/* ============================================================= */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-between">
                <div className="pr-4">
                  <div className="flex items-center gap-1.5">
                    <Globe size={15} className="text-[#5a32fa] dark:text-indigo-400" />
                    <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                      Also broadcast to main community feed
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5 leading-snug">
                    {postToFeed 
                      ? "This post will be visible in this group AND appear on the public WIPA feed." 
                      : "This post will remain strictly inside this group only."}
                  </p>
                </div>

                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setPostToFeed(!postToFeed)}
                  className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    postToFeed ? 'bg-[#5a32fa]' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                      postToFeed ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPublishing || (!postContent.trim() && !selectedMediaUrl)}
                className="w-full bg-[#5a32fa] hover:bg-[#4927cb] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isPublishing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Send size={16} />
                    <span>Publish Post</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
