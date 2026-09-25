'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { 
  Search, Trash2, SquarePen, ListFilter, User, X, Check, 
  MessageSquare, Users, Camera, ArrowLeft, Bell, BellOff, Mail
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface SidebarChat {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
  initial: string;
  color: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  rawTimestamp?: number;
  isOnline?: boolean;
  isTyping?: boolean;
  participantId?: string;
  isGroup?: boolean;
  isMuted?: boolean;
}

interface ChatSidebarProps {
  conversations: SidebarChat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => Promise<void>;
  onToggleUnread?: (id: string) => void;
  onToggleMute?: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  chatFilter: 'all' | 'unread' | 'direct' | 'groups';
  onFilterChange: (f: 'all' | 'unread' | 'direct' | 'groups') => void;
  showMobileChat: boolean;
  onStartNewChat?: (userId: string) => void | Promise<void>;
  onOpenSally?: () => void;
  onCreateGroup?: (name: string, imageFile: File | null, memberIds: string[]) => Promise<void>;
  currentUserName?: string;
  currentUserId?: string;
}

interface DirectoryMember {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  role?: string | null;
  practice_area?: string | null;
}

const FALLBACK_MEMBERS: DirectoryMember[] = [
  { id: 'ac3759c1-58bc-412a-90bc-4de024aced85', full_name: 'Sophia Bennett', role: 'Head of IP Department | WIPA Member', practice_area: 'IP Strategy', avatar_url: 'https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/avatars/ac3759c1-58bc-412a-90bc-4de024aced85/1787296906871-Untitled_design__4_.webp' },
  { id: '41888225-3ef1-4763-b54b-4a3234a6e622', full_name: 'Aman Mishra', role: 'Magician', practice_area: 'Patent Portfolio', avatar_url: 'https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/avatars/41888225-3ef1-4763-b54b-4a3234a6e622/1785309222670.png' },
  { id: '687f8714-d06c-47e9-8b69-b3a2ea8d7f06', full_name: 'Dr. Eleanor Vance', role: 'Senior Patent Partner', practice_area: 'Biotech & Pharma', avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80' },
  { id: '0e6f5485-42fb-4f16-bd9c-62b8c955b633', full_name: 'Abhigna Mistry', role: 'IP Counsel', practice_area: 'Trademarks & Copyrights', avatar_url: 'https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/avatars/0e6f5485-42fb-4f16-bd9c-62b8c955b633/1785314463331.png' },
  { id: 'a1ba913a-5474-4cb1-9aad-00ba81fb9e8e', full_name: 'Vasudha Godbole', role: 'Senior Associate - IP & Trade', practice_area: 'IP Litigation', avatar_url: 'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?auto=format&fit=crop&w=400&h=400&q=80' },
  { id: '451ef3a7-976f-4396-92e9-c69f88b04eef', full_name: 'Dhruva Dakhani', role: 'Director of Creative Design', practice_area: 'Design Patents', avatar_url: 'https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/avatars/451ef3a7-976f-4396-92e9-c69f88b04eef/1785314512411.png' }
];

export interface ClusterProfile {
  id: string;
  full_name: string;
  avatar_url?: string | null;
}

const DEFAULT_CLUSTER_MEMBERS: ClusterProfile[] = [
  {
    id: 'ac3759c1-58bc-412a-90bc-4de024aced85',
    full_name: 'Sophia Bennett',
    avatar_url: 'https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/avatars/ac3759c1-58bc-412a-90bc-4de024aced85/1787296906871-Untitled_design__4_.webp'
  },
  {
    id: '41888225-3ef1-4763-b54b-4a3234a6e622',
    full_name: 'Aman Mishra',
    avatar_url: 'https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/avatars/41888225-3ef1-4763-b54b-4a3234a6e622/1785309222670.png'
  },
  {
    id: '687f8714-d06c-47e9-8b69-b3a2ea8d7f06',
    full_name: 'Dr. Eleanor Vance',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    id: '0e6f5485-42fb-4f16-bd9c-62b8c955b633',
    full_name: 'Abhigna Mistry',
    avatar_url: 'https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/avatars/0e6f5485-42fb-4f16-bd9c-62b8c955b633/1785314463331.png'
  },
  {
    id: 'a1ba913a-5474-4cb1-9aad-00ba81fb9e8e',
    full_name: 'Vasudha Godbole',
    avatar_url: 'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    id: '451ef3a7-976f-4396-92e9-c69f88b04eef',
    full_name: 'Dhruva Dakhani',
    avatar_url: 'https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/avatars/451ef3a7-976f-4396-92e9-c69f88b04eef/1785314512411.png'
  },
  {
    id: '349f5aad-ad87-419a-a8fe-ce7f7bf04383',
    full_name: 'Emily Watson',
    avatar_url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=400&h=400&q=80'
  }
];

interface KeepItRealIllustrationProps {
  profiles?: ClusterProfile[];
  onSelectMember?: (memberId: string) => void;
}

/* Organic Avatar Cluster with Central Speech Bubble - Connected & Followed Community Profiles */
function KeepItRealIllustration({ profiles = DEFAULT_CLUSTER_MEMBERS, onSelectMember }: KeepItRealIllustrationProps) {
  // Always guarantee 7 member profiles
  const memberList: ClusterProfile[] = [];
  for (let i = 0; i < 7; i++) {
    memberList.push(profiles[i] || DEFAULT_CLUSTER_MEMBERS[i % DEFAULT_CLUSTER_MEMBERS.length]);
  }

  const renderAvatarItem = (member: ClusterProfile, posClass: string, isBehindBubble = false) => {
    const initial = (member.full_name?.trim()?.charAt(0) || 'W').toUpperCase();

    return (
      <div
        key={member.id + '-' + posClass}
        onClick={(e) => {
          e.stopPropagation();
          if (member.id && onSelectMember) {
            onSelectMember(member.id);
          }
        }}
        title={`Chat with ${member.full_name}`}
        className={`${posClass} rounded-full border-2 border-white dark:border-[#0f172a] shadow-lg overflow-hidden cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 group flex items-center justify-center bg-slate-100 dark:bg-[#1e2330] ${isBehindBubble ? 'z-0' : 'z-10 hover:z-30'}`}
      >
        {member.avatar_url ? (
          <img
            src={member.avatar_url}
            alt={member.full_name}
            className="w-full h-full object-cover group-hover:brightness-105 transition-all"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          style={{ display: member.avatar_url ? 'none' : 'flex' }}
          className="w-full h-full bg-gradient-to-tr from-[#5a32fa] via-[#7c3aed] to-[#ff2a5f] items-center justify-center text-white font-extrabold text-xs sm:text-sm select-none shadow-inner"
        >
          {initial}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-72 h-48 mx-auto my-4 flex items-center justify-center select-none">
      {/* Avatar 1: Top-Left */}
      {renderAvatarItem(memberList[0], "absolute top-6 left-6 w-11 h-11")}

      {/* Avatar 2: Top-Center */}
      {renderAvatarItem(memberList[1], "absolute top-1 left-[35%] w-13 h-13")}

      {/* Avatar 3: Top-Right */}
      {renderAvatarItem(memberList[2], "absolute top-3 right-10 w-12 h-12")}

      {/* Avatar 4: Mid-Left */}
      {renderAvatarItem(memberList[3], "absolute top-14 left-10 w-14 h-14")}

      {/* Avatar 5: Central Behind Avatar */}
      {renderAvatarItem(memberList[4], "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-14 h-14", true)}

      {/* Avatar 6: Far-Right */}
      {renderAvatarItem(memberList[5], "absolute top-16 right-5 w-10 h-10")}

      {/* Avatar 7: Bottom-Right */}
      {renderAvatarItem(memberList[6], "absolute bottom-2 right-14 w-12 h-12")}

      {/* Central Floating Speech Bubble with 3 dots and speech tail */}
      <div className="absolute top-9 left-1/2 -translate-x-1/2 z-20 flex flex-col items-start filter drop-shadow-xl pointer-events-none">
        <div className="bg-[#2c3038] dark:bg-[#2b303c] border border-white/20 px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-200"></span>
          <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-200"></span>
          <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-200"></span>
        </div>
        {/* Tail pointing downwards */}
        <div className="w-0 h-0 border-t-[8px] border-t-[#2c3038] dark:border-t-[#2b303c] border-r-[8px] border-r-transparent ml-3 -mt-[1px]"></div>
      </div>
    </div>
  );
}


export const ChatSidebar: React.FC<ChatSidebarProps> = React.memo(({
  conversations,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onToggleUnread,
  onToggleMute,
  searchQuery,
  onSearchChange,
  chatFilter,
  onFilterChange,
  showMobileChat,
  onStartNewChat,
  onOpenSally,
  onCreateGroup,
  currentUserName = 'User',
  currentUserId
}) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'requests'>('inbox');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [directoryMembers, setDirectoryMembers] = useState<DirectoryMember[]>(FALLBACK_MEMBERS);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [clusterProfiles, setClusterProfiles] = useState<ClusterProfile[]>(DEFAULT_CLUSTER_MEMBERS);

  // Fetch connected or followed user profiles for KeepItReal illustration, falling back to random active community profiles
  useEffect(() => {
    let isCancelled = false;

    async function loadClusterProfiles() {
      try {
        let uid = currentUserId;
        if (!uid) {
          const { data: authData } = await supabase.auth.getUser();
          uid = authData.user?.id;
        }

        const candidateIds: string[] = [];

        if (uid) {
          // 1. Fetch connected members (accepted status)
          const { data: conns } = await supabase
            .from('connections')
            .select('requester_id, recipient_id')
            .or(`requester_id.eq.${uid},recipient_id.eq.${uid}`)
            .eq('status', 'accepted');

          if (conns) {
            conns.forEach(c => {
              const partnerId = c.requester_id === uid ? c.recipient_id : c.requester_id;
              if (partnerId && partnerId !== uid && !candidateIds.includes(partnerId)) {
                candidateIds.push(partnerId);
              }
            });
          }

          // 2. Fetch followed members
          const { data: follows } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', uid);

          if (follows) {
            follows.forEach(f => {
              if (f.following_id && f.following_id !== uid && !candidateIds.includes(f.following_id)) {
                candidateIds.push(f.following_id);
              }
            });
          }
        }

        let loadedProfiles: ClusterProfile[] = [];

        // Fetch profiles of connected or followed members
        if (candidateIds.length > 0) {
          const { data: matchedProfiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', candidateIds)
            .not('full_name', 'is', null);

          if (matchedProfiles && matchedProfiles.length > 0) {
            loadedProfiles = matchedProfiles.sort((a, b) => {
              if (a.avatar_url && !b.avatar_url) return -1;
              if (!a.avatar_url && b.avatar_url) return 1;
              return 0;
            });
          }
        }

        // 3. Fallback: if nothing is there or fewer than 7 profiles, fill with random active user profiles
        if (loadedProfiles.length < 7) {
          const existingIds = new Set(loadedProfiles.map(p => p.id));
          if (uid) existingIds.add(uid);

          const { data: communityProfiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .not('full_name', 'is', null)
            .limit(35);

          if (communityProfiles && communityProfiles.length > 0) {
            const available = communityProfiles.filter(p => !existingIds.has(p.id));
            const shuffled = [...available].sort(() => 0.5 - Math.random());
            shuffled.sort((a, b) => {
              if (a.avatar_url && !b.avatar_url) return -1;
              if (!a.avatar_url && b.avatar_url) return 1;
              return 0;
            });

            for (const member of shuffled) {
              if (loadedProfiles.length >= 7) break;
              loadedProfiles.push(member);
            }
          }
        }

        if (!isCancelled && loadedProfiles.length > 0) {
          setClusterProfiles(loadedProfiles.slice(0, 7));
        }
      } catch (err) {
        console.warn('Error loading dynamic cluster profiles:', err);
      }
    }

    loadClusterProfiles();

    return () => {
      isCancelled = true;
    };
  }, [currentUserId]);

  // Chat actions bottom drawer state (replaces centered delete modal)
  const [drawerChat, setDrawerChat] = useState<SidebarChat | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const drawerDragControls = useDragControls();
  const drawerTouchStartY = useRef<number | null>(null);

  const handleDrawerTouchStart = (e: React.TouchEvent) => {
    drawerTouchStartY.current = e.touches[0].clientY;
  };

  const handleDrawerTouchEnd = (e: React.TouchEvent) => {
    if (drawerTouchStartY.current === null) return;
    const currentY = e.changedTouches[0].clientY;
    const diff = currentY - drawerTouchStartY.current;
    drawerTouchStartY.current = null;
    if (diff > 45 && !isDeleting) {
      setDrawerChat(null);
      setIsConfirmingDelete(false);
    }
  };

  // Group creation modal state
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupMemberIds, setSelectedGroupMemberIds] = useState<string[]>([]);
  const [groupImageFile, setGroupImageFile] = useState<File | null>(null);
  const [groupImagePreview, setGroupImagePreview] = useState<string | null>(null);
  const [groupMemberSearch, setGroupMemberSearch] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupNameError, setGroupNameError] = useState(false);

  const groupImageInputRef = useRef<HTMLInputElement>(null);
  const groupDragControls = useDragControls();
  const groupSheetTouchStartY = useRef<number | null>(null);

  const handleGroupSheetTouchStart = (e: React.TouchEvent) => {
    groupSheetTouchStartY.current = e.touches[0].clientY;
  };

  const handleGroupSheetTouchEnd = (e: React.TouchEvent) => {
    if (groupSheetTouchStartY.current === null) return;
    const currentY = e.changedTouches[0].clientY;
    const diff = currentY - groupSheetTouchStartY.current;
    groupSheetTouchStartY.current = null;
    if (diff > 45) {
      setIsCreateGroupOpen(false);
    }
  };

  const handleGroupImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGroupImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setGroupImagePreview(previewUrl);
    }
  };

  const handleRemoveGroupImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGroupImageFile(null);
    if (groupImagePreview) {
      URL.revokeObjectURL(groupImagePreview);
      setGroupImagePreview(null);
    }
    if (groupImageInputRef.current) {
      groupImageInputRef.current.value = '';
    }
  };

  const toggleGroupMember = (memberId: string) => {
    setSelectedGroupMemberIds(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId) 
        : [...prev, memberId]
    );
  };

  const filterMenuRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggeredRef = useRef(false);
  const dragControls = useDragControls();
  const sheetTouchStartY = useRef<number | null>(null);

  const handleSheetTouchStart = (e: React.TouchEvent) => {
    sheetTouchStartY.current = e.touches[0].clientY;
  };

  const handleSheetTouchEnd = (e: React.TouchEvent) => {
    if (sheetTouchStartY.current === null) return;
    const currentY = e.changedTouches[0].clientY;
    const diff = currentY - sheetTouchStartY.current;
    sheetTouchStartY.current = null;
    if (diff > 45) {
      setIsNewMessageOpen(false);
    }
  };

  // Close filter dropdown on outside tap
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    }
    if (isFilterMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterMenuOpen]);

  // Load members from Supabase profiles when New Message or Create Group modal opens
  useEffect(() => {
    if (!isNewMessageOpen && !isCreateGroupOpen) return;
    let isCancelled = false;

    async function loadMembers() {
      setIsLoadingMembers(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role, practice_area')
          .not('full_name', 'is', null)
          .limit(40);

        if (!isCancelled && data && data.length > 0) {
          setDirectoryMembers(data);
        }
      } catch (err) {
        console.warn('Failed to load profiles directory:', err);
      } finally {
        if (!isCancelled) setIsLoadingMembers(false);
      }
    }

    loadMembers();
    return () => {
      isCancelled = true;
    };
  }, [isNewMessageOpen, isCreateGroupOpen]);

  const startLongPress = (chat: SidebarChat) => {
    isLongPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      setDrawerChat(chat);
      setIsConfirmingDelete(false);
    }, 550);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleChatClick = (chatId: string) => {
    if (isLongPressTriggeredRef.current) {
      isLongPressTriggeredRef.current = false;
      return;
    }
    onSelectChat(chatId);
  };

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (chatFilter === 'unread') return c.unread > 0;
    if (chatFilter === 'groups') return Boolean(c.isGroup) || c.role?.toLowerCase().includes('group') || c.name?.toLowerCase().includes('group');
    if (chatFilter === 'direct') return !c.isGroup && !c.role?.toLowerCase().includes('group') && !c.name?.toLowerCase().includes('group');
    return true;
  });

  // Filter directory members in modal
  const filteredDirectoryMembers = directoryMembers.filter(m => {
    if (!memberSearchQuery.trim()) return true;
    const q = memberSearchQuery.toLowerCase();
    return (m.full_name?.toLowerCase() || '').includes(q) ||
           (m.practice_area?.toLowerCase() || '').includes(q) ||
           (m.role?.toLowerCase() || '').includes(q);
  });

  // Filter group members excluding current user
  const filteredGroupMembers = directoryMembers.filter(m => {
    if (currentUserId && m.id === currentUserId) return false;
    if (!groupMemberSearch.trim()) return true;
    const q = groupMemberSearch.toLowerCase();
    return (m.full_name?.toLowerCase() || '').includes(q) ||
           (m.practice_area?.toLowerCase() || '').includes(q) ||
           (m.role?.toLowerCase() || '').includes(q);
  });

  const handlePickRecipient = async (userId: string) => {
    setIsNewMessageOpen(false);
    if (onStartNewChat) {
      await onStartNewChat(userId);
    }
  };

  const filterLabels: Record<string, string> = {
    all: 'All',
    unread: 'Unread',
    direct: 'Direct',
    groups: 'Groups'
  };

  return (
    <>
      <div className={`w-full md:w-[380px] lg:w-[420px] bg-white dark:bg-black md:dark:bg-[#0f172a] border-0 md:border-r border-slate-200 dark:border-white/10 flex flex-col overflow-hidden shrink-0 h-full min-h-0 select-none ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Top Header: Large Title "Messages" + Right-side Pencil Button */}
        <div className="pt-safe md:pt-4 px-4 sm:px-5 pb-2.5 space-y-3 shrink-0">
          <div className="flex items-center justify-between pt-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              Messages
            </h1>

            {/* Pencil button: opens New Message modal */}
            <button
              type="button"
              onClick={() => setIsNewMessageOpen(true)}
              aria-label="New Message"
              title="New Message"
              className="p-1.5 text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-gray-300 transition-colors active:scale-90 cursor-pointer"
            >
              <SquarePen size={23} strokeWidth={2} />
            </button>
          </div>

          {/* Search bar: Full width rounded pill */}
          <div className="relative w-full">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-2xl bg-slate-100 dark:bg-[#121212] md:dark:bg-[#181d28] border-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/40 transition-all shadow-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter Row: [ Filter Icon Button ] [ Inbox ] [ Requests ] */}
          <div className="flex items-center gap-2 pt-0.5 relative">
            
            {/* Filter button with dropdown menu */}
            <div className="relative" ref={filterMenuRef}>
              <button
                type="button"
                onClick={() => setIsFilterMenuOpen(prev => !prev)}
                aria-label="Filter messages"
                className={`relative px-3.5 py-1.5 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 border ${
                  chatFilter !== 'all'
                    ? 'bg-[#5a32fa] text-white border-[#5a32fa]'
                    : 'bg-slate-100 dark:bg-[#121212] md:dark:bg-[#181d28] text-slate-700 dark:text-white border-slate-200/80 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/15'
                }`}
              >
                <ListFilter size={16} strokeWidth={2.2} />
                {chatFilter !== 'all' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-black"></span>
                )}
              </button>

              {/* Filter Dropdown Menu */}
              {isFilterMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-[#141414] md:dark:bg-[#151a26] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400 border-b border-slate-100 dark:border-white/5">
                    Filter Messages
                  </div>
                  {[
                    { id: 'all', label: 'All Messages' },
                    { id: 'unread', label: 'Unread', count: conversations.filter(c => c.unread > 0).length },
                    { id: 'direct', label: 'Direct Messages' },
                    { id: 'groups', label: 'Groups' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onFilterChange(item.id as any);
                        setIsFilterMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors text-left cursor-pointer ${
                        chatFilter === item.id 
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-[#5a32fa] dark:text-purple-300' 
                          : 'text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {chatFilter === item.id ? (
                          <Check size={14} className="text-[#5a32fa] dark:text-purple-300 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Inbox Button */}
            <button
              type="button"
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 border ${
                activeTab === 'inbox'
                  ? 'bg-slate-900 text-white dark:bg-white/20 dark:text-white border-slate-900 dark:border-white/25 shadow-xs'
                  : 'bg-slate-100 dark:bg-[#121212] md:dark:bg-[#181d28] text-slate-700 dark:text-gray-300 border-slate-200/80 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/15'
              }`}
            >
              Inbox
            </button>

            {/* Requests Button */}
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 border ${
                activeTab === 'requests'
                  ? 'bg-slate-900 text-white dark:bg-white/20 dark:text-white border-slate-900 dark:border-white/25 shadow-xs'
                  : 'bg-slate-100 dark:bg-[#121212] md:dark:bg-[#181d28] text-slate-700 dark:text-gray-300 border-slate-200/80 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/15'
              }`}
            >
              Requests
            </button>

            {/* Active filter chip if non-default */}
            {chatFilter !== 'all' && (
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#5a32fa] dark:bg-purple-900/40 dark:text-purple-300 truncate max-w-[80px]">
                {filterLabels[chatFilter]}
              </span>
            )}
          </div>
        </div>

        {/* Content Zone */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col min-h-0 select-none pb-24 md:pb-6">
          
          {/* TAB 1: INBOX */}
          {activeTab === 'inbox' && (
            <>
              {/* If conversations exist, display list */}
              {filteredConversations.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredConversations.map(chat => (
                    <div 
                      key={chat.id}
                      onClick={() => handleChatClick(String(chat.id))}
                      onTouchStart={() => startLongPress(chat)}
                      onTouchEnd={cancelLongPress}
                      onTouchMove={cancelLongPress}
                      onMouseDown={() => startLongPress(chat)}
                      onMouseUp={cancelLongPress}
                      onMouseLeave={cancelLongPress}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setDrawerChat(chat);
                        setIsConfirmingDelete(false);
                      }}
                      className={`flex items-center gap-3.5 p-4 cursor-pointer transition-all duration-200 active:bg-slate-100 dark:active:bg-white/10 ${
                        String(activeChatId) === String(chat.id) 
                          ? 'md:bg-[#5a32fa]/10 md:dark:bg-[#5a32fa]/15 md:border-l-4 md:border-[#5a32fa] bg-transparent hover:bg-slate-50 dark:hover:bg-white/5' 
                          : 'hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="relative shrink-0">
                        {chat.avatarUrl?.includes('sally') || chat.id === 'sally-ip' ? (
                          <div className="w-12 h-12 rounded-full p-2.5 flex items-center justify-center shadow-xs border border-slate-200 dark:border-white/10 bg-purple-50 dark:bg-white/10">
                            <img 
                              src="/sally-logo.png" 
                              alt={chat.name} 
                              className="w-full h-full object-contain block dark:hidden pointer-events-none"
                            />
                            <img 
                              src="/sally-logo-white.png" 
                              alt={chat.name} 
                              className="w-full h-full object-contain hidden dark:block pointer-events-none"
                            />
                          </div>
                        ) : chat.avatarUrl ? (
                          <img 
                            src={chat.avatarUrl} 
                            alt={chat.name} 
                            className="w-12 h-12 rounded-full object-cover shadow-xs border border-slate-200 dark:border-white/10 pointer-events-none"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-base shadow-xs" style={{ backgroundColor: chat.color }}>
                            {chat.initial}
                          </div>
                        )}
                        {chat.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full"></span>
                        )}
                        {chat.unread > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 border-2 border-white dark:border-black rounded-full animate-pulse"></span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className={`font-bold text-sm truncate ${chat.unread > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-gray-200'}`}>
                            {chat.name}
                          </h3>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {chat.isMuted && (
                              <BellOff size={13} className="text-slate-400 dark:text-gray-500 shrink-0" />
                            )}
                            <span className={`text-[11px] whitespace-nowrap font-mono ${chat.unread > 0 ? 'font-bold text-[#5a32fa]' : 'text-slate-400 dark:text-gray-500'}`}>
                              {chat.lastTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className={`text-xs truncate pr-2 ${chat.unread > 0 ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-400'}`}>
                            {chat.isTyping ? <span className="text-[#5a32fa] font-bold animate-pulse">typing...</span> : chat.lastMessage}
                          </p>
                          {chat.unread > 0 && (
                            <span className="bg-[#5a32fa] text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[18px] text-center flex items-center justify-center shrink-0">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* EXACT EMPTY STATE MATCHING USER SCREENSHOT */
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center select-none my-auto">
                  <KeepItRealIllustration 
                    profiles={clusterProfiles}
                    onSelectMember={(userId) => {
                      if (onStartNewChat) {
                        onStartNewChat(userId);
                      } else {
                        setIsNewMessageOpen(true);
                      }
                    }}
                  />
                  
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-3 mb-2">
                    Keep it real in direct messages
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 max-w-xs sm:max-w-sm leading-relaxed mb-7 font-medium">
                    Start a side conversation, send threads or chat with Sally IP to get ideas and answers.
                  </p>
                  
                  <div className="flex items-center justify-center gap-3 w-full max-w-xs">
                    {/* Message Button */}
                    <button
                      type="button"
                      onClick={() => setIsNewMessageOpen(true)}
                      className="flex-1 py-2.5 px-5 rounded-full font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black transition-all active:scale-95 shadow-sm text-center cursor-pointer"
                    >
                      Message
                    </button>
                    
                    {/* Ask Sally IP Button */}
                    <button
                      type="button"
                      onClick={onOpenSally}
                      className="flex-1 py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-purple-50 text-[#5a32fa] border border-purple-200 hover:bg-purple-100 dark:bg-[#121212] md:dark:bg-[#181d28] dark:text-white dark:border-white/10 dark:hover:bg-[#222938] transition-all active:scale-95 shadow-sm text-center cursor-pointer"
                    >
                      <img 
                        src="/sally-logo.png" 
                        alt="Sally IP" 
                        className="w-4 h-4 object-contain block dark:hidden" 
                      />
                      <img 
                        src="/sally-logo-white.png" 
                        alt="Sally IP" 
                        className="w-4 h-4 object-contain hidden dark:block" 
                      />
                      <span>Ask Sally IP</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 2: REQUESTS */}
          {activeTab === 'requests' && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center my-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-[#121212] md:dark:bg-[#181d28] flex items-center justify-center text-slate-400 dark:text-gray-400 mb-4 border border-slate-200 dark:border-white/10">
                <MessageSquare size={26} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                No message requests
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xs leading-relaxed mb-6">
                When you receive messages from members outside your verified network, they will appear here.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('inbox')}
                className="px-5 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-white/20 transition-all cursor-pointer"
              >
                Back to Inbox
              </button>
            </div>
          )}

        </div>
      </div>

      {/* NEW MESSAGE MODAL (Recipient Selector with Smooth Slide-Up & Slide-Down) */}
      <AnimatePresence>
        {isNewMessageOpen && (
          <motion.div 
            key="new-message-modal-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
          >
            {/* Backdrop: Clicking outside/above/left area slides down and closes */}
            <div
              onClick={() => setIsNewMessageOpen(false)}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 cursor-pointer"
              aria-hidden="true"
            />

            {/* Bottom Drawer Sheet: Smooth Slide-Up and Slide-Down */}
            <motion.div
              key="new-message-sheet"
              drag="y"
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 60 || info.velocity.y > 250) {
                  setIsNewMessageOpen(false);
                }
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full sm:max-w-md bg-white dark:bg-black md:dark:bg-[#0f172a] border-t sm:border border-slate-200 dark:border-white/10 h-[88vh] sm:h-[620px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden will-change-transform transform-gpu"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pull Handle Bar (Pull down to dismiss) */}
              <div 
                className="w-full flex flex-col items-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none select-none shrink-0"
                onPointerDown={(e) => dragControls.start(e)}
                onTouchStart={handleSheetTouchStart}
                onTouchEnd={handleSheetTouchEnd}
              >
                <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20" />
              </div>

              {/* Modal Header: Centered Title, Cross Button Removed */}
              <div 
                className="px-4 py-2 border-b border-slate-100 dark:border-white/10 flex items-center justify-center shrink-0 relative select-none cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={(e) => dragControls.start(e)}
                onTouchStart={handleSheetTouchStart}
                onTouchEnd={handleSheetTouchEnd}
              >
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white text-center w-full">
                  New Message
                </h2>
              </div>

              {/* Modal Search Bar */}
              <div className="p-3.5 border-b border-slate-100 dark:border-white/10 shrink-0">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search members or practice areas..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent focus:border-[#5a32fa] text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Recipient Directory List */}
              <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-50 dark:divide-white/5 p-2">
                
                {/* Option 0: Create a group chat (Before Sally IP) */}
                <div
                  onClick={() => {
                    setIsNewMessageOpen(false);
                    setIsCreateGroupOpen(true);
                    setGroupName('');
                    setSelectedGroupMemberIds([]);
                    setGroupImageFile(null);
                    setGroupImagePreview(null);
                    setGroupMemberSearch('');
                    setGroupNameError(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#8b5cf6] p-2.5 flex items-center justify-center shrink-0 shadow-xs text-white">
                    <Users size={20} strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5a32fa] transition-colors truncate">
                      Create a group chat
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate">
                      Start a conversation with multiple network members
                    </p>
                  </div>
                </div>

                {/* Option 1: Sally IP */}
                <div
                  onClick={() => {
                    setIsNewMessageOpen(false);
                    if (onOpenSally) onOpenSally();
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div className="w-11 h-11 rounded-full bg-purple-100 dark:bg-white/10 p-2.5 flex items-center justify-center shrink-0 border border-purple-200 dark:border-white/10 shadow-xs">
                    <img src="/sally-logo.png" alt="Sally IP" className="w-full h-full object-contain block dark:hidden" />
                    <img src="/sally-logo-white.png" alt="Sally IP" className="w-full h-full object-contain hidden dark:block" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5a32fa] transition-colors truncate">
                      Sally IP
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate">
                      Instant legal research, patent advice & drafting
                    </p>
                  </div>
                </div>

                {/* Verified Network Members */}
                {isLoadingMembers ? (
                  <div className="p-8 text-center text-slate-400 flex items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-[#5a32fa]" />
                  </div>
                ) : filteredDirectoryMembers.length > 0 ? (
                  filteredDirectoryMembers.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => handlePickRecipient(member.id)}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                    >
                      {member.avatar_url ? (
                        <img 
                          src={member.avatar_url} 
                          alt={member.full_name} 
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-white/10 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff2a5f] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {member.full_name?.charAt(0)?.toUpperCase() || 'M'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5a32fa] transition-colors truncate">
                          {member.full_name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate">
                          {member.practice_area || member.role || 'Verified Member'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 dark:text-gray-500 font-medium">
                    No members found matching &quot;{memberSearchQuery}&quot;
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE GROUP CHAT MODAL */}
      <AnimatePresence>
        {isCreateGroupOpen && (
          <motion.div 
            key="create-group-modal-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="fixed inset-0 z-[210] flex items-end sm:items-center justify-center"
          >
            {/* Backdrop: Clicking outside slides down and closes */}
            <div
              onClick={() => {
                if (!isCreatingGroup) setIsCreateGroupOpen(false);
              }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 cursor-pointer"
              aria-hidden="true"
            />

            {/* Bottom Sheet / Modal: Smooth Slide-Up and Slide-Down */}
            <motion.div
              key="create-group-sheet"
              drag="y"
              dragListener={false}
              dragControls={groupDragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(e, info) => {
                if (!isCreatingGroup && (info.offset.y > 60 || info.velocity.y > 250)) {
                  setIsCreateGroupOpen(false);
                }
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full sm:max-w-lg bg-white dark:bg-[#0f172a] border-t sm:border border-slate-200 dark:border-white/10 h-[92vh] sm:h-[660px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden will-change-transform transform-gpu"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pull Handle Bar (Pull down to dismiss on mobile) */}
              <div 
                className="w-full flex flex-col items-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none select-none shrink-0"
                onPointerDown={(e) => groupDragControls.start(e)}
                onTouchStart={handleGroupSheetTouchStart}
                onTouchEnd={handleGroupSheetTouchEnd}
              >
                <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20" />
              </div>

              {/* Modal Header */}
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0 relative select-none">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupOpen(false)}
                  className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft size={19} />
                </button>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white text-center flex-1">
                  New Group Chat
                </h2>
                <div className="w-7" />
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                
                {/* 1. Group Image Section */}
                <div className="flex flex-col items-center justify-center pt-1 pb-2">
                  <div 
                    onClick={() => groupImageInputRef.current?.click()}
                    className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full cursor-pointer group shadow-lg ring-4 ring-[#5a32fa]/10 transition-transform active:scale-95"
                    title="Upload group photo"
                  >
                    {groupImagePreview ? (
                      <img 
                        src={groupImagePreview} 
                        alt="Group preview" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff2a5f] text-white flex items-center justify-center font-extrabold text-3xl select-none shadow-inner">
                        {(currentUserName || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    {/* Camera Badge Overlay */}
                    <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white dark:bg-[#1e293b] text-slate-700 dark:text-white shadow-md border border-slate-200 dark:border-white/10 group-hover:bg-[#5a32fa] group-hover:text-white transition-colors">
                      <Camera size={14} />
                    </div>
                  </div>

                  <input 
                    type="file" 
                    ref={groupImageInputRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleGroupImageChange} 
                  />

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => groupImageInputRef.current?.click()}
                      className="text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] hover:underline"
                    >
                      {groupImagePreview ? 'Change group photo' : 'Upload group photo'}
                    </button>
                    {groupImagePreview && (
                      <>
                        <span className="text-slate-300 dark:text-white/20">•</span>
                        <button
                          type="button"
                          onClick={handleRemoveGroupImage}
                          className="text-xs font-medium text-rose-500 hover:underline"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. Group Name Field (Mandatory) */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                    Group Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Patent Law Strategy & Portfolio"
                    value={groupName}
                    maxLength={60}
                    onChange={(e) => {
                      setGroupName(e.target.value);
                      if (groupNameError && e.target.value.trim()) setGroupNameError(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border ${
                      groupNameError 
                        ? 'border-rose-500 focus:border-rose-500' 
                        : 'border-transparent focus:border-[#5a32fa]'
                    } text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-400 focus:outline-none transition-all`}
                  />
                  {groupNameError && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1">
                      Group name is mandatory.
                    </p>
                  )}
                </div>

                {/* 3. Member Selection Section (At least 1 required) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-900 dark:text-white">
                      Add Members <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400">
                      {selectedGroupMemberIds.length} selected (min 1 required)
                    </span>
                  </div>

                  {/* Selected Member Chips */}
                  {selectedGroupMemberIds.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5 mb-2">
                      {selectedGroupMemberIds.map((memberId) => {
                        const m = directoryMembers.find(d => d.id === memberId);
                        const name = m?.full_name || 'Member';
                        return (
                          <div 
                            key={memberId}
                            className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full bg-[#5a32fa]/10 dark:bg-[#5a32fa]/20 border border-[#5a32fa]/30 text-xs font-bold text-[#5a32fa] dark:text-[#ff90e8] shrink-0"
                          >
                            {m?.avatar_url ? (
                              <img src={m.avatar_url} alt={name} className="w-4 h-4 rounded-full object-cover" />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-[#5a32fa] text-white text-[9px] flex items-center justify-center">
                                {name.charAt(0)}
                              </div>
                            )}
                            <span className="max-w-[100px] truncate">{name}</span>
                            <button
                              type="button"
                              onClick={() => toggleGroupMember(memberId)}
                              className="p-0.5 hover:bg-[#5a32fa]/20 rounded-full transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Search members bar */}
                  <div className="relative mb-2">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search members to add..."
                      value={groupMemberSearch}
                      onChange={(e) => setGroupMemberSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent focus:border-[#5a32fa] text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-400 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Directory list for multi-select */}
                  <div className="max-h-56 overflow-y-auto no-scrollbar rounded-2xl border border-slate-100 dark:border-white/10 divide-y divide-slate-50 dark:divide-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                    {isLoadingMembers ? (
                      <div className="p-6 text-center text-slate-400 flex items-center justify-center">
                        <Loader2 size={20} className="animate-spin text-[#5a32fa]" />
                      </div>
                    ) : filteredGroupMembers.length > 0 ? (
                      filteredGroupMembers.map((member) => {
                        const isSelected = selectedGroupMemberIds.includes(member.id);
                        return (
                          <div
                            key={member.id}
                            onClick={() => toggleGroupMember(member.id)}
                            className="flex items-center gap-3 p-2.5 hover:bg-slate-100/70 dark:hover:bg-white/5 cursor-pointer transition-colors"
                          >
                            {/* Avatar */}
                            {member.avatar_url ? (
                              <img 
                                src={member.avatar_url} 
                                alt={member.full_name} 
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-white/10 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff2a5f] text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {member.full_name?.charAt(0)?.toUpperCase() || 'M'}
                              </div>
                            )}

                            {/* Name & Role */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {member.full_name}
                              </h4>
                              <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate">
                                {member.practice_area || member.role || 'Member'}
                              </p>
                            </div>

                            {/* Checkbox circle */}
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                              isSelected 
                                ? 'bg-[#5a32fa] text-white shadow-xs' 
                                : 'border-2 border-slate-300 dark:border-white/20'
                            }`}>
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-400 dark:text-gray-500 font-medium">
                        No members found matching &quot;{groupMemberSearch}&quot;
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-3.5 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0f172a] shrink-0">
                <button
                  type="button"
                  disabled={!groupName.trim() || selectedGroupMemberIds.length === 0 || isCreatingGroup}
                  onClick={async () => {
                    if (!groupName.trim()) {
                      setGroupNameError(true);
                      return;
                    }
                    if (selectedGroupMemberIds.length === 0) {
                      return;
                    }
                    if (onCreateGroup) {
                      setIsCreatingGroup(true);
                      try {
                        await onCreateGroup(groupName.trim(), groupImageFile, selectedGroupMemberIds);
                        setIsCreateGroupOpen(false);
                      } finally {
                        setIsCreatingGroup(false);
                      }
                    }
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#5a32fa] to-[#8b5cf6] hover:from-[#6a42ff] hover:to-[#9b6cf6] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#5a32fa]/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {isCreatingGroup ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white" />
                      <span>Creating group chat...</span>
                    </>
                  ) : (
                    <span>
                      Create Group Chat {selectedGroupMemberIds.length > 0 ? `(${selectedGroupMemberIds.length} members)` : ''}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM DRAWER FOR CHAT ACTIONS (Mark as Unread, Mute/Unmute, Delete with Confirmation) */}
      <AnimatePresence>
        {drawerChat && (
          <motion.div
            key="chat-actions-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-[250] flex items-end justify-center"
          >
            {/* Backdrop: Clicking outside slides down and dismisses */}
            <div 
              onClick={() => {
                if (!isDeleting) {
                  setDrawerChat(null);
                  setIsConfirmingDelete(false);
                }
              }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs cursor-pointer"
              aria-hidden="true"
            />

            {/* Bottom Drawer Sheet */}
            <motion.div
              key="chat-actions-drawer-sheet"
              drag="y"
              dragListener={false}
              dragControls={drawerDragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(e, info) => {
                if (!isDeleting && (info.offset.y > 60 || info.velocity.y > 250)) {
                  setDrawerChat(null);
                  setIsConfirmingDelete(false);
                }
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full sm:max-w-md bg-white dark:bg-[#0f172a] border-t sm:border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden will-change-transform transform-gpu pb-safe"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pull Handle Bar */}
              <div 
                className="w-full flex flex-col items-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none select-none shrink-0"
                onPointerDown={(e) => drawerDragControls.start(e)}
                onTouchStart={handleDrawerTouchStart}
                onTouchEnd={handleDrawerTouchEnd}
              >
                <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20" />
              </div>

              {!isConfirmingDelete ? (
                /* MAIN ACTIONS LIST */
                <div className="p-4 space-y-3.5">
                  
                  {/* Selected Chat Profile Summary Card */}
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <div className="relative shrink-0">
                      {drawerChat.avatarUrl ? (
                        <img 
                          src={drawerChat.avatarUrl} 
                          alt={drawerChat.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-white/10" 
                        />
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-base shadow-xs" 
                          style={{ backgroundColor: drawerChat.color || '#5a32fa' }}
                        >
                          {drawerChat.initial || drawerChat.name.charAt(0)}
                        </div>
                      )}
                      {drawerChat.isMuted && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                          <BellOff size={10} strokeWidth={2.5} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                          {drawerChat.name}
                        </h3>
                        {drawerChat.isMuted && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            Muted
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-gray-400 truncate mt-0.5">
                        {drawerChat.role || (drawerChat.isGroup ? 'Group Conversation' : 'Direct Message')}
                      </p>
                    </div>
                  </div>

                  {/* Actions List */}
                  <div className="rounded-2xl border border-slate-100 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
                    
                    {/* Option 1: Mark as Unread / Read */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onToggleUnread) {
                          onToggleUnread(drawerChat.id);
                        }
                        setDrawerChat(null);
                      }}
                      className="w-full flex items-center gap-3.5 p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5a32fa] dark:text-[#ff90e8] flex items-center justify-center shrink-0">
                        <Mail size={19} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5a32fa] transition-colors">
                          {drawerChat.unread > 0 ? 'Mark as read' : 'Mark as unread'}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400">
                          {drawerChat.unread > 0 ? 'Clear unread message badge' : 'Add unread badge as a reminder'}
                        </p>
                      </div>
                    </button>

                    {/* Option 2: Mute / Unmute Messages */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onToggleMute) {
                          onToggleMute(drawerChat.id);
                        }
                        setDrawerChat(null);
                      }}
                      className="w-full flex items-center gap-3.5 p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        drawerChat.isMuted
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                      }`}>
                        {drawerChat.isMuted ? <Bell size={19} /> : <BellOff size={19} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5a32fa] transition-colors">
                          {drawerChat.isMuted ? 'Unmute messages' : 'Mute messages'}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400">
                          {drawerChat.isMuted ? 'Receive message notifications again' : 'No notifications will come from this chat'}
                        </p>
                      </div>
                    </button>

                    {/* Option 3: Delete Chat */}
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(true)}
                      className="w-full flex items-center gap-3.5 p-3.5 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                        <Trash2 size={19} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">
                          Delete chat
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400">
                          Permanently delete this conversation
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={() => setDrawerChat(null)}
                    className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-gray-200 text-xs font-bold transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                /* CONFIRMATION MESSAGE SCREEN INSIDE DRAWER */
                <div className="p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
                    <Trash2 size={26} />
                  </div>

                  <div className="text-center space-y-1.5">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Delete conversation?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                      Are you sure you want to delete the conversation with <strong className="text-slate-900 dark:text-white">{drawerChat.name}</strong>? All messages from this chat will be permanently removed.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setIsConfirmingDelete(false)}
                      className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold transition-all disabled:opacity-50 active:scale-95"
                    >
                      No, Keep
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={async () => {
                        setIsDeleting(true);
                        try {
                          await onDeleteChat(drawerChat.id);
                          setDrawerChat(null);
                          setIsConfirmingDelete(false);
                        } finally {
                          setIsDeleting(false);
                        }
                      }}
                      className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95"
                    >
                      {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      <span>{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

ChatSidebar.displayName = 'ChatSidebar';

