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
  UserPlus
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
    memberId: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
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
          memberId: data.member_id || ''
        });
      }
      setIsLoading(false);
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
      // Fetch connections count
      const { count: connectionsCount } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted')
        .or(`requester_id.eq.${profileId},recipient_id.eq.${profileId}`);
        
      // Fetch posts count
      const { count: postsCount } = await supabase
        .from('feed_posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', profileId);

      setStats({
        connections: connectionsCount || 0,
        followers: connectionsCount || 0, // Using connections count for followers as a proxy for now
        posts: postsCount || 0
      });
    };
    
    fetchProfile();
    fetchConnectionStatus();
    fetchStats();
    
    // Listen for realtime updates to connection status (e.g. they accept the request while we are looking at their profile)
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
    return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]"><p className="font-bold text-gray-500">Loading Profile...</p></div>;
  }

  return (
    <div className="min-h-screen">
      <div className="w-full flex gap-6 lg:gap-8 items-start px-4 md:px-8 lg:px-12 bg-[#f8f9fa] min-h-[calc(100vh-73px)]">

          <div className="flex-1 space-y-8 min-w-0 pt-6 pb-24">
            
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden relative">
              <div 
                className="h-40 md:h-56 relative border-b-4 border-gray-200 bg-indigo-50 overflow-hidden"
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
                     <div className="absolute top-10 left-10 w-20 h-20 bg-pink-50 border border-gray-200 rounded-full mix-blend-multiply opacity-50 animate-pulse"></div>
                     <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-50 border border-gray-200 rotate-12 mix-blend-multiply opacity-50"></div>
                  </>
                )}
              </div>
              
              <div className="px-6 md:px-12 pb-10 relative flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="-mt-16 md:-mt-20 relative z-10 flex-shrink-0">
                  <div 
                    className="w-28 h-28 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-[#ff90e8] to-[#5a32fa] text-white flex items-center justify-center text-5xl md:text-7xl font-bold border border-gray-200 shadow-md rotate-3 hover:rotate-0 transition-transform duration-300 relative overflow-hidden"
                    style={{ backgroundImage: profileData.avatarUrl ? `url(${profileData.avatarUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    {!profileData.avatarUrl && profileData.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <div className="flex-1 pt-4 md:pt-6 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                  <div>
                    <div className="flex items-center gap-4 mb-2 flex-wrap">
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
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
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-bold text-gray-600">
                      <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-transparent">
                        <MapPin size={18} className="text-[#ff4b4b]" /> {profileData.location}
                      </span>
                      {profileData.linkedin && (
                        <a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-transparent hover:border-gray-200 hover:shadow-[2px_2px_0px_0px_#131313] transition-all cursor-pointer">
                          <LinkIcon size={18} className="text-gray-900" /> {profileData.linkedin}
                        </a>
                      )}
                      {profileData.website && (
                        <a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-transparent hover:border-gray-200 hover:shadow-[2px_2px_0px_0px_#131313] transition-all cursor-pointer">
                          <LinkIcon size={18} className="text-gray-900" /> {profileData.website}
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
                      className="flex-1 xl:flex-none bg-white text-gray-900 p-4 rounded-2xl font-bold border border-gray-200 shadow-sm hover:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center"
                    >
                      <Share2 size={24} />
                    </button>
                    {connectionStatus === 'accepted' && (
                      <Link 
                        href={`/platform/messages?userId=${profileId}`}
                        className="flex-1 xl:flex-none bg-indigo-50 text-indigo-600 p-4 rounded-2xl font-bold border border-gray-200 shadow-sm hover:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center"
                      >
                        <Send size={24} />
                      </Link>
                    )}
                    {profileId !== user?.id && connectionStatus === 'pending_received' ? (
                      <>
                        <button 
                          onClick={handleAccept}
                          disabled={isConnecting}
                          className="flex-1 xl:flex-none px-8 py-4 rounded-2xl font-bold text-lg border border-gray-200 shadow-sm hover:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center gap-3 bg-[#00d26a] text-white"
                        >
                          {isConnecting ? <span className="animate-pulse">Accepting...</span> : <><CheckCircle2 size={24} /> Accept Request</>}
                        </button>
                        <button 
                          onClick={handleReject}
                          disabled={isConnecting}
                          className="flex-1 xl:flex-none px-8 py-4 rounded-2xl font-bold text-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                        >
                          Ignore
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={handleConnect}
                        disabled={isConnecting || connectionStatus !== 'none' || profileId === user?.id}
                        className={`flex-1 xl:flex-none px-8 py-4 rounded-2xl font-bold text-lg border border-gray-200 shadow-sm hover:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center gap-3 ${connectionStatus !== 'none' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : profileId === user?.id ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-[#00d26a] text-white'}`}
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
              <div className="bg-pink-50 p-8 rounded-2xl border border-gray-200 shadow-md hover:-translate-y-2 transition-transform cursor-pointer">
                <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-2">{stats.connections}</h3>
                <p className="text-lg lg:text-xl font-bold text-gray-900/80">Connections</p>
              </div>
              <div className="bg-[#5a32fa] p-8 rounded-2xl border border-gray-200 shadow-md hover:-translate-y-2 transition-transform cursor-pointer">
                <h3 className="text-5xl lg:text-6xl font-bold text-white mb-2">{stats.followers}</h3>
                <p className="text-lg lg:text-xl font-bold text-white/80">Followers</p>
              </div>
              <div className="bg-yellow-50 p-8 rounded-2xl border border-gray-200 shadow-md hover:-translate-y-2 transition-transform cursor-pointer">
                <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-2">{stats.posts}</h3>
                <p className="text-lg lg:text-xl font-bold text-gray-900/80">Posts</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100%] opacity-20 pointer-events-none"></div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                    About
                  </h3>
                  <p className="text-gray-800 font-medium text-lg leading-relaxed">
                    {profileData.bio}
                  </p>
                </div>
                
                <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-md">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center justify-between">
                    Experience
                  </h3>
                  
                  <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[28px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gray-200">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-indigo-50 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 text-2xl">
                        ⚖️
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:-translate-y-1 transition-transform">
                        <h4 className="text-xl font-bold text-gray-900">Senior IP Counsel</h4>
                        <p className="text-base font-bold text-[#5a32fa] mb-2">TechLaw Partners LLP</p>
                        <p className="text-sm font-bold text-gray-500 mb-4 bg-gray-100 inline-block px-3 py-1 rounded-lg">Jan 2021 - Present</p>
                        <p className="text-base text-gray-700 font-medium leading-relaxed">
                          Leading the technology patent division, advising Fortune 500 companies on software patentability, and navigating complex cross-border trademark disputes.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-[#ff4b4b] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 text-2xl">
                        🏢
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:-translate-y-1 transition-transform">
                        <h4 className="text-xl font-bold text-gray-900">Associate Attorney</h4>
                        <p className="text-base font-bold text-[#5a32fa] mb-2">Global IP Solutions</p>
                        <p className="text-sm font-bold text-gray-500 mb-4 bg-gray-100 inline-block px-3 py-1 rounded-lg">Jun 2017 - Dec 2020</p>
                        <p className="text-base text-gray-700 font-medium leading-relaxed">
                          Drafted and prosecuted over 100 patent applications across mechanical and software domains. Conducted extensive FTO analyses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="bg-[#5a32fa] text-white p-8 rounded-3xl border border-gray-200 shadow-[8px_8px_0px_0px_#5a32fa]">
                  <h3 className="text-2xl font-bold mb-6 text-[#00d26a]">Highlights</h3>
                  <div className="space-y-5">
                    <div className="bg-white/10 p-5 rounded-2xl border-2 border-transparent hover:border-white/30 transition-colors cursor-pointer group">
                      <p className="text-sm font-bold text-[#ff90e8] mb-2 uppercase tracking-wider">Published Article</p>
                      <p className="text-base font-bold group-hover:text-white transition-colors">"The Impact of Generative AI on Modern Copyright Frameworks"</p>
                    </div>
                    <div className="bg-white/10 p-5 rounded-2xl border-2 border-transparent hover:border-white/30 transition-colors cursor-pointer group">
                      <p className="text-sm font-bold text-[#ffc900] mb-2 uppercase tracking-wider">Upcoming Speaker</p>
                      <p className="text-base font-bold group-hover:text-white transition-colors">London Legal Tech Summit 2026</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {profileData.practiceAreas.split(',').map((area, idx) => {
                      const colors = ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'];
                      const color = colors[idx % colors.length];
                      const textColor = color === '#5a32fa' ? 'text-white' : 'text-gray-900';
                      return (
                        <span key={idx} className={`bg-[${color}] ${textColor} px-4 py-2.5 rounded-xl text-sm font-bold border border-gray-100 shadow-[2px_2px_0px_0px_#131313] hover:-translate-y-1 transition-transform cursor-default`} style={{backgroundColor: color}}>
                          {area.trim()}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                    Memberships
                  </h3>
                  <div className="space-y-4">
                    {[
                      { id: 'ip_professional', title: 'IP Professionals', icon: '⚖️' },
                      { id: 'startup', title: 'Start-Ups & Emerging', icon: '🏢' },
                      { id: 'student', title: 'Students & Alumni', icon: '🎓' }
                    ].map((tier) => {
                      const isActive = profileData.membershipTier === tier.id;
                      return (
                        <div 
                          key={tier.id} 
                          className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                            isActive 
                              ? 'border-[#5a32fa] bg-indigo-50' 
                              : 'border-gray-100 bg-gray-50 opacity-60 grayscale'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                            isActive ? 'bg-[#5a32fa] text-white border-2 border-transparent shadow-sm' : 'bg-gray-200'
                          }`}>
                            {tier.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{tier.title}</h4>
                            {isActive ? (
                              <span className="text-xs font-bold text-[#00d26a] flex items-center gap-1">
                                <BadgeCheck size={14} /> Active
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-gray-400">Inactive</span>
                            )}
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
    </div>
  );
}
