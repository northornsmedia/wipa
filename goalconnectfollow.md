# WIPA LinkedIn-Grade Dual Network Architecture: Connect vs. Follow 🤝👥

---

## 1. Executive Summary & Core Rules

WIPA implements a dual-layer social graph modeled after LinkedIn:

| Feature / Dimension | **Connect (Mutual 2-Way)** 🤝 | **Follow (1-Way Asymmetric)** 📡 |
| :--- | :--- | :--- |
| **Relationship Type** | Bidirectional (Mutual agreement required) | Unidirectional (One-way interest) |
| **Approval Flow** | Requester sends invite -> Recipient clicks **Accept** / **Ignore** | Instant (No approval needed) |
| **Messaging Permission** | 🔓 **Unlocks 1-on-1 Direct Chat in `/platform/messages`** | 🔒 **No Direct Messaging Allowed** (Must connect first) |
| **Feed Visibility** | Full activity & mutual updates in feed | Content & articles broadcast to follower's feed |
| **Database Table** | `public.connections` (`status: 'pending' \| 'accepted' \| 'declined'`) | `public.follows` (`follower_id`, `following_id`) |
| **UI Button States** | `Connect` -> `Pending ⏳` -> `Connected ✓` -> `Disconnect` | `Follow +` -> `Following ✓` -> `Unfollow` |

---

## 2. Database Architecture & Schema Design (Supabase)

### Table 1: `public.connections` (Mutual 2-Way Connection Graph)
```sql
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_connection_pair UNIQUE (requester_id, recipient_id),
  CONSTRAINT no_self_connect CHECK (requester_id <> recipient_id)
);

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_connections_requester ON public.connections(requester_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_recipient ON public.connections(recipient_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.connections(status);
```

### Table 2: `public.follows` (1-Way Asymmetric Follow Graph)
```sql
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_follow_pair UNIQUE (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id <> following_id)
);

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);
```

---

## 3. Row Level Security (RLS) & Protection Policies

### RLS for `connections`:
```sql
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Users can view connections they are involved in (as requester or recipient)
CREATE POLICY "Users can view their own connections"
ON public.connections FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- 2. INSERT: Users can send connection requests
CREATE POLICY "Users can send connection requests"
ON public.connections FOR INSERT
WITH CHECK (auth.uid() = requester_id);

-- 3. UPDATE: Recipients can accept/decline; Requesters can cancel
CREATE POLICY "Users can update connection status"
ON public.connections FOR UPDATE
USING (auth.uid() = recipient_id OR auth.uid() = requester_id);

-- 4. DELETE: Either party can disconnect/unfriend
CREATE POLICY "Users can delete connection"
ON public.connections FOR DELETE
USING (auth.uid() = recipient_id OR auth.uid() = requester_id);
```

### RLS for `follows`:
```sql
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Anyone authenticated can see public follow relationships
CREATE POLICY "Anyone can view follows"
ON public.follows FOR SELECT
TO authenticated
USING (true);

-- 2. INSERT: Users can follow anyone except themselves
CREATE POLICY "Users can follow others"
ON public.follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

-- 3. DELETE: Users can unfollow someone they follow
CREATE POLICY "Users can unfollow"
ON public.follows FOR DELETE
USING (auth.uid() = follower_id);
```

---

## 4. Messaging Access Guard (`/platform/messages`)

To enforce LinkedIn-grade privacy, direct 1-on-1 chats are locked unless the users are mutually connected:

```sql
-- Helper function to verify if two users are accepted connections
CREATE OR REPLACE FUNCTION public.are_users_connected(user_a UUID, user_b UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.connections
    WHERE status = 'accepted'
      AND (
        (requester_id = user_a AND recipient_id = user_b)
        OR
        (requester_id = user_b AND recipient_id = user_a)
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. Automated Notification Triggers

1. **Connection Request Sent**:
   - Creates a row in `notifications` for `recipient_id`: `"User A sent you a connection request"`.
2. **Connection Request Accepted**:
   - Creates a row in `notifications` for `requester_id`: `"User B accepted your connection request. You can now message each other!"`.
3. **New Follower**:
   - Creates a row in `notifications` for `following_id`: `"User A started following you"`.

---

## 6. Frontend UI/UX Integration Map

### 1. Member Cards (`/platform/members`)
Each member card displays:
- **Connect Button**:
  - `Connect` (Blue/Purple button) -> Sends request, transitions to `Pending ⏳`.
  - `Pending` (Grey outlined pill) -> Displays "Request Sent".
  - `Connected` (Green check badge) -> Click to open messaging or manage connection.
- **Follow Button**:
  - `Follow +` -> Instantly transitions to `Following ✓`.
  - `Following ✓` -> Unfollow on click with smooth animation.

### 2. Member Profile Page (`/platform/profile/[id]`)
- Action header displays primary **Connect / Connected** button and secondary **Follow / Following** button.
- If not connected, the "Message" button displays a lock icon with a tooltip: *"Connect with [User] to send a message"*.

### 3. My Network Manager (`/platform/network`)
- **Invitations Banner**: Shows pending incoming connection requests with **Accept** and **Ignore** action buttons.
- **3 Tab Navigation**:
  - `Connections (count)`: All accepted 2-way contacts with instant "Message" button.
  - `Following (count)`: All users you follow with 1-click "Unfollow".
  - `Followers (count)`: All users following you with 1-click "Connect" button.

### 4. Messaging Page (`/platform/messages`)
- Prevents starting conversations with non-connections.
- Deep links from profile (`/platform/messages?userId=xyz`) verify connection status first. If pending/none, display connection invite modal.

---

## 7. Master Task List for Complete Execution

### Phase 1: Database & Schema Migrations
- [x] Task 1: Create `public.follows` table with foreign keys to `profiles(id)`.
- [x] Task 2: Create unique constraint `unique_follow_pair` on `(follower_id, following_id)`.
- [x] Task 3: Create check constraint `no_self_follow` on `follows`.
- [x] Task 4: Validate `public.connections` table columns, statuses, and constraints.
- [x] Task 5: Apply RLS policies for `public.follows` (SELECT, INSERT, DELETE).
- [x] Task 6: Apply RLS policies for `public.connections` (SELECT, INSERT, UPDATE, DELETE).
- [x] Task 7: Enable Supabase Realtime publication on `public.follows` and `public.connections`.
- [x] Task 8: Create SQL function `are_users_connected(user_a, user_b)`.
- [x] Task 9: Create trigger for automated connection request notifications.
- [x] Task 10: Create trigger for connection acceptance notifications.

### Phase 2: React State & Custom Hooks
- [x] Task 11: Create network status queries for real-time connection & follow states.
- [x] Task 12: Implement optimistic UI state updates for `handleConnect(targetUserId)`.
- [x] Task 13: Implement optimistic UI state updates for `handleAccept(connectionId)`.
- [x] Task 14: Implement optimistic UI state updates for `handleReject(connectionId)`.
- [x] Task 15: Implement optimistic UI state updates for `handleFollow(targetUserId)`.
- [x] Task 16: Implement optimistic UI state updates for `handleUnfollow(targetUserId)`.

### Phase 3: UI Component Wiring
- [x] Task 17: Update `src/app/platform/members/page.tsx` with dual Connect and Follow buttons.
- [x] Task 18: Update `src/app/platform/profile/[id]/page.tsx` with Connect, Follow, and Message locks.
- [x] Task 19: Update `src/app/platform/network/page.tsx` with real Connections, Following, and Followers tabs.
- [x] Task 20: Update `src/app/platform/messages/page.tsx` to guard messaging behind accepted connection status.

### Phase 4: Production Verification
- [x] Task 21: Verify multi-user connection request -> accept -> chat unlock flow.
- [x] Task 22: Verify follow -> feed broadcast -> message lockout flow.
- [x] Task 23: Run full Next.js production build (`npm run build`) and verify 0 errors.
- [x] Task 24: Push changes live to GitHub `main`.
