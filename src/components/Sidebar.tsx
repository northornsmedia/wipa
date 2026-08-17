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
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Crown,
  Building2,
  Plus,
  BrainCircuit,
  Trophy
} from 'lucide-react';
import { ShinyButton } from './ShinyButton';

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);

  const isActive = (path: string) => {
    if (path === '/platform') return pathname === '/platform';
    return pathname.startsWith(path);
  };

  const navLinkClass = (path: string) => {
    return `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[13px] transition-colors ${
      isActive(path) 
        ? 'bg-[#f0ebff] text-[#5a32fa] font-bold' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/5'
    }`;
  };

  const [isOpen, setIsOpen] = useState(true);
  const [unreadChatsCount, setUnreadChatsCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  // Fetch initial unread count and listen for changes
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

    const channel = supabase.channel(`sidebar-messages-${user.id}`)
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

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  if (pathname.startsWith('/platform/messages')) {
    return null;
  }

  return (
    <aside className={`hidden lg:flex flex-col shrink-0 bg-white dark:bg-[#0f172a] sticky top-[73px] h-[calc(100vh-73px)] transition-all duration-300 relative ${isOpen ? 'w-[260px] border-r border-gray-100 dark:border-white/10' : 'w-0 border-r-0'}`}>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 -right-3 w-6 h-6 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/20 rounded-full flex items-center justify-center cursor-pointer z-50 text-gray-400 hover:text-[#5a32fa] transition-all shadow-sm hover:border-[#5a32fa]"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <div className="flex flex-col h-full w-full overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="w-[260px] flex flex-col h-full shrink-0">

      <div className="px-4 mb-8 pt-6">
        <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 px-3 uppercase">MAIN NAVIGATION</p>
        <nav className="space-y-1">
          <Link prefetch={false} href="/platform" className={navLinkClass('/platform')}>
            <LayoutGrid size={18} /> Feed
          </Link>
          <Link prefetch={false} href="/platform/liked-threads" className={navLinkClass('/platform/liked-threads')}>
            <Heart size={18} /> Liked Threads
          </Link>
          <Link prefetch={false} href="/platform/network" className={navLinkClass('/platform/network')}>
            <Globe size={18} /> My Network
          </Link>
          <Link prefetch={false} href="/platform/members" className={navLinkClass('/platform/members')}>
            <Users size={18} /> Members
          </Link>
          <Link prefetch={false} href="/platform/messages" className={`justify-between ${navLinkClass('/platform/messages')}`}>
            <div className="flex items-center gap-3">
              <Mail size={18} /> Messages
            </div>
            {unreadChatsCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-[#5a32fa] text-white text-[10px] font-bold rounded-full">
                {unreadChatsCount}
              </span>
            )}
          </Link>
          <Link prefetch={false} href="/platform/groups" className={navLinkClass('/platform/groups')}>
            <Users size={18} /> Groups
          </Link>
          <Link prefetch={false} href="/platform/forums" className={navLinkClass('/platform/forums')}>
            <MessageCircle size={18} /> Discussion Forums
          </Link>
          <div className="flex flex-col">
            <Link prefetch={false} href="/platform/resources" className={navLinkClass('/platform/resources')}>
              <BookOpen size={18} /> Resource Library
            </Link>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${pathname.startsWith('/platform/resources') ? 'max-h-[400px] opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}>
              <div className="pl-[2.75rem] flex flex-col space-y-1.5 border-l-2 border-gray-100 dark:border-white/5 ml-[1.1rem]">
                <Link prefetch={false} href="/platform/resources/webinars" className={`text-[12px] font-medium transition-colors ${pathname.startsWith('/platform/resources/webinars') ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>Webinars & Learning</Link>
                <Link prefetch={false} href="/platform/resources/education" className={`text-[12px] font-medium transition-colors ${pathname.startsWith('/platform/resources/education') ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>Education & Dev</Link>
                <Link prefetch={false} href="/platform/resources/womens-ip-world" className={`text-[12px] font-medium transition-colors ${pathname.startsWith('/platform/resources/womens-ip-world') ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>Women's IP World</Link>
                <Link prefetch={false} href="/platform/resources/articles-insights" className={`text-[12px] font-medium transition-colors ${pathname.startsWith('/platform/resources/articles-insights') ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>Articles & Insights</Link>
                <Link prefetch={false} href="/platform/resources/ip-news" className={`text-[12px] font-medium transition-colors ${pathname.startsWith('/platform/resources/ip-news') ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>IP News & Legal Updates</Link>
                <Link prefetch={false} href="/platform/resources/research-reports" className={`text-[12px] font-medium transition-colors ${pathname.startsWith('/platform/resources/research-reports') ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>Research & Reports</Link>
                <Link prefetch={false} href="/platform/resources/guides-toolkits" className={`text-[12px] font-medium transition-colors ${pathname.startsWith('/platform/resources/guides-toolkits') ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>Guides & Toolkits</Link>
                <Link prefetch={false} href="/platform/resources/career-leadership" className={`text-[12px] font-medium transition-colors ${pathname.startsWith('/platform/resources/career-leadership') ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>Career & Leadership</Link>
                <Link prefetch={false} href="/platform/resources/in-house-counsel" className={`text-[12px] font-medium transition-colors ${pathname.startsWith('/platform/resources/in-house-counsel') ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>In-House Counsel</Link>
                <Link prefetch={false} href="/platform/resources/podcasts-conversations" className={`text-[12px] font-medium transition-colors ${pathname.startsWith('/platform/resources/podcasts-conversations') ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>Podcasts & Convos</Link>
                <Link prefetch={false} href="/platform/resources/wellness" className={`text-[12px] font-medium transition-colors ${pathname === '/platform/resources/wellness' ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>Wellness & Wellbeing</Link>
                <Link prefetch={false} href="/platform/resources/wellness-v2" className={`text-[12px] font-medium transition-colors ${pathname === '/platform/resources/wellness-v2' ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>Wellness 2.0</Link>
                <Link prefetch={false} href="/platform/resources/ip-services" className={`text-[12px] font-medium transition-colors ${pathname.startsWith('/platform/resources/ip-services') ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>IP Services</Link>
                <Link prefetch={false} href="/platform/resources/ip-firms" className={`text-[12px] font-medium transition-colors ${pathname.startsWith('/platform/resources/ip-firms') ? 'text-[#5a32fa] font-bold' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>IP Firms</Link>
              </div>
            </div>
          </div>
          <Link prefetch={false} href="/platform/events" className={navLinkClass('/platform/events')}>
            <Calendar size={18} /> Events
          </Link>
          <Link prefetch={false} href="/platform/calendar" className={navLinkClass('/platform/calendar')}>
            <Calendar size={18} /> My Calendar
          </Link>
          <Link prefetch={false} href="/platform/jobs" className={navLinkClass('/platform/jobs')}>
            <Briefcase size={18} /> Jobs Board
          </Link>
          <Link prefetch={false} href="/platform/quizzes" className={navLinkClass('/platform/quizzes')}>
            <BrainCircuit size={18} /> Quizzes & XP
          </Link>
          <Link prefetch={false} href="/platform/leaderboard" className={navLinkClass('/platform/leaderboard')}>
            <Trophy size={18} /> Leaderboard
          </Link>
          <Link prefetch={false} href="/platform/mentorship" className={`justify-between ${navLinkClass('/platform/mentorship')}`}>
            <div className="flex items-center gap-3">
              <GraduationCap size={18} /> Mentorship
            </div>
            <span className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d26a] opacity-40"></span>
              <span className="relative px-2 py-0.5 bg-[#00d26a] text-white text-[10px] font-bold rounded-full shadow-sm">NEW</span>
            </span>
          </Link>
          <Link prefetch={false} href="/platform/board-members" className={navLinkClass('/platform/board-members')}>
            <Crown size={18} /> Board Members
          </Link>
        </nav>
      </div>

      <div className="px-4 mb-8">
        <p className="text-[13px] font-bold text-[#131313] dark:text-gray-400 mb-4 px-3">All Channels</p>
        <nav className="space-y-1">
          <Link prefetch={false} href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/5 rounded-xl font-medium text-[13px] transition-colors group">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-gray-400" /> General
            </div>
          </Link>
          <Link prefetch={false} href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/5 rounded-xl font-medium text-[13px] transition-colors group">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-gray-400" /> daily-highlights
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            </div>
          </Link>
          <Link prefetch={false} href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/5 rounded-xl font-medium text-[13px] transition-colors group">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-gray-400" /> time-tracking
            </div>
            <BellOff size={14} className="text-gray-400" />
          </Link>
          <Link prefetch={false} href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between px-3 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-white/5 rounded-xl font-medium text-[13px] transition-colors group">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-gray-400" /> productivity-systems
            </div>
          </Link>
        </nav>
      </div>

      <div className="px-4 mb-8">
        <p className="text-[13px] font-bold text-[#131313] dark:text-gray-400 mb-4 px-3">Links</p>
        <nav className="space-y-1">
          <Link prefetch={false} href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/5 rounded-xl font-medium text-[13px] transition-colors">
            <div className="flex items-center gap-2">
                iOS App
            </div>
            <ArrowUpRight size={14} className="text-gray-400" />
          </Link>
          <Link prefetch={false} href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/5 rounded-xl font-medium text-[13px] transition-colors">
            <div className="flex items-center gap-2">
                Android App
            </div>
            <ArrowUpRight size={14} className="text-gray-400" />
          </Link>
        </nav>
      </div>

      <div className="px-4 mb-8">
        <p className="text-[13px] font-bold text-[#131313] dark:text-gray-400 mb-4 px-3">Business</p>
        <nav className="space-y-1">
          {user?.business_profile_id ? (
            <Link prefetch={false} href="/platform/business" className="flex items-center justify-between px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/5 rounded-xl font-medium text-[13px] transition-colors">
              <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-gray-400" /> My Business
              </div>
            </Link>
          ) : (
            <Link prefetch={false} href="/platform/business/create" className="flex items-center justify-between px-3 py-2 text-[#5a32fa] bg-[#5a32fa]/5 hover:bg-[#5a32fa]/10 rounded-xl font-bold text-[13px] transition-colors">
              <div className="flex items-center gap-2">
                  <Plus size={16} /> Create Business Profile
              </div>
            </Link>
          )}
        </nav>
      </div>


      <div className="mt-auto px-7 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
        </div>
        <div className="space-y-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(ev => (
              <div key={ev.id} className="flex items-start gap-3">
                <Circle size={16} className="text-[#5a32fa] mt-0.5 shrink-0 fill-[#5a32fa]/10" />
                <Link prefetch={false} href="/platform/calendar" className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#5a32fa] dark:hover:text-[#b892ff] font-medium leading-tight line-clamp-2">
                  {ev.title}
                </Link>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400">No upcoming events.</div>
          )}
        </div>
      </div>
      
      <div className="px-5 mb-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#5a32fa]/10 to-[#b892ff]/10 dark:from-[#5a32fa]/20 dark:to-[#b892ff]/20 border border-[#5a32fa]/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Mail size={40} />
          </div>
          <h3 className="text-sm font-bold text-[#5a32fa] dark:text-[#b892ff] mb-1">Need Help?</h3>
          <p className="text-[11px] text-gray-600 dark:text-gray-300 mb-3 leading-relaxed relative z-10">Reach out to the WIPA team for support or inquiries.</p>
          <button className="flex items-center justify-center gap-2 w-full py-2 bg-white dark:bg-[#0f172a] text-[#5a32fa] dark:text-white text-xs font-bold rounded-xl hover:shadow-md transition-all border border-transparent hover:border-[#5a32fa]/20 relative z-10">
            <Mail size={14} /> Contact WIPA
          </button>
        </div>
      </div>
      
        <div className="px-4 py-4 border-t border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user?.name || 'User'} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-white/20" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#131313] text-white flex items-center justify-center text-lg font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </div>

        </div>
      </div>
    </aside>
  );
}
