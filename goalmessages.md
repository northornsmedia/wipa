# WIPA Messages Architecture & Full Integration Blueprint (`goalmessages.md`)

> **Executive Summary**: This document provides the complete root-cause analysis of current messaging glitches ("what has been built vs. what is making it die"), along with the exact database schema, realtime presence/tick lifecycle, profile avatar integration, and auto-scroll specifications to make the WIPA messaging experience as fast, reliable, and fluid as WhatsApp.

---

## 1. What Has Been Built vs. What Is Causing Issues ("What Is Making It Die")

### Current Implemented Features
- Direct message thread initialization between two users.
- Text, camera photo capture, audio voice recording, file upload, and geolocation sharing.
- Optimistic message sending with status indicators (clock, single tick, double tick, error retry).
- Offline banner and offline queue state detection.
- Mobile chat drawer toggle (`showMobileChat`).

### Critical Glitches & Root Causes

| Issue / Glitch | Why It's Happening (Root Cause) | Solution Required |
| :--- | :--- | :--- |
| **Missing Real Profile Pictures** | The `Chat` interface in `messages/page.tsx` lacks `avatarUrl`. Although Supabase joins `profiles(avatar_url)`, the frontend mapped object drops `avatarUrl`, forcing every conversation to fall back to a colored circle with letter initial. | Add `avatarUrl?: string` to `Chat` and `Message` types, map `other.avatar_url`, and render cached next/image with fallback initial avatar. |
| **Realtime Read Receipts Don't Update** | `supabase.channel()` in `useEffect` only listens for `event: 'INSERT'`. When the recipient opens the chat and updates `is_read = true`, no event is caught by the sender. The sender's ticks remain stuck on single/double grey until a manual browser refresh. | Listen for `event: 'UPDATE'` on the `messages` table filtered by `conversation_id`, and update the matching message state in the sender's active conversation. |
| **Lack of WhatsApp-Grade 3-Tier Tick Status** | The database table `messages` only has a binary `is_read boolean`. It lacks `delivered_at` or presence checks. Therefore, the app cannot distinguish between: (1) Sent to server / recipient offline (1 tick), (2) Delivered to device / recipient online (2 grey ticks), and (3) Read / opened (2 purple ticks). | Implement Supabase Presence channel (`presence_state`) + message status fields (`sent` -> `delivered` -> `read`). |
| **Scroll Jitter & Not Defaulting to Bottom** | `messagesEndRef.current?.scrollIntoView()` fires on every message update without checking if the user is already at the bottom or if it's the initial render. Images/media without fixed aspect ratios shift the DOM height after loading, breaking scroll position. | Implement an instant auto-scroll (`behavior: 'auto'`) on chat mount + smooth scroll on new messages only when user is near bottom (`stick-to-bottom` observer). Set fixed min-height on media containers. |
| **Duplicate Messages & Key Conflicts** | Optimistic messages are created with `Date.now()` temporary IDs. When realtime `INSERT` triggers, if `sender_id === user.id`, it is ignored, but during network reconnects or refetches, temporary IDs conflict with real UUIDs from Supabase. | Use a client-generated UUID (`crypto.randomUUID()`) passed as the message ID to Supabase DB so optimistic IDs match DB IDs 1:1. |
| **No Typing Indicator / Online Status** | Header shows static "Active" count rather than live "online / typing..." state. | Use Supabase Realtime Broadcast for typing events (`typing:start`, `typing:stop`) and Presence for "online / last seen at". |

---

## 2. WhatsApp-Grade Tick Status Specification

| Status | Visual Icon | Color Code | Condition / Meaning |
| :--- | :--- | :--- | :--- |
| **Queued / Sending** | `<Clock size={12} className="animate-spin" />` | `#94a3b8` (Slate 400) | Message is queued locally or currently in flight via HTTP/Supabase socket. |
| **Sent (1 Tick)** | `<Check size={14} />` | `#94a3b8` (Slate 400) | Message is saved in Supabase database. Recipient is currently **offline / not in chat**. |
| **Delivered (2 Grey Ticks)** | `<CheckCheck size={14} />` | `#94a3b8` (Slate 400) | Recipient is **online / connected** via Supabase Presence or notification has reached device. |
| **Read / Seen (2 Purple Ticks)** | `<CheckCheck size={14} />` | `#5a32fa` (WIPA Purple / `#a855f7`) | Recipient has **opened the chat** and the message has entered their active viewport. |
| **Failed** | `<AlertCircle size={12} /> Retry` | `#f43f5e` (Rose 500) | Network dropped or storage upload failed. Clickable retry action. |

---

## 3. Database Schema & Migration Requirements

### 3.1. Supabase SQL Schema Enhancements

```sql
-- 1. Ensure messages table has full delivery and read telemetry
ALTER TABLE public.messages 
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS media_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS temp_id TEXT DEFAULT NULL;

-- 2. Index for high-performance conversation querying & unread counting
CREATE INDEX IF NOT EXISTS idx_messages_conversation_lookup 
  ON public.messages (conversation_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_messages_unread_lookup 
  ON public.messages (conversation_id, is_read, sender_id);

-- 3. Trigger to auto-update conversation updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON public.messages;
CREATE TRIGGER trigger_update_conversation_timestamp
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();
```

---

## 4. Frontend Integration Blueprint

### 4.1. Updated TypeScript Interfaces (`src/app/platform/messages/page.tsx`)

```typescript
export type MessageStatus = 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type Message = {
  id: string;
  conversation_id: string;
  text?: string;
  sender: 'me' | 'them';
  sender_id: string;
  sender_avatar?: string;
  sender_name?: string;
  time: string;
  created_at: string;
  type: 'text' | 'image' | 'video' | 'document' | 'location' | 'audio';
  mediaUrl?: string;
  status: MessageStatus;
  is_read: boolean;
  delivered_at?: string | null;
  read_at?: string | null;
};

export type Chat = {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
  initial: string;
  color: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  isOnline?: boolean;
  isTyping?: boolean;
  messages: Message[];
  participantId?: string;
};
```

---

### 4.2. Realtime Subscription Pipeline (Inserts + Updates + Presence)

```typescript
// Channel subscription inside active chat lifecycle:
useEffect(() => {
  if (!activeChatId || !user?.id) return;

  const channel = supabase.channel(`chat:${activeChatId}`, {
    config: {
      presence: { key: user.id },
    },
  });

  channel
    // 1. Listen for new incoming messages
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${activeChatId}`,
    }, (payload) => {
      const m = payload.new;
      if (m.sender_id === user.id) {
        // Update optimistic message with confirmed DB timestamp
        setConversations(prev => prev.map(c => {
          if (c.id !== activeChatId) return c;
          return {
            ...c,
            messages: c.messages.map(msg => msg.id === m.id || msg.id === m.temp_id ? {
              ...msg,
              id: m.id,
              status: m.is_read ? 'read' : (m.delivered_at ? 'delivered' : 'sent'),
            } : msg)
          };
        }));
      } else {
        // Incoming message from other user
        const newMsg: Message = {
          id: m.id,
          conversation_id: m.conversation_id,
          text: m.content,
          sender: 'them',
          sender_id: m.sender_id,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          created_at: m.created_at,
          type: m.media_type || 'text',
          mediaUrl: m.media_url,
          status: 'read',
          is_read: true,
        };
        
        setConversations(prev => prev.map(c => c.id === activeChatId ? {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessage: m.content || 'Media message',
          lastTime: newMsg.time
        } : c));

        // Mark as read immediately on server since sender has this conversation active
        supabase.from('messages').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', m.id).then();
      }
    })
    // 2. Listen for Read Receipts (Double Purple Tick update)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${activeChatId}`,
    }, (payload) => {
      const updated = payload.new;
      setConversations(prev => prev.map(c => {
        if (c.id !== activeChatId) return c;
        return {
          ...c,
          messages: c.messages.map(msg => msg.id === updated.id ? {
            ...msg,
            is_read: updated.is_read,
            read_at: updated.read_at,
            status: updated.is_read ? 'read' : (updated.delivered_at ? 'delivered' : 'sent')
          } : msg)
        };
      }));
    })
    // 3. Presence Tracking (Online / Offline state of recipient)
    .on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState();
      const onlineUserIds = Object.keys(presenceState);
      const isOtherUserOnline = activeChat?.participantId ? onlineUserIds.includes(activeChat.participantId) : false;
      setConversations(prev => prev.map(c => c.id === activeChatId ? { ...c, isOnline: isOtherUserOnline } : c));
    })
    // 4. Typing broadcast
    .on('broadcast', { event: 'typing' }, ({ payload }) => {
      if (payload.userId !== user.id) {
        setConversations(prev => prev.map(c => c.id === activeChatId ? { ...c, isTyping: payload.isTyping } : c));
      }
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ online_at: new Date().toISOString(), userId: user.id });
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, [activeChatId, user?.id]);
```

---

### 4.3. Perfect "WhatsApp-Style" Auto-Scroll to Bottom

```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);
const scrollContainerRef = useRef<HTMLDivElement>(null);
const isFirstLoadRef = useRef(true);

// Instant scroll on active chat switch or first render
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: isFirstLoadRef.current ? 'auto' : 'smooth' });
    isFirstLoadRef.current = false;
  }
}, [activeChatId]);

// Auto-scroll on new message received only if user is already near bottom (prevent interrupting reading history)
const handleNewMessageScroll = () => {
  const container = scrollContainerRef.current;
  if (!container) return;
  const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
  if (isNearBottom) {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
};
```

---

## 5. Summary of Actions to Execute

1. **Database**: Run migration adding `delivered_at`, `read_at`, `media_type`, `media_url`, and high-speed composite indexes on `messages`.
2. **Profile Avatar Fix**: Ensure `avatarUrl` is stored in Zustand and mapped from `profiles.avatar_url` across sidebar conversation lists, top active chat bar, and message bubbles.
3. **Tick Logic**: Implement full 1 Grey Tick (`sent`), 2 Grey Ticks (`delivered`), 2 Purple Ticks (`read` with `#5a32fa`) state machine.
4. **Realtime Update Listener**: Add `UPDATE` Postgres subscription to transition ticks dynamically without manual refresh.
5. **Scroll Engine**: Use non-blocking `behavior: 'auto'` initial anchor with sticky bottom observer for new messages.
