// @ts-nocheck
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Video, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Clock, 
  Upload, 
  Image as ImageIcon, 
  Send, 
  Radio, 
  ShieldCheck, 
  Lock,
  Copy,
  AlertCircle
} from 'lucide-react';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

function WebinarCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const adminBypass = searchParams.get('admin_bypass') === '1';

  const { user } = useAppStore();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [verifiedAmount, setVerifiedAmount] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subcategory: 'AI in IP',
    resource_type: 'Upcoming Webinar',
    author_name: '',
    author_title: '',
    organization: '',
    scheduled_at: '',
    duration_minutes: 60,
    read_time: '60:00',
    max_attendees: 500,
    url: 'https://meetn.com/room1-2',
    assigned_room: 'ROOM1',
    cover_image_url: '/resourceimg1.jpg',
    summary: '',
    content: ''
  });

  const [uploadingCover, setUploadingCover] = useState(false);
  const [generatingMeetn, setGeneratingMeetn] = useState(false);
  const [meetnAssigned, setMeetnAssigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);

  // 1. Check user profile and verify Stripe session
  useEffect(() => {
    async function init() {
      if (!user?.id) {
        setVerifyingSession(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
          setFormData(prev => ({
            ...prev,
            author_name: profile.full_name || user.email?.split('@')[0] || '',
            author_title: profile.role || '',
            organization: profile.company || ''
          }));
        }

        // Admin bypass
        if (profile?.is_admin && adminBypass) {
          setIsPaymentVerified(true);
          setVerifiedAmount(0);
          setVerifyingSession(false);
          return;
        }

        // Verify Stripe session
        if (sessionId) {
          const res = await fetch(`/api/webinars/verify-session?session_id=${encodeURIComponent(sessionId)}`);
          const data = await res.json();

          if (res.ok && data.paid) {
            setIsPaymentVerified(true);
            setVerifiedAmount(data.amountGbp || 199);
          } else {
            setIsPaymentVerified(false);
          }
        } else if (profile?.is_admin) {
          // Admins can create anytime
          setIsPaymentVerified(true);
          setVerifiedAmount(0);
        } else {
          setIsPaymentVerified(false);
        }
      } catch (err) {
        console.error('Session verification error:', err);
        setIsPaymentVerified(false);
      } finally {
        setVerifyingSession(false);
      }
    }

    init();
  }, [user?.id, sessionId, adminBypass]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const cleanSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, title, slug: cleanSlug }));
  };

  const handleAssignMeetn = async () => {
    setGeneratingMeetn(true);
    try {
      const res = await fetch('/api/meetn/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduled_at: formData.scheduled_at,
          duration_minutes: formData.duration_minutes
        })
      });
      const data = await res.json();
      if (data.assigned_room_url) {
        setFormData(prev => ({
          ...prev,
          url: data.assigned_room_url,
          assigned_room: data.assigned_room_name
        }));
        setMeetnAssigned(true);
        setTimeout(() => setMeetnAssigned(false), 5000);
      }
    } catch (err) {
      console.error('Error auto-allocating Meetn room:', err);
    } finally {
      setGeneratingMeetn(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const safeName = `${Date.now()}_cover_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadErr } = await supabase.storage
        .from('covers')
        .upload(safeName, file, { upsert: true });

      if (uploadErr) {
        const { error: resErr } = await supabase.storage
          .from('resources')
          .upload(safeName, file, { upsert: true });

        if (resErr) {
          alert('Cover upload error: ' + uploadErr.message);
          return;
        }
        const { data } = supabase.storage.from('resources').getPublicUrl(safeName);
        if (data?.publicUrl) setFormData(prev => ({ ...prev, cover_image_url: data.publicUrl }));
      } else {
        const { data } = supabase.storage.from('covers').getPublicUrl(safeName);
        if (data?.publicUrl) setFormData(prev => ({ ...prev, cover_image_url: data.publicUrl }));
      }
    } catch (err: any) {
      alert('Error uploading cover: ' + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a webinar title');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanSlug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const isUserAdmin = Boolean(userProfile?.is_admin);
      const initialApprovalStatus = isUserAdmin ? 'approved' : 'in_review';

      const payload = {
        title: formData.title.trim(),
        slug: `${cleanSlug}-${Date.now()}`,
        category: 'webinars',
        subcategory: formData.subcategory,
        resource_type: formData.resource_type,
        type: formData.resource_type,
        author_name: formData.author_name || userProfile?.full_name || user?.email || 'Member Host',
        author_title: formData.author_title || userProfile?.role || 'Speaker',
        organization: formData.organization || userProfile?.company || 'WIPA Member',
        author_id: user?.id || null,
        scheduled_at: formData.scheduled_at ? new Date(formData.scheduled_at).toISOString() : new Date().toISOString(),
        duration_minutes: Number(formData.duration_minutes) || 60,
        read_time: formData.read_time || `${formData.duration_minutes}:00`,
        max_attendees: Number(formData.max_attendees) || 500,
        url: formData.url || 'https://meetn.com/room1-2',
        external_url: formData.url || 'https://meetn.com/room1-2',
        meetn_room_url: formData.url || 'https://meetn.com/room1-2',
        assigned_room: formData.assigned_room || 'ROOM1',
        assigned_room_url: formData.url || 'https://meetn.com/room1-2',
        meetn_room_id: formData.assigned_room || 'ROOM1',
        webinar_platform: 'meetn',
        cover_image_url: formData.cover_image_url || '/resourceimg1.jpg',
        summary: formData.summary || formData.content?.slice(0, 200) || '',
        description: formData.summary || formData.content?.slice(0, 200) || '',
        content: formData.content || '',
        is_featured: false,
        webinar_status: 'upcoming',
        // Track submitter and payment details
        submitter_id: user?.id || null,
        submitter_email: userProfile?.email || user?.email || '',
        submitter_name: userProfile?.full_name || formData.author_name || user?.email || '',
        submitter_phone: userProfile?.mobile_number || '',
        submitter_membership: verifiedAmount ? `Paid Host (£${verifiedAmount})` : (userProfile?.membership_tier || 'Member'),
        approval_status: initialApprovalStatus,
        tags: sessionId ? ['paid_host', `stripe:${sessionId}`] : ['paid_host'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: savedWebinar, error: saveErr } = await supabase
        .from('webinars')
        .insert(payload)
        .select()
        .single();

      if (saveErr) throw saveErr;

      setSuccessData({
        ...payload,
        id: savedWebinar?.id,
        is_pending: initialApprovalStatus === 'in_review'
      });
    } catch (err: any) {
      console.error('Error submitting webinar:', err);
      alert('Failed to submit webinar: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verifyingSession) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-white p-4">
        <Loader2 size={40} className="text-[#ff2a5f] animate-spin mb-4" />
        <h2 className="text-lg font-bold">Verifying Payment & Session…</h2>
        <p className="text-xs text-gray-400 mt-1">Connecting to Stripe secure gateway</p>
      </div>
    );
  }

  // If payment has not been verified and user is not an admin, block access with clear guidance
  if (!isPaymentVerified) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#10121a] border border-white/10 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[#ff2a5f] flex items-center justify-center mx-auto">
            <Lock size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Hosting Pass Required</h2>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              To schedule and broadcast a live masterclass or panel to the WIPA community, please select your hosting pass (£199 for your first event, £499 for subsequent events).
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/platform/resources/webinars/host"
              className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#ff2a5f] to-[#e02553] hover:from-[#e02553] hover:to-[#c01e44] text-white shadow-lg flex items-center justify-center gap-2 transition-all block"
            >
              Get Hosting Pass (£199 / £499)
            </Link>
            <Link
              href="/platform/resources/webinars"
              className="text-xs font-bold text-gray-500 hover:text-white transition-colors block"
            >
              Return to Webinars Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success Confirmation Screen
  if (successData) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white py-12 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-[#10121a] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle2 size={40} />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20 inline-flex items-center gap-1.5 mb-3">
              <Clock size={12} /> Pending Admin Approval
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Webinar Submitted Successfully!</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
              Your webinar <strong className="text-white">"{successData.title}"</strong> has been received. Our editorial team will review the session details and approve it for publishing on the live hub.
            </p>
          </div>

          {/* Assigned Room Info */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left space-y-2">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Assigned Meetn Broadcast Room</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/40 px-3 py-2.5 rounded-xl text-xs font-mono truncate text-white border border-white/10">
                {successData.url}
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(successData.url);
                  alert('Broadcast link copied to clipboard!');
                }} 
                className="bg-[#ff2a5f] hover:bg-[#e02553] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-1"
              >
                <Copy size={13} /> Copy
              </button>
            </div>
            <p className="text-[10.5px] text-gray-400 mt-1">
              You and your co-hosts can use this link to enter the broadcast studio at the scheduled time.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/platform/resources/webinars"
              className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-xs uppercase tracking-wider"
            >
              Return to Webinars Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Webinar Creation Form
  return (
    <div className="min-h-screen bg-[#07090e] text-white pb-24 selection:bg-[#ff2a5f]">
      {/* Top Navbar */}
      <div className="border-b border-white/10 bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link 
            href="/platform/resources/webinars/host" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Hosting Info
          </Link>
          <div className="flex items-center gap-3">
            {verifiedAmount !== null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <CheckCircle2 size={13} /> Payment Verified ({verifiedAmount === 0 ? 'Admin Pass' : `£${verifiedAmount} GBP`})
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2a5f]/15 text-[#ff2a5f] text-xs font-bold mb-3 border border-[#ff2a5f]/20">
            <Video size={13} /> Webinar Builder
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Configure Your Live Webinar</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Fill in your session information, speaker credentials, and select your live broadcast time slot.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-[#10121a] p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
          {/* Format & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Webinar Format / Type *
              </label>
              <select
                value={formData.resource_type}
                onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
              >
                {["Upcoming Webinar", "Live Masterclass", "Interactive Panel", "Workshop", "Executive Briefing", "Video Session"].map(f => (
                  <option key={f} value={f} className="bg-[#181a24]">{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Topic & Domain *
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
              >
                {["AI in IP", "Patent Law", "IP Litigation", "Trademark & Brand Protection", "Licensing & Tech Transfer", "Trade Secrets", "Copyright & Media", "IP Strategy & Valuation", "Global IP & Cross-Border", "Career & Leadership", "General"].map(t => (
                  <option key={t} value={t} className="bg-[#181a24]">{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Webinar Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AI in Patent Law: Opportunities, Liabilities, and Prosecution Risks"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff2a5f]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-300 font-mono focus:outline-none focus:border-[#ff2a5f]"
              />
            </div>
          </div>

          {/* Speaker & Host Details Card */}
          <div className="p-5 rounded-2xl bg-[#181a24] border border-white/10 space-y-4">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={15} className="text-[#ff2a5f]" /> Speaker & Host Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1.5">Speaker / Host Name *</label>
                <input
                  type="text"
                  required
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1.5">Professional Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Patent Counsel"
                  value={formData.author_title}
                  onChange={(e) => setFormData({ ...formData, author_title: e.target.value })}
                  className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1.5">Firm / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Global Tech Law LLP"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
                />
              </div>
            </div>
          </div>

          {/* Date, Duration & Attendees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Scheduled Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.scheduled_at}
                onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ff2a5f] [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Duration (Minutes) *
              </label>
              <input
                type="number"
                required
                min={15}
                max={300}
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Max Capacity
              </label>
              <input
                type="number"
                value={formData.max_attendees}
                onChange={(e) => setFormData({ ...formData, max_attendees: Number(e.target.value) })}
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ff2a5f]"
              />
            </div>
          </div>

          {/* Meetn HD Broadcast Room Auto-Allocator */}
          <div className="p-5 rounded-2xl bg-[#181a24] border border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio size={15} className="text-[#ff2a5f]" /> Meetn Live Room URL *
                </span>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Interactive HD live studio assigned automatically without room scheduling collisions.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAssignMeetn}
                disabled={generatingMeetn}
                className="bg-gradient-to-r from-[#ff2a5f] to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md self-start sm:self-auto cursor-pointer disabled:opacity-50"
              >
                {generatingMeetn ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                Auto-Assign Room
              </button>
            </div>

            <div className="relative">
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-[#ff2a5f]"
              />
              <span className="absolute right-3 top-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                {formData.assigned_room}
              </span>
            </div>

            {meetnAssigned && (
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                ✓ Available room collision check passed. Assigned: {formData.assigned_room}
              </p>
            )}
          </div>

          {/* Cover Image Artwork */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Webinar Cover Artwork / Thumbnail
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-28 h-20 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shrink-0 relative">
                <img
                  src={formData.cover_image_url}
                  alt="Webinar Cover Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  placeholder="Cover image URL or upload file"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-[#ff2a5f]"
                />
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white cursor-pointer transition-colors">
                  {uploadingCover ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  <span>{uploadingCover ? 'Uploading Cover…' : 'Upload Image File'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Summary / Tagline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Session Summary / Key Takeaway *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Brief 1-2 sentence overview of what attendees will learn from this session..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff2a5f]"
            />
          </div>

          {/* Detailed Agenda & Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Detailed Agenda & Speaker Bio
            </label>
            <textarea
              rows={5}
              placeholder="Detailed session breakdown, bullet points, discussion topics, and speaker background..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff2a5f]"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#ff2a5f]" />
              <span>Submissions are submitted to Admin review before appearing live.</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#ff2a5f] to-[#e02553] hover:from-[#e02553] hover:to-[#c01e44] text-white shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting for Review…
                </>
              ) : (
                <>
                  <Send size={15} /> Submit for Admin Approval
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function WebinarCreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-white">
        <Loader2 size={40} className="text-[#ff2a5f] animate-spin" />
      </div>
    }>
      <WebinarCreateContent />
    </Suspense>
  );
}
