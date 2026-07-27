'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  BadgeCheck, LayoutGrid, User, Users, Mail, UserPlus, UsersRound, MessageSquare, FileText, Briefcase, GraduationCap,
  MapPin, Link as LinkIcon, Calendar, Edit3, Settings, Camera, ThumbsUp, BookOpen, Star, ArrowRight, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MentorshipPage() {
  const { user } = useAppStore();
  const router = useRouter();

  // Mock data for mentors
  const potentialMentors = [
    { name: 'Dr. Sarah Jenkins', role: 'Partner, IP Litigation', company: 'Global Law LLP', focus: 'Patent Law, Career Growth', color: '#5a32fa' },
    { name: 'Michael Chang', role: 'Head of Trademarks', company: 'TechNova', focus: 'Brand Protection, In-house Transition', color: '#00d26a' },
    { name: 'Elena Rodriguez', role: 'Senior Patent Attorney', company: 'BioInnovate', focus: 'Biotech Patents, Work-Life Balance', color: '#ff90e8' }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      
      {/* FIXED LEFT SIDEBAR */}
      <div className="hidden md:block fixed left-0 top-[72px] bottom-0 w-[260px] lg:w-[280px] z-40">
        <div className="bg-white rounded-tr-[2rem] rounded-br-none rounded-l-none border-t-2 border-r-2 border-l-0 border-b-0 border-[#131313] shadow-[4px_0px_0px_0px_#131313] p-4 h-full flex flex-col">
          {/* Profile Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#5a32fa] text-white flex items-center justify-center text-lg font-bold border-2 border-[#131313] flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-[14px] text-gray-900 truncate flex items-center gap-1">
                {user?.name || 'Loading...'}
                <BadgeCheck size={14} className="text-[#5a32fa] flex-shrink-0" />
              </h2>
              <p className="text-[11px] text-gray-500 font-medium truncate">IP Counsel</p>
              <p className="text-[11px] text-gray-500 font-medium truncate">WIPA Member</p>
            </div>
          </div>
          <button onClick={() => router.push('/platform/profile')} className="block text-center w-full py-1.5 border-2 border-gray-200 bg-white rounded-xl text-xs font-bold text-gray-600 hover:border-[#5a32fa] hover:text-[#5a32fa] transition-all mb-4">
            View Profile
          </button>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-2 px-2">MAIN NAVIGATION</p>
            <nav className="space-y-0.5">
              <Link href="/platform" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <LayoutGrid size={16} /> Feed
              </Link>
              <Link href="/platform/members" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <Users size={16} /> Members
              </Link>
              <Link href="/platform/messages" className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <div className="flex items-center gap-3">
                  <Mail size={16} /> Messages
                </div>
              </Link>
              <Link href="/platform/groups" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <UsersRound size={16} /> Groups
              </Link>
              <Link href="/platform/mentorship" className="flex items-center justify-between px-3 py-2 bg-[#5a32fa]/10 text-[#5a32fa] rounded-xl font-medium text-sm transition-colors">
                <div className="flex items-center gap-3">
                  <GraduationCap size={16} /> Mentorship
                </div>
                <span className="bg-[#00d26a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">NEW</span>
              </Link>
              <Link href="/platform/events" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <Calendar size={16} /> Events
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="md:ml-[260px] lg:ml-[280px] pt-6 pb-12 px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center gap-3 mb-2">
              <GraduationCap size={40} className="text-[#5a32fa]" />
              Mentorship Program
            </h1>
            <p className="text-lg text-gray-600 font-medium max-w-2xl">
              Connect with experienced IP professionals for guidance, career advice, and skill development. Or give back to the community by becoming a mentor yourself.
            </p>
          </div>

          {/* Active Mentorship */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313]">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Star className="text-[#ffc900]" fill="currentColor" /> My Active Mentorships
            </h2>
            
            <div className="border-2 border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#00d26a] border-4 border-[#131313] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                A
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900">Amanda Thorne</h3>
                <p className="text-sm font-bold text-gray-500 mb-2">Partner at Thorne & Associates (Your Mentor)</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="bg-[#b892ff]/20 text-[#5a32fa] px-3 py-1 rounded-lg text-xs font-bold">Next Session: Thursday 4PM</span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">Goal: Partnership Track</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button className="bg-[#131313] text-white px-6 py-2.5 rounded-xl font-bold border-2 border-[#131313] hover:bg-[#5a32fa] hover:border-[#5a32fa] transition-colors whitespace-nowrap">
                  Message
                </button>
                <button className="bg-white text-gray-900 px-6 py-2.5 rounded-xl font-bold border-2 border-gray-200 hover:border-[#131313] transition-colors whitespace-nowrap">
                  Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Find a Mentor */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Find a Mentor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {potentialMentors.map((mentor, i) => (
                <div key={i} className="bg-white rounded-2xl border-2 border-[#131313] overflow-hidden group hover:shadow-[4px_4px_0px_0px_#131313] transition-all hover:-translate-y-1 flex flex-col">
                  <div className="h-16" style={{ backgroundColor: mentor.color }}></div>
                  <div className="px-5 pb-5 pt-0 relative flex-1 flex flex-col">
                    <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-white text-2xl font-bold absolute -top-8 left-5 shadow-sm" style={{ backgroundColor: mentor.color }}>
                      {mentor.name.charAt(0)}
                    </div>
                    
                    <div className="mt-10 mb-4 flex-1">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{mentor.name}</h3>
                      <p className="text-xs font-bold text-gray-500 mb-1">{mentor.role}</p>
                      <p className="text-xs font-medium text-gray-400">{mentor.company}</p>
                      
                      <div className="mt-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Expertise</p>
                        <p className="text-xs font-bold text-gray-700">{mentor.focus}</p>
                      </div>
                    </div>
                    
                    <button className="w-full bg-white text-gray-900 py-2 rounded-xl font-bold text-sm border-2 border-gray-200 group-hover:border-[#131313] transition-colors flex items-center justify-center gap-2">
                      Request <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
