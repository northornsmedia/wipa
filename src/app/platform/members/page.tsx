'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { 
  Search, UserPlus, MapPin, Briefcase, Mail, ArrowLeft, UsersRound
, Hash, BellOff, ArrowUpRight, Circle, CheckCircle2, LayoutGrid, ThumbsUp, MessageSquare, BookOpen, Calendar, FileText, GraduationCap, Users} from 'lucide-react';
import Link from 'next/link';

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
  cover_url?: string;
  role?: string;
  location?: string;
};

export default function MembersDirectoryPage() {
  const { user } = useAppStore();
  const [members, setMembers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, 'pending' | 'accepted' | 'none'>>({});
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      let query = supabase.from('profiles').select('*').limit(50);
      
      if (searchQuery.trim() !== '') {
        query = query.ilike('full_name', `%${searchQuery}%`);
      }

      // Filter by full_name to safely exclude the current user.
      if (user?.name) {
        query = query.neq('full_name', user.name);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Supabase Error fetching members:", error);
      }
      
      if (!error && data) {
        setMembers(data);
        
        // Also fetch connections involving this user
        if (user?.id && data.length > 0) {
          const { data: connections } = await supabase
            .from('connections')
            .select('*')
            .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);
            
          if (connections) {
            const statuses: Record<string, 'pending' | 'accepted' | 'none'> = {};
            
            connections.forEach(conn => {
              const otherId = conn.requester_id === user.id ? conn.recipient_id : conn.requester_id;
              statuses[otherId] = conn.status;
            });
            
            setConnectionStatuses(statuses);
          }
        }
      }
      setLoading(false);
    };

    const delay = setTimeout(fetchMembers, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, user?.id]);

  // Listen for realtime updates to connection statuses globally
  useEffect(() => {
    if (!user?.id) return;
    
    const channel = supabase.channel(`members-connections-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'connections',
      }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const row = payload.new as any;
          if (row.requester_id === user.id || row.recipient_id === user.id) {
            const otherId = row.requester_id === user.id ? row.recipient_id : row.requester_id;
            setConnectionStatuses(prev => ({ ...prev, [otherId]: row.status }));
          }
        } else if (payload.eventType === 'DELETE') {
          const row = payload.old as any;
          if (row.requester_id === user.id || row.recipient_id === user.id) {
            const otherId = row.requester_id === user.id ? row.recipient_id : row.requester_id;
            setConnectionStatuses(prev => {
              const next = { ...prev };
              delete next[otherId];
              return next;
            });
          }
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleConnect = async (targetId: string) => {
    if (!user?.id || isConnecting[targetId]) return;
    setIsConnecting(prev => ({ ...prev, [targetId]: true }));
    try {
      const { error: connError } = await supabase.from('connections').insert({
        requester_id: user.id,
        recipient_id: targetId,
        status: 'pending'
      });
      
      if (!connError) {
        await supabase.from('notifications').insert({
          user_id: targetId,
          actor_id: user.id,
          type: 'connection_request',
          content: `${user.name || 'Someone'} sent you a connection request!`,
          link: `/platform/profile/${user.id}`,
          is_read: false
        });
        setConnectionStatuses(prev => ({ ...prev, [targetId]: 'pending' }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(prev => ({ ...prev, [targetId]: false }));
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] font-sans flex flex-col h-[calc(100vh-73px)] overflow-hidden">
  <div className="w-full flex flex-col flex-1 overflow-hidden">
    <div className="flex flex-1 overflow-hidden">
        {/* MAIN CONTENT AREA */}

        {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
          {/* Hero Section */}
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#f0ebff] via-[#f8f9fa] to-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-8">
            
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-gradient-to-br from-[#5a32fa]/10 to-[#ff90e8]/10 blur-3xl mix-blend-multiply" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-gradient-to-tr from-[#00d26a]/10 to-[#ffc900]/10 blur-3xl mix-blend-multiply" />
            
            <div className="relative p-8 md:p-12 lg:p-16 flex flex-col items-center text-center">

              
              <h1 className="font-black text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#131313] via-[#5a32fa] to-[#ff90e8] tracking-tight mb-4 mt-8 md:mt-0">
                Members Directory
              </h1>
              <p className="text-gray-500 font-medium text-lg max-w-lg mb-10">
                Discover, connect, and collaborate with brilliant minds across the global platform.
              </p>
              
              {/* Floating Search Bar */}
              <div className="w-full max-w-2xl relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#5a32fa] via-[#ff90e8] to-[#00d26a] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl flex items-center overflow-hidden">
                  <Search size={22} className="text-[#5a32fa] ml-6" />
                  <input 
                    type="text" 
                    placeholder="Search for designers, engineers, founders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent pl-4 pr-6 py-5 focus:outline-none font-medium text-lg text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

        {/* Members Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a32fa]"></div>
          </div>
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                <div 
                  className="h-24 bg-[#5a32fa]/10 border-b-2 border-gray-200 relative bg-cover bg-center"
                  style={{ backgroundImage: member.cover_url ? `url(${member.cover_url})` : undefined }}
                >
                  <Link href={`/platform/profile/${member.id}`}>
                    <div 
                      className="absolute -bottom-10 left-6 w-20 h-20 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center font-bold text-2xl overflow-hidden bg-cover bg-center cursor-pointer transition-transform hover:scale-105" 
                      style={{ 
                        color: ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'][Math.floor(Math.random() * 4)],
                        backgroundImage: member.avatar_url ? `url(${member.avatar_url})` : undefined 
                      }}
                    >
                      {!member.avatar_url && (member.full_name ? member.full_name.charAt(0).toUpperCase() : 'U')}
                    </div>
                  </Link>
                </div>
                
                <div className="p-6 pt-12 flex-1 flex flex-col">
                  <Link href={`/platform/profile/${member.id}`}>
                    <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-1 hover:text-[#5a32fa] transition-colors cursor-pointer">{member.full_name || 'Anonymous User'}</h3>
                  </Link>
                  <p className="text-[#5a32fa] font-bold text-sm mb-4 flex items-center gap-1">
                    <Briefcase size={14} /> {member.role || 'WIPA Member'}
                  </p>
                  
                  <div className="flex flex-col gap-2 mb-6 text-sm font-medium text-gray-500">
                    <span className="flex items-center gap-2"><MapPin size={16} /> {member.location || 'Global'}</span>
                    <span className="flex items-center gap-2"><Mail size={16} /> Message via platform</span>
                  </div>
                  
                  <div className="mt-auto flex gap-3">
                    {connectionStatuses[member.id] === 'accepted' ? (
                      <Link 
                        href={`/platform/messages?userId=${member.id}`}
                        className="flex-1 bg-[#5a32fa] text-white font-bold py-3 px-4 rounded-xl border border-gray-200 hover:bg-[#4a26d2] transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageSquare size={18} /> Message
                      </Link>
                    ) : connectionStatuses[member.id] === 'pending' ? (
                      <button 
                        disabled
                        className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 px-4 rounded-xl border border-gray-200 flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <CheckCircle2 size={18} /> Request Sent
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleConnect(member.id)}
                        disabled={isConnecting[member.id]}
                        className="flex-1 bg-[#131313] text-white font-bold py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserPlus size={18} /> {isConnecting[member.id] ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                    
                    {connectionStatuses[member.id] !== 'accepted' && (
                      <Link 
                        href={`/platform/messages?userId=${member.id}`}
                        className="w-12 flex items-center justify-center bg-[#fbe8d5] text-[#131313] font-bold rounded-xl border border-gray-200 hover:bg-[#f6d5b3] transition-colors shrink-0"
                      >
                        <Mail size={18} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <UsersRound size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-500 font-medium">Try adjusting your search query to find who you're looking for.</p>
          </div>
        )}
        </div>
      </main>

{/* FIXED RIGHT SIDEBAR */}
      <aside className="w-[300px] hidden xl:flex flex-col shrink-0 space-y-6 pt-6 overflow-y-auto no-scrollbar pb-10 pr-4 md:pr-8 lg:pr-12">
        <div className="h-full flex flex-col gap-6">
          
          {/* Active Groups */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900">Active Groups</h3>
              <button className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Trade Marks', members: '1,345', icon: '©️', color: '#b892ff' },
                { name: 'Women in Leadership', members: '897', icon: '👩‍💼', color: '#ff90e8' },
                { name: 'Artificial Intelligence', members: '1,105', icon: '🤖', color: '#5a32fa' },
                { name: 'Patent Law', members: '1,245', icon: '📜', color: '#5a32fa' },
                { name: 'Start-ups & Innovation', members: '764', icon: '🚀', color: '#ffc900' }
              ].map((group, i) => (
                <div key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 border-transparent group-hover:border-gray-200 transition-all" style={{ backgroundColor: `${group.color}20`, color: group.color }}>
                    {group.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#5a32fa] transition-colors">{group.name}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{group.members} members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Discussions */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900">Trending Discussions</h3>
              <button className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'How is AI changing patent landscapes globally?', comments: '128' },
                { title: 'The future of trademark law in digital markets', comments: '96' },
                { title: 'Building personal brand in IP profession', comments: '74' }
              ].map((disc, i) => (
                <div key={i} className="cursor-pointer group">
                  <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#5a32fa] transition-colors leading-tight mb-1">
                    <span className="text-[#00d26a] mr-1">▶</span>{disc.title}
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium">{disc.comments} comments</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900">Upcoming Events</h3>
              <button className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { month: 'JUL', day: '22', title: 'Women in AI & IP Leadership', loc: 'London, UK', time: '10:00 AM GMT' },
                { month: 'AUG', day: '05', title: 'Global Trademark Trends 2025', loc: 'Online Webinar', time: '03:00 PM GMT' },
                { month: 'AUG', day: '19', title: 'IP Strategy for Start-ups', loc: 'New York, USA', time: '11:00 AM EST' }
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center border border-gray-200 rounded-xl overflow-hidden min-w-[45px]">
                    <div className="bg-[#5a32fa] text-white text-[9px] font-bold w-full text-center py-0.5">{event.month}</div>
                    <div className="bg-white text-gray-900 text-sm font-bold py-1">{event.day}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-bold text-gray-900 leading-tight mb-0.5">{event.title}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{event.loc}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{event.time}</p>
                  </div>
                  <button className="bg-[#5a32fa] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#4020ca] transition-colors">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </div>
  </div>
</div>
  );
}
