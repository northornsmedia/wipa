// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  ExternalLink, 
  Radio, 
  Trash2, 
  Users,
  Building2,
  DollarSign,
  AlertCircle,
  Eye
} from 'lucide-react';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminWebinarsPage() {
  const [webinars, setWebinars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchWebinars = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setWebinars(data);
    } catch (err) {
      console.error('Error loading webinars in admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActionLoadingId(id);
    try {
      const { error } = await supabase
        .from('webinars')
        .update({ 
          approval_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setWebinars(prev => prev.map(w => w.id === id ? { ...w, approval_status: newStatus } : w));
    } catch (err: any) {
      console.error('Error updating webinar approval status:', err);
      alert('Failed to update status: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this webinar permanently?')) return;
    setActionLoadingId(id);
    try {
      const { error } = await supabase.from('webinars').delete().eq('id', id);
      if (error) throw error;
      setWebinars(prev => prev.filter(w => w.id !== id));
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingCount = webinars.filter(w => w.approval_status === 'in_review' || w.approval_status === 'pending').length;
  const approvedCount = webinars.filter(w => w.approval_status === 'approved').length;
  const rejectedCount = webinars.filter(w => w.approval_status === 'rejected').length;

  const filteredWebinars = webinars.filter(w => {
    // Tab filter
    if (activeTab === 'pending' && !(w.approval_status === 'in_review' || w.approval_status === 'pending')) return false;
    if (activeTab === 'approved' && w.approval_status !== 'approved') return false;
    if (activeTab === 'rejected' && w.approval_status !== 'rejected') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (w.title || '').toLowerCase().includes(q);
      const matchAuthor = (w.author_name || '').toLowerCase().includes(q);
      const matchSubmitter = (w.submitter_name || w.submitter_email || '').toLowerCase().includes(q);
      const matchOrg = (w.organization || '').toLowerCase().includes(q);
      return matchTitle || matchAuthor || matchSubmitter || matchOrg;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Video className="text-[#ff2a5f]" /> Webinar Submissions & Approvals
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Review live masterclasses, panel proposals, payments, and publish approved sessions directly to the Webinars hub.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/platform/resources/webinars"
            target="_blank"
            className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-xs"
          >
            <Eye size={15} /> View Live Hub
          </Link>
          <button
            onClick={fetchWebinars}
            className="bg-[#ff2a5f] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#e02553] transition-colors shadow-xs cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'pending'
                ? 'bg-[#ff2a5f] text-white shadow-md shadow-rose-500/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <Clock size={14} />
            <span>Pending Review</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-white text-[#ff2a5f]">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'approved'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <CheckCircle2 size={14} />
            <span>Approved ({approvedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'rejected'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <XCircle size={14} />
            <span>Rejected ({rejectedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'all'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <span>All ({webinars.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search title, host, submitter…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a5f]"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-12 text-gray-500">
          <Loader2 size={36} className="text-[#ff2a5f] animate-spin mb-3" />
          <span className="text-xs font-bold">Loading submissions…</span>
        </div>
      )}

      {/* Webinars List */}
      {!loading && filteredWebinars.length === 0 && (
        <div className="bg-white dark:bg-[#1e293b] p-12 rounded-2xl border border-gray-200 dark:border-white/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-400 flex items-center justify-center mx-auto">
            <Video size={24} />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No webinars found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            There are no webinar submissions matching your current tab or search filter.
          </p>
        </div>
      )}

      {!loading && filteredWebinars.length > 0 && (
        <div className="space-y-4">
          {filteredWebinars.map((webinar) => {
            const isPending = webinar.approval_status === 'in_review' || webinar.approval_status === 'pending';
            const isApproved = webinar.approval_status === 'approved';
            const isRejected = webinar.approval_status === 'rejected';
            const isActing = actionLoadingId === webinar.id;
            const paidMembership = webinar.submitter_membership || '';

            return (
              <div
                key={webinar.id}
                className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-gray-300 dark:hover:border-white/20 transition-all"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex flex-col sm:flex-row items-start gap-4 flex-1 min-w-0">
                  <div className="w-full sm:w-36 h-24 rounded-xl overflow-hidden bg-black/40 border border-gray-200 dark:border-white/10 shrink-0 relative">
                    <img 
                      src={webinar.cover_image_url || '/resourceimg1.jpg'} 
                      alt={webinar.title} 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                      {webinar.assigned_room || 'ROOM1'}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Approval Status Badge */}
                      {isPending && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                          <Clock size={11} /> Pending Review
                        </span>
                      )}
                      {isApproved && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 size={11} /> Approved & Live
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                          <XCircle size={11} /> Rejected
                        </span>
                      )}

                      {/* Format / Type */}
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-[#ff2a5f] border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
                        {webinar.resource_type || webinar.type || 'Webinar'}
                      </span>

                      {/* Subcategory */}
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
                        {webinar.subcategory || webinar.topic || 'General'}
                      </span>

                      {/* Payment Badge */}
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                        <DollarSign size={10} /> {paidMembership.includes('Paid') ? paidMembership : 'Paid Host (£199/£499)'}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-gray-900 dark:text-white leading-snug">
                      {webinar.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
                        <Users size={13} className="text-[#ff2a5f]" />
                        {webinar.author_name || 'Speaker'} {webinar.author_title ? `· ${webinar.author_title}` : ''}
                      </span>

                      {webinar.organization && (
                        <span className="flex items-center gap-1">
                          <Building2 size={13} /> {webinar.organization}
                        </span>
                      )}

                      {webinar.scheduled_at && (
                        <span className="flex items-center gap-1">
                          <Calendar size={13} /> {new Date(webinar.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} ({webinar.duration_minutes || 60}m)
                        </span>
                      )}
                    </div>

                    {/* Submitter info */}
                    <div className="text-[11px] text-gray-400 font-mono">
                      Submitter: {webinar.submitter_name || 'Host'} ({webinar.submitter_email || 'No email'}) {webinar.submitter_phone ? `· ${webinar.submitter_phone}` : ''}
                    </div>

                    {/* Meetn link */}
                    {webinar.url && (
                      <div className="text-[11px] text-[#ff2a5f] font-mono flex items-center gap-1">
                        <Radio size={11} /> {webinar.url}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Approval Actions */}
                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto lg:shrink-0 justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 dark:border-white/5">
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(webinar.id, 'approved')}
                        disabled={isActing}
                        className="px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-md inline-flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        {isActing ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        Approve & Publish Live
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(webinar.id, 'rejected')}
                        disabled={isActing}
                        className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 inline-flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </>
                  )}

                  {isApproved && (
                    <button
                      onClick={() => handleUpdateStatus(webinar.id, 'rejected')}
                      disabled={isActing}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 dark:border-white/10 transition-colors cursor-pointer"
                    >
                      Unpublish / Reject
                    </button>
                  )}

                  {isRejected && (
                    <button
                      onClick={() => handleUpdateStatus(webinar.id, 'approved')}
                      disabled={isActing}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-600 hover:bg-emerald-50 border border-emerald-300 transition-colors cursor-pointer"
                    >
                      Re-Approve
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(webinar.id)}
                    disabled={isActing}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
