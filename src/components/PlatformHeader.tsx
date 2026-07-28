'use client';

import { 
  Search, Home, UsersRound, Briefcase, Calendar, Star, Bell 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { name: 'Home', icon: Home, path: '/platform' },
  { name: 'My Network', icon: UsersRound, path: '/platform/network' },
  { name: 'Jobs', icon: Briefcase, path: '/platform/jobs' },
  { name: 'Groups', icon: UsersRound, path: '/platform/groups' },
  { name: 'Events', icon: Calendar, path: '/platform/events' },
  { name: 'Memberships', icon: Star, path: '/platform/memberships' },
];

export default function PlatformHeader() {
  const pathname = usePathname();
  const { user } = useAppStore();

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link href="/platform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/WIPALOGO.png" alt="WIPA Logo" className="h-8 w-auto object-contain" />
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center gap-10 bg-gray-50 rounded-full px-10 py-1 border border-gray-100 shadow-sm">
        {navItems.map((item) => {
          // Exact match for platform home, startsWith for subpages
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
        <Search size={20} className="cursor-pointer hover:text-gray-900 transition-colors hidden sm:block" />
        <Link href="/platform/notifications" className="relative cursor-pointer hover:text-gray-900 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">3</span>
        </Link>
        <Link href="/platform/profile" className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-[#b892ff] text-white flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </Link>
      </div>
    </header>
  );
}
