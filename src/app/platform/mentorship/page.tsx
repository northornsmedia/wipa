'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Search, Bell, LayoutGrid, BookOpen, Calendar, Users, Info, Settings, 
  Hash, BellOff, ArrowUpRight, CheckCircle2, Circle, Image as ImageIcon, Video, Smile,
  Bookmark, MoreVertical, Heart, MessageCircle, Gift, LogOut,
  ThumbsUp, UsersRound, Mail, MessageSquare, FileText, Briefcase, GraduationCap, Home, Star, Edit3, Camera, UserPlus, Link as LinkIcon, BadgeCheck, MapPin, User, ArrowRight
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
    <div className="w-full bg-white font-sans flex flex-col h-[calc(100vh-73px)] overflow-hidden">
      <div className="w-full bg-white flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* MAIN CONTENT AREA */}
          <main className="flex-1 bg-slate-50/50 overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar">
            <div className="max-w-4xl mx-auto pb-20">
                <div className="max-w-4xl space-y-8">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black flex items-center gap-4 text-gray-900 tracking-tight mb-3">
              <div className="bg-[#5a32fa]/10 p-2.5 rounded-2xl flex items-center justify-center shrink-0">
                <GraduationCap size={32} className="text-[#5a32fa]" />
              </div>
              Mentorship Program
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl leading-relaxed">
              Connect with experienced IP professionals for guidance, career advice, and skill development. Or give back to the community by becoming a mentor yourself.
            </p>
          </div>

          {/* Active Mentorship */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
            {/* Subtle background glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00d26a]/10 to-transparent rounded-full mix-blend-multiply blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 relative z-10">
              <Star className="text-[#ffc900]" fill="currentColor" size={24} /> My Active Mentorships
            </h2>
            
            <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 relative z-10 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-300">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00d26a] to-[#00a854] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-sm shadow-[#00d26a]/20">
                A
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900">Amanda Thorne</h3>
                <p className="text-sm font-medium text-gray-500 mb-3">Partner at Thorne & Associates (Your Mentor)</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="bg-[#b892ff]/10 text-[#5a32fa] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#b892ff]/20 flex items-center gap-1.5">
                    <Calendar size={12} /> Next Session: Thursday 4PM
                  </span>
                  <span className="bg-white text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 shadow-sm flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#00d26a]" /> Goal: Partnership Track
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <button className="bg-[#5a32fa] text-white hover:opacity-90 px-8 py-3 rounded-xl font-bold shadow-sm shadow-[#5a32fa]/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2">
                  <MessageSquare size={18} /> Message
                </button>
                <button className="bg-white text-gray-700 px-8 py-3 rounded-xl font-bold border border-gray-200 hover:border-[#131313] hover:text-[#131313] transition-all duration-300 whitespace-nowrap">
                  Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Find a Mentor */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">Find a Mentor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {potentialMentors.map((mentor, i) => (
                <div key={i} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden group hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 flex flex-col relative">
                  <div className="h-24 w-full relative">
                    <div className="absolute inset-0 opacity-90" style={{ backgroundImage: `linear-gradient(135deg, ${mentor.color}, ${mentor.color}dd)` }}></div>
                  </div>
                  <div className="px-6 pb-6 pt-0 relative flex-1 flex flex-col">
                    <div className="w-16 h-16 rounded-2xl border-4 border-white flex items-center justify-center text-white text-2xl font-bold absolute -top-8 left-6 shadow-sm" style={{ backgroundColor: mentor.color }}>
                      {mentor.name.charAt(0)}
                    </div>
                    
                    <div className="mt-12 mb-6 flex-1">
                      <h3 className="font-bold text-xl text-gray-900 leading-tight mb-1">{mentor.name}</h3>
                      <p className="text-[13px] font-medium text-gray-500 mb-2">{mentor.role}</p>
                      <p className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                         <Briefcase size={14} className="text-[#131313]" /> {mentor.company}
                      </p>
                      
                      <div className="mt-5 bg-gray-50/80 p-3 rounded-xl border border-gray-100 group-hover:bg-white group-hover:border-gray-200 transition-colors">
                        <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                           Expertise
                        </p>
                        <p className="text-xs font-bold text-gray-700 leading-relaxed">{mentor.focus}</p>
                      </div>
                    </div>
                    
                    <button className="w-full bg-white text-gray-800 py-3 rounded-xl font-bold text-sm border-2 border-gray-100 group-hover:border-[#5a32fa] group-hover:text-[#5a32fa] transition-colors duration-300 flex items-center justify-center gap-2">
                      Request Mentorship <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
        </div>
          </main>
        </div>
      </div>
    </div>
  );
}
