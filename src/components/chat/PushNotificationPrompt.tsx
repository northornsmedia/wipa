'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Check, Loader2, Settings, X } from 'lucide-react';
import { getPushSubscriptionStatus, subscribeToPushNotifications } from '@/lib/pushNotifications';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

type PromptMode = 'hidden' | 'ask' | 'denied' | 'success';

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

  const dismissForever = () => {
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
          <button type="button" onClick={dismissForever} aria-label="Dismiss notification prompt" className="shrink-0 p-1 text-slate-400">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
