'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Share, PlusSquare, Smartphone, X } from 'lucide-react';
import { getPushSubscriptionStatus, subscribeToPushNotifications } from '@/lib/pushNotifications';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

export const PushNotificationPrompt: React.FC = () => {
  const { user } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [isIosSafariBrowser, setIsIosSafariBrowser] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [enabledSuccess, setEnabledSuccess] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(user?.id || null);

  useEffect(() => {
    let isMounted = true;

    const initCheck = async () => {
      if (typeof window === 'undefined') return;

      // 1. Resolve user ID directly from Supabase session if store is still loading
      let activeUserId = user?.id || null;
      if (!activeUserId) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        activeUserId = authUser?.id || null;
      }

      if (activeUserId && isMounted) {
        setCurrentUserId(activeUserId);
      }

      const ua = navigator.userAgent.toLowerCase();
      const isIos = /iphone|ipad|ipod/.test(ua) || (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isStandalone = (window.navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches;

      // Case A: iPhone/iPad inside regular Safari browser (NOT standalone PWA)
      if (isIos && !isStandalone) {
        if (isMounted) {
          setIsIosSafariBrowser(true);
          setShowModal(true);
        }
        return;
      }

      // Case B: Android, Desktop, or iOS PWA installed on Home Screen
      const status = await getPushSubscriptionStatus();
      if (status.permission === 'granted') {
        if (activeUserId) {
          subscribeToPushNotifications(activeUserId).catch(() => {});
        }
        if (isMounted) setShowModal(false);
      } else if (status.permission === 'denied') {
        if (isMounted) setShowModal(false);
      } else {
        // Permission not yet granted -> Show modal
        if (isMounted) {
          setIsIosSafariBrowser(false);
          setShowModal(true);
        }
      }
    };

    initCheck();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleEnableNotifications = async () => {
    let uid = currentUserId || user?.id;
    if (!uid) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      uid = authUser?.id || null;
    }
    if (!uid) return;

    setIsEnabling(true);
    try {
      const result = await subscribeToPushNotifications(uid);
      if (result.success) {
        setEnabledSuccess(true);
        setTimeout(() => {
          setShowModal(false);
        }, 1500);
      } else {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'denied') {
          setShowModal(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnabling(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 dark:border-white/10 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button (allows user to temporarily dismiss if desired) */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Top Animated Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#5a32fa] to-[#8d6eff] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#5a32fa]/30 text-white">
          <Bell size={32} className="animate-bounce" />
        </div>

        {isIosSafariBrowser ? (
          /* --- iOS Safari Guide (Apple requires Add to Home Screen for Web Push) --- */
          <div className="text-center">
            <h3 className="text-xl font-black mb-1.5 tracking-tight">Enable iPhone Alerts 🔔</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Apple requires adding WIPA to your Home Screen to unlock lock-screen ringtones &amp; message alerts.
            </p>

            <div className="bg-gray-50 dark:bg-slate-800/80 rounded-2xl p-3.5 text-left text-xs space-y-3 mb-5 border border-gray-200/60 dark:border-white/5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#5a32fa] text-white flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    Tap the Share icon <Share size={14} className="text-[#5a32fa]" />
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px]">Located at the bottom bar of your Safari browser.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#5a32fa] text-white flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    Tap &quot;Add to Home Screen&quot; <PlusSquare size={14} className="text-[#5a32fa]" />
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px]">Scroll down in the menu and tap Add.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Open from Home Screen &amp; Enable</p>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px]">Open the WIPA app on your screen to receive instant sound alerts!</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#5a32fa] to-[#7952ff] hover:opacity-95 text-white font-bold text-sm shadow-md transition-transform active:scale-[0.98]"
            >
              I Understand / Got It
            </button>
          </div>
        ) : (
          /* --- Android / iOS PWA / Desktop Standard One-Tap Enable --- */
          <div className="text-center">
            <h3 className="text-xl font-black mb-1.5 tracking-tight">Turn On Message Alerts 🔔</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
              Hear notification sounds and see message previews even when your screen is locked.
            </p>

            {enabledSuccess ? (
              <div className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg animate-in zoom-in-90 duration-200">
                <Check size={20} />
                <span>Notifications Enabled!</span>
              </div>
            ) : (
              <button
                onClick={handleEnableNotifications}
                disabled={isEnabling}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#5a32fa] to-[#7952ff] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#5a32fa]/25 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isEnabling ? (
                  <span className="inline-block animate-pulse">Activating Device Ringtone...</span>
                ) : (
                  <>
                    <Bell size={18} />
                    <span>Enable Instant Alerts Now</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
