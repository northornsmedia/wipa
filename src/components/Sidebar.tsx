'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { 
  LayoutGrid, 
  Heart, 
  Users, 
  Mail, 
  MessageCircle, 
  BookOpen, 
  Calendar, 
  FileText, 
  Briefcase, 
  GraduationCap,
  Hash,
  Bell,
  BellOff,
  ArrowUpRight,
  Circle,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Crown,
  Building2,
  Plus,
  BrainCircuit,
  Trophy,
  Sparkles,
  Video,
  Newspaper,
  Compass,
  Mic,
  Activity,
  Headphones,
  Settings,
  HelpCircle,
  ExternalLink,
  Zap,
  MessageSquare
} from 'lucide-react';

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  onOpen: () => void;
};

const RESOURCE_SUBITEMS = [
  { label: 'Webinars & Learning', path: '/platform/resources/webinars', color: 'bg-indigo-500' },
  { label: 'Education & Dev', path: '/platform/resources/education', color: 'bg-blue-500' },
  { label: 'Publications', path: '/publications', color: 'bg-violet-500', isPublication: true },
  { label: 'Articles & Insights', path: '/platform/resources/articles-insights', color: 'bg-cyan-500' },
  { label: 'IP News & Updates', path: '/platform/resources/ip-news', color: 'bg-amber-500' },
  { label: 'Research & Reports', path: '/platform/resources/research-reports', color: 'bg-emerald-500' },
  { label: 'Guides & Toolkits', path: '/platform/resources/guides-toolkits', color: 'bg-teal-500' },
  { label: 'Career & Leadership', path: '/platform/resources/career-leadership', color: 'bg-orange-500' },
  { label: 'In-House Counsel', path: '/platform/resources/in-house-counsel', color: 'bg-purple-500' },
  { label: 'Podcasts & Convos', path: '/platform/resources/podcasts-conversations', color: 'bg-pink-500' },
  { label: 'Wellness & Wellbeing', path: '/platform/resources/wellness', color: 'bg-rose-500' },
  { label: 'IP Services', path: '/platform/resources/ip-services', color: 'bg-sky-500' },
  { label: 'IP Firms', path: '/platform/resources/ip-firms', color: 'bg-blue-600' },
];

export default function Sidebar({ isOpen, onToggle, onOpen }: SidebarProps) {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const isPublicationRoute = [
    '/publications',
    '/womens-ip-world',
    '/global-ip-magazine',
    '/ip-tech-innovation-annual',
  ].some((route) => pathname.startsWith(route));

  const isActive = (path: string) => {
    if (path === '/platform') return pathname === '/platform';
    return pathname.startsWith(path);
  };

  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setActiveTag(params.get('tag')?.toLowerCase() || params.get('hashtag')?.toLowerCase() || null);
    }
  }, [pathname]);
  const [unreadChatsCount, setUnreadChatsCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<{ tag: string; count: number }[]>([
    { tag: 'PatentLaw', count: 18 },
    { tag: 'WomenInIP', count: 15 },
    { tag: 'IPStrategy', count: 12 },
    { tag: 'AILaw', count: 9 },
    { tag: 'Litigation', count: 7 },
  ]);
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(
    () => pathname.startsWith('/platform/resources') || isPublicationRoute
  );

  useEffect(() => {
    if (!user?.id) return;

    const fetchUnreadCount = async () => {
      const { data: unreadData } = await supabase
        .from('messages')
        .select('conversation_id')
        .eq('is_read', false)
        .neq('sender_id', user.id);

      if (unreadData) {
        const uniqueConversations = new Set(unreadData.map((m: any) => m.conversation_id));
        setUnreadChatsCount(uniqueConversations.size);
      }
    };

    const fetchNotificationsCount = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      if (typeof count === 'number') {
        setUnreadNotificationsCount(count);
      }
    };

    const fetchTrendingHashtags = async () => {
      try {
        const { data } = await supabase
          .from('feed_posts')
          .select('content')
          .not('content', 'is', null)
          .limit(100);

        if (data && data.length > 0) {
          const counts: Record<string, number> = {};
          const regex = /#([a-zA-Z0-9_]+)/g;

          data.forEach((p: any) => {
            if (!p.content) return;
            const matches = p.content.match(regex);
            if (matches) {
              const uniqueTagsInPost = new Set(matches.map((t: string) => t.slice(1)));
              uniqueTagsInPost.forEach((tag: any) => {
                const normalized = tag.charAt(0).toUpperCase() + tag.slice(1);
                counts[normalized] = (counts[normalized] || 0) + 1;
              });
            }
          });

          const sorted = Object.entries(counts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          if (sorted.length > 0) {
            setTrendingHashtags(sorted);
          }
        }
      } catch (err) {
        console.error('Failed to fetch trending hashtags:', err);
      }
    };

    fetchUnreadCount();
    fetchNotificationsCount();
    fetchTrendingHashtags();

    const fetchUpcomingEvents = async () => {
      const { data } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_at', new Date().toISOString())
        .order('start_at', { ascending: true })
        .limit(2);
      if (data) setUpcomingEvents(data);
    };
    fetchUpcomingEvents();

    const channelName = `sidebar-messages-${user.id}-${Date.now()}`;
    const channel = supabase.channel(channelName)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const m = payload.new as any;
        if (m.sender_id !== user.id) {
          fetchUnreadCount();
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
        const m = payload.new as any;
        if (m.sender_id !== user.id && m.is_read) {
          fetchUnreadCount();
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotificationsCount();
      })
      .subscribe();

    return () => { 
      supabase.removeChannel(channel); 
    };
  }, [user?.id]);

  if (pathname.startsWith('/platform/messages')) {
    return null;
  }

  const collapsedNavItems = [
    { label: 'Feed', path: '/platform', Icon: LayoutGrid },
    { label: 'Notifications', path: '/platform/notifications', Icon: Bell },
    { label: 'My Network', path: '/platform/network', Icon: Globe },
    { label: 'Members', path: '/platform/members', Icon: Users },
    { label: 'Messages', path: '/platform/messages', Icon: Mail },
    { label: 'Live Support', path: '/platform/chat-support', Icon: Headphones },
    { label: 'Groups', path: '/platform/groups', Icon: Users },
    { label: 'Forums', path: '/platform/forums', Icon: MessageCircle },
    { label: 'Resource Library', path: '/platform/resources', Icon: BookOpen },
    { label: 'IP Intelligence', path: '/platform/intelligence', Icon: Zap },
    { label: 'Events', path: '/platform/events', Icon: Calendar },
    { label: 'Calendar', path: '/platform/calendar', Icon: Calendar },
    { label: 'Jobs', path: '/platform/jobs', Icon: Briefcase },
    { label: 'Quizzes & XP', path: '/platform/quizzes', Icon: BrainCircuit },
    { label: 'Leaderboard', path: '/platform/leaderboard', Icon: Trophy },
    { label: 'Mentorship', path: '/platform/mentorship', Icon: GraduationCap },
    { label: 'Board Members', path: '/platform/board-members', Icon: Crown },
  ];

  const renderNavLink = (path: string, label: string, Icon: any, badge?: React.ReactNode) => {
    const active = isActive(path);
    return (
      <Link 
        prefetch={true} 
        href={path} 
        className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
          active 
            ? 'bg-gradient-to-r from-purple-500/12 via-purple-500/5 to-transparent text-[#5a32fa] dark:from-purple-500/25 dark:via-purple-900/10 dark:to-transparent dark:text-purple-300 font-bold' 
            : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 hover:translate-x-0.5 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
        }`}
      >
        {/* Luminous Active left indicator bar */}
        {active && (
          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-[#5a32fa] to-[#ff79c6] shadow-[0_0_10px_rgba(90,50,250,0.5)]" />
        )}
        
        <div className="flex items-center gap-3 min-w-0">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
            active 
              ? 'bg-gradient-to-br from-[#5a32fa] to-[#7c3aed] text-white shadow-md shadow-purple-500/30' 
              : 'text-slate-400 group-hover:text-[#5a32fa] group-hover:bg-purple-50 dark:text-slate-400 dark:group-hover:text-purple-300 dark:group-hover:bg-white/5'
          }`}>
            <Icon size={17} strokeWidth={active ? 2.3 : 2} />
          </span>
          <span className="truncate tracking-tight">{label}</span>
        </div>

        {badge}
      </Link>
    );
  };

  return (
    <aside 
      style={{ top: 'var(--platform-header-height, 77px)' }}
      className={`fixed bottom-0 left-0 top-[77px] z-30 hidden flex-col border-r border-slate-200/70 bg-white/90 backdrop-blur-2xl transition-all duration-300 dark:border-white/5 dark:bg-[#0c1020]/95 lg:flex ${isOpen ? 'w-[268px]' : 'w-16'}`}
    >
      
      {/* Toggle button */}
      <button 
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-3.5 z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-500 shadow-xs backdrop-blur-md transition-all duration-200 hover:border-[#5a32fa]/40 hover:bg-violet-50 hover:text-[#5a32fa] hover:shadow-md hover:shadow-purple-500/10 active:scale-95 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:border-violet-500/30 dark:hover:bg-violet-950/40 dark:hover:text-violet-300"
        aria-label={isOpen ? 'Collapse sidebar' : 'Open sidebar'}
        aria-expanded={isOpen}
        aria-controls="desktop-sidebar-navigation"
        title={isOpen ? 'Collapse menu' : 'Open menu'}
      >
        {isOpen ? <ChevronLeft size={16} strokeWidth={2.5} /> : <ChevronRight size={16} strokeWidth={2.5} />}
      </button>

      {/* Collapsed view */}
      {!isOpen && (
        <nav className="flex h-full w-16 flex-col items-center gap-2 overflow-y-auto overflow-x-hidden bg-white/50 px-2 pb-5 pt-14 no-scrollbar overscroll-contain dark:bg-transparent" aria-label="Collapsed main navigation">
          {collapsedNavItems.map(({ label, path, Icon }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                type="button"
                onClick={onOpen}
                title={label}
                aria-label={`Open menu to ${label}`}
                className={`group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-br from-[#5a32fa] to-[#7c3aed] text-white shadow-md shadow-purple-500/25'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-[#5a32fa] dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} className="transition-transform group-hover:scale-110" />
                {path === '/platform/messages' && unreadChatsCount > 0 && (
                  <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#ff2a5f] ring-2 ring-white dark:ring-[#0b1120]" />
                )}
                {path === '/platform/notifications' && unreadNotificationsCount > 0 && (
                  <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#ff2a5f] ring-2 ring-white dark:ring-[#0b1120]" />
                )}
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-[#5a32fa] dark:bg-violet-400" />
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Expanded view */}
      <div id="desktop-sidebar-navigation" className={`${isOpen ? 'flex' : 'hidden'} h-full flex-1 w-full flex-col overflow-y-auto overflow-x-hidden no-scrollbar overscroll-contain`}>
        <div className="flex min-h-full w-[268px] shrink-0 flex-col pb-6">

          {/* Section: Main Navigation */}
          <div className="px-3.5 mb-6 pt-5">
            <div className="flex items-center justify-between mb-3 px-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400">
                Main Navigation
              </span>
            </div>
            
            <nav className="space-y-1">
              {renderNavLink('/platform', 'Feed', LayoutGrid)}
              {renderNavLink(
                '/platform/notifications', 
                'Notifications', 
                Bell, 
                unreadNotificationsCount > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff2a5f] px-1.5 text-[10px] font-extrabold text-white shadow-xs">
                    {unreadNotificationsCount}
                  </span>
                ) : null
              )}
              {renderNavLink('/platform/network', 'My Network', Globe)}
              {renderNavLink('/platform/members', 'Members', Users)}
              {renderNavLink(
                '/platform/messages', 
                'Messages', 
                Mail, 
                unreadChatsCount > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] px-1.5 text-[10px] font-extrabold text-white shadow-xs">
                    {unreadChatsCount}
                  </span>
                ) : null
              )}
              {renderNavLink('/platform/groups', 'Groups', Users)}
              {renderNavLink('/platform/forums', 'Discussion Forums', MessageCircle)}

              {/* Resource Library Expandable */}
              <div className="flex flex-col">
                <div className="flex items-center group relative">
                  <Link 
                    prefetch={true} 
                    href="/platform/resources" 
                    className={`group/res relative flex flex-1 items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] transition-all duration-200 pr-10 ${
                      isActive('/platform/resources') || isPublicationRoute
                        ? 'bg-gradient-to-r from-purple-500/12 via-purple-500/5 to-transparent text-[#5a32fa] dark:from-purple-500/25 dark:via-purple-900/10 dark:to-transparent dark:text-purple-300 font-bold' 
                        : 'text-[#5a32fa] dark:text-purple-300 font-bold hover:bg-purple-50/60 hover:translate-x-0.5 dark:hover:bg-purple-950/20'
                    }`}
                  >
                    {(isActive('/platform/resources') || isPublicationRoute) && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-[#5a32fa] to-[#ff79c6] shadow-[0_0_10px_rgba(90,50,250,0.5)]" />
                    )}
                    <div className="flex items-center gap-3">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                        isActive('/platform/resources') || isPublicationRoute
                          ? 'bg-gradient-to-br from-[#5a32fa] to-[#7c3aed] text-white shadow-md shadow-purple-500/30' 
                          : 'text-[#5a32fa] bg-purple-50 group-hover/res:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:group-hover/res:bg-purple-900/40'
                      }`}>
                        <BookOpen size={17} strokeWidth={2.3} />
                      </span>
                      <span className="truncate tracking-tight font-bold text-[#5a32fa] dark:text-purple-300">
                        Resource Library
                      </span>
                    </div>
                  </Link>
                  <button 
                    onClick={(e) => { e.preventDefault(); setIsResourcesExpanded(!isResourcesExpanded); }}
                    className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-[#5a32fa] hover:bg-purple-50 dark:hover:bg-white/5 dark:hover:text-purple-300 transition-colors cursor-pointer"
                    aria-label="Toggle Resource Library Submenu"
                  >
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isResourcesExpanded ? 'rotate-180 text-[#5a32fa] dark:text-violet-300' : ''}`} />
                  </button>
                </div>

                {/* Submenu with refined tree guides */}
                <div className={`overflow-hidden transition-all duration-300 ease-out ${isResourcesExpanded ? 'max-h-[560px] opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}>
                  <div className="ml-5 pl-3 flex flex-col space-y-1 border-l border-purple-200/60 dark:border-white/10">
                    {RESOURCE_SUBITEMS.map((item) => {
                      const isSubActive = item.isPublication 
                        ? isPublicationRoute 
                        : pathname.startsWith(item.path);
                      return (
                        <Link 
                          key={item.path}

                          href={item.path} 
                          className={`group/sub flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-150 ${
                            isSubActive 
                              ? 'bg-purple-50 text-[#5a32fa] font-bold dark:bg-purple-950/40 dark:text-purple-300' 
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full transition-transform group-hover/sub:scale-125 ${
                            isSubActive ? 'bg-[#5a32fa] ring-2 ring-purple-200 dark:bg-purple-400 dark:ring-purple-900' : item.color
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {renderNavLink('/platform/intelligence', 'IP Intelligence Hub', Zap, (
                <span className="rounded-full bg-blue-500/15 border border-blue-500/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  LexisNexis
                </span>
              ))}
              {renderNavLink('/platform/events', 'Events', Calendar)}
              {renderNavLink('/platform/calendar', 'My Calendar', Calendar)}
              {renderNavLink('/platform/jobs', 'Jobs Board', Briefcase)}
              {renderNavLink('/platform/quizzes', 'Quizzes & XP', BrainCircuit)}
              {renderNavLink('/platform/leaderboard', 'Leaderboard', Trophy)}
              {renderNavLink(
                '/platform/mentorship', 
                'Mentorship', 
                GraduationCap,
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  New
                </span>
              )}
              {renderNavLink('/platform/board-members', 'Board Members', Crown)}
            </nav>
          </div>

          {/* Section: Trending Hashtags */}
          <div className="px-3.5 mb-6">
            <div className="flex items-center justify-between mb-3 px-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#5a32fa] dark:text-purple-400" />
                Trending Hashtags
              </span>
            </div>
            <nav className="space-y-1">
              {trendingHashtags.map(({ tag, count }, idx) => {
                const tagPath = `/platform?tag=${encodeURIComponent(tag)}`;
                const isSelected = pathname === '/platform' && activeTag === tag.toLowerCase();

                return (
                  <Link 
                    key={tag} 
                    href={tagPath} 
                    onClick={() => setActiveTag(tag.toLowerCase())} 
                    className={`flex items-center justify-between px-3.5 py-2 text-[12px] font-semibold transition-all rounded-xl group ${
                      isSelected
                        ? 'bg-purple-50 text-[#5a32fa] dark:bg-purple-950/40 dark:text-purple-300 font-bold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-0.5 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Hash size={14} className="text-slate-400 group-hover:text-[#5a32fa] dark:group-hover:text-purple-300 transition-colors shrink-0" />
                      <span className="truncate">#{tag}</span>
                      {idx === 0 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff2a5f] shadow-xs shadow-rose-500/50 shrink-0" title="Top Trending" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
                      {count} {count === 1 ? 'post' : 'posts'}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section: Business Profile Action */}
          <div className="px-3.5 mb-6">
            <div className="flex items-center justify-between mb-3 px-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400">
                Business
              </span>
            </div>
            {user?.business_profile_id ? (
              <Link href="/platform/business" className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[12px] font-semibold text-slate-700 hover:bg-purple-50 dark:text-slate-300 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                  <Building2 size={15} className="text-[#5a32fa]" /> My Business
                </div>
                <ArrowUpRight size={13} className="text-slate-400" />
              </Link>
            ) : (
              <Link href="/platform/business/create" className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[12px] font-bold text-[#5a32fa] bg-purple-50/80 hover:bg-gradient-to-r hover:from-[#5a32fa] hover:to-[#7c3aed] hover:text-white dark:bg-purple-950/40 dark:text-purple-300 dark:hover:text-white transition-all duration-200 shadow-xs border border-purple-200/50 dark:border-purple-500/20">
                <div className="flex items-center gap-2">
                  <Plus size={14} className="transition-transform group-hover:rotate-90" /> Create Business Profile
                </div>
              </Link>
            )}
          </div>

          {/* Section: Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className="px-3.5 mb-6">
              <div className="flex items-center justify-between mb-3 px-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400">
                  Upcoming
                </span>
                <Link href="/platform/calendar" className="text-[10px] font-bold text-[#5a32fa] hover:underline dark:text-purple-300">
                  View all
                </Link>
              </div>
              <div className="space-y-1.5">
                {upcomingEvents.map((ev) => (
                  <Link 
                    key={ev.id} 
                    href="/platform/calendar" 
                    className="flex items-start gap-2.5 rounded-lg p-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5 transition-colors"
                  >
                    <Circle size={8} className="mt-1 shrink-0 fill-[#5a32fa] text-[#5a32fa]" />
                    <span className="line-clamp-1 leading-snug">{ev.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Section: Live Chat Support Card Widget */}
          <div className="px-3.5 mb-5 mt-auto">
            <div className={`relative overflow-hidden rounded-2xl border p-4 shadow-xs transition-all duration-300 ${
              pathname === '/platform/chat-support'
                ? 'border-purple-400/80 bg-gradient-to-br from-purple-100/90 via-purple-50/70 to-white shadow-purple-500/10 ring-2 ring-purple-400/40 dark:border-purple-500/50 dark:from-purple-950/60 dark:via-purple-900/40 dark:to-slate-900/80'
                : 'border-purple-200/70 bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 hover:border-purple-300/80 dark:border-purple-500/20 dark:from-purple-950/40 dark:via-slate-900/60 dark:to-indigo-950/30'
            }`}>
              {/* Background luminous accent */}
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-gradient-to-br from-[#5a32fa]/10 to-[#ff90e8]/15 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between gap-2 mb-1.5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-[#5a32fa] to-[#7c3aed] text-white shadow-xs">
                    <Headphones size={13} />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Live Chat Support</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/70 dark:border-emerald-800/50 shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Online
                </span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400 mb-3 relative z-10">
                Connect instantly with our support team &amp; AI concierge.
              </p>
              <Link 
                href="/platform/chat-support" 
                className={`inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[11px] font-bold shadow-2xs transition-all cursor-pointer group relative z-10 ${
                  pathname === '/platform/chat-support'
                    ? 'bg-gradient-to-r from-[#5a32fa] to-[#7c3aed] text-white shadow-purple-500/25 ring-1 ring-white/20'
                    : 'bg-white border border-slate-200/80 text-slate-800 hover:border-[#5a32fa]/40 hover:text-[#5a32fa] dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-purple-500/30 dark:hover:text-purple-300'
                }`}
              >
                <MessageSquare size={12} className={pathname === '/platform/chat-support' ? 'text-white' : 'text-[#5a32fa] dark:text-purple-400 group-hover:scale-110 transition-transform'} />
                Start Live Chat
              </Link>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="px-3.5 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-1">
            <Link href="/platform/profile" className="group flex-1 flex items-center gap-2.5 p-2 rounded-xl hover:bg-purple-50/60 dark:hover:bg-white/5 transition-colors min-w-0">
              <div className="relative shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user?.name || 'User'} className="h-8 w-8 rounded-full object-cover ring-2 ring-purple-200 dark:ring-purple-900/50" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-black text-[#5a32fa] dark:bg-purple-900/40 dark:text-purple-300">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#00d26a] ring-2 ring-white dark:ring-[#0c1020]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#5a32fa] dark:group-hover:text-purple-300 transition-colors">
                  {user?.name || 'My Profile'}
                </p>
                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-400 truncate">
                  View profile
                </p>
              </div>
            </Link>

            <Link
              href="/platform/settings"
              className="p-2 rounded-xl text-slate-400 hover:text-[#5a32fa] hover:bg-purple-50 dark:hover:bg-white/5 dark:hover:text-purple-300 transition-all shrink-0"
              title="Settings & Preferences"
            >
              <Settings size={16} />
            </Link>
          </div>

        </div>
      </div>
    </aside>
  );
}
