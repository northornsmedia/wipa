import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { getSupabaseServerClient } from '@/lib/supabase-server';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BPaCaAoYnDsPS5QjqvRTRzJ3e-fg3v_KG7WHgUVbZkiAI6PFRl-M1IsWAB1vW2EN09T7zlyVR5G1lqIw8NZIMR8';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || 'Z1HOxyw5LFt4B6KzBWViJgZYptP9M2_TV3Wgt7WhRnM';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:connect@northonsprmarketing.com';

export async function POST(req: Request) {
  try {
    try {
      webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
    } catch (vErr) {
      console.warn('VAPID set details warning:', vErr);
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

    console.log(`[Push Notification] Conversation: ${conversationId}, Sender: ${senderId}, Target Recipients:`, targetRecipientIds);

    if (targetRecipientIds.length === 0) {
      return NextResponse.json({ message: 'No recipients found for push notification', sentCount: 0 });
    }

    // 1. Fetch all active push subscriptions for the recipient(s)
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', targetRecipientIds);

    if (subError) {
      console.error('Failed to query push_subscriptions:', subError);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No registered push subscriptions found for recipient', sentCount: 0 });
    }

    // 2. Format title and body preview
    const title = senderName ? `${senderName} • WIPA` : 'New Message • WIPA';
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
      tag: `wipa-msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    });

    const expiredEndpoints: string[] = [];
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

      try {
        await webpush.sendNotification(pushSubscription, payload, {
          TTL: 300, // 5 minutes immediate high-priority delivery window
          urgency: 'high',
        });
        sentCount++;
      } catch (pushErr: any) {
        console.warn(`Push delivery failed for endpoint ${sub.endpoint.slice(0, 30)}...:`, pushErr?.statusCode || pushErr?.message);
        // If subscription is expired or unregistered by browser/OS, mark for deletion
        if (pushErr?.statusCode === 404 || pushErr?.statusCode === 410) {
          expiredEndpoints.push(sub.endpoint);
        }
      }
    });

    await Promise.allSettled(pushPromises);

    // 4. Prune expired subscription endpoints from Supabase
    if (expiredEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', expiredEndpoints);
    }

    return NextResponse.json({ success: true, sentCount, prunedCount: expiredEndpoints.length });
  } catch (err: any) {
    console.error('Push notification dispatch error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
