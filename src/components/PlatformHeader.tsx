// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Home, UsersRound, Globe, Briefcase, Calendar, Star, Bell, X, BookOpen, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { searchProfiles } from '@/app/actions/profiles';
import LexIQChatCard from './LexIQChatCard';
import SiriWave from '@/components/ui/siri-wave';
import { LogOut } from 'lucide-react';
import AdSlot from '@/components/AdSlot';

const SiriWaveIcon = (props: any) => (
  <SiriWave variant="wave" size={props.size || 48} className={props.className} />
);

const navItems = [
  { name: 'Home', icon: Home, path: '/platform' },
  { name: 'My Network', icon: Globe, path: '/platform/network' },
  { name: 'Groups', icon: UsersRound, path: '/platform/groups' },
  { name: 'Ask LexIQ', icon: SiriWaveIcon, path: '#lexiq', special: true },
  { name: 'Events', icon: Calendar, path: '/platform/events' },
  { name: 'Resources', icon: BookOpen, path: '/platform/resources' },
  { name: 'Jobs', icon: Briefcase, path: '/platform/jobs' },
];

const mockSearchData = [
  { type: 'Event', title: 'Women in AI & IP Leadership Summit', icon: Calendar, path: '/platform/events' },
  { type: 'Event', title: 'Global Trademark Trends 2025', icon: Calendar, path: '/platform/events' },
  { type: 'Job', title: 'Senior Patent Attorney', icon: Briefcase, path: '/platform/jobs' },
  { type: 'Job', title: 'IP Counsel - Startups', icon: Briefcase, path: '/platform/jobs' },
];

export default function PlatformHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbResults, setDbResults] = useState<any[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const isLexIQOpen = useAppStore((state) => state.isLexIQOpen);
  const setIsLexIQOpen = useAppStore((state) => state.setIsLexIQOpen);
  const [flyingBox, setFlyingBox] = useState<DOMRect | null>(null);
  const lexiqRef = useRef<HTMLDivElement>(null);
  const lastLogoClickRef = useRef<number>(0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    useAppStore.getState().setUser(null);
    router.push('/login');
  };

  const handleLexIQClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLexIQOpen) {
      setIsLexIQOpen(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setFlyingBox(rect);
    setTimeout(() => {
      setFlyingBox(null);
      setIsLexIQOpen(true);
    }, 550);
  };

  // Intercept LexIQ-generated anchor clicks and use Next.js router (keeps LexIQ open)
  useEffect(() => {
    const container = lexiqRef.current;
    if (!container) return;
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href && target.href.startsWith(window.location.origin)) {
        e.preventDefault();
        router.push(target.getAttribute('href')!);
      }
    };
    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [isLexIQOpen, router]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setDbResults([]);
      return;
    }

    const fetchDbResults = async () => {
      try {
        const data = await searchProfiles(searchQuery);
        setDbResults(data.map((profile: any) => ({
          type: 'Person',
          title: profile.full_name,
          subtitle: profile.role || 'WIPA Member',
          icon: UsersRound,
          path: `/platform/profile/${profile.id}`
        })));
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const delay = setTimeout(fetchDbResults, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const [toastNotification, setToastNotification] = useState<{message: string, visible: boolean} | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchNotifications = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
        
      setUnreadNotificationsCount(count || 0);
    };
    
    fetchNotifications();
    
    const subscription = supabase
      .channel('notifications_header')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications', 
        filter: `user_id=eq.${user.id}` 
      }, async (payload) => {
        fetchNotifications();
        
        if (payload.eventType === 'INSERT') {
          const newNotif = payload.new as any;
          if (newNotif.actor_id) {
            const { data } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', newNotif.actor_id)
              .single();
              
            if (data) {
              const name = data.full_name || 'Someone';
              let message = `${name} interacted with your profile.`;
              if (newNotif.type === 'connection_request') message = `${name} sent you a connection request.`;
              if (newNotif.type === 'connection_accepted') message = `${name} accepted your connection request.`;
              
              setToastNotification({ message, visible: true });
              setTimeout(() => {
                setToastNotification(prev => prev ? { ...prev, visible: false } : null);
              }, 4000);
            }
          }
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);
  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleResultClick = (path: string) => {
    router.push(path);
    handleCloseSearch();
  };

  const filteredMock = mockSearchData.filter(result => 
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    result.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredResults = [...dbResults, ...filteredMock];

  return (
    <>
      <header className="hidden md:flex items-center justify-between px-4 sm:px-6 py-3 md:py-4 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#0f172a] sticky top-0 z-50 min-h-[73px]">
        {isSearchOpen ? (
          <div className="flex items-center w-full gap-4 max-w-4xl mx-auto animate-in fade-in duration-200">
            <Search size={20} className="text-gray-400 flex-shrink-0" />
            <input 
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, jobs, events..."
              className="flex-1 bg-gray-50 dark:bg-white/5 rounded-full py-2.5 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/20 focus:bg-white dark:bg-[#0f172a] border border-transparent focus:border-[#5a32fa] transition-all text-gray-900 dark:text-white"
            />
            <button 
              onClick={handleCloseSearch}
              className="p-2 text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-white/5 rounded-full transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Link 
                prefetch={false} 
                href="/platform"
                onClick={(e) => {
                  const now = Date.now();
                  if (now - lastLogoClickRef.current < 450) {
                    e.preventDefault();
                    toggleDarkMode();
                    lastLogoClickRef.current = 0;
                  } else {
                    lastLogoClickRef.current = now;
                  }
                }}
                title="Double click to toggle Light / Dark mode"
                className="select-none cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/WIPA-Logo.png" 
                  alt="WIPA Logo" 
                  className="h-10 max-h-10 w-auto max-w-[140px] object-contain shrink-0" 
                  style={{ height: '40px', width: 'auto' }}
                />
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center gap-1 bg-white/60 dark:bg-[#020617]/40 backdrop-blur-xl rounded-2xl px-2 py-2 border border-gray-200/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
              {navItems.map((item) => {
                const isActive = item.path === '/platform' ? pathname === '/platform' : (item.path.startsWith('/') && pathname.startsWith(item.path));
                const Icon = item.icon;
                
                if (item.special) {
                  return (
                    <button 
                      key={item.name} 
                      onClick={handleLexIQClick}
                      className={`group relative flex flex-col items-center justify-center h-[52px] rounded-xl transition-all duration-500 ease-out overflow-hidden text-gray-500 dark:text-gray-400 hover:text-[#ff90e8] ${
                        flyingBox || isLexIQOpen ? "opacity-0 pointer-events-none w-0 mx-0" : "opacity-100 w-[72px] mx-1"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#5a32fa]/10 to-[#ff90e8]/10 dark:from-[#5a32fa]/20 dark:to-[#ff90e8]/20 rounded-xl opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out border border-[#ff90e8]/20" />
                      
                      <Icon 
                        size={20} 
                        strokeWidth={2} 
                        className="relative z-10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-2.5 group-hover:scale-125 group-hover:rotate-[8deg] group-hover:drop-shadow-lg text-[#5a32fa] dark:text-[#ff90e8]" 
                      />
                      
                      <span className="text-[9px] font-bold tracking-wider absolute bottom-1.5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] whitespace-nowrap opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 text-[#5a32fa] dark:text-[#ff90e8]">
                        {item.name}
                      </span>
                    </button>
                  );
                }

                return (
                  <Link prefetch={false} 
                    key={item.name} 
                    href={item.path} 
                    className={`group relative flex flex-col items-center justify-center w-[72px] h-[52px] rounded-xl transition-all duration-500 ease-out overflow-hidden ${
                      isActive 
                        ? 'text-[#5a32fa] dark:text-[#818cf8]' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-[#5a32fa] dark:hover:text-[#818cf8]'
                    }`}
                  >
                    {/* Active state background */}
                    {isActive && (
                      <div className="absolute inset-0 bg-[#5a32fa]/10 dark:bg-[#5a32fa]/20 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-[#5a32fa]/10 dark:border-[#5a32fa]/20" />
                    )}
                    
                    {/* Hover animated background (expanding circle effect) */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-[#5a32fa]/5 dark:bg-[#5a32fa]/10 rounded-xl opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out" />
                    )}
                    
                    {/* Icon with crazy bounce */}
                    <Icon 
                      size={20} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={`relative z-10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        isActive 
                          ? '-translate-y-2.5 scale-110 drop-shadow-md' 
                          : 'group-hover:-translate-y-2.5 group-hover:scale-125 group-hover:rotate-[8deg] group-hover:drop-shadow-lg'
                      }`} 
                    />
                    
                    {/* Text slides up on active/hover */}
                    <span 
                      className={`text-[9px] font-bold tracking-wider absolute bottom-1.5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] whitespace-nowrap ${
                        isActive 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4 sm:gap-6 text-gray-500 dark:text-gray-400">
              {/* Theme Toggle From Uiverse.io by Galahhad */}
              <label className="theme-switch hidden sm:block">
                <style>{`
                  .theme-switch {
                    --toggle-size: 12px;
                    --container-width: 5.625em;
                    --container-height: 2.5em;
                    --container-radius: 6.25em;
                    --container-light-bg: #3D7EAE;
                    --container-night-bg: #1D1F2C;
                    --circle-container-diameter: 3.375em;
                    --sun-moon-diameter: 2.125em;
                    --sun-bg: #ECCA2F;
                    --moon-bg: #C4C9D1;
                    --spot-color: #959DB1;
                    --circle-container-offset: calc((var(--circle-container-diameter) - var(--container-height)) / 2 * -1);
                    --stars-color: #fff;
                    --clouds-color: #F3FDFF;
                    --back-clouds-color: #AACADF;
                    --transition: .5s cubic-bezier(0, -0.02, 0.4, 1.25);
                    --circle-transition: .3s cubic-bezier(0, -0.02, 0.35, 1.17);
                  }
                  .theme-switch, .theme-switch *, .theme-switch *::before, .theme-switch *::after {
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    font-size: var(--toggle-size);
                  }
                  .theme-switch__container {
                    width: var(--container-width);
                    height: var(--container-height);
                    background-color: var(--container-light-bg);
                    border-radius: var(--container-radius);
                    overflow: hidden;
                    cursor: pointer;
                    -webkit-box-shadow: 0em -0.062em 0.062em rgba(0, 0, 0, 0.25), 0em 0.062em 0.125em rgba(255, 255, 255, 0.94);
                    box-shadow: 0em -0.062em 0.062em rgba(0, 0, 0, 0.25), 0em 0.062em 0.125em rgba(255, 255, 255, 0.94);
                    -webkit-transition: var(--transition);
                    -o-transition: var(--transition);
                    transition: var(--transition);
                    position: relative;
                  }
                  .theme-switch__container::before {
                    content: "";
                    position: absolute;
                    z-index: 1;
                    inset: 0;
                    -webkit-box-shadow: 0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset, 0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset;
                    box-shadow: 0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset, 0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset;
                    border-radius: var(--container-radius);
                  }
                  .theme-switch__checkbox {
                    display: none;
                  }
                  .theme-switch__circle-container {
                    width: var(--circle-container-diameter);
                    height: var(--circle-container-diameter);
                    background-color: rgba(255, 255, 255, 0.1);
                    position: absolute;
                    left: var(--circle-container-offset);
                    top: var(--circle-container-offset);
                    border-radius: var(--container-radius);
                    -webkit-box-shadow: inset 0 0 0 3.375em rgba(255, 255, 255, 0.1), inset 0 0 0 3.375em rgba(255, 255, 255, 0.1), 0 0 0 0.625em rgba(255, 255, 255, 0.1), 0 0 0 1.25em rgba(255, 255, 255, 0.1);
                    box-shadow: inset 0 0 0 3.375em rgba(255, 255, 255, 0.1), inset 0 0 0 3.375em rgba(255, 255, 255, 0.1), 0 0 0 0.625em rgba(255, 255, 255, 0.1), 0 0 0 1.25em rgba(255, 255, 255, 0.1);
                    display: flex;
                    -webkit-transition: var(--circle-transition);
                    -o-transition: var(--circle-transition);
                    transition: var(--circle-transition);
                    pointer-events: none;
                  }
                  .theme-switch__sun-moon-container {
                    pointer-events: auto;
                    position: relative;
                    z-index: 2;
                    width: var(--sun-moon-diameter);
                    height: var(--sun-moon-diameter);
                    margin: auto;
                    border-radius: var(--container-radius);
                    background-color: var(--sun-bg);
                    -webkit-box-shadow: 0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset, 0em -0.062em 0.062em 0em #a1872a inset;
                    box-shadow: 0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset, 0em -0.062em 0.062em 0em #a1872a inset;
                    -webkit-filter: drop-shadow(0.062em 0.125em 0.125em rgba(0, 0, 0, 0.25)) drop-shadow(0em 0.062em 0.125em rgba(0, 0, 0, 0.25));
                    filter: drop-shadow(0.062em 0.125em 0.125em rgba(0, 0, 0, 0.25)) drop-shadow(0em 0.062em 0.125em rgba(0, 0, 0, 0.25));
                    overflow: hidden;
                    -webkit-transition: var(--transition);
                    -o-transition: var(--transition);
                    transition: var(--transition);
                  }
                  .theme-switch__moon {
                    -webkit-transform: translateX(100%);
                    -ms-transform: translateX(100%);
                    transform: translateX(100%);
                    width: 100%;
                    height: 100%;
                    background-color: var(--moon-bg);
                    border-radius: inherit;
                    -webkit-box-shadow: 0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset, 0em -0.062em 0.062em 0em #969696 inset;
                    box-shadow: 0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset, 0em -0.062em 0.062em 0em #969696 inset;
                    -webkit-transition: var(--transition);
                    -o-transition: var(--transition);
                    transition: var(--transition);
                    position: relative;
                  }
                  .theme-switch__spot {
                    position: absolute;
                    top: 0.75em;
                    left: 0.312em;
                    width: 0.75em;
                    height: 0.75em;
                    border-radius: var(--container-radius);
                    background-color: var(--spot-color);
                    -webkit-box-shadow: 0em 0.0312em 0.062em rgba(0, 0, 0, 0.25) inset;
                    box-shadow: 0em 0.0312em 0.062em rgba(0, 0, 0, 0.25) inset;
                  }
                  .theme-switch__spot:nth-of-type(2) {
                    width: 0.375em;
                    height: 0.375em;
                    top: 0.937em;
                    left: 1.375em;
                  }
                  .theme-switch__spot:nth-last-of-type(3) {
                    width: 0.25em;
                    height: 0.25em;
                    top: 0.312em;
                    left: 0.812em;
                  }
                  .theme-switch__clouds {
                    width: 1.25em;
                    height: 1.25em;
                    background-color: var(--clouds-color);
                    border-radius: var(--container-radius);
                    position: absolute;
                    bottom: -0.625em;
                    left: 0.312em;
                    -webkit-box-shadow: 0.937em 0.312em var(--clouds-color), -0.312em -0.312em var(--back-clouds-color), 1.437em 0.375em var(--clouds-color), 0.5em -0.125em var(--back-clouds-color), 2.187em 0 var(--clouds-color), 1.25em -0.062em var(--back-clouds-color), 2.937em 0.312em var(--clouds-color), 2em -0.312em var(--back-clouds-color), 3.625em -0.062em var(--clouds-color), 2.625em 0em var(--back-clouds-color), 4.5em -0.312em var(--clouds-color), 3.375em -0.437em var(--back-clouds-color), 4.625em -1.75em 0 0.437em var(--clouds-color), 4em -0.625em var(--back-clouds-color), 4.125em -2.125em 0 0.437em var(--back-clouds-color);
                    box-shadow: 0.937em 0.312em var(--clouds-color), -0.312em -0.312em var(--back-clouds-color), 1.437em 0.375em var(--clouds-color), 0.5em -0.125em var(--back-clouds-color), 2.187em 0 var(--clouds-color), 1.25em -0.062em var(--back-clouds-color), 2.937em 0.312em var(--clouds-color), 2em -0.312em var(--back-clouds-color), 3.625em -0.062em var(--clouds-color), 2.625em 0em var(--back-clouds-color), 4.5em -0.312em var(--clouds-color), 3.375em -0.437em var(--back-clouds-color), 4.625em -1.75em 0 0.437em var(--clouds-color), 4em -0.625em var(--back-clouds-color), 4.125em -2.125em 0 0.437em var(--back-clouds-color);
                    -webkit-transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
                    -o-transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
                    transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
                  }
                  .theme-switch__stars-container {
                    position: absolute;
                    color: var(--stars-color);
                    top: -100%;
                    left: 0.312em;
                    width: 2.75em;
                    height: auto;
                    -webkit-transition: var(--transition);
                    -o-transition: var(--transition);
                    transition: var(--transition);
                  }
                  .theme-switch__checkbox:checked + .theme-switch__container {
                    background-color: var(--container-night-bg);
                  }
                  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__circle-container {
                    left: calc(100% - var(--circle-container-offset) - var(--circle-container-diameter));
                  }
                  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__circle-container:hover {
                    left: calc(100% - var(--circle-container-offset) - var(--circle-container-diameter) - 0.187em);
                  }
                  .theme-switch__circle-container:hover {
                    left: calc(var(--circle-container-offset) + 0.187em);
                  }
                  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__moon {
                    -webkit-transform: translate(0);
                    -ms-transform: translate(0);
                    transform: translate(0);
                  }
                  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__clouds {
                    bottom: -4.062em;
                  }
                  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__stars-container {
                    top: 50%;
                    -webkit-transform: translateY(-50%);
                    -ms-transform: translateY(-50%);
                    transform: translateY(-50%);
                  }
                `}</style>
                <input type="checkbox" className="theme-switch__checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
                <div className="theme-switch__container">
                  <div className="theme-switch__clouds"></div>
                  <div className="theme-switch__stars-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <div className="theme-switch__circle-container">
                    <div className="theme-switch__sun-moon-container">
                      <div className="theme-switch__moon">
                        <div className="theme-switch__spot"></div>
                        <div className="theme-switch__spot"></div>
                        <div className="theme-switch__spot"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </label>

              <button onClick={() => setIsSearchOpen(true)} className="hidden sm:block">
                <Search size={20} className="cursor-pointer hover:text-gray-900 dark:text-white transition-colors" />
              </button>
              <Link prefetch={false} href="/platform/notifications" className="relative cursor-pointer hover:text-gray-900 dark:text-white transition-colors">
                <Bell size={20} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-[3px] bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                    {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                  </span>
                )}
              </Link>
              <Link prefetch={false} href="/platform/profile" className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user?.name || 'User'} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#b892ff] text-white flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors ml-2" title="Log out">
                <LogOut size={20} />
              </button>
            </div>
          </>
        )}
      </header>

      {/* Search Dropdown / Overlay */}
      {isSearchOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[40] transition-opacity top-[73px]"
            onClick={handleCloseSearch}
          />
          <div className="fixed top-[73px] left-0 w-full bg-white dark:bg-[#0f172a] border-b border-gray-100 dark:border-white/10 shadow-lg z-[45] animate-in slide-in-from-top-2 duration-200 max-h-[60vh] overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              
              {!searchQuery.trim() ? (
                <>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Recent Searches</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button onClick={() => handleResultClick('/platform/events')} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/5 rounded-xl transition-colors text-left border border-transparent hover:border-gray-100 dark:border-white/10">
                      <Search size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">IP Law events in London</span>
                    </button>
                    <button onClick={() => handleResultClick('/platform/network')} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/5 rounded-xl transition-colors text-left border border-transparent hover:border-gray-100 dark:border-white/10">
                      <UsersRound size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">Sarah Jenkins</span>
                    </button>
                    <button onClick={() => handleResultClick('/platform/jobs')} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/5 rounded-xl transition-colors text-left border border-transparent hover:border-gray-100 dark:border-white/10">
                      <Briefcase size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">Patent Attorney jobs</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Search Results</p>
                  {filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {filteredResults.map((result, idx) => {
                        const Icon = result.icon;
                        return (
                          <button 
                            key={idx} 
                            onClick={() => handleResultClick(result.path)}
                            className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/5 rounded-xl transition-colors text-left border border-transparent hover:border-gray-100 dark:border-white/10 group"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-[#5a32fa]/10 transition-colors flex-shrink-0">
                              <Icon size={14} className="text-gray-500 dark:text-gray-400 group-hover:text-[#5a32fa] transition-colors" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-bold text-gray-900 dark:text-white truncate group-hover:text-[#5a32fa] transition-colors">{result.title}</span>
                              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{result.type}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search size={32} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">No results found for &quot;{searchQuery}&quot;</p>
                      <p className="text-gray-400 text-xs mt-1">Try searching for events, people, or jobs.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-6 right-6 max-w-sm w-full bg-[#131313] text-white rounded-2xl p-4 flex items-start gap-3 shadow-2xl z-[100] transition-all duration-300 transform ${toastNotification?.visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}
      >
        <div className="w-10 h-10 rounded-full bg-[#5a32fa] shrink-0 flex items-center justify-center">
          <Bell size={20} className="text-white" />
        </div>
        <div className="flex-1 mt-0.5">
          <p className="font-bold text-white text-[15px] mb-0.5">New Notification</p>
          <p className="text-gray-300 text-sm leading-snug">{toastNotification?.message}</p>
        </div>
        <button 
          onClick={() => setToastNotification(prev => prev ? { ...prev, visible: false } : null)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Flying Box Animation */}
      <AnimatePresence>
        {flyingBox && (
          <motion.div
            initial={{ 
              position: 'fixed', 
              left: flyingBox.left, 
              top: flyingBox.top, 
              width: flyingBox.width, 
              height: flyingBox.height,
              borderRadius: 12,
              backgroundColor: 'rgba(90, 50, 250, 0.1)',
              border: '1px solid rgba(255, 144, 232, 0.2)',
              opacity: 1,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(90, 50, 250, 0.3)'
            }}
            animate={{ 
              left: typeof window !== 'undefined' ? window.innerWidth - 60 : 0, 
              top: typeof window !== 'undefined' ? window.innerHeight - 80 : 0,
              width: 40,
              height: 40,
              borderRadius: 20,
              scale: 0.5,
              opacity: 0,
              backgroundColor: 'rgba(255, 144, 232, 1)'
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.34, 1.56, 0.64, 1]
            }}
          >
             <SiriWave variant="wave" size={32} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* LexIQ Chat Card Modal */}
      <div ref={lexiqRef}>
        <LexIQChatCard isOpen={isLexIQOpen} onClose={() => setIsLexIQOpen(false)} />
      </div>
    </>
  );
}
