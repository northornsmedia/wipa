'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { 
  Search, UserPlus, MapPin, Briefcase, Mail, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
  role?: string;
  location?: string;
};

export default function MembersDirectoryPage() {
  const { user } = useAppStore();
  const [members, setMembers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      let query = supabase.from('profiles').select('*').limit(50);
      
      if (searchQuery.trim() !== '') {
        query = query.ilike('full_name', `%${searchQuery}%`);
      }

      if (user?.email) {
        query = query.neq('email', user.email);
      }

      const { data, error } = await query;
      
      if (!error && data) {
        setMembers(data);
      }
      setLoading(false);
    };

    const delay = setTimeout(fetchMembers, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, user?.email]);

  const handleConnect = async (targetId: string) => {
    if (!user?.id) return;
    try {
      await supabase.from('connections').insert({
        requester_id: user.id,
        recipient_id: targetId,
        status: 'pending'
      });
      alert('Connection request sent!');
    } catch (err) {
      console.error(err);
      alert('Failed to send connection request.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-4 border-[#131313] h-[72px] flex items-center px-6 sticky top-0 z-50 shrink-0">
        <Link 
          href="/platform" 
          className="hidden md:flex items-center gap-2 text-gray-900 font-black hover:text-[#5a32fa] transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={3} />
          Back to Feed
        </Link>
        <div className="mx-auto font-black text-xl text-gray-900 tracking-tight">
          MEMBERS DIRECTORY
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {/* Search Bar */}
        <div className="bg-white rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] p-6 mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Search members by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5a32fa] font-medium text-lg transition-colors bg-[#f8f9fa]"
            />
            <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a32fa]"></div>
          </div>
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-white rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313] overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                <div className="h-24 bg-[#5a32fa]/10 border-b-2 border-[#131313] relative">
                  <div className="absolute -bottom-10 left-6 w-20 h-20 bg-white rounded-2xl border-4 border-[#131313] shadow-[4px_4px_0px_0px_#131313] flex items-center justify-center font-black text-2xl" style={{ color: ['#5a32fa', '#ff90e8', '#00d26a', '#ffc900'][Math.floor(Math.random() * 4)] }}>
                    {member.full_name ? member.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                
                <div className="p-6 pt-12 flex-1 flex flex-col">
                  <h3 className="font-black text-xl text-gray-900 mb-1 line-clamp-1">{member.full_name || 'Anonymous User'}</h3>
                  <p className="text-[#5a32fa] font-bold text-sm mb-4 flex items-center gap-1">
                    <Briefcase size={14} /> {member.role || 'WIPA Member'}
                  </p>
                  
                  <div className="flex flex-col gap-2 mb-6 text-sm font-medium text-gray-500">
                    <span className="flex items-center gap-2"><MapPin size={16} /> {member.location || 'Global'}</span>
                    <span className="flex items-center gap-2"><Mail size={16} /> Message via platform</span>
                  </div>
                  
                  <div className="mt-auto flex gap-3">
                    <button 
                      onClick={() => handleConnect(member.id)}
                      className="flex-1 bg-[#131313] text-white font-bold py-3 px-4 rounded-xl border-2 border-[#131313] hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserPlus size={18} /> Connect
                    </button>
                    <Link 
                      href={`/platform/messages?userId=${member.id}`}
                      className="w-12 flex items-center justify-center bg-[#fbe8d5] text-[#131313] font-bold rounded-xl border-2 border-[#131313] hover:bg-[#f6d5b3] transition-colors"
                    >
                      <Mail size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border-4 border-[#131313] shadow-[8px_8px_0px_0px_#131313]">
            <UsersRound size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-black text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-500 font-medium">Try adjusting your search query to find who you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}
