'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Loader2, Check, X, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AdminFirmClaimsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('firm_claim_requests')
      .select('*, profiles(first_name, last_name, email)')
      .order('created_at', { ascending: false });
    if (data) setRequests(data);
    setLoading(false);
  };

  const handleApprove = async (request: any) => {
    // 1. Update the firm to set is_claimed and claimed_by
    const { error: firmError } = await supabase
      .from('ip_firms')
      .update({ is_claimed: true, claimed_by: request.requester_id, claimed_at: new Date().toISOString() })
      .eq('slug', request.firm_slug);

    if (firmError) {
      alert('Error updating firm: ' + firmError.message);
      return;
    }

    // 2. Update the request status
    await supabase
      .from('firm_claim_requests')
      .update({ status: 'approved' })
      .eq('id', request.id);

    fetchRequests();
  };

  const handleReject = async (id: string) => {
    await supabase
      .from('firm_claim_requests')
      .update({ status: 'rejected' })
      .eq('id', id);
    fetchRequests();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <ShieldAlert className="text-[#5a32fa]" /> Firm Claims
          </h1>
          <p className="text-gray-500 mt-1">Review requests from users claiming to represent IP firms.</p>
        </div>
        <Link href="/admin/firms" className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white px-4 py-2 rounded-xl font-bold transition-colors">
          Back to Firms
        </Link>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Date</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10">User</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Firm Requested</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10">Role / Proof</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-center">Status</th>
                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center"><Loader2 size={32} className="mx-auto animate-spin text-[#5a32fa]" /></td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No claim requests found.</td>
                </tr>
              ) : (
                requests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5">
                      <div className="font-bold text-gray-900 dark:text-white">{request.profiles.first_name} {request.profiles.last_name}</div>
                      <div className="text-xs text-gray-500">{request.profiles.email}</div>
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 font-bold text-gray-900 dark:text-white">
                      {request.firm_name || request.firm_slug}
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5">
                      <div className="font-medium text-sm mb-1">Role: {request.role}</div>
                      <div className="text-xs text-gray-500 max-w-xs truncate" title={request.proof}>{request.proof}</div>
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-center">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-700' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-100 dark:border-white/5 text-right">
                      {request.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleApprove(request)} className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg transition-colors" title="Approve">
                            <Check size={16} />
                          </button>
                          <button onClick={() => handleReject(request.id)} className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors" title="Reject">
                            <X size={16} />
                          </button>
                        </div>
                      )}
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
