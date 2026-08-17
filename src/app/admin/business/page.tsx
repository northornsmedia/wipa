'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2, Briefcase, Trash2 } from 'lucide-react';

export default function AdminBusinessProfilesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = async () => {
    setLoading(true);
    const { data } = await supabase.from('business_profiles').select('*').order('created_at', { ascending: false });
    if (data) setBusinesses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleToggleVerify = async (id: string, currentValue: boolean) => {
    const { error } = await supabase.from('business_profiles').update({ is_verified: !currentValue }).eq('id', id);
    if (!error) {
      setBusinesses(businesses.map(b => b.id === id ? { ...b, is_verified: !currentValue } : b));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business profile?')) return;
    const { error } = await supabase.from('business_profiles').delete().eq('id', id);
    if (!error) {
      setBusinesses(businesses.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <Briefcase className="text-[#5a32fa]" /> Manage Business Profiles
        </h1>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Business Name</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Type</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Created At</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-center">Verified</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center"><Loader2 size={32} className="mx-auto animate-spin text-[#5a32fa]" /></td>
                </tr>
              ) : businesses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No business profiles found.</td>
                </tr>
              ) : (
                businesses.map(business => (
                  <tr key={business.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 font-bold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        {business.logo_url ? (
                          <img src={business.logo_url} alt={business.name} className="w-8 h-8 rounded bg-gray-100 object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-[#5a32fa]/10 text-[#5a32fa] flex items-center justify-center font-bold text-xs">
                            {business.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div>{business.name}</div>
                          {business.contact_email && <div className="text-xs font-normal text-gray-500">{business.contact_email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-sm">
                      <span className="capitalize">{business.type?.replace('_', ' ')}</span>
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-sm text-gray-500">
                      {new Date(business.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-center">
                      <button onClick={() => handleToggleVerify(business.id, business.is_verified)}>
                        <CheckCircle2 className={`mx-auto ${business.is_verified ? 'text-green-500' : 'text-gray-300 hover:text-green-300'}`} />
                      </button>
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-right">
                      <button 
                        onClick={() => handleDelete(business.id)}
                        className="text-red-500 hover:text-red-600 font-bold hover:underline flex items-center justify-end gap-1 ml-auto"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
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
