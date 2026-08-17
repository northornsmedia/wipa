# WIPA Platform — Full Supabase Integration & Admin Panel Goal List
# Project: WIPA-NM (bepavczocyvaegkfxtvd.supabase.co)
# Total Tasks: 97
# Status Legend: [ ] = pending | [/] = in progress | [x] = done

---

## 🔧 PHASE 1: FOUNDATION & SUPABASE CLIENT SETUP

- [ ] 1. Upgrade `src/lib/supabase.ts` — create a proper server-side client with `SUPABASE_SERVICE_ROLE_KEY` using `createClient` for server actions/API routes, and a separate browser client for client components.
- [ ] 2. Create `src/lib/supabase-server.ts` — server-only Supabase admin client (using service role key) for admin panel routes and API routes that need bypassed RLS.
- [ ] 3. Create `src/lib/supabase-browser.ts` — browser singleton client (avoid re-creating on every render).
- [ ] 4. Update `src/store/useAppStore.ts` — add real Supabase `user` hydration from `supabase.auth.getUser()` on app load instead of relying on stored null/mock user.
- [ ] 5. Add `supabase.auth.onAuthStateChange` listener globally in `AuthGuard.tsx` so user state syncs on login/logout/token refresh.

---

## 🔐 PHASE 2: AUTH SYSTEM (Login / Signup / Onboarding)

- [ ] 6. Wire up `src/app/login/page.tsx` — connect the login form to `supabase.auth.signInWithPassword()`, redirect to `/platform` on success, show proper error messages on failure.
- [ ] 7. Wire up `src/app/signup/page.tsx` — connect signup form to `supabase.auth.signUp()`, pass `full_name` in metadata so the `handle_new_user` trigger auto-creates the profile row.
- [ ] 8. Fix `AuthGuard.tsx` — call `supabase.auth.getSession()` on mount, redirect to `/login` if no session, replace the current mock check with real session check.
- [ ] 9. Wire up `src/app/onboarding/page.tsx` — after signup, save `mobile_number`, `linkedin_url`, `website_url`, `country`, `practice_area`, `industry_sector` and set `onboarding_completed = true` in `profiles` table.
- [ ] 10. Add logout functionality — call `supabase.auth.signOut()` in PlatformHeader logout button, clear Zustand store user state, redirect to `/login`.
- [ ] 11. Add `verification_document_url` upload during onboarding — upload to `verifications` storage bucket, save URL to `profiles.verification_document_url`.
- [ ] 12. Handle `verification_status` — show "Pending Verification" badge on profile if `verification_status === 'pending'`, show green badge if `'verified'`.

---

## 👤 PHASE 3: PROFILE PAGE (Real Data)

- [ ] 13. Replace all mock/hardcoded profile values in `src/app/platform/profile/page.tsx` — fetch full profile row from `profiles` table (`bio`, `country`, `practice_area`, `industry_sector`, `linkedin_url`, `website_url`, `mobile_number`, `member_id`, `membership_tier`).
- [ ] 14. Wire up profile stats — fetch real connection count from `connections` table, real post count from `feed_posts` table.
- [ ] 15. Wire up Edit Profile modal — on save, call `supabase.from('profiles').update({...})` with changed fields.
- [ ] 16. Wire up avatar upload — upload new avatar to `avatars` storage bucket under `{userId}/avatar.jpg`, save public URL to `profiles.avatar_url`, update Zustand store.
- [ ] 17. Wire up cover photo upload — upload to `avatars` bucket as `{userId}/cover.jpg`, save URL to `profiles.cover_url`.
- [ ] 18. Wire up public profile page `src/app/platform/profile/[id]/page.tsx` — fetch the profile by `id` param from `profiles` table, show real data (name, bio, avatar, practice area etc).
- [ ] 19. Show real connection button on public profile — check `connections` table for existing relation, show "Connect", "Pending", or "Connected" state.

---

## 📰 PHASE 4: FEED (Real-Time Posts)

- [ ] 20. Feed is partially wired — verify `fetchFeed` in `src/app/platform/page.tsx` works with real data (7 profiles, 9 feed_posts in DB). Fix any RLS or query errors.
- [ ] 21. Wire up "Create Post" modal — call `supabase.from('feed_posts').insert({author_id, content, privacy})` on publish, refresh feed after success.
- [ ] 22. Wire up post image/video upload — upload media to a `feed-media` storage bucket, store URLs in `media_urls` array of `feed_posts`.
- [ ] 23. Create `feed-media` storage bucket migration if it doesn't exist, with public read policy.
- [ ] 24. Wire up Like button — insert/delete from `feed_likes` table, `likes_count` updates via DB trigger automatically. Update local state optimistically.
- [ ] 25. Wire up Comments — fetch `feed_comments` for a post (join with `profiles` for author name/avatar), insert new comments to `feed_comments` table.
- [ ] 26. Wire up post Delete — call `supabase.from('feed_posts').delete().eq('id', postId)` only when `author_id === user.id`.
- [ ] 27. Wire up post Edit — call `supabase.from('feed_posts').update({content})` only when `author_id === user.id`.
- [ ] 28. Enable Realtime on `feed_posts` table — subscribe to `INSERT` events so new posts from other users appear without refresh.

---

## 💬 PHASE 5: MESSAGES (Real-Time Chat)

- [ ] 29. Wire up `src/app/platform/messages/page.tsx` — fetch conversations from `conversations` table joined with `conversation_participants` and partner's `profiles` data.
- [ ] 30. Display real conversation list — show partner avatar, name, last message preview, and unread count.
- [ ] 31. Wire up message thread — when a conversation is selected, fetch all `messages` in that `conversation_id` ordered by `created_at`.
- [ ] 32. Wire up send message — insert to `messages` table `{conversation_id, sender_id, content}`, update `conversations.updated_at`.
- [ ] 33. Enable Realtime subscription on `messages` table — subscribe to new messages in current `conversation_id`, append to UI without refresh.
- [ ] 34. Wire up "New Message" / start conversation — when user picks someone from network, check if conversation exists, if not create new row in `conversations` + 2 rows in `conversation_participants`, then open that thread.
- [ ] 35. Wire up message `is_read` — mark messages as read when conversation is opened, show unread indicator badge on conversation list items.
- [ ] 36. Display typing indicator placeholder (UI only, no Supabase broadcast needed at this stage).

---

## 🌐 PHASE 6: NETWORK / MEMBERS / CONNECTIONS

- [ ] 37. Wire up `src/app/platform/network/page.tsx` — fetch all profiles from `profiles` table with pagination (20 per page), replace mock member cards with real data.
- [ ] 38. Add filter by `country`, `practice_area`, `industry_sector` — add filter dropdowns that pass `.eq()` filters to the Supabase query.
- [ ] 39. Wire up `src/app/platform/members/page.tsx` — same as network but styled for the Members directory. Fetch from `profiles` with real columns.
- [ ] 40. Wire up Connect button — insert to `connections` table `{requester_id, recipient_id, status:'pending'}`. If already connected show "Connected". If pending show "Pending".
- [ ] 41. Wire up Accept/Reject connection requests — fetch pending connections where `recipient_id = user.id`, allow update to `status = 'accepted'` or `'rejected'`.
- [ ] 42. Wire up Notifications for new connection requests — insert to `notifications` table when a connection request is sent.
- [ ] 43. Search by name — wire up the search bar to `supabase.from('profiles').select('*').ilike('full_name', %)`.

---

## 🗣️ PHASE 7: FORUMS (Real Data)

- [ ] 44. Wire up `src/app/platform/forums/page.tsx` — fetch all `forums` rows and `forum_posts` counts. Replace mock forum list with real data.
- [ ] 45. Create forum thread list page `src/app/platform/forums/[forumId]/page.tsx` — fetch all `forum_posts` for a given forum, joined with author `profiles`.
- [ ] 46. Create forum post detail page `src/app/platform/forums/[forumId]/[postId]/page.tsx` — fetch single `forum_post`, show full content and threaded replies.
- [ ] 47. Wire up "New Post" in forum — insert to `forum_posts` table `{forum_id, author_id, title, content}`.
- [ ] 48. Seed initial forum categories — run migration to insert default rows into `forums` table (Patent Law, Trademark, IP Strategy, Career, etc).
- [ ] 49. Wire up forum post likes/bookmarks — add `forum_post_likes` table migration, insert/delete on like, show count.

---

## 📅 PHASE 8: EVENTS (Real Data)

- [ ] 50. Create `events` table Supabase migration — columns: `id`, `title`, `description`, `event_date`, `end_date`, `location`, `is_virtual`, `cover_image_url`, `organizer_id`, `max_attendees`, `created_at`.
- [ ] 51. Create `event_registrations` table — `{event_id, user_id, registered_at}`, with RLS for users to register themselves.
- [ ] 52. Wire up `src/app/platform/events/page.tsx` — fetch real events from `events` table, sorted by `event_date`. Replace mock events.
- [ ] 53. Wire up event detail page `src/app/platform/events/[id]/page.tsx` — fetch single event by `id`, show all details, attendee count.
- [ ] 54. Wire up Register for Event button — insert to `event_registrations`, show "Registered" state after success.
- [ ] 55. Admin: allow admins to create, edit, delete events (covered in Admin Panel phase).

---

## 💼 PHASE 9: JOBS BOARD (Real Data)

- [ ] 56. Create `jobs` table Supabase migration — columns: `id`, `title`, `company`, `location`, `job_type`, `salary_range`, `description`, `application_url`, `posted_by`, `is_active`, `created_at`.
- [ ] 57. Wire up `src/app/platform/jobs/page.tsx` — fetch real jobs from `jobs` table. Replace mock job listings.
- [ ] 58. Wire up job filter by `job_type`, `location` — add filter to Supabase query.
- [ ] 59. Admin: allow admins to create, edit, archive job listings (covered in Admin Panel phase).
- [ ] 60. Wire up "Apply" button — open external `application_url` or trigger an in-app application form.

---

## 📚 PHASE 10: RESOURCES LIBRARY (Real Data)

- [ ] 61. Wire up `src/app/platform/resources/page.tsx` — fetch all `resources` rows, group by `type`/`category`, replace mock cards.
- [ ] 62. Wire up `podcasts-conversations` sub-page — fetch from `podcasts` table (9 rows exist), display real podcast cards with `cover_image_url`, `title`, `duration`, `host_name`.
- [ ] 63. Wire up podcasts detail page with real `media_file_url` for audio player.
- [ ] 64. Wire up each resource sub-page (articles-insights, career-leadership, education, guides-toolkits, in-house-counsel, ip-news, ip-services, research-reports, webinars, wellness, womens-ip-world) — filter `resources` table by matching `category` column.
- [ ] 65. Admin: allow upload of new resources and podcasts (covered in Admin Panel phase).

---

## 🔔 PHASE 11: NOTIFICATIONS (Real-Time)

- [ ] 66. Wire up notifications bell in `PlatformHeader.tsx` — fetch unread `notifications` count for `user.id` where `is_read = false`, display badge number.
- [ ] 67. Wire up notifications dropdown — fetch recent 20 notifications ordered by `created_at`, show icon based on `type`.
- [ ] 68. Mark notifications as read — update `is_read = true` when notification is clicked or when dropdown opens.
- [ ] 69. Enable Realtime on `notifications` table — subscribe to `INSERT` events for current user, show toast + increment badge count.
- [ ] 70. Auto-insert notifications — create DB functions/triggers to auto-insert notification rows for: new message received, new connection request, connection accepted, new comment on post.

---

## 💳 PHASE 12: MEMBERSHIPS & STRIPE

- [ ] 71. Wire up `src/app/platform/memberships/page.tsx` — fetch current user's `membership_tier` from `profiles`, highlight their current plan, disable upgrade button for current tier.
- [ ] 72. Wire up "Upgrade" button — call `/api/checkout` route with the selected plan's Stripe `price_id`, redirect to Stripe Checkout.
- [ ] 73. Fix `src/app/api/checkout/route.ts` — use `SUPABASE_SERVICE_ROLE_KEY` server client to fetch/create `stripe_customer_id` in `private_billing` table, create Stripe checkout session.
- [ ] 74. Fix `src/app/api/webhooks/route.ts` — handle `checkout.session.completed` Stripe webhook event, update `profiles.membership_tier` and `private_billing` table.
- [ ] 75. Add membership tier gating — in certain pages (premium resources, specific forums) check user's `membership_tier` and show upgrade prompt if insufficient tier.

---

## 🧑‍💼 PHASE 13: ADMIN PANEL (New — Full Build)

### Setup & Layout
- [ ] 76. Create `src/app/admin/layout.tsx` — admin panel layout with sidebar, dark theme, WIPA branding. Check user has `is_admin = true`, redirect to `/platform` otherwise.
- [ ] 77. Add `is_admin BOOLEAN DEFAULT false` column to `profiles` table via new migration.
- [ ] 78. Create `src/app/admin/page.tsx` — Dashboard overview with: total users count, active members, total feed posts, pending verifications count, recent signups list, revenue snapshot.

### Users Management
- [ ] 79. Create `src/app/admin/users/page.tsx` — paginated table of all users from `profiles`. Columns: Avatar, Name, Email, Member ID, Tier, Verification Status, Joined Date, Actions (View, Edit, Ban).
- [ ] 80. Create `src/app/admin/users/[id]/page.tsx` — detailed user profile for admins: show all profile fields, change `membership_tier`, change `verification_status`, toggle `is_admin`, view user's posts/connections.
- [ ] 81. Add user search & filter in admin users list — filter by `membership_tier`, `verification_status`, `country`, `practice_area`.
- [ ] 82. Admin: manually verify user — button to set `verification_status = 'verified'` via service role client (bypasses RLS).

### Content Management
- [ ] 83. Create `src/app/admin/posts/page.tsx` — list all `feed_posts` with author, date, like count. Allow admin to delete any post.
- [ ] 84. Create `src/app/admin/forums/page.tsx` — list all forums and post counts. Allow admin to create new forums, edit forum name/description, delete forums.
- [ ] 85. Create `src/app/admin/events/page.tsx` — list all events. Add "Create Event" form that inserts to `events` table. Allow edit and delete.
- [ ] 86. Create `src/app/admin/jobs/page.tsx` — list all job postings. Add "Create Job" form. Allow edit, toggle `is_active`, delete.
- [ ] 87. Create `src/app/admin/resources/page.tsx` — list all resources and podcasts. Add "Upload Resource" form (title, type, category, URL or file upload to `resources` storage bucket). Allow edit and delete.
- [ ] 88. Create `src/app/admin/podcasts/page.tsx` — list all `podcasts`. Add "Upload Podcast" form (upload audio to `podcasts` bucket, upload cover image, fill metadata). Show `podcast_requests` from users and allow approve/reject.

### Verifications
- [ ] 89. Create `src/app/admin/verifications/page.tsx` — list all users with `verification_status = 'pending'`. For each: show name, email, uploaded document (Supabase signed URL), Approve/Reject buttons.
- [ ] 90. Wire up approve action — update `profiles.verification_status = 'verified'` and insert a notification to the user.

### Analytics & Reports
- [ ] 91. Create `src/app/admin/analytics/page.tsx` — stats dashboard: total signups per week (chart), total posts per day, connection growth, membership tier breakdown (pie chart), top countries.

### Settings
- [ ] 92. Create `src/app/admin/settings/page.tsx` — platform-level settings: toggle maintenance mode, update platform announcement banner text, manage admin users list.

---

## 🗄️ PHASE 14: DATABASE MIGRATIONS (Missing Tables)

- [ ] 93. Write and apply migration `add_events_table.sql` — events + event_registrations tables with RLS policies.
- [ ] 94. Write and apply migration `add_jobs_table.sql` — jobs table with RLS policies (public read, admin insert/update/delete).
- [ ] 95. Write and apply migration `add_is_admin_to_profiles.sql` — add `is_admin BOOLEAN DEFAULT false` to profiles.
- [ ] 96. Write and apply migration `add_forum_replies.sql` — add `forum_replies` table or add `parent_id` to `forum_posts` for threading.
- [ ] 97. Write and apply migration `add_realtime_to_notifications_and_feed.sql` — enable realtime publication for `notifications`, `feed_posts`, `feed_comments` tables.

---

## ✅ FINAL COMPLETION CHECKLIST
- [ ] All pages load real data from Supabase (zero mock/hardcoded data remaining)
- [ ] Auth flow works end-to-end (signup → onboarding → login → platform → logout)
- [ ] Admin panel is secured and fully functional with all 8 pages
- [ ] Real-time messaging works
- [ ] Notifications are live
- [ ] Stripe membership upgrade flow works end-to-end
- [ ] All DB migrations applied to production Supabase project

