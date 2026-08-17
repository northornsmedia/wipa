# GOAL 2 — WIPA Platform Feature Expansion
> Every task must be completed front-to-back: DB schema → migration → API/backend → frontend → wiring → testing.
> Tasks are numbered globally.

---

## FEATURE 1: "Recommended by WIPA" Badge for PPS (Professional Profile Showcase)
### Definition
Admins can mark any member as "Recommended by WIPA". The badge appears on their public profile, Members directory, and feed posts. Only admins can grant/revoke this.

---

### PHASE 1A — DATABASE & MIGRATIONS
- [ ] 1. Add `is_wipa_recommended BOOLEAN DEFAULT false` to `profiles` table
- [ ] 2. Add `recommended_at TIMESTAMPTZ` to `profiles`
- [ ] 3. Add `recommended_by UUID REFERENCES profiles(id)` to `profiles`
- [ ] 4. Write migration `20260817000001_add_wipa_recommended_to_profiles.sql`
- [ ] 5. Apply migration to Supabase via MCP `apply_migration`
- [ ] 6. Add RLS policy: only `is_admin = true` users can UPDATE these 3 columns
- [ ] 7. Write and apply migration `20260817000002_rls_wipa_recommended.sql`

### PHASE 1B — BACKEND / ADMIN
- [ ] 8. In `src/app/admin/users/page.tsx`, add "Grant WIPA Recommended" action button per user row
- [ ] 9. Wire button to: `supabase.from('profiles').update({ is_wipa_recommended: true, recommended_at: new Date().toISOString(), recommended_by: currentAdminId }).eq('id', userId)`
- [ ] 10. Add "Revoke" button that sets `is_wipa_recommended: false` and clears other fields
- [ ] 11. Optimistically update admin table UI after grant/revoke without reload
- [ ] 12. Show "⭐ WIPA Recommended" tag in the admin users table

### PHASE 1C — PUBLIC PROFILE PAGE
- [ ] 13. Fetch `is_wipa_recommended` and `recommended_at` in `src/app/platform/profile/[id]/page.tsx`
- [ ] 14. Render a premium gold badge under the user's name if true: gold star icon + "Recommended by WIPA" text + pulsing glow animation + tooltip on hover
- [ ] 15. Show badge prominently in the cover/header section
- [ ] 16. Show date: "Recommended since Aug 2026"

### PHASE 1D — MEMBERS DIRECTORY
- [ ] 17. Add "WIPA Recommended" filter tab in `src/app/platform/members/page.tsx`
- [ ] 18. Filter members by `is_wipa_recommended = true` when that tab is active
- [ ] 19. Render gold badge on each recommended member card
- [ ] 20. Add small gold star overlay on the member avatar (bottom-right corner)
- [ ] 21. Sort WIPA Recommended members first in the default "All Members" view

### PHASE 1E — FEED / POSTS
- [ ] 22. Fetch `is_wipa_recommended` for post authors in `src/app/platform/page.tsx`
- [ ] 23. Render a small "⭐ WIPA" inline badge next to the author name on each post card
- [ ] 24. Apply same badge to comments/replies in forum posts

### PHASE 1F — NOTIFICATIONS
- [ ] 25. When admin grants badge, insert notification for recipient: type `wipa_recommended`, message: "Congratulations! You've been awarded the 'Recommended by WIPA' badge 🌟"
- [ ] 26. Verify notification appears in recipient's notification bell

### PHASE 1G — TESTING
- [ ] 27. Log in as admin, grant badge to a test user in `/admin/users`
- [ ] 28. Verify badge appears on the test user's public profile
- [ ] 29. Verify badge appears on the Members directory card
- [ ] 30. Verify inline badge appears on the test user's feed posts
- [ ] 31. Revoke badge — verify it disappears everywhere

---

## FEATURE 2: "SPLASH SPONSORED" Banner for IP Services Resource
### Definition
IP Service listings can be marked "SPLASH SPONSORED" — they appear at the top of the IP Services page with a full-width premium animated banner. Admins control which services are sponsored, including expiry dates.

---

### PHASE 2A — DATABASE & MIGRATIONS
- [ ] 32. Add to `resources` table (or IP services table):
  - `is_splash_sponsored BOOLEAN DEFAULT false`
  - `splash_expires_at TIMESTAMPTZ`
  - `splash_tagline TEXT`
  - `splash_cta_text TEXT`
  - `splash_cta_url TEXT`
  - `splash_background_color TEXT`
- [ ] 33. Write and apply migration `20260817000003_add_splash_sponsored_to_resources.sql`
- [ ] 34. RLS: only admins can update splash sponsorship fields

### PHASE 2B — ADMIN PANEL
- [ ] 35. Add "IP Services" tab to `src/app/admin/content/page.tsx`
- [ ] 36. Fetch and display all `ip_services` type resources in a table
- [ ] 37. Add "Set as Splash Sponsored" button per row
- [ ] 38. Opens an inline form: tagline, CTA text, CTA URL, color picker, expiry date
- [ ] 39. On save, update the resource row with splash fields
- [ ] 40. Show gold "SPLASH" tag in the admin table on sponsored rows
- [ ] 41. Add "Remove Sponsorship" button to clear splash fields

### PHASE 2C — SPLASH BANNER COMPONENT
- [ ] 42. Create `src/components/SplashSponsoredBanner.tsx`:
  - Full-width gradient background using `splash_background_color`
  - Service logo/image + title + tagline
  - Shimmer-animated "SPLASH SPONSORED" pill badge
  - CTA button linking to `splash_cta_url`
  - Subtle animated background
  - Dismiss button (saves to sessionStorage)
  - Fully responsive
- [ ] 43. Add close/dismiss button that saves dismissed state to sessionStorage

### PHASE 2D — IP SERVICES PAGE
- [ ] 44. In `src/app/platform/resources/ip-services/page.tsx`, fetch and sort splash-sponsored services to top
- [ ] 45. Check `splash_expires_at` — treat as non-sponsored if past expiry
- [ ] 46. Render `<SplashSponsoredBanner />` above the grid for each sponsored service
- [ ] 47. Add "SPONSORED" badge overlay on the service card in the grid view
- [ ] 48. Render nothing if no active splash sponsors exist

### PHASE 2E — CLICK ANALYTICS
- [ ] 49. Create `sponsored_clicks` table: `resource_id`, `user_id`, `clicked_at`
- [ ] 50. Write and apply migration `20260817000004_add_sponsored_clicks.sql`
- [ ] 51. Log a click to `sponsored_clicks` on each CTA button click
- [ ] 52. In admin panel, show click count per sponsored service

### PHASE 2F — TESTING
- [ ] 53. Set a service as splash-sponsored in admin, navigate to IP Services — verify banner appears
- [ ] 54. Verify non-admin cannot update splash fields via DevTools
- [ ] 55. Set past expiry date — verify sponsorship is hidden on frontend
- [ ] 56. Click CTA — verify click logged in `sponsored_clicks`

---

## FEATURE 3: IP Firm Resource Section
### Definition
A new resource category — "IP Firms Directory" — a searchable, filterable directory of IP law firms. Each firm has a dedicated profile page. Firms can claim their profile.

---

### PHASE 3A — DATABASE & MIGRATIONS
- [ ] 57. Create `ip_firms` table: `id, name, slug, logo_url, cover_image_url, description, website_url, linkedin_url, headquarters, offices JSONB, size_range, founded_year, specializations TEXT[], jurisdictions TEXT[], is_verified, is_featured, is_claimed, claimed_by, claimed_at, contact_email, phone, created_at, updated_at`
- [ ] 58. Create `ip_firm_team_members` table: `id, firm_id, profile_id, role, is_primary_contact`
- [ ] 59. Create `ip_firm_reviews` table: `id, firm_id, reviewer_id, rating INT (1-5), review_text, created_at`
- [ ] 60. Write and apply migration `20260817000005_create_ip_firms.sql`
- [ ] 61. Seed 5-10 sample IP firms via SQL insert
- [ ] 62. RLS: read = public, insert/update = authenticated + is_admin OR claimed owner

### PHASE 3B — ADMIN PANEL
- [ ] 63. Add "IP Firms" tab to `src/app/admin/content/page.tsx`
- [ ] 64. List firms: name, headquarters, size, verified status, featured status
- [ ] 65. "Add New Firm" button — opens a modal form with all fields
- [ ] 66. "Edit" action per row — same form pre-filled
- [ ] 67. "Delete" action with confirmation dialog
- [ ] 68. Toggle "Verified" and "Featured" per firm in the admin table

### PHASE 3C — IP FIRMS LISTING PAGE
- [ ] 69. Create `src/app/platform/resources/ip-firms/page.tsx`
- [ ] 70. Fetch firms — featured first, then alphabetical
- [ ] 71. Search bar: searches `name`, `description`, `specializations`
- [ ] 72. Filter chips: size range, specialization (multi-select), jurisdiction (multi-select), Verified only toggle
- [ ] 73. Render firm cards: logo, name, headquarters, specializations chips, Verified badge, Featured ribbon, short description, "View Profile" button
- [ ] 74. Add empty state when no firms match filters
- [ ] 75. Add "Submit Your Firm" CTA banner at the bottom

### PHASE 3D — INDIVIDUAL FIRM PROFILE PAGE
- [ ] 76. Create `src/app/platform/resources/ip-firms/[slug]/page.tsx`
- [ ] 77. Fetch firm by `slug`
- [ ] 78. Build layout: cover image, logo overlay, name, headquarters, founded year, Verified badge, tabs
- [ ] 79. "Overview" tab: description, offices list, website/LinkedIn links
- [ ] 80. "Specializations" tab: chips for specializations and jurisdictions
- [ ] 81. "Team" tab: fetch team members joined with profiles, show member cards linking to WIPA profiles
- [ ] 82. "Reviews" tab: list reviews with star ratings; "Write a Review" button for authenticated users; review form with 1-5 stars + text; submit inserts to `ip_firm_reviews`
- [ ] 83. "Contact" tab: email, phone, "Contact Firm" button
- [ ] 84. Sidebar: "Claim This Profile" CTA if `is_claimed = false`

### PHASE 3E — CLAIM FIRM PROFILE FLOW
- [ ] 85. Create `src/app/platform/resources/ip-firms/claim/page.tsx`
- [ ] 86. Form: firm name, user's role, proof (LinkedIn URL or email domain)
- [ ] 87. On submit, insert to `firm_claim_requests` table
- [ ] 88. Write and apply migration `20260817000006_create_firm_claim_requests.sql`
- [ ] 89. Add "Firm Claims" tab in admin panel showing pending requests
- [ ] 90. Admin approves → sets `is_claimed = true`, `claimed_by = userId` on the firm

### PHASE 3F — NAVIGATION
- [ ] 91. Add "IP Firms" card/section in `src/app/platform/resources/page.tsx`
- [ ] 92. Update sidebar to include "IP Firms" under Resources

### PHASE 3G — TESTING
- [ ] 93. Verify IP Firms page loads with seed data
- [ ] 94. Verify search and filters work
- [ ] 95. Verify all tabs render on individual firm page
- [ ] 96. Submit a review as a logged-in user — verify it saves and appears
- [ ] 97. Submit a claim request — verify it appears in admin panel
- [ ] 98. Admin approves claim — verify `is_claimed = true`

---

## FEATURE 4: "Create Business Profile" Flow
### Definition
Members representing companies (Startups, IP Firms, Law Firms, Tech Companies) can create a Business Profile linked to their WIPA account with its own page, team, and content.

---

### PHASE 4A — DATABASE & MIGRATIONS
- [ ] 99. Create `business_profiles` table: `id, owner_id, name, slug, type, logo_url, cover_image_url, tagline, description, website_url, linkedin_url, founded_year, company_size, headquarters, specializations TEXT[], contact_email, phone, is_verified, membership_tier, created_at, updated_at`
- [ ] 100. Create `business_team_members` table: `id, business_id, profile_id, role, is_admin, joined_at`
- [ ] 101. Write and apply migration `20260817000007_create_business_profiles.sql`
- [ ] 102. Add `business_profile_id UUID` to `profiles` table
- [ ] 103. Write and apply migration `20260817000008_add_business_profile_to_profiles.sql`

### PHASE 4B — MULTI-STEP CREATE FLOW
- [ ] 104. Create `src/app/platform/business/create/page.tsx` — 5-step wizard:
  - Step 1: Business Type (icon card selection: Startup, Law Firm, IP Firm, Tech Company, Other)
  - Step 2: Basic Info (name, tagline, website, LinkedIn, founded year, company size, headquarters)
  - Step 3: Details (description rich text, specializations multi-select, contact email, phone)
  - Step 4: Branding (logo upload, cover image upload)
  - Step 5: Review & Submit (preview card, Confirm button)
- [ ] 105. Build step navigation: breadcrumb steps at top, Back/Next buttons, progress bar
- [ ] 106. Validate required fields per step before allowing Next
- [ ] 107. Step 4 — logo upload to Supabase `business-logos` bucket with live preview
- [ ] 108. Step 4 — cover image upload to `business-covers` bucket with live preview
- [ ] 109. Auto-generate unique `slug` from business name (lowercase, hyphenated, unique via DB constraint)
- [ ] 110. On submit: insert to `business_profiles`, insert owner to `business_team_members` with `is_admin: true`
- [ ] 111. After creation, redirect to `/platform/business/[slug]`
- [ ] 112. Update `profiles.business_profile_id` for the user

### PHASE 4C — BUSINESS PROFILE PUBLIC PAGE
- [ ] 113. Create `src/app/platform/business/[slug]/page.tsx`
- [ ] 114. Fetch business profile by slug
- [ ] 115. Build layout: cover image, logo overlay, name, type badge, headquarters, tagline, tabs
- [ ] 116. "About" tab: description, specializations, website, LinkedIn, founded year, size
- [ ] 117. "Team" tab: fetch team members joined with profiles; "Invite Team Member" button (business admins only)
- [ ] 118. "Posts" tab: show posts authored by or tagged to this business
- [ ] 119. "Contact" tab: email, phone, website, "Send Message" button
- [ ] 120. "Edit Profile" button visible only to business owner/admins

### PHASE 4D — EDIT BUSINESS PROFILE
- [ ] 121. Create `src/app/platform/business/[slug]/edit/page.tsx`
- [ ] 122. Pre-fill all fields from existing data
- [ ] 123. Allow update of all fields
- [ ] 124. Logo/cover re-upload with current image preview
- [ ] 125. On save, update `business_profiles` row in Supabase

### PHASE 4E — INVITE TEAM MEMBERS
- [ ] 126. "Invite Team Member" opens a modal: search WIPA members by name or email
- [ ] 127. On selection, insert to `business_team_members`
- [ ] 128. Send notification to invited member: "You've been added to [Business Name]'s team on WIPA"
- [ ] 129. Allow removing a team member (business admin only)

### PHASE 4F — PLATFORM INTEGRATION
- [ ] 130. Sidebar: "My Business" link if user has a business profile
- [ ] 131. Sidebar: "Create Business Profile" CTA if user does not have one
- [ ] 132. Personal profile page: show a "Business" card linking to their business profile
- [ ] 133. Main feed: dropdown to post "as your business" (switches `author_id` to business profile)
- [ ] 134. Member search: business profiles searchable alongside personal profiles

### PHASE 4G — ADMIN PANEL
- [ ] 135. Add "Business Profiles" tab in admin panel
- [ ] 136. List all business profiles: name, type, owner, created date
- [ ] 137. Admin can toggle "Verified" status
- [ ] 138. Admin can delete a business profile

### PHASE 4H — TESTING
- [ ] 139. Complete full 5-step creation flow — verify each step saves data
- [ ] 140. Verify logo and cover image upload and display correctly
- [ ] 141. Verify public business profile page renders all tabs correctly
- [ ] 142. Invite a team member — verify notification is received
- [ ] 143. Edit business profile — verify changes persist in Supabase

---

## FEATURE 5: Meetn Integration for Webinars
### Definition
The Webinars section integrates with Meetn for video conferencing. Hosts create sessions from WIPA. Attendees join directly from the event page. Admins configure Meetn API credentials.

---

### PHASE 5A — RESEARCH & SETUP
- [ ] 144. Read Meetn API documentation and identify endpoints for: create room, get room status, get recordings
- [ ] 145. Add to `.env.local`: `MEETN_API_KEY`, `MEETN_API_SECRET`, `MEETN_BASE_URL`
- [ ] 146. Document these env vars for the user to add to Vercel project settings

### PHASE 5B — DATABASE & MIGRATIONS
- [ ] 147. Add to the `resources` table (webinar rows):
  - `meetn_room_id TEXT`
  - `meetn_room_url TEXT`
  - `meetn_host_url TEXT`
  - `webinar_status TEXT DEFAULT 'scheduled'` ('scheduled', 'live', 'ended')
  - `webinar_platform TEXT DEFAULT 'meetn'`
- [ ] 148. Write and apply migration `20260817000009_add_meetn_fields_to_resources.sql`

### PHASE 5C — MEETN API BACKEND
- [ ] 149. Create `src/app/api/meetn/create-room/route.ts` — POST: receives `{title, scheduled_at, duration_minutes, host_user_id}`, calls Meetn API, returns `room_id`, `room_url`, `host_url`, saves to DB
- [ ] 150. Create `src/app/api/meetn/get-status/route.ts` — GET: `?room_id=...`, checks if room is live, returns `status`
- [ ] 151. Create `src/app/api/meetn/recordings/route.ts` — GET: `?room_id=...`, fetches recording URLs from Meetn for ended webinars

### PHASE 5D — WEBINAR CREATE FLOW
- [ ] 152. Add "Host a Webinar" button in `src/app/platform/resources/webinars/page.tsx` (visible to permitted users)
- [ ] 153. "Host Webinar" modal form: title, description, scheduled date/time, duration, cover image upload, category tags, max attendees
- [ ] 154. On submit: call `/api/meetn/create-room`, insert resource row with meetn fields, show success modal with host URL
- [ ] 155. Send notification to WIPA members/followers about the new webinar

### PHASE 5E — WEBINAR DETAIL PAGE
- [ ] 156. In `src/app/platform/resources/webinars/[id]/page.tsx`:
  - Show status badge: "SCHEDULED", "LIVE NOW 🔴", "ENDED"
  - Poll `/api/meetn/get-status` every 30 seconds
  - If live: show prominent pulsing "JOIN NOW" button → `meetn_room_url`
  - If scheduled: show countdown timer
  - If host: show "Start/Host Webinar" button → `meetn_host_url`
  - If ended: show recording links from `/api/meetn/recordings`
- [ ] 157. "Register for Webinar" button — saves to `event_registrations` table
- [ ] 158. Show registered attendee count

### PHASE 5F — LIVE STATUS INDICATOR
- [ ] 159. On Webinars listing page, show red "LIVE" badge on live webinar cards
- [ ] 160. Subscribe to Supabase realtime on the webinar resource row for status updates
- [ ] 161. Push notification to registered attendees when a webinar goes live

### PHASE 5G — RECORDINGS
- [ ] 162. After webinar ends, auto-fetch and store recording URLs in the DB
- [ ] 163. Display recordings in the webinar detail page under a "Recording" section
- [ ] 164. Allow inline video playback or download link

### PHASE 5H — TESTING
- [ ] 165. Create a test webinar room via the API (with valid Meetn credentials)
- [ ] 166. Verify the join URL works
- [ ] 167. Verify live status polling and UI update
- [ ] 168. Verify recording retrieval and display after session ends

---

## FEATURE 6: Member Quizzes and Gamification Leaderboard
### Definition
Members take IP-related quizzes, earn XP, and appear on a global leaderboard. They earn achievement badges for milestones.

---

### PHASE 6A — DATABASE & MIGRATIONS
- [ ] 169. Create `quizzes` table: `id, title, description, category, difficulty, time_limit_seconds, xp_reward, is_published, created_by, created_at`
- [ ] 170. Create `quiz_questions` table: `id, quiz_id, question_text, options JSONB, correct_option, explanation, order_index`
- [ ] 171. Create `quiz_attempts` table: `id, quiz_id, user_id, score, max_score, xp_earned, time_taken_seconds, answers JSONB, completed_at`
- [ ] 172. Create `member_xp` table: `id, user_id UNIQUE, total_xp, level, updated_at`
- [ ] 173. Create `xp_transactions` table: `id, user_id, xp_amount, reason, reference_id, created_at`
- [ ] 174. Create `achievements` table: `id, name, description, icon, xp_threshold, badge_color`
- [ ] 175. Create `member_achievements` table: `id, user_id, achievement_id, unlocked_at`
- [ ] 176. Write and apply migration `20260817000010_create_quiz_gamification.sql`
- [ ] 177. Seed 10 achievements: "Quiz Newbie (10 XP)", "IP Scholar (100 XP)", "Patent Pro (500 XP)", "WIPA Legend (2000 XP)", etc.
- [ ] 178. Seed 3 sample quizzes with 5 questions each

### PHASE 6B — XP SYSTEM (BACKEND)
- [ ] 179. Create `src/app/api/xp/award/route.ts` — POST: `{userId, xpAmount, reason, referenceId}`, inserts to `xp_transactions`, upserts `member_xp`, recalculates level (100 XP = 1 level), checks for new achievement unlocks and sends notifications
- [ ] 180. Define XP reward rules: profile completion (+50), first post (+25), post gets 10 likes (+20), connect with 5 members (+30), attend an event (+40)
- [ ] 181. Wire XP award API calls at the correct points in the codebase for each of the above activities

### PHASE 6C — QUIZ ADMIN PANEL
- [ ] 182. Add "Quizzes" tab in `src/app/admin/content/page.tsx`
- [ ] 183. List all quizzes: title, category, difficulty, question count, published status
- [ ] 184. "Create Quiz" button opens a 2-step quiz builder:
  - Step 1: metadata (title, description, category, difficulty, time limit, XP reward)
  - Step 2: add questions (up to 20) — question text, 4 options, correct option selector, optional explanation, drag-to-reorder
- [ ] 185. "Publish" toggle to make quiz available to members
- [ ] 186. "Edit" and "Delete" actions per quiz

### PHASE 6D — QUIZZES LISTING PAGE
- [ ] 187. Create `src/app/platform/quizzes/page.tsx`
- [ ] 188. Fetch published quizzes from Supabase
- [ ] 189. Display quiz cards: title, category chip, difficulty badge, XP reward, estimated time
- [ ] 190. Show "Completed ✓" badge on quizzes user has already attempted
- [ ] 191. Filter by category and difficulty
- [ ] 192. Add to sidebar navigation

### PHASE 6E — QUIZ TAKING EXPERIENCE
- [ ] 193. Create `src/app/platform/quizzes/[id]/page.tsx`
- [ ] 194. Intro screen: title, description, rules, time limit, XP reward, "Start Quiz" button
- [ ] 195. Quiz in-progress:
  - Question counter ("3 of 10"), countdown timer (red when under 30 seconds)
  - Question text, 4 option buttons (selected highlights blue), "Next" button
  - Progress bar at top
- [ ] 196. Results screen: score display, XP earned rolling counter animation, per-question correct/incorrect with explanations, "Try Again" (no extra XP), "Share Score" button
- [ ] 197. On completion, call `/api/xp/award` with quiz XP
- [ ] 198. Insert to `quiz_attempts` table

### PHASE 6F — LEADERBOARD PAGE
- [ ] 199. Create `src/app/platform/leaderboard/page.tsx`
- [ ] 200. Fetch top 50 members by `total_xp` joined with `profiles`
- [ ] 201. Leaderboard table: rank (#1/#2/#3 gold/silver/bronze), avatar, name, role, country, level badge, total XP, achievements count
- [ ] 202. Highlight the currently logged-in user's row
- [ ] 203. Show current user's own rank even if outside top 50
- [ ] 204. Time filters: "All Time", "This Month", "This Week"
- [ ] 205. Add to sidebar navigation

### PHASE 6G — PROFILE — XP & ACHIEVEMENTS SECTION
- [ ] 206. In `src/app/platform/profile/[id]/page.tsx`, add "Achievements" section
- [ ] 207. Show XP total, current level, level progress bar
- [ ] 208. Show earned achievement badge icons with tooltips
- [ ] 209. Show quiz history: completed quizzes list with score

### PHASE 6H — NOTIFICATIONS
- [ ] 210. On level-up: "🎉 You've reached Level [X]! Keep going!"
- [ ] 211. On achievement unlock: "🏆 You've earned the [Achievement Name] badge!"

### PHASE 6I — TESTING
- [ ] 212. Create a quiz via admin, publish it
- [ ] 213. Take the quiz as a regular user — verify score and XP calculated correctly
- [ ] 214. Verify XP appears on profile and leaderboard
- [ ] 215. Trigger an achievement — verify notification and badge appear on profile

---

## FEATURE 7: Sponsorship Opportunities for Physical and Virtual WIPA Events
### Definition
Organizations can apply to sponsor WIPA events. Sponsors get premium visibility: branded banners, logo placement, social/email mentions. Admins manage packages and approve applications.

---

### PHASE 7A — DATABASE & MIGRATIONS
- [ ] 216. Create `sponsorship_packages` table: `id, name, price, currency, benefits JSONB, logo_placement, banner_placement, social_mention, email_mention, max_sponsors, is_active`
- [ ] 217. Create `event_sponsorships` table: `id, event_id, business_profile_id, package_id, sponsor_name, sponsor_logo_url, sponsor_website_url, sponsor_tagline, status ('pending'/'approved'/'rejected'/'paid'), applied_at, approved_at, approved_by, stripe_payment_intent_id`
- [ ] 218. Write and apply migration `20260817000011_create_sponsorships.sql`
- [ ] 219. Seed 3 default packages: Bronze (£500), Silver (£1500), Gold (£3000)

### PHASE 7B — ADMIN — PACKAGE MANAGEMENT
- [ ] 220. Add "Sponsorships" tab in admin panel
- [ ] 221. Sub-tab "Packages": CRUD for packages — name, price, currency, benefits list (add/remove), feature toggles
- [ ] 222. Sub-tab "Applications": list all applications — event, sponsor, package, status; "Approve" and "Reject" buttons; on approve: update status, notify applicant

### PHASE 7C — SPONSORSHIP APPLY FLOW
- [ ] 223. On event detail page, add "Become a Sponsor" section showing available packages
- [ ] 224. Show package cards: name, price, benefits list
- [ ] 225. "Apply to Sponsor" button opens a 3-step modal: (1) Select package, (2) Sponsor details (logo upload, website, tagline), (3) Review and submit
- [ ] 226. On submit, insert to `event_sponsorships` with `status: 'pending'`
- [ ] 227. Send notification to admins about new application
- [ ] 228. Show confirmation page to sponsor after submission

### PHASE 7D — PAYMENT FLOW
- [ ] 229. Create `src/app/api/sponsorship/checkout/route.ts`: creates Stripe Checkout Session for package price, `client_reference_id` = sponsorship ID
- [ ] 230. Update Stripe webhook handler (`/api/webhooks/stripe`) to handle sponsorship payments: update `stripe_payment_intent_id`, set `status: 'paid'`, auto-approve
- [ ] 231. On successful payment, trigger the sponsorship approval flow

### PHASE 7E — SPONSOR VISIBILITY ON EVENT PAGES
- [ ] 232. On event detail page, fetch approved sponsors for the event
- [ ] 233. Render "Proudly Sponsored by" section: grid of sponsor logos with website links, Gold/Silver/Bronze tiers with different sizing
- [ ] 234. If `logo_placement: true`, show sponsor logo in the event cover area
- [ ] 235. If `banner_placement: true`, render a sponsor banner strip on the event page

### PHASE 7F — SPONSOR DASHBOARD
- [ ] 236. Create `src/app/platform/sponsorships/page.tsx` — dashboard for business profile owners
- [ ] 237. List all sponsorship applications made by the user's businesses with status
- [ ] 238. Allow cancelling a pending application

### PHASE 7G — TESTING
- [ ] 239. Create a sponsorship package in admin
- [ ] 240. Apply to sponsor an event as a business profile owner
- [ ] 241. Admin approves — verify "Proudly Sponsored by" section appears on event page
- [ ] 242. Test Stripe payment with test mode credentials
- [ ] 243. Verify logo/banner placement renders for Gold sponsors

---

## FEATURE 8: "Trending Discussion to Podcast" Feature
### Definition
Forum discussions that hit an engagement threshold are automatically marked "Trending". Admins can convert trending discussions into formal Podcast episodes with auto-generated show notes.

---

### PHASE 8A — DATABASE & MIGRATIONS
- [ ] 244. Add to `forum_posts`: `view_count INT DEFAULT 0`, `trending_score FLOAT DEFAULT 0`, `is_trending BOOLEAN DEFAULT false`, `trended_at TIMESTAMPTZ`
- [ ] 245. Write and apply migration `20260817000012_add_trending_to_forum_posts.sql`
- [ ] 246. Create DB function `compute_trending_score()` triggered on new reply or like: formula = `(likes * 2 + replies * 3 + views / 10) / (hours_since_post ^ 1.5)` — if score > 50, set `is_trending = true`, `trended_at = now()`
- [ ] 247. Write and apply migration for the trigger `20260817000013_trending_score_trigger.sql`

### PHASE 8B — TRENDING DISPLAY
- [ ] 248. In `src/app/platform/forums/page.tsx`, add "🔥 Trending Now" section above the forum list
- [ ] 249. Fetch top 3 posts by `trending_score DESC WHERE is_trending = true`
- [ ] 250. Render as highlight cards with fire emoji, engagement stats, "Join Discussion" CTA
- [ ] 251. In main feed (`platform/page.tsx`), add "Trending in Forums" sidebar widget (top 3)
- [ ] 252. Add "Trending" tab on forums listing page showing all `is_trending = true` posts

### PHASE 8C — VIEW TRACKING
- [ ] 253. Create `src/app/api/forums/track-view/route.ts` — POST `{postId}`: increments `view_count`, throttled to 1 per user per session via sessionStorage
- [ ] 254. Call this API when user opens a forum post detail page

### PHASE 8D — TRENDING → PODCAST CONVERSION
- [ ] 255. In admin panel, add "Trending Discussions" tab showing `is_trending = true` posts
- [ ] 256. Each post has a "Convert to Podcast" button
- [ ] 257. Opens "Create Podcast Episode" modal pre-filled from the discussion: title from post title, show notes from top replies concatenated, guest names from reply authors, host name (admin selects), cover image upload, category tags
- [ ] 258. Admin edits and confirms
- [ ] 259. On confirm, insert new `resources` row (type: 'podcast') with filled data
- [ ] 260. Add `source_forum_post_id UUID REFERENCES forum_posts(id)` to `resources` table
- [ ] 261. Write and apply migration `20260817000014_add_source_forum_to_resources.sql`
- [ ] 262. Show "This discussion became a Podcast! 🎙️" banner on the original forum post with link

### PHASE 8E — NOTIFICATIONS
- [ ] 263. When `is_trending` flips to true, notify post author: "🔥 Your discussion '[Title]' is now trending on WIPA!"
- [ ] 264. Notify all reply authors: "A discussion you participated in is now trending!"

### PHASE 8F — TESTING
- [ ] 265. Create forum post, add 10+ replies to trigger trending score
- [ ] 266. Verify `is_trending` becomes true via DB trigger
- [ ] 267. Verify post appears in "Trending Now" section on forums page
- [ ] 268. Convert to podcast via admin — verify podcast resource is created
- [ ] 269. Verify "became a Podcast" banner appears on the original forum post

---

## FEATURE 9: "My Calendar" with Calendar Synchronisation
### Definition
Each member has a personal calendar showing registered events, webinars, mentorship sessions, and personal notes. They can sync with Google Calendar, Outlook, or Apple Calendar via iCal.

---

### PHASE 9A — DATABASE & MIGRATIONS
- [ ] 270. Create `calendar_events` table: `id, user_id, title, description, start_at, end_at, event_type ('wipa_event'/'webinar'/'mentorship'/'personal_note'), reference_id, reference_type, color, is_all_day, location, meeting_url, created_at`
- [ ] 271. Write and apply migration `20260817000015_create_calendar_events.sql`
- [ ] 272. Create DB trigger: on insert to `event_registrations`, auto-insert a matching `calendar_events` row for the user
- [ ] 273. Create DB trigger: on webinar registration, auto-insert a calendar event
- [ ] 274. Write and apply migration `20260817000016_calendar_auto_insert_triggers.sql`

### PHASE 9B — ICAL FEED ENDPOINT
- [ ] 275. Create `src/app/api/calendar/ical/route.ts` — GET `?userId=&token=`: fetches user's `calendar_events`, returns valid `.ics` file (RFC 5545 format) with VCALENDAR/VEVENT blocks
- [ ] 276. Add `calendar_token TEXT` column to `profiles` for per-user iCal authentication token
- [ ] 277. Write and apply migration `20260817000017_add_calendar_token_to_profiles.sql`
- [ ] 278. Auto-generate and save token on first visit to My Calendar page

### PHASE 9C — GOOGLE CALENDAR OAUTH
- [ ] 279. Add to env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- [ ] 280. Create `src/app/api/calendar/google/auth/route.ts` — redirects to Google OAuth with calendar scope
- [ ] 281. Create `src/app/api/calendar/google/callback/route.ts` — exchanges code for tokens, stores `google_access_token`, `google_refresh_token` in `profiles`
- [ ] 282. Add these columns to profiles and apply migration `20260817000018_add_google_tokens_to_profiles.sql`
- [ ] 283. Create `src/app/api/calendar/google/sync/route.ts` — syncs WIPA calendar events to Google Calendar via Google Calendar API, handles token refresh

### PHASE 9D — OUTLOOK CALENDAR INTEGRATION
- [ ] 284. Add to env: `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_REDIRECT_URI`
- [ ] 285. Create `src/app/api/calendar/outlook/auth/route.ts` — Microsoft OAuth flow
- [ ] 286. Create `src/app/api/calendar/outlook/callback/route.ts` — token exchange, store in `profiles`
- [ ] 287. Add `outlook_access_token`, `outlook_refresh_token` columns and apply migration `20260817000019_add_outlook_tokens.sql`
- [ ] 288. Create `src/app/api/calendar/outlook/sync/route.ts` — syncs to Outlook Calendar via Microsoft Graph API

### PHASE 9E — MY CALENDAR PAGE
- [ ] 289. Create `src/app/platform/calendar/page.tsx`
- [ ] 290. Build monthly calendar grid: previous/next month navigation, 7-column grid (Sun-Sat), each day shows events as colored pills, clicking a day expands to show full event list for that day
- [ ] 291. Build list/agenda view toggle: upcoming events in chronological order, grouped by date
- [ ] 292. Event pills show: title, time, event type icon (🏛️ WIPA events, 🎙️ webinars, 🤝 mentorship)
- [ ] 293. Clicking an event shows a popover: full title, description, time, location, "Join Meeting" button, "View Event Page" link, "Remove from Calendar" option

### PHASE 9F — PERSONAL NOTES
- [ ] 294. "+" button on any day opens "Add Event" modal: title, date/time, description, color picker, all-day toggle
- [ ] 295. Saves as `event_type: 'personal_note'` to `calendar_events`
- [ ] 296. Personal notes are editable and deletable

### PHASE 9G — CALENDAR SYNC SETTINGS UI
- [ ] 297. Add "Sync & Settings" section on the calendar page:
  - "iCal Feed" section: display personal iCal URL (copy button), how-to instructions
  - "Google Calendar" section: "Connect" button (OAuth flow), "Connected ✓" status if connected, "Sync Now" button, "Disconnect" button
  - "Outlook Calendar" section: same structure as Google

### PHASE 9H — NAVIGATION
- [ ] 298. Add "My Calendar" link in platform sidebar navigation
- [ ] 299. Add mini "Upcoming" sidebar widget: next 2-3 calendar events

### PHASE 9I — REMINDER NOTIFICATIONS
- [ ] 300. Create Supabase Edge Function `supabase/functions/calendar-reminders/index.ts`
- [ ] 301. Function runs daily at 9 AM UTC: finds `calendar_events` starting within 24 hours, inserts in-app notification for each user: "Reminder: [Event Title] is tomorrow at [time]"
- [ ] 302. Deploy the edge function and schedule it via cron

### PHASE 9J — TESTING
- [ ] 303. Register for a WIPA event — verify it auto-appears in My Calendar
- [ ] 304. Add a personal note — verify it appears on the calendar grid
- [ ] 305. Copy iCal URL, paste into Apple/Google Calendar — verify events import
- [ ] 306. Connect Google Calendar — verify events appear in Google Calendar after sync
- [ ] 307. Verify reminder notification arrives for an event within 24 hours

---

## FINAL VERIFICATION CHECKLIST (AFTER ALL 9 FEATURES)
- [ ] 308. All 9 features load without JS errors in the browser console
- [ ] 309. All 9 features redirect unauthenticated users to /login
- [ ] 310. All DB migrations applied to production Supabase project
- [ ] 311. All RLS policies correctly restrict unauthorized access
- [ ] 312. All new environment variables documented in `.env.example`
- [ ] 313. Sidebar navigation links to all new pages (Quizzes, Leaderboard, My Calendar, IP Firms, etc.)
- [ ] 314. Admin panel has management sections for all admin-controlled features
- [ ] 315. All pages responsive on mobile (test at 375px width)
- [ ] 316. All pages support dark mode
- [ ] 317. Commit all changes to git and push to remote
- [ ] 318. Deploy to Vercel — verify all pages load in production
- [ ] 319. End-to-end smoke test: complete at least one full user journey for each of the 9 features

---

## SUMMARY
| # | Feature | Tasks |
|---|---|---|
| 1 | WIPA Recommended Badge | 31 |
| 2 | SPLASH SPONSORED (IP Services) | 25 |
| 3 | IP Firm Resource Section | 42 |
| 4 | Create Business Profile Flow | 45 |
| 5 | Meetn Webinar Integration | 25 |
| 6 | Quizzes & Gamification Leaderboard | 47 |
| 7 | Sponsorship Opportunities | 28 |
| 8 | Trending Discussion to Podcast | 26 |
| 9 | My Calendar with Sync | 38 |
| ✅ | Final Verification | 12 |
| | **TOTAL** | **319 Tasks** |
