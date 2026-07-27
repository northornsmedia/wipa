'use client';

import { useState } from 'react';
import { ArrowLeft, Users, Search, Plus, Hash, ShieldCheck, Lock, Globe } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b-4 border-[#131313] h-[72px] flex items-center px-6 sticky top-0 z-50">
        <Link 
          href="/platform" 
          className="flex items-center gap-2 text-gray-900 font-black hover:text-[#5a32fa] transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={3} />
          Back to Feed
        </Link>
        
        <div className="mx-auto font-black text-xl text-gray-900 tracking-tight">
          COMMUNITY GROUPS
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-8 border-b-4 border-[#131313] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <Users size={32} className="text-[#5a32fa]" />
              Discover Groups
            </h1>
            <p className="text-gray-600 font-medium mt-2">Find your community and join the discussion.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[#131313] text-white px-6 py-3 rounded-xl border-4 border-[#131313] font-black hover:bg-[#5a32fa] hover:border-[#5a32fa] transition-colors shadow-[4px_4px_0px_0px_#131313] hover:translate-y-1 hover:shadow-none">
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
                className={`px-6 py-3 rounded-xl font-black border-4 transition-all ${
                  activeTab === tab
                    ? 'bg-[#131313] text-white border-[#131313] shadow-[4px_4px_0px_0px_#131313]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'
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
              className="w-full bg-white border-4 border-[#131313] rounded-xl py-3 pl-12 pr-4 font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#5a32fa]/20 shadow-[4px_4px_0px_0px_#131313]"
            />
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <div 
              key={group.id} 
              className="bg-white rounded-[2rem] border-4 border-[#131313] p-6 shadow-[8px_8px_0px_0px_#131313] flex flex-col hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#131313] transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="w-16 h-16 rounded-[1rem] flex items-center justify-center font-black text-2xl text-white border-4 border-[#131313] shadow-[4px_4px_0px_0px_#131313]"
                  style={{ backgroundColor: group.color }}
                >
                  {group.icon}
                </div>
                
                <div className="flex items-center gap-1 bg-[#f8f9fa] px-3 py-1.5 rounded-lg border-2 border-gray-200 text-xs font-bold text-gray-600">
                  {group.type === 'Public' ? <Globe size={14} /> : <Lock size={14} />}
                  {group.type}
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-1">{group.name}</h3>
              <p className="text-sm text-gray-600 font-medium mb-6 flex-1">{group.description}</p>
              
              <div className="flex items-center justify-between mt-auto border-t-2 border-gray-100 pt-4">
                <div className="flex items-center gap-1.5 text-gray-500 font-bold text-sm">
                  <Users size={16} />
                  {group.members.toLocaleString()} members
                </div>
                
                <button 
                  onClick={() => toggleJoin(group.id)}
                  className={`px-6 py-2 rounded-xl border-2 font-bold text-sm transition-colors shadow-[2px_2px_0px_0px_#131313] ${
                    group.isJoined 
                      ? 'bg-white border-gray-300 text-gray-600 hover:border-gray-900' 
                      : 'bg-[#131313] border-[#131313] text-white hover:bg-[#5a32fa] hover:border-[#5a32fa]'
                  }`}
                >
                  {group.isJoined ? 'Joined' : 'Join Group'}
                </button>
              </div>
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-4 border-[#131313] border-dashed">
              <Hash size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-black text-gray-900 mb-2">No groups found</h3>
              <p className="text-gray-500 font-medium">Try adjusting your search filters to find what you're looking for.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
