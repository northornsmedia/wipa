'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Search, Paperclip, Send, MoreHorizontal, BadgeCheck, 
  Camera, Mic, MapPin, Image as ImageIcon, Video, FileText, 
  X, Play, Square 
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { Suspense } from 'react';

type Message = {
  id: string | number;
  text?: string;
  sender: string;
  time: string;
  type?: 'text' | 'image' | 'video' | 'document' | 'location' | 'audio';
  mediaUrl?: string;
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

const MOCK_CONVERSATIONS: Chat[] = [];

function MessagesContent() {
  const { user } = useAppStore();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | number>(1);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isChatOptionsOpen, setIsChatOptionsOpen] = useState(false);
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

  // Use a ref to access the latest activeChatId inside the global listener without re-binding the effect
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
          participants:conversation_participants (
            user:profiles (
              id,
              full_name
            )
          ),
          messages (
            content,
            created_at
          )
        `)
        .order('created_at', { foreignTable: 'messages', ascending: false })
        .limit(1, { foreignTable: 'messages' })
        .order('updated_at', { ascending: false });

      if (data) {
        const formattedChats: Chat[] = data.map((conv: any) => {
          let chatName = conv.name;
          let chatInitial = 'G';
          let participantId = undefined;
            
          if (!conv.is_group) {
            // Find the other participant in a DM
            const otherParticipant = conv.participants?.find((p: any) => p.user?.id !== user.id)?.user;
            chatName = otherParticipant?.full_name || 'Anonymous User';
            chatInitial = chatName.charAt(0).toUpperCase();
            participantId = otherParticipant?.id;
          } else if (chatName) {
            chatInitial = chatName.charAt(0).toUpperCase();
          }

          let lastMessageText = 'Start a conversation';
          let lastTimeText = '';
          
          if (conv.messages && conv.messages.length > 0) {
            lastMessageText = conv.messages[0].content;
            lastTimeText = new Date(conv.messages[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const now = new Date();
            const msgDate = new Date(conv.messages[0].created_at);
            if (now.toDateString() !== msgDate.toDateString()) {
              // If it's not today, show date like "Mon" or "Jul 26"
              lastTimeText = msgDate.toLocaleDateString([], { weekday: 'short' });
            }
          }

          return {
            id: conv.id,
            name: chatName || 'Group Chat',
            role: conv.is_group ? `Group Chat • ${conv.participants?.length || 0} members` : 'WIPA Member',
            initial: chatInitial,
            color: ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'][Math.floor(Math.random() * 4)],
            unread: unreadMap[conv.id] || 0,
            lastMessage: lastMessageText,
            lastTime: lastTimeText,
            messages: [],
            participantId
          };
        });
        setConversations(formattedChats);
      }
    };
    fetchConversations();
    
    // Global listener for new messages to update the inbox sidebar in real-time
    const globalChannel = supabase.channel(`global-messages-${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const m = payload.new as any;
        
        setConversations(prev => {
          const chatIndex = prev.findIndex(c => c.id === m.conversation_id);
          if (chatIndex > -1) {
            const chat = prev[chatIndex];
            const isMe = m.sender_id === user.id;
            const updatedChat = {
              ...chat,
              lastMessage: m.content || (m.media_url ? "Sent an attachment" : ""),
              lastTime: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unread: (!isMe && activeChatIdRef.current !== m.conversation_id) ? chat.unread + 1 : chat.unread
            };
            
            // Move to top
            const newPrev = [...prev];
            newPrev.splice(chatIndex, 1);
            return [updatedChat, ...newPrev];
          } else {
            // If it's a completely new chat we haven't loaded, we can just refetch all to be safe
            fetchConversations();
            return prev;
          }
        });
      })
      .subscribe();
      
    return () => { supabase.removeChannel(globalChannel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // do not depend on activeChatId here!

  // Load target user chat if accessed via ?userId=
  useEffect(() => {
    if (targetUserId && user?.id) {
       const initChat = async () => {
          // Find an existing DM with this target user
          const { data: myChats } = await supabase
            .from('conversation_participants')
            .select('conversation_id, conversations(is_group)')
            .eq('user_id', user.id);
            
          // Filter to only get DM chat IDs
          const myDMChatIds = myChats
            ?.filter((c: any) => c.conversations?.is_group === false)
            .map((c: any) => c.conversation_id) || [];
          
          let existingChatId = null;
          
          if (myDMChatIds.length > 0) {
            const { data: sharedChats } = await supabase
              .from('conversation_participants')
              .select('conversation_id')
              .eq('user_id', targetUserId)
              .in('conversation_id', myDMChatIds);
              
            if (sharedChats && sharedChats.length > 0) {
              existingChatId = sharedChats[0].conversation_id;
            }
          }

          if (existingChatId) {
             setActiveChatId(existingChatId);
          } else {
             // Create new DM
             const { data: newConv } = await supabase
               .from('conversations')
               .insert({ is_group: false })
               .select()
               .single();
               
             if (newConv) {
               // Insert participants
               await supabase.from('conversation_participants').insert([
                 { conversation_id: newConv.id, user_id: user.id, role: 'admin' },
                 { conversation_id: newConv.id, user_id: targetUserId, role: 'admin' }
               ]);
               
               const { data: profile } = await supabase.from('profiles').select('*').eq('id', targetUserId).single();
               if (profile) {
                 const newChat: Chat = {
                    id: newConv.id,
                    name: profile.full_name || 'User',
                    role: 'WIPA Member',
                    initial: profile.full_name?.charAt(0) || 'U',
                    color: '#5a32fa',
                    unread: 0,
                    lastMessage: 'Start a conversation',
                    lastTime: '',
                    messages: [],
                    participantId: targetUserId
                 };
                 setConversations(prev => [newChat, ...prev]);
                 setActiveChatId(newConv.id);
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
        const msgs = data.map(m => ({
          id: m.id,
          text: m.content,
          sender: m.sender_id === user.id ? 'me' : 'them',
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text' as any
        }));
        
        console.log("Fetched messages for chat:", activeChatId, msgs);
        
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
          if (m.sender_id === user.id) return; // ignore our own messages
          const msg = {
             id: m.id,
             text: m.content,
             sender: 'them',
             time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
             type: 'text' as any
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

  const appendMessage = (type: Message['type'], text?: string, mediaUrl?: string) => {
    const newMsg: Message = {
      id: Date.now(),
      text,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      mediaUrl
    };

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
    
    // Also move this chat to the top
    setConversations(prev => {
      const chatIndex = prev.findIndex(c => c.id === activeChatId);
      if (chatIndex > -1) {
        const newPrev = [...prev];
        const [chat] = newPrev.splice(chatIndex, 1);
        return [chat, ...newPrev];
      }
      return prev;
    });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    
    const msgText = newMessage.trim();
    setNewMessage("");
    appendMessage('text', msgText);
    
    if (activeChatId && user?.id) {
      await supabase.from('messages').insert({
        conversation_id: activeChatId,
        sender_id: user.id,
        content: msgText
      });
      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', activeChatId);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'document') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    appendMessage(type, file.name, url);
    setIsAttachmentMenuOpen(false);
    e.target.value = ''; // Reset input
  };

  const handleLocationShare = () => {
    setIsAttachmentMenuOpen(false);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          appendMessage('location', `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, `https://www.google.com/maps?q=${latitude},${longitude}`);
        },
        (error) => {
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
        appendMessage('audio', '', audioUrl);
        // Clean up tracks
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

  // --- Camera ---
  const openCamera = async () => {
    setIsAttachmentMenuOpen(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStreamRef.current = stream;
      // We no longer set srcObject here, because the video element hasn't been rendered yet.
      // The useEffect listening to isCameraOpen will handle it.
      setIsCameraOpen(true);
    } catch (err) {
      alert('Camera access denied or not available.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            appendMessage('image', 'Captured photo', url);
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
    <div className="h-[calc(100vh-73px)] overflow-hidden bg-[#f8f9fa] flex flex-col">


      {/* Main Messaging UI */}
      <div className="flex-1 flex w-full p-0 md:p-6 lg:p-8 min-h-0 md:gap-6 bg-white md:bg-transparent">
        
        {/* Left Pane: Conversations List */}
        <div className={`w-full md:w-[350px] lg:w-[400px] bg-white md:rounded-2xl border-0 md:border border-gray-200 md:shadow-md flex-col overflow-hidden shrink-0 h-full min-h-0 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          
          <div className="hidden md:block p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Inbox</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5a32fa] font-medium text-sm transition-colors bg-white"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {filteredConversations.map(chat => (
              <div 
                key={chat.id}
                onClick={() => markAsRead(chat.id)}
                className={`flex items-center gap-4 p-4 border-b-2 border-gray-100 cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-[#5a32fa]/10' : 'hover:bg-gray-50'}`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg border border-gray-200" style={{ backgroundColor: chat.color }}>
                    {chat.initial}
                  </div>
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ffc900] border border-gray-200 rounded-full"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-bold text-[15px] truncate ${chat.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                      {chat.name}
                    </h3>
                    <span className={`text-[10px] whitespace-nowrap ml-2 ${chat.unread > 0 ? 'font-bold text-[#5a32fa]' : 'font-medium text-gray-400'}`}>
                      {chat.lastTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate pr-2 ${chat.unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}>
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="bg-[#00d26a] text-[#131313] text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center flex items-center justify-center shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-medium">
                No conversations found.
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat */}
        <div className={`bg-white md:rounded-2xl border-0 md:border border-gray-200 md:shadow-md flex-col overflow-hidden ${!showMobileChat ? 'hidden md:flex flex-1 h-full min-h-0 relative' : 'flex fixed inset-0 z-[100] md:relative md:flex-1 md:inset-auto md:z-auto h-full min-h-0'}`}>
          
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10">
                <div className="flex items-center gap-2 md:gap-4">
                  <button 
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 -ml-2"
                  >
                    <ArrowLeft size={20} className="text-gray-900" />
                  </button>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg border border-gray-200" style={{ backgroundColor: activeChat.color }}>
                    {activeChat.initial}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-900 flex items-center gap-1">
                      {activeChat.name}
                      <BadgeCheck size={16} className="text-[#5a32fa]" />
                    </h2>
                    <p className="text-xs font-medium text-gray-500">{activeChat.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 relative">
                  {activeChat.participantId && (
                    <Link href={`/platform/profile/${activeChat.participantId}`} className="hidden sm:block px-4 py-2 border-2 border-gray-200 rounded-xl font-bold text-xs text-gray-600 hover:border-gray-200 hover:text-[#131313] transition-colors">
                      View Profile
                    </Link>
                  )}
                  <button 
                    onClick={() => setIsChatOptionsOpen(!isChatOptionsOpen)}
                    className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl text-gray-600 hover:border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  
                  {isChatOptionsOpen && (
                    <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-xl shadow-sm py-2 z-50 overflow-hidden">
                      <button 
                        onClick={() => { setIsChatOptionsOpen(false); alert("User blocked!"); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#ff4b4b] hover:bg-red-50 transition-colors"
                      >
                        Block User
                      </button>
                      <button 
                        onClick={() => { setIsChatOptionsOpen(false); alert("Chat cleared!"); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Clear Chat
                      </button>
                      <button 
                        onClick={() => { setIsChatOptionsOpen(false); alert("Notifications muted!"); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Mute Notifications
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fa]">
                <div className="space-y-6 flex flex-col">
                  {activeChat.messages.map((msg, index) => {
                    const isMe = msg.sender === "me";
                    
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                        <div 
                          className={`px-5 py-3 border border-gray-200 text-[15px] font-medium leading-relaxed ${
                            isMe 
                              ? 'bg-[#00d26a] text-[#131313] rounded-t-2xl rounded-bl-2xl rounded-br-sm shadow-[-4px_4px_0px_0px_#131313]' 
                              : 'bg-white text-gray-900 rounded-t-2xl rounded-br-2xl rounded-bl-sm shadow-sm'
                          }`}
                        >
                          {/* Media Rendering */}
                          {msg.type === 'image' && msg.mediaUrl && (
                            <img src={msg.mediaUrl} alt="Attached image" className="max-w-full h-auto rounded-xl border border-gray-200 mb-2" />
                          )}
                          {msg.type === 'video' && msg.mediaUrl && (
                            <video src={msg.mediaUrl} controls className="max-w-full h-auto rounded-xl border border-gray-200 mb-2" />
                          )}
                          {msg.type === 'document' && (
                            <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-gray-200 mb-2">
                              <FileText size={24} className="text-[#5a32fa]" />
                              <span className="font-bold text-sm truncate max-w-[200px]">{msg.text}</span>
                            </div>
                          )}
                          {msg.type === 'location' && msg.mediaUrl && (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 font-bold"><MapPin size={18} /> Shared Location</div>
                              <a href={msg.mediaUrl} target="_blank" rel="noreferrer" className="text-sm underline font-medium hover:text-[#5a32fa] transition-colors">{msg.text}</a>
                            </div>
                          )}
                          {msg.type === 'audio' && msg.mediaUrl && (
                            <div className="mb-2 w-full max-w-[250px]">
                              <audio src={msg.mediaUrl} controls className="w-full h-10" />
                            </div>
                          )}

                          {(!msg.type || msg.type === 'text') && (
                            <span>{msg.text}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 mt-2 px-1">
                          {msg.time}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 sm:p-6 border-t border-gray-100 bg-white shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                      className={`w-12 h-12 flex items-center justify-center shrink-0 border-2 rounded-xl transition-colors ${
                        isAttachmentMenuOpen 
                          ? 'border-gray-200 text-[#131313] bg-gray-50' 
                          : 'border-gray-200 text-gray-400 hover:border-gray-200 hover:text-[#131313]'
                      }`}
                    >
                      <Paperclip size={20} />
                    </button>

                    {/* Attachment Menu Popover */}
                    {isAttachmentMenuOpen && (
                      <div className="absolute bottom-[calc(100%+12px)] left-0 bg-white border border-gray-200 rounded-2xl shadow-[6px_6px_0px_0px_#131313] py-2 w-56 z-50 overflow-hidden">
                        <button type="button" onClick={openCamera} className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#5a32fa] hover:text-white transition-colors font-bold text-sm text-left group">
                          <Camera size={18} className="group-hover:scale-110 transition-transform" /> Camera
                        </button>
                        <button type="button" onClick={startVoiceRecord} className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#5a32fa] hover:text-white transition-colors font-bold text-sm text-left group">
                          <Mic size={18} className="group-hover:scale-110 transition-transform" /> Voice Message
                        </button>
                        <button type="button" onClick={handleLocationShare} className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#5a32fa] hover:text-white transition-colors font-bold text-sm text-left group">
                          <MapPin size={18} className="group-hover:scale-110 transition-transform" /> Location
                        </button>
                        <div className="h-[2px] bg-gray-100 my-1 mx-4"></div>
                        <button type="button" onClick={() => imageInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#5a32fa] hover:text-white transition-colors font-bold text-sm text-left group">
                          <ImageIcon size={18} className="group-hover:scale-110 transition-transform" /> Images
                        </button>
                        <button type="button" onClick={() => videoInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#5a32fa] hover:text-white transition-colors font-bold text-sm text-left group">
                          <Video size={18} className="group-hover:scale-110 transition-transform" /> Videos
                        </button>
                        <button type="button" onClick={() => docInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#5a32fa] hover:text-white transition-colors font-bold text-sm text-left group">
                          <FileText size={18} className="group-hover:scale-110 transition-transform" /> Documents
                        </button>
                      </div>
                    )}

                    {/* Hidden Inputs */}
                    <input type="file" ref={imageInputRef} onChange={(e) => handleFileUpload(e, 'image')} accept="image/*" className="hidden" />
                    <input type="file" ref={videoInputRef} onChange={(e) => handleFileUpload(e, 'video')} accept="video/*" className="hidden" />
                    <input type="file" ref={docInputRef} onChange={(e) => handleFileUpload(e, 'document')} accept=".pdf,.doc,.docx,.txt" className="hidden" />
                  </div>
                  
                  <div className="flex-1 relative flex items-center gap-2">
                    {isVoiceRecording ? (
                      <div className="flex-1 flex items-center justify-between bg-red-50 border-2 border-red-500 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3 text-red-600 font-bold animate-pulse">
                          <Mic size={18} /> Recording Voice Message...
                        </div>
                        <button type="button" onClick={stopVoiceRecord} className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600">
                          <Square size={14} fill="currentColor" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Write a message..."
                          className="w-full pl-4 pr-14 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5a32fa] font-medium text-[15px] transition-colors"
                        />
                        <button 
                          type="submit" 
                          disabled={!newMessage.trim()}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                            newMessage.trim() 
                              ? 'bg-[#5a32fa] text-white hover:bg-[#4020ca]' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Send size={16} className={newMessage.trim() ? "ml-0.5" : ""} />
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#f8f9fa]">
              <div className="w-24 h-24 bg-gray-200 rounded-3xl mb-6 border-4 border-gray-300"></div>
              <h2 className="text-2xl font-bold text-gray-400">Select a conversation</h2>
              <p className="text-gray-400 font-medium mt-2">Choose someone from your inbox to start chatting.</p>
            </div>
          )}

          {/* Camera Modal overlay inside the right pane */}
          {isCameraOpen && (
            <div className="absolute inset-0 z-50 bg-[#5a32fa] flex flex-col">
              <div className="flex justify-between items-center p-4 text-white border-b-2 border-gray-800">
                <h3 className="font-bold text-lg flex items-center gap-2"><Camera size={20} /> Take Photo</h3>
                <button onClick={closeCamera} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="p-8 flex justify-center bg-[#5a32fa] border-t-2 border-gray-800">
                <button 
                  onClick={capturePhoto} 
                  className="w-20 h-20 bg-white rounded-full border-4 border-gray-400 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <div className="w-16 h-16 bg-white rounded-full border border-gray-200"></div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold text-xl text-gray-400">Loading Messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
