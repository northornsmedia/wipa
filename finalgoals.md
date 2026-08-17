# FINAL GOALS & COMPLETE PLATFORM ROADMAP
> **Comprehensive Master Blueprint for WIPA (Main Platform) and WIPA-ADMIN (Dedicated Admin Portal)**
> Project: WIPA Ecosystem | Database: Supabase (`bepavczocyvaegkfxtvd.supabase.co`)
> Every feature is specified end-to-end: Database Schema & RLS → Backend/API/Server Actions → Frontend UI/UX → Admin Panel Controls (Pages, Subcategories, Forms & Modals) → Wiring & Verification.

---

## 🏗️ SYSTEM ARCHITECTURE & REPOSITORY OVERVIEW

The WIPA ecosystem consists of two coordinated applications connected to a single Supabase backend:

1. **`WIPA`** (`c:/Users/User/wipsmaster/WIPA`) — The primary user-facing Web & Mobile Platform.
   - Next.js 16 (Turbopack, App Router, SSR/CSR, Tailwind CSS, Framer Motion, Zustand).
   - Serves general visitors, student members, professional members, in-house counsel, and firm representatives.
   - Features: Real-time feeds, 1-on-1 and channel messaging, interactive forums, calendar/events with Meetn/Zoom, quizzes with XP gamification, 11 resource library verticals, business profiles, firm directory with claims, public profiles, and LexIQ embedded AI co-pilot.

2. **`wipa-admin`** (`c:/Users/User/wipsmaster/wipa-admin`) — The dedicated Super-Admin & Operations Management Portal.
   - Next.js App Router administrative console with role-based access control (Master Admin, Content Admin, User Manager).
   - Dedicated management pages with custom forms, modal drawers, rich-text editors, file uploaders, and approval queues for all users, content verticals, events, jobs, business profiles, firms, claims, sponsorships, quizzes, and telemetry.

## 🎯 CORE OPERATIONAL PRINCIPLES (ZERO-MOCK POLICY)
1. **Zero Mock Data on Frontend**: No feature is complete if it relies on hardcoded JavaScript arrays or mock state. All static/mock data across the platform must be migrated to dedicated Supabase tables with clean schemas and seeded properly.
2. **End-to-End Real Database Wiring**: Every UI card, list, filter, form, counter, and detail page must fetch live rows from Supabase via typed queries, Server Actions, or Realtime listeners.
3. **Live Admin Panel Synchronization**: Any addition, edit, approval, or deletion performed inside `wipa-admin` must immediately update the database and reflect live in the `WIPA` frontend without code changes or manual redeployments.
4. **Iterative Table & Migration Creation**: As each feature is developed, any required database tables, indexes, constraints, and RLS policies must be formally created in Supabase with documented SQL migrations.

---

# SECTION I: DATABASE & AUTH FOUNDATION (SUPABASE)

### 1.1 — Supabase Client Setup & Session Management
- [x] 1. Standardize Supabase client initialization in `WIPA/src/lib/supabase.ts` with browser-safe public credentials and server actions client using `SUPABASE_SERVICE_ROLE_KEY`.
- [x] 2. Create `WIPA/src/lib/supabase-server.ts` for server components and API routes requiring elevated service-role privileges with strict admin guards.
- [x] 3. Create `WIPA/src/lib/supabase-browser.ts` singleton client to prevent multiple GoTrue client instances during client navigation.
- [x] 4. Standardize Supabase client initialization in `wipa-admin/src/lib/supabase.ts` and `wipa-admin/src/lib/supabase-server.ts` with admin role enforcement.
- [x] 5. Implement global auth listener in `WIPA/src/components/AuthGuard.tsx` binding `supabase.auth.onAuthStateChange` to Zustand `useAppStore` user state.
- [x] 6. Implement admin auth guard in `wipa-admin/src/components/AdminAuthGuard.tsx` verifying `is_admin === true` or redirecting to `/login`.

### 1.2 — Core Profiles Schema & Trigger Architecture
- [x] 7. Ensure `profiles` table schema contains all required fields:
  - `id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
  - `email TEXT NOT NULL`
  - `full_name TEXT NOT NULL`
  - `avatar_url TEXT`
  - `cover_url TEXT`
  - `bio TEXT`
  - `member_id TEXT UNIQUE`
  - `membership_tier TEXT DEFAULT 'free'` ('free', 'pro', 'enterprise', 'vip')
  - `country TEXT`
  - `practice_area TEXT`
  - `industry_sector TEXT`
  - `company TEXT`
  - `title TEXT`
  - `website_url TEXT`
  - `linkedin_url TEXT`
  - `mobile_number TEXT`
  - `is_verified BOOLEAN DEFAULT false`
  - `verification_status TEXT DEFAULT 'unverified'` ('unverified', 'pending', 'verified', 'rejected')
  - `verification_document_url TEXT`
  - `is_admin BOOLEAN DEFAULT false`
  - `is_wipa_recommended BOOLEAN DEFAULT false`
  - `recommended_at TIMESTAMPTZ`
  - `recommended_by UUID REFERENCES profiles(id)`
  - `business_profile_id UUID`
  - `total_xp INTEGER DEFAULT 0`
  - `xp_level INTEGER DEFAULT 1`
  - `onboarding_completed BOOLEAN DEFAULT false`
  - `created_at TIMESTAMPTZ DEFAULT NOW()`
  - `updated_at TIMESTAMPTZ DEFAULT NOW()`
- [x] 8. Verify and apply `on_auth_user_created` trigger in Supabase to automatically insert a row in `profiles` upon `auth.users` creation.
- [x] 9. Configure Supabase Storage Buckets with RLS policies:
  - `avatars` (public read, authenticated user write for own folder)
  - `covers` (public read, authenticated user write for own folder)
  - `verifications` (admin-only read, authenticated user upload)
  - `feed-media` (public read, authenticated user write)
  - `resource-media` (public read, admin write)
  - `business-logos` (public read, authenticated user write)

---

# SECTION II: USER ACQUISITION, AUTHENTICATION & ONBOARDING

### 2.1 — Authentication Pages & Flows (`WIPA`)
- [ ] 10. `WIPA/src/app/signup/page.tsx` — Wire signup form to `supabase.auth.signUp()`, passing `full_name` in options metadata.
- [ ] 11. Implement real-time password strength meter and email format validation in signup UI.
- [ ] 12. Add Google OAuth and Microsoft OAuth buttons calling `supabase.auth.signInWithOAuth()`.
- [ ] 13. `WIPA/src/app/login/page.tsx` — Wire login form to `supabase.auth.signInWithPassword()`, storing session and redirecting to `/platform`.
- [ ] 14. Wire "Forgot Password" modal calling `supabase.auth.resetPasswordForEmail()`.
- [ ] 15. Create `WIPA/src/app/auth/callback/route.ts` to handle OAuth code exchange and session confirmation.
- [ ] 16. Wire Logout action in `PlatformHeader` and `Sidebar` calling `supabase.auth.signOut()` and clearing Zustand state.

### 2.2 — Multi-Step Onboarding Flow (`WIPA`)
- [ ] 17. `WIPA/src/app/onboarding/page.tsx` — Implement 4-step wizard:
  - Step 1: Professional details (Title, Organization/Firm, Practice Area multi-select, Industry Sector).
  - Step 2: Geographic & Contact Info (Country dropdown, Mobile number, Website, LinkedIn URL).
  - Step 3: Bio & Avatar upload (Crop/upload to `avatars` bucket).
  - Step 4: Credential Verification (Document upload to `verifications` bucket, set `verification_status: 'pending'`).
- [ ] 18. Save all onboarding data to `profiles` table and set `onboarding_completed: true`.
- [ ] 19. Redirect to `/platform` with confetti celebration and award 100 Onboarding Welcome XP.

---

# SECTION III: USER PROFILES, PUBLIC SHOWCASE & BADGES

### 3.1 — Authenticated User Profile (`WIPA`)
- [ ] 20. `WIPA/src/app/platform/profile/page.tsx` — Fetch full profile data from Supabase `profiles` table for current logged-in user.
- [ ] 21. Real-time stats display: Live connection count from `connections`, post count from `feed_posts`, forum replies count, and total XP badge.
- [ ] 22. Wire "Edit Profile" modal to update `bio`, `title`, `company`, `practice_area`, `country`, `linkedin_url`, `website_url`.
- [ ] 23. Wire Avatar and Cover Photo uploaders directly updating Supabase Storage and `profiles` URLs.
- [ ] 24. Display verification status banner: "Pending Verification" (yellow), "Verified IP Practitioner" (blue shield), or "Upload Credentials" (gray).

### 3.2 — Public & Member Profile Pages (`WIPA`)
- [ ] 25. `WIPA/src/app/platform/profile/[id]/page.tsx` — Dynamic profile view for any authenticated member.
- [ ] 26. `WIPA/src/app/u/[member_id]/page.tsx` — Public shareable vanity profile (no authentication required) with SEO OpenGraph tags.
- [ ] 27. Connect Button logic: Query `connections` table to determine state: "Connect", "Pending Request", "Accept Request", or "Connected".
- [ ] 28. "Message" button routing directly to 1-on-1 thread with target user in `/platform/messages`.

### 3.3 — "Recommended by WIPA" Badge System
- [ ] 29. Public Profile Badge: If `is_wipa_recommended === true`, render golden glowing badge with tooltip: "Recommended by WIPA since [Date]".
- [ ] 30. Member Directory Badge: Show gold star indicator on member card in `/platform/members` and `/platform/network`.
- [ ] 31. Feed Posts & Comments Badge: Display inline `⭐ WIPA` badge next to author name on all posts and forum comments.
- [ ] 32. Notification on Grant: Insert notification to `notifications` table when admin grants badge: "Congratulations! You've been awarded the 'Recommended by WIPA' badge 🌟".

---

# SECTION IV: REAL-TIME FEED & COMMUNITY DISCUSSIONS

### 4.1 — Feed Posts Architecture (`WIPA`)
- [ ] 33. Schema `feed_posts`: `id, author_id, content, media_urls TEXT[], privacy, likes_count, comments_count, is_pinned, created_at, updated_at`.
- [ ] 34. `WIPA/src/app/platform/page.tsx` — Fetch paginated feed posts joined with author `profiles` (name, avatar, title, `is_wipa_recommended`, verification status).
- [ ] 35. Post Creation Modal: Text editor, image/video attachment uploader (saving to `feed-media` bucket), privacy selector.
- [ ] 36. Real-time Post Likes: `feed_likes` table with optimistic UI updates and Supabase DB trigger syncing `likes_count`.
- [ ] 37. Threaded Post Comments: `feed_comments` table with instant insertion, author joining, and real-time count increments.
- [ ] 38. Post Author Actions: Edit post modal and Delete post with confirmation (enforced by RLS `author_id === auth.uid()`).
- [ ] 39. Supabase Realtime Subscription: Subscribe to `INSERT` on `feed_posts` to dynamically prepend new posts from other users.

### 4.2 — Discussion Forums (`WIPA`)
- [ ] 40. Schema `forums`: `id, title, slug, description, icon, category, topics_count, posts_count, created_at`.
- [ ] 41. Schema `forum_posts`: `id, forum_id, author_id, title, content, is_pinned, is_locked, views_count, likes_count, replies_count, created_at`.
- [ ] 42. Schema `forum_replies`: `id, post_id, author_id, content, parent_reply_id, likes_count, created_at`.
- [ ] 43. `WIPA/src/app/platform/forums/page.tsx` — Categories overview with real-time topic counts and active discussions.
- [ ] 44. `WIPA/src/app/platform/forums/[forumId]/page.tsx` — Category thread listing with filter by Latest, Most Popular, and Unanswered.
- [ ] 45. `WIPA/src/app/platform/forums/[forumId]/[postId]/page.tsx` — Full discussion post with rich text, author profile card, and threaded replies.
- [ ] 46. "Create Topic" modal in forum categories with category selector, tag picker, and rich-text content input.
- [ ] 47. "Liked Threads" page (`WIPA/src/app/platform/liked-threads/page.tsx`) listing all forum threads bookmarked by the user.

---

# SECTION V: REAL-TIME MESSAGING & NETWORK CONNECTIONS

### 5.1 — 1-on-1 and Group Chat System (`WIPA`)
- [ ] 48. Schema `conversations`: `id, type ('direct' | 'group'), title, created_at, updated_at`.
- [ ] 49. Schema `conversation_participants`: `conversation_id, profile_id, last_read_at, unread_count`.
- [ ] 50. Schema `messages`: `id, conversation_id, sender_id, content, attachments JSONB, is_read, created_at`.
- [ ] 51. `WIPA/src/app/platform/messages/page.tsx` — Split-view chat interface:
  - Left pane: Conversation list with partner avatar, online status indicator, last message snippet, timestamp, unread badge.
  - Right pane: Active message thread with scroll-to-bottom, date dividers, bubble styling (sender vs receiver), attachment preview.
- [ ] 52. Real-time Chat Engine: Supabase Realtime channel subscription on `messages` filtered by active `conversation_id`.
- [ ] 53. Message Sending & Delivery: Instant optimistic bubble rendering, server insert, updating conversation `updated_at`.
- [ ] 54. Auto Read Receipts: Update `last_read_at` and `is_read = true` when conversation is focused.
- [ ] 55. Sidebar live unread counter: Supabase listener updating total unread messages badge across all conversations.
- [ ] 56. Community Channels (`#general`, `#daily-highlights`, `#time-tracking`, `#productivity-systems`) integration.

### 5.2 — Member Directory & Networking (`WIPA`)
- [ ] 57. Schema `connections`: `id, requester_id, recipient_id, status ('pending' | 'accepted' | 'rejected'), created_at, updated_at`.
- [ ] 58. `WIPA/src/app/platform/network/page.tsx` — Searchable and filterable grid of all WIPA members.
- [ ] 59. Filter Bar: Filter by Country, Practice Area (Patents, Trademarks, Copyright, Litigation, Licensing), Industry Sector, and "WIPA Recommended" toggle.
- [ ] 60. Member Cards: Avatar, Name, Title, Company, Country flag, Specialization chips, WIPA Recommended gold badge, "Connect" action.
- [ ] 61. Connection Request Actions: "Send Request", "Cancel Request", "Accept Request", "Reject Request", "Remove Connection".
- [ ] 62. "My Network" Tab: Dedicated view of currently accepted connections with direct messaging shortcuts.

---

# SECTION VI: EVENTS, CALENDAR & WEBINAR HOSTING

### 6.1 — Events Engine (`WIPA`)
- [ ] 63. Schema `events`: `id, title, slug, description, event_date TIMESTAMPTZ, end_date TIMESTAMPTZ, timezone, location, is_virtual, meeting_url, recording_url, cover_image_url, organizer_id, category, price NUMERIC DEFAULT 0, max_attendees, current_attendees INTEGER DEFAULT 0, is_featured BOOLEAN DEFAULT false, is_published BOOLEAN DEFAULT true, created_at`.
- [ ] 64. Schema `event_registrations`: `id, event_id, user_id, status ('registered' | 'attended' | 'cancelled'), ticket_type, created_at`.
- [ ] 65. `WIPA/src/app/platform/events/page.tsx` — Events listing with Upcoming, Past, and Featured tabs, category filters, and search.
- [ ] 66. `WIPA/src/app/platform/events/[id]/page.tsx` — Event deep-dive: Cover banner, countdown timer, speaker lineup, full agenda, location/platform details, RSVP button.
- [ ] 67. One-Click RSVP: Insert to `event_registrations`, increment `current_attendees`, generate calendar invite.
- [ ] 68. Calendar Sync Integration:
  - Add to Google Calendar (`/api/calendar/google/sync`)
  - Add to Outlook Calendar (`/api/calendar/outlook/sync`)
  - Download `.ics` iCal file (`/api/calendar/ical`)
- [ ] 69. `WIPA/src/app/platform/calendar/page.tsx` — Interactive monthly/weekly calendar view of all community events with personal registration highlights.
- [ ] 70. Virtual Room Integration: Direct Meetn/Zoom room launch (`/api/meetn/create-room`) for authorized attendees.

---

# SECTION VII: RESOURCE LIBRARY ECOSYSTEM (11 VERTICALS)

### 7.1 — Universal Resource Schema & Hub (`WIPA`)
- [ ] 71. Schema `resources`:
  - `id, title, slug, category, subcategory, author_name, author_title, author_avatar, organization, summary, content, cover_image_url, file_url, external_url, duration, read_time, tags TEXT[], is_featured, is_premium, is_splash_sponsored, splash_expires_at, splash_tagline, splash_cta_text, splash_cta_url, splash_background_color, views_count, downloads_count, created_at, updated_at`.
- [ ] 72. `WIPA/src/app/platform/resources/page.tsx` — Master resource directory index featuring cards for all 11 content verticals.
- [ ] 73. `WIPA/src/components/Sidebar.tsx` — Collapsible animated Resource Library menu with dedicated ChevronDown toggle and zero page-jump.

### 7.2 — Resource Verticals Implementation (`WIPA`)
- [ ] 74. **Webinars & Learning** (`/platform/resources/webinars`) — Video webinar archive with embedded video player, slide downloads, speaker bios, and transcript accordion.
- [ ] 75. **Education & Dev** (`/platform/resources/education`) — University and executive IP courses directory, filterable by institution, degree level, duration, and topic.
- [ ] 76. **Women's IP World** (`/platform/resources/womens-ip-world`) — Annual digital publication reader, spotlight articles, interviews with leading female practitioners, and downloadable PDF issues.
- [ ] 77. **Articles & Insights** (`/platform/resources/articles-insights`) — Expert written analysis on patent litigation, trademark strategy, trade secrets, and emerging IP trends.
- [ ] 78. **IP News & Legal Updates** (`/platform/resources/ip-news`) — Curated global intellectual property news feed categorized by jurisdiction (US PTO, EPO, WIPO, Asia-Pacific, Latin America).
- [ ] 79. **Research & Reports** (`/platform/resources/research-reports`) — Comprehensive industry whitepapers, statistical IP benchmark reports, and downloadable PDF research.
- [ ] 80. **Guides & Toolkits** (`/platform/resources/guides-toolkits`) — Practical checklists, contract templates, IP audit worksheets, and filing toolkits with one-click downloads.
- [ ] 81. **Career & Leadership** (`/platform/resources/career-leadership`) — Leadership development guides, salary insights, career transition advice, and executive interview series.
- [ ] 82. **In-House Counsel** (`/platform/resources/in-house-counsel`) — Dedicated hub for corporate IP directors, portfolio management frameworks, outside counsel budgeting, and risk mitigation strategies.
- [ ] 83. **Podcasts & Conversations** (`/platform/resources/podcasts-conversations`) — Audio podcast player with playlist support, episode timestamps, host details, and audio waveform visualizer.
- [ ] 84. **Wellness & Wellbeing** (`/platform/resources/wellness-v2`) — Mental health, work-life balance, mindfulness workshops, stress management for IP professionals, and retreat listings.

### 7.3 — Splash Sponsored Banner Integration (`WIPA`)
- [ ] 85. `WIPA/src/components/SplashSponsoredBanner.tsx` — Full-width animated banner component rendering at top of sponsored resource categories:
  - Custom gradient/background color.
  - Sponsor logo, title, and marketing tagline.
  - Shimmering "SPLASH SPONSORED" badge.
  - CTA button tracking clicks to `sponsored_clicks` table (`resource_id, user_id, clicked_at`).
  - Dismiss button storing session preference.

---

# SECTION VIII: IP FIRMS DIRECTORY & PROFILE CLAIMS

### 8.1 — IP Firms Directory Architecture (`WIPA`)
- [ ] 86. Schema `ip_firms`:
  - `id, name, slug, logo_url, cover_image_url, description, website_url, linkedin_url, headquarters, offices JSONB, size_range, founded_year, specializations TEXT[], jurisdictions TEXT[], is_verified, is_featured, is_claimed, claimed_by UUID REFERENCES profiles(id), claimed_at, contact_email, phone, created_at, updated_at`.
- [ ] 87. Schema `ip_firm_team_members`: `id, firm_id, profile_id UUID REFERENCES profiles(id), role, is_primary_contact`.
- [ ] 88. Schema `ip_firm_reviews`: `id, firm_id, reviewer_id UUID REFERENCES profiles(id), rating INTEGER CHECK (rating BETWEEN 1 AND 5), review_text, created_at`.
- [ ] 89. `WIPA/src/app/platform/resources/ip-firms/page.tsx` — Searchable firm directory:
  - Search by firm name, description, specialization.
  - Filter chips: Size range, Specializations (Patents, Trademarks, Copyright, Litigation), Jurisdictions, Verified only.
  - Firm Cards: Logo, name, HQ, specialization pills, Verified badge, Featured ribbon, "View Profile" CTA.
- [ ] 90. `WIPA/src/app/platform/resources/ip-firms/[slug]/page.tsx` — Comprehensive firm profile:
  - Header: Cover image, logo, firm name, verified badge, headquarters, size, founded date.
  - Tab 1: Overview (About, Office locations map/list, Website, LinkedIn).
  - Tab 2: Specializations & Jurisdictions breakdown.
  - Tab 3: Team Members (joined with WIPA member profiles).
  - Tab 4: Reviews & Ratings (star rating breakdown, list of verified reviews, "Write a Review" form).
  - Tab 5: Contact Firm inquiry form.
- [ ] 91. `WIPA/src/app/platform/resources/ip-firms/claim/page.tsx` — Firm Claiming Wizard:
  - Multi-step application for firm partners to claim their profile with work email verification and supporting documentation.
  - Writes to `firm_claim_requests` table (`id, firm_id, requester_id, role_at_firm, work_email, proof_url, status ('pending'|'approved'|'rejected'), created_at`).

---

# SECTION IX: BUSINESS PROFILES & COMPANY HUBS

### 9.1 — Business Profiles Framework (`WIPA`)
- [ ] 92. Schema `business_profiles`:
  - `id, owner_id UUID REFERENCES profiles(id), name, slug, type ('Startup' | 'Law Firm' | 'IP Boutique' | 'Corporate' | 'Tech Company'), logo_url, cover_image_url, tagline, description, website_url, linkedin_url, founded_year, company_size, headquarters, specializations TEXT[], contact_email, phone, is_verified, membership_tier, created_at, updated_at`.
- [ ] 93. Schema `business_team_members`: `id, business_id UUID REFERENCES business_profiles(id), profile_id UUID REFERENCES profiles(id), role, is_admin, joined_at`.
- [ ] 94. `WIPA/src/app/platform/business/create/page.tsx` — 5-Step Creation Wizard:
  - Step 1: Business Type selection.
  - Step 2: Company Core Info (Name, Tagline, Website, LinkedIn, HQ, Founded Year, Size).
  - Step 3: Specializations & Contact (Practice areas, Corporate email, Phone).
  - Step 4: Visual Branding (Logo & Cover upload to `business-logos` bucket).
  - Step 5: Review & Publish.
- [ ] 95. `WIPA/src/app/platform/business/[slug]/page.tsx` — Public Business Profile page showcasing team, jobs posted, articles authored, and services provided.
- [ ] 96. `WIPA/src/app/platform/business/[slug]/edit/page.tsx` — Business settings dashboard for authorized business team members.

---

# SECTION X: JOBS BOARD & CAREER OPPORTUNITIES

### 10.1 — Jobs Board Architecture (`WIPA`)
- [ ] 97. Schema `jobs`:
  - `id, title, slug, company_name, company_logo_url, company_id UUID REFERENCES business_profiles(id), poster_id UUID REFERENCES profiles(id), location, is_remote, job_type ('Full-time' | 'Part-time' | 'Contract' | 'Internship'), experience_level ('Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive'), salary_min, salary_max, currency, description, requirements TEXT[], benefits TEXT[], application_url, application_email, is_featured, is_active, applicants_count, views_count, created_at, expires_at`.
- [ ] 98. Schema `job_applications`: `id, job_id UUID REFERENCES jobs(id), applicant_id UUID REFERENCES profiles(id), resume_url, cover_letter, status ('submitted' | 'reviewing' | 'interview' | 'rejected' | 'accepted'), created_at`.
- [ ] 99. `WIPA/src/app/platform/jobs/page.tsx` — Interactive Jobs Board:
  - Search by role title, company, or keyword.
  - Filters: Job Type, Experience Level, Remote only, Salary Range.
  - Job Listing Cards with "Apply Now" action and "Save Job" bookmarking.
- [ ] 100. `WIPA/src/app/platform/jobs/[id]/page.tsx` — Full job description view with quick-apply modal (resume upload, profile data pre-fill).

---

# SECTION XI: GAMIFICATION, XP, QUIZZES & LEADERBOARDS

### 11.1 — XP Engine & Quizzes (`WIPA`)
- [ ] 101. Schema `quizzes`: `id, title, slug, category, difficulty ('Beginner' | 'Intermediate' | 'Advanced'), description, xp_reward, time_limit_seconds, passing_score, is_published, created_at`.
- [ ] 102. Schema `quiz_questions`: `id, quiz_id UUID REFERENCES quizzes(id), question_text, explanation, order_num`.
- [ ] 103. Schema `quiz_options`: `id, question_id UUID REFERENCES quiz_questions(id), option_text, is_correct, order_num`.
- [ ] 104. Schema `quiz_attempts`: `id, quiz_id, user_id, score, total_questions, xp_earned, passed, answers JSONB, completed_at`.
- [ ] 105. Schema `xp_history`: `id, user_id UUID REFERENCES profiles(id), action_type, xp_amount, reference_id, created_at`.
- [ ] 106. `WIPA/src/app/platform/quizzes/page.tsx` — Quiz catalog sorted by difficulty and IP practice area.
- [ ] 107. `WIPA/src/app/platform/quizzes/[id]/page.tsx` — Gamified test interface with timer, progress bar, animated option selection, and instant score celebration.
- [ ] 108. XP Awarding API (`/api/xp/award`): Secure endpoint verifying quiz completion and updating user's `total_xp` and `xp_level`.
- [ ] 109. `WIPA/src/app/platform/leaderboard/page.tsx` — Community leaderboard ranking top practitioners by weekly, monthly, and all-time XP with celebratory podium animations.

---

# SECTION XII: LEXIQ AI CO-PILOT (INTELLIGENT AGENT)

### 12.1 — LexIQ Architecture & Multi-Model Engine (`WIPA`)
- [ ] 110. Multi-Model Selection in `WIPA/src/components/LexIQChatCard.tsx`:
  - **LexIQ Fast** (`nvidia/nemotron-3.5-lightning:free` via `OPENROUTER_NEMOTRON_KEY`)
  - **LexIQ Advanced** (`google/gemma-4-31b-it:free` via `OPENROUTER_GEMMA_KEY`)
  - **LexIQ Beta** (`dots-studio/dots-3-note-preview:free` via `OPENROUTER_DOTS_KEY`)
  - **LexIQ Super** (`openai/gpt-4o-mini` via default OpenRouter key)
  - **LexIQ Gemini** (`gemini-3.6-flash` via `GEMINI_API_KEY`)
- [ ] 111. System Prompt & Knowledge Base (`WIPA/src/lib/lexiq/system-prompt.ts`):
  - Injects full `PAGE_MAP` of all 40+ platform routes and natural language aliases.
  - Dynamic user context injection: `{userName}`, `{userRole}`, `{userXP}`, `{userLevel}`, `{unreadNotifications}`, `{connectionCount}`.
  - Strict navigation protocol: Emits `{ "action": "navigate", "path": "/target-route" }`.
- [ ] 112. Automated Navigation Execution: `LexIQChatCard.tsx` parses JSON navigation blocks and triggers instantaneous SPA routing via Next.js `useRouter().push()`.
- [ ] 113. Thought Process Visualizer: Expandable dropdown in chat bubble rendering `reasoning_details` for reasoning-capable models.
- [ ] 114. Seamless Typing UX: Automatic textarea refocusing when AI finishes generating response.

---

# SECTION XIII: DEDICATED ADMIN PORTAL (`wipa-admin`) — PAGES, FORMS & SUBCATEGORIES

### 13.1 — Admin Console Core, Shell & Navigation (`wipa-admin`)
- [x] 115. `wipa-admin/src/app/login/page.tsx` — Secure Admin Authentication validating `is_admin === true` in `profiles` table.
- [x] 116. `wipa-admin/src/components/AdminSidebar.tsx` — Collapsible navigation with active route highlights, badge counts for pending verifications and claims, and dark mode toggle.
- [x] 117. `wipa-admin/src/app/dashboard/page.tsx` (or `/page.tsx`) — Real-time analytics dashboard with metric cards (Total Users, Pending Verifications, Active Firms, Job Postings, Resource Views, Active Sponsorships).

### 13.2 — Users & Credential Verification Console (`wipa-admin/src/app/users`)
- [x] 118. `wipa-admin/src/app/users/page.tsx` — Master Member Management Console:
  - Member table: Avatar, Name, Email, Country, Practice Area, Tier, Status, Recommended badge, Join Date.
  - Search by Name/Email, filter by Country, Tier ('free'|'pro'|'enterprise'|'vip'), and Verification Status.
- [x] 119. **User Verification Review Drawer (`wipa-admin/src/components/UserVerificationDrawer.tsx`)**:
  - Embedded PDF/Image document viewer for `profiles.verification_document_url`.
  - Member metadata overview (license number, practice jurisdiction, company).
  - "Approve Verification" button → sets `verification_status = 'verified'`, `is_verified = true`, awards 250 XP, and fires celebratory notification.
  - "Reject Verification" button with custom rejection reason form → sets `verification_status = 'rejected'` and notifies user.
- [x] 120. **User Profile Edit Modal (`wipa-admin/src/components/EditUserModal.tsx`)**:
  - Edit full name, email, company, title, practice area, country.
  - Tier selector dropdown (Free, Pro, Enterprise, VIP).
  - Toggle "Recommended by WIPA" (`is_wipa_recommended`) with admin timestamp.
  - Reset password trigger and Ban/Suspend account toggle.

### 13.3 — Universal Content Management & Subcategory Builder (`wipa-admin/src/app/content`)
- [x] 121. `wipa-admin/src/app/content/page.tsx` — Universal Resource Publisher with subcategory tabs:
  - Tab 1: **Webinars & Learning** (`webinars`)
  - Tab 2: **Education & Dev** (`education`)
  - Tab 3: **Women's IP World** (`womens-ip-world`)
  - Tab 4: **Articles & Insights** (`articles-insights`)
  - Tab 5: **IP News & Legal Updates** (`ip-news`)
  - Tab 6: **Research & Reports** (`research-reports`)
  - Tab 7: **Guides & Toolkits** (`guides-toolkits`)
  - Tab 8: **Career & Leadership** (`career-leadership`)
  - Tab 9: **In-House Counsel** (`in-house-counsel`)
  - Tab 10: **Podcasts & Conversations** (`podcasts-conversations`)
  - Tab 11: **Wellness & Wellbeing** (`wellness`)
- [x] 122. **Resource Creator & Editor Form (`wipa-admin/src/components/ResourceFormModal.tsx`)**:
  - Basic Info: Title, Slug (auto-generated from title), Category dropdown, Subcategory input.
  - Author details: Author Name, Author Title, Organization, Author Avatar URL.
  - Content details: Summary/Excerpt, Full Rich-Text/Markdown Content editor.
  - Media & Files: Cover image file uploader (saving to Supabase `resource-media` bucket), Downloadable attachment uploader (PDF/DOCX/ZIP), External video/audio URL (YouTube, Vimeo, Spotify).
  - Metadata: Read time / Duration, Tags input (multi-chip array), Featured toggle, Premium-only toggle.
- [x] 123. **"Splash Sponsored" Configurator Modal (`wipa-admin/src/components/SplashConfigModal.tsx`)**:
  - Toggle `is_splash_sponsored` active/inactive.
  - Tagline input (e.g. "Trusted IP Management Software for Global Teams").
  - CTA Button Text input (e.g. "Book a Demo") and Destination URL.
  - Banner Background Color picker (Hex / Tailwind gradient preset).
  - Expiration Date & Time picker (`splash_expires_at`).
  - Real-time Click Analytics view: displays total clicks recorded in `sponsored_clicks` table.
- [x] 124. Content Actions: Publish/Unpublish toggle, Duplicate article, and Delete resource confirmation modal.

### 13.4 — Event Management & Attendee Roster Console (`wipa-admin/src/app/events`)
- [x] 125. `wipa-admin/src/app/events/page.tsx` — Master Event Console:
  - Events data table: Cover Thumbnail, Event Title, Date & Time, Virtual/In-Person, Category, Registered Count / Capacity, Status.
  - Search by title, filter by Upcoming vs Past and Virtual vs In-Person.
- [x] 126. **Event Creation & Edit Wizard Form (`wipa-admin/src/components/EventFormModal.tsx`)**:
  - Title, Slug, Category (Webinar, Networking, Workshop, Summit, Masterclass).
  - Date & Time pickers (Start Date, End Date, Timezone).
  - Format: Virtual toggle (Meeting URL, Platform selector: Meetn / Zoom / Teams) or Physical Location (Venue address, City, Country).
  - Speaker Lineup Builder: Dynamic array of `{ name, title, company, avatar_url, linkedin_url }`.
  - Cover Banner Image uploader (saving to `resource-media` bucket).
  - Ticketing: Free vs Paid toggle, Price, Maximum Attendee limit (`max_attendees`).
  - Featured Event toggle and Published status toggle.
- [x] 127. **Attendee Roster & Check-In Drawer (`wipa-admin/src/components/AttendeeRosterDrawer.tsx`)**:
  - List of all registered members from `event_registrations` joined with `profiles`.
  - Check-in status toggle (Registered, Attended, No-Show).
  - "Export to CSV" button generating roster spreadsheet.
- [x] 128. **Post-Event Archiving & Recording Uploader**:
  - Upload event recording URL and transcript to auto-publish into the Webinars resource library.

### 13.5 — IP Firms Directory & Claims Console (`wipa-admin/src/app/firms`)
- [x] 129. `wipa-admin/src/app/firms/page.tsx` — IP Firms Directory Console:
  - Firms table: Logo, Firm Name, Headquarters, Specializations, Verified status, Featured status, Claimed status.
  - Search by firm name, filter by Specialization and Country.
- [x] 130. **Firm Creation & Edit Modal (`wipa-admin/src/components/FirmFormModal.tsx`)**:
  - Firm Name, Slug, Logo uploader, Cover banner uploader.
  - Description / Firm Overview rich-text.
  - Website URL, LinkedIn URL, Contact Email, Phone number.
  - Headquarters (City, Country), Founded Year, Size Range dropdown (1-10, 11-50, 51-200, 200+).
  - Specializations multi-select chips (Patents, Trademarks, Copyright, Litigation, IP Strategy, Licensing).
  - Jurisdictions multi-select chips (US, Europe, UK, Asia, Latin America, Global).
  - Dynamic Offices Array builder: Add multiple office locations `{ city, country, address, phone }`.
  - Toggles: "Verified Firm" (`is_verified`) and "Featured Firm" (`is_featured`).
- [x] 131. `wipa-admin/src/app/firms/claims/page.tsx` — Firm Claim Requests Queue:
  - Table of pending claim requests from `firm_claim_requests` table.
  - **Claim Inspection Modal (`wipa-admin/src/components/ClaimInspectionModal.tsx`)**:
    - View claimant profile, claimed firm details, claimant role at firm, work email domain, and uploaded proof document / LinkedIn link.
    - "Approve Claim" button → sets `ip_firms.is_claimed = true`, `ip_firms.claimed_by = claimant_id`, sets `firm_claim_requests.status = 'approved'`, and sends notification.
    - "Reject Claim" button with feedback text → sets `firm_claim_requests.status = 'rejected'`.

### 13.6 — Business Profiles Console (`wipa-admin/src/app/business`)
- [x] 132. `wipa-admin/src/app/business/page.tsx` — Business Profiles Management:
  - Table of all registered companies from `business_profiles`.
  - Shows Logo, Name, Type (Startup, Law Firm, Tech Company), Owner name, HQ, Verification status.
  - **Business Profile Edit Modal (`wipa-admin/src/components/BusinessFormModal.tsx`)**:
    - Modify name, tagline, description, specializations, website, contact info.
    - Toggle `is_verified` corporate shield.
    - Manage business team members roster.

### 13.7 — Jobs Board Moderation Console (`wipa-admin/src/app/jobs`)
- [x] 133. `wipa-admin/src/app/jobs/page.tsx` — Jobs Board Console:
  - Jobs table: Job Title, Company Name, Location, Remote/Onsite, Job Type, Applicants Count, Active/Expired status.
  - Filter by Active, Expired, Remote, and Job Type.
- [x] 134. **Job Posting Creator & Editor Form (`wipa-admin/src/components/JobFormModal.tsx`)**:
  - Title, Slug, Company selector (or custom company name & logo).
  - Location (City/Country or "Remote"), Job Type (Full-time, Part-time, Contract, Internship), Experience Level.
  - Salary Range (Min, Max, Currency).
  - Detailed Description rich-text, Requirements array builder, Benefits array builder.
  - Application Method: External URL or In-Platform Application Email.
  - Expiration date picker and "Featured Job" toggle.
- [x] 135. **Job Applicants Review Drawer (`wipa-admin/src/components/JobApplicantsDrawer.tsx`)**:
  - View applicant profiles from `job_applications` table.
  - View uploaded resumes (`resume_url`), cover letters, and submission timestamps.
  - Update applicant status (Submitted, Reviewing, Interview, Rejected, Accepted).

### 13.8 — Sponsorships & Banner Ad Console (`wipa-admin/src/app/sponsorships`)
- [x] 136. `wipa-admin/src/app/sponsorships/page.tsx` — Master Sponsorships Manager:
  - View all active Splash Sponsored listings, Featured Event sponsors, and Spotlight Firm campaigns.
  - Real-time Analytics Table: Sponsor Name, Campaign Placement, Start Date, End Date, Total Views, Total Clicks, Click-Through Rate (CTR).
  - "New Sponsorship Campaign" form linking sponsor to any resource, event, or directory category.

### 13.9 — Community Forums & Discussion Moderation (`wipa-admin/src/app/forums`)
- [x] 137. `wipa-admin/src/app/forums/page.tsx` — Forum Categories & Moderation Console:
  - Manage Forum Categories (Create, Edit icon/name/description, Reorder, Delete).
  - Moderate flagged posts and replies.
  - Actions: Pin Topic (`is_pinned`), Lock Topic (`is_locked`), or Delete spam threads.

### 13.10 — IP Quiz Builder & Gamification Console (`wipa-admin/src/app/quizzes`)
- [x] 138. `wipa-admin/src/app/quizzes/page.tsx` — Quizzes & Gamification Manager:
  - Catalog of IP Quizzes with difficulty badges, total attempts, average score, and XP rewards.
- [x] 139. **Interactive Quiz Builder Form (`wipa-admin/src/components/QuizBuilderModal.tsx`)**:
  - Quiz Title, Slug, Category, Difficulty ('Beginner'|'Intermediate'|'Advanced'), Description, XP Reward amount, Time Limit in seconds, Passing Score percentage.
  - Dynamic Question Builder:
    - Add Question text, Explanation for answer.
    - Add 4 Multiple-Choice Options with radio button to designate the correct answer.
    - Drag-and-drop question reordering.
  - Publish / Draft toggle.

### 13.11 — Platform Telemetry, Analytics & System Settings (`wipa-admin`)
- [x] 140. `wipa-admin/src/app/analytics/page.tsx` — Platform Telemetry & Growth Visualizer:
  - Member registration growth curve (Weekly, Monthly, Annual).
  - Geographic distribution map of members across Switzerland, US, UK, India, Peru, etc.
  - Top 10 most viewed resources and articles.
  - LexIQ AI assistant usage statistics: Total queries, model distribution (Gemini vs OpenRouter), top queried topics.
- [x] 141. `wipa-admin/src/app/settings/page.tsx` — Platform Configuration & Admin Roles:
  - Manage admin user permissions (Grant/Revoke `is_admin` role).
  - System health check (Supabase connection, Storage bucket capacity, AI API key status).

---

# SECTION XIV: SYSTEM INTEGRATION, WIRING & DEPLOYMENT

### 14.1 — Dual Repository Coordination
- [x] 142. Verify both `WIPA` and `wipa-admin` point to the identical Supabase project (`bepavczocyvaegkfxtvd.supabase.co`).
- [x] 143. Standardize environment variable keys across both repositories (`.env.local`):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENROUTER_GEMMA_KEY`
  - `OPENROUTER_NEMOTRON_KEY`
  - `OPENROUTER_DOTS_KEY`
  - `GEMINI_API_KEY`
- [x] 144. Run end-to-end TypeScript compilation and Next.js production builds across both `WIPA` and `wipa-admin` ensuring 0 compilation errors.
- [x] 145. Verify Vercel deployment pipeline triggers smoothly for both repositories upon GitHub push.

---
*(End of Master Blueprint. Fully expanded with every admin page, subcategory, form, modal, and drawer).*
