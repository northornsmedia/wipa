import { supabase } from './supabase';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

let nativeTapListenerReady = false;

async function ensureNativeTapListener() {
  if (nativeTapListenerReady || !Capacitor.isNativePlatform()) return;
  nativeTapListenerReady = true;
  await PushNotifications.addListener('pushNotificationActionPerformed', ({ notification }) => {
    const target = notification.data?.url || '/platform/messages';
    window.location.assign(target);
  });
}

async function registerNativePushToken(userId: string): Promise<string> {
  await ensureNativeTapListener();
  await PushNotifications.createChannel({
    id: 'wipa_messages',
    name: 'WIPA Messages',
    description: 'New messages and community alerts',
    importance: 5,
    visibility: 1,
    vibration: true,
  });

  const token = await new Promise<string>(async (resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('Push registration timed out')), 15000);
    const registration = await PushNotifications.addListener('registration', async ({ value }) => {
      window.clearTimeout(timeout);
      await registration.remove();
      await registrationError.remove();
      resolve(value);
    });
    const registrationError = await PushNotifications.addListener('registrationError', async ({ error }) => {
      window.clearTimeout(timeout);
      await registration.remove();
      await registrationError.remove();
      reject(new Error(error));
    });
    await PushNotifications.register();
  });

  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: userId,
      endpoint: `fcm:${token}`,
      p256dh: 'native',
      auth: 'native',
      device_type: `${Capacitor.getPlatform()}-native`,
      user_agent: navigator.userAgent,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,endpoint' }
  );
  if (error) throw error;
  return token;
}

/**
 * Converts a base64 string to a Uint8Array for VAPID applicationServerKey
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Detects device OS type for telemetry and push payload tailoring
 */
export function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/windows/.test(ua)) return 'windows';
  if (/macintosh|mac os x/.test(ua)) return 'macos';
  return 'desktop';
}

/**
 * Checks current push notification support and status
 */
export async function getPushSubscriptionStatus(): Promise<{
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
  isSubscribed: boolean;
}> {
  if (Capacitor.isNativePlatform()) {
    const status = await PushNotifications.checkPermissions();
    return {
      supported: true,
      permission: status.receive === 'granted' ? 'granted' : status.receive === 'denied' ? 'denied' : 'default',
      isSubscribed: status.receive === 'granted',
    };
  }

  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    !('PushManager' in window) ||
    !('Notification' in window)
  ) {
    return {
      supported: false,
      permission: 'unsupported',
      isSubscribed: false,
    };
  }

  const permission = Notification.permission;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return {
      supported: true,
      permission,
      isSubscribed: !!subscription,
    };
  } catch (err) {
    return {
      supported: true,
      permission,
      isSubscribed: false,
    };
  }
}

/**
 * Prompts user for notification permission and registers their device with Apple/Google push gateways
 */
export async function subscribeToPushNotifications(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!userId) return { success: false, error: 'User ID is required' };

  if (Capacitor.isNativePlatform()) {
    try {
      let permission = await PushNotifications.checkPermissions();
      if (permission.receive === 'prompt' || permission.receive === 'prompt-with-rationale') {
        permission = await PushNotifications.requestPermissions();
      }
      if (permission.receive !== 'granted') {
        return { success: false, error: 'Permission was denied by user' };
      }
      await registerNativePushToken(userId);
      return { success: true };
    } catch (err: any) {
      console.error('Native push registration failed:', err);
      return { success: false, error: err?.message || 'Native push registration failed' };
    }
  }

  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    !('PushManager' in window) ||
    !('Notification' in window)
  ) {
    return {
      success: false,
      error: 'Push notifications are not supported in this browser environment.',
    };
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
  if (!vapidPublicKey) {
    console.warn("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not configured in environment variables.");
    return { success: false, error: 'VAPID public key missing' };
  }

  try {
    // 1. Request native permission from browser / OS
    const permissionResult = await Notification.requestPermission();
    if (permissionResult !== 'granted') {
      return { success: false, error: 'Permission was denied by user' };
    }

    // 2. Ensure Service Worker is registered and ready
    let registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      registration = await navigator.serviceWorker.register('/sw.js');
    }
    await navigator.serviceWorker.ready;

    // 3. Check existing subscription or create new
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey as BufferSource,
      });
    }

    const subJson = subscription.toJSON();
    const endpoint = subJson.endpoint;
    const p256dh = subJson.keys?.p256dh;
    const auth = subJson.keys?.auth;

    if (!endpoint || !p256dh || !auth) {
      throw new Error('Failed to generate complete push subscription keys from device.');
    }

    const deviceType = getDeviceType();
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

    // 4. Save/Upsert into Supabase push_subscriptions table
    const { error: dbError } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: userId,
          endpoint,
          p256dh,
          auth,
          device_type: deviceType,
          user_agent: userAgent,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,endpoint' }
      );

    if (dbError) {
      console.error('Failed to save push subscription to Supabase:', dbError);
      throw dbError;
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error subscribing to push notifications:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

/**
 * Unsubscribes the current device from push notifications and removes it from Supabase
 */
export async function unsubscribeFromPushNotifications(userId: string): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      if (userId) {
        await supabase.from('push_subscriptions').delete().eq('user_id', userId).eq('device_type', 'android-native');
      }
      await PushNotifications.unregister();
      return true;
    } catch (err) {
      console.error('Error unregistering native push:', err);
      return false;
    }
  }

  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();

      if (userId && endpoint) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', userId)
          .eq('endpoint', endpoint);
      }
    }
    return true;
  } catch (err) {
    console.error('Error unsubscribing from push notifications:', err);
    return false;
  }
}
