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
import AdSlot from '@/components/AdSlot';

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
  const [isFilterTrayOpen, setIsFilterTrayOpen] = useState(false);

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

  const hasActiveFilters = Boolean(selectedCountry || selectedPracticeArea || selectedIndustry);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#070b14] flex flex-col">

      {/* MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-3 sm:p-6 lg:p-8 pb-28 md:pb-12">
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          
          <div className="flex-1">
          
          <div className="hidden md:flex mb-6 border-b border-gray-100 dark:border-white/10 pb-5 items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
                <UsersRound size={28} className="text-[#5a32fa]" />
                My Network
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-sm mt-1">
                Manage your connections and discover IP leaders worldwide.
              </p>
            </div>
          </div>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <div className="mb-5 sm:mb-8">
              <h2 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-2.5 flex items-center justify-between">
                <span>Pending Invitations</span>
                <span className="bg-[#5a32fa] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">{invitations.length}</span>
              </h2>
              <div className="flex flex-col gap-2.5">
                {invitations.map((invite) => (
                  <div key={invite.id} className="bg-white dark:bg-[#151c2c] border border-gray-100 dark:border-white/5 shadow-sm p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm">
                        {invite.requester.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/platform/profile/${invite.requester.id}`} className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white hover:underline truncate block">
                          {invite.requester.full_name || 'Anonymous User'}
                        </Link>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">Sent you a connection request</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleAccept(invite.id)}
                        className="px-3 py-1.5 bg-[#00d26a] text-white font-bold text-xs rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleReject(invite.id)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95 transition-all"
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compact Mobile Tabs + Search + Filter Strip */}
          <div className="space-y-2.5 mb-4 sm:mb-6">
            {/* 1. Category Segmented Pills */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {(['Connections', 'Following', 'Followers'] as const).map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-full font-bold text-xs whitespace-nowrap active:scale-95 transition-all ${
                      activeTab === tab 
                        ? 'bg-[#5a32fa] text-white shadow-sm shadow-[#5a32fa]/30' 
                        : 'bg-white dark:bg-[#151c2c] text-gray-600 dark:text-gray-300 border border-gray-200/80 dark:border-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Search Bar + Filter Trigger */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search network members..."
                  className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#5a32fa] font-medium text-xs sm:text-sm transition-all bg-white dark:bg-[#151c2c] text-gray-900 dark:text-white shadow-sm"
                />
              </div>

              <button
                onClick={() => setIsFilterTrayOpen(!isFilterTrayOpen)}
                className={`px-3 py-2 sm:py-2.5 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 shrink-0 ${
                  hasActiveFilters
                    ? 'bg-[#5a32fa] text-white border-[#5a32fa] shadow-sm'
                    : 'bg-white dark:bg-[#151c2c] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 shadow-sm'
                }`}
              >
                <Filter size={14} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d26a]" />
                )}
              </button>
            </div>

            {/* 3. Collapsible Filter Row (Modern Compact Layout) */}
            {isFilterTrayOpen && (
              <div className="p-3 bg-white dark:bg-[#151c2c] rounded-2xl border border-gray-200 dark:border-white/10 space-y-2 animate-in fade-in zoom-in-95 duration-150 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select 
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-800 dark:text-gray-200 outline-none"
                  >
                    <option value="">All Countries</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select 
                    value={selectedPracticeArea}
                    onChange={(e) => setSelectedPracticeArea(e.target.value)}
                    className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-800 dark:text-gray-200 outline-none"
                  >
                    <option value="">All Practice Areas</option>
                    {PRACTICE_AREAS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select 
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-800 dark:text-gray-200 outline-none"
                  >
                    <option value="">All Industries</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                {hasActiveFilters && (
                  <div className="flex justify-end pt-1">
                    <button 
                      onClick={() => { setSelectedCountry(''); setSelectedPracticeArea(''); setSelectedIndustry(''); setSearchQuery(''); }}
                      className="text-xs font-bold text-rose-500 hover:underline"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Network Member Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
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
              <div className="sm:col-span-2 lg:col-span-3 bg-white dark:bg-[#151c2c] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-10 text-center flex flex-col items-center">
                <UsersRound size={44} className="text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">No {activeTab.toLowerCase()} found</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-sm">Try clearing your filters or searching a different name.</p>
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
              <div key={person.id} className="bg-white dark:bg-[#151c2c] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-3.5 flex items-center justify-between gap-3 transition-all hover:border-[#5a32fa]/30">
                
                <Link href={`/platform/profile/${person.id}`} className="flex items-center gap-3 min-w-0 flex-1 group">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-sm ring-2 ring-white dark:ring-[#0f172a]">
                    {person.initial}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-[#5a32fa] transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {person.practiceArea || person.role}
                    </p>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate block">
                      {person.country} • {person.mutualConnections} mutual
                    </span>
                  </div>
                </Link>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link href={`/platform/messages?userId=${person.id}`}>
                    <button className="flex items-center gap-1 bg-[#5a32fa] hover:bg-[#4a24db] text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm shadow-[#5a32fa]/30 active:scale-95 transition-all">
                      <MessageCircle size={13} />
                      <span>Message</span>
                    </button>
                  </Link>
                  <button 
                    onClick={() => activeTab === 'Following' ? toggleFollow(person.id) : toggleConnection(person.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    title="Remove connection"
                  >
                    <UserMinus size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {hasMore && network.length > 0 && (
            <div className="flex justify-center mt-6 pb-6">
              <button 
                onClick={() => setPage(p => p + 1)}
                className="px-5 py-2 bg-white dark:bg-[#151c2c] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors shadow-sm"
              >
                Load More
              </button>
            </div>
          )}
          
          </div>
          
          {/* Right Column Content */}
          <div className="w-full xl:w-[350px] shrink-0 flex flex-col gap-6">
            
            {/* Dynamic Advertisement Space */}
            <div className="hidden xl:block">
              <AdSlot slotId="network_sidebar" />
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
