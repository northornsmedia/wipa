import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { getFirebaseMessaging } from '@/lib/firebase-admin';

const rawPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const rawPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const rawSubject = process.env.VAPID_SUBJECT || 'mailto:connect@northonsprmarketing.com';

const vapidPublicKey = rawPublicKey.trim().replace(/^['"]|['"]$/g, '');
const vapidPrivateKey = rawPrivateKey.trim().replace(/^['"]|['"]$/g, '');
let vapidSubject = rawSubject.trim().replace(/^['"]|['"]$/g, '');
if (vapidSubject && !vapidSubject.startsWith('mailto:') && !vapidSubject.startsWith('https://')) {
  vapidSubject = `mailto:${vapidSubject}`;
}

export async function POST(req: Request) {
  try {
    if (vapidPublicKey && vapidPrivateKey) {
      try {
        webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
      } catch (vErr) {
        console.warn('VAPID set details warning:', vErr);
      }
    }

    const body = await req.json();
    const { 
      recipientId, 
      conversationId,
      senderId,
      senderName, 
      messageText, 
      mediaType, 
      senderAvatar 
    } = body;

    if (!recipientId && !conversationId) {
      return NextResponse.json({ error: 'recipientId or conversationId is required' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    let targetRecipientIds: string[] = [];
    if (recipientId && recipientId !== 'undefined' && recipientId !== 'null' && recipientId !== senderId) {
      targetRecipientIds.push(recipientId);
    }

    // If conversationId is provided, look up all other participants in the conversation
    if (conversationId) {
      const { data: participants, error: pError } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);

      if (participants && participants.length > 0) {
        const others = participants
          .map((p: any) => p.user_id)
          .filter((uid: string) => uid && uid !== senderId && uid !== 'undefined' && uid !== 'null');
        targetRecipientIds = Array.from(new Set([...targetRecipientIds, ...others]));
      }
    }

    console.log(`[CHAT_PUSH_DEBUG] recipients_resolved senderId=${senderId} conversationId=${conversationId} recipients=`, targetRecipientIds);

    if (targetRecipientIds.length === 0) {
      console.warn(`[CHAT_PUSH_DEBUG] No recipients resolved for conversationId=${conversationId}`);
      return NextResponse.json({ message: 'No recipients found for push notification', sentCount: 0 });
    }

    // 1. Fetch browser Web Push subscriptions and native FCM tokens.
    const { data: allSubscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', targetRecipientIds);
    const nativeTokens = (allSubscriptions || [])
      .filter((row: any) => row.device_type === 'android-native' && row.endpoint?.startsWith('fcm:'))
      .map((row: any) => ({ ...row, token: row.endpoint.slice(4) }));
    const subscriptions = (allSubscriptions || []).filter(
      (row: any) => !(row.device_type === 'android-native' && row.endpoint?.startsWith('fcm:'))
    );

    if (subError) {
      console.error('[CHAT_PUSH_DEBUG] Failed to query push_subscriptions:', subError);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    console.log(`[CHAT_PUSH_DEBUG] subscriptions_found web=${subscriptions.length} native=${nativeTokens.length}`, subscriptions.map((s: any) => ({
      userId: s.user_id,
      device_type: s.device_type,
      endpointHost: s.endpoint ? new URL(s.endpoint).hostname : 'unknown'
    })));

    if (subscriptions.length === 0 && nativeTokens.length === 0) {
      return NextResponse.json({ message: 'No registered push subscriptions found for recipient', sentCount: 0 });
    }

    // 2. Format title and body preview
    const title = senderName || 'New message';
    let bodyText = messageText || 'Sent you a message';
    if (mediaType === 'audio') bodyText = '🎤 Voice message';
    else if (mediaType === 'image') bodyText = '📷 Photo';
    else if (mediaType === 'video') bodyText = '🎥 Video';
    else if (mediaType === 'document') bodyText = '📄 Document';
    else if (mediaType === 'location') bodyText = '📍 Shared Location';

    const targetUrl = conversationId 
      ? `/platform/messages?chatId=${conversationId}` 
      : '/platform/messages';

    const payload = JSON.stringify({
      title,
      body: bodyText,
      icon: senderAvatar || '/icon-192.png',
      badge: '/icon-192.png',
      url: targetUrl,
      tag: `wipa-msg-${conversationId || senderId || 'chat'}`,
      timestamp: Date.now(),
    });

    console.log(`[CHAT_PUSH_DEBUG] payload title="${title}" body="${bodyText}" conversationId="${conversationId}"`);

    const expiredEndpoints: string[] = [];
    const expiredNativeTokens: string[] = [];
    const errorLogs: any[] = [];
    let sentCount = 0;

    // 3. Dispatch push to all active endpoints in parallel
    const pushPromises = subscriptions.map(async (sub: any) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      const endpointHost = sub.endpoint ? new URL(sub.endpoint).hostname : 'unknown';
      console.log(`[CHAT_PUSH_DEBUG] push_attempt platform=${sub.device_type} endpointHost=${endpointHost}`);

      try {
        const res = await webpush.sendNotification(pushSubscription, payload, {
          TTL: 300, // 5 minutes immediate high-priority delivery window
          urgency: 'high',
        });
        sentCount++;
        console.log(`[CHAT_PUSH_DEBUG] push_result platform=${sub.device_type} status=${res.statusCode}`);
      } catch (pushErr: any) {
        errorLogs.push({
          platform: sub.device_type,
          statusCode: pushErr?.statusCode || null,
          message: pushErr?.message || String(pushErr),
          body: pushErr?.body || null
        });
        console.error(`[CHAT_PUSH_DEBUG] push_result_error platform=${sub.device_type} status=${pushErr?.statusCode} body=${pushErr?.body || pushErr?.message}`);
        // If subscription is expired or unregistered by browser/OS, mark for deletion
        if (pushErr?.statusCode === 404 || pushErr?.statusCode === 410) {
          expiredEndpoints.push(sub.endpoint);
        }
      }
    });

    await Promise.allSettled(pushPromises);

    // 4. Dispatch native Android notifications through Firebase Cloud Messaging.
    if (nativeTokens.length > 0) {
      try {
        const messaging = getFirebaseMessaging();
        if (!messaging) {
          throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured');
        }
        const fcmResult = await messaging.sendEachForMulticast({
          tokens: nativeTokens.map((row: any) => row.token),
          data: {
            notificationType: 'message',
            title,
            body: bodyText,
            url: targetUrl,
            conversationId: conversationId || '',
            senderId: senderId || '',
            senderName: senderName || 'New message',
            senderAvatar: senderAvatar || '',
            timestamp: String(Date.now()),
          },
          android: {
            priority: 'high',
            ttl: 300000,
          },
        });
        sentCount += fcmResult.successCount;
        fcmResult.responses.forEach((response, index) => {
          if (response.success) return;
          const code = response.error?.code || 'unknown';
          errorLogs.push({ platform: 'android-native', code, message: response.error?.message });
          if (
            code === 'messaging/registration-token-not-registered' ||
            code === 'messaging/invalid-registration-token'
          ) {
            expiredNativeTokens.push(nativeTokens[index].token);
          }
        });
      } catch (fcmError: any) {
        console.error('[CHAT_PUSH_DEBUG] FCM dispatch failed:', fcmError);
        errorLogs.push({ platform: 'android-native', message: fcmError?.message || String(fcmError) });
      }
    }

    // 5. Prune expired browser subscriptions and native tokens from Supabase.
    if (expiredEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', expiredEndpoints);
    }
    if (expiredNativeTokens.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', expiredNativeTokens.map((token) => `fcm:${token}`));
    }

    // Record server execution event in analytics_events for DB audit
    await supabase.from('analytics_events').insert({
      event_name: 'push_api_dispatched',
      page_route: '/api/notifications/push',
      page_title: 'Push Dispatch Log',
      metadata: {
        conversationId,
        senderId,
        targetRecipientIds,
        subscriptionsCount: subscriptions.length,
        nativeTokensCount: nativeTokens.length,
        sentCount,
        expiredCount: expiredEndpoints.length + expiredNativeTokens.length,
        errorLogs,
        hasVapidPublicKey: !!vapidPublicKey,
        hasVapidPrivateKey: !!vapidPrivateKey
      }
    });

    return NextResponse.json({
      success: true,
      sentCount,
      prunedCount: expiredEndpoints.length + expiredNativeTokens.length,
      errorLogs,
    });
  } catch (err: any) {
    console.error('[CHAT_PUSH_DEBUG] Internal error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
