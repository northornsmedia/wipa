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



Add Recommended by WIPA for PPS
Add SPLASH SPONSORED for IP Service Resourse
Create IP Firm Resource similar to IP Services
Develop "Create Business Profile Flow"
Check Meetn integration for Webinars
Introduce Member Quizzes and a Gamification Leaderboard
Develop Sponsorship Opportunities for Physical and Virtual WIPA Events
Add a “Trending Discussion to Podcast” Feature
Develop “My Calendar” with Calendar Synchronisation




# PHASE 2: BACKEND INTEGRATION AUDIT & FULL PLATFORM BUILD (Tasks 320–617)

> Audit every frontend feature in WIPA and wipa-admin for missing backend integration. Build all missing API routes, DB connections, admin modules, and full-stack features. Execute sequentially, verify with npm run build, commit to git after each section.

---

## SECTION A: AUTH SYSTEM

- [x] [100%] 320. Wire `src/app/login/page.tsx` to `supabase.auth.signInWithPassword()` on form submit
- [x] [100%] 321. On successful login redirect to `/platform` via `router.push('/platform')`
- [x] [100%] 322. On auth error show Supabase error message in a styled banner
- [x] [100%] 323. Add Forgot Password: call `supabase.auth.resetPasswordForEmail()` + show confirmation toast
- [x] [100%] 324. Add Google OAuth sign-in: `supabase.auth.signInWithOAuth({ provider: 'google' })`
- [x] [100%] 325. Add Microsoft OAuth sign-in: `supabase.auth.signInWithOAuth({ provider: 'azure' })`
- [x] [100%] 326. On page load check existing session — if logged in redirect to `/platform` immediately
- [x] [100%] 327. Wire `src/app/signup/page.tsx` to `supabase.auth.signUp()` with full_name in metadata
- [x] [100%] 328. After signup redirect to `/onboarding`
- [x] [100%] 329. Show inline error if email already exists
- [x] [100%] 330. Add real-time password strength meter
- [x] [100%] 331. Add Google/Microsoft OAuth sign-up buttons
- [x] [100%] 332. Replace mock check in `AuthGuard.tsx` with real `supabase.auth.getSession()` on mount
- [x] [100%] 333. If no session redirect to `/login` with `router.replace()`
- [x] [100%] 334. Show full-screen skeleton spinner while session check runs
- [x] [100%] 335. Subscribe to `supabase.auth.onAuthStateChange` — redirect on sign-out
- [x] [100%] 336. Wire `onboarding/page.tsx` to update `profiles` with all onboarding fields + `onboarding_completed = true`
- [x] [100%] 337. Add verification document upload to `verifications` storage bucket
- [x] [100%] 338. After onboarding save redirect to `/platform`
- [x] [100%] 339. If `onboarding_completed = true` already, skip to `/platform`
- [x] [100%] 340. Find logout button in PlatformHeader/Sidebar
- [x] [100%] 341. Wire to `supabase.auth.signOut()` + clear Zustand store
- [x] [100%] 342. After sign-out redirect to `/login`

---

## SECTION B: USER PROFILE

- [x] [100%] 343. Fetch full profile on `profile/page.tsx` mount: `profiles.select('*').eq('id', user.id).single()`
- [x] [100%] 344. Replace all hardcoded values with real DB data: bio, country, practice_area, linkedin_url, etc.
- [x] [100%] 345. Fetch real connection count from `connections` table
- [x] [100%] 346. Fetch real post count from `feed_posts` table
- [x] [100%] 347. Wire Edit Profile modal: `profiles.update({...}).eq('id', user.id)` on save
- [x] [100%] 348. Wire avatar upload to `avatars/{userId}/avatar.jpg`; save to `profiles.avatar_url`
- [x] [100%] 349. Wire cover photo upload to `avatars/{userId}/cover.jpg`; save to `profiles.cover_url`
- [x] [100%] 350. Show verification status badge from `profiles.verification_status`
- [x] [100%] 351. `profile/[id]/page.tsx` — fetch profile by URL param from `profiles`
- [x] [100%] 352. Show real name, bio, avatar, practice_area, country, linkedin_url
- [x] [100%] 353. Show Connect button state from `connections` table
- [x] [100%] 354. Wire Connect button: insert to `connections` + notification to target user
- [x] [100%] 355. Wire Message button: create or navigate to existing conversation
- [x] [100%] 356. Show user's last 5 public feed posts on their profile

---

## SECTION C: FEED (Real-Time)

- [x] [100%] 357. Verify `fetchFeed()` fetches from `feed_posts` joined with `profiles` correctly
- [x] [100%] 358. Enable Supabase Realtime on `feed_posts` — subscribe to INSERT, prepend new posts without reload
- [x] [100%] 359. Wire Create Post: `feed_posts.insert({author_id, content, privacy})`
- [x] [100%] 360. Wire post image/video upload to `feed-media` bucket; store URLs in `feed_posts.media_urls`
- [x] [100%] 361. Create `feed-media` storage bucket migration with public read policy
- [x] [100%] 362. Wire Like button: insert/delete `feed_likes`; optimistic likes_count update
- [x] [100%] 363. Wire Comments fetch: `feed_comments` joined with `profiles`
- [x] [100%] 364. Wire Comment submit: insert to `feed_comments`
- [x] [100%] 365. Wire post Delete for own posts; remove from local state
- [x] [100%] 366. Wire post Edit for own posts; update local state
- [x] [100%] 367. Wire Liked Threads page: fetch `feed_likes` joined with `feed_posts` + `profiles`

---

## SECTION D: MESSAGES (Real-Time)

- [x] [100%] 368. Verify conversations fetch: joined with `conversation_participants` + partner `profiles`
- [x] [100%] 369. Display real: partner avatar, name, last message preview, unread count
- [x] [100%] 370. On conversation select: fetch all `messages` ordered by `created_at`
- [x] [100%] 371. Subscribe Realtime on `messages` — append new messages live
- [x] [100%] 372. Wire send message: insert to `messages` + update `conversations.updated_at`
- [x] [100%] 373. Wire New Conversation: create `conversations` + 2 `conversation_participants` rows if new
- [x] [100%] 374. Mark messages `is_read = true` for received messages when conversation opens
- [x] [100%] 375. Verify unread badge count in sidebar uses live Supabase data

---

## SECTION E: NETWORK / MEMBERS / CONNECTIONS

- [x] [100%] 376. Verify `network/page.tsx` fetches real profiles with pagination (20 per page)
- [x] [100%] 377. Add filter dropdowns for country, practice_area, industry_sector
- [x] [100%] 378. Verify `members/page.tsx` fetches real profiles
- [x] [100%] 379. Wire search bar to `.ilike('full_name', '%query%')`
- [x] [100%] 380. Verify Connect button inserts to `connections` correctly
- [x] [100%] 381. Add My Connections tab showing accepted connections
- [x] [100%] 382. Add Pending Requests tab: connections where `recipient_id = user.id` and `status='pending'`
- [x] [100%] 383. Wire Accept button: update `status='accepted'` + notification to requester
- [x] [100%] 384. Wire Reject button: delete connection row

---

## SECTION F: FORUMS

- [x] [100%] 385. Verify `forums/page.tsx` fetches all `forums` with real post counts
- [x] [100%] 386. Verify `forums/[forumId]/page.tsx` fetches `forum_posts` joined with `profiles`
- [x] [100%] 387. Verify `forums/[forumId]/[postId]/page.tsx` fetches post + replies
- [x] [100%] 388. Verify New Post inserts to `forum_posts {forum_id, author_id, title, content}`
- [x] [100%] 389. Verify forum post likes: `forum_post_likes` insert/delete toggle
- [x] [100%] 390. Add Report Post: insert to `reported_content` table; create migration if missing
- [x] [100%] 391. Add forum bookmarks: `forum_bookmarks {post_id, user_id}` migration + toggle UI
- [x] [100%] 392. Show bookmark count and user bookmark state on each post

---

## SECTION G: EVENTS

- [x] [100%] 393. Verify `events/page.tsx` fetches real events from `events` sorted by `event_date`
- [x] [100%] 394. Verify `events/[id]/page.tsx` fetches single event with all details + attendee count
- [x] [100%] 395. Verify Register inserts to `event_registrations` and shows "Registered" state
- [x] [100%] 396. Add My Events section: events where user has a registration row
- [x] [100%] 397. Add event filters: is_virtual, upcoming only, past events
- [x] [100%] 398. Show attendees list: `event_registrations` joined with `profiles` for event

---

## SECTION H: JOBS BOARD

- [x] [100%] 399. Verify `jobs/page.tsx` fetches real jobs where `is_active = true`
- [x] [100%] 400. Verify job filters by `job_type` and `location`
- [x] [100%] 401. Wire Apply button: open `application_url` or show in-app apply modal
- [x] [100%] 402. Create `job_applications` migration: `{id, job_id, applicant_id, cover_letter, status, created_at}`
- [x] [100%] 403. Wire in-app apply modal: insert to `job_applications`
- [x] [100%] 404. Add Saved Jobs: `saved_jobs {job_id, user_id}` migration + bookmark icon toggle
- [x] [100%] 405. Add My Applications tab: `job_applications` where `applicant_id = user.id` joined with `jobs`
- [x] [100%] 406. Show application count on each job card

---

## SECTION I: RESOURCES LIBRARY

- [x] [100%] 407. Verify `resources/page.tsx` fetches all resources grouped by category
- [x] [100%] 408. Verify each sub-page filters `resources` by `category` from DB
- [x] [100%] 409. Verify `podcasts-conversations` page fetches from `podcasts` with real metadata
- [x] [100%] 410. Verify podcast `[id]` page renders real `media_file_url` in audio player
- [x] [100%] 411. Add resource bookmarks: `resource_bookmarks {resource_id, user_id}` migration + toggle
- [x] [100%] 412. Add resource view tracking: increment `view_count` on detail page load
- [x] [100%] 413. Add Liked Resources section showing bookmarked resources
- [x] [100%] 414. Add share button: copy URL to clipboard with toast notification

---

## SECTION J: NOTIFICATIONS (Real-Time)

- [x] [100%] 415. Verify `notifications/page.tsx` fetches real notifications from DB for current user
- [x] [100%] 416. Verify notifications bell shows real unread count badge
- [x] [100%] 417. Wire Realtime on `notifications`: INSERT for user → toast + increment badge
- [x] [100%] 418. Wire Mark all as read: `notifications.update({is_read:true}).eq('user_id', user.id)`
- [x] [100%] 419. Wire individual notification click: mark `is_read = true` + navigate to `action_url`
- [x] [100%] 420. Verify DB triggers: new message, connection request, connection accepted, post comment, post like

---

## SECTION K: MEMBERSHIPS & STRIPE

- [x] [100%] 421. Verify `memberships/page.tsx` shows `profiles.membership_tier` and highlights active plan
- [x] [100%] 422. Wire Upgrade button: POST to `/api/checkout` with priceId, redirect to Stripe URL
- [x] [100%] 423. Verify `/api/checkout/route.ts` uses service role, creates Stripe checkout session
- [x] [100%] 424. Verify `/api/webhooks/stripe/route.ts` handles `checkout.session.completed`: update tier
- [x] [100%] 425. Add tier gating on premium content: check tier, show upgrade modal if insufficient

---

## SECTION L: GROUPS (New Feature)

- [x] [100%] 426. Create migration `20260817000019_create_groups.sql`: groups + group_members with RLS
- [x] [100%] 427. Create migration `20260817000020_create_group_posts.sql`: group_posts with RLS
- [x] [100%] 428. Wire `groups/page.tsx`: fetch all groups with member_count + user join state
- [x] [100%] 429. Wire Join Group button: insert to `group_members`
- [x] [100%] 430. Wire Leave Group button: delete from `group_members`
- [x] [100%] 431. Create `src/app/platform/groups/[id]/page.tsx`: group info, member list, posts feed
- [x] [100%] 432. Wire group post creation: insert to `group_posts {group_id, author_id, content}`
- [x] [100%] 433. Wire group post likes
- [x] [100%] 434. Add group post comments

---

## SECTION M: MENTORSHIP (New Feature)

- [x] [100%] 435. Create migration `20260817000021_create_mentors.sql`: mentors table with RLS
- [x] [100%] 436. Create migration `20260817000022_create_mentorship_requests.sql`
- [x] [100%] 437. Create migration `20260817000023_create_mentor_availability.sql`
- [x] [100%] 438. Wire `mentorship/page.tsx`: fetch active mentors joined with profiles
- [x] [100%] 439. Wire Request Mentorship button: insert to `mentorship_requests`
- [x] [100%] 440. Wire My Requests tab: fetch user's mentorship_requests
- [x] [100%] 441. Wire Become a Mentor form: insert to `mentors`
- [x] [100%] 442. Add mentor availability calendar UI

---

## SECTION N: AI CHAT

- [x] [100%] 443. Verify `ai/chat/page.tsx` calls `/api/proxy-ai` correctly
- [x] [100%] 444. Verify `/api/proxy-ai/route.ts` proxies to AI model with valid API key
- [x] [100%] 445. Document AI env vars in `.env.example`
- [x] [100%] 446. Create `ai_chat_sessions` migration: `{id, user_id, messages JSONB, created_at}`
- [x] [100%] 447. Wire chat history persistence: save messages to DB after each exchange
- [x] [100%] 448. Wire session history sidebar: fetch last 10 sessions; allow restoring

---

## SECTION O: BOARD MEMBERS

- [x] [100%] 449. Create `board_members` migration: `{id, name, title, bio, avatar_url, linkedin_url, display_order, is_active}`
- [x] [100%] 450. Wire `board-members/page.tsx`: fetch active board members by display_order
- [x] [100%] 451. Replace hardcoded board member cards with real DB data

---

## SECTION P: LIKED THREADS

- [x] [100%] 452. Wire `liked-threads/page.tsx`: fetch `forum_post_likes` joined with `forum_posts` + `profiles`
- [x] [100%] 453. Show liked posts in grid with title, forum, date; link through to post

---

## SECTION Q: WIPA-ADMIN PANEL (Full Build)

- [x] [100%] 454. Add service-role Supabase client to `wipa-admin/src/lib/supabase.ts`
- [x] [100%] 455. Create `wipa-admin/src/utils/supabase/client.ts` browser client
- [x] [100%] 456. Create `wipa-admin/src/utils/supabase/server.ts` server client with service role key
- [x] [100%] 457. Create `wipa-admin/src/middleware.ts`: check auth + `is_admin = true`; redirect if not
- [x] [100%] 458. Document env vars in `wipa-admin/.env.example`
- [x] [100%] 459. Replace mock stats in `wipa-admin/src/components/dashboard.tsx` with real queries
- [x] [100%] 460. Fetch total users count from profiles
- [x] [100%] 461. Fetch active users (signed in last 7 days)
- [x] [100%] 462. Fetch new signups this week
- [x] [100%] 463. Fetch total revenue from `private_billing`
- [x] [100%] 464. Show real Recent Signups: last 5 profiles
- [x] [100%] 465. Show Pending Verifications count badge
- [x] [100%] 466. Show Pending Firm Claims count badge
- [x] [100%] 467. Add signups-per-day bar chart using native SVG (last 7 days)
- [x] [100%] 468. Build `wipa-admin/src/app/dashboard/users/page.tsx` — paginated all profiles table
- [x] [100%] 469. Table columns: Avatar, Name, Email, Member ID, Tier, Verification, Is Admin, Joined, Actions
- [x] [100%] 470. Wire user search by name/email
- [x] [100%] 471. Wire filter by membership_tier, verification_status, country
- [x] [100%] 472. Add View User detail drawer/modal
- [x] [100%] 473. Wire edit user: change tier, verification_status, is_admin fields
- [x] [100%] 474. Wire Verify User action
- [x] [100%] 475. Wire Ban User action: add `is_banned` column migration + update profile
- [x] [100%] 476. Wire Make Admin toggle
- [x] [100%] 477. Build `wipa-admin/src/app/dashboard/content/page.tsx` with tabs: Posts, Forums, Resources
- [x] [100%] 478. Feed Posts tab: list all feed_posts with author + delete action
- [x] [100%] 479. Forums tab: list forums with counts; create/edit/delete
- [x] [100%] 480. Wire Create Forum form
- [x] [100%] 481. Resources tab: list resources with type, category, view_count
- [x] [100%] 482. Wire Upload Resource form with file upload to `resources` storage bucket
- [x] [100%] 483. Build `wipa-admin/src/app/dashboard/events/page.tsx`
- [x] [100%] 484. Wire Create Event form with cover image upload
- [x] [100%] 485. Wire Edit Event modal
- [x] [100%] 486. Wire Delete Event
- [x] [100%] 487. Show attendees list per event
- [x] [100%] 488. Build `wipa-admin/src/app/dashboard/jobs/page.tsx`
- [x] [100%] 489. Wire Create Job form
- [x] [100%] 490. Wire Edit Job modal
- [x] [100%] 491. Wire is_active toggle
- [x] [100%] 492. Wire Delete Job
- [x] [100%] 493. Show applications per job
- [x] [100%] 494. Build `wipa-admin/src/app/dashboard/verifications/page.tsx`
- [x] [100%] 495. Show name, email, member_id, document signed URL
- [x] [100%] 496. Wire Approve: update `verification_status = 'verified'` + notification
- [x] [100%] 497. Wire Reject: update `verification_status = 'rejected'` + notification with reason
- [x] [100%] 498. Build `wipa-admin/src/app/dashboard/firms/page.tsx`
- [x] [100%] 499. Show pending `firm_claim_requests` with claimant + firm info
- [x] [100%] 500. Wire Approve Claim: update status + link firm to profile
- [x] [100%] 501. Wire Reject Claim: update status
- [x] [100%] 502. Build `wipa-admin/src/app/dashboard/sponsorships/page.tsx`
- [x] [100%] 503. Wire Approve Sponsorship + notification to business
- [x] [100%] 504. Wire Reject Sponsorship + notification
- [x] [100%] 505. Show sponsorship details: event, tier, payment confirmation
- [x] [100%] 506. Build `wipa-admin/src/app/dashboard/podcasts/page.tsx`
- [x] [100%] 507. Wire Upload Podcast: audio + cover upload to Supabase storage; insert to `podcasts`
- [x] [100%] 508. Wire Edit Podcast modal
- [x] [100%] 509. Wire Delete Podcast: delete row + storage files
- [x] [100%] 510. Show podcast_requests with Approve/Reject
- [x] [100%] 511. Build `wipa-admin/src/app/dashboard/business/page.tsx`
- [x] [100%] 512. Wire Verify Business: `UPDATE business_profiles SET is_verified = true`
- [x] [100%] 513. Wire Delete Business Profile
- [x] [100%] 514. Build `wipa-admin/src/app/dashboard/quizzes/page.tsx`
- [x] [100%] 515. Wire Create Quiz + add questions via `quiz_questions` table
- [x] [100%] 516. Wire Edit Quiz modal
- [x] [100%] 517. Wire Delete Quiz cascade
- [x] [100%] 518. Show XP leaderboard: top 20 users by XP from `user_xp` + profiles
- [x] [100%] 519. Build `wipa-admin/src/app/dashboard/analytics/page.tsx`
- [x] [100%] 520. Signups per day chart (last 30 days)
- [x] [100%] 521. Posts per day chart (last 30 days)
- [x] [100%] 522. Membership tier breakdown chart
- [x] [100%] 523. Top countries by user count
- [x] [100%] 524. Connection growth per week (last 8 weeks)
- [x] [100%] 525. Top 10 most active forums by post count
- [x] [100%] 526. Top 5 events by registration count
- [x] [100%] 527. Top 10 resources by view_count
- [x] [100%] 528. Build `wipa-admin/src/app/dashboard/settings/page.tsx`
- [x] [100%] 529. Create `platform_settings` table migration: `{key TEXT PRIMARY KEY, value JSONB}`
- [x] [100%] 530. Wire maintenance mode toggle: update platform_settings
- [x] [100%] 531. Wire announcement banner: update platform_settings; display in WIPA frontend if set
- [x] [100%] 532. Wire admin users management list with toggle admin status
- [x] [100%] 533. Build full admin sidebar in `wipa-admin/src/components/app-shell.tsx`
- [x] [100%] 534. Sidebar links: Dashboard, Users, Content, Events, Jobs, Verifications, Firms, Sponsorships, Podcasts, Businesses, Quizzes, Analytics, Settings
- [x] [100%] 535. Add active route highlighting to sidebar links
- [x] [100%] 536. Show admin user avatar + name from Supabase session in sidebar footer
- [x] [100%] 537. Add logout button: `supabase.auth.signOut()` → redirect to `/`

---

## SECTION R: WIPA FRONTEND /admin VERIFICATION

- [x] [100%] 538. Verify `admin/layout.tsx` checks `is_admin = true`; redirect to `/platform` if not
- [x] [100%] 539. Verify `admin/page.tsx` dashboard shows real stats
- [x] [100%] 540. Verify `admin/users/page.tsx` — real user list with full CRUD
- [x] [100%] 541. Verify `admin/content/page.tsx` — trending discussions + Convert to Podcast end-to-end
- [x] [100%] 542. Verify `admin/events/page.tsx` — real events with create/edit/delete
- [x] [100%] 543. Verify `admin/jobs/page.tsx` — real jobs with CRUD + toggle
- [x] [100%] 544. Verify `admin/sponsorships/page.tsx` — approve/reject working
- [x] [100%] 545. Verify `admin/firms/page.tsx` — IP firms and claim requests
- [x] [100%] 546. Verify `admin/business/page.tsx` — verify/delete business profiles

---

## SECTION S: DATABASE — MISSING TABLES & RLS

- [x] [100%] 547. Migration `20260817000019_create_groups.sql` — groups + group_members with RLS
- [x] [100%] 548. Migration `20260817000020_create_group_posts.sql` — group_posts with RLS
- [x] [100%] 549. Migration `20260817000021_create_mentors.sql` — mentors + mentorship_requests with RLS
- [x] [100%] 550. Migration `20260817000022_create_mentor_availability.sql`
- [x] [100%] 551. Migration `20260817000023_create_board_members.sql`
- [x] [100%] 552. Migration `20260817000024_create_ai_chat_sessions.sql`
- [x] [100%] 553. Migration `20260817000025_create_job_applications.sql` — job_applications + saved_jobs
- [x] [100%] 554. Migration `20260817000026_create_forum_bookmarks.sql`
- [x] [100%] 555. Migration `20260817000027_create_resource_bookmarks.sql`
- [x] [100%] 556. Migration `20260817000028_create_reported_content.sql`
- [x] [100%] 557. Migration `20260817000029_create_platform_settings.sql`
- [x] [100%] 558. Migration `20260817000030_add_is_banned_to_profiles.sql`
- [x] [100%] 559. Migration `20260817000031_create_feed_media_bucket.sql` — feed-media storage bucket
- [x] [100%] 560. Audit all tables for missing RLS policies
- [x] [100%] 561. Add missing RLS policies where needed
- [x] [100%] 562. Verify `calendar_events` RLS — only owner can CRUD
- [x] [100%] 563. Verify `quiz_attempts` RLS — only user reads own
- [x] [100%] 564. Verify `event_sponsorships` RLS
- [x] [100%] 565. Verify `connections` RLS

---

## SECTION T: API ROUTES (Missing / Incomplete)

- [x] [100%] 566. Create `src/app/api/profiles/[id]/route.ts` — GET public; PATCH own profile
- [x] [100%] 567. Create `src/app/api/connections/route.ts` — POST send request; GET list
- [x] [100%] 568. Create `src/app/api/connections/[id]/route.ts` — PATCH accept/reject; DELETE
- [x] [100%] 569. Create `src/app/api/feed/route.ts` — GET paginated; POST create
- [x] [100%] 570. Create `src/app/api/feed/[id]/route.ts` — PATCH edit; DELETE delete
- [x] [100%] 571. Create `src/app/api/feed/[id]/like/route.ts` — POST toggle like
- [x] [100%] 572. Create `src/app/api/feed/[id]/comments/route.ts` — GET list; POST add
- [x] [100%] 573. Create `src/app/api/jobs/route.ts` — GET active; POST create (admin)
- [x] [100%] 574. Create `src/app/api/jobs/[id]/apply/route.ts` — POST apply
- [x] [100%] 575. Create `src/app/api/notifications/route.ts` — GET; PATCH mark all read
- [x] [100%] 576. Create `src/app/api/notifications/[id]/route.ts` — PATCH mark single read
- [x] [100%] 577. Create `src/app/api/groups/route.ts` — GET list; POST create
- [x] [100%] 578. Create `src/app/api/groups/[id]/join/route.ts` — POST join; DELETE leave
- [x] [100%] 579. Create `src/app/api/mentors/route.ts` — GET list; POST become mentor
- [x] [100%] 580. Create `src/app/api/mentors/[id]/request/route.ts` — POST send request
- [x] [100%] 581. Create `src/app/api/admin/stats/route.ts` — GET all stats (service role)
- [x] [100%] 582. Create `src/app/api/admin/users/route.ts` — GET paginated; PATCH update (service role)
- [x] [100%] 583. Create `src/app/api/admin/content/route.ts` — GET/DELETE posts + forums (service role)

---

## SECTION U: ENV VARIABLES & DOCS

- [x] [100%] 584. Create/update `WIPA/.env.example` with ALL required vars: Supabase, Stripe, Site URL, AI, Google, Microsoft, Meetn
- [x] [100%] 585. Create/update `wipa-admin/.env.example` with all required vars
- [x] [100%] 586. Add inline comments to each env var explaining what it does and where to get it

---

## SECTION V: PERFORMANCE & QUALITY

- [x] [100%] 587. Add `loading.tsx` skeleton states to: /platform, /forums, /events, /jobs, /members
- [x] [100%] 588. Add `error.tsx` error boundaries to all major platform routes
- [x] [100%] 589. Add `not-found.tsx` for 404 on dynamic `[id]` routes
- [x] [100%] 590. Replace `<img>` tags on public pages with Next.js `<Image>` component
- [x] [100%] 591. Add `revalidatePath()` on admin mutations so cached pages refresh
- [x] [100%] 592. Audit all Supabase queries for missing `.order()` or `.limit()`
- [x] [100%] 593. Add DB indexes migration: `profiles(is_admin)`, `feed_posts(author_id)`, `connections(requester_id, recipient_id)`, `notifications(user_id, is_read)`

---

## SECTION W: MOBILE & DARK MODE

- [x] [100%] 594. Audit every platform page at 375px — fix horizontal overflow / clipped elements
- [x] [100%] 595. Verify dark mode on: Login, Signup, Onboarding, Profile, Feed, Forums, Events, Jobs, Messages, Members, Calendar, Quizzes, Leaderboard, Resources
- [x] [100%] 596. Verify dark mode on all `admin/*` pages in WIPA frontend
- [x] [100%] 597. Fix hardcoded light-mode colors in wipa-admin dashboard component
- [x] [100%] 598. Add mobile hamburger menu trigger to platform sidebar (currently `hidden lg:flex`)
- [x] [100%] 599. Create `MobileSidebar.tsx` slide-out drawer with full nav links

---

## SECTION X: TESTING & FINAL VERIFICATION

- [x] [100%] 600. Run `npm run build` in /WIPA — must exit code 0 with no TypeScript errors
- [x] [100%] 601. Run `npm run build` in /wipa-admin — must exit code 0
- [x] [100%] 602. Fix any TypeScript errors found in WIPA
- [x] [100%] 603. Fix any TypeScript errors found in wipa-admin
- [x] [100%] 604. Smoke test: Sign up → onboarding → verify profile created in DB
- [x] [100%] 605. Smoke test: Login → see real feed posts → create post → like → comment
- [x] [100%] 606. Smoke test: Send connection → accept → verify connected state
- [x] [100%] 607. Smoke test: Open Messages → new conversation → send → verify real-time
- [x] [100%] 608. Smoke test: Browse Members → click profile → see real data
- [x] [100%] 609. Smoke test: Register for event → verify in event_registrations → appears in My Calendar
- [x] [100%] 610. Smoke test: Browse Jobs → apply → verify in job_applications
- [x] [100%] 611. Smoke test: Take quiz → XP awarded → Leaderboard rank updated
- [x] [100%] 612. Smoke test: Admin login → real dashboard data → verify/ban a user
- [x] [100%] 613. Smoke test: Admin creates event → appears on frontend events page
- [x] [100%] 614. Smoke test: Admin approves firm claim → firm shows as claimed
- [x] [100%] 615. `git add . && git commit -m "feat: full backend integration and admin panel"`
- [x] [100%] 616. `git push origin main`
- [x] [100%] 617. Verify all pages load in production deployment

---

## PHASE 2 SUMMARY
| Section | Focus Area | Tasks |
|---------|------------|-------|
| A | Auth System | 23 |
| B | User Profile | 14 |
| C | Feed | 11 |
| D | Messages | 8 |
| E | Network/Members | 9 |
| F | Forums | 8 |
| G | Events | 6 |
| H | Jobs Board | 8 |
| I | Resources | 8 |
| J | Notifications | 6 |
| K | Memberships/Stripe | 5 |
| L | Groups (New) | 9 |
| M | Mentorship (New) | 8 |
| N | AI Chat | 6 |
| O | Board Members | 3 |
| P | Liked Threads | 2 |
| Q | wipa-admin Panel | 84 |
| R | WIPA /admin Verify | 9 |
| S | DB Migrations & RLS | 19 |
| T | API Routes | 18 |
| U | Env Vars & Docs | 3 |
| V | Performance | 7 |
| W | Mobile/Dark Mode | 6 |
| X | Testing & Push | 18 |
| | **TOTAL PHASE 2** | **298 Tasks** |
