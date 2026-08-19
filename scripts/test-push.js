const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bepavczocyvaegkfxtvd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlcGF2Y3pvY3l2YWVna2Z4dHZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTExODU1NywiZXhwIjoyMTAwNjk0NTU3fQ.4yAo5-luUH9FWTKXS_vzKmEYGAsISrqUDN-q5XN-zM8';
const supabase = createClient(supabaseUrl, supabaseKey);

const vapidPublicKey = 'BPaCaAoYnDsPS5QjqvRTRzJ3e-fg3v_KG7WHgUVbZkiAI6PFRl-M1IsWAB1vW2EN09T7zlyVR5G1lqIw8NZIMR8';
const vapidPrivateKey = 'Z1HOxyw5LFt4B6KzBWViJgZYptP9M2_TV3Wgt7WhRnM';
webpush.setVapidDetails('mailto:connect@northonsprmarketing.com', vapidPublicKey, vapidPrivateKey);

async function testPush() {
  const { data: subs } = await supabase.from('push_subscriptions').select('*');
  console.log('Found subscriptions:', subs?.length);

  for (const sub of (subs || [])) {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth
      }
    };

    const payload = JSON.stringify({
      title: 'WIPA Test Alert 🔔',
      body: 'Testing instant push notifications!',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      url: '/platform/messages',
      tag: 'test-' + Date.now()
    });

    console.log('\nSending to:', sub.device_type, sub.endpoint.slice(0, 35));

    // Test with standard options (WITHOUT Topic header that causes Apple APNs BadTopic rejection)
    try {
      const res = await webpush.sendNotification(pushSubscription, payload, {
        TTL: 300,
        urgency: 'high'
      });
      console.log('SUCCESS! Status code:', res.statusCode);
    } catch (err) {
      console.error('FAILED! Status code:', err.statusCode, err.body || err.message);
    }
  }
}

testPush();
