'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { 
  BadgeCheck, 
  MapPin, 
  Link as LinkIcon,
  LayoutGrid,
  Users,
  Mail,
  UsersRound,
  MessageSquare,
  BookOpen,
  Calendar,
  FileText,
  Briefcase,
  GraduationCap,
  Hash,
  BellOff,
  ArrowUpRight,
  Circle,
  CheckCircle2,
  ThumbsUp,
  Share2,
  Send,
  UserPlus,
  X,
  PlayCircle,
  Award,
  BrainCircuit
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const profileId = unwrappedParams.id;
  
  const { user } = useAppStore();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending_sent' | 'pending_received' | 'accepted'>('none');
  const [stats, setStats] = useState({ connections: 0, followers: 0, posts: 0 });
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'posts' | 'achievements'>('posts');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'Loading...',
    role: 'WIPA Member',
    location: '',
    bio: '',
    linkedin: '',
    website: '',
    practiceAreas: 'General Practice',
    avatarUrl: '',
    membershipTier: 'free',
    coverUrl: '',
    memberId: '',
    isWipaRecommended: false,
    recommendedAt: null,
    businessProfile: null
  });

  const [xpData, setXpData] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, business_profiles(id, name, slug, type, logo_url)')
        .eq('id', profileId)
        .maybeSingle();
        
      if (!error && data) {
        setProfileData({
          name: data.full_name || 'Anonymous User',
          role: 'WIPA Member',
          location: data.country || 'Global',
          bio: data.bio || 'A member of the WIPA community.',
          linkedin: data.linkedin_url || '',
          website: data.website_url || '',
          practiceAreas: data.practice_area || 'Intellectual Property',
          avatarUrl: data.avatar_url || '',
          membershipTier: data.membership_tier || 'free',
          coverUrl: data.cover_url || '',
          memberId: data.member_id || '',
          isWipaRecommended: data.is_wipa_recommended || false,
          recommendedAt: data.recommended_at || null,
          businessProfile: data.business_profiles
        });
      }
      setIsLoading(false);
    };

    const fetchGamification = async () => {
        const { data: followings } = await supabase.from('connections').select('*').eq('requester_id', profileId);
        setFollowingCount(followings?.length || 0);
        const { data: followers } = await supabase.from('connections').select('*').eq('recipient_id', profileId);
        setFollowersCount(followers?.length || 0);

        const { data: xp } = await supabase.from('member_xp').select('*').eq('user_id', profileId).single();
        if (xp) setXpData(xp);

        const { data: achs } = await supabase
          .from('member_achievements')
          .select('*, achievement:achievements(*)')
          .eq('user_id', profileId);
        if (achs) setAchievements(achs.map(a => a.achievement));

        const { data: quizzes } = await supabase
          .from('quiz_attempts')
          .select('*, quiz:quizzes(title, category, difficulty)')
          .eq('user_id', profileId)
          .order('completed_at', { ascending: false });
        if (quizzes) setQuizAttempts(quizzes);
    };

    const fetchConnectionStatus = async () => {
      if (!user?.id || profileId === user?.id) return;
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .or(`and(requester_id.eq.${user.id},recipient_id.eq.${profileId}),and(requester_id.eq.${profileId},recipient_id.eq.${user.id})`)
        .maybeSingle();
        
      if (data) {
        if (data.status === 'accepted') {
          setConnectionStatus('accepted');
        } else if (data.status === 'pending') {
          setConnectionStatus(data.requester_id === user.id ? 'pending_sent' : 'pending_received');
        }
      }
    };
    const fetchStats = async () => {
      const { count: connectionsCount } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted')
        .or(`requester_id.eq.${profileId},recipient_id.eq.${profileId}`);
        
      const { count: postsCount } = await supabase
        .from('feed_posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', profileId);

      setStats({
        connections: connectionsCount || 0,
        followers: connectionsCount || 0,
        posts: postsCount || 0
      });
    };
    
    fetchProfile();
    fetchGamification();
    fetchConnectionStatus();
    fetchStats();
    
    const channel = supabase.channel(`connection-${user?.id}-${profileId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'connections',
      }, (payload) => {
        const row = payload.new as any;
        if (
          (row.requester_id === user?.id && row.recipient_id === profileId) ||
          (row.requester_id === profileId && row.recipient_id === user?.id)
        ) {
          if (row.status === 'accepted') {
            setConnectionStatus('accepted');
          }
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, user?.id]);
  const handleConnect = async () => {
    if (!user || !user.id || profileId === user.id) return;
    setIsConnecting(true);
    
    const { error: connError } = await supabase.from('connections').insert({
      requester_id: user.id,
      recipient_id: profileId,
      status: 'pending'
    });

    if (!connError) {
      await supabase.from('notifications').insert({
        user_id: profileId,
        actor_id: user.id,
        type: 'connection_request',
        content: `${user.name || 'Someone'} sent you a connection request!`,
        link: `/platform/profile/${user.id}`,
        is_read: false
      });
      setConnectionStatus('pending_sent');
    }
    
    setIsConnecting(false);
  };

  const handleAccept = async () => {
    if (!user || !user.id || profileId === user.id) return;
    setIsConnecting(true);
    
    const { error: connError } = await supabase.from('connections')
      .update({ status: 'accepted' })
      .match({ requester_id: profileId, recipient_id: user.id });

    if (!connError) {
      await supabase.from('notifications').insert({
        user_id: profileId,
        actor_id: user.id,
        type: 'connection_accepted',
        content: `${user.name || 'Someone'} accepted your connection request!`,
        link: `/platform/profile/${user.id}`,
        is_read: false
      });
      setConnectionStatus('accepted');
    }
    
    setIsConnecting(false);
  };

  const handleReject = async () => {
    if (!user || !user.id || profileId === user.id) return;
    setIsConnecting(true);
    
    const { error: connError } = await supabase.from('connections')
      .delete()
      .match({ requester_id: profileId, recipient_id: user.id, status: 'pending' });

    if (!connError) {
      setConnectionStatus('none');
    }
    
    setIsConnecting(false);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#0f172a]"><p className="font-bold text-gray-500 dark:text-gray-400">Loading Profile...</p></div>;
  }

  return (
    <div className="min-h-screen">
      <div className="w-full flex gap-6 lg:gap-8 items-start px-4 md:px-8 lg:px-12 bg-[#f8f9fa] dark:bg-[#0f172a] min-h-[calc(100vh-73px)]">

          <div className="flex-1 space-y-8 min-w-0 pt-6 pb-24">
            
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-200 dark:border-white/20 shadow-md overflow-hidden relative">
              <div 
                className="h-40 md:h-56 relative border-b-4 border-gray-200 dark:border-white/20 bg-indigo-50 overflow-hidden"
                style={{ 
                  backgroundImage: profileData.coverUrl ? `url(${profileData.coverUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!profileData.coverUrl && (
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#131313_3px,transparent_3px)] [background-size:24px_24px]"></div>
                )}
                {!profileData.coverUrl && (
                  <>
                     <div className="absolute top-10 left-10 w-20 h-20 bg-pink-50 border border-gray-200 dark:border-white/20 rounded-full mix-blend-multiply opacity-50 animate-pulse"></div>
                     <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-50 border border-gray-200 dark:border-white/20 rotate-12 mix-blend-multiply opacity-50"></div>
                  </>
                )}
              </div>
              
              <div className="px-6 md:px-12 pb-10 relative flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="-mt-16 md:-mt-20 relative z-10 flex-shrink-0">
                  <div className="p-1 rounded-[1.2rem] bg-gradient-to-tr from-yellow-400 via-pink-500 to-[#5a32fa] animate-gradient cursor-pointer hover:scale-105 transition-transform duration-300 shadow-xl" onClick={() => setIsVideoModalOpen(true)}>
                    <div 
                      className="w-28 h-28 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-[#ff90e8] to-[#5a32fa] text-white flex items-center justify-center text-5xl md:text-7xl font-bold border-4 border-white dark:border-[#0f172a] shadow-inner relative overflow-hidden group"
                      style={{ backgroundImage: profileData.avatarUrl ? `url(${profileData.avatarUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      {!profileData.avatarUrl && profileData.name.charAt(0).toUpperCase()}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle size={40} className="text-white drop-shadow-md" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 pt-4 md:pt-6 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                  <div>
                    <div className="flex items-center gap-4 mb-2 flex-wrap">
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                        {profileData.name}
                        <BadgeCheck size={32} className="text-[#00d26a]" />
                      </h1>
                      {profileData.memberId && (
                        <span className="bg-[#5a32fa]/10 text-[#5a32fa] px-3 py-1 rounded-full text-sm font-bold border-2 border-[#5a32fa]/20 flex items-center gap-1">
                          <Hash size={14} /> {profileData.memberId}
                        </span>
                      )}
                    </div>
                    <p className="text-lg md:text-xl font-bold text-[#5a32fa] mb-4">{profileData.role}</p>
                    
                    {profileData.isWipaRecommended && (
                      <div className="group relative inline-flex items-center gap-2 mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-default">
                        <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
                        <span className="relative z-10 font-bold tracking-wide">⭐ Recommended by WIPA</span>
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          This member has been personally verified and recommended by the WIPA team
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-bold text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-4 py-2 rounded-xl border-2 border-transparent">
                        <MapPin size={18} className="text-[#ff4b4b]" /> {profileData.location}
                      </span>
                      {profileData.linkedin && (
                        <a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-4 py-2 rounded-xl border-2 border-transparent hover:border-gray-200 dark:border-white/20 hover:shadow-[2px_2px_0px_0px_#131313] transition-all cursor-pointer">
                          <LinkIcon size={18} className="text-gray-900 dark:text-white" /> {profileData.linkedin}
                        </a>
                      )}
                      {profileData.website && (
                        <a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-4 py-2 rounded-xl border-2 border-transparent hover:border-gray-200 dark:border-white/20 hover:shadow-[2px_2px_0px_0px_#131313] transition-all cursor-pointer">
                          <LinkIcon size={18} className="text-gray-900 dark:text-white" /> {profileData.website}
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 w-full xl:w-auto">
                    <button 
                      onClick={() => {
                        if (profileData.memberId) {
                          navigator.clipboard.writeText(`${window.location.origin}/u/${profileData.memberId}`);
                          alert("Public profile link copied to clipboard!");
                        } else {
                          alert("Member ID not found.");
                        }
                      }}
                      title="Share Public Profile"
                      className="flex-1 xl:flex-none bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white p-4 rounded-2xl font-bold border border-gray-200 dark:border-white/20 shadow-sm hover:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center"
                    >
                      <Share2 size={24} />
                    </button>
                    {connectionStatus === 'accepted' && (
                      <Link 
                        href={`/platform/messages?userId=${profileId}`}
                        className="flex-1 xl:flex-none bg-indigo-50 text-indigo-600 p-4 rounded-2xl font-bold border border-gray-200 dark:border-white/20 shadow-sm hover:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center"
                      >
                        <Send size={24} />
                      </Link>
                    )}
                    {profileId !== user?.id && connectionStatus === 'pending_received' ? (
                      <>
                        <button 
                          onClick={handleAccept}
                          disabled={isConnecting}
                          className="flex-1 xl:flex-none px-8 py-4 rounded-2xl font-bold text-lg border border-gray-200 dark:border-white/20 shadow-sm hover:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center gap-3 bg-[#00d26a] text-white"
                        >
                          {isConnecting ? <span className="animate-pulse">Accepting...</span> : <><CheckCircle2 size={24} /> Accept Request</>}
                        </button>
                        <button 
                          onClick={handleReject}
                          disabled={isConnecting}
                          className="flex-1 xl:flex-none px-8 py-4 rounded-2xl font-bold text-lg border border-gray-200 dark:border-white/20 bg-white dark:bg-[#0f172a] text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:bg-white/5 hover:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                        >
                          Ignore
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={handleConnect}
                        disabled={isConnecting || connectionStatus !== 'none' || profileId === user?.id}
                        className={`flex-1 xl:flex-none px-8 py-4 rounded-2xl font-bold text-lg border border-gray-200 dark:border-white/20 shadow-sm hover:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center gap-3 ${connectionStatus !== 'none' ? 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed' : profileId === user?.id ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-white/10' : 'bg-[#00d26a] text-white'}`}
                      >
                        {isConnecting ? (
                          <span className="animate-pulse">Processing...</span>
                        ) : connectionStatus === 'pending_sent' ? (
                          <>Request Sent</>
                        ) : connectionStatus === 'accepted' ? (
                          <><CheckCircle2 size={24} /> Connected</>
                        ) : (
                          <><UserPlus size={24} /> Connect</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-pink-50 p-8 rounded-2xl border border-gray-200 dark:border-white/20 shadow-md hover:-translate-y-2 transition-transform cursor-pointer">
                <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-2">{stats.connections}</h3>
                <p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white/80">Connections</p>
              </div>
              <div className="bg-[#5a32fa] p-8 rounded-2xl border border-gray-200 dark:border-white/20 shadow-md hover:-translate-y-2 transition-transform cursor-pointer">
                <div className="flex items-center justify-center gap-12 mt-6 pb-6 border-b border-gray-100 dark:border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">{followersCount}</div>
                    <div className="text-sm font-bold text-white/70 uppercase tracking-wider">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">{followingCount}</div>
                    <div className="text-sm font-bold text-white/70 uppercase tracking-wider">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#00d26a]">{xpData?.level || 1}</div>
                    <div className="text-sm font-bold text-white/70 uppercase tracking-wider">Level</div>
                  </div>
                </div>

                {xpData && (
                  <div className="mt-6 px-4">
                    <div className="flex justify-between text-sm font-bold mb-2 text-white">
                      <span>Level {xpData.level}</span>
                      <span>{xpData.total_xp} / {xpData.level * 100} XP</span>
                    </div>
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#00d26a] rounded-full transition-all"
                        style={{ width: `${Math.min(100, ((xpData.total_xp % 100) / 100) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-yellow-50 p-8 rounded-2xl border border-gray-200 dark:border-white/20 shadow-md hover:-translate-y-2 transition-transform cursor-pointer">
                <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-2">{stats.posts}</h3>
                <p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white/80">Posts</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-8">
                <div className="flex gap-8 border-b border-gray-200 dark:border-white/10">
                  <button 
                    className={`font-bold pb-4 border-b-2 px-2 transition-colors ${activeTab === 'posts' ? 'border-[#5a32fa] text-[#5a32fa]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                    onClick={() => setActiveTab('posts')}
                  >
                    Posts
                  </button>
                  <button 
                    className={`font-bold pb-4 border-b-2 px-2 transition-colors ${activeTab === 'achievements' ? 'border-[#5a32fa] text-[#5a32fa]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                    onClick={() => setActiveTab('achievements')}
                  >
                    Achievements
                  </button>
                </div>

                {activeTab === 'posts' ? (
                  <div className="bg-white dark:bg-[#0f172a] p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-white/20 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100%] opacity-20 pointer-events-none"></div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-4">
                      About
                    </h3>
                    {profileData.isWipaRecommended && profileData.recommendedAt && (
                      <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
                        ⭐ Recommended since {new Date(profileData.recommendedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    )}
                    <p className="text-gray-800 dark:text-gray-100 font-medium text-lg leading-relaxed">
                      {profileData.bio}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
                      <h3 className="font-black text-xl text-gray-900 dark:text-white mb-6">Badges & Achievements</h3>
                      {achievements.length === 0 ? (
                        <div className="text-gray-500 text-center py-8">No achievements unlocked yet.</div>
                      ) : (
                        <div className="flex flex-wrap gap-4">
                          {achievements.map((ach: any) => (
                            <div key={ach.id} className="group relative flex flex-col items-center">
                              <div 
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                                style={{ backgroundColor: ach.badge_color || '#5a32fa' }}
                              >
                                <Award size={24} fill="currentColor" />
                              </div>
                              <div className="absolute top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap z-10 pointer-events-none">
                                <div className="font-black mb-1">{ach.name}</div>
                                <div className="text-gray-300 font-medium">{ach.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
                      <h3 className="font-black text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <BrainCircuit className="text-[#5a32fa]" /> Quiz History
                      </h3>
                      {quizAttempts.length === 0 ? (
                        <div className="text-gray-500 text-center py-8">No quizzes taken yet.</div>
                      ) : (
                        <div className="space-y-4">
                          {quizAttempts.map((attempt: any) => (
                            <div key={attempt.id} className="bg-gray-50 dark:bg-black/20 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100 dark:border-white/5">
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white">{attempt.quiz?.title || 'Unknown Quiz'}</div>
                                <div className="text-xs text-gray-500">{attempt.quiz?.category} • {new Date(attempt.completed_at).toLocaleDateString()}</div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="text-gray-600 dark:text-gray-400 font-bold">
                                  Score: <span className="text-gray-900 dark:text-white">{attempt.score}/{attempt.max_score}</span>
                                </div>
                                <div className="bg-[#5a32fa]/10 text-[#5a32fa] px-3 py-1 rounded-full font-black">
                                  +{attempt.xp_earned} XP
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="bg-white dark:bg-[#0f172a] p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-white/20 shadow-md">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Experience</h3>
                  <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[28px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gray-200">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 dark:border-white/20 bg-indigo-50 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 text-2xl">⚖️</div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-gray-200 dark:border-white/20 bg-white dark:bg-[#0f172a] shadow-sm hover:-translate-y-1 transition-transform">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Senior IP Counsel</h4>
                        <p className="text-base font-bold text-[#5a32fa] mb-2">TechLaw Partners LLP</p>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 bg-gray-100 dark:bg-white/10 inline-block px-3 py-1 rounded-lg">Jan 2021 - Present</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                {profileData.businessProfile && (
                  <div className="bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-gray-200 dark:border-white/20 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Business Profile</h3>
                    <Link href={`/platform/business/${profileData.businessProfile.slug}`} className="flex items-center gap-4 group p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-white/20">
                        {profileData.businessProfile.logo_url ? (
                          <img src={profileData.businessProfile.logo_url} className="w-full h-full object-cover" />
                        ) : (
                          <Briefcase className="text-gray-400" size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-[#5a32fa] transition-colors">{profileData.businessProfile.name}</h4>
                        <p className="text-sm text-gray-500 capitalize">{profileData.businessProfile.type?.replace('_', ' ')}</p>
                      </div>
                    </Link>
                  </div>
                )}
                
                <div className="bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-gray-200 dark:border-white/20 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {profileData.practiceAreas.split(',').map((area: string, idx: number) => {
                      const colors = ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'];
                      const color = colors[idx % colors.length];
                      return (
                        <span key={idx} className="bg-gray-100 dark:bg-white/5 px-4 py-2.5 rounded-xl text-sm font-bold border border-gray-200 dark:border-white/10 shadow-sm" style={{backgroundColor: color + '10', color: color}}>
                          {area.trim()}
                        </span>
                      );
                    })}
                  </div>
                </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
      </div>
      
      {/* Intro Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-[9/16]">
            <button 
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>
            <video 
              src="https://www.w3schools.com/html/mov_bbb.mp4" 
              className="w-full h-full object-cover"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}
    </div>
  );
}
