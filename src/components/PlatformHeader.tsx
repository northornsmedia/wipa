'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Home,
  Users,
  Briefcase,
  Calendar,
  Star,
  MessageSquare,
  Bell,
  ChevronDown,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

const navItems = [
  { name: 'Home', icon: Home, path: '/platform' },
  { name: 'My Network', icon: Users, path: '/platform/network' },
  { name: 'Jobs', icon: Briefcase, path: '/platform/jobs' },
  { name: 'Groups', icon: Users, path: '/platform/groups' },
  { name: 'Events', icon: Calendar, path: '/platform/events' },
  { name: 'Memberships', icon: Star, path: '/platform/memberships' },
];

export default function PlatformHeader() {
  const pathname = usePathname();
  const { user } = useAppStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      let query = supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${searchQuery}%`);

      if (user?.email) {
        query = query.neq('email', user.email);
      }

      const { data, error } = await query.limit(5);

      if (!error && data) {
        // Map data to match the UI format
        const formatted = data.map((profile: any) => ({
          id: profile.id,
          name: profile.full_name || 'Anonymous User',
          role: "WIPA Member", // Placeholder since we don't have roles in DB yet
          avatarColor: ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'][Math.floor(Math.random() * 4)],
          initial: profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'
        }));
        setSearchResults(formatted);
      }
    };

    const delay = setTimeout(fetchUsers, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#fbe8d5] border-b-2 border-[#131313]">
        {/* Mobile Header Layout */}
        <div className="md:hidden w-full h-[72px] px-4 flex items-center justify-between gap-3">
          <Link href="/platform/profile" className="flex-shrink-0 cursor-pointer hover:-translate-y-px transition-transform">
            <div className="w-10 h-10 rounded-full bg-[#b892ff] text-[#131313] flex items-center justify-center font-bold text-lg border-[1.5px] border-[#131313] shadow-[2px_2px_0px_0px_#131313]">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </Link>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full bg-white border-[1.5px] border-[#131313] rounded-full py-2 pl-9 pr-4 text-sm font-medium focus:outline-none focus:ring-0 transition-all text-[#131313] shadow-[2px_2px_0px_0px_#131313]"
            />

            {/* Mobile Search Dropdown */}
            {isSearchFocused && searchQuery && (
              <div className="absolute top-[120%] left-0 right-0 bg-white rounded-[1.5rem] border-[1.5px] border-[#131313] shadow-[4px_4px_0px_0px_#131313] overflow-hidden z-[100]">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col max-h-[300px] overflow-y-auto">
                    {searchResults.map(result => (
                      <Link href={`/platform/user/${result.id}`} onClick={() => setIsSearchFocused(false)} key={`m-${result.id}`} className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b-[1.5px] border-gray-100 last:border-b-0 transition-colors">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-[#131313] shrink-0 border-[1.5px] border-[#131313]" style={{ backgroundColor: result.avatarColor }}>{result.initial}</div>
                        <div className="min-w-0">
                          <p className="font-bold text-[13px] text-gray-900 leading-tight truncate">{result.name}</p>
                          <p className="font-medium text-[11px] text-gray-500 truncate">{result.role}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm font-bold text-gray-500">No results found</div>
                )}
              </div>
            )}
          </div>
          <Link
            href="/platform/notifications"
            className="relative p-2 hover:-translate-y-px rounded-full transition-transform flex-shrink-0 text-[#131313]"
          >
            <Bell size={24} strokeWidth={2.5} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff5241] text-white text-[10px] font-black flex items-center justify-center rounded-full border-[1.5px] border-[#131313]">
              3
            </span>
          </Link>
        </div>

        {/* Desktop Header Layout */}
        <div className="hidden md:flex max-w-[1400px] mx-auto px-4 md:px-6 h-[72px] items-center justify-between gap-4">

          {/* Left section: Logo & Search */}
          <div className="flex items-center gap-6 flex-1 lg:flex-none">
            <Link href="/platform" className="flex items-center gap-2">
              <span className="font-serif text-3xl font-bold tracking-tight text-[#5a32fa]">WIPA</span>
            </Link>

            <div className="hidden lg:flex relative max-w-sm w-full xl:w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members, groups, discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-full py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-[#5a32fa] focus:bg-white transition-all text-[#131313]"
              />

              {/* Desktop Search Dropdown */}
              {isSearchFocused && searchQuery && (
                <div className="absolute top-[120%] left-0 right-0 bg-white rounded-[1.5rem] border-[1.5px] border-[#131313] shadow-[4px_4px_0px_0px_#131313] overflow-hidden z-[100]">
                  {searchResults.length > 0 ? (
                    <div className="flex flex-col max-h-[400px] overflow-y-auto">
                      {searchResults.map(result => (
                        <Link href={`/platform/user/${result.id}`} onClick={() => setIsSearchFocused(false)} key={`d-${result.id}`} className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b-[1.5px] border-gray-100 last:border-b-0 transition-colors">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-[#131313] shrink-0 border-[1.5px] border-[#131313]" style={{ backgroundColor: result.avatarColor }}>{result.initial}</div>
                          <div className="min-w-0">
                            <p className="font-bold text-[14px] text-gray-900 leading-tight truncate">{result.name}</p>
                            <p className="font-medium text-[12px] text-gray-500 truncate">{result.role}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm font-bold text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Middle section: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full flex-1 justify-center">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`relative flex flex-col items-center justify-center w-20 h-full gap-1 text-[13px] font-medium transition-colors hover:text-[#5a32fa] ${isActive ? 'text-[#5a32fa]' : 'text-gray-500'
                    }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#5a32fa] rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right section: Icons & Profile */}
          <div className="flex items-center gap-4 xl:gap-6 justify-end">
            <div className="hidden md:flex items-center gap-4 text-gray-500">
              <button className="relative p-1 hover:text-[#5a32fa] transition-colors">
                <MessageSquare size={22} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#5a32fa] text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                  1
                </span>
              </button>
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-1 hover:text-[#5a32fa] transition-colors"
              >
                <Bell size={22} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                  3
                </span>
              </button>
            </div>

            {/* User Profile */}
            <Link href="/platform/profile" className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-100">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#b892ff] to-[#5a32fa] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left mr-1">
                <div className="text-[13px] font-bold text-gray-900 leading-tight">
                  {user?.name || 'Loading...'}
                </div>
                <div className="text-[11px] text-gray-500 font-medium">View Profile</div>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
            </Link>
          </div>

        </div>
      </header>

      {/* Notifications Slider Overlay */}
      {isNotificationsOpen && (
        <div
          className="fixed inset-0 bg-[#fbe8d5]/40 backdrop-blur-sm z-[100] flex justify-end transition-opacity duration-300"
          onClick={() => setIsNotificationsOpen(false)}
        >
          {/* Notifications Panel */}
          <div
            className="w-full max-w-sm h-full bg-white border-l-4 border-[#131313] shadow-[-8px_0px_0px_0px_#131313] flex flex-col transform transition-transform duration-300 translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b-4 border-[#131313] flex items-center justify-between bg-[#fbe8d5]">
              <h2 className="text-xl font-black text-gray-900">Notifications</h2>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="w-8 h-8 rounded-full border-2 border-[#131313] bg-white flex items-center justify-center hover:bg-[#ff4b4b] hover:text-white transition-colors"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
              {/* Mock Notification 1 */}
              <div className="p-4 rounded-[1rem] border-2 border-[#131313] bg-white shadow-[4px_4px_0px_0px_#131313] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#131313] transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5a32fa] text-white flex items-center justify-center font-bold border-2 border-[#131313] shrink-0 text-sm">
                    S
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-900 leading-tight">
                      <span className="font-black">Sarah Jenkins</span> viewed your profile.
                    </p>
                    <p className="text-[11px] text-[#5a32fa] font-bold mt-1.5">2 hours ago</p>
                  </div>
                </div>
              </div>

              {/* Mock Notification 2 */}
              <div className="p-4 rounded-[1rem] border-2 border-[#131313] bg-white shadow-[4px_4px_0px_0px_#131313] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#131313] transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00d26a] text-white flex items-center justify-center font-bold border-2 border-[#131313] shrink-0 text-sm">
                    W
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-900 leading-tight">
                      <span className="font-black">WIPA Event:</span> Annual IP Conference is starting soon.
                    </p>
                    <p className="text-[11px] text-[#5a32fa] font-bold mt-1.5">5 hours ago</p>
                  </div>
                </div>
              </div>

              {/* Mock Notification 3 */}
              <div className="p-4 rounded-[1rem] border-2 border-[#131313] bg-white shadow-[4px_4px_0px_0px_#131313] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#131313] transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffc900] text-[#131313] flex items-center justify-center font-black border-2 border-[#131313] shrink-0 text-sm">
                    M
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-900 leading-tight">
                      <span className="font-black">Michael Chang</span> sent you a connection request.
                    </p>
                    <p className="text-[11px] text-[#5a32fa] font-bold mt-1.5">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t-4 border-[#131313] bg-[#f8f9fa]">
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="w-full py-3 rounded-xl border-2 border-[#131313] font-bold text-[#131313] hover:bg-[#131313] hover:text-white transition-colors bg-white shadow-[4px_4px_0px_0px_#131313] hover:shadow-[2px_2px_0px_0px_#131313] hover:translate-y-0.5"
              >
                Mark all as read
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
