'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2, CheckCircle2, Star, Building2, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';

export default function AdminFirmsPage() {
  const [firms, setFirms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', website_url: '', headquarters: ''
  });

  const fetchFirms = async () => {
    setLoading(true);
    const { data } = await supabase.from('ip_firms').select('*').order('created_at', { ascending: false });
    if (data) setFirms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFirms();
  }, []);

  const handleToggle = async (id: string, field: 'is_verified' | 'is_featured', currentValue: boolean) => {
    const { error } = await supabase.from('ip_firms').update({ [field]: !currentValue }).eq('id', id);
    if (!error) {
      setFirms(firms.map(f => f.id === id ? { ...f, [field]: !currentValue } : f));
    }
  };

  const handleCreateFirm = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('ip_firms').insert([formData]).select();
    if (data && !error) {
      setFirms([data[0], ...firms]);
      setModalOpen(false);
      setFormData({ name: '', slug: '', description: '', website_url: '', headquarters: '' });
    } else {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <Building2 className="text-[#5a32fa]" /> Manage IP Firms
        </h1>
        <div className="flex items-center gap-3">
          <Link href="/admin/firms/claims" className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white px-4 py-2 rounded-xl font-bold transition-colors">
            View Claims
          </Link>
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-[#5a32fa] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4a24db] transition-colors"
          >
            <Plus size={18} /> Add Firm
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Firm Name</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-center">Status</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-center">Verified</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-center">Featured</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center"><Loader2 size={32} className="mx-auto animate-spin text-[#5a32fa]" /></td>
                </tr>
              ) : firms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No firms found.</td>
                </tr>
              ) : (
                firms.map(firm => (
                  <tr key={firm.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 font-bold text-gray-900 dark:text-white">
                      {firm.name}
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-center">
                      {firm.is_claimed ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Claimed</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold">Unclaimed</span>
                      )}
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-center">
                      <button onClick={() => handleToggle(firm.id, 'is_verified', firm.is_verified)}>
                        <CheckCircle2 className={`mx-auto ${firm.is_verified ? 'text-green-500' : 'text-gray-300'}`} />
                      </button>
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-center">
                      <button onClick={() => handleToggle(firm.id, 'is_featured', firm.is_featured)}>
                        <Star className={`mx-auto ${firm.is_featured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                      </button>
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-right">
                      <Link href={`/admin/firms/${firm.id}`} className="text-[#5a32fa] font-bold hover:underline flex items-center justify-end gap-1">
                        <Pencil size={14} /> Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white">Create New Firm</h2>
            <form onSubmit={handleCreateFirm} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Slug (URL-friendly)</label>
                <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Website</label>
                  <input value={formData.website_url} onChange={e => setFormData({...formData, website_url: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Headquarters</label>
                  <input value={formData.headquarters} onChange={e => setFormData({...formData, headquarters: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" className="flex-1 bg-[#5a32fa] text-white px-4 py-3 rounded-xl font-bold">Create Firm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
