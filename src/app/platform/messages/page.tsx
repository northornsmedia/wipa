'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Paperclip, Send, Camera, Mic, MapPin, Image as ImageIcon, Video, FileText, 
  X, Square, WifiOff, Sparkles, ChevronDown, Loader2
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { Suspense } from 'react';
import { MessageStatusTick, MessageStatus } from '@/components/chat/MessageStatusTick';
import { MessageBubble, ChatMessage, MediaType } from '@/components/chat/MessageBubble';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatSidebar, SidebarChat } from '@/components/chat/ChatSidebar';

export type Chat = SidebarChat & {
  messages: ChatMessage[];
  participantId?: string;
};

function MessagesContent() {
  const router = useRouter();
  const { user, cachedConversations, setCachedConversations } = useAppStore();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');
  
  const [conversations, setConversations] = useState<Chat[]>(() => cachedConversations || []);
  const [activeChatId, setActiveChatId] = useState<string | null>(() => (cachedConversations && cachedConversations.length > 0 ? String(cachedConversations[0].id) : null));
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'direct' | 'groups'>('all');
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isChatOptionsOpen, setIsChatOptionsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showScrollBottomPill, setShowScrollBottomPill] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

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

  // Voice recording state
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Scroll and tracking refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeChatIdRef = useRef<string | null>(null);
  const initialScrolledRef = useRef<Record<string, boolean>>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeChat = conversations.find(c => String(c.id) === String(activeChatId));

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
        if (latestMsgs) {
          latestMsgs.forEach((m: any) => {
            if (!latestMsgMap[m.conversation_id]) {
              latestMsgMap[m.conversation_id] = m;
            }
          });
        }

        const parsed: Chat[] = myConvs
          .filter((c: any) => c.conversations)
          .map((c: any) => {
            const conv = c.conversations;
            const other = conv.conversation_participants?.find((p: any) => p.user_id !== user.id)?.profiles || {};
            const title = conv.is_group ? (conv.name || 'Group Chat') : (other.full_name || 'Direct Message');
            const latest = latestMsgMap[conv.id];
            
            let previewText = 'Start a conversation';
            if (latest) {
              if (latest.media_type === 'image') previewText = '📷 Photo';
              else if (latest.media_type === 'video') previewText = '🎥 Video';
              else if (latest.media_type === 'document') previewText = '📄 Document';
              else if (latest.media_type === 'audio') previewText = '🎤 Voice message';
              else if (latest.media_type === 'location') previewText = '📍 Location';
              else previewText = latest.content || 'Start a conversation';
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
              role: other.practice_area || other.role || 'Member',
              avatarUrl: other.avatar_url || null,
              initial: title.charAt(0).toUpperCase() || 'U',
              color: '#5a32fa',
              unread: unreadMap[conv.id] || 0,
              lastMessage: previewText,
              lastTime: timeStr,
              rawTimestamp,
              messages: [],
              participantId: other.id
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

            useAppStore.getState().setCachedConversations(merged);
            return merged;
          });

          if (!activeChatIdRef.current && !targetUserId) {
            setActiveChatId(String(parsed[0].id));
          }
        }
      }
    } catch (err) {
      console.error("Failed to load conversations from DB:", err);
    }
  }, [user?.id, targetUserId]);

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
      useAppStore.getState().setCachedConversations(updated);
      return updated;
    });

    // 2. Update is_read = true in Supabase DB
    if (user?.id) {
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

  // Fetch messages for active chat, handle realtime (INSERT, UPDATE, Presence, Broadcast)
  useEffect(() => {
    if (!activeChatId || !user?.id) return;
    
    const currentChatId = String(activeChatId);
    let isSubscribed = true;
    setIsLoadingMessages(true);

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', currentChatId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;

        if (data && isSubscribed) {
          const msgs: ChatMessage[] = data.map(m => {
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

            return {
              id: String(m.id),
              conversation_id: String(m.conversation_id),
              text: m.content,
              sender: isMe ? 'me' : 'them',
              sender_id: m.sender_id,
              time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              created_at: m.created_at,
              type: (m.media_type as MediaType) || 'text',
              mediaUrl: m.media_url,
              is_read: m.is_read,
              delivered_at: m.delivered_at,
              read_at: m.read_at,
              status: calculatedStatus
            };
          });
          
          setConversations(prev => prev.map(chat => String(chat.id) === currentChatId ? { ...chat, messages: msgs, unread: 0 } : chat));
          
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

    channel
      // 1. Listen for new incoming messages
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `conversation_id=eq.${currentChatId}` 
      }, payload => {
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

          const msg: ChatMessage = {
             id: String(m.id),
             conversation_id: String(m.conversation_id),
             text: m.content,
             sender: 'them',
             sender_id: m.sender_id,
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
              lastMessage: m.content || 'Media message',
              lastTime: msg.time,
              unread: 0,
              rawTimestamp: Date.now()
            };
            const others = prev.filter(chat => String(chat.id) !== currentChatId);
            const nextList = [updatedChat, ...others];
            useAppStore.getState().setCachedConversations(nextList);
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
          const isOtherOnline = activeChat?.participantId ? onlineUserIds.includes(activeChat.participantId) : false;
          setConversations(prev => prev.map(chat => {
            if (String(chat.id) !== currentChatId) return chat;
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
      supabase.removeChannel(channel); 
    };
  }, [activeChatId, user?.id, activeChat?.participantId]);

  // Instant scroll to bottom on initial open / conversation switch, smooth scroll on new messages
  useEffect(() => {
    if (!activeChatId || !activeChat) return;

    const chatIdKey = String(activeChatId);
    const isFirstTime = !initialScrolledRef.current[chatIdKey];

    if (isFirstTime && activeChat.messages.length > 0) {
      // Instant snap to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      initialScrolledRef.current[chatIdKey] = true;
    } else {
      // Smooth scroll if user was already near bottom
      const container = scrollContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
        if (isNearBottom) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [activeChatId, activeChat?.messages.length]);

  // Scroll container scroll listener to toggle floating "Scroll to bottom" pill
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
    setShowScrollBottomPill(!isNearBottom);
  };

  const scrollToBottomSmooth = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBottomPill(false);
  };

  // Typing broadcast emitter
  const handleTypingEvent = () => {
    if (!activeChatId || !user?.id) return;
    const channel = supabase.channel(`chat:${activeChatId}`);
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: user.id, isTyping: true }
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: user.id, isTyping: false }
      });
    }, 2000);
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

  // Append message locally and sync to Supabase with client-generated UUID
  const sendMessageWithStatus = async (type: MediaType, text?: string, mediaUrl?: string) => {
    if (!activeChatId || !user?.id) return;
    
    const clientMsgId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const isRecipientOnline = activeChat?.isOnline ?? false;
    const initialStatus: MessageStatus = !isOnline ? 'queued' : (isRecipientOnline ? 'delivered' : 'sent');

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
      useAppStore.getState().setCachedConversations(nextList);
      return nextList;
    });

    // Instantly scroll to bottom for sender's own message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    if (!isOnline) {
      // Offline: left in queue
      return;
    }

    try {
      const { data, error } = await supabase.from('messages').insert({
        id: clientMsgId,
        conversation_id: activeChatId,
        sender_id: user.id,
        content: text || (mediaUrl ? `[Media: ${type}]` : ""),
        media_type: type,
        media_url: mediaUrl || null,
        delivered_at: isRecipientOnline ? new Date().toISOString() : null
      }).select().single();

      if (error) throw error;

      // Update message status
      setConversations(prev => prev.map(chat => {
        if (String(chat.id) === String(activeChatId)) {
          return {
            ...chat,
            messages: chat.messages.map(m => m.id === clientMsgId ? { 
              ...m, 
              status: isRecipientOnline ? 'delivered' : 'sent' 
            } : m)
          };
        }
        return chat;
      }));

      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', activeChatId);
    } catch (err: any) {
      console.error("Message send failed:", err);
      // Mark message as failed
      setConversations(prev => prev.map(chat => {
        if (String(chat.id) === String(activeChatId)) {
          return {
            ...chat,
            messages: chat.messages.map(m => m.id === clientMsgId ? { ...m, status: 'failed', error: err.message } : m)
          };
        }
        return chat;
      }));
    }
  };

  // Retry sending failed message
  const handleRetryMessage = async (msg: ChatMessage) => {
    if (!activeChatId || !user?.id) return;

    // Set to sending
    setConversations(prev => prev.map(chat => {
      if (String(chat.id) === String(activeChatId)) {
        return {
          ...chat,
          messages: chat.messages.map(m => m.id === msg.id ? { ...m, status: 'sending', error: undefined } : m)
        };
      }
      return chat;
    }));

    try {
      const { data, error } = await supabase.from('messages').insert({
        id: msg.id,
        conversation_id: activeChatId,
        sender_id: user.id,
        content: msg.text || "",
        media_type: msg.type || 'text',
        media_url: msg.mediaUrl || null
      }).select().single();

      if (error) throw error;

      setConversations(prev => prev.map(chat => {
        if (String(chat.id) === String(activeChatId)) {
          return {
            ...chat,
            messages: chat.messages.map(m => m.id === msg.id ? { ...m, status: 'sent' } : m)
          };
        }
        return chat;
      }));
    } catch (err: any) {
      setConversations(prev => prev.map(chat => {
        if (String(chat.id) === String(activeChatId)) {
          return {
            ...chat,
            messages: chat.messages.map(m => m.id === msg.id ? { ...m, status: 'failed', error: err.message } : m)
          };
        }
        return chat;
      }));
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    
    const msgText = newMessage.trim();
    setNewMessage("");

    // Keep input focused so mobile virtual keyboard stays open
    if (textInputRef.current) {
      textInputRef.current.focus();
    }

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

  // --- Voice Recording ---
  const startVoiceRecord = async () => {
    setIsAttachmentMenuOpen(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        sendMessageWithStatus('audio', 'Voice Message', audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsVoiceRecording(true);
    } catch (err) {
      alert('Microphone access denied or not available.');
    }
  };

  const stopVoiceRecord = () => {
    if (mediaRecorderRef.current && isVoiceRecording) {
      mediaRecorderRef.current.stop();
      setIsVoiceRecording(false);
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
      // 1. Delete messages, participants, and conversation in Supabase
      await supabase.from('messages').delete().eq('conversation_id', chatId);
      await supabase.from('conversation_participants').delete().eq('conversation_id', chatId);
      await supabase.from('conversations').delete().eq('id', chatId);

      // 2. Remove from local state
      setConversations(prev => {
        const next = prev.filter(c => String(c.id) !== String(chatId));
        useAppStore.getState().setCachedConversations(next);
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
    <div className="h-[calc(100vh-73px)] overflow-hidden bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col font-sans">

      {/* Offline / Queued Connection Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-black px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-md z-50 animate-in slide-in-from-top duration-200">
          <WifiOff size={16} />
          <span>You&apos;re currently offline. Messages will be queued and sent automatically when connected.</span>
        </div>
      )}

      {/* Main Messaging UI */}
      <div className="flex-1 flex w-full p-0 md:p-6 lg:p-8 min-h-0 md:gap-6 bg-white dark:bg-[#0f172a] md:bg-transparent">
        
        {/* Left Pane: Conversations List */}
        <ChatSidebar 
          conversations={conversations}
          activeChatId={activeChatId}
          onSelectChat={markAsRead}
          onDeleteChat={handleDeleteChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          chatFilter={chatFilter}
          onFilterChange={setChatFilter}
          showMobileChat={showMobileChat}
        />

        {/* Right Pane: Active Chat Window */}
        <div className={`bg-white dark:bg-[#0f172a] md:rounded-3xl border-0 md:border border-gray-200 dark:border-white/10 md:shadow-xl flex-col overflow-hidden ${!showMobileChat ? 'hidden md:flex flex-1 h-full min-h-0 relative' : 'flex fixed inset-0 z-[100] md:relative md:flex-1 md:inset-auto md:z-auto h-full min-h-0'}`}>
          
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
                isOptionsOpen={isChatOptionsOpen}
                onBlockUser={() => { setIsChatOptionsOpen(false); alert("User blocked!"); }}
                onClearChat={() => { setIsChatOptionsOpen(false); alert("Chat cleared!"); }}
              />

              {/* Chat Messages Body */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8f9fa] dark:bg-[#0a0f1d] space-y-4 relative"
              >
                {isLoadingMessages && activeChat.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                    <Loader2 size={24} className="animate-spin text-[#5a32fa]" />
                    <span className="text-xs font-semibold">Loading messages...</span>
                  </div>
                ) : activeChat.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#5a32fa]/10 text-[#5a32fa] flex items-center justify-center mb-3">
                      <Sparkles size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">No messages yet</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Send a message to start this conversation.</p>
                  </div>
                ) : (
                  activeChat.messages.map((msg) => (
                    <MessageBubble 
                      key={msg.id}
                      message={msg}
                      onRetry={handleRetryMessage}
                      onImageClick={setLightboxImageUrl}
                    />
                  ))
                )}
                <div ref={messagesEndRef} className="h-0 w-0 pointer-events-none" />

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

              {/* Chat Input Bar */}
              <div className="p-4 pb-[max(env(safe-area-inset-bottom,0px),1rem)] md:pb-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#0f172a] shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <div className="relative">
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
                        <button type="button" onClick={startVoiceRecord} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-[#5a32fa] hover:text-white transition-colors font-bold text-xs text-left">
                          <Mic size={16} /> Voice Note
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
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTypingEvent();
                    }}
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#5a32fa] font-medium text-xs transition-colors bg-gray-50/70 dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400"
                  />

                  {isVoiceRecording ? (
                    <button 
                      type="button" 
                      onClick={stopVoiceRecord}
                      className="px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 animate-pulse shadow-md"
                    >
                      <Square size={14} className="fill-white" /> Stop Recording
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      onMouseDown={(e) => {
                        // Prevent click from stealing focus from text input
                        e.preventDefault();
                      }}
                      onTouchStart={(e) => {
                        // Prevent mobile touch from blurring input
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      disabled={!newMessage.trim() && !isUploading}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#5a32fa] hover:bg-[#6c47ff] text-white disabled:opacity-40 transition-all shadow-md shadow-[#5a32fa]/30 shrink-0"
                    >
                      <Send size={16} />
                    </button>
                  )}
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f8f9fa] dark:bg-[#0a0f1d]">
              <div className="w-16 h-16 rounded-3xl bg-[#5a32fa]/10 text-[#5a32fa] flex items-center justify-center mb-4 shadow-sm">
                <Sparkles size={28} />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Select a Conversation</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                Choose a contact from your inbox or start a direct message from any member profile.
              </p>
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5a32fa]"></div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
