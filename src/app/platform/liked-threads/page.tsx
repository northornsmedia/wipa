'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Image as ImageIcon, Video, Calendar, Newspaper, ThumbsUp, MessageCircle, Share2, Send, Bookmark,
  BadgeCheck, LayoutGrid, User, Users, Mail, UserPlus, UsersRound, MessageSquare, FileText, Briefcase, GraduationCap,
  MoreHorizontal,
  Heart,
  Eye
, BookOpen
, Hash, BellOff, ArrowUpRight, CheckCircle2, Circle} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LikedThreadsPage() {
  const { user, posts, likedPostIds, toggleLike } = useAppStore();
  const router = useRouter();

  const likedPosts = posts.filter(post => likedPostIds.includes(post.id));

  return (
    <div className="w-full bg-[#f8f9fa] font-sans flex flex-col h-[calc(100vh-73px)] overflow-hidden">
  <div className="w-full flex flex-col flex-1 overflow-hidden">
    <div className="flex flex-1 overflow-hidden">
      
      {/* LEFT SIDEBAR */}
          <aside className="w-[260px] hidden lg:flex flex-col border-r border-gray-100 overflow-y-auto no-scrollbar py-6 shrink-0 bg-white">
            
            <div className="px-4 mb-8">
              <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 px-3 uppercase">MAIN NAVIGATION</p>
              <nav className="space-y-1">
                <Link href="/platform" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-[13px] transition-colors">
                  <LayoutGrid size={18} /> Feed
                </Link>
                <Link href="/platform/liked-threads" className="flex items-center gap-3 px-3 py-2.5 bg-[#f0ebff] text-[#5a32fa] rounded-xl font-bold text-[13px] transition-colors">
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

  
      

      {/* MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar">
        <div className="max-w-[900px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
          
          <div className="mb-8 border-b-4 border-gray-200 pb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart size={32} className="text-[#ff90e8] fill-[#ff90e8]" />
                Liked Threads
              </h1>
              <p className="text-gray-500 font-medium mt-2">
                All the posts and discussions you've enjoyed recently.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#ff90e8] border border-gray-200 shadow-sm flex items-center justify-center font-bold text-2xl">
              {likedPosts.length}
            </div>
          </div>

          {likedPosts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-12 text-center flex flex-col items-center">
              <ThumbsUp size={48} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No liked threads yet</h3>
              <p className="text-gray-500 font-medium">
                Go back to the feed and click the Like button on posts you find interesting!
              </p>
              <Link href="/platform" className="mt-6 bg-[#5a32fa] text-white px-6 py-3 rounded-xl font-bold text-sm border border-gray-200 hover:shadow-sm hover:-translate-y-1 transition-all">
                Return to Feed
              </Link>
            </div>
          ) : (
            <div className="space-y-6 pb-24">
              {likedPosts.map((post) => {
                const isLiked = likedPostIds.includes(post.id);
                return (
                  <div key={post.id} className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden">
                    {/* Post Header */}
                    <div className="p-6 pb-4 flex items-start justify-between border-b-2 border-gray-100">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full text-[#131313] flex items-center justify-center text-xl font-bold border border-gray-200"
                          style={{ backgroundColor: post.color }}
                        >
                          {post.initial}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-[15px] hover:underline cursor-pointer">{post.name}</h3>
                          <p className="text-[13px] text-gray-500 font-medium">{post.title}</p>
                          <p className="text-[11px] text-gray-400 font-bold mt-0.5">{post.time}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
      
                    {/* Post Content */}
                    <div className="p-6 pt-4 text-gray-800 text-[15px] leading-relaxed">
                      {post.content}
                    </div>
      
                    {/* Post Actions */}
                    <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-t-2 border-gray-200">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 border-transparent hover:border-gray-300 ${
                            isLiked 
                              ? 'bg-[#ff90e8]/20 text-[#ff90e8] hover:border-[#ff90e8]' 
                              : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <ThumbsUp size={18} className={isLiked ? "fill-current" : ""} /> Like {post.likes > 0 && `(${post.likes})`}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-gray-600 transition-all hover:bg-gray-200 border-2 border-transparent hover:border-gray-300">
                          <MessageCircle size={18} /> Comment {post.comments > 0 && `(${post.comments})`}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 font-bold text-sm text-gray-500">
                        <Eye size={18} /> {post.likes * 14 + 132} Impressions
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* FIXED RIGHT SIDEBAR */}
      <aside className="w-[300px] hidden xl:flex flex-col shrink-0 space-y-6 pt-6 overflow-y-auto no-scrollbar pb-10 pr-4 md:pr-8 lg:pr-12">
        <div className="h-full flex flex-col gap-6">
          
          {/* Active Groups */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900">Active Groups</h3>
              <button className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Trade Marks', members: '1,345', icon: '©️', color: '#b892ff' },
                { name: 'Women in Leadership', members: '897', icon: '👩‍💼', color: '#ff90e8' },
                { name: 'Artificial Intelligence', members: '1,105', icon: '🤖', color: '#5a32fa' },
                { name: 'Patent Law', members: '1,245', icon: '📜', color: '#5a32fa' },
                { name: 'Start-ups & Innovation', members: '764', icon: '🚀', color: '#ffc900' }
              ].map((group, i) => (
                <div key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 border-transparent group-hover:border-gray-200 transition-all" style={{ backgroundColor: `${group.color}20`, color: group.color }}>
                    {group.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#5a32fa] transition-colors">{group.name}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{group.members} members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Discussions */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900">Trending Discussions</h3>
              <button className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'How is AI changing patent landscapes globally?', comments: '128' },
                { title: 'The future of trademark law in digital markets', comments: '96' },
                { title: 'Building personal brand in IP profession', comments: '74' }
              ].map((disc, i) => (
                <div key={i} className="cursor-pointer group">
                  <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#5a32fa] transition-colors leading-tight mb-1">
                    <span className="text-[#00d26a] mr-1">▶</span>{disc.title}
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium">{disc.comments} comments</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[15px] text-gray-900">Upcoming Events</h3>
              <button className="text-xs font-bold text-[#5a32fa] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { month: 'JUL', day: '22', title: 'Women in AI & IP Leadership', loc: 'London, UK', time: '10:00 AM GMT' },
                { month: 'AUG', day: '05', title: 'Global Trademark Trends 2025', loc: 'Online Webinar', time: '03:00 PM GMT' },
                { month: 'AUG', day: '19', title: 'IP Strategy for Start-ups', loc: 'New York, USA', time: '11:00 AM EST' }
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center border border-gray-200 rounded-xl overflow-hidden min-w-[45px]">
                    <div className="bg-[#5a32fa] text-white text-[9px] font-bold w-full text-center py-0.5">{event.month}</div>
                    <div className="bg-white text-gray-900 text-sm font-bold py-1">{event.day}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-bold text-gray-900 leading-tight mb-0.5">{event.title}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{event.loc}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{event.time}</p>
                  </div>
                  <button className="bg-[#5a32fa] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#4020ca] transition-colors">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </div>
  </div>
</div>
  );
}
