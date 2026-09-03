'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Headphones, 
  Send, 
  Paperclip, 
  Sparkles, 
  CheckCheck, 
  Clock, 
  Phone, 
  Mail, 
  HelpCircle, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown, 
  RefreshCw, 
  X, 
  Check, 
  Copy, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  User, 
  MessageSquare, 
  ArrowRight,
  Info,
  Calendar,
  CreditCard,
  GraduationCap,
  Building2,
  Bug,
  Smile,
  FileText,
  AlertCircle,
  History,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentName?: string;
  agentAvatar?: string;
  agentRole?: string;
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    size: string;
    type: 'image' | 'file';
    url?: string;
  };
  actions?: {
    label: string;
    href: string;
  }[];
}

const FAQ_ITEMS = [
  {
    q: 'How do I sync WIPA events with my Google Calendar?',
    a: 'Go to Calendar in the left navigation, click "Sync Google Calendar", and grant authorization. Any upcoming webinar or panel you RSVP to will automatically sync with notifications.',
    category: 'Events',
    link: '/platform/calendar'
  },
  {
    q: 'How do I upgrade or manage my membership subscription?',
    a: 'You can view all tiers, upgrade to Executive or Corporate, and download VAT/Tax receipts directly from the Membership & Billing portal.',
    category: 'Billing',
    link: '/pricing'
  },
  {
    q: 'How does the WIPA Mentorship matching work?',
    a: 'Our mentorship program pairs senior IP counsel with emerging attorneys and students based on mutual practice areas and industry sectors. Applications are reviewed quarterly.',
    category: 'Mentorship',
    link: '/platform/mentorship'
  },
  {
    q: 'Can I publish articles or legal insights in the WIPA Library?',
    a: 'Yes! Verified members can submit legal briefs, patent reviews, and thought-leadership articles to the editorial board via the Resource Library submission portal.',
    category: 'Resources',
    link: '/platform/resources'
  },
  {
    q: 'How do I create a verified business or law firm profile?',
    a: 'Navigate to "Business" in the left sidebar and click "Create Business Profile". Once submitted, our team verifies firm credentials within 24-48 hours.',
    category: 'Directory',
    link: '/platform/business'
  },
  {
    q: 'Where can I claim CLE (Continuing Legal Education) credits?',
    a: 'CLE certificates are automatically generated in your Profile > Certificates tab after attending at least 50 minutes of accredited live webinars.',
    category: 'Events',
    link: '/platform/profile'
  }
];

const PROMPT_SUGGESTIONS = [
  {
    id: 'billing',
    icon: CreditCard,
    label: 'Membership & Billing',
    text: 'I have a question regarding my membership tier and billing receipt.'
  },
  {
    id: 'calendar',
    icon: Calendar,
    label: 'Google Calendar Sync',
    text: 'How do I connect my Google Calendar for upcoming WIPA webinars?'
  },
  {
    id: 'mentorship',
    icon: GraduationCap,
    label: 'Mentorship Program',
    text: 'I would like to know how to apply as a mentor or mentee.'
  },
  {
    id: 'firm',
    icon: Building2,
    label: 'Firm Business Profile',
    text: 'How do I set up a verified law firm profile for my practice?'
  },
  {
    id: 'bug',
    icon: Bug,
    label: 'Report an Issue',
    text: 'I noticed an issue with a page loading or button and want to report it.'
  },
  {
    id: 'human',
    icon: User,
    label: 'Speak to a Specialist',
    text: 'Please connect me with a live member support specialist.'
  }
];

export default function LiveChatSupportPage() {
  const user = useAppStore((state) => state.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedAttachment, setSelectedAttachment] = useState<{ name: string; size: string; type: 'image' | 'file'; preview?: string } | null>(null);
  const [showHubMobile, setShowHubMobile] = useState(false);
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  
  // Modals state
  const [isCallBackModalOpen, setIsCallBackModalOpen] = useState(false);
  const [callBackForm, setCallBackForm] = useState({ phone: '', timeSlot: 'Morning (9am - 12pm EST)', note: '' });
  const [callBackSuccess, setCallBackSuccess] = useState(false);

  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [transcriptEmail, setTranscriptEmail] = useState(user?.email || '');
  const [transcriptSent, setTranscriptSent] = useState(false);
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('Pending');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentSessionStatus, setCurrentSessionStatus] = useState<'active' | 'pending' | 'resolved' | 'closed' | 'new'>('new');
  const [assignedAgentName, setAssignedAgentName] = useState<string>('Sarah Jenkins');
  const [assignedAgentAvatar, setAssignedAgentAvatar] = useState<string>('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop');
  const [pastSessions, setPastSessions] = useState<any[]>([]);

  // Initialize messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-1',
      sender: 'agent',
      agentName: 'Sarah Jenkins',
      agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
      agentRole: 'Senior Member Support Specialist',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! 👋 Welcome to WIPA Live Support. I'm Sarah from the Member Experience team.\n\nWhether you need assistance with event registrations, Google Calendar sync, membership tiers, or navigating platform tools, I'm here to help in real-time. How can we assist you today?`,
      timestamp: 'Just now',
      actions: [
        { label: 'Sync Calendar', href: '/platform/calendar' },
        { label: 'View Tiers', href: '/pricing' },
        { label: 'Mentorship', href: '/platform/mentorship' }
      ]
    }
  ]);

  // Audio chime effect using Web Audio API
  const playNotificationSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio fallback
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (user?.email && !transcriptEmail) {
      setTranscriptEmail(user.email);
    }
  }, [user?.email, transcriptEmail]);

  const loadSessionIntoView = async (sess: any) => {
    if (!sess) return;
    setSessionId(sess.id);
    setCurrentSessionStatus(sess.status || 'active');
    if (sess.ticket_number) setTicketNumber(sess.ticket_number);
    if (sess.assigned_agent_name && sess.assigned_agent_name !== 'Unassigned') {
      setAssignedAgentName(sess.assigned_agent_name);
    } else {
      setAssignedAgentName('Sarah Jenkins');
    }
    if (sess.assigned_agent_avatar) {
      setAssignedAgentAvatar(sess.assigned_agent_avatar);
    }

    // Fetch previous messages for this session
    try {
      const { data: dbMsgs } = await supabase
        .from('support_messages')
        .select('*')
        .eq('session_id', sess.id)
        .order('created_at', { ascending: true });

      const welcomeMessage: ChatMessage = {
        id: 'msg-welcome',
        sender: 'agent',
        agentName: sess.assigned_agent_name && sess.assigned_agent_name !== 'Unassigned' ? sess.assigned_agent_name : 'Sarah Jenkins',
        agentAvatar: sess.assigned_agent_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
        agentRole: 'Senior Member Support Specialist',
        text: `Welcome to WIPA Live Support. Ticket #${sess.ticket_number || 'Pending'} — ${sess.status === 'resolved' ? 'Archived Ticket' : 'Active Conversation'}.`,
        timestamp: 'Session Started'
      };

      if (dbMsgs && dbMsgs.length > 0) {
        const mapped: ChatMessage[] = dbMsgs
          .filter((m: any) => !m.content?.startsWith('[INTERNAL NOTE]'))
          .map((m: any) => ({
            id: m.id,
            sender: m.sender_type as any,
            agentName: m.sender_type === 'agent' ? m.sender_name : undefined,
            agentAvatar: m.sender_avatar,
            text: m.content,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
        setMessages([welcomeMessage, ...mapped]);
      } else {
        setMessages([welcomeMessage]);
      }
    } catch {}
  };

  const handleStartNewTicket = () => {
    setSessionId(null);
    setTicketNumber('Pending');
    setCurrentSessionStatus('new');
    setAssignedAgentName('Sarah Jenkins');
    setMessages([
      {
        id: 'msg-1',
        sender: 'agent',
        agentName: 'Sarah Jenkins',
        agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
        agentRole: 'Senior Member Support Specialist',
        text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! 👋 Ready to start a new support ticket. What can we help you with today?`,
        timestamp: 'Just now',
        actions: [
          { label: 'Sync Calendar', href: '/platform/calendar' },
          { label: 'View Tiers', href: '/pricing' },
          { label: 'Mentorship', href: '/platform/mentorship' }
        ]
      }
    ]);
  };

  const handleReopenTicket = async () => {
    if (!sessionId) return;
    setCurrentSessionStatus('active');
    setPastSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'active' } : s));

    try {
      await supabase.from('support_sessions').update({ status: 'active' }).eq('id', sessionId);
      const sysMsgId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sys-${Date.now()}`;
      await supabase.from('support_messages').insert({
        id: sysMsgId,
        session_id: sessionId,
        sender_type: 'system',
        sender_name: 'System',
        content: `Member reopened ticket #${ticketNumber}.`
      });
    } catch {}
  };

  // Check for any existing sessions for this member
  useEffect(() => {
    let activeChannel: any = null;

    const checkExistingSession = async () => {
      try {
        const uId = user?.id || null;
        const uEmail = user?.email || null;
        if (!uId && !uEmail) return;

        let query = supabase.from('support_sessions').select('*');
        if (uId && uEmail) {
          query = query.or(`user_id.eq.${uId},user_email.eq.${uEmail}`);
        } else if (uId) {
          query = query.eq('user_id', uId);
        } else if (uEmail) {
          query = query.eq('user_email', uEmail);
        }

        const { data: allUserSessions } = await query
          .neq('last_message', 'Session initiated')
          .order('created_at', { ascending: false });

        if (allUserSessions && allUserSessions.length > 0) {
          setPastSessions(allUserSessions);

          // Find active session first; otherwise load the most recent session
          const activeSess = allUserSessions.find(s => s.status === 'active');
          const targetSess = activeSess || allUserSessions[0];

          loadSessionIntoView(targetSess);

          // Realtime websocket listener for live updates
          activeChannel = supabase.channel(`member-session-${targetSess.id}`)
            .on('postgres_changes', {
              event: 'INSERT',
              schema: 'public',
              table: 'support_messages',
              filter: `session_id=eq.${targetSess.id}`
            }, (payload: any) => {
              const m = payload.new;
              if (m.sender_type === 'agent') {
                if (m.content?.startsWith('[INTERNAL NOTE]')) return;
                setMessages(prev => {
                  if (prev.some(e => e.id === m.id)) return prev;
                  return [
                    ...prev,
                    {
                      id: m.id,
                      sender: 'agent',
                      agentName: m.sender_name || 'Sarah Jenkins',
                      agentAvatar: m.sender_avatar,
                      agentRole: 'Senior Member Support Specialist',
                      text: m.content,
                      timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ];
                });
                playNotificationSound();
              }
            })
            .on('postgres_changes', {
              event: 'UPDATE',
              schema: 'public',
              table: 'support_sessions',
              filter: `id=eq.${targetSess.id}`
            }, (payload: any) => {
              const s = payload.new;
              if (s.ticket_number) setTicketNumber(s.ticket_number);
              if (s.status) setCurrentSessionStatus(s.status);
              if (s.assigned_agent_name && s.assigned_agent_name !== 'Unassigned') {
                setAssignedAgentName(s.assigned_agent_name);
              }
              if (s.assigned_agent_avatar) {
                setAssignedAgentAvatar(s.assigned_agent_avatar);
              }
              setPastSessions(prev => prev.map(item => item.id === s.id ? { ...item, ...s } : item));
            })
            .subscribe();
        }
      } catch (err) {
        console.warn('Session check fallback:', err);
      }
    };

    checkExistingSession();

    return () => {
      if (activeChannel) supabase.removeChannel(activeChannel);
    };
  }, [user?.id, user?.email]);

  const submitUserMessage = async (text: string, attachmentObj?: any) => {
    const textToSend = text.trim() || (attachmentObj ? 'Attached file for review' : '');
    if (!textToSend && !attachmentObj) return;

    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: attachmentObj ? {
        name: attachmentObj.name,
        size: attachmentObj.size,
        type: attachmentObj.type,
        url: attachmentObj.preview
      } : undefined
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    setSelectedAttachment(null);

    // Persist to Supabase: Only creates session when user actually sends a message!
    try {
      let activeSessId = sessionId;

      if (!activeSessId) {
        // Sequential ticket number is generated automatically by the Postgres sequence & trigger!
        const { data: created } = await supabase
          .from('support_sessions')
          .insert({
            user_id: user?.id || null,
            user_name: user?.name || 'WIPA Member',
            user_email: user?.email || null,
            user_avatar: user?.avatar_url || null,
            user_tier: user?.membership_tier || 'Verified Member',
            status: 'active',
            priority: 'high',
            category: 'General',
            assigned_agent_name: 'Unassigned',
            last_message: textToSend,
            last_message_at: new Date().toISOString(),
            unread_agent_count: 1
          })
          .select()
          .single();

        if (created) {
          activeSessId = created.id;
          setSessionId(created.id);
          setCurrentSessionStatus('active');
          if (created.ticket_number) setTicketNumber(created.ticket_number);
          setPastSessions(prev => [created, ...prev.filter(s => s.id !== created.id)]);

          // Subscribe to live replies from agent
          supabase.channel(`member-session-${created.id}`)
            .on('postgres_changes', {
              event: 'INSERT',
              schema: 'public',
              table: 'support_messages',
              filter: `session_id=eq.${created.id}`
            }, (payload: any) => {
              const m = payload.new;
              if (m.sender_type === 'agent') {
                if (m.content?.startsWith('[INTERNAL NOTE]')) return;
                setMessages(prev => {
                  if (prev.some(e => e.id === m.id)) return prev;
                  return [
                    ...prev,
                    {
                      id: m.id,
                      sender: 'agent',
                      agentName: m.sender_name || 'Sarah Jenkins',
                      agentAvatar: m.sender_avatar,
                      agentRole: 'Senior Member Support Specialist',
                      text: m.content,
                      timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ];
                });
                playNotificationSound();
              }
            })
            .on('postgres_changes', {
              event: 'UPDATE',
              schema: 'public',
              table: 'support_sessions',
              filter: `id=eq.${created.id}`
            }, (payload: any) => {
              const s = payload.new;
              if (s.ticket_number) setTicketNumber(s.ticket_number);
              if (s.status) setCurrentSessionStatus(s.status);
              if (s.assigned_agent_name && s.assigned_agent_name !== 'Unassigned') {
                setAssignedAgentName(s.assigned_agent_name);
              }
              if (s.assigned_agent_avatar) {
                setAssignedAgentAvatar(s.assigned_agent_avatar);
              }
              setPastSessions(prev => prev.map(item => item.id === s.id ? { ...item, ...s } : item));
            })
            .subscribe();
        }
      } else {
        // Automatically reopen if replying to an archived/resolved session
        setCurrentSessionStatus('active');
        setPastSessions(prev => prev.map(s => s.id === activeSessId ? { ...s, status: 'active', last_message: textToSend } : s));

        await supabase.from('support_sessions').update({
          status: 'active',
          last_message: textToSend,
          last_message_at: new Date().toISOString(),
          unread_agent_count: 1
        }).eq('id', activeSessId);
      }

      if (activeSessId) {
        await supabase.from('support_messages').insert({
          session_id: activeSessId,
          sender_type: 'user',
          sender_name: user?.name || 'WIPA Member',
          sender_avatar: user?.avatar_url,
          sender_id: user?.id,
          content: textToSend,
          attachment_name: attachmentObj?.name,
          attachment_size: attachmentObj?.size,
          attachment_type: attachmentObj?.type
        });
      }
    } catch (err) {
      console.warn('Sync error:', err);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    submitUserMessage(inputMessage, selectedAttachment);
  };

  const handlePromptClick = (text: string) => {
    submitUserMessage(text);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    setSelectedAttachment({
      name: file.name,
      size: sizeFormatted,
      type: isImg ? 'image' : 'file',
      preview: isImg ? URL.createObjectURL(file) : undefined
    });
  };

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketNumber);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  const handleClearChat = () => {
    if (confirm('Start a fresh live support session? Current chat messages will be cleared.')) {
      setMessages([
        {
          id: `msg-${Date.now()}`,
          sender: 'agent',
          agentName: 'Sarah Jenkins',
          agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
          agentRole: 'Senior Member Support Specialist',
          text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! Started a brand new session. How can we help you right now?`,
          timestamp: 'Just now'
        }
      ]);
    }
  };

  const filteredFaqs = FAQ_ITEMS.filter(item => 
    item.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    item.a.toLowerCase().includes(faqSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-77px)] w-full max-w-full bg-slate-50 dark:bg-[#070913] text-slate-900 dark:text-slate-100 overflow-hidden relative font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#5a32fa]/8 dark:bg-[#5a32fa]/15 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#ff90e8]/8 dark:bg-[#a855f7]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* TOP BAR: Support Live Header */}
      <header className="shrink-0 z-20 border-b border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-[#0c1020]/95 backdrop-blur-xl px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-[#5a32fa] via-[#7c3aed] to-[#ff2a5f] p-0.5 shadow-md shadow-purple-500/20">
              <img 
                src={assignedAgentAvatar} 
                alt={assignedAgentName} 
                className="h-full w-full rounded-[14px] object-cover" 
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c1020] animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                WIPA Live Support
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/70 dark:border-emerald-800/50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Agent Active
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
              <span>{assignedAgentName}</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Avg. response &lt; 1 min</span>
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Ticket ID badge */}
          <button
            type="button"
            onClick={handleCopyTicket}
            title="Click to copy support ticket ID"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-purple-400 transition-all cursor-pointer"
          >
            <span className="text-slate-400">Session:</span>
            <span className="text-[#5a32fa] dark:text-purple-300 font-mono">#{ticketNumber}</span>
            {copiedTicket ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-slate-400" />}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute notification sound' : 'Unmute notification sound'}
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          {/* Request Call Back */}
          <button
            type="button"
            onClick={() => setIsCallBackModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#5a32fa] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200/70 dark:border-purple-500/20 transition-all cursor-pointer"
          >
            <Phone size={13} />
            <span>Call Back</span>
          </button>

          {/* Email Transcript */}
          <button
            type="button"
            onClick={() => setIsTranscriptModalOpen(true)}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer"
          >
            <Mail size={13} />
            <span>Transcript</span>
          </button>

          {/* Clear / Reset */}
          <button
            type="button"
            onClick={handleClearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RefreshCw size={16} />
          </button>

          {/* Mobile Hub toggle */}
          <button
            type="button"
            onClick={() => setShowHubMobile(!showHubMobile)}
            className="lg:hidden p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#5a32fa] dark:text-purple-300 border border-purple-200/60 dark:border-purple-500/20 cursor-pointer"
            title="Toggle Help Hub"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA: Split View (Chat on left, Hub on right) */}
      <div className="flex-1 flex w-full h-full min-h-0 overflow-hidden relative">
        
        {/* CHAT SECTION */}
        <section className="flex-1 flex flex-col h-full min-w-0 bg-transparent relative z-10">
          
          {/* Scrollable Messages Stream */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 no-scrollbar">
            
            {/* Live Security Guarantee Banner */}
            <div className="mx-auto max-w-xl text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-2xs backdrop-blur-md">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  End-to-End Encrypted Session • WIPA Member Priority Protocol
                </span>
              </div>
            </div>

            {/* Quick Action Prompt Chips (Always available at top of chat) */}
            <div className="mx-auto max-w-2xl mb-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2 px-1">
                Frequently Asked Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handlePromptClick(item.text)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-[#5a32fa]/60 hover:text-[#5a32fa] dark:hover:border-purple-500/50 dark:hover:text-purple-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group text-left"
                    >
                      <Icon size={13} className="text-slate-400 group-hover:text-[#5a32fa] dark:group-hover:text-purple-300 transition-colors" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Stream */}
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <div 
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    {!isUser ? (
                      <div className="shrink-0 mt-0.5">
                        <img 
                          src={msg.agentAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop'} 
                          alt={msg.agentName || 'Agent'} 
                          className="h-8 w-8 rounded-xl object-cover ring-2 ring-purple-300 dark:ring-purple-900 shadow-xs" 
                        />
                      </div>
                    ) : (
                      <div className="shrink-0 mt-0.5">
                        {user?.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="h-8 w-8 rounded-xl object-cover ring-2 ring-purple-300 dark:ring-purple-900 shadow-xs" />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#5a32fa] to-[#7c3aed] text-white text-xs font-bold shadow-xs">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Body */}
                    <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      {!isUser && (
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {msg.agentName}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {msg.agentRole}
                          </span>
                        </div>
                      )}

                      <div className={`rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                        isUser 
                          ? 'bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] text-white rounded-tr-xs' 
                          : 'bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 rounded-tl-xs'
                      }`}>
                        {/* Text Content */}
                        <div className="whitespace-pre-line">
                          {msg.text}
                        </div>

                        {/* Attachment display */}
                        {msg.attachment && (
                          <div className="mt-2.5 pt-2.5 border-t border-white/20 dark:border-white/10">
                            {msg.attachment.type === 'image' && msg.attachment.url ? (
                              <img 
                                src={msg.attachment.url} 
                                alt={msg.attachment.name} 
                                className="max-h-48 rounded-xl object-cover mb-1 border border-white/20" 
                              />
                            ) : null}
                            <div className="flex items-center gap-2 text-[11px] opacity-90">
                              <Paperclip size={12} />
                              <span className="font-semibold truncate">{msg.attachment.name}</span>
                              <span className="opacity-75">({msg.attachment.size})</span>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons inside Agent messages */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/10 flex flex-wrap gap-2">
                            {msg.actions.map((act, i) => (
                              act.href === '#' ? (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setIsCallBackModalOpen(true)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#5a32fa] text-white hover:bg-[#4b26dc] transition-colors shadow-xs cursor-pointer"
                                >
                                  <Phone size={11} /> {act.label}
                                </button>
                              ) : (
                                <Link
                                  key={i}
                                  href={act.href}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 hover:bg-purple-100 text-[#5a32fa] dark:bg-purple-950/60 dark:hover:bg-purple-900/80 dark:text-purple-300 border border-purple-200/60 dark:border-purple-500/30 transition-all shadow-xs cursor-pointer"
                                >
                                  {act.label}
                                  <ArrowRight size={11} />
                                </Link>
                              )
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Timestamp & Status */}
                      <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        {isUser && <CheckCheck size={13} className="text-[#5a32fa] dark:text-purple-400" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop" 
                    alt="Agent" 
                    className="h-8 w-8 rounded-xl object-cover ring-2 ring-purple-300 dark:ring-purple-900 shrink-0 shadow-xs" 
                  />
                  <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">
                        Sarah is typing
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#5a32fa] animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#5a32fa] animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#5a32fa] animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Form Bar with Resolved/Closed Banner */}
          <div className="shrink-0 p-4 sm:p-6 bg-white/95 dark:bg-[#0c1020]/95 border-t border-slate-200/80 dark:border-white/10 backdrop-blur-xl z-20">
            <div className="max-w-3xl mx-auto">
              
              {/* Resolved Ticket Banner */}
              {(currentSessionStatus === 'resolved' || currentSessionStatus === 'closed') && (
                <div className="mb-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    <div className="text-xs min-w-0">
                      <p className="font-bold text-emerald-900 dark:text-emerald-200">
                        Ticket #{ticketNumber} is Marked Resolved
                      </p>
                      <p className="text-emerald-700/80 dark:text-emerald-300/70 text-[11px] truncate">
                        You are viewing the archived chat history with {assignedAgentName}.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleReopenTicket}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-white dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-all cursor-pointer shadow-2xs"
                    >
                      Reopen Ticket
                    </button>
                    <button
                      type="button"
                      onClick={handleStartNewTicket}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#5a32fa] hover:bg-[#4b26dc] transition-all cursor-pointer shadow-xs"
                    >
                      + New Ticket
                    </button>
                  </div>
                </div>
              )}

              {/* Attachment Preview Chip if selected */}
              {selectedAttachment && (
                <div className="mb-2.5 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-500/30 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip size={13} className="text-[#5a32fa] shrink-0" />
                    <span className="font-semibold truncate">{selectedAttachment.name}</span>
                    <span className="text-slate-400 text-[11px]">({selectedAttachment.size})</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setSelectedAttachment(null)}
                    className="p-1 rounded-lg hover:bg-purple-200/60 dark:hover:bg-purple-900/60 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* Form container */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*,.pdf,.doc,.docx" 
                />

                {/* Attach file button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 text-slate-500 hover:text-[#5a32fa] hover:border-[#5a32fa]/40 hover:bg-purple-50 dark:text-slate-400 dark:hover:text-purple-300 dark:hover:bg-white/5 transition-all cursor-pointer shrink-0"
                  title="Attach screenshot or file"
                >
                  <Paperclip size={18} />
                </button>

                {/* Text input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your question or request assistance here... (Press Enter to send)"
                    className="w-full rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-4 py-2.5 text-xs sm:text-[13px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[#5a32fa] focus:ring-2 focus:ring-[#5a32fa]/20 transition-all"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputMessage.trim() && !selectedAttachment}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-[13px] text-white bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] hover:from-[#4b26dc] hover:to-[#6d28d9] shadow-md shadow-purple-500/25 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <span className="hidden sm:inline">Send</span>
                  <Send size={15} />
                </button>
              </form>

              <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
                <span className="hidden sm:inline">
                  ⚡ Powered by WIPA Intelligent Assistant + Live Human Specialists
                </span>
                <span className="ml-auto">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 font-mono text-[10px]">Enter ↵</kbd>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDEBAR / KNOWLEDGE HUB (Desktop always visible, Mobile overlay toggle) */}
        <aside className={`
          ${showHubMobile ? 'fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#0c1020] p-6' : 'hidden'}
          lg:flex lg:static lg:w-80 xl:w-96 shrink-0 h-full flex-col border-l border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#090d1a]/80 backdrop-blur-xl overflow-y-auto no-scrollbar
        `}>
          {/* Mobile close button */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Support &amp; FAQ Hub</h2>
            <button 
              type="button"
              onClick={() => setShowHubMobile(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-5">
            
            {/* Session Card */}
            <div className="rounded-2xl border border-purple-200/70 dark:border-purple-500/20 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/30 dark:from-purple-950/30 dark:via-slate-900/60 dark:to-indigo-950/20 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Live Session Info
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  currentSessionStatus === 'resolved' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/70 dark:border-emerald-800/50' :
                  currentSessionStatus === 'closed' ? 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' :
                  'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200/70 dark:border-purple-800/50'
                }`}>
                  {currentSessionStatus === 'resolved' ? 'Resolved' : currentSessionStatus === 'closed' ? 'Closed' : currentSessionStatus === 'new' ? 'New' : 'Active'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Ticket ID</span>
                  <span className="font-mono font-bold text-[#5a32fa] dark:text-purple-300">#{ticketNumber}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Member Status</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {user?.membership_tier || 'Verified Member'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Priority Tier</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <Sparkles size={11} /> Pro SLA (Fast)
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-slate-400">Assigned Agent</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{assignedAgentName}</span>
                </div>
              </div>
            </div>

            {/* Support Ticket History Card */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <History size={13} className="text-[#5a32fa] dark:text-purple-400" />
                  <span>Your Tickets ({pastSessions.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={handleStartNewTicket}
                  className="text-[11px] font-bold text-[#5a32fa] dark:text-purple-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>+ New Ticket</span>
                </button>
              </div>

              {pastSessions.length === 0 ? (
                <p className="text-[11px] text-slate-400 py-1">No previous tickets found.</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                  {pastSessions.map((sess) => {
                    const isSelected = sess.id === sessionId;
                    const isResolved = sess.status === 'resolved' || sess.status === 'closed';

                    return (
                      <div
                        key={sess.id}
                        onClick={() => loadSessionIntoView(sess)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-600/50 shadow-xs'
                            : 'bg-slate-50 dark:bg-white/5 border-slate-200/70 dark:border-white/5 hover:border-purple-300/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-bold text-[#5a32fa] dark:text-purple-300">
                            #{sess.ticket_number}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                            isResolved
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60'
                              : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700/60'
                          }`}>
                            {sess.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 mb-1 font-medium">
                          {sess.last_message || 'No message'}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Agent: {sess.assigned_agent_name || 'Sarah Jenkins'}</span>
                          <span>{new Date(sess.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsCallBackModalOpen(true)}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-[#5a32fa]/40 hover:text-[#5a32fa] dark:hover:text-purple-300 transition-all cursor-pointer group shadow-2xs"
              >
                <Phone size={16} className="text-[#5a32fa] dark:text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Request Call</span>
                <span className="text-[9px] text-slate-400">Within 30 mins</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTranscriptModalOpen(true)}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-[#5a32fa]/40 hover:text-[#5a32fa] dark:hover:text-purple-300 transition-all cursor-pointer group shadow-2xs"
              >
                <Mail size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Email Chat</span>
                <span className="text-[9px] text-slate-400">Instant PDF copy</span>
              </button>
            </div>

            {/* Instant Answers / Searchable FAQs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-[#5a32fa]" />
                  Instant Knowledge Base
                </h3>
                <span className="text-[10px] text-slate-400">{filteredFaqs.length} articles</span>
              </div>

              {/* FAQ search */}
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search common questions..."
                className="w-full rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[#5a32fa] transition-all"
              />

              {/* FAQ items */}
              <div className="space-y-2">
                {filteredFaqs.map((faq, index) => {
                  const isExpanded = expandedFaqIndex === index;
                  return (
                    <div 
                      key={index} 
                      className="rounded-xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-slate-900/60 overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                        className="w-full text-left p-3 flex items-start justify-between gap-2 cursor-pointer group hover:bg-purple-50/40 dark:hover:bg-white/5 transition-colors"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#5a32fa] dark:text-purple-400 uppercase tracking-wider">
                            {faq.category}
                          </span>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#5a32fa] dark:group-hover:text-purple-300 transition-colors">
                            {faq.q}
                          </p>
                        </div>
                        <ChevronDown 
                          size={14} 
                          className={`text-slate-400 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180 text-[#5a32fa]' : ''}`} 
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-white/5 pt-2.5 bg-slate-50/50 dark:bg-black/20">
                          <p className="mb-2">{faq.a}</p>
                          <div className="flex items-center justify-between pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                handlePromptClick(faq.q);
                                if (showHubMobile) setShowHubMobile(false);
                              }}
                              className="text-[10px] font-bold text-[#5a32fa] dark:text-purple-300 hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <MessageSquare size={10} /> Ask in chat
                            </button>
                            <Link 
                              href={faq.link}
                              className="text-[10px] font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              Open page <ExternalLink size={10} />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Escalation Channels */}
            <div className="rounded-2xl p-4 bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Alternative Contact Channels
              </h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Mail size={13} className="text-[#5a32fa]" /> Priority Email
                  </span>
                  <a 
                    href="mailto:support@wipa.org" 
                    className="font-bold text-[#5a32fa] dark:text-purple-300 hover:underline"
                  >
                    support@wipa.org
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Phone size={13} className="text-emerald-500" /> Member Hotline
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    +1 (800) 555-WIPA
                  </span>
                </div>
              </div>
            </div>

          </div>
        </aside>
      </div>

      {/* MODAL 1: Request Call Back */}
      {isCallBackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0f1426] border border-slate-200 dark:border-white/10 p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => { setIsCallBackModalOpen(false); setCallBackSuccess(false); }}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {callBackSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Call Back Requested!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Sarah Jenkins will reach out to you at <strong className="text-slate-900 dark:text-white">{callBackForm.phone}</strong> during the requested window: <strong className="text-slate-900 dark:text-white">{callBackForm.timeSlot}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => { setIsCallBackModalOpen(false); setCallBackSuccess(false); }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!callBackForm.phone) return;
                  setCallBackSuccess(true);
                }} 
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#5a32fa] dark:text-purple-300 flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Request Phone Call</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Speak with our senior member support lead</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number (with Country Code)
                  </label>
                  <input
                    type="tel"
                    required
                    value={callBackForm.phone}
                    onChange={(e) => setCallBackForm({ ...callBackForm, phone: e.target.value })}
                    placeholder="+1 (555) 019-2834"
                    className="w-full rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#5a32fa]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Time Window
                  </label>
                  <select
                    value={callBackForm.timeSlot}
                    onChange={(e) => setCallBackForm({ ...callBackForm, timeSlot: e.target.value })}
                    className="w-full rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#5a32fa]"
                  >
                    <option value="Immediately (Next 15 mins)" className="dark:bg-slate-900">Immediately (Next 15 mins)</option>
                    <option value="Morning (9am - 12pm EST)" className="dark:bg-slate-900">Morning (9am - 12pm EST)</option>
                    <option value="Afternoon (1pm - 5pm EST)" className="dark:bg-slate-900">Afternoon (1pm - 5pm EST)</option>
                    <option value="Evening (6pm - 8pm EST)" className="dark:bg-slate-900">Evening (6pm - 8pm EST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Short Brief / Topic (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={callBackForm.note}
                    onChange={(e) => setCallBackForm({ ...callBackForm, note: e.target.value })}
                    placeholder="e.g., Corporate membership upgrade consultation..."
                    className="w-full rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#5a32fa] resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCallBackModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] text-white text-xs font-bold shadow-md hover:from-[#4b26dc] hover:to-[#6d28d9] cursor-pointer"
                  >
                    Confirm Call Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Email Transcript */}
      {isTranscriptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0f1426] border border-slate-200 dark:border-white/10 p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => { setIsTranscriptModalOpen(false); setTranscriptSent(false); }}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {transcriptSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transcript Sent!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  A copy of ticket <strong className="text-slate-900 dark:text-white">#WIP-8942</strong> and this complete chat transcript has been emailed to <strong className="text-slate-900 dark:text-white">{transcriptEmail}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => { setIsTranscriptModalOpen(false); setTranscriptSent(false); }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!transcriptEmail) return;
                  setTranscriptSent(true);
                }} 
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Email Chat Transcript</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Receive a complete record of this conversation</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={transcriptEmail}
                    onChange={(e) => setTranscriptEmail(e.target.value)}
                    placeholder="name@firm.com"
                    className="w-full rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#5a32fa]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Transcript details included:</p>
                  <p>• Full timestamped message log with Sarah Jenkins</p>
                  <p>• Attached file references &amp; action links</p>
                  <p>• Support ticket reference #WIP-8942</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsTranscriptModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] text-white text-xs font-bold shadow-md hover:from-[#4b26dc] hover:to-[#6d28d9] cursor-pointer"
                  >
                    Send Transcript
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
