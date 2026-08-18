// @ts-nocheck
'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { 
  BadgeCheck, MapPin, Link as LinkIcon, Users, Mail, MessageSquare, Briefcase, GraduationCap,
  Hash, ThumbsUp, Share2, Send, UserPlus, X, PlayCircle, Star, Copy, Globe2,
  CheckCircle2, Clock, MessageCircle, Repeat2, UserCheck, Play, ArrowLeft, Loader2,
  FileText, ArrowUpRight
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DEFAULT_MOCK_VIDEO = 'https://media.w3.org/2010/05/sintel/trailer.mp4';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const profileId = unwrappedParams.id;
  
  const { user } = useAppStore();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending_sent' | 'pending_received' | 'accepted'>('none');
  const [activeTab, setActiveTab] = useState<'activity' | 'about' | 'experience' | 'education' | 'skills'>('activity');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());

  const toggleExpandPost = (postId: string) => {
    setExpandedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const [profileData, setProfileData] = useState({
    id: '',
    name: 'WIPA Member',
    role: 'Intellectual Property Specialist | WIPA Member',
    company: 'International IP Practice',
    experienceYears: 5,
    education: 'Law & Technology Institute',
    location: 'Global',
    bio: 'Dedicated IP practitioner and active contributor to the Women in Intellectual Property Alliance.',
    linkedin: '',
    website: '',
    practiceAreas: 'Patents, Trademarks, IP Strategy, Licensing',
    skills: 'Patent Drafting, Trademark Portfolio, IP Litigation, Trade Secrets',
    avatarUrl: '',
    coverUrl: '',
    introVideoUrl: DEFAULT_MOCK_VIDEO,
    memberId: '',
    verificationStatus: 'verified',
    isWipaRecommended: false,
    businessProfile: null as any
  });

  const [stats, setStats] = useState({ connections: 84, followers: 310, posts: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Query by either UUID or member_id
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`id.eq.${profileId},member_id.eq.${profileId}`)
          .maybeSingle();
          
        if (data) {
          const resolvedId = data.id;
          
          setProfileData({
            id: resolvedId,
            name: data.full_name || 'WIPA Member',
            role: data.role || 'Intellectual Property Specialist | WIPA Member',
            company: data.company || 'International IP Practice',
            experienceYears: data.experience_years || 5,
            education: data.education || 'Law & Technology Institute',
            location: data.country || 'Global',
            bio: data.bio || 'Dedicated IP practitioner and active contributor to the Women in Intellectual Property Alliance.',
            linkedin: data.linkedin_url || '',
            website: data.website_url || '',
            practiceAreas: data.practice_area || 'Patents, Trademarks, IP Strategy, Licensing',
            skills: data.skills || 'Patent Drafting, Trademark Portfolio, IP Litigation, Trade Secrets',
            avatarUrl: data.avatar_url || '',
            coverUrl: data.cover_url || '',
            introVideoUrl: data.intro_video_url || DEFAULT_MOCK_VIDEO,
            memberId: data.member_id || '',
            verificationStatus: data.verification_status || 'verified',
            isWipaRecommended: data.is_wipa_recommended ?? false,
            businessProfile: null
          });

          // Fetch posts by this author
          const { data: postsData } = await supabase
            .from('feed_posts')
            .select(`
              *,
              author:profiles!feed_posts_author_id_fkey(full_name, avatar_url, role, is_wipa_recommended)
            `)
            .eq('author_id', resolvedId)
            .order('created_at', { ascending: false });

          if (postsData) {
            setUserPosts(postsData);
            setStats(prev => ({ ...prev, posts: postsData.length }));
          }

          // Fetch connection status if current user is logged in
          if (user?.id && user.id !== resolvedId) {
            const { data: conn } = await supabase
              .from('connections')
              .select('*')
              .or(`and(requester_id.eq.${user.id},recipient_id.eq.${resolvedId}),and(requester_id.eq.${resolvedId},recipient_id.eq.${user.id})`)
              .maybeSingle();

            if (conn) {
              if (conn.status === 'accepted') {
                setConnectionStatus('accepted');
              } else if (conn.requester_id === user.id) {
                setConnectionStatus('pending_sent');
              } else {
                setConnectionStatus('pending_received');
              }
            }

            // Fetch liked posts
            const { data: likesData } = await supabase
              .from('feed_likes')
              .select('post_id')
              .eq('user_id', user.id);

            if (likesData) {
              setLikedPostIds(new Set(likesData.map(l => l.post_id)));
            }
          }
        }
      } catch (err) {
        console.error("Error fetching member profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, user?.id]);

  const handleConnect = async () => {
    if (!user?.id || !profileData.id || profileData.id === user.id) return;
    setIsConnecting(true);
    try {
      if (connectionStatus === 'none') {
        await supabase.from('connections').insert({
          requester_id: user.id,
          recipient_id: profileData.id,
          status: 'pending'
        });
        setConnectionStatus('pending_sent');
      } else if (connectionStatus === 'pending_received') {
        await supabase
          .from('connections')
          .update({ status: 'accepted' })
          .match({ requester_id: profileData.id, recipient_id: user.id });
        setConnectionStatus('accepted');
      }
    } catch (e) {
      console.error('Error updating connection:', e);
    } finally {
      setIsConnecting(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] dark:bg-[#0b0f19]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-[#5a32fa]" />
          <p className="text-sm font-semibold text-gray-500">Loading member profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 font-sans pb-20">
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
        
        {/* Back navigation button */}
        <button 
          onClick={() => router.back()}
          className="mb-3 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-[#5a32fa] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Network
        </button>

        {/* ================= HERO PROFILE CARD ================= */}
        <div className="bg-white dark:bg-[#151c2c] rounded-2xl md:rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-6">
          
          {/* Cover Photo */}
          <div 
            className="h-44 sm:h-64 md:h-80 w-full relative bg-gradient-to-r from-[#5a32fa] via-[#7952ff] to-[#ff90e8] overflow-hidden"
            style={{ 
              backgroundImage: profileData.coverUrl ? `url(${profileData.coverUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!profileData.coverUrl && (
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_3px,transparent_3px)] [background-size:24px_24px]" />
            )}
          </div>

          {/* Profile Header Info */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-24 mb-4">
              
              {/* Avatar + Rainbow Gradient Story Ring */}
              <div className="relative group self-start">
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

                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle size={44} className="text-white drop-shadow-lg" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-[#5a32fa] text-white p-1.5 rounded-full shadow-md border-2 border-white dark:border-[#151c2c] flex items-center justify-center">
                    <Play size={12} className="fill-white" />
                  </div>
                </div>
              </div>

              {/* Action Buttons for Viewing Member */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
                
                {/* Watch Story Button */}
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-4 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-[#5a32fa] hover:from-pink-600 hover:to-[#4a24db] text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <Play size={16} className="fill-white" /> Watch Story
                </button>

                {/* Connect Action Button */}
                {user?.id !== profileData.id && (
                  <button 
                    onClick={handleConnect}
                    disabled={isConnecting || connectionStatus === 'pending_sent'}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-sm transition-all ${
                      connectionStatus === 'accepted'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : connectionStatus === 'pending_sent'
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        : 'bg-[#5a32fa] hover:bg-[#4a24db] text-white'
                    }`}
                  >
                    {isConnecting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : connectionStatus === 'accepted' ? (
                      <><UserCheck size={16} /> Connected</>
                    ) : connectionStatus === 'pending_sent' ? (
                      <><Clock size={16} /> Request Pending</>
                    ) : (
                      <><UserPlus size={16} /> Connect</>
                    )}
                  </button>
                )}

                {/* Direct Message Button */}
                <Link 
                  href={`/platform/messages?user=${profileData.id}`}
                  className="px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <MessageSquare size={16} /> Message
                </Link>

                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  title="Share Profile"
                >
                  <Share2 size={18} />
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
              </div>
            </div>

            {/* Profile Navigation Tabs */}
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

        {/* ================= 2-COLUMN MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ================= LEFT STREAM ================= */}
          <div className="lg:col-span-2 space-y-6">

            {/* TAB 1: POSTS & ACTIVITY */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                {userPosts.length === 0 ? (
                  <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center space-y-3 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-[#5a32fa]/10 text-[#5a32fa] flex items-center justify-center mx-auto">
                      <MessageSquare size={22} />
                    </div>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white">No posts published yet</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                      {profileData.name} hasn't published any posts yet.
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
                              style={{ backgroundImage: profileData.avatarUrl ? `url(${profileData.avatarUrl})` : undefined, backgroundSize: 'cover' }}
                            >
                              {!profileData.avatarUrl && profileData.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{profileData.name}</h4>
                                <BadgeCheck size={14} className="text-[#00d26a]" />
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{profileData.role.split('|')[0]}</p>
                              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                {new Date(post.created_at).toLocaleDateString()} • <Globe2 size={10} />
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* LinkedIn-Style Content */}
                        {post.content && (
                          <div className="mb-3">
                            <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                              {post.content.length > 180 && !expandedPosts.has(post.id)
                                ? `${post.content.slice(0, 180)}...`
                                : post.content}
                              {post.content.length > 180 && !expandedPosts.has(post.id) && (
                                <button
                                  onClick={() => toggleExpandPost(post.id)}
                                  className="text-gray-500 hover:text-[#5a32fa] dark:text-gray-400 dark:hover:text-[#ff90e8] font-bold text-xs ml-1"
                                >
                                  ...read more
                                </button>
                              )}
                            </p>
                            {post.content.length > 180 && expandedPosts.has(post.id) && (
                              <button
                                onClick={() => toggleExpandPost(post.id)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-medium mt-1 block"
                              >
                                Show less
                              </button>
                            )}
                          </div>
                        )}

                        {/* Post Media Attachments (Images, Videos, Documents/PDFs) */}
                        {post.media_urls && post.media_urls.length > 0 && post.media_urls.map((url: string, mIdx: number) => {
                          const isVideo = post.media_type === 'video' || url.match(/\.(mp4|webm|mov|ogg)$/i);
                          const isDoc = post.media_type === 'doc' || url.match(/\.(pdf|doc|docx|txt)$/i);

                          if (isVideo) {
                            return (
                              <div key={mIdx} className="mb-4 rounded-xl sm:rounded-2xl overflow-hidden bg-black/95 dark:bg-black shadow-sm flex items-center justify-center border border-gray-100 dark:border-white/10">
                                <video 
                                  src={url} 
                                  controls 
                                  playsInline 
                                  preload="metadata"
                                  className="w-full h-auto max-h-[75vh] sm:max-h-[560px] object-contain mx-auto block" 
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
                                className="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 hover:border-[#5a32fa] transition-all mb-4 group/doc shadow-sm"
                              >
                                <div className="flex items-center gap-3.5 overflow-hidden">
                                  <div className="w-11 h-11 rounded-xl bg-[#5a32fa] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                                    <FileText size={22} />
                                  </div>
                                  <div className="overflow-hidden">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover/doc:text-[#5a32fa] transition-colors">
                                      {post.document_name || 'Legal Document / PDF'}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Click to view & download document</p>
                                  </div>
                                </div>
                                <ArrowUpRight size={18} className="text-gray-400 group-hover/doc:text-[#5a32fa] group-hover/doc:translate-x-0.5 group-hover/doc:-translate-y-0.5 transition-transform shrink-0" />
                              </a>
                            );
                          }

                          return (
                            <div key={mIdx} className="mb-4 rounded-xl sm:rounded-2xl overflow-hidden bg-black/5 dark:bg-black/60 shadow-sm flex items-center justify-center border border-gray-100/80 dark:border-white/10">
                              <img 
                                src={url} 
                                alt="Post attachment" 
                                className="w-full h-auto max-h-[75vh] sm:max-h-[580px] object-contain rounded-xl sm:rounded-2xl hover:opacity-98 transition-opacity md:cursor-pointer block mx-auto"
                                onClick={() => {
                                  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                                    setPreviewModalImage(url);
                                  }
                                }}
                              />
                            </div>
                          );
                        })}

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

                          <Link 
                            href="/platform"
                            className="flex-1 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 transition-colors text-center"
                          >
                            <MessageCircle size={16} />
                            <span>Comment</span>
                          </Link>

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
            )}

            {/* TAB 2: ABOUT SECTION */}
            {(activeTab === 'about' || activeTab === 'activity') && (
              <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {profileData.bio}
                </p>

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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Experience</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center text-xl shrink-0">
                      ⚖️
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">{profileData.role}</h4>
                      <p className="text-sm font-semibold text-[#5a32fa] dark:text-[#ff90e8]">{profileData.company}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{profileData.experienceYears} yrs Experience · {profileData.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: EDUCATION & CERTIFICATIONS */}
            {(activeTab === 'education' || activeTab === 'activity') && (
              <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Education & Honors</h3>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-xl shrink-0">
                    🎓
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">{profileData.education}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Master of Laws & Intellectual Property</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SKILLS & ENDORSEMENTS */}
            {(activeTab === 'skills' || activeTab === 'activity') && (
              <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Skills & Endorsements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profileData.skills.split(',').map((skill, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{skill.trim()}</span>
                      <button 
                        onClick={() => alert(`Endorsed ${skill.trim()} for ${profileData.name}! 🌟`)}
                        className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-[#5a32fa] hover:text-white hover:border-[#5a32fa] transition-all"
                      >
                        Endorse
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <div className="space-y-6">
            
            {/* Public Profile Link Card */}
            <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Public Profile Handle</h3>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-xl text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">
                <span className="truncate">wipa.org/u/{profileData.memberId?.toLowerCase() || 'member'}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`https://wipa.org/u/${profileData.memberId || 'member'}`);
                    alert('Profile link copied!');
                  }}
                  className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors text-[#5a32fa] dark:text-[#ff90e8]"
                  title="Copy Link"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            {/* Recommendations / Peers */}
            <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Other WIPA Leaders</h3>
              <div className="space-y-3.5">
                {[
                  { name: 'Dr. Shweta Singh', role: 'Founder & CEO, Ennoble IP', img: '/Dr Shweta_AIPPI (1).png' },
                  { name: 'Adriana Barrera', role: 'Partner, BARLAW Peru', img: '/10.jpg' },
                  { name: 'Nadine Stuttle', role: 'CEO, PSS Solutions Switzerland', img: '/Nadine Stuttle Picture.jpg' }
                ].map((person, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/platform/board-members')}>
                    <div 
                      className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0"
                      style={{ backgroundImage: `url("${person.img}")`, backgroundSize: 'cover', backgroundPosition: 'top' }}
                    />
                    <div className="overflow-hidden flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate group-hover:text-[#5a32fa] transition-colors">{person.name}</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{person.role}</p>
                    </div>
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

              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="w-full bg-black flex items-center justify-center min-h-[380px] max-h-[70vh] relative">
              <video 
                key={profileData.introVideoUrl}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="w-full h-full object-contain max-h-[65vh]"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_MOCK_VIDEO;
                }}
              >
                <source src={profileData.introVideoUrl || DEFAULT_MOCK_VIDEO} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            </div>

            <div className="p-4 bg-gray-900/90 text-center text-xs text-gray-400 border-t border-white/5">
              <span>🌟 WIPA Video Introductions • Empowering Women in IP</span>
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
              <QRCodeCanvas value={`https://wipa.org/u/${profileData.memberId || profileData.id}`} size={160} />
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(`https://wipa.org/u/${profileData.memberId || profileData.id}`);
                alert('Profile link copied!');
              }}
              className="w-full py-3 bg-[#5a32fa] hover:bg-[#4a24db] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Copy size={16} /> Copy Profile Link
            </button>
          </div>
        </div>
      )}

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
