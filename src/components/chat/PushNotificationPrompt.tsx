'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import React, { useEffect, useState } from 'react';
import { Bell, Check, Settings, TriangleAlert, X } from 'lucide-react';
import { getPushSubscriptionStatus, subscribeToPushNotifications } from '@/lib/pushNotifications';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

type PromptMode = 'hidden' | 'ask' | 'confirm-dismiss' | 'denied' | 'success';

const DISMISSED_KEY = 'wipa_push_prompt_dismissed';
const DENIED_NOTICE_KEY = 'wipa_push_denied_notice_seen';

export const PushNotificationPrompt: React.FC = () => {
  const { user } = useAppStore();
  const [mode, setMode] = useState<PromptMode>('hidden');
  const [isEnabling, setIsEnabling] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(user?.id || null);

  useEffect(() => {
    let cancelled = false;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const checkPermission = async () => {
      let activeUserId = user?.id || null;
      if (!activeUserId) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        activeUserId = authUser?.id || null;
      }
      if (cancelled || !activeUserId) return;
      setCurrentUserId(activeUserId);

      const status = await getPushSubscriptionStatus();
      if (cancelled) return;

      if (status.permission === 'granted') {
        void subscribeToPushNotifications(activeUserId);
        return;
      }

      if (status.permission === 'denied') {
        if (!localStorage.getItem(DENIED_NOTICE_KEY)) {
          localStorage.setItem(DENIED_NOTICE_KEY, '1');
          setMode('denied');
          hideTimer = setTimeout(() => setMode('hidden'), 6000);
        }
        return;
      }

      if (!localStorage.getItem(DISMISSED_KEY)) {
        hideTimer = setTimeout(() => setMode('ask'), 1800);
      }
    };

    void checkPermission();
    return () => {
      cancelled = true;
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [user?.id]);

  const confirmDismissForever = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setMode('hidden');
  };

  const enableNotifications = async () => {
    let uid = currentUserId || user?.id || null;
    if (!uid) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      uid = authUser?.id || null;
    }
    if (!uid) return;

    setIsEnabling(true);
    const result = await subscribeToPushNotifications(uid);
    setIsEnabling(false);

    if (result.success) {
      setMode('success');
      setTimeout(() => setMode('hidden'), 1800);
      return;
    }

    const status = await getPushSubscriptionStatus();
    if (status.permission === 'denied') {
      localStorage.setItem(DISMISSED_KEY, '1');
      localStorage.setItem(DENIED_NOTICE_KEY, '1');
      setMode('denied');
      setTimeout(() => setMode('hidden'), 6000);
    }
  };

  if (mode === 'hidden') return null;

  if (mode === 'confirm-dismiss') {
    return (
      <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/45 p-4 backdrop-blur-[2px] sm:items-center">
        <div role="alertdialog" aria-modal="true" aria-labelledby="notification-dismiss-title" className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200 dark:border-white/10 dark:bg-slate-900 dark:text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            <TriangleAlert size={24} />
          </div>
          <h2 id="notification-dismiss-title" className="mt-5 text-xl font-black">Turn off notification reminders?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Are you sure? You won&apos;t receive message notifications, and WIPA won&apos;t ask you to enable them again on this device.
          </p>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-600 dark:bg-white/5 dark:text-slate-300">
            To turn them on later, open <strong>Settings → Apps → WIPA → Notifications</strong>. On the website, use your browser&apos;s <strong>Site Settings → Notifications</strong>.
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setMode('ask')} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">
              Keep Reminder
            </button>
            <button type="button" onClick={confirmDismissForever} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition active:scale-95 dark:bg-white dark:text-slate-900">
              Don&apos;t Ask Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-24 z-[80] flex justify-center md:bottom-6">
      <div className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-black/5 bg-white/95 px-3.5 py-3 text-slate-900 shadow-[0_10px_35px_rgba(15,23,42,0.18)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200 dark:border-white/10 dark:bg-slate-900/95 dark:text-white">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6600FF]/10 text-[#6600FF]">
          {mode === 'denied' ? <Settings size={18} /> : mode === 'success' ? <Check size={19} /> : <Bell size={18} />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-tight">
            {mode === 'ask' && 'Get message alerts'}
            {mode === 'denied' && 'Notifications are off'}
            {mode === 'success' && 'Notifications enabled'}
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
            {mode === 'ask' && 'Know when someone messages you.'}
            {mode === 'denied' && 'You can enable them anytime from your device Settings.'}
            {mode === 'success' && 'You will receive new message alerts.'}
          </p>
        </div>

        {mode === 'ask' && (
          <button
            type="button"
            onClick={() => void enableNotifications()}
            disabled={isEnabling}
            className="shrink-0 rounded-xl bg-[#6600FF] px-3 py-2 text-xs font-bold text-white active:scale-95 disabled:opacity-60"
          >
            {isEnabling ? <Loader2 size={15} className="animate-spin" /> : 'Enable'}
          </button>
        )}

        {mode === 'ask' && (
          <button type="button" onClick={() => setMode('confirm-dismiss')} aria-label="Dismiss notification prompt" className="shrink-0 p-1 text-slate-400">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
