# 🔔 Real-Time Native OS Background Push Notifications (Android & iOS PWA)

Comprehensive architectural specification and phased implementation task list for delivering native lock-screen push notifications with phone ringtones, vibration, sender name, message preview, and deep-link routing when the user's phone is locked or the app is closed.

---

## 🏗️ Architecture & Protocols

```
┌─────────────────────────┐
│ User A sends message in │
│       WIPA Chat         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Next.js Dispatch API    │
│ (/api/notifications/    │
│  push)                  │
└────────────┬────────────┘
             │
             ▼ (VAPID WebPush Signature)
┌──────────────────────────────────────────────────┐
│ Operating System Push Gateways                   │
│ • Google FCM (Firebase Cloud Messaging - Android)│
│ • Apple APNs (Apple Push Notification - iOS)     │
└────────────┬─────────────────────────────────────┘
             │
             ▼ (Direct OS System Push Signal)
┌──────────────────────────────────────────────────┐
│ User B's Locked Phone                            │
│ 📱 Phone screen lights up                        │
│ 🔊 Inbuilt native ringtone plays                 │
│ 📳 Haptic vibration triggers                     │
│ 💬 Lock Screen Banner:                           │
│    "Aman xyz"                                    │
│    "Hey bro! How are you?" / "🎤 Voice message"  │
└────────────┬─────────────────────────────────────┘
             │ (User taps notification on lock screen)
             ▼
┌──────────────────────────────────────────────────┐
│ Service Worker (sw.js)                           │
│ • Wakes up browser / PWA                         │
│ • Deep-links directly to recipient's chat window │
└──────────────────────────────────────────────────┘
```

---

## 📋 Phased Implementation Task List

### Phase 1: Database Schema & Storage
- [ ] **Create `push_subscriptions` Supabase Table**:
  - `id`: `uuid` (Primary Key, default `gen_random_uuid()`)
  - `user_id`: `uuid` (Foreign Key to `profiles.id`, `ON DELETE CASCADE`)
  - `endpoint`: `text` (Unique push URL assigned by Google/Apple)
  - `p256dh`: `text` (Client public key for encryption)
  - `auth`: `text` (Client authentication secret)
  - `device_type`: `text` (`android`, `ios`, `desktop`)
  - `created_at`: `timestamp with time zone` (default `now()`)
  - `updated_at`: `timestamp with time zone` (default `now()`)
- [ ] **Row Level Security (RLS)**:
  - Allow authenticated users to `INSERT`, `SELECT`, and `DELETE` their own push subscriptions.
- [ ] **Database Index**:
  - Index on `user_id` and `endpoint` for sub-millisecond lookup during dispatch.

---

### Phase 2: VAPID Key Generation & Environment Config
- [ ] **Install Backend Dependencies**:
  - `npm install web-push @types/web-push`
- [ ] **Generate VAPID Keypair**:
  - Generate standard NIST P-256 elliptic curve keys:
    - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (shared with browser to generate push subscription)
    - `VAPID_PRIVATE_KEY` (kept secret on server to sign push requests)
    - `VAPID_SUBJECT` (mailto contact URI e.g. `mailto:support@wipa.org`)
- [ ] **Configure `.env.local` & Production Deployment Variables**:
  - Add keys to environment variables and Vercel project settings.

---

### Phase 3: Service Worker Push Engine (`public/sw.js`)
- [ ] **Push Event Listener (`self.addEventListener('push')`)**:
  - Intercept background push payloads from Apple APNs and Google FCM.
  - Parse JSON payload `{ title, body, icon, badge, url, tag, timestamp }`.
  - Trigger `self.registration.showNotification(title, options)` with:
    - `icon`: `/icon-192.png`
    - `badge`: `/icon-192.png`
    - `vibrate`: `[200, 100, 200]`
    - `sound`: `'default'` (plays phone's native notification ringtone)
    - `data`: `{ url: payload.url }`
    - `renotify`: `true`
    - `tag`: Unique chat thread tag (groups notifications per contact)
- [ ] **Notification Click Listener (`self.addEventListener('notificationclick')`)**:
  - Close notification banner on user tap (`event.notification.close()`).
  - Search existing open client windows:
    - If WIPA tab is already open → focus it and navigate to target chat URL (`client.focus()`, `client.navigate(url)`).
    - If app is completely closed → launch new window opening straight to chat (`clients.openWindow(url)`).

---

### Phase 4: Client Push Subscription Hook & UI
- [ ] **Create Push Management Utility (`src/lib/pushNotifications.ts`)**:
  - Helper to convert VAPID public key from URL-safe base64 to `Uint8Array`.
  - `subscribeToPushNotifications(userId)`:
    - Check if service worker and `PushManager` are supported.
    - Request native permission via `Notification.requestPermission()`.
    - Register push subscription via `registration.pushManager.subscribe()`.
    - Persist subscription (`endpoint`, `keys.p256dh`, `keys.auth`) into Supabase DB.
  - `unsubscribeFromPushNotifications(userId)`:
    - Unsubscribe from browser push manager and remove from Supabase.
- [ ] **Notification Permission Prompt & Banner**:
  - Discrete prompt component on `/platform` or `/platform/messages` requesting notification permission if status is `'prompt'`.
  - Settings toggle in user profile to enable/disable push alerts.

---

### Phase 5: Server-Side Dispatch API (`/api/notifications/push`)
- [ ] **Create Next.js Route (`src/app/api/notifications/push/route.ts`)**:
  - Authenticate request.
  - Accept payload: `{ recipientId, senderName, messageText, mediaType, conversationId }`.
  - Format message preview:
    - Text: `messageText`
    - Audio: `🎤 Voice message`
    - Image: `📷 Photo`
    - Video: `🎥 Video`
    - Document: `📄 Document`
    - Location: `📍 Shared Location`
  - Query all active `push_subscriptions` for `recipientId` from Supabase.
  - Dispatch encrypted web-push payload to each endpoint in parallel using `webPush.sendNotification()`.
  - Handle expired / unsubscribed endpoints (status `410 Gone` or `404 Not Found`) by automatically pruning stale rows from `push_subscriptions`.

---

### Phase 6: Chat Message Pipeline Integration
- [ ] **Integrate with `sendMessageWithStatus()` in [`src/app/platform/messages/page.tsx`](file:///c:/Users/User/wipsmaster/WIPA/src/app/platform/messages/page.tsx)**:
  - When a message is sent, trigger `/api/notifications/push` with recipient details.
  - Background asynchronous dispatch so the UI sending speed remains instantaneous.

---

### Phase 7: Testing & Verification
- [ ] **Android Verification (Chrome & Installed PWA)**:
  - Lock phone screen → send message from another account → verify screen wakes up, native chime rings, and lock screen shows sender name & message.
  - Tap lock-screen notification → verify PWA opens directly to that conversation.
- [ ] **iOS Verification (iOS 16.4+ "Add to Home Screen" PWA)**:
  - Add to Home Screen on iPhone → enable notifications → lock iPhone screen.
  - Send message → verify iOS Notification Center / Lock Screen receives alert with sound and opens the chat upon tap.
- [ ] **Multi-device sync & battery optimization check**.
