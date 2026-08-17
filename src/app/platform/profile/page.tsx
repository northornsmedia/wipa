// @ts-nocheck
'use client';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  BadgeCheck, User, Users, Mail, UserPlus, MessageSquare, Briefcase, GraduationCap,
  MapPin, Link as LinkIcon, Calendar, Edit3, Settings, Camera, ThumbsUp,
  Share2, Copy, PlayCircle, Hash, ArrowUpRight, CheckCircle2, Loader2, Star,
  Folder, Lightbulb, HelpCircle, Headphones, Award, Gift, Sparkles, Plus,
  Image as ImageIcon, Video, Send, MoreHorizontal, Eye, TrendingUp, Search,
  Globe2, ShieldCheck, Check, Heart, MessageCircle, Repeat2, Bookmark, X,
  Trash2, UploadCloud, Play, Volume2
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const DEFAULT_MOCK_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

export default function ProfilePage() {
  const { user, setUser } = useAppStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'activity' | 'about' | 'experience' | 'education' | 'skills'>('activity');

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Jane Doe',
    role: 'Senior IP Counsel | Patent Strategist | WIPA Member',
    company: 'TechLaw Partners LLP',
    experienceYears: 6,
    education: 'Harvard Law School · LL.M. Intellectual Property',
    location: 'London, United Kingdom',
    bio: 'Experienced IP Counsel with a focus on patent prosecution, technology licensing, and international trademark strategy. Passionate about empowering women innovators and protecting breakthroughs in artificial intelligence and life sciences. Active member of WIPA since 2024.',
    linkedin: 'linkedin.com/in/janedoe',
    website: 'janedoe.com',
    practiceAreas: 'Patent Prosecution, Trademark Law, IP Litigation, Tech Licensing, AI Regulation',
    skills: 'Patent Drafting, Trademark Portfolio, Cross-Border Licensing, Trade Secrets, IP Audit',
    avatarUrl: user?.avatar_url || '',
    introVideoUrl: DEFAULT_MOCK_VIDEO,
    memberId: user?.member_id || 'WIP-884920',
    verificationStatus: 'verified',
    isWipaRecommended: true,
    businessProfile: null as any
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [editForm, setEditForm] = useState(profileData);
  const [stats, setStats] = useState({ connections: 142, followers: 890, posts: 14, profileViews: 328, postImpressions: '4.2k' });

  // Post composer state
  const [newPostText, setNewPostText] = useState('');
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });

  const fetchUserPosts = async (userId: string) => {
    setIsLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('feed_posts')
        .select(`
          *,
          author:profiles!feed_posts_author_id_fkey(full_name, avatar_url, role, is_wipa_recommended)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUserPosts(data);
        setStats(prev => ({ ...prev, posts: data.length }));
      }

      const { data: likesData } = await supabase
        .from('feed_likes')
        .select('post_id')
        .eq('user_id', userId);

      if (likesData) {
        setLikedPostIds(new Set(likesData.map(l => l.post_id)));
      }
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, business_profiles(id, name, slug, type, logo_url)')
        .eq('id', user.id)
        .single();
        
      if (!error && data) {
        const newProfile = {
          ...profileData,
          name: data.full_name || profileData.name,
          role: data.role || profileData.role,
          company: data.company || profileData.company,
          experienceYears: data.experience_years || profileData.experienceYears,
          education: data.education || profileData.education,
          location: data.country || profileData.location,
          bio: data.bio || profileData.bio,
          linkedin: data.linkedin_url || profileData.linkedin,
          website: data.website_url || profileData.website,
          practiceAreas: data.practice_area || profileData.practiceAreas,
          skills: data.skills || profileData.skills,
          avatarUrl: data.avatar_url || profileData.avatarUrl,
          introVideoUrl: data.intro_video_url || DEFAULT_MOCK_VIDEO,
          memberId: data.member_id || profileData.memberId,
          verificationStatus: data.verification_status || 'verified',
          isWipaRecommended: data.is_wipa_recommended ?? true,
          businessProfile: data.business_profiles
        };
        setProfileData(newProfile);
        setEditForm(newProfile);
      }
    };
    
    fetchProfile();
    fetchUserPosts(user.id);
  }, [user?.id]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.id) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setEditForm(prev => ({ ...prev, avatarUrl: url }));
      setProfileData(prev => ({ ...prev, avatarUrl: url }));

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
        if (!uploadError) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
          await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
          setUser({ ...user, avatar_url: data.publicUrl });
        }
      } catch (err) {
        console.error('Error uploading avatar:', err);
      }
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.id) {
      setIsUploadingCover(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-cover.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('covers').upload(fileName, file, { upsert: true });
        if (!uploadError) {
          const { data } = supabase.storage.from('covers').getPublicUrl(fileName);
          await supabase.from('profiles').update({ cover_url: data.publicUrl }).eq('id', user.id);
          setUser({ ...user, cover_url: data.publicUrl });
          setCoverImage(data.publicUrl);
        }
      } catch (err) {
        console.error('Error uploading cover:', err);
      } finally {
        setIsUploadingCover(false);
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.id) {
      setIsUploadingVideo(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-intro.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('feed-media').upload(fileName, file, { upsert: true });
        
        let finalVideoUrl = URL.createObjectURL(file);
        if (!uploadError) {
          const { data } = supabase.storage.from('feed-media').getPublicUrl(fileName);
          finalVideoUrl = data.publicUrl;
        }

        await supabase.from('profiles').update({ intro_video_url: finalVideoUrl }).eq('id', user.id);
        setProfileData(prev => ({ ...prev, introVideoUrl: finalVideoUrl }));
        setEditForm(prev => ({ ...prev, introVideoUrl: finalVideoUrl }));
        alert('Introduction video story updated successfully! 🎬');
      } catch (err) {
        console.error('Error uploading video:', err);
      } finally {
        setIsUploadingVideo(false);
      }
    }
  };

  const handleRemoveVideo = async () => {
    if (!confirm('Are you sure you want to remove your introduction story video?')) return;
    if (user?.id) {
      await supabase.from('profiles').update({ intro_video_url: null }).eq('id', user.id);
    }
    setProfileData(prev => ({ ...prev, introVideoUrl: '' }));
    setEditForm(prev => ({ ...prev, introVideoUrl: '' }));
    setIsVideoModalOpen(false);
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await supabase.from('profiles').update({
        full_name: editForm.name,
        role: editForm.role,
        company: editForm.company,
        experience_years: editForm.experienceYears,
        education: editForm.education,
        bio: editForm.bio,
        country: editForm.location,
        linkedin_url: editForm.linkedin,
        website_url: editForm.website,
        practice_area: editForm.practiceAreas,
        skills: editForm.skills,
        intro_video_url: editForm.introVideoUrl
      }).eq('id', user.id);

      setProfileData(editForm);
      setUser({ ...user, name: editForm.name });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim() || !user?.id) return;
    setIsPublishing(true);
    try {
      const { data, error } = await supabase
        .from('feed_posts')
        .insert({
          author_id: user.id,
          content: newPostText.trim(),
          privacy: 'Anyone',
          media_urls: []
        })
        .select(`
          *,
          author:profiles!feed_posts_author_id_fkey(full_name, avatar_url, role, is_wipa_recommended)
        `)
        .single();

      if (!error && data) {
        setUserPosts(prev => [data, ...prev]);
        setNewPostText('');
        setStats(prev => ({ ...prev, posts: prev.posts + 1 }));
      } else if (error) {
        console.error("Error inserting post to DB:", error);
      }
    } catch (e) {
      console.error("Error creating post:", e);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!user?.id) return;
    const isLiked = likedPostIds.has(postId);
    const nextLiked = new Set(likedPostIds);
    if (isLiked) {
      nextLiked.delete(postId);
      setUserPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) - 1) } : p));
      await supabase.from('feed_likes').delete().match({ post_id: postId, user_id: user.id });
    } else {
      nextLiked.add(postId);
      setUserPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p));
      await supabase.from('feed_likes').insert({ post_id: postId, user_id: user.id });
    }
    setLikedPostIds(nextLiked);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 font-sans pb-20">
      
      {/* Top Banner & Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
        
        {/* ================= HERO PROFILE CARD (FB + LINKEDIN HYBRID) ================= */}
        <div className="bg-white dark:bg-[#151c2c] rounded-2xl md:rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-6">
          
          {/* Cover Photo */}
          <div 
            className="h-44 sm:h-64 md:h-80 w-full relative bg-gradient-to-r from-[#5a32fa] via-[#7952ff] to-[#ff90e8] overflow-hidden"
            style={{ 
              backgroundImage: (user?.cover_url || coverImage) ? `url(${user?.cover_url || coverImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!(user?.cover_url || coverImage) && (
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_3px,transparent_3px)] [background-size:24px_24px]" />
            )}

            {/* Edit Cover Photo Button */}
            <button 
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploadingCover}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:scale-105"
            >
              {isUploadingCover ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              <span>{isUploadingCover ? 'Uploading...' : 'Edit Cover'}</span>
            </button>
            <input type="file" ref={coverInputRef} onChange={handleCoverUpload} accept="image/*" className="hidden" />
          </div>

          {/* Profile Header Info */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-24 mb-4">
              
              {/* Avatar + Rainbow Gradient Story Ring */}
              <div className="relative group self-start">
                
                {/* Glowing Story Gradient Ring */}
                <div 
                  className="p-[4px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-[#5a32fa] animate-gradient cursor-pointer hover:scale-105 transition-all shadow-xl relative"
                  onClick={() => setIsVideoModalOpen(true)}
                  title="Click to watch Introduction Story Video"
                >
                  <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-white dark:bg-[#151c2c] p-1">
                    <div 
                      className="w-full h-full rounded-full bg-gradient-to-br from-[#5a32fa] to-[#ff90e8] flex items-center justify-center text-white text-4xl sm:text-6xl font-bold overflow-hidden relative"
                      style={{ backgroundImage: profileData.avatarUrl ? `url(${profileData.avatarUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      {!profileData.avatarUrl && profileData.name.charAt(0).toUpperCase()}

                      {/* Play Story Overlay Icon on Hover */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle size={44} className="text-white drop-shadow-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Pulsing "Story Video" Badge */}
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-[#5a32fa] text-white p-1.5 rounded-full shadow-md border-2 border-white dark:border-[#151c2c] flex items-center justify-center">
                    <Play size={12} className="fill-white" />
                  </div>
                </div>

                {/* Camera Upload Badge for Photo */}
                <button 
                  onClick={(e) => { e.stopPropagation(); avatarInputRef.current?.click(); }}
                  className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-2 bg-[#5a32fa] hover:bg-[#4a24db] text-white rounded-full shadow-lg border-2 border-white dark:border-[#151c2c] transition-transform hover:scale-110 z-10"
                  title="Change Profile Photo"
                >
                  <Camera size={15} />
                </button>
                <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                <input type="file" ref={videoInputRef} onChange={handleVideoUpload} accept="video/*" className="hidden" />
              </div>

              {/* Action Buttons (LinkedIn/FB style + Video Intro Actions) */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
                
                {/* Watch Story Video Button */}
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-4 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-[#5a32fa] hover:from-pink-600 hover:to-[#4a24db] text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <Play size={16} className="fill-white" /> Watch Story
                </button>

                {/* Upload / Change Video Button */}
                <button 
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isUploadingVideo}
                  className="px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm flex items-center gap-2 transition-all"
                  title="Upload or Change Intro Video"
                >
                  {isUploadingVideo ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} className="text-[#5a32fa] dark:text-[#ff90e8]" />}
                  <span>{isUploadingVideo ? 'Uploading...' : profileData.introVideoUrl ? 'Change Story' : 'Add Story'}</span>
                </button>

                <button 
                  onClick={() => { setEditForm(profileData); setIsEditModalOpen(true); }}
                  className="px-5 py-2.5 rounded-full bg-[#5a32fa] hover:bg-[#4a24db] text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>

                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <Share2 size={16} /> Share
                </button>

                <button 
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  title="Settings"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>

            {/* Name, Headline & Metadata */}
            <div className="space-y-2 mt-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {profileData.name}
                </h1>
                
                {profileData.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-[#00d26a] bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-500/20">
                    <BadgeCheck size={14} className="fill-[#00d26a] text-white" /> Verified Counsel
                  </span>
                )}

                {profileData.isWipaRecommended && (
                  <span className="inline-flex items-center gap-1 bg-amber-400/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-400/30 shadow-sm">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> Recommended by WIPA
                  </span>
                )}
              </div>

              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium leading-snug max-w-3xl">
                {profileData.role}
              </p>

              {/* Location, Links & Company info */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin size={15} className="text-[#ff4b4b]" /> {profileData.location}
                </span>

                <span className="flex items-center gap-1 font-medium text-[#5a32fa] dark:text-[#ff90e8]">
                  <Briefcase size={15} /> {profileData.company}
                </span>

                <span className="flex items-center gap-1 font-medium">
                  <GraduationCap size={15} /> {profileData.education}
                </span>

                {profileData.memberId && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md font-mono text-xs font-semibold">
                    <Hash size={12} /> {profileData.memberId}
                  </span>
                )}
              </div>

              {/* Network Stats Bar */}
              <div className="flex items-center gap-4 text-xs sm:text-sm pt-2 text-gray-600 dark:text-gray-400">
                <span className="font-bold text-gray-900 dark:text-white">
                  {stats.connections} <span className="font-normal text-gray-500">connections</span>
                </span>
                <span>•</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {stats.followers} <span className="font-normal text-gray-500">followers</span>
                </span>
                <span>•</span>
                <span className="font-bold text-[#5a32fa] dark:text-[#ff90e8] hover:underline cursor-pointer">
                  Contact info
                </span>
              </div>
            </div>

            {/* Profile Navigation Tabs (LinkedIn/FB style) */}
            <div className="flex border-t border-gray-200 dark:border-gray-800 mt-6 pt-1 gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
              {[
                { key: 'activity', label: 'Posts & Activity', count: stats.posts },
                { key: 'about', label: 'About' },
                { key: 'experience', label: 'Experience' },
                { key: 'education', label: 'Education & Honors' },
                { key: 'skills', label: 'Skills & Endorsements' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-3 px-3 sm:px-4 font-semibold text-sm whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-[#5a32fa] text-[#5a32fa] dark:text-[#ff90e8]'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ================= 2-COLUMN MAIN CONTENT (LINKEDIN/FB GRID) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ================= LEFT / MAIN CONTENT STREAM (2 COLS) ================= */}
          <div className="lg:col-span-2 space-y-6">

            {/* TAB 1: POSTS & ACTIVITY */}
            {activeTab === 'activity' && (
              <>
                {/* LinkedIn-style "Create a Post" Box */}
                <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-sm overflow-hidden shrink-0"
                      style={{ backgroundImage: profileData.avatarUrl ? `url(${profileData.avatarUrl})` : undefined, backgroundSize: 'cover' }}
                    >
                      {!profileData.avatarUrl && profileData.name.charAt(0)}
                    </div>
                    
                    <input 
                      type="text"
                      placeholder={`What's on your mind, ${profileData.name.split(' ')[0]}?`}
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleCreatePost(); }}
                      className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 text-gray-800 dark:text-gray-200 rounded-full px-4 py-2.5 text-sm outline-none transition-colors border border-transparent focus:border-[#5a32fa]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/80">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs sm:text-sm font-medium transition-colors">
                        <ImageIcon size={18} className="text-blue-500" />
                        <span className="hidden sm:inline">Photo</span>
                      </button>
                      <button 
                        onClick={() => videoInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs sm:text-sm font-medium transition-colors"
                      >
                        <Video size={18} className="text-emerald-500" />
                        <span className="hidden sm:inline">Story Video</span>
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs sm:text-sm font-medium transition-colors">
                        <Calendar size={18} className="text-amber-500" />
                        <span className="hidden sm:inline">Event</span>
                      </button>
                    </div>

                    <button 
                      onClick={handleCreatePost}
                      disabled={!newPostText.trim()}
                      className="px-4 py-1.5 bg-[#5a32fa] hover:bg-[#4a24db] disabled:opacity-40 text-white text-xs sm:text-sm font-bold rounded-full transition-all flex items-center gap-1.5"
                    >
                      <Send size={14} /> Post
                    </button>
                  </div>
                </div>

                {/* User's Post Feed */}
                <div className="space-y-4">
                  {isLoadingPosts ? (
                    <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 gap-2">
                      <Loader2 size={20} className="animate-spin text-[#5a32fa]" />
                      <span className="text-sm font-medium">Loading your activity...</span>
                    </div>
                  ) : userPosts.length === 0 ? (
                    <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center space-y-3 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-[#5a32fa]/10 text-[#5a32fa] flex items-center justify-center mx-auto">
                        <MessageSquare size={22} />
                      </div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white">No posts published yet</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        Share your thoughts, IP case analysis, or an update with the global WIPA community using the composer above!
                      </p>
                    </div>
                  ) : (
                    userPosts.map((post) => {
                      const isLiked = likedPostIds.has(post.id);
                      return (
                        <div key={post.id} className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
                          {/* Post Author Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-sm overflow-hidden shrink-0"
                                style={{ backgroundImage: (post.author?.avatar_url || profileData.avatarUrl) ? `url(${post.author?.avatar_url || profileData.avatarUrl})` : undefined, backgroundSize: 'cover' }}
                              >
                                {!(post.author?.avatar_url || profileData.avatarUrl) && (post.author?.full_name || profileData.name).charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{post.author?.full_name || profileData.name}</h4>
                                  <BadgeCheck size={14} className="text-[#00d26a]" />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{post.author?.role || profileData.role.split('|')[0]}</p>
                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                  {new Date(post.created_at).toLocaleDateString()} • <Globe2 size={10} />
                                </span>
                              </div>
                            </div>

                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                              <MoreHorizontal size={18} />
                            </button>
                          </div>

                          {/* Content */}
                          <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed mb-3 whitespace-pre-wrap">
                            {post.content}
                          </p>

                          {/* Reaction Counters */}
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pb-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="flex items-center gap-1">
                              <span className="p-1 bg-[#5a32fa] text-white rounded-full text-[9px]"><ThumbsUp size={10} /></span>
                              {post.likes_count || 0} likes
                            </span>
                            <span>{post.comments_count || 0} comments</span>
                          </div>

                          {/* Reaction Buttons */}
                          <div className="flex items-center justify-around pt-1 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                            <button 
                              onClick={() => handleToggleLike(post.id)}
                              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                                isLiked ? 'text-[#5a32fa] font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              <ThumbsUp size={16} className={isLiked ? 'fill-[#5a32fa]' : ''} />
                              <span>Like</span>
                            </button>

                            <button 
                              onClick={() => router.push('/platform')}
                              className="flex-1 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <MessageCircle size={16} />
                              <span>Comment</span>
                            </button>

                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.origin + '/platform');
                                alert('Post link copied to clipboard!');
                              }}
                              className="flex-1 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Send size={16} />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            {/* TAB 2: ABOUT SECTION */}
            {(activeTab === 'about' || activeTab === 'activity') && (
              <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">About</h3>
                  <button 
                    onClick={() => { setEditForm(profileData); setIsEditModalOpen(true); }}
                    className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Edit3 size={18} />
                  </button>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {profileData.bio}
                </p>

                {/* Practice Areas Chips */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    Practice Areas & Specializations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.practiceAreas.split(',').map((area, idx) => (
                      <span key={idx} className="bg-[#5a32fa]/10 dark:bg-[#5a32fa]/20 text-[#5a32fa] dark:text-[#ff90e8] px-3 py-1 rounded-full text-xs font-semibold border border-[#5a32fa]/20">
                        {area.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: EXPERIENCE TIMELINE */}
            {(activeTab === 'experience' || activeTab === 'activity') && (
              <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Experience</h3>
                  <button className="px-3 py-1.5 text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] hover:bg-[#5a32fa]/10 rounded-lg flex items-center gap-1">
                    <Plus size={16} /> Add position
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Position 1 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center text-xl shrink-0">
                      ⚖️
                    </div>
                    <div className="flex-1 border-b border-gray-100 dark:border-gray-800 pb-6">
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">{profileData.role}</h4>
                      <p className="text-sm font-semibold text-[#5a32fa] dark:text-[#ff90e8]">{profileData.company}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">2020 – Present · {profileData.experienceYears} yrs · London, UK</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                        Leading strategic IP counseling, international patent drafting for high-growth tech ventures, and advising on multi-jurisdictional licensing agreements.
                      </p>
                    </div>
                  </div>

                  {/* Position 2 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center text-xl shrink-0">
                      🏛️
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">Associate IP Attorney</h4>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Global Intellectual Property Bureau</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">2018 – 2020 · 2 yrs · Geneva & London</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                        Drafted trademark oppositions, managed European Patent Office (EPO) filings, and conducted comprehensive freedom-to-operate searches.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: EDUCATION & CERTIFICATIONS */}
            {(activeTab === 'education' || activeTab === 'activity') && (
              <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Education & Certifications</h3>
                  <button className="px-3 py-1.5 text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] hover:bg-[#5a32fa]/10 rounded-lg flex items-center gap-1">
                    <Plus size={16} /> Add credential
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-xl shrink-0">
                      🎓
                    </div>
                    <div className="flex-1 border-b border-gray-100 dark:border-gray-800 pb-5">
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">{profileData.education}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Master of Laws (LL.M.) · Focus on Global Patent Strategy</p>
                      <p className="text-xs text-gray-400 mt-0.5">Graduated with High Distinction</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-xl shrink-0">
                      📜
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">Certified Information Privacy Professional (CIPP/E)</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">IAPP · International Association of Privacy Professionals</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Active Credential · Issued 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SKILLS & ENDORSEMENTS */}
            {(activeTab === 'skills' || activeTab === 'activity') && (
              <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Skills & Endorsements</h3>
                  <button className="px-3 py-1.5 text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] hover:bg-[#5a32fa]/10 rounded-lg flex items-center gap-1">
                    <Plus size={16} /> Add skill
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profileData.skills.split(',').map((skill, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-[#5a32fa]/40 transition-colors">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{skill.trim()}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">18 endorsements</p>
                      </div>
                      <button className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-[#5a32fa] hover:text-white hover:border-[#5a32fa] transition-all">
                        Endorse
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ================= RIGHT SIDEBAR (LINKEDIN ANALYTICS & WIDGETS) ================= */}
          <div className="space-y-6">

            {/* LinkedIn-style Analytics Box (Private to you) */}
            <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#5a32fa]" /> Analytics
                </h3>
                <span className="text-[11px] text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-medium">Private to you</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xl font-black text-gray-900 dark:text-white">{stats.profileViews}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                    <Eye size={12} /> Profile views
                  </p>
                  <span className="text-[10px] font-bold text-emerald-600">+18% this week</span>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xl font-black text-gray-900 dark:text-white">{stats.postImpressions}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                    <Sparkles size={12} /> Impressions
                  </p>
                  <span className="text-[10px] font-bold text-emerald-600">+34% this week</span>
                </div>
              </div>
            </div>

            {/* Public Profile URL Card */}
            <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Public Profile & URL</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Your custom WIPA profile handle:</p>
              
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-xl text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">
                <span className="truncate">wipa.org/u/{profileData.memberId?.toLowerCase() || 'janedoe'}</span>
                <button 
                  onClick={() => alert('Profile URL copied to clipboard!')}
                  className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors text-[#5a32fa] dark:text-[#ff90e8]"
                  title="Copy Link"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            {/* Associated Firm / Business Hub */}
            {profileData.businessProfile && (
              <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Associated Firm</h3>
                <Link 
                  href={`/platform/business/${profileData.businessProfile.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                    {profileData.businessProfile.logo_url ? (
                      <img src={profileData.businessProfile.logo_url} className="w-full h-full object-cover" />
                    ) : (
                      <Briefcase className="text-gray-400" size={18} />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{profileData.businessProfile.name}</h4>
                    <p className="text-xs text-gray-500 capitalize">{profileData.businessProfile.type?.replace('_', ' ')}</p>
                  </div>
                </Link>
              </div>
            )}

            {/* Refer a Friend & Benefits */}
            <div className="bg-gradient-to-br from-[#5a32fa] to-[#ff90e8] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white blur-[50px] opacity-20 rounded-full pointer-events-none" />
              <h3 className="font-bold text-base mb-1.5 flex items-center gap-2 relative z-10">
                <Gift size={18} /> Invite & Earn Benefit
              </h3>
              <p className="text-xs text-white/90 mb-4 leading-relaxed relative z-10">
                Invite fellow female IP practitioners to WIPA and both receive a 10% annual membership bonus.
              </p>
              
              <div className="flex items-center bg-white/20 backdrop-blur-md rounded-xl p-1 relative z-10">
                <span className="flex-1 px-3 text-xs font-mono font-bold truncate">
                  WIP-{profileData.memberId?.substring(0, 6) || '884920'}
                </span>
                <button 
                  onClick={() => alert('Referral code copied!')}
                  className="bg-white text-[#5a32fa] px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* People Also Viewed (Networking Suggestions) */}
            <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">People Also Viewed</h3>
              <div className="space-y-3.5">
                {[
                  { name: 'Dr. Shweta Singh', role: 'Founder & CEO, Ennoble IP', img: '/Dr Shweta_AIPPI (1).png' },
                  { name: 'Adriana Barrera', role: 'Partner, BARLAW Peru', img: '/10.jpg' },
                  { name: 'Nadine Stuttle', role: 'CEO, PSS Solutions Switzerland', img: '/Nadine Stuttle Picture.jpg' }
                ].map((person, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer">
                    <div 
                      className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0"
                      style={{ backgroundImage: `url("${person.img}")`, backgroundSize: 'cover', backgroundPosition: 'top' }}
                    />
                    <div className="overflow-hidden flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate group-hover:text-[#5a32fa] transition-colors">{person.name}</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{person.role}</p>
                    </div>
                    <button className="p-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-[#5a32fa] hover:text-white hover:border-[#5a32fa] transition-colors text-gray-600 dark:text-gray-400">
                      <UserPlus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ================= FULL-SCREEN INTRODUCTION STORY VIDEO MODAL ================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0f172a] text-white w-full max-w-lg rounded-3xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Story Top Header Bar */}
            <div className="p-4 bg-black/40 backdrop-blur-md flex items-center justify-between z-10 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-sm overflow-hidden"
                  style={{ backgroundImage: profileData.avatarUrl ? `url(${profileData.avatarUrl})` : undefined, backgroundSize: 'cover' }}
                >
                  {!profileData.avatarUrl && profileData.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    {profileData.name} <BadgeCheck size={14} className="text-[#00d26a]" />
                  </h4>
                  <p className="text-xs text-white/70">Introduction Story Video</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => videoInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Upload New Video"
                >
                  <UploadCloud size={14} /> Change
                </button>

                {profileData.introVideoUrl && (
                  <button 
                    onClick={handleRemoveVideo}
                    className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold transition-colors"
                    title="Remove Video"
                  >
                    <Trash2 size={15} />
                  </button>
                )}

                <button 
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Video Player Container */}
            <div className="w-full bg-black flex items-center justify-center min-h-[380px] max-h-[70vh] relative">
              {profileData.introVideoUrl ? (
                <video 
                  src={profileData.introVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain max-h-[65vh]"
                />
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto text-[#5a32fa]">
                    <Video size={32} />
                  </div>
                  <h3 className="text-lg font-bold">No Story Video Uploaded</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Record a 30-second introduction to introduce yourself, your firm, and your IP expertise to the global WIPA community!
                  </p>
                  <button 
                    onClick={() => videoInputRef.current?.click()}
                    className="px-5 py-2.5 bg-[#5a32fa] hover:bg-[#4a24db] text-white rounded-xl font-bold text-sm shadow-md"
                  >
                    Upload Video Intro
                  </button>
                </div>
              )}
            </div>

            {/* Story Bottom Bar */}
            <div className="p-4 bg-gray-900/90 text-center text-xs text-gray-400 border-t border-white/5">
              <span>🌟 Click anywhere or press Esc to close • WIPA Video Introductions</span>
            </div>

          </div>
        </div>
      )}

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151c2c] w-full max-w-xl rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile Details</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 text-sm">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Headline / Role</label>
                <input 
                  type="text" 
                  value={editForm.role} 
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                />
              </div>

              {/* Story Video Introduction Field */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-2">
                <label className="block font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Video size={16} className="text-[#5a32fa]" /> Story / Intro Video URL
                </label>
                <input 
                  type="text" 
                  value={editForm.introVideoUrl || ''} 
                  placeholder="https://example.com/intro-video.mp4"
                  onChange={(e) => setEditForm({...editForm, introVideoUrl: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2c] focus:border-[#5a32fa] outline-none font-mono text-xs"
                />
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-500">Supported formats: MP4, WebM</span>
                  <button 
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="text-[#5a32fa] dark:text-[#ff90e8] font-bold hover:underline"
                  >
                    Upload from device
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Company</label>
                  <input 
                    type="text" 
                    value={editForm.company} 
                    onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={editForm.location} 
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Education</label>
                <input 
                  type="text" 
                  value={editForm.education} 
                  onChange={(e) => setEditForm({...editForm, education: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">About / Biography</label>
                <textarea 
                  rows={4}
                  value={editForm.bio} 
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Practice Areas (comma separated)</label>
                <input 
                  type="text" 
                  value={editForm.practiceAreas} 
                  onChange={(e) => setEditForm({...editForm, practiceAreas: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Skills (comma separated)</label>
                <input 
                  type="text" 
                  value={editForm.skills} 
                  onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-5 py-2 text-sm font-bold bg-[#5a32fa] hover:bg-[#4a24db] text-white rounded-xl flex items-center gap-2"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SHARE PROFILE / QR MODAL ================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151c2c] w-full max-w-sm rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-2xl text-center">
            <div className="flex justify-end">
              <button onClick={() => setIsShareModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              {profileData.name.charAt(0)}
            </div>

            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{profileData.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">{profileData.role}</p>

            <div className="p-4 bg-white rounded-2xl shadow-inner inline-block border mb-6">
              <QRCodeCanvas value={`https://wipa.org/u/${profileData.memberId || 'janedoe'}`} size={160} />
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(`https://wipa.org/u/${profileData.memberId || 'janedoe'}`);
                alert('Profile link copied!');
              }}
              className="w-full py-3 bg-[#5a32fa] hover:bg-[#4a24db] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Copy size={16} /> Copy Profile Link
            </button>
          </div>
        </div>
      )}

      {/* ================= SETTINGS & PASSWORD MODAL ================= */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151c2c] w-full max-w-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings size={18} /> Account Settings
              </h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">New Password</label>
                <input 
                  type="password"
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#5a32fa] outline-none"
                />
              </div>

              {passwordStatus.message && (
                <p className={`text-xs ${passwordStatus.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {passwordStatus.message}
                </p>
              )}

              <button 
                onClick={async () => {
                  if (!passwordForm.newPassword) return;
                  setPasswordStatus({ type: 'loading', message: 'Updating password...' });
                  const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
                  if (error) {
                    setPasswordStatus({ type: 'error', message: error.message });
                  } else {
                    setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
                    setTimeout(() => setIsSettingsModalOpen(false), 1500);
                  }
                }}
                className="w-full py-2.5 bg-[#5a32fa] hover:bg-[#4a24db] text-white font-bold rounded-xl transition-all"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
