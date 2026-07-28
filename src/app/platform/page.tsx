'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Search, Bell, LayoutGrid, BookOpen, Calendar, Users, Info, Settings, 
  Hash, BellOff, ArrowUpRight, CheckCircle2, Circle, Image as ImageIcon, Video, Smile,
  Bookmark, MoreVertical, Heart, MessageCircle, Gift, LogOut,
  ThumbsUp, UsersRound, Mail, MessageSquare, FileText, Briefcase, GraduationCap, Home, Star
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PlatformPage() {
  const { user, posts, likedPostIds, toggleLike, setUser } = useAppStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Latest');
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="w-full bg-white font-sans flex flex-col h-[calc(100vh-73px)] overflow-hidden">
      <div className="w-full bg-white flex flex-col flex-1 overflow-hidden">
        


        {/* MAIN LAYOUT */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* LEFT SIDEBAR */}
          <aside className="w-[260px] hidden lg:flex flex-col border-r border-gray-100 overflow-y-auto no-scrollbar py-6 shrink-0 bg-white">
            
            <div className="px-4 mb-8">
              <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 px-3 uppercase">MAIN NAVIGATION</p>
              <nav className="space-y-1">
                <Link href="/platform" className="flex items-center gap-3 px-3 py-2.5 bg-[#f0ebff] text-[#5a32fa] rounded-xl font-bold text-[13px] transition-colors">
                  <LayoutGrid size={18} /> Feed
                </Link>
                <Link href="/platform/liked-threads" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <ThumbsUp size={18} /> Liked Threads
                </Link>
                <Link href="/platform/network" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <UsersRound size={18} /> My Network
                </Link>
                <Link href="/platform/members" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <Users size={18} /> Members
                </Link>
                <Link href="/platform/messages" className="flex items-center justify-between px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail size={18} /> Messages
                  </div>
                  <span className="w-5 h-5 flex items-center justify-center bg-[#5a32fa] text-white text-[10px] font-bold rounded-full">2</span>
                </Link>
                <Link href="/platform/groups" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <UsersRound size={18} /> Groups
                </Link>
                <Link href="/platform/forums" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <MessageSquare size={18} /> Discussion Forums
                </Link>
                <Link href="/platform/resources" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <BookOpen size={18} /> Resource Library
                </Link>
                <Link href="/platform/events" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <Calendar size={18} /> Events
                </Link>
                <Link href="/platform/memberships" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <FileText size={18} /> Memberships
                </Link>
                <Link href="/platform/jobs" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <Briefcase size={18} /> Jobs Board
                </Link>
                <Link href="/platform/mentorship" className="flex items-center justify-between px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
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

            <div className="px-7 mt-auto mb-4">
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

          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 bg-slate-50/50 overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar">
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
              
              {/* HERO BANNER */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full overflow-hidden opacity-40 pointer-events-none">
                   {/* Abstract shapes matching the screenshot style */}
                   <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-[#ffcc00] rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform -rotate-45"></div>
                   <div className="absolute top-[-30%] right-[20%] w-[40%] h-[120%] bg-[#ff4b4b] rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform rotate-12"></div>
                   <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[80%] bg-[#5a32fa] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                </div>
                
                <div className="relative z-10 lg:w-2/3">
                  <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">Hello{user?.name ? ` ${user.name}` : ''},<br/>Welcome to WIPA</h1>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Building the Future of Innovation Together</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 sm:w-5/6">
                    Connect with innovators, IP professionals, founders, researchers, and investors to share knowledge, collaborate, and turn ideas into impact.
                  </p>
                </div>
                
                {/* Tabs & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 border-b border-gray-100 pb-0 relative z-10">
                  <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                    {['Latest', 'Trending', 'Following', 'Saved'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm transition-colors whitespace-nowrap ${
                          activeTab === tab 
                            ? 'font-bold text-gray-900 border-b-2 border-[#5a32fa]' 
                            : 'font-medium text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="relative pb-3 shrink-0">
                    <Search className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search feeds" 
                      className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-sm w-full sm:w-48 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* COMPOSER */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#ff90e8] text-[#131313] flex items-center justify-center font-bold text-sm shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <input 
                  type="text" 
                  placeholder="What's on your mind?" 
                  className="flex-1 bg-transparent text-sm text-gray-900 font-medium placeholder-gray-400 focus:outline-none" 
                />
                <div className="flex items-center gap-1 sm:gap-2 text-gray-500 shrink-0">
                  <button className="flex items-center gap-1.5 p-2 hover:bg-gray-50 hover:text-gray-800 rounded-xl transition-colors">
                    <ImageIcon size={18} />
                    <span className="hidden md:block text-[13px] font-bold">Photo</span>
                  </button>
                  <button className="flex items-center gap-1.5 p-2 hover:bg-gray-50 hover:text-gray-800 rounded-xl transition-colors">
                    <Video size={18} />
                    <span className="hidden md:block text-[13px] font-bold">Video</span>
                  </button>
                  <button className="flex items-center gap-1.5 p-2 hover:bg-gray-50 hover:text-gray-800 rounded-xl transition-colors">
                    <Calendar size={18} />
                    <span className="hidden md:block text-[13px] font-bold">Event</span>
                  </button>
                  <button className="flex items-center gap-1.5 p-2 hover:bg-gray-50 hover:text-gray-800 rounded-xl transition-colors">
                    <FileText size={18} className="text-[#00d26a]" />
                    <span className="hidden md:block text-[13px] font-bold">Attach Doc</span>
                  </button>
                  <button className="flex items-center gap-1.5 p-2 hover:bg-gray-50 hover:text-gray-800 rounded-xl transition-colors">
                    <Smile size={18} />
                  </button>
                </div>
              </div>

              {/* FEED */}
              <div className="space-y-4">
                {posts.map((post) => {
                  const isLiked = likedPostIds.includes(post.id);
                  return (
                    <div key={post.id} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm" 
                            style={{ backgroundColor: post.color }}
                          >
                            {post.initial}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-[14px] text-gray-900 leading-none">{post.name}</h3>
                              <span className="text-gray-300 text-xs">•</span>
                              <span className="text-xs text-gray-500 font-medium leading-none">{post.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Member since: July 18, 2024</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <button className="p-1.5 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors"><Bookmark size={18} /></button>
                          <button className="p-1.5 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors"><MoreVertical size={18} /></button>
                        </div>
                      </div>
                      
                      <p className="text-[14px] text-gray-800 leading-relaxed mb-6 font-medium">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-3 sm:gap-4 text-gray-400">
                          <button 
                            onClick={() => toggleLike(post.id)} 
                            className={`hover:text-red-500 transition-colors ${isLiked ? 'text-red-500' : ''}`}
                          >
                            <Heart size={20} className={isLiked ? "fill-current" : ""} />
                          </button>
                          <button className="hover:text-gray-900 transition-colors">
                            <MessageCircle size={20} />
                          </button>
                          <button className="hover:text-gray-900 transition-colors">
                            <Gift size={20} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-[#5a32fa] text-[8px] flex items-center justify-center text-white font-bold z-30">M</div>
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-[#00d26a] text-[8px] flex items-center justify-center text-white font-bold z-20">S</div>
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-[#ffc900] text-[8px] flex items-center justify-center text-[#131313] font-bold z-10">D</div>
                          </div>
                          <span className="text-[11px] sm:text-xs font-medium text-gray-500">
                            {post.likes} likes • {post.comments} comments
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
