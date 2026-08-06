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
          {/* Sponsored Ad Block */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Ad Card 1 Wrapper */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-200 dark:border-[#334155] shadow-md dark:shadow-xl relative overflow-hidden group min-h-[290px] flex-1">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#5a32fa]/10 dark:bg-[#5a32fa]/20 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-[#ff90e8]/10 blur-3xl mix-blend-multiply dark:mix-blend-screen" />
                
                <div className="relative h-full w-full bg-white/50 dark:bg-[#0f172a]/5 backdrop-blur-sm rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center border border-white/50 dark:border-white/5 justify-between">
                  {/* Text Content */}
                  <div className="z-10 flex flex-col w-full md:w-1/2">
                    <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#00d26a] animate-ping" />
                      <span className="relative">Featured Partner</span>
                    </div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-[#5a32fa] dark:from-white dark:via-blue-100 dark:to-[#ff90e8] mb-3 leading-tight">
                      Master Intellectual Property Law
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 font-medium text-sm leading-relaxed m-0">
                      Join 10,000+ professionals in our elite masterclass. Get lifetime access to resources.
                    </p>
                  </div>
                  
                  {/* Image Content */}
                  <div className="w-full md:w-1/2 h-48 md:h-56 relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-white/10">
                    <img src="/AD1.png" alt="Masterclass" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
              </div>
              
              {/* Separated Bottom Bar as CTA Button */}
              <button className="w-full bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white border border-gray-200 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1e293b] shadow-sm hover:shadow-md dark:shadow-xl dark:hover:shadow-2xl hover:-translate-y-1 transition-all rounded-2xl p-4 flex items-center justify-center shrink-0 font-bold text-base gap-2 cursor-pointer">
                Claim Your Spot Now <ArrowUpRight size={18} />
              </button>
            </div>

            {/* Ad Card 2 Wrapper */}
            <div className="md:col-span-1 flex flex-col gap-4">
              {/* Separated Top Bar for Custom Text */}
              <div className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-[#334155] shadow-sm rounded-2xl p-4 flex items-center justify-center shrink-0">
                <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5a32fa] animate-pulse" />
                  Find your trusted legal partner today
                </p>
              </div>

              <a href="https://advitamip.com/" target="_blank" rel="noopener noreferrer" className="bg-[#0f172a] rounded-3xl border border-[#334155] shadow-xl relative overflow-hidden group min-h-[290px] flex-1 block cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/80 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img src="/AD7.png" alt="Advertisement" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                
                <div className="absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm z-20">
                  Sponsored
                </div>
              </a>
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
