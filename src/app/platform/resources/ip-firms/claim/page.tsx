'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { Building2, ShieldCheck, Loader2 } from 'lucide-react';

export default function ClaimFirmPage() {
  const { user } = useAppStore();
  const searchParams = useSearchParams();
  const defaultSlug = searchParams.get('slug') || '';
  
  const [formData, setFormData] = useState({
    firmSlug: defaultSlug,
    firmName: '',
    role: '',
    proof: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please log in first.');
    
    setSubmitting(true);
    const { error } = await supabase.from('firm_claim_requests').insert({
      firm_slug: formData.firmSlug,
      firm_name: formData.firmName,
      role: formData.role,
      proof: formData.proof,
      requester_id: user.id
    });
    
    setSubmitting(false);
    
    if (error) {
      alert('Error submitting request: ' + error.message);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-[#020617] px-4">
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-10 max-w-lg w-full text-center border border-slate-200 dark:border-white/10 shadow-xl">
          <ShieldCheck size={64} className="mx-auto text-green-500 mb-6" />
          <h1 className="text-3xl font-black mb-4">Request Submitted</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Thank you for requesting to claim this firm profile. Our team will review your submission and notify you once approved.
          </p>
          <a href="/platform/resources/ip-firms" className="bg-[#5a32fa] text-white px-8 py-3 rounded-xl font-bold inline-block">
            Return to Directory
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-[#5a32fa] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 size={32} />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tight">Claim Firm Profile</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Verify your association with the firm to manage its profile, team, and settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
          {!defaultSlug && (
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Firm Name</label>
              <input required value={formData.firmName} onChange={e => setFormData({...formData, firmName: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Your Role at Firm</label>
            <input required placeholder="e.g. Managing Partner, Marketing Director" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Proof of Association</label>
            <textarea required rows={4} placeholder="Please provide your LinkedIn URL or explain how you are authorized to manage this firm's profile..." value={formData.proof} onChange={e => setFormData({...formData, proof: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5a32fa]/50" />
            <p className="text-xs text-slate-500 mt-2">Note: You should be logged in with a company email address for faster verification.</p>
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-[#5a32fa] text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-[#4a24db] transition-colors disabled:opacity-50">
            {submitting ? <Loader2 size={24} className="animate-spin" /> : 'Submit Claim Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
