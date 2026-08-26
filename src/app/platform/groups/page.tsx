'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Search, Plus, Hash, ShieldCheck, Lock, Globe, ArrowUpRight, Loader2, Sparkles, Check, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

interface GroupItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'Public' | 'Private';
  icon: string;
  color: string;
  cover_url?: string;
  members_count: number;
  isJoined?: boolean;
}

export default function GroupsPage() {
  const user = useAppStore((state) => state.user);

  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'All' | 'My Groups'>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);

  // Create Group Form State
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupType, setNewGroupType] = useState<'Public' | 'Private'>('Public');
  const [newGroupIcon, setNewGroupIcon] = useState("👥");
  const [newGroupColor, setNewGroupColor] = useState("#5a32fa");

  // Fetch groups and user memberships from Supabase
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data: dbGroups, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching groups:', error);
        setGroups([]);
        return;
      }

      let userJoinedGroupIds = new Set<string>();
      if (user?.id) {
        const { data: memberRows } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', user.id);

        if (memberRows) {
          memberRows.forEach(row => userJoinedGroupIds.add(row.group_id));
        }
      }

      const mapped: GroupItem[] = (dbGroups || []).map((g: any) => ({
        id: g.id,
        name: g.name,
        slug: g.slug || g.id,
        description: g.description || '',
        type: g.type === 'Private' ? 'Private' : 'Public',
        icon: g.icon || '👥',
        color: g.color || '#5a32fa',
        cover_url: g.cover_url || '',
        members_count: g.members_count || 1,
        isJoined: userJoinedGroupIds.has(g.id)
      }));

      setGroups(mapped);
    } catch (err) {
      console.error('Failed to load groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user?.id]);

  const toggleJoin = async (e: React.MouseEvent, group: GroupItem) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      alert("Please log in to join groups.");
      return;
    }

    setJoiningGroupId(group.id);
    const willJoin = !group.isJoined;

    // Optimistic UI Update
    setGroups(prev => prev.map(g => {
      if (g.id === group.id) {
        return {
          ...g,
          isJoined: willJoin,
          members_count: willJoin ? g.members_count + 1 : Math.max(1, g.members_count - 1)
        };
      }
      return g;
    }));

    try {
      if (willJoin) {
        await supabase.from('group_members').insert({
          group_id: group.id,
          user_id: user.id,
          role: 'member'
        });
        await supabase.from('groups').update({
          members_count: group.members_count + 1
        }).eq('id', group.id);
      } else {
        await supabase.from('group_members').delete()
          .eq('group_id', group.id)
          .eq('user_id', user.id);
        await supabase.from('groups').update({
          members_count: Math.max(1, group.members_count - 1)
        }).eq('id', group.id);
      }
    } catch (err) {
      console.error('Error toggling membership:', err);
      // Revert if error
      fetchGroups();
    } finally {
      setJoiningGroupId(null);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    if (!user?.id) {
      alert("Please log in to create a group.");
      return;
    }

    setIsCreating(true);
    try {
      const slug = newGroupName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

      const { data: createdGroup, error: createError } = await supabase
        .from('groups')
        .insert({
          name: newGroupName.trim(),
          slug,
          description: newGroupDesc.trim(),
          type: newGroupType,
          icon: newGroupIcon,
          color: newGroupColor,
          cover_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
          members_count: 1,
          created_by: user.id
        })
        .select()
        .single();

      if (createError) throw createError;

      if (createdGroup) {
        // Auto add creator as admin member
        await supabase.from('group_members').insert({
          group_id: createdGroup.id,
          user_id: user.id,
          role: 'admin'
        });

        setIsCreateModalOpen(false);
        setNewGroupName("");
        setNewGroupDesc("");
        fetchGroups();
      }
    } catch (err) {
      console.error('Error creating group:', err);
      alert('Failed to create group. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredGroups = groups.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : g.isJoined;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#07090e] text-gray-900 dark:text-gray-100 flex flex-col pb-20">
      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-8 border-b border-gray-200 dark:border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <Users size={34} className="text-[#5a32fa]" />
              Discover Groups
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium mt-1 text-sm sm:text-base">
              Find specialized IP practice groups, join active discussions, and share insights with global peers.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#5a32fa] to-[#7952ff] hover:from-[#4927cb] hover:to-[#6841ea] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95 text-sm cursor-pointer"
            >
              <Plus size={18} strokeWidth={3} />
              Create Group
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-[#11141f] md:flex-row md:items-center md:justify-between">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'My Groups'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`rounded-xl border px-6 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-gray-900 bg-gray-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-gray-900'
                    : 'border-transparent bg-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-50 dark:text-gray-300 dark:hover:border-white/10 dark:hover:bg-white/5'
                }`}
              >
                {tab} {tab === 'My Groups' && groups.filter(g => g.isJoined).length > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#5a32fa]/20 text-[#5a32fa] dark:text-indigo-300 text-xs">
                    {groups.filter(g => g.isJoined).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search groups by topic or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-xs sm:text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#5a32fa] focus:ring-4 focus:ring-[#5a32fa]/10 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />
          </div>
        </div>

        {/* Skeleton Screen Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-[#11141f] rounded-3xl border border-gray-200 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between h-[240px] animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-white/10" />
                  <div className="w-16 h-6 rounded-lg bg-gray-200 dark:bg-white/10" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-3/4 bg-gray-200 dark:bg-white/10 rounded-lg" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded-lg" />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/5">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded-md" />
                  <div className="h-8 w-24 bg-gray-200 dark:bg-white/10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Groups Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <Link 
                key={group.id} 
                href={`/platform/groups/${group.slug || group.id}`}
                className="group bg-white dark:bg-[#11141f] rounded-3xl border border-gray-200 dark:border-white/10 p-6 shadow-sm flex flex-col hover:-translate-y-1 hover:shadow-xl hover:border-[#5a32fa]/40 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Top Row: Icon + Type Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md border border-white/20 shrink-0 transform group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: group.color || '#5a32fa' }}
                  >
                    {group.icon}
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#1c2233] px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-300">
                    {group.type === 'Public' ? <Globe size={13} className="text-emerald-500" /> : <Lock size={13} className="text-amber-500" />}
                    {group.type}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#5a32fa] dark:group-hover:text-indigo-400 transition-colors">
                  {group.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-6 flex-1 line-clamp-2 leading-relaxed">
                  {group.description}
                </p>
                
                {/* Bottom Footer: Member count + Join Button */}
                <div className="flex items-center justify-between mt-auto border-t border-gray-100 dark:border-white/10 pt-4">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-bold text-xs sm:text-sm">
                    <Users size={15} />
                    {group.members_count.toLocaleString()} members
                  </div>
                  
                  <button 
                    onClick={(e) => toggleJoin(e, group)}
                    disabled={joiningGroupId === group.id}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                      group.isJoined 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950/40' 
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-[#5a32fa] dark:hover:bg-[#5a32fa] dark:hover:text-white'
                    }`}
                  >
                    {joiningGroupId === group.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : group.isJoined ? (
                      <>
                        <Check size={14} strokeWidth={2.5} />
                        <span>Joined</span>
                      </>
                    ) : (
                      <span>Join Group</span>
                    )}
                  </button>
                </div>
              </Link>
            ))}

            {filteredGroups.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white dark:bg-[#11141f] rounded-3xl border border-gray-200 dark:border-white/10 border-dashed">
                <Hash size={44} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No groups found</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Try adjusting your search query or switch tabs.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* CREATE GROUP MODAL */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#11141f] rounded-[2rem] p-6 sm:p-8 max-w-lg w-full border border-gray-200 dark:border-white/10 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Users size={24} className="text-[#5a32fa]" /> Create New Group
              </h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Group Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. European Patent Litigation Circle"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm font-semibold text-gray-900 dark:text-white focus:border-[#5a32fa] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Description
                </label>
                <textarea 
                  rows={3}
                  placeholder="What is the mission and topic of this group?"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm font-medium text-gray-900 dark:text-white focus:border-[#5a32fa] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Privacy
                  </label>
                  <select 
                    value={newGroupType}
                    onChange={(e) => setNewGroupType(e.target.value as any)}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-gray-900 dark:text-white focus:border-[#5a32fa] outline-none"
                  >
                    <option value="Public">Public Group</option>
                    <option value="Private">Private Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Icon / Symbol
                  </label>
                  <input 
                    type="text" 
                    maxLength={3}
                    value={newGroupIcon}
                    onChange={(e) => setNewGroupIcon(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-center text-gray-900 dark:text-white focus:border-[#5a32fa] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Theme Color
                </label>
                <div className="flex gap-2">
                  {['#5a32fa', '#00d26a', '#ff90e8', '#ffc900', '#ff4b4b', '#0984e3'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewGroupColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                        newGroupColor === c ? 'scale-110 border-black dark:border-white shadow-md' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-[#5a32fa] hover:bg-[#4927cb] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25 transition-all"
                >
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
