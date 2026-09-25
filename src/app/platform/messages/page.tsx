'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { 
  Paperclip, Send, Camera, Mic, MapPin, Image as ImageIcon, Video, FileText, 
  X, Square, WifiOff, MessageCircle, ChevronDown, Play, Pause, Trash2, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { Suspense } from 'react';
import { MessageStatusTick, MessageStatus } from '@/components/chat/MessageStatusTick';
import { MessageBubble, ChatMessage, MediaType } from '@/components/chat/MessageBubble';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatSidebar, SidebarChat } from '@/components/chat/ChatSidebar';
import { encryptMessage, decryptMessage, isEncrypted } from '@/lib/e2ee';
import { SentIcon } from '@/components/icons/SentIcon';
import { askSallyChatAI } from '@/app/actions/lexiq';

export type Chat = SidebarChat & {
  messages: ChatMessage[];
  participantId?: string;
};

const SALLY_CHAT_STORAGE_KEY = 'wipa_sally_chat_messages_v2';

const getInitialSallyMessages = (): ChatMessage[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(SALLY_CHAT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [
    {
      id: 'sally_welcome_msg',
      conversation_id: 'sally-ip',
      text: 'Hello! I am Sally IP, your intellectual property and legal co-pilot for WIPA. How can I assist you with patent strategy, trademarks, research, or drafting today?',
      sender: 'them',
      sender_id: 'sally-ip',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      created_at: new Date().toISOString(),
      type: 'text',
      status: 'read',
      is_read: true
    }
  ];
};

const createSallyChatObject = (initialMessages?: ChatMessage[]): Chat => {
  const msgs = initialMessages && initialMessages.length > 0 ? initialMessages : getInitialSallyMessages();
  const lastMsg = msgs[msgs.length - 1];
  return {
    id: 'sally-ip',
    name: 'Sally IP',
    role: 'AI Intellectual Property Co-Pilot',
    avatarUrl: '/sally-logo.png',
    initial: 'S',
    color: '#5a32fa',
    unread: 0,
    lastMessage: lastMsg?.text || 'Hello! I am Sally IP, your intellectual property co-pilot for WIPA.',
    lastTime: lastMsg ? new Date(lastMsg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
    rawTimestamp: lastMsg?.created_at ? new Date(lastMsg.created_at).getTime() : Date.now(),
    isOnline: true,
    isTyping: false,
    messages: msgs,
    participantId: 'sally-ip'
  };
};

const MESSAGE_OUTBOX_KEY = 'wipa_message_outbox_v1';

type OutboxEntry = { userId: string; message: ChatMessage };

const readMessageOutbox = (): OutboxEntry[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(MESSAGE_OUTBOX_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveOutboxMessage = (userId: string, message: ChatMessage) => {
  const entries = readMessageOutbox().filter(entry => entry.message.id !== message.id);
  entries.push({ userId, message });
  localStorage.setItem(MESSAGE_OUTBOX_KEY, JSON.stringify(entries));
};

const removeOutboxMessage = (messageId: string) => {
  localStorage.setItem(MESSAGE_OUTBOX_KEY, JSON.stringify(readMessageOutbox().filter(entry => entry.message.id !== messageId)));
};

function getDateDivider(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

function MessagesContent() {
  const router = useRouter();
  const { user, cachedConversations, setCachedConversations, setIsInsideChat, setIsLexIQOpen } = useAppStore();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');
  const targetConversationId = searchParams.get('chatId');
  
  const [conversations, setConversations] = useState<Chat[]>(() => cachedConversations || []);
  const [activeChatId, setActiveChatId] = useState<string | null>(() => targetConversationId || (cachedConversations && cachedConversations.length > 0 ? String(cachedConversations[0].id) : null));
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    setIsInsideChat(showMobileChat);
    return () => {
      setIsInsideChat(false);
    };
  }, [showMobileChat, setIsInsideChat]);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [inChatSearchQuery, setInChatSearchQuery] = useState("");
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'direct' | 'groups'>('all');
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isChatOptionsOpen, setIsChatOptionsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showScrollBottomPill, setShowScrollBottomPill] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [mutedChatIds, setMutedChatIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('wipa_muted_chats');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Attachment refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Voice recording & preview state
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [previewCurrentTime, setPreviewCurrentTime] = useState(0);
  const [previewTotalDuration, setPreviewTotalDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordStartTimeRef = useRef<number>(0);
  const lastSendTimestampRef = useRef<number>(0);

  // Scroll and tracking refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeChatIdRef = useRef<string | null>(null);
  const initialScrolledRef = useRef<Record<string, boolean>>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeChannelRef = useRef<any>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const openedDeepLinkRef = useRef<string | null>(null);
  const sendAudioContextRef = useRef<AudioContext | null>(null);

  const activeChat = conversations.find(c => String(c.id) === String(activeChatId));

  const playSendSound = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = sendAudioContextRef.current || new AudioContextClass();
      sendAudioContextRef.current = context;
      void context.resume();
      const now = context.currentTime;
      const gain = context.createGain();
      const first = context.createOscillator();
      const second = context.createOscillator();
      first.type = 'sine';
      second.type = 'sine';
      first.frequency.setValueAtTime(720, now);
      first.frequency.exponentialRampToValueAtTime(1040, now + 0.07);
      second.frequency.setValueAtTime(1180, now + 0.045);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.09, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
      first.connect(gain);
      second.connect(gain);
      gain.connect(context.destination);
      first.start(now);
      second.start(now + 0.045);
      first.stop(now + 0.1);
      second.stop(now + 0.13);
    } catch {
      // Sound is enhancement-only; sending must never depend on audio availability.
    }
  }, []);

  // Auto close attachment menu when clicking or tapping outside
  useEffect(() => {
    if (!isAttachmentMenuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent | PointerEvent) => {
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(e.target as Node)) {
        setIsAttachmentMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isAttachmentMenuOpen]);

  useEffect(() => {
    activeChatIdRef.current = activeChatId ? String(activeChatId) : null;
  }, [activeChatId]);

  // Network online/offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // iOS Safari Visual Viewport Synchronizer (Keeps Chat Header permanently locked & Caret perfectly aligned on mobile only)
  useEffect(() => {
    if (!showMobileChat || !isMobileView) return;

    const updateViewport = () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        const vv = window.visualViewport;
        document.documentElement.style.setProperty('--chat-viewport-height', `${vv.height}px`);
        document.documentElement.style.setProperty('--chat-viewport-top', `${vv.offsetTop}px`);
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      }
    };

    if (typeof window !== 'undefined' && window.visualViewport) {
      updateViewport();
      window.visualViewport.addEventListener('resize', updateViewport);
      window.visualViewport.addEventListener('scroll', updateViewport);
    }

    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    document.body.style.overflow = 'hidden';

    return () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewport);
        window.visualViewport.removeEventListener('scroll', updateViewport);
      }
      document.documentElement.style.removeProperty('--chat-viewport-height');
      document.documentElement.style.removeProperty('--chat-viewport-top');
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
    };
  }, [showMobileChat, isMobileView]);

  // Load real conversations directly from Supabase DB with real avatar URLs and latest messages
  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data: myConvs, error: convErr } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations (
            id,
            updated_at,
            name,
            is_group,
            conversation_participants (
              user_id,
              profiles:profiles!conversation_participants_user_id_fkey (id, full_name, avatar_url, role, practice_area)
            )
          )
        `)
        .eq('user_id', user.id);

      if (myConvs && myConvs.length > 0) {
        const convIds = myConvs.filter(c => c.conversations).map(c => c.conversation_id);
        
        // 1. Get actual unread counts from messages table
        const { data: unreadData } = await supabase
          .from('messages')
          .select('conversation_id')
          .in('conversation_id', convIds)
          .eq('is_read', false)
          .neq('sender_id', user.id);

        const unreadMap: Record<string, number> = {};
        if (unreadData) {
          unreadData.forEach((m: any) => {
            unreadMap[m.conversation_id] = (unreadMap[m.conversation_id] || 0) + 1;
          });
        }

        // 2. Get latest message for EACH conversation
        const { data: latestMsgs } = await supabase
          .from('messages')
          .select('conversation_id, content, media_type, created_at')
          .in('conversation_id', convIds)
          .order('created_at', { ascending: false });

        const latestMsgMap: Record<string, any> = {};
        const decryptedPreviewMap: Record<string, string> = {};
        if (latestMsgs) {
          for (const m of latestMsgs) {
            if (!latestMsgMap[m.conversation_id]) {
              latestMsgMap[m.conversation_id] = m;
              if (m.content) {
                try {
                  decryptedPreviewMap[m.conversation_id] = await decryptMessage(m.content, String(m.conversation_id));
                } catch {
                  decryptedPreviewMap[m.conversation_id] = m.content;
                }
              }
            }
          }
        }

        const parsed: Chat[] = myConvs
          .filter((c: any) => c.conversations)
          .map((c: any) => {
            const conv = c.conversations;
            const other = conv.conversation_participants?.find((p: any) => p.user_id !== user.id)?.profiles || {};
            
            let title = 'Direct Message';
            let avatar: string | null = null;
            let roleStr = other.practice_area || other.role || 'Member';
            const isGroup = Boolean(conv.is_group);

            if (isGroup) {
              const rawName = conv.name || 'Group Chat';
              if (rawName.includes(':::')) {
                const parts = rawName.split(':::');
                title = parts[0] || 'Group Chat';
                avatar = parts[1] || null;
              } else {
                title = rawName;
              }
              const count = conv.conversation_participants?.length || 0;
              roleStr = `${count} ${count === 1 ? 'member' : 'members'}`;
            } else {
              title = other.full_name || 'Direct Message';
              avatar = other.avatar_url || null;
            }

            const latest = latestMsgMap[conv.id];
            
            let previewText = 'Start a conversation';
            if (latest) {
              if (latest.media_type === 'image') previewText = '📷 Photo';
              else if (latest.media_type === 'video') previewText = '🎥 Video';
              else if (latest.media_type === 'document') previewText = '📄 Document';
              else if (latest.media_type === 'audio') previewText = '🎤 Voice message';
              else if (latest.media_type === 'location') previewText = '📍 Location';
              else previewText = decryptedPreviewMap[conv.id] || latest.content || 'Start a conversation';
            }

            const timeStr = latest?.created_at 
              ? new Date(latest.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : (conv.updated_at ? new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

            const rawTimestamp = latest?.created_at 
              ? new Date(latest.created_at).getTime()
              : (conv.updated_at ? new Date(conv.updated_at).getTime() : 0);

            return {
              id: String(conv.id),
              name: title,
              role: roleStr,
              avatarUrl: avatar,
              initial: title.charAt(0).toUpperCase() || (isGroup ? 'G' : 'M'),
              color: '#5a32fa',
              unread: unreadMap[conv.id] || 0,
              lastMessage: previewText,
              lastTime: timeStr,
              rawTimestamp,
              isGroup,
              isMuted: mutedChatIds.includes(String(conv.id)),
              messages: [],
              participantId: isGroup ? undefined : other.id
            };
          });

        // Always put most recent conversation at the top
        parsed.sort((a, b) => (b.rawTimestamp || 0) - (a.rawTimestamp || 0));

        if (parsed.length > 0) {
          setConversations(prev => {
            const existingMessagesMap: Record<string, ChatMessage[]> = {};
            prev.forEach(chat => {
              if (chat.messages && chat.messages.length > 0) {
                existingMessagesMap[String(chat.id)] = chat.messages;
              }
            });

            const merged = parsed.map(c => ({
              ...c,
              messages: existingMessagesMap[String(c.id)] || []
            }));

            // Preserve Sally IP conversation if already opened or active
            const existingSally = prev.find(c => c.id === 'sally-ip');
            const finalList = existingSally ? [existingSally, ...merged.filter(c => c.id !== 'sally-ip')] : merged;
            finalList.sort((a, b) => (b.rawTimestamp || 0) - (a.rawTimestamp || 0));

            queueMicrotask(() => {
              useAppStore.getState().setCachedConversations(finalList);
            });
            return finalList;
          });

          if (!activeChatIdRef.current && !targetUserId && !targetConversationId) {
            setActiveChatId(String(parsed[0].id));
          }
        } else {
          setConversations(prev => {
            const existingSally = prev.find(c => c.id === 'sally-ip');
            return existingSally ? [existingSally] : prev;
          });
        }
      }
    } catch (err) {
      console.error("Failed to load conversations from DB:", err);
    }
  }, [user?.id, targetUserId, targetConversationId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle direct targetUserId routing with mutual connection check
  useEffect(() => {
    if (targetUserId && user?.id) {
       const initChat = async () => {
          // Verify mutual accepted connection
          const { data: conn } = await supabase
            .from('connections')
            .select('id')
            .or(`and(requester_id.eq.${user.id},recipient_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},recipient_id.eq.${user.id})`)
            .eq('status', 'accepted')
            .maybeSingle();

          if (!conn) {
            alert("Direct messaging is locked until connection is accepted. Please connect on the member's profile first.");
            router.push(`/platform/profile/${targetUserId}`);
            return;
          }

          const { data: existingConvs } = await supabase
             .from('conversation_participants')
             .select('conversation_id')
             .eq('user_id', user.id);
             
          let matchedConvId: string | null = null;
          if (existingConvs && existingConvs.length > 0) {
             const convIds = existingConvs.map(c => c.conversation_id);
             const { data: otherMatches } = await supabase
                .from('conversation_participants')
                .select('conversation_id')
                .eq('user_id', targetUserId)
                .in('conversation_id', convIds);
                
             if (otherMatches && otherMatches.length > 0) {
                matchedConvId = String(otherMatches[0].conversation_id);
             }
          }
          
          if (matchedConvId) {
             setActiveChatId(matchedConvId);
             setShowMobileChat(true);
          } else {
             const { data: newConv } = await supabase.from('conversations').insert({ is_group: false }).select().single();
             if (newConv) {
                await supabase.from('conversation_participants').insert([
                   { conversation_id: newConv.id, user_id: user.id },
                   { conversation_id: newConv.id, user_id: targetUserId }
                ]);
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', targetUserId).single();
                if (profile) {
                  const newChat: Chat = {
                     id: String(newConv.id),
                     name: profile.full_name || 'User',
                     role: profile.practice_area || profile.role || 'WIPA Member',
                     avatarUrl: profile.avatar_url || null,
                     initial: profile.full_name?.charAt(0)?.toUpperCase() || 'U',
                     color: '#5a32fa',
                     unread: 0,
                     lastMessage: 'Start a conversation',
                     lastTime: '',
                     messages: [],
                     participantId: targetUserId
                  };
                  setConversations(prev => [newChat, ...prev]);
                  setActiveChatId(String(newConv.id));
                  setShowMobileChat(true);
                }
             }
          }
       };
       initChat();
    }
  }, [targetUserId, user?.id, router]);

  // Handle opening or starting a direct chat conversation with Sally IP
  const handleOpenSallyChat = useCallback(() => {
    setConversations(prev => {
      const existing = prev.find(c => c.id === 'sally-ip');
      if (existing) return prev;
      const sallyChat = createSallyChatObject();
      const updated = [sallyChat, ...prev];
      queueMicrotask(() => {
        useAppStore.getState().setCachedConversations(updated);
      });
      return updated;
    });
    setActiveChatId('sally-ip');
    setShowMobileChat(true);
  }, []);

  // Handle starting a new direct chat with any user
  const handleStartNewChat = useCallback(async (targetId: string) => {
    if (!user?.id) return;

    if (targetId === 'sally-ip') {
      handleOpenSallyChat();
      return;
    }

    try {
      // 1. Check if conversation already exists in local state
      const existing = conversations.find(c => c.participantId === targetId);
      if (existing) {
        setActiveChatId(String(existing.id));
        setShowMobileChat(true);
        return;
      }

      // 2. Check Supabase for existing conversation between user.id and targetId
      const { data: userConvs } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (userConvs && userConvs.length > 0) {
        const convIds = userConvs.map(c => c.conversation_id);
        const { data: otherMatches } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', targetId)
          .in('conversation_id', convIds);

        if (otherMatches && otherMatches.length > 0) {
          const foundId = String(otherMatches[0].conversation_id);
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', targetId).maybeSingle();
          const title = profile?.full_name || 'Member';
          const newChat: Chat = {
            id: foundId,
            name: title,
            role: profile?.practice_area || profile?.role || 'WIPA Member',
            avatarUrl: profile?.avatar_url || null,
            initial: title.charAt(0).toUpperCase() || 'M',
            color: '#5a32fa',
            unread: 0,
            lastMessage: 'Tap to view conversation',
            lastTime: '',
            messages: [],
            participantId: targetId
          };
          setConversations(prev => {
            if (prev.some(c => String(c.id) === foundId)) return prev;
            return [newChat, ...prev];
          });
          setActiveChatId(foundId);
          setShowMobileChat(true);
          return;
        }
      }

      // 3. Create new conversation
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({ is_group: false })
        .select()
        .single();

      if (newConv) {
        await supabase.from('conversation_participants').insert([
          { conversation_id: newConv.id, user_id: user.id },
          { conversation_id: newConv.id, user_id: targetId }
        ]);

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', targetId).maybeSingle();
        const title = profile?.full_name || 'Member';
        const newChat: Chat = {
          id: String(newConv.id),
          name: title,
          role: profile?.practice_area || profile?.role || 'WIPA Member',
          avatarUrl: profile?.avatar_url || null,
          initial: title.charAt(0).toUpperCase() || 'M',
          color: '#5a32fa',
          unread: 0,
          lastMessage: 'Started new conversation',
          lastTime: 'Just now',
          messages: [],
          participantId: targetId
        };
        setConversations(prev => [newChat, ...prev]);
        setActiveChatId(String(newConv.id));
        setShowMobileChat(true);
      }
    } catch (err) {
      console.error('Failed to start new chat:', err);
    }
  }, [user?.id, conversations]);

  // Handle creating a new group chat with database wiring and storage upload
  const handleCreateGroupChat = useCallback(async (
    name: string,
    imageFile: File | null,
    memberIds: string[]
  ) => {
    if (!user?.id) return;
    try {
      let avatarUrl: string | null = null;
      
      // 1. Upload group photo to Supabase storage bucket if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `groups/group_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from('feed-media')
          .upload(fileName, imageFile, {
            contentType: imageFile.type || 'image/jpeg',
            upsert: true
          });

        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage
            .from('feed-media')
            .getPublicUrl(fileName);
          avatarUrl = publicUrlData?.publicUrl || null;
        } else {
          console.warn('Group avatar upload error:', uploadErr);
        }
      }

      // 2. Insert into conversations table
      const storedName = avatarUrl ? `${name}:::${avatarUrl}` : name;
      const { data: newConv, error: convErr } = await supabase
        .from('conversations')
        .insert({
          is_group: true,
          name: storedName
        })
        .select()
        .single();

      if (convErr || !newConv) {
        console.error('Failed to create group conversation:', convErr);
        alert('Failed to create group. Please check connection and try again.');
        return;
      }

      // 3. Insert participants (creator as admin, selected members as member)
      const participants = [
        { conversation_id: newConv.id, user_id: user.id, role: 'admin' },
        ...memberIds.map(mId => ({ conversation_id: newConv.id, user_id: mId, role: 'member' }))
      ];
      const { error: partErr } = await supabase
        .from('conversation_participants')
        .insert(participants);

      if (partErr) {
        console.error('Failed to insert group participants:', partErr);
      }

      // 4. Insert initial system message into messages table
      const initialText = `${user.name || 'You'} created group "${name}"`;
      const encryptedInitial = await encryptMessage(initialText, String(newConv.id));
      const { data: welcomeMsg } = await supabase
        .from('messages')
        .insert({
          conversation_id: newConv.id,
          sender_id: user.id,
          content: encryptedInitial,
          media_type: 'text'
        })
        .select()
        .single();

      const welcomeChatMessage: ChatMessage = {
        id: welcomeMsg ? String(welcomeMsg.id) : `init_${Date.now()}`,
        conversation_id: String(newConv.id),
        text: initialText,
        sender: 'me',
        sender_id: user.id,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        created_at: new Date().toISOString(),
        type: 'text',
        status: 'sent'
      };

      // 5. Build new group Chat object
      const totalCount = memberIds.length + 1;
      const newGroupChat: Chat = {
        id: String(newConv.id),
        name: name,
        role: `${totalCount} ${totalCount === 1 ? 'member' : 'members'}`,
        avatarUrl: avatarUrl,
        initial: name.charAt(0).toUpperCase() || 'G',
        color: '#5a32fa',
        unread: 0,
        lastMessage: initialText,
        lastTime: 'Just now',
        rawTimestamp: Date.now(),
        isOnline: true,
        isGroup: true,
        messages: [welcomeChatMessage]
      };

      // 6. Update local state & cached conversations
      setConversations(prev => {
        const updated = [newGroupChat, ...prev.filter(c => String(c.id) !== String(newConv.id))];
        queueMicrotask(() => {
          useAppStore.getState().setCachedConversations(updated);
        });
        return updated;
      });

      setActiveChatId(String(newConv.id));
      setShowMobileChat(true);
    } catch (err) {
      console.error('Error in handleCreateGroupChat:', err);
      alert('Something went wrong while creating the group chat.');
    }
  }, [user?.id, user?.name]);

  // Handle toggling unread status for a conversation
  const handleToggleUnread = useCallback(async (chatId: string) => {
    const target = conversations.find(c => String(c.id) === String(chatId));
    if (!target) return;
    const newUnread = target.unread > 0 ? 0 : 1;

    setConversations(prev => {
      const next = prev.map(c => String(c.id) === String(chatId) ? { ...c, unread: newUnread } : c);
      queueMicrotask(() => {
        useAppStore.getState().setCachedConversations(next);
      });
      return next;
    });

    if (chatId !== 'sally-ip' && user?.id) {
      try {
        if (newUnread === 0) {
          await supabase
            .from('messages')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('conversation_id', chatId)
            .eq('is_read', false)
            .neq('sender_id', user.id);
        } else {
          const { data: latest } = await supabase
            .from('messages')
            .select('id')
            .eq('conversation_id', chatId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (latest) {
            await supabase
              .from('messages')
              .update({ is_read: false })
              .eq('id', latest.id);
          }
        }
      } catch (err) {
        console.warn('Failed to update unread status:', err);
      }
    }
  }, [conversations, user?.id]);

  // Handle toggling mute for a conversation (persists in localStorage)
  const handleToggleMute = useCallback((chatId: string) => {
    const currentMuted = (() => {
      try {
        const raw = localStorage.getItem('wipa_muted_chats');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    })();

    const isCurrentlyMuted = currentMuted.includes(chatId);
    const updatedMuted = isCurrentlyMuted 
      ? currentMuted.filter((id: string) => id !== chatId)
      : [...currentMuted, chatId];

    try {
      localStorage.setItem('wipa_muted_chats', JSON.stringify(updatedMuted));
    } catch {}

    setMutedChatIds(updatedMuted);

    setConversations(prev => {
      const next = prev.map(c => 
        String(c.id) === String(chatId) ? { ...c, isMuted: !isCurrentlyMuted } : c
      );
      queueMicrotask(() => {
        useAppStore.getState().setCachedConversations(next);
      });
      return next;
    });
  }, []);

  // Mark conversation as read both locally, in cached store, and in live Supabase DB
  const markAsRead = useCallback(async (id: string) => {
    const currentId = String(id);
    setActiveChatId(currentId);
    setShowMobileChat(true);

    // 1. Immediately reset unread count in local state
    setConversations(prev => {
      const updated = prev.map(chat => 
        String(chat.id) === currentId ? { ...chat, unread: 0 } : chat
      );
      queueMicrotask(() => {
        useAppStore.getState().setCachedConversations(updated);
      });
      return updated;
    });

    // 2. Update is_read = true in Supabase DB
    if (currentId !== 'sally-ip' && user?.id) {
      try {
        await supabase
          .from('messages')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq('conversation_id', currentId)
          .eq('is_read', false)
          .neq('sender_id', user.id);
      } catch (err) {
        console.error("Failed to mark messages as read:", err);
      }
    }
  }, [user?.id]);

  // Notification deep links carry the conversation ID. Wait until the user's
  // conversations have loaded before opening the mobile chat panel.
  useEffect(() => {
    if (!targetConversationId || openedDeepLinkRef.current === targetConversationId) return;
    const conversationExists = conversations.some(
      (chat) => String(chat.id) === String(targetConversationId)
    );
    if (!conversationExists) return;

    openedDeepLinkRef.current = targetConversationId;
    void markAsRead(targetConversationId);
  }, [targetConversationId, conversations, markAsRead]);

  // Fetch messages for active chat, handle realtime (INSERT, UPDATE, Presence, Broadcast)
  useEffect(() => {
    if (!activeChatId || !user?.id) return;
    
    if (activeChatId === 'sally-ip') {
      setIsLoadingMessages(false);
      setConversations(prev => prev.map(chat => {
        if (chat.id === 'sally-ip' && (!chat.messages || chat.messages.length === 0)) {
          return { ...chat, messages: getInitialSallyMessages() };
        }
        return chat;
      }));
      return;
    }

    const currentChatId = String(activeChatId);
    let isSubscribed = true;
    setIsLoadingMessages(true);

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*, profiles:sender_id(full_name, avatar_url)')
          .eq('conversation_id', currentChatId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;

        if (data && isSubscribed) {
          const decryptedPromises = data.map(async (m: any) => {
            const isMe = m.sender_id === user.id;
            let calculatedStatus: MessageStatus = 'sent';
            if (isMe) {
              if (m.is_read) {
                calculatedStatus = 'read';
              } else if (m.delivered_at || activeChat?.isOnline) {
                calculatedStatus = 'delivered';
              } else {
                calculatedStatus = 'sent';
              }
            }

            const decryptedContent = await decryptMessage(m.content, currentChatId);

            return {
              id: String(m.id),
              conversation_id: String(m.conversation_id),
              text: decryptedContent,
              sender: isMe ? 'me' : 'them',
              sender_id: m.sender_id,
              sender_name: isMe ? undefined : (m.profiles?.full_name || undefined),
              time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              created_at: m.created_at,
              type: (m.media_type as MediaType) || 'text',
              mediaUrl: m.media_url,
              is_read: m.is_read,
              delivered_at: m.delivered_at,
              read_at: m.read_at,
              status: calculatedStatus
            } as ChatMessage;
          });

          const serverMessages = await Promise.all(decryptedPromises);
          
          const durableOutbox = readMessageOutbox()
            .filter(entry => entry.userId === user.id && String(entry.message.conversation_id) === currentChatId)
            .map(entry => ({ ...entry.message, status: 'failed' as MessageStatus, error: 'Not sent. Tap to try again.' }))
            .filter(pending => !serverMessages.some(serverMessage => serverMessage.id === pending.id));
          const msgs = [...serverMessages, ...durableOutbox]
            .sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());

          // If the server already contains an outbox ID, delivery succeeded before the response was lost.
          readMessageOutbox()
            .filter(entry => serverMessages.some(serverMessage => serverMessage.id === entry.message.id))
            .forEach(entry => removeOutboxMessage(entry.message.id));

          setConversations(prev => prev.map(chat => String(chat.id) === currentChatId ? { ...chat, messages: msgs, unread: 0 } : chat));
          
          // Guarantee instant snap to bottom after messages load
          requestAnimationFrame(() => scrollToBottom('auto'));
          setTimeout(() => scrollToBottom('auto'), 40);
          setTimeout(() => scrollToBottom('auto'), 150);

          // Mark all incoming messages as read in Supabase DB
          await supabase.from('messages')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('conversation_id', currentChatId)
            .eq('is_read', false)
            .neq('sender_id', user.id);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        if (isSubscribed) {
          setIsLoadingMessages(false);
        }
      }
    };
    
    fetchMessages();
    
    // Realtime channel with Presence and Broadcast
    const channel = supabase.channel(`chat:${currentChatId}`, {
      config: {
        presence: { key: user.id }
      }
    });
    activeChannelRef.current = channel;

    channel
      // 1. Listen for new incoming messages
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `conversation_id=eq.${currentChatId}` 
      }, async payload => {
          const m = payload.new;
          if (m.sender_id === user.id) {
            // Confirmed sent on server
            setConversations(prev => prev.map(chat => {
              if (String(chat.id) !== currentChatId) return chat;
              return {
                ...chat,
                messages: chat.messages.map(msg => (msg.id === String(m.id) || msg.temp_id === String(m.id)) ? {
                  ...msg,
                  id: String(m.id),
                  status: m.is_read ? 'read' : (m.delivered_at || chat.isOnline ? 'delivered' : 'sent')
                } : msg)
              };
            }));
            return;
          }

          const decryptedText = await decryptMessage(m.content, currentChatId);

          let senderName: string | undefined = undefined;
          if (m.sender_id !== user.id) {
            try {
              const { data: p } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', m.sender_id)
                .maybeSingle();
              senderName = p?.full_name || undefined;
            } catch {}
          }

          const msg: ChatMessage = {
             id: String(m.id),
             conversation_id: String(m.conversation_id),
             text: decryptedText,
             sender: 'them',
             sender_id: m.sender_id,
             sender_name: senderName,
             time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
             created_at: m.created_at,
             type: (m.media_type as MediaType) || 'text',
             mediaUrl: m.media_url,
             is_read: true,
             status: 'read'
          };

          setConversations(prev => {
            const targetChat = prev.find(chat => String(chat.id) === currentChatId);
            if (!targetChat) return prev;
            const updatedChat = { 
              ...targetChat, 
              messages: [...targetChat.messages, msg],
              lastMessage: decryptedText || 'Media message',
              lastTime: msg.time,
              unread: 0,
              rawTimestamp: Date.now()
            };
            const others = prev.filter(chat => String(chat.id) !== currentChatId);
            const nextList = [updatedChat, ...others];
            queueMicrotask(() => {
              useAppStore.getState().setCachedConversations(nextList);
            });
            return nextList;
          });
          
          // Mark as read on server immediately since we are viewing the chat
          supabase.from('messages').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', m.id).then();
       })
       // 2. Listen for UPDATE events (Live Read Receipts - turning double grey ticks into double purple ticks!)
       .on('postgres_changes', {
         event: 'UPDATE',
         schema: 'public',
         table: 'messages',
         filter: `conversation_id=eq.${currentChatId}`
       }, payload => {
          const updated = payload.new;
          setConversations(prev => prev.map(chat => {
            if (String(chat.id) !== currentChatId) return chat;
            return {
              ...chat,
              messages: chat.messages.map(msg => msg.id === String(updated.id) ? {
                ...msg,
                is_read: updated.is_read,
                read_at: updated.read_at,
                delivered_at: updated.delivered_at,
                status: updated.is_read ? 'read' : (updated.delivered_at ? 'delivered' : 'sent')
              } : msg)
            };
          }));
       })
       // 3. Presence Tracking (Online / Offline state of recipient)
       .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const onlineUserIds = Object.keys(state);
          setConversations(prev => prev.map(chat => {
            if (String(chat.id) !== currentChatId) return chat;
            const isOtherOnline = chat.participantId ? onlineUserIds.includes(chat.participantId) : false;
            return {
              ...chat,
              isOnline: isOtherOnline,
              // If other comes online, upgrade sent ticks to delivered
              messages: chat.messages.map(msg => (msg.sender === 'me' && msg.status === 'sent' && isOtherOnline) ? {
                ...msg,
                status: 'delivered'
              } : msg)
            };
          }));
       })
       // 4. Typing broadcast
       .on('broadcast', { event: 'typing' }, ({ payload }) => {
          if (payload.userId !== user.id) {
            setConversations(prev => prev.map(chat => {
              if (String(chat.id) !== currentChatId) return chat;
              return { ...chat, isTyping: Boolean(payload.isTyping) };
            }));
          }
       })
       .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ userId: user.id, online_at: new Date().toISOString() });
          }
       });
       
    return () => { 
      isSubscribed = false;
      activeChannelRef.current = null;
      supabase.removeChannel(channel); 
    };
  }, [activeChatId, user?.id]);

  // Realtime typing broadcast handler
  const handleTypingEvent = () => {
    if (!activeChannelRef.current || !user?.id) return;

    try {
      activeChannelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: user.id, isTyping: true }
      });
    } catch (e) {
      console.warn("Typing broadcast error:", e);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto clear typing state after 2.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      try {
        activeChannelRef.current?.send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId: user.id, isTyping: false }
        });
      } catch (e) {}
    }, 2500);
  };

  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'auto') => {
    if (scrollContainerRef.current) {
      if (behavior === 'smooth') {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }
  }, []);

  // Always snap directly to the latest/last message on opening a chat or switching conversations
  useEffect(() => {
    if (!activeChatId) return;

    // Instant immediate scroll
    scrollToBottom('auto');

    // Re-verify across render ticks so images, bubbles, and layouts are fully accounted for
    const r1 = requestAnimationFrame(() => scrollToBottom('auto'));
    const t1 = setTimeout(() => scrollToBottom('auto'), 40);
    const t2 = setTimeout(() => scrollToBottom('auto'), 120);
    const t3 = setTimeout(() => scrollToBottom('auto'), 300);

    return () => {
      cancelAnimationFrame(r1);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeChatId, showMobileChat, activeChat?.messages.length, scrollToBottom]);

  // Scroll container scroll listener to toggle floating "Scroll to bottom" pill
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 160;
    setShowScrollBottomPill(!isNearBottom);
  };

  const scrollToBottomSmooth = () => {
    scrollToBottom('smooth');
    setShowScrollBottomPill(false);
  };



  // Clean up media streams
  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Attach camera stream to video element once it renders
  useEffect(() => {
    if (isCameraOpen && videoRef.current && cameraStreamRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
    }
  }, [isCameraOpen]);

  const updateOutgoingStatus = useCallback((conversationId: string, messageId: string, status: MessageStatus, error?: string) => {
    setConversations(prev => prev.map(chat => String(chat.id) === String(conversationId) ? {
      ...chat,
      messages: chat.messages.map(message => message.id === messageId
        ? { ...message, status, error }
        : message)
    } : chat));
  }, []);

  const persistOutgoingMessage = useCallback(async (message: ChatMessage, conversationId: string, recipientOnline: boolean) => {
    const deadline = Date.now() + 15000;
    let lastError: any = new Error('Message could not be sent');

    while (Date.now() < deadline) {
      if (!navigator.onLine) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        continue;
      }

      try {
        const remaining = deadline - Date.now();
        const timeoutMs = Math.max(500, Math.min(3500, remaining));
        const rawContent = message.text || (message.mediaUrl ? `[Media: ${message.type}]` : '');
        const encryptedContent = await encryptMessage(rawContent, conversationId);

        const request = supabase.from('messages').insert({
          id: message.id,
          conversation_id: conversationId,
          sender_id: message.sender_id,
          content: encryptedContent,
          media_type: message.type || 'text',
          media_url: message.mediaUrl || null,
          delivered_at: recipientOnline ? new Date().toISOString() : null
        }).select().single();
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Message request timed out')), timeoutMs));
        const { error }: any = await Promise.race([request, timeout]);

        // Reusing the client UUID makes a duplicate-key response proof that an earlier attempt succeeded.
        if (!error || error.code === '23505') return { success: true as const };
        lastError = error;

        const messageText = String(error.message || '').toLowerCase();
        const transient = /load failed|failed to fetch|network|timeout|connection/.test(messageText);
        if (!transient) return { success: false as const, error };
      } catch (error: any) {
        lastError = error;
      }

      if (Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 1400));
    }

    return { success: false as const, error: lastError };
  }, []);

  // Append message locally and sync to Supabase with client-generated UUID
  const sendMessageWithStatus = async (type: MediaType, text?: string, mediaUrl?: string) => {
    if (!activeChatId || !user?.id) return;
    playSendSound();
    
    const clientMsgId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // ----------------------------------------------------
    // Sally IP AI Conversation Flow (NVIDIA NIM)
    // ----------------------------------------------------
    if (activeChatId === 'sally-ip') {
      const userMsg: ChatMessage = {
        id: clientMsgId,
        conversation_id: 'sally-ip',
        text,
        sender: 'me',
        sender_id: user.id,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        created_at: new Date().toISOString(),
        type,
        mediaUrl,
        status: 'delivered',
        is_read: true
      };

      let currentHistory: ChatMessage[] = [];
      setConversations(prev => {
        const sallyChat = prev.find(c => c.id === 'sally-ip');
        const msgs = sallyChat ? [...sallyChat.messages, userMsg] : [userMsg];
        currentHistory = msgs;
        if (typeof window !== 'undefined') {
          localStorage.setItem(SALLY_CHAT_STORAGE_KEY, JSON.stringify(msgs));
        }

        const updatedSally: Chat = sallyChat ? {
          ...sallyChat,
          messages: msgs,
          lastMessage: text || 'Sent an attachment',
          lastTime: 'Just now',
          rawTimestamp: Date.now(),
          isTyping: true
        } : {
          ...createSallyChatObject(msgs),
          lastMessage: text || 'Sent an attachment',
          lastTime: 'Just now',
          rawTimestamp: Date.now(),
          isTyping: true
        };

        const others = prev.filter(c => c.id !== 'sally-ip');
        const nextList = [updatedSally, ...others];
        queueMicrotask(() => {
          useAppStore.getState().setCachedConversations(nextList);
        });
        return nextList;
      });

      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, 20);

      // Call NVIDIA NIM via askSallyChatAI server action
      try {
        const formattedMsgs = currentHistory
          .filter(m => m.text)
          .slice(-10)
          .map(m => ({
            role: (m.sender === 'me' ? 'user' : 'assistant') as 'user' | 'assistant',
            content: m.text || ''
          }));

        const aiRes = await askSallyChatAI(formattedMsgs);
        const replyText = aiRes.text || "I am here to help you with any patent, trademark, or legal matters on WIPA!";

        const sallyReply: ChatMessage = {
          id: `sally_reply_${Date.now()}`,
          conversation_id: 'sally-ip',
          text: replyText,
          sender: 'them',
          sender_id: 'sally-ip',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          created_at: new Date().toISOString(),
          type: 'text',
          status: 'read',
          is_read: true
        };

        setConversations(prev => {
          const sallyChat = prev.find(c => c.id === 'sally-ip');
          if (!sallyChat) return prev;

          const allMsgs = [...sallyChat.messages, sallyReply];
          if (typeof window !== 'undefined') {
            localStorage.setItem(SALLY_CHAT_STORAGE_KEY, JSON.stringify(allMsgs));
          }

          const updatedSally: Chat = {
            ...sallyChat,
            messages: allMsgs,
            lastMessage: replyText,
            lastTime: 'Just now',
            rawTimestamp: Date.now(),
            isTyping: false
          };

          const others = prev.filter(c => c.id !== 'sally-ip');
          const nextList = [updatedSally, ...others];
          queueMicrotask(() => {
            useAppStore.getState().setCachedConversations(nextList);
          });
          return nextList;
        });

        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
          }
        }, 30);

      } catch (err) {
        console.error("Error communicating with Sally AI:", err);
        setConversations(prev => prev.map(c => c.id === 'sally-ip' ? { ...c, isTyping: false } : c));
      }

      return;
    }

    const isRecipientOnline = activeChat?.isOnline ?? false;
    const initialStatus: MessageStatus = 'sending';

    const newMsg: ChatMessage = {
      id: clientMsgId,
      conversation_id: activeChatId,
      text,
      sender: "me",
      sender_id: user.id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      created_at: new Date().toISOString(),
      type,
      mediaUrl,
      status: initialStatus,
      is_read: false
    };
    saveOutboxMessage(user.id, newMsg);

    // Optimistically update UI and immediately bump this conversation to the very top
    setConversations(prev => {
      const targetChat = prev.find(chat => String(chat.id) === String(activeChatId));
      if (!targetChat) return prev;

      let lastMsgPreview = text || "Sent an attachment";
      if (type === 'image') lastMsgPreview = "📷 Photo";
      if (type === 'video') lastMsgPreview = "🎥 Video";
      if (type === 'document') lastMsgPreview = "📄 Document";
      if (type === 'location') lastMsgPreview = "📍 Location";
      if (type === 'audio') lastMsgPreview = "🎤 Voice message";

      const updatedChat = {
        ...targetChat,
        messages: [...targetChat.messages, newMsg],
        lastMessage: lastMsgPreview,
        lastTime: "Just now",
        rawTimestamp: Date.now()
      };

      const others = prev.filter(chat => String(chat.id) !== String(activeChatId));
      const nextList = [updatedChat, ...others];
      queueMicrotask(() => {
        useAppStore.getState().setCachedConversations(nextList);
      });
      return nextList;
    });

    // Instantly scroll container to bottom for sender's own message without triggering window scroll
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 20);

    try {
      const result = await persistOutgoingMessage(newMsg, activeChatId, isRecipientOnline);
      if (!result.success) throw result.error;

      // Update message status
      updateOutgoingStatus(activeChatId, clientMsgId, isRecipientOnline ? 'delivered' : 'sent');
      removeOutboxMessage(clientMsgId);

      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', activeChatId);

      // Asynchronously trigger native background push notification for recipients
      try {
        console.log(`[CHAT_PUSH_DEBUG] message_created conversationId=${activeChatId} senderId=${user.id} messageId=${clientMsgId}`);
        const pushEndpoint = typeof window !== 'undefined' ? `${window.location.origin}/api/notifications/push` : '/api/notifications/push';
        fetch(pushEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            recipientId: activeChat?.participantId || null,
            conversationId: activeChatId,
            senderId: user.id,
            senderName: user.name || user.email?.split('@')[0] || 'Member',
            senderAvatar: user.avatar_url || null,
            messageText: text,
            mediaType: type,
          }),
        }).then(async (res) => {
          const resData = await res.json().catch(() => ({}));
          console.log("[CHAT_PUSH_DEBUG] api_response status=", res.status, resData);
        }).catch(pushErr => console.warn('[CHAT_PUSH_DEBUG] fetch_failed:', pushErr));
      } catch (err) {
        console.warn('[CHAT_PUSH_DEBUG] dispatch_error:', err);
      }
    } catch (err: any) {
      console.error("Message send failed:", err);
      // Mark message as failed
      updateOutgoingStatus(activeChatId, clientMsgId, 'failed', 'Not sent. Tap to try again.');
      saveOutboxMessage(user.id, { ...newMsg, status: 'failed', error: 'Not sent. Tap to try again.' });
    }
  };

  // Retry sending failed message
  const handleRetryMessage = async (msg: ChatMessage) => {
    if (!activeChatId || !user?.id) return;
    const conversationId = activeChatId;
    const isRecipientOnline = activeChat?.isOnline ?? false;

    updateOutgoingStatus(conversationId, msg.id, 'sending');
    saveOutboxMessage(user.id, { ...msg, sender_id: user.id, status: 'sending', error: undefined });

    try {
      const result = await persistOutgoingMessage({ ...msg, sender_id: user.id }, conversationId, isRecipientOnline);
      if (!result.success) throw result.error;
      updateOutgoingStatus(conversationId, msg.id, isRecipientOnline ? 'delivered' : 'sent');
      removeOutboxMessage(msg.id);

      const pushEndpoint = `${window.location.origin}/api/notifications/push`;
      void fetch(pushEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          recipientId: activeChat?.participantId || null,
          conversationId,
          senderId: user.id,
          senderName: user.name || user.email?.split('@')[0] || 'Member',
          senderAvatar: user.avatar_url || null,
          messageText: msg.text,
          mediaType: msg.type || 'text',
        }),
      }).catch(() => {});
    } catch (err: any) {
      updateOutgoingStatus(conversationId, msg.id, 'failed', 'Not sent. Tap to try again.');
      saveOutboxMessage(user.id, { ...msg, sender_id: user.id, status: 'failed', error: 'Not sent. Tap to try again.' });
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!newMessage.trim() || !activeChat) return;
    
    lastSendTimestampRef.current = Date.now();
    const msgText = newMessage.trim();
    setNewMessage("");

    // Keep input focused continuously across render frames so mobile keyboard never collapses
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
    requestAnimationFrame(() => {
      textInputRef.current?.focus();
    });
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 10);
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 50);

    await sendMessageWithStatus('text', msgText);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'document') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAttachmentMenuOpen(false);
    setIsUploading(true);

    try {
      const fileName = `chat_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(fileName, file, { upsert: true });

      let fileUrl = URL.createObjectURL(file);
      if (!uploadError) {
        const { data } = supabase.storage.from('resources').getPublicUrl(fileName);
        if (data?.publicUrl) fileUrl = data.publicUrl;
      }

      await sendMessageWithStatus(type, file.name, fileUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleLocationShare = () => {
    setIsAttachmentMenuOpen(false);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sendMessageWithStatus('location', `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, `https://www.google.com/maps?q=${latitude},${longitude}`);
        },
        () => {
          alert('Could not get your location. Please check browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // --- Voice Recording & Preview Handlers ---
  const formatDuration = (seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startVoiceRecord = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Block ghost click immediately following message send
    if (Date.now() - lastSendTimestampRef.current < 650) {
      return;
    }
    if (isVoiceRecording || recordedAudioBlob) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';
      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordStartTimeRef.current = Date.now();

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioBlob(audioBlob);
        setRecordedAudioUrl(audioUrl);
        setIsVoiceRecording(false);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        stream.getTracks().forEach(track => track.stop());

        // Preload preview duration with fallback
        const recordedSeconds = Math.max(1, Math.round((Date.now() - recordStartTimeRef.current) / 1000));
        setPreviewTotalDuration(recordedSeconds);
        const tempAudio = new Audio(audioUrl);
        tempAudio.onloadedmetadata = () => {
          if (isFinite(tempAudio.duration) && !isNaN(tempAudio.duration) && tempAudio.duration > 0) {
            setPreviewTotalDuration(tempAudio.duration);
          }
        };
      };

      mediaRecorder.start(100);
      setIsVoiceRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn("Microphone access permission status:", err?.name || err);
      // Cleanly reset state without blocking with alert popups
      setIsVoiceRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const stopVoiceRecord = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;
    mediaRecorderRef.current.stop();
  };

  const cancelVoiceRecord = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsVoiceRecording(false);
    setRecordedAudioBlob(null);
    setRecordedAudioUrl(null);
    setRecordingDuration(0);
    setIsPreviewPlaying(false);
    setPreviewProgress(0);
    setPreviewCurrentTime(0);
    setPreviewTotalDuration(0);
  };

  const togglePlayPreview = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!recordedAudioUrl) return;

    if (!previewAudioRef.current) {
      const audio = new Audio(recordedAudioUrl);
      previewAudioRef.current = audio;

      audio.onloadedmetadata = () => {
        if (isFinite(audio.duration) && !isNaN(audio.duration) && audio.duration > 0) {
          setPreviewTotalDuration(audio.duration);
        }
      };

      audio.ontimeupdate = () => {
        const total = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : previewTotalDuration || recordingDuration;
        if (total > 0) {
          setPreviewCurrentTime(audio.currentTime);
          setPreviewProgress(Math.min(100, Math.max(0, (audio.currentTime / total) * 100)));
        } else {
          setPreviewCurrentTime(audio.currentTime);
        }
      };

      audio.onended = () => {
        setIsPreviewPlaying(false);
        setPreviewProgress(0);
        setPreviewCurrentTime(0);
      };
    }

    if (isPreviewPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      previewAudioRef.current.play();
      setIsPreviewPlaying(true);
    }
  };

  const handleSendVoiceNote = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!recordedAudioBlob || !activeChatId || !user?.id) return;
    
    setIsUploading(true);
    try {
      const mime = recordedAudioBlob.type || 'audio/webm';
      const ext = mime.includes('mp4') ? 'mp4' : mime.includes('aac') ? 'aac' : 'webm';
      const fileName = `voice_${Date.now()}_${user.id.slice(0, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(fileName, recordedAudioBlob, { 
          contentType: mime,
          upsert: true 
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage.from('resources').getPublicUrl(fileName);
      const finalUrl = data?.publicUrl || '';

      if (finalUrl) {
        await sendMessageWithStatus('audio', '🎤 Voice message', finalUrl);
      }
      cancelVoiceRecord();
    } catch (err: any) {
      console.error("Failed to upload voice note:", err);
      cancelVoiceRecord();
    } finally {
      setIsUploading(false);
    }
  };

  // --- Camera Capture ---
  const openCamera = async () => {
    setIsAttachmentMenuOpen(false);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied or not available.');
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            sendMessageWithStatus('image', 'Camera Photo', imageUrl);
            closeCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const closeCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      if (chatId === 'sally-ip') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(SALLY_CHAT_STORAGE_KEY);
        }
        setConversations(prev => {
          const next = prev.filter(c => c.id !== 'sally-ip');
          queueMicrotask(() => {
            useAppStore.getState().setCachedConversations(next);
          });
          return next;
        });
        if (activeChatId === 'sally-ip') {
          setActiveChatId(null);
          setShowMobileChat(false);
        }
        return;
      }

      // 1. Delete messages, participants, and conversation in Supabase
      await supabase.from('messages').delete().eq('conversation_id', chatId);
      await supabase.from('conversation_participants').delete().eq('conversation_id', chatId);
      await supabase.from('conversations').delete().eq('id', chatId);

      // 2. Remove from local state
      setConversations(prev => {
        const next = prev.filter(c => String(c.id) !== String(chatId));
        queueMicrotask(() => {
          useAppStore.getState().setCachedConversations(next);
        });
        return next;
      });

      // 3. Reset active chat if deleted
      if (String(activeChatId) === String(chatId)) {
        setActiveChatId(null);
        setShowMobileChat(false);
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  return (
    <div className={`w-full max-w-full flex flex-col font-sans overflow-hidden bg-white dark:bg-[#000000] md:dark:bg-[#0f172a] ${
      showMobileChat 
        ? 'h-[100dvh] md:h-[calc(100vh-77px)]' 
        : 'h-[calc(100dvh-57px-env(safe-area-inset-bottom,0px))] md:h-[calc(100vh-77px)]'
    }`}>

      {/* Offline / Queued Connection Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-black px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-md z-50 animate-in slide-in-from-top duration-200 shrink-0">
          <WifiOff size={16} />
          <span>You&apos;re offline. Messages retry for 15 seconds, then you can tap the failed message to send again.</span>
        </div>
      )}

      {/* Main Messaging UI (100% Edge-to-Edge Full Screen Layout) */}
      <div className="flex-1 flex w-full p-0 min-h-0 gap-0 bg-white dark:bg-[#000000] md:dark:bg-[#0f172a] overflow-hidden">
        
        {/* Left Pane: Conversations List */}
        <ChatSidebar 
          conversations={conversations}
          activeChatId={activeChatId}
          onSelectChat={markAsRead}
          onDeleteChat={handleDeleteChat}
          onToggleUnread={handleToggleUnread}
          onToggleMute={handleToggleMute}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          chatFilter={chatFilter}
          onFilterChange={setChatFilter}
          showMobileChat={showMobileChat}
          onStartNewChat={handleStartNewChat}
          onOpenSally={handleOpenSallyChat}
          onCreateGroup={handleCreateGroupChat}
          currentUserName={user?.name || user?.email || 'User'}
          currentUserId={user?.id}
        />

        {/* Right Pane: Active Chat Window */}
        <div 
          style={isMobileView && showMobileChat ? {
            height: 'var(--chat-viewport-height, 100dvh)',
            top: 'var(--chat-viewport-top, 0px)',
            maxHeight: 'var(--chat-viewport-height, 100dvh)',
          } : undefined}
          className={`bg-white dark:bg-[#0f172a] rounded-none border-0 flex-col overflow-hidden ${
            !showMobileChat 
              ? 'hidden md:flex flex-1 h-full min-h-0 relative' 
              : 'flex fixed inset-0 z-[100] md:relative md:flex-1 md:inset-auto md:z-auto md:h-full min-h-0'
          }`}
        >
          
          {activeChat ? (
            <>
              {/* Chat Header */}
              <ChatHeader 
                name={activeChat.name}
                role={activeChat.role}
                avatarUrl={activeChat.avatarUrl}
                initial={activeChat.initial}
                color={activeChat.color}
                isOnline={activeChat.isOnline}
                isTyping={activeChat.isTyping}
                participantId={activeChat.participantId}
                onBackMobile={() => setShowMobileChat(false)}
                onOptionsToggle={() => setIsChatOptionsOpen(!isChatOptionsOpen)}
                onCloseOptions={() => setIsChatOptionsOpen(false)}
                isOptionsOpen={isChatOptionsOpen}
                onBlockUser={() => { setIsChatOptionsOpen(false); }}
                onClearChat={() => { 
                  setIsChatOptionsOpen(false);
                  if (activeChatId === 'sally-ip') {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem(SALLY_CHAT_STORAGE_KEY);
                    }
                    setConversations(prev => prev.map(c => c.id === 'sally-ip' ? { ...c, messages: [] } : c));
                  }
                }}
                inChatSearchQuery={inChatSearchQuery}
                onInChatSearchChange={setInChatSearchQuery}
              />

              {/* Chat Messages Body with Luxury Textured Wallpaper & Centered Container */}
              <div 
                ref={scrollContainerRef}
                onScroll={() => {
                  handleScroll();
                  if (isAttachmentMenuOpen) setIsAttachmentMenuOpen(false);
                }}
                className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 bg-[#f8f9fc] dark:bg-[#0b0f19] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] relative"
              >
                <div className="max-w-4xl mx-auto w-full flex flex-col space-y-3 min-h-full justify-end pb-2">
                  
                  {/* End-to-End Encryption Security Pill */}
                  <div className="mx-auto flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full text-[11px] font-semibold select-none mb-3 shadow-xs">
                    <ShieldCheck size={13} className="text-amber-500 shrink-0" />
                    <span>Messages are end-to-end encrypted & secure</span>
                  </div>

                  {isLoadingMessages && activeChat.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 my-auto">
                      <Loader2 size={24} className="animate-spin text-[#5a32fa]" />
                      <span className="text-xs font-semibold">Loading messages...</span>
                    </div>
                  ) : activeChat.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 my-auto select-none">
                      {/* Recipient Profile Avatar */}
                      <div className="relative mb-3">
                        {activeChat.avatarUrl ? (
                          <img 
                            src={activeChat.avatarUrl} 
                            alt={activeChat.name} 
                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-sm border-2 border-slate-200 dark:border-white/10 ${
                              activeChat.avatarUrl.includes('sally')
                                ? 'object-contain p-3.5 bg-purple-100 dark:bg-purple-950/60 dark:invert'
                                : 'object-cover'
                            }`}
                          />
                        ) : (
                          <div 
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-sm"
                            style={{ backgroundColor: activeChat.color || '#5a32fa' }}
                          >
                            {activeChat.initial || activeChat.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {activeChat.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-xs leading-relaxed">
                        No messages yet. Send a message to start this conversation.
                      </p>
                      {activeChat.participantId && (
                        <Link
                          href={activeChat.participantId === 'sally-ip' ? '/platform/sallyip' : `/platform/profile/${activeChat.participantId}`}
                          className="mt-3 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-gray-200 transition-all shadow-xs cursor-pointer"
                        >
                          {activeChat.participantId === 'sally-ip' ? 'Explore Sally IP' : 'View Profile'}
                        </Link>
                      )}
                    </div>
                  ) : (
                    activeChat.messages
                      .filter(m => !inChatSearchQuery.trim() || (m.text && m.text.toLowerCase().includes(inChatSearchQuery.toLowerCase())))
                      .map((msg, index, arr) => {
                        const currentDateDivider = getDateDivider(msg.created_at);
                        const prevMsg = arr[index - 1];
                        const prevDateDivider = prevMsg ? getDateDivider(prevMsg.created_at) : '';
                        const showDivider = currentDateDivider && currentDateDivider !== prevDateDivider;

                        return (
                          <React.Fragment key={msg.id}>
                            {showDivider && (
                              <div className="flex items-center justify-center my-3 select-none">
                                <span className="px-3.5 py-1 rounded-full bg-white/90 dark:bg-[#1a2333]/90 border border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-600 dark:text-gray-300 shadow-xs backdrop-blur-md">
                                  {currentDateDivider}
                                </span>
                              </div>
                            )}
                            <MessageBubble 
                              message={msg}
                              onRetry={handleRetryMessage}
                              onImageClick={setLightboxImageUrl}
                            />
                          </React.Fragment>
                        );
                      })
                  )}

                  {/* WhatsApp-Style Bouncy Dots Typing Bubble */}
                  {activeChat.isTyping && (
                    <div className="flex items-end gap-2.5 my-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm overflow-hidden mb-0.5 border border-purple-200/50 dark:border-white/10">
                        {activeChat.avatarUrl ? (
                          <img 
                            src={activeChat.avatarUrl} 
                            alt={activeChat.name} 
                            className={`w-full h-full ${activeChat.avatarUrl.includes('sally') ? 'object-contain p-1.5 bg-purple-100 dark:bg-purple-950 dark:invert' : 'object-cover'}`} 
                          />
                        ) : (
                          activeChat.initial || 'U'
                        )}
                      </div>
                      <div className="bg-white dark:bg-[#1a2333] border border-gray-200/80 dark:border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#5a32fa] dark:bg-[#ff90e8] animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 rounded-full bg-[#5a32fa] dark:bg-[#ff90e8] animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-[#5a32fa] dark:bg-[#ff90e8] animate-bounce" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} className="h-0 w-0 pointer-events-none" />
                </div>

                {/* Floating "Scroll to Bottom" button */}
                {showScrollBottomPill && (
                  <button 
                    onClick={scrollToBottomSmooth}
                    className="sticky bottom-2 ml-auto left-full -translate-x-4 bg-white dark:bg-[#151c2c] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white p-2.5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-20"
                    title="Scroll to latest message"
                  >
                    <ChevronDown size={18} />
                  </button>
                )}
              </div>

              {/* Chat Input Bar with Centered Container */}
              <div className="sticky bottom-0 left-0 right-0 z-20 p-3 sm:p-4 pb-[max(env(safe-area-inset-bottom,0px),1rem)] md:pb-4 border-t border-gray-100 dark:border-white/10 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl shrink-0 w-full">
                <div className="max-w-4xl mx-auto w-full">
                  {isVoiceRecording ? (
                    /* 1. Live Recording Mode */
                    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 rounded-2xl animate-in fade-in duration-150">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-rose-600 dark:text-rose-400 font-mono font-bold text-xs tracking-wider">
                          {formatDuration(recordingDuration)}
                        </span>
                      </div>

                      {/* Animated Soundwave Oscillators */}
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1 h-5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1 h-7 bg-rose-500 rounded-full animate-bounce" />
                        <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.2s]" />
                        <span className="w-1 h-6 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.1s]" />
                        <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.35s]" />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={cancelVoiceRecord}
                          className="p-2 rounded-xl text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Cancel recording"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={stopVoiceRecord}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                        >
                          <Square size={12} className="fill-white" /> Stop
                        </button>
                      </div>
                    </div>
                  ) : recordedAudioBlob ? (
                    /* 2. Voice Note Review & Preview Player Mode */
                    <div className="flex items-center justify-between gap-3 px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl animate-in fade-in duration-150">
                      <button
                        type="button"
                        onClick={cancelVoiceRecord}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                        title="Discard recording"
                      >
                        <Trash2 size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={togglePlayPreview}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#5a32fa] text-white shadow-sm shrink-0 active:scale-95 transition-transform"
                      >
                        {isPreviewPlaying ? <Pause size={15} className="fill-white" /> : <Play size={15} className="fill-white ml-0.5" />}
                      </button>

                      {/* Progress Track & Duration */}
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#5a32fa] h-full transition-all duration-100 rounded-full"
                            style={{ width: `${previewProgress}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1 font-mono">
                          <span>{formatDuration(previewCurrentTime)}</span>
                          <span>{formatDuration(previewTotalDuration || recordingDuration)}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSendVoiceNote}
                        disabled={isUploading}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shrink-0 active:scale-95 transition-transform"
                        title="Send voice note"
                      >
                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <SentIcon size={17} />}
                      </button>
                    </div>
                  ) : (
                    /* 3. Standard Typing Bar with Attachment Clip & Right-Corner Action Switcher */
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                      <div ref={attachmentMenuRef} className="relative">
                        <button 
                          type="button" 
                          onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                          className={`w-10 h-10 flex items-center justify-center shrink-0 rounded-2xl border transition-colors ${
                            isAttachmentMenuOpen 
                              ? 'border-[#5a32fa] text-[#5a32fa] bg-[#5a32fa]/10' 
                              : 'border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white'
                          }`}
                        >
                          <Paperclip size={18} />
                        </button>

                        {/* Attachment Menu Popover */}
                        {isAttachmentMenuOpen && (
                          <div className="absolute bottom-[calc(100%+12px)] left-0 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl py-2 w-52 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                            <button type="button" onClick={openCamera} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-[#5a32fa] hover:text-white transition-colors font-bold text-xs text-left">
                              <Camera size={16} /> Take Photo
                            </button>
                            <button type="button" onClick={handleLocationShare} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-[#5a32fa] hover:text-white transition-colors font-bold text-xs text-left">
                              <MapPin size={16} /> Share Location
                            </button>
                            <div className="h-px bg-gray-100 dark:bg-white/10 my-1"></div>
                            <button type="button" onClick={() => imageInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-[#5a32fa] hover:text-white transition-colors font-bold text-xs text-left">
                              <ImageIcon size={16} /> Image File
                            </button>
                            <button type="button" onClick={() => videoInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-[#5a32fa] hover:text-white transition-colors font-bold text-xs text-left">
                              <Video size={16} /> Video File
                            </button>
                            <button type="button" onClick={() => docInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-[#5a32fa] hover:text-white transition-colors font-bold text-xs text-left">
                              <FileText size={16} /> PDF / Document
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Hidden inputs */}
                      <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                      <input type="file" ref={videoInputRef} accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
                      <input type="file" ref={docInputRef} accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => handleFileUpload(e, 'document')} />

                      <input 
                        ref={textInputRef}
                        type="text" 
                        placeholder="Type a message..."
                        value={newMessage}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="sentences"
                        spellCheck={false}
                        onFocus={() => {
                          setIsAttachmentMenuOpen(false);
                          if (typeof window !== 'undefined') {
                            window.scrollTo(0, 0);
                            document.body.scrollTop = 0;
                            requestAnimationFrame(() => {
                              window.scrollTo(0, 0);
                              document.body.scrollTop = 0;
                              scrollToBottom('auto');
                            });
                            setTimeout(() => {
                              window.scrollTo(0, 0);
                              document.body.scrollTop = 0;
                              scrollToBottom('auto');
                            }, 80);
                          }
                        }}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTypingEvent();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="flex-1 min-w-0 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#5a32fa] font-medium text-[15px] sm:text-[16px] leading-normal caret-[#5a32fa] transition-colors bg-gray-50/80 dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400"
                      />

                      {/* Right Corner Action: Dynamic Switcher (Mic vs Send) */}
                      {newMessage.trim() ? (
                        <button 
                          key="chat-send-btn"
                          type="button"
                          onMouseDown={(e) => {
                            // Prevent button touch from stealing text input focus
                            e.preventDefault();
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                          }}
                          aria-label="Send message"
                          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#5a32fa] hover:bg-[#6c47ff] text-white transition-all shadow-md shadow-[#5a32fa]/30 shrink-0 active:scale-95"
                        >
                          <SentIcon size={18} />
                        </button>
                      ) : (
                        <button 
                          key="chat-mic-btn"
                          type="button"
                          onClick={startVoiceRecord}
                          aria-label="Record voice message"
                          title="Tap to record voice message"
                          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-[#5a32fa] hover:text-white text-gray-600 dark:text-gray-300 transition-all shrink-0 active:scale-90 active:bg-rose-500 active:text-white"
                        >
                          <Mic size={18} />
                        </button>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Premium Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f8f9fc] dark:bg-[#0b0f19] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] text-white flex items-center justify-center mb-5 shadow-xl shadow-[#5a32fa]/20 animate-in zoom-in duration-300">
                <MessageCircle size={36} />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">WIPA Direct Messenger</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed mb-6">
                Select a conversation from your inbox or reach out directly to members across the network.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 shadow-xs">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Lightbox Fullscreen Image Modal */}
      {lightboxImageUrl && (
        <div 
          onClick={() => setLightboxImageUrl(null)}
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-150"
        >
          <button 
            onClick={() => setLightboxImageUrl(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={22} />
          </button>
          <img 
            src={lightboxImageUrl} 
            alt="Fullscreen view" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Camera Capture Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-white/10 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Capture Photo</h3>
              <button onClick={closeCamera} className="p-1 text-gray-400 hover:text-white rounded-lg"><X size={18} /></button>
            </div>
            <div className="w-full h-72 rounded-2xl overflow-hidden bg-black border border-white/10 relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex items-center gap-3 w-full justify-center">
              <button 
                type="button" 
                onClick={capturePhoto} 
                className="px-6 py-2.5 rounded-2xl bg-[#5a32fa] hover:bg-[#6c47ff] text-white text-xs font-bold shadow-lg shadow-[#5a32fa]/30"
              >
                Snap & Send
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="text-[#6600FF]" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
