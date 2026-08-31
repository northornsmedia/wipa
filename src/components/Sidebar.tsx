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
  ExternalLink
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

  const [unreadChatsCount, setUnreadChatsCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
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

    fetchUnreadCount();

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
    { label: 'Liked Threads', path: '/platform/liked-threads', Icon: Heart },
    { label: 'My Network', path: '/platform/network', Icon: Globe },
    { label: 'Members', path: '/platform/members', Icon: Users },
    { label: 'Messages', path: '/platform/messages', Icon: Mail },
    { label: 'Groups', path: '/platform/groups', Icon: Users },
    { label: 'Forums', path: '/platform/forums', Icon: MessageCircle },
    { label: 'Resource Library', path: '/platform/resources', Icon: BookOpen },
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
        prefetch={false} 
        href={path} 
        className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
          active 
            ? 'bg-gradient-to-r from-purple-500/12 via-purple-500/5 to-transparent text-[#5a32fa] dark:from-purple-500/25 dark:via-purple-900/10 dark:to-transparent dark:text-purple-300 font-bold' 
            : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 hover:translate-x-0.5 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
        }`}
      >
        {/* Luminous Active left indicator bar */}
        {active && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-[#5a32fa] to-[#ff79c6] shadow-[0_0_10px_rgba(90,50,250,0.5)]" />
        )}
        
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
            active 
              ? 'bg-gradient-to-br from-[#5a32fa] to-[#7c3aed] text-white shadow-md shadow-purple-500/30' 
              : 'text-slate-400 group-hover:text-[#5a32fa] group-hover:bg-purple-50 dark:text-slate-400 dark:group-hover:text-purple-300 dark:group-hover:bg-white/5'
          }`}>
            <Icon size={16} strokeWidth={active ? 2.3 : 2} />
          </span>
          <span className="truncate tracking-tight">{label}</span>
        </div>

        {badge}
      </Link>
    );
  };

  return (
    <aside className={`fixed bottom-0 left-0 top-[var(--platform-header-height)] z-30 hidden flex-col border-r border-slate-200/70 bg-white/90 backdrop-blur-2xl transition-all duration-300 dark:border-white/5 dark:bg-[#0c1020]/95 lg:flex ${isOpen ? 'w-[268px]' : 'w-16'}`}>
      
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
        <nav className="flex h-full w-16 flex-col items-center gap-1.5 overflow-y-auto overflow-x-hidden bg-white/50 px-2 pb-5 pt-14 no-scrollbar overscroll-contain dark:bg-transparent" aria-label="Collapsed main navigation">
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
          <div className="px-3.5 mb-5 pt-5">
            <div className="flex items-center justify-between mb-2 px-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400">
                Main Navigation
              </span>
            </div>
            
            <nav className="space-y-0.5">
              {renderNavLink('/platform', 'Feed', LayoutGrid)}
              {renderNavLink('/platform/liked-threads', 'Liked Threads', Heart)}
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
                    prefetch={false} 
                    href="/platform/resources" 
                    className={`group/res relative flex flex-1 items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 pr-10 ${
                      isActive('/platform/resources') || isPublicationRoute
                        ? 'bg-gradient-to-r from-purple-500/12 via-purple-500/5 to-transparent text-[#5a32fa] dark:from-purple-500/25 dark:via-purple-900/10 dark:to-transparent dark:text-purple-300 font-bold' 
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 hover:translate-x-0.5 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
                  >
                    {(isActive('/platform/resources') || isPublicationRoute) && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-[#5a32fa] to-[#ff79c6] shadow-[0_0_10px_rgba(90,50,250,0.5)]" />
                    )}
                    <div className="flex items-center gap-2.5">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                        isActive('/platform/resources') || isPublicationRoute
                          ? 'bg-gradient-to-br from-[#5a32fa] to-[#7c3aed] text-white shadow-md shadow-purple-500/30' 
                          : 'text-slate-400 group-hover/res:text-[#5a32fa] group-hover/res:bg-purple-50 dark:text-slate-400 dark:group-hover/res:text-purple-300 dark:group-hover/res:bg-white/5'
                      }`}>
                        <BookOpen size={16} strokeWidth={2.3} />
                      </span>
                      <span className="truncate tracking-tight">Resource Library</span>
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
                <div className={`overflow-hidden transition-all duration-300 ease-out ${isResourcesExpanded ? 'max-h-[560px] opacity-100 mt-1 mb-1.5' : 'max-h-0 opacity-0'}`}>
                  <div className="ml-5 pl-3 flex flex-col space-y-0.5 border-l border-purple-200/60 dark:border-white/10">
                    {RESOURCE_SUBITEMS.map((item) => {
                      const isSubActive = item.isPublication 
                        ? isPublicationRoute 
                        : pathname.startsWith(item.path);
                      return (
                        <Link 
                          key={item.path}
                          prefetch={false} 
                          href={item.path} 
                          className={`group/sub flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 ${
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

          {/* Section: Channels */}
          <div className="px-3.5 mb-5">
            <div className="flex items-center justify-between mb-2 px-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400">
                Channels
              </span>
            </div>
            <nav className="space-y-0.5">
              <Link prefetch={false} href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between px-3 py-1.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-0.5 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white rounded-xl font-medium text-[12px] transition-all group">
                <div className="flex items-center gap-2">
                  <Hash size={14} className="text-slate-400 group-hover:text-[#5a32fa] dark:group-hover:text-purple-300 transition-colors" /> General
                </div>
              </Link>
              <Link prefetch={false} href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between px-3 py-1.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-0.5 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white rounded-xl font-medium text-[12px] transition-all group">
                <div className="flex items-center gap-2">
                  <Hash size={14} className="text-slate-400 group-hover:text-[#5a32fa] dark:group-hover:text-purple-300 transition-colors" /> daily-highlights
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff2a5f] shadow-xs shadow-rose-500/50" />
                </div>
              </Link>
              <Link prefetch={false} href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between px-3 py-1.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-0.5 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white rounded-xl font-medium text-[12px] transition-all group">
                <div className="flex items-center gap-2">
                  <Hash size={14} className="text-slate-400 group-hover:text-[#5a32fa] dark:group-hover:text-purple-300 transition-colors" /> time-tracking
                </div>
                <BellOff size={13} className="text-slate-400" />
              </Link>
            </nav>
          </div>

          {/* Section: Business Profile Action */}
          <div className="px-3.5 mb-5">
            <div className="flex items-center justify-between mb-2 px-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400">
                Business
              </span>
            </div>
            {user?.business_profile_id ? (
              <Link prefetch={false} href="/platform/business" className="flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-700 hover:bg-purple-50 dark:text-slate-300 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                  <Building2 size={15} className="text-[#5a32fa]" /> My Business
                </div>
                <ArrowUpRight size={13} className="text-slate-400" />
              </Link>
            ) : (
              <Link prefetch={false} href="/platform/business/create" className="group flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold text-[#5a32fa] bg-purple-50/80 hover:bg-gradient-to-r hover:from-[#5a32fa] hover:to-[#7c3aed] hover:text-white dark:bg-purple-950/40 dark:text-purple-300 dark:hover:text-white transition-all duration-200 shadow-xs border border-purple-200/50 dark:border-purple-500/20">
                <div className="flex items-center gap-2">
                  <Plus size={14} className="transition-transform group-hover:rotate-90" /> Create Business Profile
                </div>
              </Link>
            )}
          </div>

          {/* Section: Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className="px-3.5 mb-5">
              <div className="flex items-center justify-between mb-2 px-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400">
                  Upcoming
                </span>
                <Link href="/platform/calendar" className="text-[10px] font-bold text-[#5a32fa] hover:underline dark:text-purple-300">
                  View all
                </Link>
              </div>
              <div className="space-y-1">
                {upcomingEvents.map((ev) => (
                  <Link 
                    key={ev.id} 
                    prefetch={false} 
                    href="/platform/calendar" 
                    className="flex items-start gap-2 rounded-lg p-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5 transition-colors"
                  >
                    <Circle size={8} className="mt-1 shrink-0 fill-[#5a32fa] text-[#5a32fa]" />
                    <span className="line-clamp-1 leading-snug">{ev.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Section: Help Card Widget */}
          <div className="px-3.5 mb-4 mt-auto">
            <div className="relative overflow-hidden rounded-2xl border border-purple-200/70 bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 p-3.5 shadow-xs dark:border-purple-500/20 dark:from-purple-950/40 dark:via-slate-900/60 dark:to-indigo-950/30">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-[#5a32fa] to-[#7c3aed] text-white shadow-xs">
                  <HelpCircle size={13} />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Need Help?</span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400 mb-2.5">
                Reach out to the WIPA team for assistance.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl bg-white border border-slate-200/80 text-[11px] font-bold text-slate-800 shadow-2xs hover:border-[#5a32fa]/40 hover:text-[#5a32fa] transition-all dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-purple-500/30 dark:hover:text-purple-300 cursor-pointer"
              >
                <Mail size={12} /> Contact WIPA
              </Link>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="px-3.5 pt-3 border-t border-slate-100 dark:border-white/10">
            <Link href="/platform/profile" className="group flex items-center justify-between p-2 rounded-xl hover:bg-purple-50/60 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
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
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#5a32fa] dark:group-hover:text-purple-300 transition-colors">
                    {user?.name || 'My Profile'}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-400 truncate">
                    View profile
                  </p>
                </div>
              </div>
              <ArrowUpRight size={14} className="text-slate-400 group-hover:text-[#5a32fa] dark:group-hover:text-purple-300 transition-colors shrink-0" />
            </Link>
          </div>

        </div>
      </div>
    </aside>
  );
}
