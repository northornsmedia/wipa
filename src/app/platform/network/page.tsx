'use client';

import { DotmCircular7 } from '@/components/ui/dotm-circular-7';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { 
  UsersRound, Search, MoreHorizontal, ArrowLeft, Filter,
  MessageCircle, UserPlus, UserMinus, UserCheck, Check, X, Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdSlot from '@/components/AdSlot';

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Japan'];
const PRACTICE_AREAS = ['Patent Prosecution', 'Trademark Law', 'IP Litigation', 'Tech Licensing', 'Copyright Law', 'Brand Protection'];
const INDUSTRIES = ['Technology', 'Pharmaceuticals', 'Manufacturing', 'Entertainment', 'Automotive', 'Academia'];

export default function NetworkPage() {
  const { user } = useAppStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Connections' | 'Following' | 'Followers'>('Connections');
  const [network, setNetwork] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [invitations, setInvitations] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [counts, setCounts] = useState({ connections: 0, following: 0, followers: 0 });
  const [loading, setLoading] = useState(true);
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [isFilterTrayOpen, setIsFilterTrayOpen] = useState(false);

  // Fetch pending invitations & overall tab counts
  const fetchCountsAndInvitations = useCallback(async () => {
    if (!user?.id) return;

    try {
      // 1. Pending incoming connection invitations
      const { data: invData } = await supabase
        .from('connections')
        .select(`
          id,
          requester_id,
          status,
          requester:profiles!requester_id(id, full_name, avatar_url, role, practice_area)
        `)
        .eq('recipient_id', user.id)
        .eq('status', 'pending');
        
      if (invData) {
        setInvitations(invData);
      }

      // 2. Exact Counts for tabs
      const [connCount, followingCount, followersCount] = await Promise.all([
        supabase
          .from('connections')
          .select('id', { count: 'exact', head: true })
          .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .eq('status', 'accepted'),
        supabase
          .from('follows')
          .select('id', { count: 'exact', head: true })
          .eq('follower_id', user.id),
        supabase
          .from('follows')
          .select('id', { count: 'exact', head: true })
          .eq('following_id', user.id)
      ]);

      setCounts({
        connections: connCount.count || 0,
        following: followingCount.count || 0,
        followers: followersCount.count || 0
      });
    } catch (err) {
      console.error("Error fetching network counts:", err);
    }
  }, [user?.id]);

  // Fetch items for the currently selected tab
  const fetchTabContent = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      if (activeTab === 'Connections') {
        const { data } = await supabase
          .from('connections')
          .select(`
            id,
            requester:profiles!requester_id(id, full_name, avatar_url, country, practice_area, role),
            recipient:profiles!recipient_id(id, full_name, avatar_url, country, practice_area, role)
          `)
          .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .eq('status', 'accepted');

        if (data) {
          const formatted = data.map(conn => {
            const req: any = Array.isArray(conn.requester) ? conn.requester[0] : conn.requester;
            const rec: any = Array.isArray(conn.recipient) ? conn.recipient[0] : conn.recipient;
            const isRequester = req?.id === user.id;
            const other = isRequester ? rec : req;
            if (!other) return null;

            return {
              id: other.id,
              connectionId: conn.id,
              name: other.full_name || 'Anonymous User',
              role: other.practice_area || other.role || 'WIPA Member',
              avatarUrl: other.avatar_url,
              initial: (other.full_name || 'U').charAt(0).toUpperCase(),
              country: other.country || 'Global',
              practiceArea: other.practice_area || 'Intellectual Property',
              isConnection: true,
              isFollowing: true
            };
          }).filter(Boolean);

          setNetwork(formatted);
        }
      } else if (activeTab === 'Following') {
        const { data } = await supabase
          .from('follows')
          .select(`
            id,
            following:profiles!following_id(id, full_name, avatar_url, country, practice_area, role)
          `)
          .eq('follower_id', user.id);

        if (data) {
          const formatted = data.map(f => {
            const other: any = Array.isArray(f.following) ? f.following[0] : f.following;
            if (!other) return null;

            return {
              id: other.id,
              followId: f.id,
              name: other.full_name || 'Anonymous User',
              role: other.practice_area || other.role || 'WIPA Member',
              avatarUrl: other.avatar_url,
              initial: (other.full_name || 'U').charAt(0).toUpperCase(),
              country: other.country || 'Global',
              practiceArea: other.practice_area || 'Intellectual Property',
              isConnection: false,
              isFollowing: true
            };
          }).filter(Boolean);

          setNetwork(formatted);
        }
      } else if (activeTab === 'Followers') {
        const { data } = await supabase
          .from('follows')
          .select(`
            id,
            follower:profiles!follower_id(id, full_name, avatar_url, country, practice_area, role)
          `)
          .eq('following_id', user.id);

        if (data) {
          const formatted = data.map(f => {
            const other: any = Array.isArray(f.follower) ? f.follower[0] : f.follower;
            if (!other) return null;

            return {
              id: other.id,
              followId: f.id,
              name: other.full_name || 'Anonymous User',
              role: other.practice_area || other.role || 'WIPA Member',
              avatarUrl: other.avatar_url,
              initial: (other.full_name || 'U').charAt(0).toUpperCase(),
              country: other.country || 'Global',
              practiceArea: other.practice_area || 'Intellectual Property',
              isConnection: false,
              isFollowing: false
            };
          }).filter(Boolean);

          setNetwork(formatted);
        }
      }
    } catch (err) {
      console.error("Failed to load tab content:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, activeTab]);

  useEffect(() => {
    fetchCountsAndInvitations();
    fetchTabContent();
  }, [fetchCountsAndInvitations, fetchTabContent]);

  // Handle Accept connection request
  const handleAccept = async (connectionId: string) => {
    const invite = invitations.find(i => i.id === connectionId);
    try {
      await supabase
        .from('connections')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', connectionId);
        
      if (invite && user?.id) {
        await supabase.from('follows').upsert(
          { follower_id: user.id, following_id: invite.requester_id },
          { onConflict: 'follower_id,following_id', ignoreDuplicates: true }
        );
        await supabase.from('notifications').insert({
          user_id: invite.requester_id,
          actor_id: user.id,
          type: 'connection_accepted',
          content: `${user.name || 'Someone'} accepted your connection request! You can now chat directly.`,
          link: `/platform/messages?userId=${user.id}`,
          is_read: false
        });
      }
      
      setInvitations(prev => prev.filter(i => i.id !== connectionId));
      fetchCountsAndInvitations();
      fetchTabContent();
    } catch (err) {
      console.error("Failed to accept connection:", err);
    }
  };

  // Handle Ignore connection request
  const handleReject = async (connectionId: string) => {
    try {
      await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId);
        
      setInvitations(prev => prev.filter(i => i.id !== connectionId));
      fetchCountsAndInvitations();
    } catch (err) {
      console.error("Failed to reject connection:", err);
    }
  };

  // Remove connection
  const handleRemoveConnection = async (targetId: string, connectionId?: string) => {
    if (!user?.id || !confirm("Are you sure you want to remove this connection?")) return;
    try {
      if (connectionId) {
        await supabase.from('connections').delete().eq('id', connectionId);
      } else {
        await supabase
          .from('connections')
          .delete()
          .or(`and(requester_id.eq.${user.id},recipient_id.eq.${targetId}),and(requester_id.eq.${targetId},recipient_id.eq.${user.id})`);
      }
      setNetwork(prev => prev.filter(p => p.id !== targetId));
      setCounts(prev => ({ ...prev, connections: Math.max(0, prev.connections - 1) }));
    } catch (err) {
      console.error("Failed to remove connection:", err);
    }
  };

  // Unfollow user
  const handleUnfollow = async (targetId: string) => {
    if (!user?.id) return;
    try {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetId);
      setNetwork(prev => prev.filter(p => p.id !== targetId));
      setCounts(prev => ({ ...prev, following: Math.max(0, prev.following - 1) }));
    } catch (err) {
      console.error("Failed to unfollow:", err);
    }
  };

  // Send connection request
  const handleConnect = async (targetId: string) => {
    if (!user?.id) return;
    try {
      const { error } = await supabase.from('connections').insert({
        requester_id: user.id,
        recipient_id: targetId,
        status: 'pending'
      });
      
      if (!error) {
        await supabase.from('notifications').insert({
          user_id: targetId,
          actor_id: user.id,
          type: 'connection_request',
          content: `${user.name || 'Someone'} sent you a connection request!`,
          link: `/platform/profile/${user.id}`,
          is_read: false
        });
        alert("Connection request sent!");
      }
    } catch (err) {
      console.error("Failed to send connection request:", err);
    }
  };

  const hasActiveFilters = Boolean(selectedCountry || selectedPracticeArea || selectedIndustry);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#070b14] flex flex-col font-sans">

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
                Manage your 2-way mutual connections and asymmetric follow stream.
              </p>
            </div>
          </div>

          {/* Pending Invitations Banner */}
          {invitations.length > 0 && (
            <div className="mb-5 sm:mb-8 bg-white dark:bg-[#151c2c] border border-gray-200/80 dark:border-white/10 shadow-sm p-4 sm:p-6 rounded-3xl">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span>Pending Connection Requests</span>
                  <span className="bg-[#5a32fa] text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full">{invitations.length}</span>
                </span>
              </h2>
              <div className="flex flex-col gap-2.5">
                {invitations.map((invite) => {
                  const req = Array.isArray(invite.requester) ? invite.requester[0] : invite.requester;
                  return (
                    <div key={invite.id} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {req?.avatar_url ? (
                          <img src={req.avatar_url} alt={req.full_name} className="w-11 h-11 rounded-full object-cover shrink-0 shadow-sm" />
                        ) : (
                          <div className="w-11 h-11 bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm">
                            {req?.full_name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link href={`/platform/profile/${req?.id}`} className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white hover:underline truncate block">
                            {req?.full_name || 'Anonymous User'}
                          </Link>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{req?.practice_area || req?.role || 'WIPA Member'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => handleAccept(invite.id)}
                          className="px-3.5 py-1.5 bg-[#00d26a] text-white font-bold text-xs rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-1"
                        >
                          <Check size={14} /> Accept
                        </button>
                        <button 
                          onClick={() => handleReject(invite.id)}
                          className="px-3.5 py-1.5 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 active:scale-95 transition-all flex items-center gap-1"
                        >
                          <X size={14} /> Ignore
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab Navigation: Connections vs. Following vs. Followers */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'Connections', label: 'Connections', count: counts.connections },
                { id: 'Following', label: 'Following', count: counts.following },
                { id: 'Followers', label: 'Followers', count: counts.followers }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-2xl font-bold text-xs whitespace-nowrap active:scale-95 transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-[#5a32fa] text-white shadow-md shadow-[#5a32fa]/30' 
                      : 'bg-white dark:bg-[#151c2c] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-[#5a32fa]/50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Bar + Filter Trigger */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeTab.toLowerCase()}...`}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#5a32fa] font-medium text-xs sm:text-sm transition-all bg-white dark:bg-[#151c2c] text-gray-900 dark:text-white shadow-sm"
                />
              </div>

              <button
                onClick={() => setIsFilterTrayOpen(!isFilterTrayOpen)}
                className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 shrink-0 ${
                  hasActiveFilters
                    ? 'bg-[#5a32fa] text-white border-[#5a32fa] shadow-sm'
                    : 'bg-white dark:bg-[#151c2c] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 shadow-sm'
                }`}
              >
                <Filter size={14} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#00d26a]" />
                )}
              </button>
            </div>

            {/* Collapsible Filter Row */}
            {isFilterTrayOpen && (
              <div className="p-3.5 bg-white dark:bg-[#151c2c] rounded-2xl border border-gray-200 dark:border-white/10 space-y-2 animate-in fade-in zoom-in-95 duration-150 shadow-sm">
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
          {loading ? (
            <div className="flex justify-center py-20">
              <DotmCircular7 size={40} className="text-[#6600FF]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {network.filter(person => {
                if (searchQuery && !person.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                if (selectedCountry && person.country !== selectedCountry) return false;
                if (selectedPracticeArea && person.practiceArea !== selectedPracticeArea) return false;
                return true;
              }).length === 0 ? (
                <div className="sm:col-span-2 lg:col-span-3 bg-white dark:bg-[#151c2c] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-12 text-center flex flex-col items-center">
                  <UsersRound size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">No {activeTab.toLowerCase()} found</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-sm">
                    {activeTab === 'Connections' 
                      ? 'Discover and connect with IP leaders to unlock direct 1-on-1 messaging.'
                      : activeTab === 'Following'
                      ? 'Follow IP attorneys and thought leaders to see their articles in your feed.'
                      : 'When others follow your public profile and posts, they will appear here.'}
                  </p>
                </div>
              ) : network.filter(person => {
                if (searchQuery && !person.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                if (selectedCountry && person.country !== selectedCountry) return false;
                if (selectedPracticeArea && person.practiceArea !== selectedPracticeArea) return false;
                return true; 
              }).map((person) => (
                <div key={person.id} className="bg-white dark:bg-[#151c2c] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-4 flex items-center justify-between gap-3 transition-all hover:border-[#5a32fa]/30">
                  
                  <Link href={`/platform/profile/${person.id}`} className="flex items-center gap-3 min-w-0 flex-1 group">
                    {person.avatarUrl ? (
                      <img src={person.avatarUrl} alt={person.name} className="w-11 h-11 rounded-full object-cover shrink-0 shadow-sm" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                        {person.initial}
                      </div>
                    )}
                    
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-[#5a32fa] transition-colors">
                        {person.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                        {person.practiceArea || person.role}
                      </p>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate block">
                        {person.country}
                      </span>
                    </div>
                  </Link>

                  {/* Actions by Tab */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {activeTab === 'Connections' && (
                      <>
                        <Link href={`/platform/messages?userId=${person.id}`}>
                          <button className="flex items-center gap-1 bg-[#5a32fa] hover:bg-[#4a24db] text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm shadow-[#5a32fa]/30 active:scale-95 transition-all">
                            <MessageCircle size={13} />
                            <span>Message</span>
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleRemoveConnection(person.id, person.connectionId)}
                          className="p-1.5 text-gray-400 hover:text-rose-500 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                          title="Remove connection"
                        >
                          <UserMinus size={15} />
                        </button>
                      </>
                    )}

                    {activeTab === 'Following' && (
                      <button 
                        onClick={() => handleUnfollow(person.id)}
                        className="flex items-center gap-1 bg-gray-100 dark:bg-white/10 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-xl font-bold text-xs border border-gray-200 dark:border-white/10 transition-colors"
                      >
                        <span>Unfollow</span>
                      </button>
                    )}

                    {activeTab === 'Followers' && (
                      <button 
                        onClick={() => handleConnect(person.id)}
                        className="flex items-center gap-1 bg-[#5a32fa] hover:bg-[#4a24db] text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all"
                      >
                        <UserPlus size={13} />
                        <span>Connect</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          </div>
          
          {/* Right Column Content */}
          <div className="w-full xl:w-[350px] shrink-0 flex flex-col gap-6">
            
            {/* Dynamic Advertisement Space */}
            <div className="hidden xl:block">
              <AdSlot slotId="network_sidebar" />
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
