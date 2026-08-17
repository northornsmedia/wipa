'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { 
  Calendar, LayoutGrid, Users, Mail, UsersRound, FileText, Briefcase, GraduationCap,
  BadgeCheck, ThumbsUp, MessageCircle, UserPlus, UserMinus, Search, MoreHorizontal, ArrowLeft, Filter
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France'];
const PRACTICE_AREAS = ['Patent Prosecution', 'Trademark Law', 'IP Litigation', 'Tech Licensing', 'Copyright Law', 'Brand Protection'];
const INDUSTRIES = ['Technology', 'Pharmaceuticals', 'Manufacturing', 'Entertainment', 'Automotive', 'Academia'];

export default function NetworkPage() {
  const { user } = useAppStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Connections' | 'Followers' | 'Following'>('Connections');
  const [network, setNetwork] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [invitations, setInvitations] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    if (user?.id) {
      const fetchInvitations = async () => {
        const { data } = await supabase
          .from('connections')
          .select(`
            id,
            requester_id,
            status,
            requester:profiles!requester_id(id, full_name, avatar_url)
          `)
          .eq('recipient_id', user.id)
          .eq('status', 'pending');
          
        if (data) {
          setInvitations(data);
        }
      };

      const fetchNetwork = async () => {
        const { data: acceptedConnections } = await supabase
          .from('connections')
          .select(`
            id,
            requester:profiles!requester_id(id, full_name, avatar_url, country, practice_area),
            recipient:profiles!recipient_id(id, full_name, avatar_url, country, practice_area)
          `)
          .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .eq('status', 'accepted')
          .range((page - 1) * 20, page * 20 - 1);

        if (acceptedConnections) {
          if (acceptedConnections.length < 20) setHasMore(false);
          const formattedNetwork = acceptedConnections.map(conn => {
            const req: any = Array.isArray(conn.requester) ? conn.requester[0] : conn.requester;
            const rec: any = Array.isArray(conn.recipient) ? conn.recipient[0] : conn.recipient;
            const isRequester = req.id === user.id;
            const otherPerson = isRequester ? rec : req;
            
            return {
              id: otherPerson.id,
              name: otherPerson.full_name || 'Anonymous User',
              role: 'WIPA Member',
              avatarColor: ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'][Math.floor(Math.random() * 4)],
              initial: otherPerson.full_name?.charAt(0).toUpperCase() || 'U',
              isConnection: true,
              isFollowing: true,
              country: otherPerson.country || COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
              practiceArea: otherPerson.practice_area || PRACTICE_AREAS[Math.floor(Math.random() * PRACTICE_AREAS.length)],
              industrySector: INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)],
              mutualConnections: Math.floor(Math.random() * 50)
            };
          });
          setNetwork(prev => page === 1 ? formattedNetwork : [...prev, ...formattedNetwork]);
        } else {
          setHasMore(false);
        }
      };

      const fetchSuggestions = async () => {
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id, full_name, role, avatar_url, country, practice_area')
          .neq('id', user.id)
          .limit(10);
          
        if (allProfiles) {
          // Filter out existing connections and pending requests
          const { data: myConnections } = await supabase
            .from('connections')
            .select('requester_id, recipient_id')
            .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);
            
          const connectedIds = new Set();
          if (myConnections) {
            myConnections.forEach(c => {
              connectedIds.add(c.requester_id);
              connectedIds.add(c.recipient_id);
            });
          }
          
          const filtered = allProfiles
            .filter(p => !connectedIds.has(p.id))
            .map(p => ({
              id: p.id,
              name: p.full_name || 'Anonymous User',
              role: p.role || 'WIPA Member',
              avatarUrl: p.avatar_url,
              color: ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'][Math.floor(Math.random() * 4)],
              initial: (p.full_name || 'A').charAt(0).toUpperCase()
            }));
            
          setSuggestions(filtered.slice(0, 5));
        }
      };

      fetchInvitations();
      fetchNetwork();
      fetchSuggestions();
    }
  }, [user?.id, page]);

  const handleAccept = async (connectionId: string) => {
    await supabase
      .from('connections')
      .update({ status: 'accepted' })
      .eq('id', connectionId);
      
    const invite = invitations.find(i => i.id === connectionId);
    if (invite && user?.id) {
      await supabase.from('notifications').insert({
        user_id: invite.requester_id,
        actor_id: user.id,
        type: 'connection_accepted'
      });
    }
    
    setInvitations(invitations.filter(i => i.id !== connectionId));
  };

  const handleReject = async (connectionId: string) => {
    await supabase
      .from('connections')
      .delete()
      .eq('id', connectionId);
      
    setInvitations(invitations.filter(i => i.id !== connectionId));
  };
  
  const handleConnect = async (targetId: string) => {
    if (!user?.id) return;
    const { error } = await supabase.from('connections').insert({
      requester_id: user.id,
      recipient_id: targetId,
      status: 'pending'
    });
    
    if (!error) {
      await supabase.from('notifications').insert({
        user_id: targetId,
        actor_id: user.id,
        type: 'connection_request'
      });
      setSuggestions(suggestions.filter(s => s.id !== targetId));
    }
  };
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  const toggleConnection = (id: number) => {
    setNetwork(network.map(person => 
      person.id === id ? { ...person, isConnection: !person.isConnection } : person
    ));
  };

  const toggleFollow = (id: number) => {
    setNetwork(network.map(person => 
      person.id === id ? { ...person, isFollowing: !person.isFollowing } : person
    ));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col">


      {/* MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        <div className="flex flex-col xl:flex-row gap-8">
          
          <div className="flex-1">
          
          <div className="hidden md:flex mb-8 border-b border-gray-100 dark:border-white/10 pb-6 items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <UsersRound size={32} className="text-[#5a32fa]" />
                My Network
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
                Manage your connections and discover people in the IP space.
              </p>
            </div>
          </div>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pending Invitations ({invitations.length})</h2>
              <div className="flex flex-col gap-4">
                {invitations.map((invite) => (
                  <div key={invite.id} className="bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-white/10 shadow-sm p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#b892ff] rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center font-bold text-xl text-white">
                        {invite.requester.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <Link href={`/platform/profile/${invite.requester.id}`} className="font-bold text-lg hover:underline decoration-2">
                          {invite.requester.full_name || 'Anonymous User'}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sent you a connection request</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleAccept(invite.id)}
                        className="px-4 py-2 bg-[#00d26a] text-gray-900 dark:text-white font-bold border border-gray-100 dark:border-white/10 rounded-xl  shadow-sm transition-all"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleReject(invite.id)}
                        className="px-4 py-2 bg-white dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 font-bold border-2 border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-white/5 transition-colors"
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('Connections')}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors border-2 ${activeTab === 'Connections' ? 'bg-[#5a32fa] text-white border-[#5a32fa]' : 'bg-white dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/20 hover:border-gray-900'}`}
              >
                Connections
              </button>
              <button 
                onClick={() => setActiveTab('Following')}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors border-2 ${activeTab === 'Following' ? 'bg-[#5a32fa] text-white border-[#5a32fa]' : 'bg-white dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/20 hover:border-gray-900'}`}
              >
                Following
              </button>
              <button 
                onClick={() => setActiveTab('Followers')}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors border-2 ${activeTab === 'Followers' ? 'bg-[#5a32fa] text-white border-[#5a32fa]' : 'bg-white dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/20 hover:border-gray-900'}`}
              >
                Followers
              </button>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search network..."
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-white/20 focus:outline-none focus:border-[#5a32fa] font-medium text-sm transition-colors bg-white dark:bg-[#0f172a]"
              />
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white dark:bg-[#0f172a] rounded-[1.5rem] border border-gray-100 dark:border-white/10 shadow-sm">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider mr-2 flex items-center gap-2">
              <Filter size={16} className="text-[#5a32fa]" /> Filters
            </h3>
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 font-bold text-sm text-gray-700 dark:text-gray-200 focus:border-[#131313] focus:outline-none cursor-pointer hover:border-gray-900 transition-colors"
            >
              <option value="">All Countries</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
              value={selectedPracticeArea}
              onChange={(e) => setSelectedPracticeArea(e.target.value)}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 font-bold text-sm text-gray-700 dark:text-gray-200 focus:border-[#131313] focus:outline-none cursor-pointer hover:border-gray-900 transition-colors"
            >
              <option value="">All Practice Areas</option>
              {PRACTICE_AREAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select 
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 font-bold text-sm text-gray-700 dark:text-gray-200 focus:border-[#131313] focus:outline-none cursor-pointer hover:border-gray-900 transition-colors"
            >
              <option value="">All Industries</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            
            {(selectedCountry || selectedPracticeArea || selectedIndustry || searchQuery) && (
              <button 
                onClick={() => { setSelectedCountry(''); setSelectedPracticeArea(''); setSelectedIndustry(''); setSearchQuery(''); }}
                className="ml-auto px-4 py-2.5 text-sm font-bold text-[#ff4b4b] border-2 border-transparent hover:border-[#ff4b4b] rounded-xl transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Network Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            {network.filter(person => {
              if (activeTab === 'Connections' && !person.isConnection) return false;
              if (activeTab === 'Following' && !person.isFollowing) return false;
              if (activeTab === 'Followers' && !person.isConnection) return false; // Mock logic
              if (searchQuery && !person.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
              if (selectedCountry && person.country !== selectedCountry) return false;
              if (selectedPracticeArea && person.practiceArea !== selectedPracticeArea) return false;
              if (selectedIndustry && person.industrySector !== selectedIndustry) return false;
              return true;
            }).length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 bg-white dark:bg-[#0f172a] rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm p-16 text-center flex flex-col items-center">
                <UsersRound size={64} className="text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No {activeTab.toLowerCase()} found</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Try adjusting your search filters.</p>
              </div>
            ) : network.filter(person => {
              if (activeTab === 'Connections' && !person.isConnection) return false;
              if (activeTab === 'Following' && !person.isFollowing) return false;
              if (activeTab === 'Followers' && !person.isConnection) return false; // Mock logic
              if (searchQuery && !person.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
              if (selectedCountry && person.country !== selectedCountry) return false;
              if (selectedPracticeArea && person.practiceArea !== selectedPracticeArea) return false;
              if (selectedIndustry && person.industrySector !== selectedIndustry) return false;
              return true; 
            }).map((person) => (
              <div key={person.id} className="bg-white dark:bg-[#0f172a] rounded-[1rem] md:rounded-[1.5rem] border-[1.5px] md:border border-gray-100 dark:border-white/10 shadow-sm md:shadow-sm overflow-hidden flex flex-row md:flex-col items-center p-3 md:p-6 text-left md:text-center transition-all hover:-translate-y-1 hover:shadow-sm md:hover:shadow-sm gap-3 md:gap-0">
                
                <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border-[1.5px] md:border border-gray-100 dark:border-white/10 flex items-center justify-center font-bold text-lg md:text-3xl text-[#131313] md:mb-4 shrink-0" style={{ backgroundColor: person.avatarColor }}>
                  {person.initial}
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link href={`/platform/profile/${person.id}`}>
                    <h3 className="text-[14px] md:text-lg font-bold text-gray-900 dark:text-white mb-0.5 md:mb-1 leading-tight hover:text-[#5a32fa] transition-colors cursor-pointer truncate hover:underline decoration-2">
                      {person.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-[11px] md:text-xs mb-0.5 md:mb-1 truncate">{person.role}</p>
                  <p className="text-gray-500 dark:text-gray-400 font-bold text-[10px] md:text-[11px] mb-0.5 md:mb-2 truncate opacity-80">{person.country} • {person.practiceArea}</p>
                  <p className="text-[10px] md:text-[11px] font-bold text-gray-400 hidden md:block md:mb-6">
                    {person.mutualConnections} mutual connections
                  </p>
                </div>

                <div className="flex md:w-full md:mt-auto gap-2 shrink-0">
                  <Link href={`/platform/messages?userId=${person.id}`} className="md:flex-1">
                    <button className="w-full flex items-center justify-center gap-1.5 bg-[#5a32fa] text-white px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-[11px] md:text-xs border border-gray-100 dark:border-white/10 shadow-sm hover:-translate-y-0.5 md:hover:shadow-sm transition-all">
                      <MessageCircle size={14} className="hidden md:block" />
                      Message
                    </button>
                  </Link>
                  <button 
                    onClick={() => activeTab === 'Following' ? toggleFollow(person.id) : toggleConnection(person.id)}
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-lg md:rounded-xl font-bold border-[1.5px] md:border-2 border-gray-200 dark:border-white/20 hover:border-gray-900 hover:text-gray-900 dark:text-white transition-colors shrink-0"
                  >
                    {activeTab === 'Following' ? <UserMinus size={14} /> : <UserMinus size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {hasMore && network.length > 0 && (
            <div className="flex justify-center mt-8 pb-24">
              <button 
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-3 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white border border-gray-200 dark:border-white/20 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
          
          </div>
          
          {/* Right Column Content */}
          <div className="w-full xl:w-[350px] shrink-0 flex flex-col gap-6">
            
            {/* Advertisement Space */}
            <div className="w-full rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0f172a] relative h-64 group shrink-0 hidden xl:block">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5a32fa]/80 to-[#b892ff]/80 flex items-center justify-center text-white font-black text-2xl tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">AD SPACE</div>
            </div>

            {/* Incoming Requests */}
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[1.5rem] border border-gray-100 dark:border-white/10 shadow-sm flex flex-col max-h-[500px]">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Invitations</h3>
                <span className="bg-[#5a32fa] text-white text-xs font-bold px-2 py-1 rounded-md border border-gray-100 dark:border-white/10">{invitations.length}</span>
              </div>
              <div className="space-y-4 overflow-y-auto no-scrollbar pr-2 -mr-2">
                {invitations.length === 0 ? (
                  <p className="text-sm text-gray-500">No pending invitations.</p>
                ) : invitations.map((inv: any) => (
                  <div key={inv.id} className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border border-gray-100 dark:border-white/10 shrink-0" style={{ backgroundColor: inv.color, color: inv.color === '#5a32fa' ? 'white' : '#131313' }}>
                      {inv.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{inv.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">{inv.role}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-[#131313] text-white text-xs font-bold py-2 rounded-xl border border-gray-100 dark:border-white/10 hover:bg-[#5a32fa] hover:border-[#5a32fa] transition-colors shadow-sm">
                          Accept
                        </button>
                        <button className="flex-1 bg-white dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 text-xs font-bold py-2 rounded-xl border-2 border-gray-200 dark:border-white/20 hover:border-gray-900 transition-colors">
                          Ignore
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Connections */}
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[1.5rem] border border-gray-100 dark:border-white/10 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Suggested for you</h3>
                <button className="text-sm font-bold text-[#5a32fa] hover:underline">See all</button>
              </div>
              <div className="space-y-5">
                {suggestions.length === 0 ? (
                  <p className="text-sm text-gray-500">No new suggestions at the moment.</p>
                ) : suggestions.map((person) => (
                  <div key={person.id} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border border-gray-100 dark:border-white/10" style={{ backgroundColor: person.color, color: person.color === '#5a32fa' ? 'white' : '#131313' }}>
                      {person.avatarUrl ? (
                        <img src={person.avatarUrl} alt={person.name} className="w-full h-full rounded-full object-cover" />
                      ) : person.initial}
                    </div>
                    <div className="flex-1">
                      <Link href={`/platform/profile/${person.id}`}>
                        <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#5a32fa] transition-colors cursor-pointer">{person.name}</p>
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{person.role}</p>
                    </div>
                    <button 
                      onClick={() => handleConnect(person.id)}
                      className="w-10 h-10 rounded-xl border-2 border-gray-200 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-[#131313] hover:text-[#131313] hover:bg-gray-50 dark:bg-white/5 transition-colors shrink-0"
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
          
        </div>
      </div>

    </div>
  );
}
