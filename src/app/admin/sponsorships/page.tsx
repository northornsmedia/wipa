'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DollarSign, Package, FileText, Check, X, Loader2, Plus, Edit } from 'lucide-react';

export default function AdminSponsorshipsPage() {
  const [activeTab, setActiveTab] = useState<'packages' | 'applications'>('applications');
  const [packages, setPackages] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const { data: pData } = await supabase.from('sponsorship_packages').select('*').order('price', { ascending: true });
      if (pData) setPackages(pData);
      
      const { data: aData } = await supabase
        .from('event_sponsorships')
        .select('*, event:events(title), package:sponsorship_packages(name, price)')
        .order('applied_at', { ascending: false });
      if (aData) setApplications(aData);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    await supabase.from('event_sponsorships').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', id);
    setApplications(applications.map(a => a.id === id ? { ...a, status: 'approved' } : a));
  };

  const handleReject = async (id: string) => {
    await supabase.from('event_sponsorships').update({ status: 'rejected' }).eq('id', id);
    setApplications(applications.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <DollarSign className="text-[#5a32fa]" /> Sponsorships
        </h1>
        {activeTab === 'packages' && (
          <button className="bg-[#5a32fa] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4a24db] transition-colors">
            <Plus size={18} /> New Package
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-2">
        <button 
          onClick={() => setActiveTab('applications')}
          className={`font-bold px-4 py-2 border-b-2 transition-colors ${activeTab === 'applications' ? 'border-[#5a32fa] text-[#5a32fa]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          <div className="flex items-center gap-2"><FileText size={16} /> Applications</div>
        </button>
        <button 
          onClick={() => setActiveTab('packages')}
          className={`font-bold px-4 py-2 border-b-2 transition-colors ${activeTab === 'packages' ? 'border-[#5a32fa] text-[#5a32fa]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          <div className="flex items-center gap-2"><Package size={16} /> Packages</div>
        </button>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 size={32} className="animate-spin text-[#5a32fa]" /></div>
        ) : activeTab === 'packages' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Package Name</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Price</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Benefits Overview</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Status</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {packages.map(pkg => (
                  <tr key={pkg.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">{pkg.name}</td>
                    <td className="p-4 font-medium text-gray-600 dark:text-gray-300">£{pkg.price}</td>
                    <td className="p-4 text-sm text-gray-500">
                      <div className="flex gap-2">
                        {pkg.logo_placement && <span className="bg-[#5a32fa]/10 text-[#5a32fa] px-2 py-0.5 rounded text-xs font-bold">Logo</span>}
                        {pkg.banner_placement && <span className="bg-[#5a32fa]/10 text-[#5a32fa] px-2 py-0.5 rounded text-xs font-bold">Banner</span>}
                        {pkg.social_mention && <span className="bg-[#5a32fa]/10 text-[#5a32fa] px-2 py-0.5 rounded text-xs font-bold">Social</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {pkg.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[#5a32fa] hover:underline font-bold text-sm flex items-center justify-end gap-1 w-full"><Edit size={14} /> Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Sponsor / Event</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Package</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Date Applied</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Status</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {applications.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">No applications found.</td></tr>
                ) : applications.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 dark:text-white">{app.sponsor_name}</div>
                      <div className="text-xs text-gray-500 max-w-[200px] truncate">{app.event?.title}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-white">{app.package?.name}</div>
                      <div className="text-xs text-gray-500">£{app.package?.price}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{new Date(app.applied_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        app.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'paid' ? 'bg-green-100 text-green-700' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {app.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleApprove(app.id)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Approve">
                            <Check size={16} />
                          </button>
                          <button onClick={() => handleReject(app.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Reject">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
