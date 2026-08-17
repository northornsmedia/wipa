'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, Save, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function EditFirmPage({ params }: { params: { id: string } }) {
  const [firm, setFirm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchFirm = async () => {
      setLoading(true);
      const { data } = await supabase.from('ip_firms').select('*').eq('id', params.id).single();
      if (data) setFirm(data);
      setLoading(false);
    };
    fetchFirm();
  }, [params.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('ip_firms').update(firm).eq('id', firm.id);
    setSaving(false);
    if (error) alert('Error saving firm: ' + error.message);
    else alert('Firm updated successfully!');
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 size={40} className="animate-spin text-[#5a32fa]" /></div>;
  }

  if (!firm) {
    return <div className="text-center p-12">Firm not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <Link href="/admin/firms" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            Edit Firm: {firm.name}
          </h1>
          <p className="text-gray-500">Manage firm details, logo, and cover image.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Firm Name</label>
            <input required value={firm.name} onChange={e => setFirm({...firm, name: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Slug</label>
            <input required value={firm.slug} onChange={e => setFirm({...firm, slug: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Description</label>
            <textarea rows={4} value={firm.description || ''} onChange={e => setFirm({...firm, description: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Logo URL</label>
            <input value={firm.logo_url || ''} onChange={e => setFirm({...firm, logo_url: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Cover Image URL</label>
            <input value={firm.cover_image_url || ''} onChange={e => setFirm({...firm, cover_image_url: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Website URL</label>
            <input type="url" value={firm.website_url || ''} onChange={e => setFirm({...firm, website_url: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">LinkedIn URL</label>
            <input type="url" value={firm.linkedin_url || ''} onChange={e => setFirm({...firm, linkedin_url: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Headquarters</label>
            <input value={firm.headquarters || ''} onChange={e => setFirm({...firm, headquarters: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Size Range (e.g., 50-100)</label>
            <input value={firm.size_range || ''} onChange={e => setFirm({...firm, size_range: e.target.value})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Founded Year</label>
            <input type="number" value={firm.founded_year || ''} onChange={e => setFirm({...firm, founded_year: parseInt(e.target.value)})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Specializations (comma separated)</label>
            <input value={(firm.specializations || []).join(', ')} onChange={e => setFirm({...firm, specializations: e.target.value.split(',').map((s:string) => s.trim()).filter(Boolean)})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Jurisdictions (comma separated)</label>
            <input value={(firm.jurisdictions || []).join(', ')} onChange={e => setFirm({...firm, jurisdictions: e.target.value.split(',').map((s:string) => s.trim()).filter(Boolean)})} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>

          <div className="md:col-span-2 flex items-center gap-8 py-4 border-t border-gray-200 dark:border-white/10">
            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input type="checkbox" checked={firm.is_verified} onChange={e => setFirm({...firm, is_verified: e.target.checked})} className="w-5 h-5 rounded text-[#5a32fa]" />
              Verified Status
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input type="checkbox" checked={firm.is_featured} onChange={e => setFirm({...firm, is_featured: e.target.checked})} className="w-5 h-5 rounded text-[#5a32fa]" />
              Featured Firm
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-white/10">
          <button type="submit" disabled={saving} className="bg-[#5a32fa] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4a24db] transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} 
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
