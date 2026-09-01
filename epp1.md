# WIPA Platform — Complete Endpoints & API Directory (`epp1.md`)

> **Comprehensive Endpoint Audit of the Women's IP Alliance (WIPA) Platform**  
> Generated: September 2026 | Application: `WIPA` (wipa-platform)

---

## 📊 Executive Summary

| Category | Total Count | Description |
| :--- | :--- | :--- |
| **REST API Route Handlers** | **23 Endpoints (26 Methods)** | Backend API handlers in `/api/*` (Stripe, Meetn, AI, XP, Notifications, Telemetry, Calendar, Cron) |
| **Server Action Modules** | **4 Action Files (25+ Methods)** | Next.js Server Actions in `/src/app/actions/*` (Chat, Feed, LexIQ, Profiles) |
| **App & Platform Page Routes** | **101 Page Routes** | Interactive web pages across Main Platform, Resources, Member Hub, Public & Admin |
| **Total Route Surfaces** | **128 Endpoints** | Complete endpoint surface of the WIPA codebase |

---

## 1. REST API Route Endpoints (`/api/*`)

All REST endpoints reside under `src/app/api/` and handle webhooks, third-party integrations, telemetry, and background cron jobs:

| # | Endpoint | Methods | Auth / Protection | Description & Functionality |
| :- | :--- | :-: | :--- | :--- |
| 1 | `/api/xp/award` | `POST` | Supabase Service Role | Awards XP and gamification points to users for platform engagement. |
| 2 | `/api/telemetry` | `POST` | Public / Client | Captures client telemetry (IP resolution, ISP, Geo, OS, browser, device). |
| 3 | `/api/webhooks/stripe` | `POST` | Stripe Signature | Processes incoming Stripe webhook events (subscriptions, memberships, payments). |
| 4 | `/api/checkout` | `GET` | Authenticated | Creates a Stripe Checkout Session for memberships and digital products. |
| 5 | `/api/sponsorship/checkout` | `POST` | Authenticated | Generates Stripe checkout session for event sponsorships & corporate packages. |
| 6 | `/api/sponsored-clicks` | `POST` | Public / Client | Tracks clicks and conversions on sponsored listings and business profiles. |
| 7 | `/api/ad-tracking` | `POST` | Public / Client | Records impression and click-through metrics for targeted ad slots. |
| 8 | `/api/notifications/push` | `POST` | WebPush / VAPID | Dispatches native WebPush background push notifications to subscribed devices. |
| 9 | `/api/proxy-ai` | `GET`, `POST` | OpenRouter / Custom | AI proxy endpoint routing prompt requests to LLMs and custom AI assistants. |
| 10 | `/api/forums/track-view` | `POST` | Client / Session | Increments view counts and engagement metrics on discussion threads. |
| 11 | `/api/meetn/create-room` | `POST` | Meetn API Key | Programmatically provisions a virtual video meeting room via Meetn API. |
| 12 | `/api/meetn/generate-link` | `POST` | Meetn API Key | Generates host/attendee secure join URLs for WIPA masterclasses & events. |
| 13 | `/api/meetn/get-status` | `GET` | Meetn API Key | Queries the real-time live status of a Meetn video meeting room. |
| 14 | `/api/meetn/recordings` | `GET` | Meetn API Key | Fetches recorded webinars and cloud video session archives. |
| 15 | `/api/cron/sync-recordings` | `GET` | Cron Secret | Automated background job syncing Meetn recordings into the Resource Library. |
| 16 | `/api/cron/sync-ip-news` | `GET`, `POST` | Cron Secret | Automated background job scraping and syncing global IP Law news feeds. |
| 17 | `/api/calendar/ical` | `GET` | Public / Token | Generates dynamic `.ics` iCalendar feed for member event calendar sync. |
| 18 | `/api/calendar/google/auth` | `GET` | OAuth 2.0 | Initiates Google Calendar OAuth authorization flow for automatic event sync. |
| 19 | `/api/calendar/google/callback` | `GET` | OAuth 2.0 | Handles Google OAuth callback and exchanges auth code for refresh tokens. |
| 20 | `/api/calendar/google/sync` | `POST` | Authenticated | Synchronizes WIPA platform events directly to the user's Google Calendar. |
| 21 | `/api/calendar/outlook/auth` | `GET` | OAuth 2.0 | Initiates Microsoft Outlook / Office 365 OAuth authorization flow. |
| 22 | `/api/calendar/outlook/callback` | `GET` | OAuth 2.0 | Handles Microsoft OAuth callback and saves Outlook sync credentials. |
| 23 | `/api/calendar/outlook/sync` | `POST` | Authenticated | Synchronizes WIPA platform events directly to Microsoft Outlook Calendar. |

---

## 2. Next.js Server Actions (`/src/app/actions/*`)

Direct server-side function endpoints invoked seamlessly from React Client Components:

| Module | Location | Primary Functions | Description |
| :--- | :--- | :--- | :--- |
| **Chat Actions** | [`/src/app/actions/chat.ts`](file:///c:/Users/User/wipsmaster/WIPA/src/app/actions/chat.ts) | `sendMessage`, `getMessages`, `markAsRead`, `getUnreadCount`, `deleteMessage` | Handles end-to-end encrypted messaging, message delivery, read receipts, and attachments. |
| **Feed Actions** | [`/src/app/actions/feed.ts`](file:///c:/Users/User/wipsmaster/WIPA/src/app/actions/feed.ts) | `createFeedPost`, `togglePostLike`, `addPostComment`, `deletePost`, `reportPost` | Manages community feed posts, comments, media uploads, and hashtag filtering. |
| **LexIQ Actions** | [`/src/app/actions/lexiq.ts`](file:///c:/Users/User/wipsmaster/WIPA/src/app/actions/lexiq.ts) | `askLexIQ`, `queryPatentDatabase`, `analyzeLegalDocument`, `generateSummary` | AI Copilot engine for legal research, IP portfolio analysis, and intelligent QA. |
| **Profile Actions** | [`/src/app/actions/profiles.ts`](file:///c:/Users/User/wipsmaster/WIPA/src/app/actions/profiles.ts) | `searchGlobal`, `updateProfileData`, `uploadAvatar`, `toggleConnection`, `claimProfile` | Profile search, directory indexing, credential updates, and networking graph. |

---

## 3. Platform Protected Routes (`/platform/*`)

Authenticated member application surfaces wrapped in [`PlatformLayout`](file:///c:/Users/User/wipsmaster/WIPA/src/app/platform/layout.tsx):

### 3.1 Main Platform Hub
- `/platform` — Community Feed, Trending Hashtags, Quick Post Composer, and Ad Slots.
- `/platform/create-post` — Full-page media rich post composer.
- `/platform/post/[id]` — Individual post permalink with full comment thread.
- `/platform/liked-threads` — User's bookmarked and liked community posts.
- `/platform/notifications` — Notification center (mentions, comments, event invites, system alerts).
- `/platform/messages` — Fullscreen End-to-End Encrypted 1-on-1 and Group Chat.
- `/platform/network` — Professional member directory & connection manager.
- `/platform/members` — Searchable member directory with filter by practice area & country.
- `/platform/memberships` — Membership tier upgrade, billing portal & perks.
- `/platform/leaderboard` — Gamified XP rankings, badges, and recognition.
- `/platform/mentorship` — Mentor/Mentee matching program.
- `/platform/board-members` — Executive board roster and leadership profiles.
- `/platform/gift` — Gift a WIPA Membership to a colleague or student.
- `/platform/calendar` — Global interactive masterclass & event calendar.
- `/platform/intelligence` — Proprietary IP intelligence, case law analytics, and trends.

### 3.2 Groups & Forums
- `/platform/groups` — Alliance interest groups & committees.
- `/platform/groups/[id]` — Individual group hub (feed, private discussions, members, files).
- `/platform/forums` — Deep-dive legal category discussion forums.
- `/platform/forums/[forumId]` — Specific forum thread directory.
- `/platform/forums/[forumId]/[postId]` — Forum thread discussion and Q&A page.

### 3.3 Events & Webinars
- `/platform/events` — Upcoming summits, workshops, and virtual webinars.
- `/platform/events/[id]` — Event detail page with Meetn video integration, RSVP, and attendee roster.
- `/platform/events/[id]/sponsor` — Event sponsorship tier checkout & booth registration.

### 3.4 Profile & Settings
- `/platform/profile` — Current user's live hybrid profile card & portfolio.
- `/platform/profile/[id]` — Member public profile page.
- `/platform/profile/settings` — Profile settings redirect.
- `/platform/settings` — Comprehensive settings dashboard (Profile, Account, Security, 10 Sessions Audit, Notifications, Appearance, Danger Zone).

### 3.5 AI & Copilot
- `/platform/ai` — Sally 4.1 Pro AI legal workspace.
- `/platform/ai/chat` — Interactive conversation interface with Sally 4.1 Pro.

### 3.6 Career & Jobs
- `/platform/jobs` — IP Job board (in-house counsel, patent agents, associates).
- `/platform/quizzes` — Continuing Legal Education (CLE) & IP trivia quizzes.
- `/platform/quizzes/[id]` — Interactive quiz runner with instant grading and XP rewards.

### 3.7 Business & Firm Showcases
- `/platform/business` — Corporate directory of IP firms and service vendors.
- `/platform/business/create` — Register and claim a business / law firm listing.
- `/platform/business/[slug]` — Law firm showcase profile page.
- `/platform/business/[slug]/edit` — Manage business listing, team roster, and practice areas.

---

## 4. Resource Library Routes (`/platform/resources/*`)

Comprehensive 11-vertical legal library and practice-ready toolkits:

| Path | Category / Resource Vertical |
| :--- | :--- |
| `/platform/resources` | Main Resource Library Hub (Search, Filters, Categories) |
| `/platform/resources/articles-insights` | Articles & Insight Editorial Directory |
| `/platform/resources/articles-insights/[id]` | Article Reader & Document Downloader |
| `/platform/resources/career-leadership` | Career Development & Leadership Guides |
| `/platform/resources/career-leadership/[id]` | Leadership Guide Detail Page |
| `/platform/resources/education` | Continuing Legal Education (CLE) & Academic Courses |
| `/platform/resources/education/[id]` | Course Detail & Video Player |
| `/platform/resources/education/university/[id]` | University IP Curriculum Modules |
| `/platform/resources/guides-toolkits` | Practice Toolkits, Playbooks & Checklists |
| `/platform/resources/guides-toolkits/[id]` | Toolkit Detail & ZIP Archive Download |
| `/platform/resources/in-house-counsel` | In-House IP Counsel Strategy & Templates |
| `/platform/resources/in-house-counsel/[id]` | In-House Toolkit / Guideline Detail |
| `/platform/resources/ip-firms` | Global IP Law Firms Directory |
| `/platform/resources/ip-firms/claim` | Claim Law Firm Profile Verification |
| `/platform/resources/ip-firms/[slug]` | Verified Law Firm Profile & Specializations |
| `/platform/resources/ip-news` | Real-time IP Law News Feed |
| `/platform/resources/ip-news/[id]` | News Article Reader |
| `/platform/resources/ip-services` | IP Tech, Software & Translation Vendors |
| `/platform/resources/ip-services/list` | Submit / List an IP Service |
| `/platform/resources/ip-services/[id]` | Service Vendor Profile & Feature Breakdown |
| `/platform/resources/podcasts-conversations` | Audio Podcasts & Executive Interviews |
| `/platform/resources/podcasts-conversations/upload` | Upload & Publish a Podcast Episode |
| `/platform/resources/podcasts-conversations/[id]` | Audio Player & Transcript Viewer |
| `/platform/resources/research-reports` | Benchmark Reports & Industry Whitepapers |
| `/platform/resources/research-reports/[id]` | Report Viewer & PDF Download |
| `/platform/resources/webinars` | On-Demand Webinar Recordings |
| `/platform/resources/webinars/[id]` | Webinar Video Streaming Player & Q&A Archive |
| `/platform/resources/wellness` | Wellbeing & Mental Health Support for Attorneys |
| `/platform/resources/wellness/budding-minds` | Budding Minds Mentorship Program |
| `/platform/resources/wellness/[id]` | Wellness Workshop Reader |
| `/platform/resources/wellness-v2` | Wellness Hub V2 Redesign |
| `/platform/resources/wellness-v2/[id]` | Wellness V2 Workshop Reader |
| `/platform/resources/womens-ip-world` | Women's IP World Resource Hub |
| `/platform/resources/womens-ip-world/[id]` | Women's IP World Edition Archive |

---

## 5. Public Marketing, Auth & Publication Pages

Landing pages, authentication, and marketing publications accessible publicly:

### 5.1 Public Publication Landing Pages
- `/(publication-pages)/publications` — Member Opportunities Publications Showcase.
- `/(publication-pages)/womens-ip-world` — Women's IP World Annual Edition Details & Rates.
- `/(publication-pages)/global-ip-magazine` — The Global IP Magazine Issue Details & Rates.
- `/(publication-pages)/ip-tech-innovation-annual` — IP Tech & Innovation Annual Details & Rates.

### 5.2 Marketing & Informational
- `/` — WIPA Official Home Landing Page.
- `/about` — About the Women's IP Alliance mission, vision & leadership.
- `/pricing` — Membership plans & corporate partnership tiers.
- `/contact` — Contact us and inquiry form.
- `/resources` — Public preview of the Resource Library.
- `/business/[slug]` — Public preview of verified IP business listings.
- `/u/[member_id]` — Public profile card (e.g. `wipsmaster.com/u/WIPA-12345`).
- `/splash-preview` — Preview splash banner animation testbed.

### 5.3 Authentication & Onboarding
- `/login` — User sign-in (Email, Password, OAuth Magic Link).
- `/signup` — New member registration.
- `/onboarding` — Multi-step onboarding questionnaire (Practice area, firm, bio).

### 5.4 Legal, Compliance & Safety
- `/privacy` — Privacy Policy.
- `/privacy-policy` — Alternate Privacy Policy redirect.
- `/child-safety` — Child Safety & Protection Guidelines.
- `/csae-standards` — CSAE Compliance and Safety Standards.

---

## 6. Admin Control Pages (`/admin/*`)

Internal moderation and management panels:
- `/admin` — Admin Dashboard Overview.
- `/admin/users` — Member user management, role assignments & tier overrides.
- `/admin/events` — Event creation, RSVP management, and Meetn room provisioning.
- `/admin/content` — Content moderation for feed posts, resources, and articles.
- `/admin/business` — Corporate profile approvals & claims.
- `/admin/firms` — Law firm directory management.
- `/admin/firms/claims` — Review law firm verification and claim requests.
- `/admin/firms/[id]` — Edit law firm profile data.
- `/admin/ip-services` — IP service vendor catalog management.
- `/admin/ip-services/[id]` — Edit IP service catalog entry.
- `/admin/jobs` — Job board moderation and posting approval.
- `/admin/sponsorships` — Corporate sponsorship lead tracker and status.

---

## 📝 Summary Breakdown

```
WIPA Platform
├── 23 REST API Routes (26 HTTP methods)
├── 4 Server Action Modules (25+ async server functions)
├── 101 Page Routes
│   ├── 45 Core Platform Pages
│   ├── 34 Resource Library Pages
│   ├── 12 Admin Control Pages
│   ├── 10 Public Marketing & Auth Pages
└── Total = 128 Dedicated Endpoint Surfaces
```
