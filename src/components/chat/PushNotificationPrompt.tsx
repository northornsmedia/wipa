'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Share, PlusSquare, ShieldAlert, Sparkles, Smartphone } from 'lucide-react';
import { getPushSubscriptionStatus, subscribeToPushNotifications, getDeviceType } from '@/lib/pushNotifications';
import { useAppStore } from '@/store/useAppStore';

export const PushNotificationPrompt: React.FC = () => {
  const { user } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [isIosSafariBrowser, setIsIosSafariBrowser] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [enabledSuccess, setEnabledSuccess] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const checkAndPrompt = async () => {
      if (typeof window === 'undefined') return;

      const ua = navigator.userAgent.toLowerCase();
      const isIos = /iphone|ipad|ipod/.test(ua);
      const isStandalone = (window.navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches;

      // On iOS inside regular Safari browser (not installed as PWA on Home Screen)
      if (isIos && !isStandalone) {
        setIsIosSafariBrowser(true);
        // Only show if user hasn't enabled yet
        setShowModal(true);
        return;
      }

      // Check browser notification status
      const status = await getPushSubscriptionStatus();
      if (status.permission === 'granted') {
        // Auto sync subscription with Supabase
        subscribeToPushNotifications(user.id).catch(() => {});
        setShowModal(false);
      } else if (status.permission === 'denied') {
        setPermissionDenied(true);
        setShowModal(false);
      } else {
        // Permission not yet granted: Keep modal open until enabled
        setShowModal(true);
      }
    };

    checkAndPrompt();
  }, [user?.id]);

  const handleEnableNotifications = async () => {
    if (!user?.id) return;
    setIsEnabling(true);
    try {
      const result = await subscribeToPushNotifications(user.id);
      if (result.success) {
        setEnabledSuccess(true);
        setTimeout(() => {
          setShowModal(false);
        }, 1500);
      } else {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'denied') {
          setPermissionDenied(true);
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 dark:border-white/10 relative animate-in zoom-in-95 duration-200">
        
        {/* Top Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#5a32fa] to-[#8d6eff] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#5a32fa]/30 text-white">
          <Bell size={32} className="animate-bounce" />
        </div>

        {isIosSafariBrowser ? (
          /* --- iOS Safari (Requires Add to Home Screen first) --- */
          <div className="text-center">
            <h3 className="text-xl font-black mb-2 tracking-tight">Enable iPhone Notifications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
              Apple requires adding WIPA to your Home Screen to receive sound and lock-screen alerts.
            </p>

            <div className="bg-gray-50 dark:bg-slate-800/80 rounded-2xl p-4 text-left text-xs space-y-3 mb-6 border border-gray-200/60 dark:border-white/5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#5a32fa] text-white flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    Tap the Share button <Share size={14} className="text-[#5a32fa]" />
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
                  <p className="text-gray-500 dark:text-gray-400 text-[11px]">Scroll down in the share sheet and tap Add.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Open from Home Screen &amp; Enable</p>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px]">Open the WIPA app icon on your screen to receive instant ringtone alerts.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#5a32fa] to-[#7952ff] hover:opacity-95 text-white font-bold text-sm shadow-md transition-transform active:scale-[0.98]"
            >
              I Understand / Got It
            </button>
          </div>
        ) : (
          /* --- Android / iOS PWA / Desktop Standard One-Tap Enable --- */
          <div className="text-center">
            <h3 className="text-xl font-black mb-2 tracking-tight">Turn On Message Notifications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Never miss a message! Hear phone ringtones and see instant previews when your screen is locked.
            </p>

            {enabledSuccess ? (
              <div className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg animate-in zoom-in-90 duration-200">
                <Check size={20} />
                <span>Notifications Enabled Successfully!</span>
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
                    <span>Enable Instant Notifications Now</span>
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
