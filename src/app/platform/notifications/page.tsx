'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CheckCheck, 
  CheckCircle2, 
  Eye, 
  Calendar as CalendarIcon, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Trash2, 
  Star, 
  XCircle,
  Bell,
  BellOff,
  BellRing,
  Sliders,
  Settings2,
  Video,
  Mail,
  BookOpen,
  Newspaper,
  Briefcase,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Volume2,
  VolumeX,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------
// Type Definitions
// ----------------------------------------------------
export type NotificationCategory = 
  | 'webinars'
  | 'events'
  | 'dms'
  | 'feed'
  | 'research'
  | 'news'
  | 'network'
  | 'jobs_mentorship';

export interface NotificationPreferences {
  webinars: boolean;
  events: boolean;
  dms: boolean;
  feed: boolean;
  research: boolean;
  news: boolean;
  network: boolean;
  jobs_mentorship: boolean;
  email_digest?: boolean;
  push_alerts?: boolean;
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  webinars: true,
  events: true,
  dms: true,
  feed: true,
  research: true,
  news: true,
  network: true,
  jobs_mentorship: true,
  email_digest: true,
  push_alerts: true,
};

const CATEGORY_CONFIG: Record<NotificationCategory, {
  label: string;
  shortLabel: string;
  description: string;
  icon: any;
  color: string;
  bgLight: string;
  badgeBorder: string;
  textColor: string;
}> = {
  webinars: {
    label: 'Webinars & Masterclasses',
    shortLabel: 'Webinars',
    description: 'Alerts for upcoming live masterclasses, panel discussions, and session replays.',
    icon: Video,
    color: 'bg-purple-600',
    bgLight: 'bg-purple-50 dark:bg-purple-950/30',
    badgeBorder: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-600 dark:text-purple-300'
  },
  events: {
    label: 'Events & Calendar',
    shortLabel: 'Events',
    description: 'Upcoming summit invitations, roundtables, and calendar reminders.',
    icon: CalendarIcon,
    color: 'bg-indigo-600',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/30',
    badgeBorder: 'border-indigo-200 dark:border-indigo-800',
    textColor: 'text-indigo-600 dark:text-indigo-300'
  },
  dms: {
    label: 'Direct Messages & Chats',
    shortLabel: 'Messages',
    description: 'Private 1:1 direct messages, connection replies, and chat notifications.',
    icon: Mail,
    color: 'bg-emerald-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-600 dark:text-emerald-300'
  },
  feed: {
    label: 'Feed & Social Activity',
    shortLabel: 'Feed',
    description: 'Post likes, comments, mentions, and community thread discussions.',
    icon: Heart,
    color: 'bg-rose-500',
    bgLight: 'bg-rose-50 dark:bg-rose-950/30',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    textColor: 'text-rose-600 dark:text-rose-300'
  },
  research: {
    label: 'Research Uploads & Toolkits',
    shortLabel: 'Research',
    description: 'Newly uploaded IP toolkits, whitepapers, guides, and benchmarking reports.',
    icon: BookOpen,
    color: 'bg-cyan-600',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/30',
    badgeBorder: 'border-cyan-200 dark:border-cyan-800',
    textColor: 'text-cyan-600 dark:text-cyan-300'
  },
  news: {
    label: 'IP News & Publications',
    shortLabel: 'News',
    description: 'Breaking global IP law updates, press releases, and magazine issue editions.',
    icon: Newspaper,
    color: 'bg-amber-500',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-600 dark:text-amber-300'
  },
  network: {
    label: 'Network & Connections',
    shortLabel: 'Network',
    description: 'Connection requests, accepted invitations, followers, and badges.',
    icon: UserPlus,
    color: 'bg-blue-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    badgeBorder: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-300'
  },
  jobs_mentorship: {
    label: 'Jobs Board & Mentorship',
    shortLabel: 'Career',
    description: 'New IP job postings, mentorship matching requests, and program status.',
    icon: Briefcase,
    color: 'bg-orange-500',
    bgLight: 'bg-orange-50 dark:bg-orange-950/30',
    badgeBorder: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-600 dark:text-orange-300'
  }
};

// ----------------------------------------------------
// Helper: Map notification to its Category
// ----------------------------------------------------
export function getNotificationCategory(notif: any): NotificationCategory {
  const type = (notif.type || '').toLowerCase();
  const content = (notif.content || '').toLowerCase();

  if (type.includes('webinar') || content.includes('webinar') || content.includes('masterclass')) {
    return 'webinars';
  }
  if (type.includes('event') || type.includes('calendar') || content.includes('event') || content.includes('summit')) {
    return 'events';
  }
  if (
    type.includes('dm') || 
    type.includes('message') || 
    type.includes('chat') || 
    content.includes('direct message') || 
    content.includes('sent you a message')
  ) {
    return 'dms';
  }
  if (
    type.includes('like') || 
    type.includes('comment') || 
    type.includes('feed') || 
    type.includes('mention') || 
    type.includes('group_post') ||
    content.includes('liked') || 
    content.includes('commented') || 
    content.includes('mentioned')
  ) {
    return 'feed';
  }
  if (
    type.includes('research') || 
    type.includes('toolkit') || 
    type.includes('guide') || 
    type.includes('report') || 
    content.includes('research') || 
    content.includes('toolkit') || 
    content.includes('guide') ||
    content.includes('whitepaper')
  ) {
    return 'research';
  }
  if (
    type.includes('news') || 
    type.includes('publication') || 
    type.includes('magazine') || 
    type.includes('article') || 
    content.includes('news') || 
    content.includes('magazine') || 
    content.includes('edition')
  ) {
    return 'news';
  }
  if (
    type.includes('job') || 
    type.includes('mentorship') || 
    content.includes('job') || 
    content.includes('mentor')
  ) {
    return 'jobs_mentorship';
  }
  if (
    type.includes('connection') || 
    type.includes('follow') || 
    type.includes('badge') || 
    content.includes('connection') || 
    content.includes('following')
  ) {
    return 'network';
  }

  return 'network';
}

// ----------------------------------------------------
// Main Notifications Page Component
// ----------------------------------------------------
export default function NotificationsPage() {
  const { user } = useAppStore();
  const router = useRouter();

  // State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | NotificationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [actionProcessingId, setActionProcessingId] = useState<string | null>(null);

  // Notification Preferences State (Persisted in localStorage & Supabase)
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('wipa_notification_preferences');
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse local preferences:', e);
      }
    }
    return DEFAULT_PREFERENCES;
  });

  // Load preferences from Supabase user_metadata if available
  useEffect(() => {
    if (user?.id) {
      supabase.auth.getUser().then(({ data: authData }) => {
        const serverPrefs = authData?.user?.user_metadata?.notification_preferences;
        if (serverPrefs) {
          setPreferences((prev) => {
            const merged = { ...prev, ...serverPrefs };
            try {
              localStorage.setItem('wipa_notification_preferences', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      });
    }
  }, [user?.id]);

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await (supabase as any)
        .from('notifications')
        .select(`
          id,
          type,
          is_read,
          created_at,
          content,
          link,
          actor_id,
          actor:profiles!actor_id(id, full_name, avatar_url, role)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
      } else if (data) {
        setNotifications(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();

    if (user?.id) {
      const channel = supabase
        .channel(`notifications-realtime-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id, fetchNotifications]);

  // Update a single notification preference switch
  const handleTogglePreference = (categoryKey: keyof NotificationPreferences) => {
    const updated = {
      ...preferences,
      [categoryKey]: !preferences[categoryKey]
    };
    setPreferences(updated);
    try {
      localStorage.setItem('wipa_notification_preferences', JSON.stringify(updated));
    } catch (e) {}

    // Synchronize to Supabase user metadata
    if (user?.id) {
      supabase.auth.updateUser({
        data: { notification_preferences: updated }
      }).catch((e) => console.warn('Sync prefs error:', e));
    }
  };

  // Bulk enable / disable all categories
  const handleSetAllPreferences = (enable: boolean) => {
    const updated: NotificationPreferences = {
      webinars: enable,
      events: enable,
      dms: enable,
      feed: enable,
      research: enable,
      news: enable,
      network: enable,
      jobs_mentorship: enable,
      email_digest: enable,
      push_alerts: enable,
    };
    setPreferences(updated);
    try {
      localStorage.setItem('wipa_notification_preferences', JSON.stringify(updated));
    } catch (e) {}

    if (user?.id) {
      supabase.auth.updateUser({
        data: { notification_preferences: updated }
      }).catch((e) => console.warn('Sync prefs error:', e));
    }
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
  };

  // Toggle read status of a single notification
  const handleToggleRead = async (e: React.MouseEvent, id: string, currentRead: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: !currentRead } : n));
    await supabase
      .from('notifications')
      .update({ is_read: !currentRead })
      .eq('id', id);
  };

  // Delete notification
  const handleDeleteNotification = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
  };

  // Handle Accept connection request directly from card
  const handleAcceptConnection = async (e: React.MouseEvent, notif: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?.id || !notif.actor_id) return;

    setActionProcessingId(notif.id);
    try {
      // Find pending connection or create accepted one
      const { data: conn } = await supabase
        .from('connections')
        .select('id')
        .or(`and(requester_id.eq.${notif.actor_id},receiver_id.eq.${user.id}),and(requester_id.eq.${user.id},receiver_id.eq.${notif.actor_id})`)
        .maybeSingle();

      if (conn?.id) {
        await supabase
          .from('connections')
          .update({ status: 'accepted', updated_at: new Date().toISOString() })
          .eq('id', conn.id);
      } else {
        await supabase.from('connections').insert({
          requester_id: notif.actor_id,
          receiver_id: user.id,
          status: 'accepted'
        });
      }

      // Add mutual follow
      await supabase.from('follows').upsert([
        { follower_id: user.id, following_id: notif.actor_id },
        { follower_id: notif.actor_id, following_id: user.id }
      ], { onConflict: 'follower_id,following_id', ignoreDuplicates: true });

      // Mark notification as read and updated content
      await supabase
        .from('notifications')
        .update({ is_read: true, content: 'You accepted this connection request.' })
        .eq('id', notif.id);

      setNotifications(prev => prev.map(n => n.id === notif.id ? { 
        ...n, 
        is_read: true, 
        content: 'You accepted this connection request.' 
      } : n));
    } catch (err) {
      console.error('Accept error:', err);
    } finally {
      setActionProcessingId(null);
    }
  };

  // Handle Ignore connection request
  const handleIgnoreConnection = async (e: React.MouseEvent, notif: any) => {
    e.preventDefault();
    e.stopPropagation();
    setActionProcessingId(notif.id);
    try {
      if (notif.actor_id && user?.id) {
        await supabase
          .from('connections')
          .delete()
          .match({ requester_id: notif.actor_id, receiver_id: user.id });
      }
      await supabase.from('notifications').delete().eq('id', notif.id);
      setNotifications(prev => prev.filter(n => n.id !== notif.id));
    } catch (err) {
      console.error('Ignore error:', err);
    } finally {
      setActionProcessingId(null);
    }
  };

  // Seed sample demo notification for testing every category
  const handleSeedDemoAlert = async (category: NotificationCategory) => {
    if (!user?.id) return;
    const samplePayloads: Record<NotificationCategory, any> = {
      webinars: {
        type: 'webinar_reminder',
        content: 'Mastering Generative AI Patent Prosecution starts in 1 hour! Your seat is reserved.',
        link: '/platform/resources/webinars'
      },
      events: {
        type: 'event_invite',
        content: 'You are invited to the Global Women in IP Annual Summit 2026.',
        link: '/platform/events'
      },
      dms: {
        type: 'dm_message',
        content: 'Nadine Stuttle sent you a direct message regarding IP consulting.',
        link: '/platform/messages'
      },
      feed: {
        type: 'post_comment',
        content: 'commented on your post: "Excited to announce our firm\'s patent victory!"',
        link: '/platform'
      },
      research: {
        type: 'research_upload',
        content: 'New Research Upload: "2026 Global Patent Litigation Benchmarks & Strategy Guide".',
        link: '/platform/resources/research-reports'
      },
      news: {
        type: 'news_alert',
        content: 'Official Publication Alert: The new 2026 Women\'s IP World Edition is now live!',
        link: '/publications'
      },
      network: {
        type: 'connection_request',
        content: 'sent you a connection request to expand their professional network.',
        link: '/platform/network'
      },
      jobs_mentorship: {
        type: 'job_alert',
        content: 'New Job Match: Senior Patent Counsel at Top Intellectual Property Firm.',
        link: '/platform/jobs'
      }
    };

    const payload = samplePayloads[category];
    try {
      const { data, error } = await supabase.from('notifications').insert({
        user_id: user.id,
        actor_id: user.id,
        type: payload.type,
        content: payload.content,
        link: payload.link,
        is_read: false
      }).select().single();

      if (data) {
        setNotifications(prev => [data, ...prev]);
      }
    } catch (err) {
      console.error('Seed demo error:', err);
    }
  };

  // Filter notifications based on preferences AND active filter tab
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      const category = getNotificationCategory(notif);

      // 1. Filter out if the user has toggled this category OFF in preferences
      if (preferences[category] === false) {
        return false;
      }

      // 2. Filter by search query if present
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const contentMatch = (notif.content || '').toLowerCase().includes(query);
        const actor = Array.isArray(notif.actor) ? notif.actor[0] : notif.actor;
        const nameMatch = (actor?.full_name || '').toLowerCase().includes(query);
        if (!contentMatch && !nameMatch) return false;
      }

      // 3. Filter by Active Tab
      if (activeFilter === 'all') return true;
      if (activeFilter === 'unread') return !notif.is_read;
      return category === activeFilter;
    });
  }, [notifications, preferences, activeFilter, searchQuery]);

  // Calculations for Badges & Muted Notice
  const totalUnreadCount = useMemo(() => {
    return notifications.filter((n) => {
      const cat = getNotificationCategory(n);
      return !n.is_read && preferences[cat] !== false;
    }).length;
  }, [notifications, preferences]);

  const mutedCategoriesCount = useMemo(() => {
    const keys: NotificationCategory[] = [
      'webinars', 'events', 'dms', 'feed', 'research', 'news', 'network', 'jobs_mentorship'
    ];
    return keys.filter(k => preferences[k] === false).length;
  }, [preferences]);

  // Tab counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0, unread: 0 };
    notifications.forEach((n) => {
      const cat = getNotificationCategory(n);
      if (preferences[cat] !== false) {
        counts.all = (counts.all || 0) + 1;
        if (!n.is_read) counts.unread = (counts.unread || 0) + 1;
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [notifications, preferences]);

  return (
    <div className="w-full min-h-[calc(100vh-77px)] bg-[#f8f9fa] dark:bg-black md:dark:bg-[#070b14] text-slate-900 dark:text-white font-sans relative overflow-x-hidden pb-20">
      
      {/* Subtle Ambient Background Gradients */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-48 right-10 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">

        {/* ============================================================ */}
        {/* Page Top Header with Title, Badges & Controls */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5a32fa] via-purple-600 to-[#ff79c6] text-white shadow-md shadow-purple-500/25">
                <BellRing size={22} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                  Notifications
                  {totalUnreadCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#5a32fa] to-[#ff2a5f] px-2.5 py-0.5 text-xs font-black text-white shadow-xs">
                      {totalUnreadCount} New
                    </span>
                  )}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time updates for webinars, events, messages, feed, research and news.
                </p>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={totalUnreadCount === 0}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer active:scale-95 ${
                totalUnreadCount > 0
                  ? 'border-purple-200 bg-white text-[#5a32fa] hover:bg-purple-50 hover:border-purple-300 dark:border-purple-500/30 dark:bg-[#121829] dark:text-purple-300 dark:hover:bg-purple-950/40 shadow-xs'
                  : 'border-slate-200/60 bg-slate-100/50 text-slate-400 dark:border-white/5 dark:bg-white/5 dark:text-slate-500 cursor-not-allowed'
              }`}
              title="Mark all notifications as read"
            >
              <CheckCheck size={15} />
              <span>Mark all read</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border border-slate-200/80 bg-white text-slate-700 hover:text-[#5a32fa] hover:border-purple-300 hover:bg-purple-50/50 dark:border-white/10 dark:bg-[#121829] dark:text-slate-200 dark:hover:text-purple-300 dark:hover:border-purple-500/40 shadow-xs cursor-pointer active:scale-95"
              title="Configure notification types"
            >
              <Sliders size={15} className="text-[#5a32fa] dark:text-purple-400" />
              <span>Preferences</span>
              {mutedCategoriesCount > 0 && (
                <span className="ml-1 h-2 w-2 rounded-full bg-amber-500" title={`${mutedCategoriesCount} muted`} />
              )}
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Banner: If any notification categories are muted */}
        {/* ============================================================ */}
        {mutedCategoriesCount > 0 && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs font-semibold text-amber-900 shadow-xs dark:border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-300">
            <div className="flex items-center gap-2 min-w-0">
              <BellOff size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate">
                <strong>{mutedCategoriesCount} category {mutedCategoriesCount === 1 ? 'is' : 'categories are'} turned OFF</strong> in your notification preferences. You will not receive alerts for muted items.
              </span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="shrink-0 text-xs font-bold underline hover:text-amber-700 dark:hover:text-amber-200 cursor-pointer"
            >
              Manage
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* Category Filter Tabs with count indicators */}
        {/* ============================================================ */}
        <div className="mb-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {/* Filter: All */}
          <button
            onClick={() => setActiveFilter('all')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] text-white shadow-md shadow-purple-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-[#121829] dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/70 dark:border-white/10'
            }`}
          >
            <Layers size={14} />
            <span>All</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
            }`}>
              {categoryCounts.all || 0}
            </span>
          </button>

          {/* Filter: Unread */}
          <button
            onClick={() => setActiveFilter('unread')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeFilter === 'unread'
                ? 'bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] text-white shadow-md shadow-purple-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-[#121829] dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/70 dark:border-white/10'
            }`}
          >
            <BellRing size={14} className={categoryCounts.unread ? 'text-[#ff2a5f]' : ''} />
            <span>Unread</span>
            {categoryCounts.unread > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#ff2a5f] text-white shadow-xs">
                {categoryCounts.unread}
              </span>
            )}
          </button>

          {/* Individual Category Filter Tabs */}
          {(Object.keys(CATEGORY_CONFIG) as NotificationCategory[]).map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const Icon = config.icon;
            const count = categoryCounts[cat] || 0;
            const isMuted = preferences[cat] === false;

            if (isMuted) return null; // Don't show tab if category is muted

            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] text-white shadow-md shadow-purple-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-[#121829] dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/70 dark:border-white/10'
                }`}
              >
                <Icon size={14} className={activeFilter === cat ? 'text-white' : config.textColor} />
                <span>{config.shortLabel}</span>
                {count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    activeFilter === cat ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* Search Bar within Notifications */}
        {/* ============================================================ */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications by member name, event, topic, or keyword..."
            className="w-full rounded-2xl border border-slate-200/80 bg-white pl-10 pr-10 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 shadow-xs focus:border-[#5a32fa] focus:outline-hidden focus:ring-2 focus:ring-[#5a32fa]/15 dark:border-white/10 dark:bg-[#0c1020] dark:text-white dark:placeholder-slate-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ============================================================ */}
        {/* Notifications List */}
        {/* ============================================================ */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/70 dark:border-white/10 shadow-xs">
              <RefreshCw size={28} className="animate-spin text-[#5a32fa] mb-3" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Loading your updates...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/70 dark:border-white/10 shadow-xs text-center">
              <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center text-[#5a32fa] dark:text-purple-300 shadow-inner mb-4">
                <BellOff size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {searchQuery 
                  ? 'No notifications matching your search'
                  : activeFilter === 'unread' 
                    ? 'All caught up!' 
                    : `No notifications in ${activeFilter === 'all' ? 'your inbox' : CATEGORY_CONFIG[activeFilter as NotificationCategory]?.label || activeFilter}`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mt-1 mb-6">
                {activeFilter === 'unread' 
                  ? 'You have read all notifications. New updates regarding events, webinars, and network activity will appear here.'
                  : 'Customize your notification preferences or browse the platform to explore new events, masterclasses, and members.'}
              </p>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5a32fa] bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors"
                >
                  Configure Preferences
                </button>
                <Link
                  href="/platform/events"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#5a32fa] hover:bg-purple-700 shadow-md shadow-purple-500/25 transition-colors"
                >
                  Explore Upcoming Events
                </Link>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif: any) => {
              const category = getNotificationCategory(notif);
              const config = CATEGORY_CONFIG[category];
              const CategoryIcon = config.icon;
              const actor = Array.isArray(notif.actor) ? notif.actor[0] : notif.actor;
              const name = actor?.full_name || 'Alliance Member';
              const initial = name.charAt(0).toUpperCase();
              const isConnectionRequest = notif.type === 'connection_request';

              // Relative time
              let timeFormatted = 'Recently';
              try {
                timeFormatted = formatDistanceToNow(new Date(notif.created_at), { addSuffix: true });
              } catch (e) {
                timeFormatted = new Date(notif.created_at).toLocaleDateString();
              }

              return (
                <div
                  key={notif.id}
                  className={`group relative rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    notif.is_read
                      ? 'bg-white/90 dark:bg-[#0c1020]/90 border-slate-200/70 dark:border-white/5 hover:border-purple-200 dark:hover:border-white/10 hover:shadow-xs'
                      : 'bg-gradient-to-r from-purple-500/8 via-white to-white dark:from-purple-950/20 dark:via-[#0c1020] dark:to-[#0c1020] border-purple-300/80 dark:border-purple-500/30 shadow-xs'
                  }`}
                >
                  {/* Unread Glow Indicator Left Edge */}
                  {!notif.is_read && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b from-[#5a32fa] to-[#ff79c6]" />
                  )}

                  {/* Left Side: Avatar + Details */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Actor Avatar with Category Icon Badge */}
                    <div className="relative shrink-0 mt-0.5">
                      {actor?.avatar_url ? (
                        <img
                          src={actor.avatar_url}
                          alt={name}
                          className="h-11 w-11 rounded-2xl object-cover border border-slate-200/80 dark:border-white/10 shadow-xs"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#5a32fa] to-purple-800 text-white font-black text-sm flex items-center justify-center shadow-xs">
                          {initial}
                        </div>
                      )}
                      {/* Micro Category Icon Badge */}
                      <div className={`absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-xl ${config.color} text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-[#0c1020]`}>
                        <CategoryIcon size={12} strokeWidth={2.6} />
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {/* Category Badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${config.bgLight} ${config.badgeBorder} ${config.textColor}`}>
                          <CategoryIcon size={10} strokeWidth={2.4} />
                          {config.shortLabel}
                        </span>

                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Clock size={11} />
                          {timeFormatted}
                        </span>

                        {!notif.is_read && (
                          <span className="h-2 w-2 rounded-full bg-[#ff2a5f] shadow-xs shadow-rose-500/50" title="Unread" />
                        )}
                      </div>

                      {/* Notification Message */}
                      <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed">
                        <strong className="text-slate-900 dark:text-white font-bold">{name}</strong>{' '}
                        {notif.content || 'interacted with your profile.'}
                      </p>

                      {/* Inline Interactive Actions for Connections */}
                      {isConnectionRequest && (
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleAcceptConnection(e, notif)}
                            disabled={actionProcessingId === notif.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xs active:scale-95 transition-all cursor-pointer"
                          >
                            <Check size={13} strokeWidth={3} />
                            <span>{actionProcessingId === notif.id ? 'Connecting...' : 'Accept Connection'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleIgnoreConnection(e, notif)}
                            disabled={actionProcessingId === notif.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
                          >
                            <X size={13} />
                            <span>Ignore</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Action Link & Utility Menu */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* View / Navigate Action Button */}
                    {notif.link && !isConnectionRequest && (
                      <Link
                        href={notif.link}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#5a32fa] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200/70 dark:border-purple-800/40 transition-all active:scale-95"
                      >
                        <span>View</span>
                        <ArrowRight size={12} />
                      </Link>
                    )}

                    {/* Toggle Read */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleRead(e, notif.id, notif.is_read)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-[#5a32fa] hover:bg-purple-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      title={notif.is_read ? 'Mark as unread' : 'Mark as read'}
                    >
                      <CheckCheck size={16} className={notif.is_read ? 'opacity-40' : 'text-[#5a32fa]'} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteNotification(e, notif.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* ============================================================ */}
      {/* NOTIFICATION PREFERENCES MODAL / FLYOUT */}
      {/* ============================================================ */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#0c1020] border border-slate-200/90 dark:border-white/10 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5a32fa] to-[#ff79c6] text-white shadow-md shadow-purple-500/25">
                  <Sliders size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    Notification Preferences
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Turn ON or OFF notifications for any category across WIPA.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body - Toggle List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 no-scrollbar">
              
              {/* Quick Actions Row */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Categories ({Object.keys(CATEGORY_CONFIG).length})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSetAllPreferences(true)}
                    className="text-xs font-bold text-[#5a32fa] dark:text-purple-300 hover:underline cursor-pointer"
                  >
                    Enable All
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <button
                    onClick={() => handleSetAllPreferences(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:underline cursor-pointer"
                  >
                    Mute All
                  </button>
                </div>
              </div>

              {/* 8 Category Preference Toggles */}
              {(Object.keys(CATEGORY_CONFIG) as NotificationCategory[]).map((key) => {
                const config = CATEGORY_CONFIG[key];
                const Icon = config.icon;
                const isEnabled = preferences[key] !== false;

                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                      isEnabled
                        ? 'bg-white dark:bg-[#121829] border-slate-200/80 dark:border-white/10 shadow-2xs'
                        : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200/40 dark:border-white/5 opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 pr-3">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${config.color} text-white shadow-xs`}>
                        <Icon size={16} strokeWidth={2.4} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {config.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isEnabled}
                      onClick={() => handleTogglePreference(key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        isEnabled ? 'bg-[#5a32fa]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}

              {/* Sample Notification Trigger for Testing */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Test Category Alerts
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  Click any pill below to simulate a real notification and verify your toggle filtering:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(CATEGORY_CONFIG) as NotificationCategory[]).map((cat) => {
                    const cfg = CATEGORY_CONFIG[cat];
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleSeedDemoAlert(cat)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-white/5 hover:bg-purple-100 hover:text-[#5a32fa] dark:hover:bg-purple-950/40 dark:hover:text-purple-300 border border-slate-200/60 dark:border-white/10 transition-colors cursor-pointer"
                      >
                        + Test {cfg.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
              <span className="text-[11px] font-medium text-slate-400">
                Preferences auto-save immediately.
              </span>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] hover:from-purple-600 hover:to-indigo-600 shadow-md shadow-purple-500/25 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
