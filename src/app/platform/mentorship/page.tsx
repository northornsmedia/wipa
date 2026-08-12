'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  GraduationCap, Calendar, Star, CheckCircle2, MessageSquare, 
  Briefcase, ArrowRight, ArrowUpRight, Search, LayoutGrid, Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const INITIAL_MENTORS = [
  { id: 1, name: 'Dr. Sarah Jenkins', role: 'Partner, IP Litigation', company: 'Global Law LLP', focus: 'Patent Law, Career Growth', color: '#5a32fa' },
  { id: 2, name: 'Michael Chang', role: 'Head of Trademarks', company: 'TechNova', focus: 'Brand Protection, In-house Transition', color: '#00d26a' },
  { id: 3, name: 'Elena Rodriguez', role: 'Senior Patent Attorney', company: 'BioInnovate', focus: 'Biotech Patents, Work-Life Balance', color: '#ff90e8' },
  { id: 4, name: 'David Kim', role: 'Chief IP Counsel', company: 'NextGen Auto', focus: 'Trade Secrets, Strategy', color: '#b892ff' },
  { id: 5, name: 'Rachel Greene', role: 'Senior Associate', company: 'IP Leaders Group', focus: 'Copyright, Media Law', color: '#ffc900' },
  { id: 6, name: 'James Wilson', role: 'Director of IP', company: 'Quantum Tech', focus: 'Tech Transfer, Licensing', color: '#0ea5e9' }
];

export default function MentorshipPage() {
  const { user } = useAppStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Find a Mentor' | 'My Mentors'>('Find a Mentor');

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a]">
      {/* Split Hero Layout */}
      <div className="w-full bg-[#f3f0ff] dark:bg-[#15102a] overflow-hidden rounded-b-[3rem]">
        <div className="max-w-7xl mx-auto p-6 md:p-12 lg:p-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 max-w-2xl z-10">
              <div className="inline-flex items-center gap-2 bg-[#5a32fa]/10 text-[#5a32fa] px-4 py-2 rounded-full font-bold text-sm mb-6">
                <GraduationCap size={16} /> Mentorship Program
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6">
                Unlock Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a32fa] to-[#8b5cf6]">Potential</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-8">
                Connect with experienced IP professionals for guidance, career advice, and skill development. Or give back to the community by becoming a mentor yourself.
              </p>
              <button className="bg-[#5a32fa] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md shadow-[#5a32fa]/20 hover:shadow-lg hover:shadow-[#5a32fa]/30 hover:-translate-y-0.5 transition-all whitespace-nowrap">
                Become a Mentor
              </button>
            </div>

            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#5a32fa]/20 to-[#b892ff]/20 rounded-[3rem] blur-3xl transform rotate-6"></div>
              <img src="/mentorship-illustration.webp" alt="Mentorship" className="relative z-10 w-full h-[400px] object-cover rounded-[3rem] shadow-2xl border-4 border-white/50 dark:border-white/10" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2120&auto=format&fit=crop'; }} />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SCROLLABLE CONTENT */}
      <div className="w-full min-h-[calc(100vh-73px)]">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pt-8">

          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setActiveTab('Find a Mentor')}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'Find a Mentor' ? 'bg-[#5a32fa] text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
            >
              Find a Mentor
            </button>
            <button 
              onClick={() => setActiveTab('My Mentors')}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'My Mentors' ? 'bg-[#5a32fa] text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
            >
              My Mentors
            </button>
          </div>

          {/* Horizontal Ad Banner */}
          <a href="#" className="block w-full h-24 md:h-32 rounded-3xl overflow-hidden mb-10 shadow-md relative group border border-gray-100 dark:border-white/10">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#5a32fa]/90 to-[#b892ff]/90 flex items-center justify-center text-white opacity-90 group-hover:opacity-100 transition-opacity">
               <div className="flex flex-col items-center justify-center">
                 <span className="font-black text-2xl tracking-widest">AD SPACE</span>
                 <span className="text-sm font-medium opacity-80 mt-1 hidden md:block">Looking to sharpen your IP strategy? Explore the new Executive Masterclass Series.</span>
               </div>
            </div>
            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Sponsored
            </div>
          </a>

          {activeTab === 'My Mentors' && (
            <div className="space-y-6 pb-24">
              {/* Active Mentorship */}
              <div className="bg-white dark:bg-[#151c2c] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden group hover:border-[#00d26a]/40 transition-all duration-500">
                {/* Glowing background blob */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#00d26a] rounded-full blur-[100px] opacity-10 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none"></div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 relative z-10">
                  <Star className="text-[#ffc900]" fill="currentColor" size={24} /> My Active Mentorships
                </h2>
                
                <div className="bg-gray-50/80 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 relative z-10 backdrop-blur-sm group-hover:bg-white/50 dark:group-hover:bg-black/30 transition-all duration-300">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#00d26a] to-[#00a854] flex items-center justify-center text-white text-4xl font-bold flex-shrink-0 shadow-lg shadow-[#00d26a]/30">
                    A
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Amanda Thorne</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center justify-center sm:justify-start gap-1">
                      <Briefcase size={14} /> Partner at Thorne & Associates (Your Mentor)
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                      <span className="bg-[#b892ff]/10 text-[#5a32fa] px-4 py-2 rounded-xl text-xs font-bold border border-[#b892ff]/20 flex items-center gap-2">
                        <Calendar size={14} /> Next Session: Thursday 4PM
                      </span>
                      <span className="bg-white dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#00d26a]" /> Goal: Partnership Track
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full sm:w-auto mt-6 sm:mt-0">
                    <button className="bg-[#5a32fa] text-white hover:bg-[#4b28d6] px-8 py-3.5 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                      <MessageSquare size={18} /> Message
                    </button>
                    <button className="bg-white dark:bg-[#0f172a] text-gray-700 dark:text-gray-200 px-8 py-3.5 rounded-xl font-bold border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/40 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 text-sm">
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Find a Mentor' && (
            <div className="pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INITIAL_MENTORS.map((mentor) => (
                  <div key={mentor.id} className="bg-white dark:bg-[#151c2c] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden group hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50 hover:border-[#5a32fa]/40 transition-all duration-500 hover:-translate-y-1 flex flex-col relative">
                    
                    {/* Glowing background blob */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-10 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none" style={{ backgroundColor: mentor.color }}></div>
                    
                    <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: mentor.color, backgroundImage: `linear-gradient(135deg, ${mentor.color}, ${mentor.color}dd)` }}>
                          {mentor.name.charAt(0)}
                        </div>
                        <span className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-gray-200 dark:border-white/5 shadow-sm">
                          Mentor
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-black text-2xl text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-[#5a32fa] transition-colors">{mentor.name}</h3>
                        <p className="text-[14px] font-bold text-gray-500 dark:text-gray-400 mb-2">{mentor.role}</p>
                        <p className="text-xs font-bold text-gray-400 flex items-center gap-1.5 mb-6">
                           <Briefcase size={14} className="text-[#131313] dark:text-white" /> {mentor.company}
                        </p>
                        
                        <div className="bg-gray-50/80 dark:bg-black/20 p-4 rounded-2xl border border-gray-100 dark:border-white/5 mb-6 group-hover:bg-white dark:group-hover:bg-[#0f172a] transition-colors">
                          <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                             Expertise
                          </p>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-relaxed">{mentor.focus}</p>
                        </div>
                      </div>
                      
                      <button className="w-full bg-[#131313] dark:bg-white text-white dark:text-[#131313] py-4 rounded-xl font-black text-sm tracking-wide shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mt-auto relative overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">Request Mentorship <ArrowRight size={16} /></span>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: mentor.color }}></div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
