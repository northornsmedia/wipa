'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Search } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function AdminUsersPage() {
  const { user: currentUser } = useAppStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
      
      if (search) {
        query = query.ilike('full_name', `%${search}%`);
      }
      
      const { data } = await query;
      if (data) setUsers(data);
      setLoading(false);
    };
    
    const delay = setTimeout(fetchUsers, 300);
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <Users className="text-[#5a32fa]" /> Manage Users
        </h1>
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a32fa]"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-gray-200 dark:border-white/10">User</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Role</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Member ID</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Joined</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 size={32} className="mx-auto animate-spin text-[#5a32fa]" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4 border-b border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#5a32fa] text-white flex items-center justify-center font-bold">
                            {(user.full_name || 'U').charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {user.full_name || 'Unnamed'}
                            {user.is_wipa_recommended && <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">⭐ WIPA</span>}
                          </p>
                          <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 font-medium">
                      {user.role || '-'}
                      {user.is_admin && <span className="ml-2 bg-[#5a32fa] text-white text-[10px] px-2 py-0.5 rounded-full">ADMIN</span>}
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 font-mono text-sm text-gray-600 dark:text-gray-300">
                      {user.member_id || '-'}
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-right flex justify-end gap-2 flex-wrap">
                      {!user.is_admin && (
                        <button 
                          onClick={async () => {
                            await supabase.from('profiles').update({ role: 'Verified' }).eq('id', user.id);
                            setUsers(users.map(u => u.id === user.id ? { ...u, role: 'Verified' } : u));
                          }}
                          className="text-sm font-bold text-[#00d26a] hover:underline whitespace-nowrap"
                        >
                          Verify
                        </button>
                      )}
                      
                      {user.is_wipa_recommended ? (
                        <button 
                          onClick={async () => {
                            await supabase.from('profiles').update({ is_wipa_recommended: false, recommended_at: null, recommended_by: null }).eq('id', user.id);
                            setUsers(users.map(u => u.id === user.id ? { ...u, is_wipa_recommended: false } : u));
                          }}
                          className="text-sm font-bold text-red-500 hover:underline whitespace-nowrap"
                        >
                          Revoke ⭐
                        </button>
                      ) : (
                        <button 
                          onClick={async () => {
                            await supabase.from('profiles').update({ is_wipa_recommended: true, recommended_at: new Date().toISOString(), recommended_by: currentUser?.id }).eq('id', user.id);
                            
                            // Send notification
                            await supabase.from('notifications').insert({
                              user_id: user.id,
                              actor_id: currentUser?.id,
                              type: 'badge_granted',
                              content: 'Congratulations! You have been awarded the WIPA Recommended badge.',
                              link: `/platform/profile/${user.id}`,
                              is_read: false
                            });

                            setUsers(users.map(u => u.id === user.id ? { ...u, is_wipa_recommended: true } : u));
                          }}
                          className="text-sm font-bold text-yellow-500 hover:underline whitespace-nowrap"
                        >
                          Grant ⭐
                        </button>
                      )}

                      <button className="text-sm font-bold text-[#5a32fa] hover:underline whitespace-nowrap">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
