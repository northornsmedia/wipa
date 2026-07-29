'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
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
  CheckCircle2
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAppStore();

  const isActive = (path: string) => {
    if (path === '/platform') return pathname === '/platform';
    return pathname.startsWith(path);
  };

  const navLinkClass = (path: string) => {
    return `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[13px] transition-colors ${
      isActive(path) 
        ? 'bg-[#f0ebff] text-[#5a32fa] font-bold' 
        : 'text-gray-600 hover:bg-gray-50'
    }`;
  };

  return (
    <aside className="w-[260px] hidden lg:flex flex-col border-r border-gray-100 overflow-y-auto no-scrollbar shrink-0 bg-white sticky top-0 h-screen">
      
      <div className="px-6 pt-6 pb-4">
        <Link href="/platform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/WIPALOGO.png" alt="WIPA Logo" className="h-8 w-auto object-contain" />
        </Link>
      </div>
      
      <div className="px-4 mb-6">
        <div className="h-px bg-gray-100 w-full" />
      </div>

      <div className="px-4 mb-8">
        <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 px-3 uppercase">MAIN NAVIGATION</p>
        <nav className="space-y-1">
          <Link href="/platform" className={navLinkClass('/platform')}>
            <LayoutGrid size={18} /> Feed
          </Link>
          <Link href="/platform/liked-threads" className={navLinkClass('/platform/liked-threads')}>
            <Heart size={18} /> Liked Threads
          </Link>
          <Link href="/platform/network" className={navLinkClass('/platform/network')}>
            <Users size={18} /> My Network
          </Link>
          <Link href="/platform/members" className={navLinkClass('/platform/members')}>
            <Users size={18} /> Members
          </Link>
          <Link href="/platform/messages" className={`justify-between ${navLinkClass('/platform/messages')}`}>
            <div className="flex items-center gap-3">
              <Mail size={18} /> Messages
            </div>
            <span className="w-5 h-5 flex items-center justify-center bg-[#5a32fa] text-white text-[10px] font-bold rounded-full">2</span>
          </Link>
          <Link href="/platform/groups" className={navLinkClass('/platform/groups')}>
            <Users size={18} /> Groups
          </Link>
          <Link href="/platform/forums" className={navLinkClass('/platform/forums')}>
            <MessageCircle size={18} /> Discussion Forums
          </Link>
          <Link href="/platform/resources" className={navLinkClass('/platform/resources')}>
            <BookOpen size={18} /> Resource Library
          </Link>
          <Link href="/platform/events" className={navLinkClass('/platform/events')}>
            <Calendar size={18} /> Events
          </Link>
          <Link href="/platform/memberships" className={navLinkClass('/platform/memberships')}>
            <FileText size={18} /> Memberships
          </Link>
          <Link href="/platform/jobs" className={navLinkClass('/platform/jobs')}>
            <Briefcase size={18} /> Jobs Board
          </Link>
          <Link href="/platform/mentorship" className={`justify-between ${navLinkClass('/platform/mentorship')}`}>
            <div className="flex items-center gap-3">
              <GraduationCap size={18} /> Mentorship
            </div>
            <span className="px-2 py-0.5 bg-[#00d26a] text-white text-[10px] font-bold rounded-full">NEW</span>
          </Link>
        </nav>
      </div>

      <div className="px-4 mb-8">
        <p className="text-[13px] font-bold text-[#131313] mb-4 px-3">All Channels</p>
        <nav className="space-y-1">
          <Link href="/platform/channels/general" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors group">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-gray-400" /> General
            </div>
          </Link>
          <Link href="/platform/channels/daily-highlights" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors group">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-gray-400" /> daily-highlights
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            </div>
          </Link>
          <Link href="/platform/channels/time-tracking" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors group">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-gray-400" /> time-tracking
            </div>
            <BellOff size={14} className="text-gray-400" />
          </Link>
          <Link href="/platform/channels/productivity-systems" className="flex items-center justify-between px-3 py-2 text-gray-900 bg-gray-50 rounded-xl font-medium text-[13px] transition-colors group">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-gray-400" /> productivity-systems
            </div>
          </Link>
        </nav>
      </div>

      <div className="px-4 mb-8">
        <p className="text-[13px] font-bold text-[#131313] mb-4 px-3">Links</p>
        <nav className="space-y-1">
          <Link href="/ios-app" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
            <div className="flex items-center gap-2">
                iOS App
            </div>
            <ArrowUpRight size={14} className="text-gray-400" />
          </Link>
          <Link href="/android-app" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
            <div className="flex items-center gap-2">
                Android App
            </div>
            <ArrowUpRight size={14} className="text-gray-400" />
          </Link>
        </nav>
      </div>

      <div className="mt-auto px-7 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Complete Your Intro</h3>
          <div className="w-4 h-4 rounded-full border-2 border-[#00d26a] border-t-transparent animate-spin-slow"></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Circle size={16} className="text-gray-300 mt-0.5 shrink-0" />
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 underline decoration-gray-300 underline-offset-4">Watch intro video</a>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 size={16} className="text-gray-900 mt-0.5 shrink-0" />
            <span className="text-sm text-gray-900 font-medium">React to a post</span>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user?.name || 'User'} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#131313] text-white flex items-center justify-center text-lg font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
      </div>

    </aside>
  );
}
