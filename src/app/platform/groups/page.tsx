'use client';

import { useState } from 'react';
import { ArrowLeft, Users, Search, Plus, Hash, ShieldCheck, Lock, Globe, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const MOCK_GROUPS = [
  {
    id: 1,
    name: "Trade Marks & Brand Protection",
    members: 1240,
    type: "Public",
    icon: "™",
    color: "#5a32fa",
    description: "Discuss international trademark law, anti-counterfeiting strategies, and brand protection.",
    isJoined: true
  },
  {
    id: 2,
    name: "Patent Prosecution Strategies",
    members: 856,
    type: "Private",
    icon: "P",
    color: "#00d26a",
    description: "A private forum for registered patent attorneys to share prosecution tips and experiences.",
    isJoined: false
  },
  {
    id: 3,
    name: "Women in IP Leadership",
    members: 3200,
    type: "Public",
    icon: "W",
    color: "#ff90e8",
    description: "Networking, mentorship, and support for female leaders in the intellectual property sector.",
    isJoined: true
  },
  {
    id: 4,
    name: "AI & Copyright Law",
    members: 642,
    type: "Public",
    icon: "AI",
    color: "#ffc900",
    description: "Debating the intersection of artificial intelligence, generative models, and copyright.",
    isJoined: false
  },
  {
    id: 5,
    name: "Life Sciences & Biotech IP",
    members: 415,
    type: "Private",
    icon: "🧬",
    color: "#b892ff",
    description: "Specialized discussions on patenting biological materials and pharma regulations.",
    isJoined: true
  },
  {
    id: 6,
    name: "Startup IP Strategy",
    members: 1890,
    type: "Public",
    icon: "🚀",
    color: "#ff4b4b",
    description: "Helping founders and startup counsel build robust IP portfolios on a budget.",
    isJoined: false
  }
];

export default function GroupsPage() {
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'All' | 'My Groups'>('All');

  const toggleJoin = (id: number) => {
    setGroups(groups.map(g => 
      g.id === id ? { ...g, isJoined: !g.isJoined } : g
    ));
  };

  const filteredGroups = groups.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : g.isJoined;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-8 border-b border-gray-100 dark:border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Users size={32} className="text-[#5a32fa]" />
              Discover Groups
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-medium mt-2">Find your community and join the discussion.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[#5a32fa] text-white px-6 py-3 rounded-xl border border-[#5a32fa] font-bold hover:bg-[#4927cb] transition-colors shadow-sm hover:-translate-y-0.5">
              <Plus size={20} strokeWidth={3} />
              Create Group
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            {['All', 'My Groups'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-xl font-bold border-4 transition-all ${
                  activeTab === tab
                    ? 'bg-gray-900 text-white border-[#131313] shadow-sm'
                    : 'bg-white dark:bg-[#0f172a] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/20 hover:border-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-md ml-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search groups by topic or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#5a32fa]/20 shadow-sm"
            />
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Creative Double-Wide Ad Card */}
          <div className="md:col-span-2 bg-[#0f172a] rounded-3xl border border-[#334155] shadow-xl relative overflow-hidden group">
            {/* Animated background gradient shapes */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#5a32fa]/20 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-[#ff90e8]/10 blur-3xl mix-blend-screen" />
            
            {/* Glossy inner container */}
            <div className="relative h-full w-full bg-white dark:bg-[#0f172a]/5 backdrop-blur-sm rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 border border-white/5">
              <div className="flex-1 text-left z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#0f172a]/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider mb-5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#00d26a] animate-ping" />
                  <span className="relative">Featured Partner</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#ff90e8] mb-4 leading-tight">
                  Master Intellectual Property Law in 2026
                </h2>
                <p className="text-gray-400 font-medium mb-8 max-w-md leading-relaxed text-sm">
                  Join 10,000+ professionals in our elite masterclass. Get lifetime access to premium resources, case studies, and a global network.
                </p>
                <button className="bg-white dark:bg-[#0f172a] text-[#131313] px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all flex items-center gap-2">
                  Claim Your Spot <ArrowUpRight size={18} />
                </button>
              </div>
              
              <div className="w-full md:w-[250px] relative z-10 hidden md:block">
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-tr from-[#5a32fa] to-[#ff90e8] p-1 rotate-3 group-hover:rotate-6 transition-transform duration-500 shadow-2xl">
                  <div className="w-full h-full bg-[#131313] rounded-xl overflow-hidden relative">
                     <img src="/AD7.png" alt="Ad" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 border-[3px] border-white/10 rounded-xl"></div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-6 bg-white dark:bg-[#0f172a] text-[#131313] px-4 py-2 rounded-xl font-bold text-sm shadow-xl -rotate-6 transform animate-bounce z-20">
                  50% OFF TODAY
                </div>
              </div>
            </div>
          </div>
          {filteredGroups.map(group => (
            <div 
              key={group.id} 
              className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-sm flex flex-col hover:-translate-y-0.5 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl text-white border border-gray-100 dark:border-white/10 shadow-sm"
                  style={{ backgroundColor: group.color }}
                >
                  {group.icon}
                </div>
                
                <div className="flex items-center gap-1 bg-[#f8f9fa] dark:bg-[#0f172a] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300">
                  {group.type === 'Public' ? <Globe size={14} /> : <Lock size={14} />}
                  {group.type}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{group.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-6 flex-1">{group.description}</p>
              
              <div className="flex items-center justify-between mt-auto border-t-2 border-gray-100 dark:border-white/10 pt-4">
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-bold text-sm">
                  <Users size={16} />
                  {group.members.toLocaleString()} members
                </div>
                
                <button 
                  onClick={() => toggleJoin(group.id)}
                  className={`px-6 py-2 rounded-xl border-2 font-bold text-sm transition-colors shadow-sm ${
                    group.isJoined 
                      ? 'bg-white dark:bg-[#0f172a] border-gray-300 text-gray-600 dark:text-gray-300 hover:border-gray-900' 
                      : 'bg-gray-900 border-[#131313] text-white hover:bg-[#5a32fa] hover:border-[#5a32fa]'
                  }`}
                >
                  {group.isJoined ? 'Joined' : 'Join Group'}
                </button>
              </div>
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-100 dark:border-white/10 border-dashed">
              <Hash size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No groups found</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Try adjusting your search filters to find what you're looking for.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
