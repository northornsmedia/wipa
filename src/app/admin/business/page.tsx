'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircle2, 
  Briefcase, 
  Trash2, 
  Search, 
  Clock, 
  ShieldCheck, 
  XCircle, 
  ExternalLink, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Eye, 
  X,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminBusinessProfilesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedBiz, setSelectedBiz] = useState<any | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchBusinesses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('business_profiles')
      .select('*, owner:profiles(id, first_name, last_name, email, avatar_url)')
      .order('created_at', { ascending: false });
    
    if (data) setBusinesses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleApprove = async (business: any) => {
    setActionLoadingId(business.id);
    try {
      const res = await fetch('/api/admin/business/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          action: 'approve'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve');

      setBusinesses(prev => prev.map(b => b.id === business.id ? { ...b, status: 'approved', is_verified: true } : b));
      if (selectedBiz?.id === business.id) {
        setSelectedBiz({ ...selectedBiz, status: 'approved', is_verified: true });
      }
      showToast(`✓ "${business.name}" approved & published to IP Directory!`);
    } catch (err: any) {
      alert('Error approving business: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (business: any) => {
    const reason = prompt('Please enter a reason for rejection (optional):', 'Profile information incomplete or unverified.');
    if (reason === null) return; // cancelled

    setActionLoadingId(business.id);
    try {
      const res = await fetch('/api/admin/business/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          action: 'reject',
          reason
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reject');

      setBusinesses(prev => prev.map(b => b.id === business.id ? { ...b, status: 'rejected', is_verified: false, rejection_reason: reason } : b));
      if (selectedBiz?.id === business.id) {
        setSelectedBiz({ ...selectedBiz, status: 'rejected', is_verified: false, rejection_reason: reason });
      }
      showToast(`Application for "${business.name}" has been marked as rejected.`);
    } catch (err: any) {
      alert('Error rejecting business: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleVerify = async (id: string, currentValue: boolean) => {
    const { error } = await supabase.from('business_profiles').update({ is_verified: !currentValue }).eq('id', id);
    if (!error) {
      setBusinesses(businesses.map(b => b.id === id ? { ...b, is_verified: !currentValue } : b));
      showToast(`Verification status updated.`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the profile for "${name}"?`)) return;
    const { error } = await supabase.from('business_profiles').delete().eq('id', id);
    if (!error) {
      setBusinesses(businesses.filter(b => b.id !== id));
      if (selectedBiz?.id === id) setSelectedBiz(null);
      showToast(`Profile deleted.`);
    }
  };

  const pendingCount = businesses.filter(b => (b.status === 'pending' || (!b.status && !b.is_verified))).length;
  const approvedCount = businesses.filter(b => b.status === 'approved' || b.is_verified).length;
  const rejectedCount = businesses.filter(b => b.status === 'rejected').length;

  const filteredBusinesses = businesses.filter(b => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (b.name && b.name.toLowerCase().includes(term)) ||
      (b.type && b.type.toLowerCase().includes(term)) ||
      (b.headquarters && b.headquarters.toLowerCase().includes(term)) ||
      (b.contact_email && b.contact_email.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    if (activeTab === 'pending') return b.status === 'pending' || (!b.status && !b.is_verified);
    if (activeTab === 'approved') return b.status === 'approved' || (b.is_verified && b.status !== 'rejected');
    if (activeTab === 'rejected') return b.status === 'rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Briefcase className="text-[#5a32fa]" /> Business Profiles & Review
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review submitted company profiles, approve & publish listings into the IP Firms Directory.
          </p>
        </div>
        <button
          onClick={fetchBusinesses}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh List
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock size={14} /> Pending Review
            {pendingCount > 0 && (
              <span className={`px-2 py-0.2 rounded-full text-[11px] font-black ${
                activeTab === 'pending' ? 'bg-white text-amber-600' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'approved'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck size={14} /> Approved & Published ({approvedCount})
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rejected'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <XCircle size={14} /> Rejected ({rejectedCount})
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-[#5a32fa] text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Submissions ({businesses.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, city, email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-[#5a32fa]/40"
          />
        </div>

      </div>

      {/* Submissions Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-white/5 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-white/10">
                <th className="py-4 px-6">Company</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Headquarters</th>
                <th className="py-4 px-4">Submitted By</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 size={32} className="mx-auto animate-spin text-[#5a32fa]" />
                  </td>
                </tr>
              ) : filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    No business profiles found in this tab.
                  </td>
                </tr>
              ) : (
                filteredBusinesses.map(biz => {
                  const isPending = biz.status === 'pending' || (!biz.status && !biz.is_verified);
                  const isApproved = biz.status === 'approved' || (biz.is_verified && biz.status !== 'rejected');
                  const isRejected = biz.status === 'rejected';

                  return (
                    <tr key={biz.id} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors group">
                      
                      {/* Company */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                            {biz.logo_url ? (
                              <img src={biz.logo_url} alt={biz.name} className="w-full h-full object-cover" />
                            ) : (
                              <Building2 size={20} className="text-[#5a32fa]" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white text-sm block">{biz.name}</span>
                            <span className="text-gray-500 text-[11px] block truncate max-w-[220px]">
                              {biz.tagline || biz.website_url || `/${biz.slug}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200/60 dark:border-purple-500/20">
                          {biz.type?.replace('_', ' ') || 'Company'}
                        </span>
                      </td>

                      {/* Headquarters */}
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                        {biz.headquarters || '—'}
                      </td>

                      {/* Submitted By */}
                      <td className="py-4 px-4">
                        <div className="text-gray-900 dark:text-white font-medium">
                          {biz.owner ? `${biz.owner.first_name || ''} ${biz.owner.last_name || ''}`.trim() || 'Owner' : 'Applicant'}
                        </div>
                        <div className="text-gray-500 text-[11px]">{biz.contact_email || biz.owner?.email || '—'}</div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Clock size={12} /> Pending Review
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck size={12} /> Live / Approved
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <XCircle size={12} /> Rejected
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Review Modal Button */}
                          <button
                            onClick={() => setSelectedBiz(biz)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Eye size={13} /> View
                          </button>

                          {/* Quick Approve button if pending */}
                          {isPending && (
                            <button
                              onClick={() => handleApprove(biz)}
                              disabled={actionLoadingId === biz.id}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-xs disabled:opacity-50"
                            >
                              {actionLoadingId === biz.id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                              Approve
                            </button>
                          )}

                          {/* Live Page Link if approved */}
                          {isApproved && (
                            <Link
                              href={`/platform/business/${biz.slug}`}
                              target="_blank"
                              className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#5a32fa] dark:bg-purple-950/40 dark:text-purple-300 hover:bg-[#5a32fa] hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink size={13} /> Live Page
                            </Link>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(biz.id, biz.name)}
                            title="Delete profile"
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Review Application Modal */}
      {selectedBiz && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 my-8 animate-in zoom-in-95 duration-200">
            
            {/* Modal Cover Header */}
            <div className="h-36 sm:h-44 w-full relative bg-slate-900 overflow-hidden">
              {selectedBiz.cover_image_url ? (
                <img src={selectedBiz.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-900 to-indigo-950" />
              )}
              <div className="absolute inset-0 bg-black/40" />
              <button
                onClick={() => setSelectedBiz(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 -mt-14 relative">
              <div className="flex items-end gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#0f172a] border-4 border-white dark:border-[#0f172a] shadow-xl overflow-hidden shrink-0 flex items-center justify-center">
                  {selectedBiz.logo_url ? (
                    <img src={selectedBiz.logo_url} alt={selectedBiz.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={32} className="text-[#5a32fa]" />
                  )}
                </div>
                <div className="pb-1">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedBiz.name}
                    {selectedBiz.is_verified && <CheckCircle2 size={20} className="text-emerald-500" />}
                  </h2>
                  <p className="text-[#5a32fa] font-bold text-sm">{selectedBiz.tagline || 'No tagline provided'}</p>
                </div>
              </div>

              {/* Status Banner */}
              <div className="mb-6 p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                selectedBiz.status === 'approved' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/40' 
                  : selectedBiz.status === 'rejected'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800/40'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/40'
              }">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> Review Status: <span className="uppercase">{selectedBiz.status || 'Pending Review'}</span>
                </span>
                {selectedBiz.slug && (
                  <span className="text-slate-500 font-mono text-[11px]">slug: /{selectedBiz.slug}</span>
                )}
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Business Type</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 capitalize">{selectedBiz.type?.replace('_', ' ')}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Headquarters</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{selectedBiz.headquarters || '—'}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Company Size</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{selectedBiz.company_size || '1-10'} employees</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Founded</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{selectedBiz.founded_year ? `Est. ${selectedBiz.founded_year}` : '—'}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Company Overview</h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                  {selectedBiz.description || 'No detailed description provided.'}
                </p>
              </div>

              {/* Specializations */}
              {selectedBiz.specializations && selectedBiz.specializations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Specializations / Practice Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBiz.specializations.map((spec: string) => (
                      <span key={spec} className="px-3 py-1 rounded-xl bg-purple-50 text-[#5a32fa] dark:bg-purple-900/30 dark:text-purple-300 font-bold text-xs">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Links */}
              <div className="mb-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-2 text-xs">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedBiz.website_url && (
                    <a href={selectedBiz.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline">
                      <Globe size={14} /> {selectedBiz.website_url}
                    </a>
                  )}
                  {selectedBiz.contact_email && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Mail size={14} /> {selectedBiz.contact_email}
                    </div>
                  )}
                  {selectedBiz.phone && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Phone size={14} /> {selectedBiz.phone}
                    </div>
                  )}
                  {selectedBiz.linkedin_url && (
                    <a href={selectedBiz.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                      <Globe size={14} /> LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  onClick={() => setSelectedBiz(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>

                {selectedBiz.status !== 'rejected' && (
                  <button
                    onClick={() => handleReject(selectedBiz)}
                    disabled={actionLoadingId === selectedBiz.id}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 font-bold text-xs transition-colors border border-rose-200 dark:border-rose-900/50"
                  >
                    Reject Application
                  </button>
                )}

                <button
                  onClick={() => handleApprove(selectedBiz)}
                  disabled={actionLoadingId === selectedBiz.id}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {actionLoadingId === selectedBiz.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  {selectedBiz.status === 'approved' ? 'Re-Publish to IP Directory' : 'Approve & Publish to IP Directory'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
