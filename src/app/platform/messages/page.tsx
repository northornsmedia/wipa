'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Search, Paperclip, Send, MoreHorizontal, BadgeCheck, 
  Camera, Mic, MapPin, Image as ImageIcon, Video, FileText, 
  X, Play, Square, Check, CheckCheck, Clock, AlertCircle, RefreshCw,
  WifiOff, Sparkles, Phone, VideoIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { Suspense } from 'react';

type MessageStatus = 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

type Message = {
  id: string | number;
  text?: string;
  sender: 'me' | 'them';
  time: string;
  type?: 'text' | 'image' | 'video' | 'document' | 'location' | 'audio';
  mediaUrl?: string;
  status?: MessageStatus;
  error?: string;
};

type Chat = {
  id: string | number;
  name: string;
  role: string;
  initial: string;
  color: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  messages: Message[];
  participantId?: string;
};

function MessagesContent() {
  const router = useRouter();
  const { user } = useAppStore();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | number | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isChatOptionsOpen, setIsChatOptionsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = conversations.find(c => c.id === activeChatId);

  // Attachment refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Voice recording state
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

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

  // Use a ref to access the latest activeChatId inside the global listener
  const activeChatIdRef = useRef<string | number | null>(null);
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  // Load real conversations
  useEffect(() => {
    if (!user?.id) return;
    const fetchConversations = async () => {
      // Fetch unread messages
      const { data: unreadData } = await supabase
        .from('messages')
        .select('conversation_id')
        .eq('is_read', false)
        .neq('sender_id', user.id);

      const unreadMap: Record<string, number> = {};
      if (unreadData) {
        unreadData.forEach((m: any) => {
          unreadMap[m.conversation_id] = (unreadMap[m.conversation_id] || 0) + 1;
        });
      }
      const { data } = await supabase
        .from('conversations')
        .select(`
          id,
          updated_at,
          name,
          is_group,
          conversation_participants (
            user_id,
            profiles (id, full_name, avatar_url, role)
          )
        `)
        .order('updated_at', { ascending: false });

      if (data) {
        const parsed: Chat[] = data.map((c: any) => {
          const other = c.conversation_participants?.find((p: any) => p.user_id !== user.id)?.profiles || {};
          const title = c.is_group ? c.name : (other.full_name || 'Direct Message');
          return {
            id: c.id,
            name: title,
            role: other.role || 'Member',
            initial: title.charAt(0).toUpperCase() || 'U',
            color: '#5a32fa',
            unread: unreadMap[c.id] || 0,
            lastMessage: 'Tap to view conversation',
            lastTime: c.updated_at ? new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            messages: [],
            participantId: other.id
          };
        });
        setConversations(parsed);
        if (parsed.length > 0 && !activeChatId && !targetUserId) {
          setActiveChatId(parsed[0].id);
        }
      }
    };
    fetchConversations();
  }, [user?.id, targetUserId]);

  // Handle direct targetUserId routing
  useEffect(() => {
    if (targetUserId && user?.id) {
       const initChat = async () => {
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
                matchedConvId = otherMatches[0].conversation_id;
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
                     id: newConv.id,
                     name: profile.full_name || 'User',
                     role: profile.practice_area || 'WIPA Member',
                     initial: profile.full_name?.charAt(0)?.toUpperCase() || 'U',
                     color: '#5a32fa',
                     unread: 0,
                     lastMessage: 'Start a conversation',
                     lastTime: '',
                     messages: [],
                     participantId: targetUserId
                  };
                  setConversations(prev => [newChat, ...prev]);
                  setActiveChatId(newConv.id);
                  setShowMobileChat(true);
                }
             }
          }
       };
       initChat();
    }
  }, [targetUserId, user?.id]);

  // Fetch messages for active chat and subscribe
  useEffect(() => {
    if (!activeChatId || !user?.id) return;
    
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeChatId)
        .order('created_at', { ascending: true });
        
      if (data) {
        const msgs: Message[] = data.map(m => ({
          id: m.id,
          text: m.content,
          sender: m.sender_id === user.id ? 'me' : 'them',
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          status: m.sender_id === user.id ? (m.is_read ? 'read' : 'delivered') : undefined
        }));
        
        setConversations(prev => prev.map(chat => chat.id === activeChatId ? { ...chat, messages: msgs, unread: 0 } : chat));
        
        // Mark all as read
        supabase.from('messages')
          .update({ is_read: true })
          .eq('conversation_id', activeChatId)
          .eq('is_read', false)
          .neq('sender_id', user.id)
          .then();
      }
    };
    fetchMessages();
    
    const channel = supabase.channel(`messages:${activeChatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeChatId}` }, payload => {
          const m = payload.new;
          if (m.sender_id === user.id) return; // ignore our own
          const msg: Message = {
             id: m.id,
             text: m.content,
             sender: 'them',
             time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
             type: 'text'
          };
          setConversations(prev => prev.map(chat => chat.id === activeChatId ? { ...chat, messages: [...chat.messages, msg] } : chat));
          
          // Mark as read immediately since we are viewing the chat
          supabase.from('messages').update({ is_read: true }).eq('id', m.id).then();
       }).subscribe();
       
    return () => { supabase.removeChannel(channel); };
  }, [activeChatId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

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

  // Append message locally and try to sync to Supabase
  const sendMessageWithStatus = async (type: Message['type'], text?: string, mediaUrl?: string) => {
    const tempId = `temp_${Date.now()}`;
    const initialStatus: MessageStatus = !isOnline ? 'queued' : 'sending';

    const newMsg: Message = {
      id: tempId,
      text,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      mediaUrl,
      status: initialStatus
    };

    // Optimistically update UI
    setConversations(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        let lastMsgPreview = text || "Sent an attachment";
        if (type === 'image') lastMsgPreview = "Sent an image 📸";
        if (type === 'video') lastMsgPreview = "Sent a video 🎥";
        if (type === 'document') lastMsgPreview = "Sent a document 📄";
        if (type === 'location') lastMsgPreview = "Shared a location 📍";
        if (type === 'audio') lastMsgPreview = "Sent a voice message 🎤";

        return {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMessage: lastMsgPreview,
          lastTime: "Just now"
        };
      }
      return chat;
    }));

    if (!activeChatId || !user?.id) return;

    if (!isOnline) {
      // Leave as queued
      return;
    }

    try {
      const { data, error } = await supabase.from('messages').insert({
        conversation_id: activeChatId,
        sender_id: user.id,
        content: text || (mediaUrl ? `[Media: ${type}]` : "")
      }).select().single();

      if (error) throw error;

      // Update message to sent/delivered
      setConversations(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: chat.messages.map(m => m.id === tempId ? { ...m, id: data.id, status: 'sent' } : m)
          };
        }
        return chat;
      }));

      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', activeChatId);
    } catch (err: any) {
      console.error("Message send failed:", err);
      // Mark message as failed
      setConversations(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: chat.messages.map(m => m.id === tempId ? { ...m, status: 'failed', error: err.message } : m)
          };
        }
        return chat;
      }));
    }
  };

  // Retry sending failed message
  const handleRetryMessage = async (msg: Message) => {
    if (!activeChatId || !user?.id) return;

    // Set to sending
    setConversations(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: chat.messages.map(m => m.id === msg.id ? { ...m, status: 'sending', error: undefined } : m)
        };
      }
      return chat;
    }));

    try {
      const { data, error } = await supabase.from('messages').insert({
        conversation_id: activeChatId,
        sender_id: user.id,
        content: msg.text || ""
      }).select().single();

      if (error) throw error;

      setConversations(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: chat.messages.map(m => m.id === msg.id ? { ...m, id: data.id, status: 'sent' } : m)
          };
        }
        return chat;
      }));
    } catch (err: any) {
      setConversations(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
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

  const markAsRead = (id: string | number) => {
    setConversations(conversations.map(chat => 
      chat.id === id ? { ...chat, unread: 0 } : chat
    ));
    setActiveChatId(id);
    setShowMobileChat(true);
  };

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-73px)] overflow-hidden bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col">

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
        <div className={`w-full md:w-[350px] lg:w-[400px] bg-white dark:bg-[#0f172a] md:rounded-3xl border-0 md:border border-gray-200 dark:border-white/10 md:shadow-xl flex-col overflow-hidden shrink-0 h-full min-h-0 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Top Bar with Back Button to Platform */}
          <div className="p-5 border-b border-gray-100 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link 
                  href="/platform" 
                  className="flex items-center justify-center w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-[#5a32fa] hover:text-white text-gray-700 dark:text-gray-200 transition-all duration-200 shadow-sm"
                  title="Back to Feed"
                >
                  <ArrowLeft size={18} />
                </Link>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Messages</h2>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#5a32fa]/10 text-[#5a32fa] dark:text-[#9b7aff]">
                {conversations.length} Active
              </span>
            </div>

            <div className="relative">
              <input 
                type="text" 
                placeholder="Search messages & contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#5a32fa] font-medium text-xs transition-colors bg-gray-50/70 dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400"
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-gray-50 dark:divide-white/5">
            {filteredConversations.map(chat => (
              <div 
                key={chat.id}
                onClick={() => markAsRead(chat.id)}
                className={`flex items-center gap-3.5 p-4 cursor-pointer transition-all duration-200 ${
                  activeChatId === chat.id 
                    ? 'bg-[#5a32fa]/10 dark:bg-[#5a32fa]/15 border-l-4 border-[#5a32fa]' 
                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm" style={{ backgroundColor: chat.color }}>
                    {chat.initial}
                  </div>
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#0f172a] rounded-full animate-pulse"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-bold text-sm truncate ${chat.unread > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                      {chat.name}
                    </h3>
                    <span className={`text-[11px] whitespace-nowrap ml-2 font-mono ${chat.unread > 0 ? 'font-bold text-[#5a32fa]' : 'text-gray-400'}`}>
                      {chat.lastTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate pr-2 ${chat.unread > 0 ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {chat.lastMessage}
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
            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-medium text-xs">
                No conversations found.
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat Window */}
        <div className={`bg-white dark:bg-[#0f172a] md:rounded-3xl border-0 md:border border-gray-200 dark:border-white/10 md:shadow-xl flex-col overflow-hidden ${!showMobileChat ? 'hidden md:flex flex-1 h-full min-h-0 relative' : 'flex fixed inset-0 z-[100] md:relative md:flex-1 md:inset-auto md:z-auto h-full min-h-0'}`}>
          
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#0f172a] shrink-0 z-10">
                <div className="flex items-center gap-3">
                  {/* WhatsApp-Style Mobile Back Button */}
                  <button 
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-[#5a32fa] hover:text-white text-gray-900 dark:text-white transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0" style={{ backgroundColor: activeChat.color }}>
                    {activeChat.initial}
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-1.5 leading-none">
                      {activeChat.name}
                      <BadgeCheck size={16} className="text-[#5a32fa]" />
                    </h2>
                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-1">
                      {isOnline ? "● Online" : "○ Offline"} • {activeChat.role}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 relative">
                  {activeChat.participantId && (
                    <Link 
                      href={`/platform/profile/${activeChat.participantId}`} 
                      className="hidden sm:inline-flex items-center gap-1 px-3.5 py-2 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-200 hover:border-[#5a32fa] hover:text-[#5a32fa] transition-colors"
                    >
                      View Profile
                    </Link>
                  )}
                  <button 
                    onClick={() => setIsChatOptionsOpen(!isChatOptionsOpen)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-white/10 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  
                  {isChatOptionsOpen && (
                    <div className="absolute top-12 right-0 w-48 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <button 
                        onClick={() => { setIsChatOptionsOpen(false); alert("User blocked!"); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      >
                        Block User
                      </button>
                      <button 
                        onClick={() => { setIsChatOptionsOpen(false); alert("Chat cleared!"); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        Clear Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fa] dark:bg-[#0a0f1d] space-y-4">
                {activeChat.messages.map((msg) => {
                  const isMe = msg.sender === "me";
                  
                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${isMe ? 'self-end items-end ml-auto' : 'self-start items-start mr-auto'}`}>
                      
                      {/* Bubble */}
                      <div 
                        className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm transition-all ${
                          isMe 
                            ? 'bg-gradient-to-r from-[#5a32fa] to-[#6e46ff] text-white rounded-tr-none' 
                            : 'bg-white dark:bg-[#131b2e] text-gray-900 dark:text-white border border-gray-200/70 dark:border-white/10 rounded-tl-none'
                        }`}
                      >
                        {/* Media Attachments */}
                        {msg.type === 'image' && msg.mediaUrl && (
                          <img src={msg.mediaUrl} alt="Attached" className="max-w-full h-auto rounded-xl border border-white/10 mb-2 max-h-64 object-cover" />
                        )}
                        {msg.type === 'video' && msg.mediaUrl && (
                          <video src={msg.mediaUrl} controls className="max-w-full h-auto rounded-xl border border-white/10 mb-2 max-h-64" />
                        )}
                        {msg.type === 'document' && (
                          <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/10 mb-2">
                            <FileText size={20} className="text-amber-400" />
                            <span className="font-bold text-xs truncate max-w-[200px]">{msg.text}</span>
                          </div>
                        )}
                        {msg.type === 'location' && msg.mediaUrl && (
                          <div className="flex flex-col gap-1.5 mb-1">
                            <div className="flex items-center gap-1.5 font-bold text-xs"><MapPin size={14} /> Shared Location</div>
                            <a href={msg.mediaUrl} target="_blank" rel="noreferrer" className="text-xs underline font-medium hover:opacity-80 transition-opacity">{msg.text}</a>
                          </div>
                        )}
                        {msg.type === 'audio' && msg.mediaUrl && (
                          <div className="mb-1 w-full max-w-[240px]">
                            <audio src={msg.mediaUrl} controls className="w-full h-8" />
                          </div>
                        )}

                        {(!msg.type || msg.type === 'text') && (
                          <span className="whitespace-pre-wrap">{msg.text}</span>
                        )}
                      </div>

                      {/* Timestamp & WhatsApp Status Ticks */}
                      <div className="flex items-center gap-1.5 mt-1 px-1">
                        <span className="text-[10px] font-mono text-gray-400">
                          {msg.time}
                        </span>

                        {isMe && (
                          <div className="flex items-center">
                            {/* Queued / Sending: Clock icon */}
                            {(msg.status === 'queued' || msg.status === 'sending') && (
                              <span title={msg.status === 'queued' ? 'In Queue' : 'Sending...'}>
                                <Clock size={12} className="text-gray-400 animate-spin" />
                              </span>
                            )}

                            {/* Sent: Single grey check */}
                            {msg.status === 'sent' && (
                              <span title="Sent to server">
                                <Check size={14} className="text-gray-400" />
                              </span>
                            )}

                            {/* Delivered: Double grey checks */}
                            {msg.status === 'delivered' && (
                              <span title="Delivered">
                                <CheckCheck size={14} className="text-gray-400" />
                              </span>
                            )}

                            {/* Read: Double blue checks */}
                            {msg.status === 'read' && (
                              <span title="Read">
                                <CheckCheck size={14} className="text-sky-400 font-bold" />
                              </span>
                            )}

                            {/* Failed / Dropped: Red Alert + Retry Button */}
                            {msg.status === 'failed' && (
                              <button
                                onClick={() => handleRetryMessage(msg)}
                                className="flex items-center gap-1 text-[10px] font-bold text-rose-500 hover:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full transition-colors ml-1"
                                title="Click to retry sending"
                              >
                                <AlertCircle size={12} />
                                <span>Failed • Retry</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#0f172a] shrink-0">
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
                    type="text" 
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
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
