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
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-[#151c2c] md:flex-row md:items-center md:justify-between">
          <div className="flex gap-1.5 overflow-x-auto">
            {['All', 'My Groups'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`rounded-xl border px-6 py-2.5 text-sm font-bold transition-all ${
                  activeTab === tab
                    ? 'border-gray-900 bg-gray-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-gray-900'
                    : 'border-transparent bg-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-50 dark:text-gray-300 dark:hover:border-white/10 dark:hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search groups by topic or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-12 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#5a32fa] focus:ring-4 focus:ring-[#5a32fa]/10 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

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
