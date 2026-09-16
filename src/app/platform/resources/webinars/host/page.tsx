// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Video, 
  ArrowLeft, 
  Check, 
  Users, 
  ShieldCheck, 
  Radio, 
  Lock,
  ArrowRight,
  Clock,
  FileCheck2
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

        // Fetch past webinars count to determine pricing tier
        const { count } = await supabase
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
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] text-gray-900 dark:text-white selection:bg-[#ff2a5f]/20 pb-24 font-sans">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link 
            href="/platform/resources/webinars" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#ff2a5f] dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Webinars & Learning
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold bg-rose-50 text-[#ff2a5f] border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
              <Radio size={13} className="text-[#ff2a5f] animate-pulse" /> WIPA Host Network
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-[#ff2a5f] dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-black uppercase tracking-wider">
            <Video size={14} /> Masterclasses & Live Events
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Host a Webinar for the Global IP Community
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto">
            Position your firm, practice, or expertise directly in front of 15,000+ global IP attorneys, corporate general counsels, patent directors, and technology innovators.
          </p>
        </div>

        {/* Pricing Cards Section */}
        <div className="mt-12 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* 1. First Event Card */}
          <div className={`bg-white dark:bg-[#1e293b] rounded-2xl border-2 ${
            isFirstEvent 
              ? 'border-[#ff2a5f] ring-4 ring-[#ff2a5f]/10 shadow-xl' 
              : 'border-gray-200 dark:border-gray-800 shadow-sm opacity-85'
          } p-8 flex flex-col relative transition-all`}>
            {isFirstEvent && (
              <div className="absolute top-0 right-0 bg-[#ff2a5f] text-white text-xs font-black px-4 py-1.5 rounded-bl-xl tracking-wider uppercase shadow-xs">
                FIRST EVENT OFFER · SAVE £300
              </div>
            )}

            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#ff2a5f]">Introductory Pass</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">First-Time Host</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#ff2a5f] dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0">
                <Video size={22} />
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">
              Special introductory pricing exclusively for your very first live webinar or masterclass on WIPA.
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">£199</span>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">/ event</span>
              <span className="text-sm line-through text-gray-400 dark:text-gray-500 ml-2">£499</span>
            </div>

            <ul className="mt-8 space-y-3.5 text-sm text-gray-700 dark:text-gray-200 flex-1">
              <li className="flex items-center gap-3">
                <Check size={18} className="text-[#00d26a] shrink-0" strokeWidth={3} />
                <span>60–90 min interactive live broadcast with live Q&A</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={18} className="text-[#00d26a] shrink-0" strokeWidth={3} />
                <span>Dedicated Meetn HD broadcast studio room allocation</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={18} className="text-[#00d26a] shrink-0" strokeWidth={3} />
                <span>Featured placement on WIPA Webinar Hub & Calendar</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={18} className="text-[#00d26a] shrink-0" strokeWidth={3} />
                <span>Permanent video recording archived in Resource Library</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={18} className="text-[#00d26a] shrink-0" strokeWidth={3} />
                <span>Editorial team quality review & verification</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              {isFirstEvent ? (
                <button
                  onClick={handleInitiateCheckout}
                  disabled={initiatingCheckout}
                  className="w-full py-4 rounded-xl font-bold text-sm bg-[#ff2a5f] hover:bg-[#e02553] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
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
                <div className="text-center py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/60 rounded-xl">
                  Offer used for your first event
                </div>
              )}
            </div>
          </div>

          {/* 2. Standard / Subsequent Events Card */}
          <div className={`bg-white dark:bg-[#1e293b] rounded-2xl border-2 ${
            !isFirstEvent 
              ? 'border-[#ff2a5f] ring-4 ring-[#ff2a5f]/10 shadow-xl' 
              : 'border-gray-200 dark:border-gray-800 shadow-sm'
          } p-8 flex flex-col relative transition-all`}>
            {!isFirstEvent && (
              <div className="absolute top-0 right-0 bg-[#ff2a5f] text-white text-xs font-black px-4 py-1.5 rounded-bl-xl tracking-wider uppercase shadow-xs">
                STANDARD PASS
              </div>
            )}

            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Standard Tier</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Returning Host</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                <Users size={22} />
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">
              Standard rate for all subsequent masterclasses, multi-speaker panels, and corporate briefings.
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">£499</span>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">/ event</span>
            </div>

            <ul className="mt-8 space-y-3.5 text-sm text-gray-700 dark:text-gray-200 flex-1">
              <li className="flex items-center gap-3">
                <Check size={18} className="text-[#00d26a] shrink-0" strokeWidth={3} />
                <span>All features of First-Time Host included</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={18} className="text-[#00d26a] shrink-0" strokeWidth={3} />
                <span>Multi-speaker panel capacity (up to 6 co-hosts)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={18} className="text-[#00d26a] shrink-0" strokeWidth={3} />
                <span>Priority slot allocation on Meetn Broadcast Rooms</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={18} className="text-[#00d26a] shrink-0" strokeWidth={3} />
                <span>Full attendee engagement & analytics report</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={18} className="text-[#00d26a] shrink-0" strokeWidth={3} />
                <span>Expedited priority editorial approval review</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              {!isFirstEvent ? (
                <button
                  onClick={handleInitiateCheckout}
                  disabled={initiatingCheckout}
                  className="w-full py-4 rounded-xl font-bold text-sm bg-[#ff2a5f] hover:bg-[#e02553] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
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
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Select Standard (£499)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Admin Direct Pass Alert */}
        {isAdmin && (
          <div className="mt-8 max-w-4xl mx-auto p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span>You are logged in as an <strong>Administrator</strong>. You can bypass payment for internal scheduling and testing.</span>
            </div>
            <Link 
              href="/platform/resources/webinars/create?admin_bypass=1"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-[11px] shrink-0 transition-colors shadow-xs"
            >
              Admin Direct Launch
            </Link>
          </div>
        )}

        {/* Error message */}
        {checkoutError && (
          <div className="mt-6 max-w-md mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-300 text-xs text-center font-bold">
            {checkoutError}
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span className="flex items-center gap-2">
            <Lock size={15} className="text-gray-400" /> 256-Bit SSL Encrypted via Stripe
          </span>
          <span className="flex items-center gap-2">
            <FileCheck2 size={15} className="text-gray-400" /> Automatic VAT Invoice in GBP (£)
          </span>
          <span className="flex items-center gap-2">
            <Clock size={15} className="text-gray-400" /> Guaranteed Broadcast Studio Reservation
          </span>
        </div>

        {/* Process Steps */}
        <div className="mt-20 border-t border-gray-200 dark:border-gray-800 pt-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">How Hosting Works</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-normal">
              From checkout to live broadcast in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-800 shadow-sm relative">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#ff2a5f] font-black text-sm flex items-center justify-center mb-4 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
                01
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">Host Now & Checkout</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Pay £199 for your first webinar (or £499 for subsequent events) securely through Stripe Checkout.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-800 shadow-sm relative">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#ff2a5f] font-black text-sm flex items-center justify-center mb-4 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
                02
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">Build Your Session</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Unlock the dedicated webinar builder. Input your session title, speaker bio, date, cover artwork, and auto-assign an HD Meetn studio room.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-800 shadow-sm relative">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#ff2a5f] font-black text-sm flex items-center justify-center mb-4 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
                03
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">Admin Review & Go Live</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Our editorial team verifies your submission. Once approved, your webinar is published live on the WIPA Webinars hub.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
