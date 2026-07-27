'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { 
  BadgeCheck, LayoutGrid, User, Users, Mail, UserPlus, UsersRound, MessageSquare, FileText, Briefcase, GraduationCap,
  MapPin, Link as LinkIcon, Calendar, ThumbsUp, ArrowLeft, Send
, BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const { user: currentUser } = useAppStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'accepted' | 'rejected'>('none');
  const [isRequester, setIsRequester] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Loading...", role: "Member", initial: "", color: "#b892ff", location: "Global"
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (!error && data) {
        const colors = ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'];
        const randomColor = colors[data.full_name ? data.full_name.length % colors.length : 0];
        setProfile({
          name: data.full_name || 'Anonymous User',
          role: "WIPA Member",
          initial: data.full_name ? data.full_name.charAt(0).toUpperCase() : 'U',
          color: randomColor,
          location: "Global"
        });

        // Check connection status
        if (currentUser?.id) {
          const { data: connData } = await supabase
            .from('connections')
            .select('*')
            .or(`and(requester_id.eq.${currentUser.id},receiver_id.eq.${id}),and(requester_id.eq.${id},receiver_id.eq.${currentUser.id})`)
            .maybeSingle();
            
          if (connData) {
            setConnectionStatus(connData.status);
            setIsRequester(connData.requester_id === currentUser.id);
          }
        }
      } else {
        setProfile({
          name: "Unknown User", role: "Member", initial: "U", color: "#b892ff", location: "Global"
        });
      }
      setIsLoading(false);
    };
    
    if (id) fetchUser();
  }, [id, currentUser?.id]);

  const handleConnect = async () => {
    if (!currentUser?.id || isProcessing) return;
    setIsProcessing(true);
    
    if (connectionStatus === 'none') {
      const { error } = await supabase
        .from('connections')
        .insert({
          requester_id: currentUser.id,
          receiver_id: id,
          status: 'pending'
        });
        
      if (!error) {
        setConnectionStatus('pending');
        setIsRequester(true);
      }
    } else if (connectionStatus === 'pending' && isRequester) {
      // Cancel request
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('requester_id', currentUser.id)
        .eq('receiver_id', id);
        
      if (!error) {
        setConnectionStatus('none');
        setIsRequester(false);
      }
    }
    
    setIsProcessing(false);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]"><p className="font-bold text-gray-500">Loading Profile...</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b-4 border-[#131313] h-[72px] flex items-center px-6 sticky top-0 z-50">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-900 font-black hover:text-[#5a32fa] transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={3} />
          Back
        </button>
        
        <div className="mx-auto font-black text-xl text-gray-900 tracking-tight">
          PROFILE
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8 lg:p-12 space-y-8">
        
        {/* Hero Profile Card */}
        <div className="bg-white rounded-[2.5rem] border-4 border-[#131313] shadow-none md:shadow-[12px_12px_0px_0px_#131313] overflow-hidden relative">
          {/* Massive Banner */}
          <div className="h-40 md:h-56 relative border-b-4 border-[#131313] overflow-hidden" style={{ backgroundColor: profile.color }}>
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#131313_3px,transparent_3px)] [background-size:24px_24px]"></div>
            
            {/* Floating decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white border-4 border-[#131313] rounded-full mix-blend-overlay opacity-50 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-[#131313] border-4 border-white rotate-12 mix-blend-overlay opacity-30"></div>
          </div>
          
          <div className="px-6 md:px-12 pb-10 relative flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Giant Avatar */}
            <div className="-mt-16 md:-mt-20 relative z-10 flex-shrink-0">
              <div 
                className="w-28 h-28 md:w-40 md:h-40 rounded-[2rem] text-white flex items-center justify-center text-5xl md:text-7xl font-black border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] rotate-3 hover:rotate-0 transition-transform duration-300"
                style={{ backgroundColor: profile.color, backgroundImage: `linear-gradient(135deg, ${profile.color} 0%, #131313 150%)` }}
              >
                {profile.initial}
              </div>
            </div>
            
            <div className="flex-1 pt-4 md:pt-6 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center gap-3 tracking-tight mb-2">
                  {profile.name}
                  <BadgeCheck size={32} className="text-[#00d26a]" />
                </h1>
                <p className="text-lg md:text-xl font-bold mb-4" style={{ color: profile.color }}>{profile.role}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-bold text-gray-600">
                  <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-transparent">
                    <MapPin size={18} className="text-[#ff4b4b]" /> {profile.location}
                  </span>
                  <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-transparent hover:border-[#131313] hover:shadow-[2px_2px_0px_0px_#131313] transition-all cursor-pointer">
                    <LinkIcon size={18} className="text-[#131313]" /> linkedin.com/in/{profile.name.replace(/\s+/g, '').toLowerCase()}
                  </span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto mt-4 md:mt-0">
                <button 
                  onClick={handleConnect}
                  disabled={isProcessing || (connectionStatus === 'pending' && !isRequester) || connectionStatus === 'accepted'}
                  className={`flex-1 xl:flex-none px-4 py-3 sm:px-8 sm:py-4 rounded-2xl font-black text-base sm:text-lg border-4 border-[#131313] transition-all flex items-center justify-center gap-3 ${
                    connectionStatus === 'none' 
                      ? 'bg-[#00d26a] text-gray-900 shadow-[4px_4px_0px_0px_#131313] hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer'
                      : connectionStatus === 'pending'
                        ? isRequester 
                          ? 'bg-gray-200 text-gray-600 shadow-[4px_4px_0px_0px_#131313] hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed' // connected
                  }`}
                >
                  <UserPlus size={20} className="sm:w-6 sm:h-6" /> 
                  {connectionStatus === 'none' && 'Connect'}
                  {connectionStatus === 'pending' && (isRequester ? 'Cancel Request' : 'Pending...')}
                  {connectionStatus === 'accepted' && 'Connected'}
                </button>
                <button className="flex-1 xl:flex-none bg-white text-gray-900 px-4 py-3 sm:px-8 sm:py-4 rounded-2xl font-black text-base sm:text-lg border-4 border-[#131313] shadow-[4px_4px_0px_0px_#131313] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3">
                  <Send size={20} className="sm:w-6 sm:h-6" /> Message
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] hover:-translate-y-2 transition-transform cursor-pointer">
            <h3 className="text-5xl lg:text-6xl font-black text-[#131313] mb-2">500+</h3>
            <p className="text-lg lg:text-xl font-bold text-[#131313]/80">Connections</p>
          </div>
          <div className="bg-[#131313] p-8 rounded-[2rem] border-4 border-[#131313] hover:-translate-y-2 transition-transform cursor-pointer" style={{ boxShadow: `8px 8px 0px 0px ${profile.color}`}}>
            <h3 className="text-5xl lg:text-6xl font-black text-white mb-2">124</h3>
            <p className="text-lg lg:text-xl font-bold text-white/80">Followers</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] hover:-translate-y-2 transition-transform cursor-pointer">
            <h3 className="text-5xl lg:text-6xl font-black text-[#131313] mb-2">12</h3>
            <p className="text-lg lg:text-xl font-bold text-[#131313]/80">Posts</p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-[100%] opacity-20 pointer-events-none" style={{ backgroundColor: profile.color }}></div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-4">
                About
              </h3>
              <p className="text-gray-800 font-medium text-lg leading-relaxed">
                Experienced {profile.role} with a focus on intellectual property strategy and enforcement. Passionate about helping innovative companies protect their core assets worldwide. Open to mentoring and discussions on global IP trends.
              </p>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313]">
              <h3 className="text-3xl font-black text-gray-900 mb-8">Recent Activity</h3>
              
              <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[28px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gray-200">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-[#131313] bg-[#5a32fa] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[4px_4px_0px_0px_#131313] z-10 text-2xl">
                    💬
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border-4 border-[#131313] bg-white shadow-[4px_4px_0px_0px_#131313] hover:-translate-y-1 transition-transform">
                    <h4 className="text-xl font-black text-gray-900 mb-2">Commented on "The future of trademark law"</h4>
                    <p className="text-sm font-black text-gray-500 mb-4 bg-gray-100 inline-block px-3 py-1 rounded-lg">Yesterday</p>
                    <p className="text-base text-gray-700 font-bold italic border-l-4 border-gray-300 pl-4">
                      "This is exactly what we're seeing in the EU right now. The courts are taking a very different approach."
                    </p>
                  </div>
                </div>
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-[#131313] bg-[#ffc900] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[4px_4px_0px_0px_#131313] z-10 text-2xl">
                    👥
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border-4 border-[#131313] bg-white shadow-[4px_4px_0px_0px_#131313] hover:-translate-y-1 transition-transform">
                    <h4 className="text-xl font-black text-gray-900 mb-2">Joined "Trade Marks & Brand Protection"</h4>
                    <p className="text-sm font-black text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded-lg">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-[#131313] text-white p-8 rounded-[2.5rem] border-4 border-[#131313]" style={{ boxShadow: `8px 8px 0px 0px ${profile.color}`}}>
              <h3 className="text-2xl font-black mb-6" style={{ color: profile.color }}>Mutual Connections</h3>
              <div className="flex -space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#131313] bg-[#5a32fa] flex items-center justify-center font-bold text-lg">M</div>
                <div className="w-12 h-12 rounded-full border-4 border-[#131313] bg-[#00d26a] flex items-center justify-center font-bold text-lg">S</div>
                <div className="w-12 h-12 rounded-full border-4 border-[#131313] bg-[#ff90e8] flex items-center justify-center font-bold text-lg">J</div>
              </div>
              <p className="font-bold text-gray-300">You both know Maria, Sam, and 12 others.</p>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313]">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Top Skills</h3>
              <div className="flex flex-wrap gap-3">
                <span className="bg-[#5a32fa] text-white px-4 py-2.5 rounded-xl text-sm font-black border-2 border-[#131313] shadow-[2px_2px_0px_0px_#131313] hover:-translate-y-1 transition-transform cursor-default">Patent Prosecution</span>
                <span className="bg-[#ff90e8] text-[#131313] px-4 py-2.5 rounded-xl text-sm font-black border-2 border-[#131313] shadow-[2px_2px_0px_0px_#131313] hover:-translate-y-1 transition-transform cursor-default">Trademark Law</span>
                <span className="bg-[#00d26a] text-[#131313] px-4 py-2.5 rounded-xl text-sm font-black border-2 border-[#131313] shadow-[2px_2px_0px_0px_#131313] hover:-translate-y-1 transition-transform cursor-default">IP Litigation</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
