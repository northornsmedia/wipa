'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { getPushSubscriptionStatus, subscribeToPushNotifications } from '@/lib/pushNotifications';
import { useAppStore } from '@/store/useAppStore';

export const PushNotificationPrompt: React.FC = () => {
  const { user } = useAppStore();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [enabledSuccess, setEnabledSuccess] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    // Check if dismissed previously in this browser session
    const isDismissed = sessionStorage.getItem('wipa_push_dismissed');
    if (isDismissed) return;

    const checkStatus = async () => {
      const status = await getPushSubscriptionStatus();
      if (status.supported && status.permission === 'default' && !status.isSubscribed) {
        setShowPrompt(true);
      } else if (status.supported && status.permission === 'granted' && !status.isSubscribed) {
        // Automatically sync subscription in background if already granted
        subscribeToPushNotifications(user.id).catch(() => {});
      }
    };

    checkStatus();
  }, [user?.id]);

  const handleEnable = async () => {
    if (!user?.id) return;
    setIsEnabling(true);
    try {
      const result = await subscribeToPushNotifications(user.id);
      if (result.success) {
        setEnabledSuccess(true);
        setTimeout(() => setShowPrompt(false), 2000);
      } else {
        setShowPrompt(false);
      }
    } catch (err) {
      setShowPrompt(false);
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('wipa_push_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="bg-gradient-to-r from-[#5a32fa] to-[#7952ff] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top duration-300 mx-3 sm:mx-6 my-2 shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Bell size={16} className="text-white animate-pulse" />
        </div>
        <div className="min-w-0">
          <p className="font-bold truncate">Get Message Alerts on your Lock Screen</p>
          <p className="text-[10px] text-white/80 truncate">Hear phone ringtones and see messages when your screen is locked.</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {enabledSuccess ? (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs">
            <Check size={14} /> Enabled!
          </span>
        ) : (
          <button
            onClick={handleEnable}
            disabled={isEnabling}
            className="px-3.5 py-1.5 rounded-xl bg-white text-[#5a32fa] hover:bg-white/90 font-black text-xs shadow-sm transition-transform active:scale-95 disabled:opacity-50"
          >
            {isEnabling ? 'Enabling...' : 'Enable Alerts'}
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
