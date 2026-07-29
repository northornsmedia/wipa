'use client';
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { 
  BadgeCheck, LayoutGrid, User, Users, Mail, UserPlus, UsersRound, MessageSquare, FileText, Briefcase, GraduationCap,
  MapPin, Link as LinkIcon, Calendar, Settings, Camera, ThumbsUp
, BookOpen, X, Share2, Send
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
  const [connectionSent, setConnectionSent] = useState(false);


  const [profileData, setProfileData] = useState({
    name: 'Loading...',
    role: 'WIPA Member',
    location: '',
    bio: '',
    linkedin: '',
    website: '',
    practiceAreas: 'General Practice',
    avatarUrl: '',
    membershipTier: 'free'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
        
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
          membershipTier: data.membership_tier || 'free'
        });
      }
      setIsLoading(false);
    };
    
    fetchProfile();
  }, [profileId]);

  const handleConnect = async () => {
    if (!user || !user.id || profileId === user.id) return;
    setIsConnecting(true);
    
    const { error } = await supabase.from('notifications').insert({
      user_id: profileId,
      type: 'connection_request',
      content: `${user.name || 'Someone'} sent you a connection request!`,
      link: `/platform/profile/${user.id}`,
      is_read: false
    });
    
    setIsConnecting(false);
    if (!error) {
      setConnectionSent(true);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]"><p className="font-bold text-gray-500">Loading Profile...</p></div>;
  }

  return (
    <div className="min-h-screen">
      
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
          <button onClick={() => router.push('/platform/profile')} className="block text-center w-full py-1.5 border-2 border-[#5a32fa] bg-[#5a32fa] rounded-xl text-xs font-bold text-white transition-all mb-4">
            View Profile
          </button>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-2 px-2">MAIN NAVIGATION</p>
            <nav className="space-y-0.5">
              <Link href="/platform" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <LayoutGrid size={16} /> Feed
              </Link>
              <Link href="/platform/liked-threads" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <ThumbsUp size={16} /> Liked Threads
              </Link>
              <Link href="/platform/members" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <Users size={16} /> Members
              </Link>
              <Link href="/platform/messages" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <div className="flex items-center gap-3">
                  <Mail size={16} /> Messages
                </div>
                <span className="w-4 h-4 rounded-full bg-[#5a32fa] text-white text-[9px] font-bold flex items-center justify-center">3</span>
              </Link>
              <Link href="/platform/connections" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <UserPlus size={16} /> Connections
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
              <Link href="/platform/discussions" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <MessageSquare size={16} /> Discussions
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
              <Link href="/platform/mentorship" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <GraduationCap size={16} /> Mentorship
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* MAIN PROFILE CONTENT */}
      <div className="md:ml-[260px] lg:ml-[280px] pt-6 pb-24 px-4 md:px-8 lg:px-12 bg-[#f4f4f4] min-h-screen">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Hero Profile Card */}
          <div className="bg-white rounded-[2.5rem] border-4 border-[#131313] shadow-[12px_12px_0px_0px_#131313] overflow-hidden relative">
            {/* Massive Banner */}
            <div 
              className="h-40 md:h-56 relative border-b-4 border-[#131313] bg-[#b892ff] overflow-hidden"
            >
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#131313_3px,transparent_3px)] [background-size:24px_24px]"></div>
              {/* Floating decorative elements */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-[#ff90e8] border-4 border-[#131313] rounded-full mix-blend-multiply opacity-50 animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-32 h-32 bg-[#00d26a] border-4 border-[#131313] rotate-12 mix-blend-multiply opacity-50"></div>
            </div>
            
            <div className="px-6 md:px-12 pb-10 relative flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Giant Avatar */}
              <div className="-mt-16 md:-mt-20 relative z-10 flex-shrink-0">
                <div 
                  className="w-28 h-28 md:w-40 md:h-40 rounded-[2rem] bg-gradient-to-br from-[#ff90e8] to-[#5a32fa] text-white flex items-center justify-center text-5xl md:text-7xl font-black border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] rotate-3 hover:rotate-0 transition-transform duration-300 relative overflow-hidden"
                  style={{ backgroundImage: profileData.avatarUrl ? `url(${profileData.avatarUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {!profileData.avatarUrl && profileData.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="flex-1 pt-4 md:pt-6 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center gap-3 tracking-tight mb-2">
                    {profileData.name}
                    <BadgeCheck size={32} className="text-[#00d26a]" />
                  </h1>
                  <p className="text-lg md:text-xl font-bold text-[#5a32fa] mb-4">{profileData.role}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-bold text-gray-600">
                    <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-transparent">
                      <MapPin size={18} className="text-[#ff4b4b]" /> {profileData.location}
                    </span>
                    {profileData.linkedin && (
                      <a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-transparent hover:border-[#131313] hover:shadow-[2px_2px_0px_0px_#131313] transition-all cursor-pointer">
                        <LinkIcon size={18} className="text-[#131313]" /> {profileData.linkedin}
                      </a>
                    )}
                    {profileData.website && (
                      <a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-transparent hover:border-[#131313] hover:shadow-[2px_2px_0px_0px_#131313] transition-all cursor-pointer">
                        <LinkIcon size={18} className="text-[#131313]" /> {profileData.website}
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-4 w-full xl:w-auto">
                  <button className="flex-1 xl:flex-none bg-white text-gray-900 p-4 rounded-2xl font-black border-4 border-[#131313] shadow-[4px_4px_0px_0px_#131313] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center">
                    <Share2 size={24} />
                  </button>
                  <button className="flex-1 xl:flex-none bg-[#b892ff] text-gray-900 p-4 rounded-2xl font-black border-4 border-[#131313] shadow-[4px_4px_0px_0px_#131313] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center">
                    <Send size={24} />
                  </button>
                  <button 
                    onClick={handleConnect}
                    disabled={isConnecting || connectionSent || profileId === user?.id}
                    className={`flex-1 xl:flex-none px-8 py-4 rounded-2xl font-black text-lg border-4 border-[#131313] shadow-[4px_4px_0px_0px_#131313] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 ${connectionSent ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : profileId === user?.id ? 'opacity-50 cursor-not-allowed bg-gray-200' : 'bg-[#00d26a] text-gray-900'}`}
                  >
                    {isConnecting ? (
                      <span className="animate-pulse">Sending...</span>
                    ) : connectionSent ? (
                      <>Request Sent!</>
                    ) : (
                      <><UserPlus size={24} /> Connect</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#ff90e8] p-8 rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] hover:-translate-y-2 transition-transform cursor-pointer">
              <h3 className="text-5xl lg:text-6xl font-black text-[#131313] mb-2">542</h3>
              <p className="text-lg lg:text-xl font-bold text-[#131313]/80">Connections</p>
            </div>
            <div className="bg-[#5a32fa] p-8 rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] hover:-translate-y-2 transition-transform cursor-pointer">
              <h3 className="text-5xl lg:text-6xl font-black text-white mb-2">1.2k</h3>
              <p className="text-lg lg:text-xl font-bold text-white/80">Followers</p>
            </div>
            <div className="bg-[#ffc900] p-8 rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] hover:-translate-y-2 transition-transform cursor-pointer">
              <h3 className="text-5xl lg:text-6xl font-black text-[#131313] mb-2">45</h3>
              <p className="text-lg lg:text-xl font-bold text-[#131313]/80">Posts</p>
            </div>
          </div>
          
          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (About & Experience) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d26a] rounded-bl-[100%] opacity-20 pointer-events-none"></div>
                <h3 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-4">
                  About Me
                </h3>
                <p className="text-gray-800 font-medium text-lg leading-relaxed">
                  {profileData.bio}
                </p>
              </div>
              
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313]">
                <h3 className="text-3xl font-black text-gray-900 mb-8 flex items-center justify-between">
                  Experience
                  <button className="text-[#131313] bg-gray-100 hover:bg-[#00d26a] border-2 border-transparent hover:border-[#131313] p-3 rounded-xl transition-all font-bold text-sm flex items-center gap-2 hover:shadow-[4px_4px_0px_0px_#131313]">
                    <span className="text-xl leading-none">+</span> Add New
                  </button>
                </h3>
                
                <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[28px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gray-200">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-[#131313] bg-[#b892ff] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[4px_4px_0px_0px_#131313] z-10 text-2xl">
                      ⚖️
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border-4 border-[#131313] bg-white shadow-[4px_4px_0px_0px_#131313] hover:-translate-y-1 transition-transform">
                      <h4 className="text-xl font-black text-gray-900">Senior IP Counsel</h4>
                      <p className="text-base font-bold text-[#5a32fa] mb-2">TechLaw Partners LLP</p>
                      <p className="text-sm font-black text-gray-500 mb-4 bg-gray-100 inline-block px-3 py-1 rounded-lg">Jan 2021 - Present</p>
                      <p className="text-base text-gray-700 font-medium leading-relaxed">
                        Leading the technology patent division, advising Fortune 500 companies on software patentability, and navigating complex cross-border trademark disputes.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-[#131313] bg-[#ff4b4b] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[4px_4px_0px_0px_#131313] z-10 text-2xl">
                      🏢
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border-4 border-[#131313] bg-white shadow-[4px_4px_0px_0px_#131313] hover:-translate-y-1 transition-transform">
                      <h4 className="text-xl font-black text-gray-900">Associate Attorney</h4>
                      <p className="text-base font-bold text-[#5a32fa] mb-2">Global IP Solutions</p>
                      <p className="text-sm font-black text-gray-500 mb-4 bg-gray-100 inline-block px-3 py-1 rounded-lg">Jun 2017 - Dec 2020</p>
                      <p className="text-base text-gray-700 font-medium leading-relaxed">
                        Drafted and prosecuted over 100 patent applications across mechanical and software domains. Conducted extensive FTO analyses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column (Highlights & Skills) */}
            <div className="space-y-8">
              <div className="bg-[#131313] text-white p-8 rounded-[2.5rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#5a32fa]">
                <h3 className="text-2xl font-black mb-6 text-[#00d26a]">Highlights</h3>
                <div className="space-y-5">
                  <div className="bg-white/10 p-5 rounded-2xl border-2 border-transparent hover:border-white/30 transition-colors cursor-pointer group">
                    <p className="text-sm font-black text-[#ff90e8] mb-2 uppercase tracking-wider">Published Article</p>
                    <p className="text-base font-bold group-hover:text-white transition-colors">"The Impact of Generative AI on Modern Copyright Frameworks"</p>
                  </div>
                  <div className="bg-white/10 p-5 rounded-2xl border-2 border-transparent hover:border-white/30 transition-colors cursor-pointer group">
                    <p className="text-sm font-black text-[#ffc900] mb-2 uppercase tracking-wider">Upcoming Speaker</p>
                    <p className="text-base font-bold group-hover:text-white transition-colors">London Legal Tech Summit 2026</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-[2.5rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313]">
                <h3 className="text-2xl font-black text-gray-900 mb-6">Top Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {profileData.practiceAreas.split(',').map((area, idx) => {
                    const colors = ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'];
                    const color = colors[idx % colors.length];
                    const textColor = color === '#5a32fa' ? 'text-white' : 'text-[#131313]';
                    return (
                      <span key={idx} className={`bg-[${color}] ${textColor} px-4 py-2.5 rounded-xl text-sm font-black border-2 border-[#131313] shadow-[2px_2px_0px_0px_#131313] hover:-translate-y-1 transition-transform cursor-default`} style={{backgroundColor: color}}>
                        {area.trim()}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313]">
                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center justify-between">
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
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          isActive 
                            ? 'border-[#5a32fa] bg-[#5a32fa]/10' 
                            : 'border-gray-100 bg-gray-50 opacity-60 grayscale'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                          isActive ? 'bg-[#5a32fa] text-white border-2 border-[#131313] shadow-[2px_2px_0px_0px_#131313]' : 'bg-gray-200'
                        }`}>
                          {tier.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-black ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{tier.title}</h4>
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
