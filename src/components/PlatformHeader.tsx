'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Home, UsersRound, Briefcase, Calendar, Star, Bell, X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { searchProfiles } from '@/app/actions/profiles';

const navItems = [
  { name: 'Home', icon: Home, path: '/platform' },
  { name: 'My Network', icon: UsersRound, path: '/platform/network' },
  { name: 'Jobs', icon: Briefcase, path: '/platform/jobs' },
  { name: 'Groups', icon: UsersRound, path: '/platform/groups' },
  { name: 'Events', icon: Calendar, path: '/platform/events' },
  { name: 'Memberships', icon: Star, path: '/platform/memberships' },
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
  const { user } = useAppStore();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbResults, setDbResults] = useState<any[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

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
      }, () => {
        fetchNotifications();
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
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 md:py-4 border-b border-gray-100 bg-white sticky top-0 z-50 min-h-[73px]">
        {isSearchOpen ? (
          <div className="flex items-center w-full gap-4 max-w-4xl mx-auto animate-in fade-in duration-200">
            <Search size={20} className="text-gray-400 flex-shrink-0" />
            <input 
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, jobs, events..."
              className="flex-1 bg-gray-50 rounded-full py-2.5 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5a32fa]/20 focus:bg-white border border-transparent focus:border-[#5a32fa] transition-all text-gray-900"
            />
            <button 
              onClick={handleCloseSearch}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Link href="/platform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/WIPALOGO.png" alt="WIPA Logo" className="h-8 w-auto object-contain" />
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center gap-10 bg-gray-50 rounded-full px-10 py-1 border border-gray-100 shadow-sm">
              {navItems.map((item) => {
                const isActive = item.path === '/platform' ? pathname === '/platform' : pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.name} 
                    href={item.path} 
                    className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors pb-1 mt-1 border-b-2 ${
                      isActive 
                        ? 'text-[#5a32fa] border-[#5a32fa]' 
                        : 'text-[#334155] hover:text-[#5a32fa] border-transparent'
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[11px] font-bold">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4 sm:gap-6 text-gray-500">
              <button onClick={() => setIsSearchOpen(true)} className="hidden sm:block">
                <Search size={20} className="cursor-pointer hover:text-gray-900 transition-colors" />
              </button>
              <Link href="/platform/notifications" className="relative cursor-pointer hover:text-gray-900 transition-colors">
                <Bell size={20} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-[3px] bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                    {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                  </span>
                )}
              </Link>
              <Link href="/platform/profile" className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user?.name || 'User'} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#b892ff] text-white flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </Link>
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
          <div className="fixed top-[73px] left-0 w-full bg-white border-b border-gray-100 shadow-lg z-[45] animate-in slide-in-from-top-2 duration-200 max-h-[60vh] overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              
              {!searchQuery.trim() ? (
                <>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Recent Searches</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button onClick={() => handleResultClick('/platform/events')} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-left border border-transparent hover:border-gray-100">
                      <Search size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">IP Law events in London</span>
                    </button>
                    <button onClick={() => handleResultClick('/platform/network')} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-left border border-transparent hover:border-gray-100">
                      <UsersRound size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">Sarah Jenkins</span>
                    </button>
                    <button onClick={() => handleResultClick('/platform/jobs')} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-left border border-transparent hover:border-gray-100">
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
                            className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-left border border-transparent hover:border-gray-100 group"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#5a32fa]/10 transition-colors flex-shrink-0">
                              <Icon size={14} className="text-gray-500 group-hover:text-[#5a32fa] transition-colors" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-bold text-gray-900 truncate group-hover:text-[#5a32fa] transition-colors">{result.title}</span>
                              <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{result.type}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search size={32} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-bold text-sm">No results found for &quot;{searchQuery}&quot;</p>
                      <p className="text-gray-400 text-xs mt-1">Try searching for events, people, or jobs.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
