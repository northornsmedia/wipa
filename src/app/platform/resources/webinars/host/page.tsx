// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Video, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Globe2, 
  Radio, 
  Zap, 
  HelpCircle, 
  Lock,
  ArrowRight,
  Clock,
  FileCheck2,
  Tv
} from 'lucide-react';
import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

export default function HostWebinarPricingPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [pastWebinarCount, setPastWebinarCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [initiatingCheckout, setInitiatingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) setUserProfile(profile);

        // Fetch past webinars count
        const { count, error } = await supabase
          .from('webinars')
          .select('id', { count: 'exact', head: true })
          .or(`author_id.eq.${user.id},submitter_id.eq.${user.id}`);

        setPastWebinarCount(count || 0);
      } catch (err) {
        console.error('Error fetching webinar pricing profile:', err);
        setPastWebinarCount(0);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.id]);

  const isFirstEvent = (pastWebinarCount ?? 0) === 0;
  const currentPrice = isFirstEvent ? 199 : 499;
  const isAdmin = Boolean(userProfile?.is_admin);

  const handleInitiateCheckout = async () => {
    if (!user?.id) {
      router.push('/login');
      return;
    }

    setInitiatingCheckout(true);
    setCheckoutError(null);

    try {
      const res = await fetch('/api/webinars/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to start Stripe Checkout');
      }

      // Redirect directly to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'Unable to connect to Stripe checkout. Please try again.');
      setInitiatingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-[#ff2a5f] selection:text-white pb-24">
      {/* Top Navigation Bar */}
      <div className="border-b border-white/10 bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link 
            href="/platform/resources/webinars" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Webinars
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[#ff2a5f] text-xs font-bold">
              <Radio size={12} className="animate-pulse" /> WIPA Broadcast Network
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-rose-500/30 text-xs font-bold tracking-wide uppercase text-rose-300">
            <Sparkles size={14} className="text-[#ff2a5f]" /> Host Live Masterclass or Panel
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Broadcast to the Global <br />
            <span className="bg-gradient-to-r from-[#ff2a5f] via-purple-400 to-[#5a32fa] bg-clip-text text-transparent">
              Intellectual Property Alliance
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Position your firm, practice, or expertise directly in front of 15,000+ global IP attorneys, corporate general counsels, patent directors, and technology innovators.
          </p>
        </div>

        {/* Pricing Cards Section */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* 1. First Event Card */}
          <div className={`relative rounded-3xl p-8 border transition-all ${
            isFirstEvent 
              ? 'bg-gradient-to-b from-[#181a24] to-[#0f111a] border-rose-500/50 shadow-2xl shadow-rose-500/10 ring-2 ring-[#ff2a5f]/30' 
              : 'bg-[#10121a]/60 border-white/10 opacity-70'
          }`}>
            {isFirstEvent && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#ff2a5f] to-purple-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg">
                ★ First Event Offer (Save £300)
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#ff2a5f]">Introductory Pass</span>
                <h3 className="text-2xl font-black text-white mt-1">First-Time Host</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-[#ff2a5f] flex items-center justify-center border border-rose-500/20">
                <Sparkles size={22} />
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-2 font-medium">
              Special introductory pricing exclusively for your very first live webinar or masterclass on WIPA.
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-black text-white tracking-tight">£199</span>
              <span className="text-sm font-semibold text-gray-400">/ event</span>
              <span className="text-sm line-through text-gray-500 ml-2">£499</span>
            </div>

            <ul className="mt-8 space-y-3.5 text-xs text-gray-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#ff2a5f] shrink-0" />
                <span>60–90 min interactive live broadcast with live Q&A</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#ff2a5f] shrink-0" />
                <span>Dedicated <strong>Meetn HD broadcast room</strong> allocation</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#ff2a5f] shrink-0" />
                <span>Featured placement on WIPA Webinar Hub & Calendar</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#ff2a5f] shrink-0" />
                <span>Permanent video recording archived in <strong>Resource Library</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#ff2a5f] shrink-0" />
                <span>Editorial team quality review & verification</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/10">
              {isFirstEvent ? (
                <button
                  onClick={handleInitiateCheckout}
                  disabled={initiatingCheckout}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-[#ff2a5f] to-[#e02553] hover:from-[#e02553] hover:to-[#c01e44] text-white shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {initiatingCheckout ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Preparing Checkout…
                    </>
                  ) : (
                    <>
                      Host Now · Pay £199 <ArrowRight size={16} />
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center py-3 text-xs font-bold text-gray-500 bg-white/5 rounded-xl border border-white/5">
                  Applied to your first event
                </div>
              )}
            </div>
          </div>

          {/* 2. Standard / Subsequent Events Card */}
          <div className={`relative rounded-3xl p-8 border transition-all ${
            !isFirstEvent 
              ? 'bg-gradient-to-b from-[#181a24] to-[#0f111a] border-purple-500/50 shadow-2xl shadow-purple-500/10 ring-2 ring-purple-500/30' 
              : 'bg-[#10121a]/60 border-white/10'
          }`}>
            {!isFirstEvent && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg">
                ★ Standard Host Pass
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-purple-400">Standard Tier</span>
                <h3 className="text-2xl font-black text-white mt-1">Returning Host</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Video size={22} />
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-2 font-medium">
              Standard rate for all subsequent masterclasses, multi-speaker panels, and corporate briefings.
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-black text-white tracking-tight">£499</span>
              <span className="text-sm font-semibold text-gray-400">/ event</span>
            </div>

            <ul className="mt-8 space-y-3.5 text-xs text-gray-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                <span>All features of First-Time Host included</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                <span>Multi-speaker panel capacity (up to 6 co-hosts)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                <span>Priority slot allocation on Meetn Broadcast Rooms</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                <span>Full attendee engagement & analytics report</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                <span>Expedited priority editorial approval review</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/10">
              {!isFirstEvent ? (
                <button
                  onClick={handleInitiateCheckout}
                  disabled={initiatingCheckout}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {initiatingCheckout ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Preparing Checkout…
                    </>
                  ) : (
                    <>
                      Host Now · Pay £499 <ArrowRight size={16} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleInitiateCheckout}
                  disabled={initiatingCheckout}
                  className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Select Standard (£499)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Admin Direct Pass Alert (If logged in as admin) */}
        {isAdmin && (
          <div className="mt-8 max-w-4xl mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-amber-400 shrink-0" />
              <span>You are logged in as an <strong>Administrator</strong>. You can bypass payment for internal testing and schedule immediately.</span>
            </div>
            <Link 
              href="/platform/resources/webinars/create?admin_bypass=1"
              className="bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[11px] shrink-0"
            >
              Admin Direct Launch
            </Link>
          </div>
        )}

        {/* Error message */}
        {checkoutError && (
          <div className="mt-6 max-w-md mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-bold">
            {checkoutError}
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-gray-500 font-semibold">
          <span className="flex items-center gap-2">
            <Lock size={15} className="text-gray-400" /> 256-Bit SSL Encrypted via Stripe
          </span>
          <span className="flex items-center gap-2">
            <FileCheck2 size={15} className="text-gray-400" /> Automatic VAT Receipt in GBP (£)
          </span>
          <span className="flex items-center gap-2">
            <Clock size={15} className="text-gray-400" /> Guaranteed Broadcast Slot Reservation
          </span>
        </div>

        {/* Process Steps (How it Works) */}
        <div className="mt-20 border-t border-white/10 pt-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white">How Hosting Works</h2>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              From checkout to live broadcast in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-[#12141e] border border-white/10 relative">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-[#ff2a5f] font-black text-sm flex items-center justify-center mb-4 border border-rose-500/20">
                01
              </div>
              <h4 className="text-base font-bold text-white mb-2">Host Now & Checkout</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Pay £199 for your first webinar (or £499 for subsequent events) securely through Stripe Checkout.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141e] border border-white/10 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 font-black text-sm flex items-center justify-center mb-4 border border-purple-500/20">
                02
              </div>
              <h4 className="text-base font-bold text-white mb-2">Build Your Session</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Unlock the full creation builder. Input your title, speaker bio, date, cover artwork, and auto-assign an HD Meetn room.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141e] border border-white/10 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-black text-sm flex items-center justify-center mb-4 border border-emerald-500/20">
                03
              </div>
              <h4 className="text-base font-bold text-white mb-2">Admin Review & Go Live</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Our editorial team verifies your submission. Once approved, your webinar is published live on the WIPA Webinars hub!
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
