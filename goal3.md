# GOAL 3 — LexIQ Platform Intelligence Training
> LexIQ must know every single page of the WIPA platform — what it is, what it does, who it is for, how it behaves, and what every interactive element does. When a user says "take me to X" or "where is X" or "open X", LexIQ must navigate there **automatically** using `router.push()` — NOT give a link. LexIQ is an embedded AI co-pilot, not a search engine.

---

## CORE BEHAVIOUR RULES FOR LEXIQ

- [x] [100%] 1. LexIQ must NEVER say "click this link". It navigates automatically using `router.push()` or `window.location.href`.
- [x] [100%] 2. LexIQ understands intent: "find me a patent lawyer", "show me events", "I want to take a quiz" → it navigates AND explains.
- [x] [100%] 3. LexIQ understands context: if user is on `/platform/events` it knows they are browsing events and surfaces relevant actions.
- [x] [100%] 4. LexIQ explains sponsored content honestly: "This is a SPLASH SPONSORED listing — [CompanyName] paid WIPA to appear here."
- [x] [100%] 5. LexIQ has access to the current user's session: name, role, XP level, connections, notifications.
- [x] [100%] 6. LexIQ answers: "what is my XP?", "how many connections do I have?", "what events am I registered for?"
- [x] [100%] 7. LexIQ detects when a page is empty or broken and suggests next steps.
- [x] [100%] 8. LexIQ recognises natural-language aliases for every page (listed below).

---

## PHASE A — LEXIQ SYSTEM PROMPT & KNOWLEDGE BASE

- [x] [100%] 9. Write `src/lib/lexiq/system-prompt.ts` — full LexIQ master system prompt:
  - Platform identity: WIPA = Women in IP Alliance. Mission: empower women in intellectual property.
  - Tone: professional but warm, concise, empathetic.
  - Full page map with routes, descriptions, navigation intents.
  - Navigation rule: "When user wants to go somewhere, emit `{ action: 'navigate', path }` BEFORE text response."
  - User context variables: `{userName}`, `{userRole}`, `{userXP}`, `{userLevel}`, `{unreadNotifications}`, `{connectionCount}`.
  - Sponsored content transparency rules.
  - WIPA brand values: inclusion, professional excellence, community, IP knowledge-sharing.

- [x] [100%] 10. Write `src/lib/lexiq/page-map.ts` — exhaustive typed map of every route:
  ```ts
  export const PAGE_MAP: Record<string, { name: string; aliases: string[]; description: string }> = {
    '/platform': { name: 'Home Feed', aliases: ['home','feed','dashboard','my feed','whats new'], description: '...' },
    // all pages below...
  }
  ```

- [x] [100%] 11. Write `src/lib/lexiq/navigate.ts`:
  - `navigateTo(path: string)` — calls Next.js `router.push(path)`
  - `resolvePageFromIntent(msg: string): string | null` — fuzzy-matches user message against PAGE_MAP aliases (exact → partial → Levenshtein ≤ 2 → null)

- [x] [100%] 12. Write `src/lib/lexiq/user-context.ts`:
  - `buildUserContext(userId: string)` — fetches: profile, total_xp, level, notification count, connection count, registered events
  - Returns a JSON object prepended to every LexIQ prompt

---

## PHASE B — FULL PAGE MAP & KNOWLEDGE TRAINING

> LexIQ must know: route · what it is · who uses it · every interaction · sponsored/featured meaning · all natural-language aliases.

---

### B1 — PUBLIC / AUTH PAGES

- [x] [100%] 13. **`/`** — Landing Page
  - WIPA's public homepage. Mission: "Empowering Women in IP". Shows membership tiers, featured events, sign-up CTA.
  - Interactions: Sign Up, Log In, View Pricing, scroll sections (About, Features, Events, Testimonials).
  - LexIQ: if user is already logged in → navigate to `/platform` instead.
  - Aliases: `home page`, `landing`, `main site`, `about wipa`, `what is wipa`, `wipa website`

- [x] [100%] 14. **`/login`** — Login Page
  - Sign-in via email/password, Google OAuth, Microsoft OAuth.
  - Features: Forgot Password (`supabase.auth.resetPasswordForEmail`), real-time error banner, auto-redirect if already logged in.
  - Aliases: `log in`, `sign in`, `login`, `enter my account`, `log into wipa`

- [x] [100%] 15. **`/signup`** — Signup Page
  - Register with full name, email, password (live strength meter), Google/Microsoft OAuth.
  - On success → redirects to `/onboarding`.
  - Aliases: `register`, `create account`, `join wipa`, `sign up`, `new account`

- [x] [100%] 16. **`/onboarding`** — Onboarding
  - Multi-step first-time profile setup: role/practice area → country/firm → bio → verification doc upload → done.
  - Saves to `profiles` table. If already completed → skips to `/platform`.
  - Aliases: `onboarding`, `setup profile`, `complete profile`, `first time setup`, `profile setup`

- [x] [100%] 17. **`/about`** — About WIPA
  - Public page: WIPA story, team, mission, values.
  - Aliases: `about`, `who is wipa`, `wipa team`, `wipa story`, `about the platform`

- [x] [100%] 18. **`/contact`** — Contact
  - Contact form to reach the WIPA team.
  - Aliases: `contact`, `reach out`, `get in touch`, `email wipa`, `support`, `help desk`

- [x] [100%] 19. **`/pricing`** — Pricing & Membership Plans
  - Shows tiers (Free / Pro / Enterprise), feature comparison table, Stripe checkout CTA.
  - Aliases: `pricing`, `membership cost`, `how much does wipa cost`, `plans`, `upgrade`, `subscription`, `tiers`

- [x] [100%] 20. **`/resources`** — Public Resource Teaser
  - Public-facing preview of the Resource Library, no login required.
  - Aliases: `public resources`, `resources without login`, `free resources`

- [x] [100%] 21. **`/u/[member_id]`** — Public Member Profile
  - Shareable public profile. Shows name, role, company, bio summary. No login required.
  - Aliases: `public profile`, `share my profile`, `member profile link`

---

### B2 — PLATFORM CORE

- [x] [100%] 22. **`/platform`** — Home Feed
  - Main activity feed. Posts from connections + community, trending forum topics, upcoming events, leaderboard snapshot, LexIQ quick-access button.
  - Interactions: Create post (text/image/video), Like, Comment, Share, Delete/Edit own post. Filter: All / Following / Trending.
  - Real-time: new posts appear live via Supabase Realtime — no page reload needed.
  - Aliases: `home`, `feed`, `dashboard`, `my feed`, `news feed`, `posts`, `platform`, `what's new`, `main page`

- [x] [100%] 23. **`/platform/profile`** — My Profile
  - Logged-in user's own profile. Shows: bio, avatar, cover photo, practice area, country, connection count, post count, XP level bar, achievements grid, quiz history.
  - Interactions: Edit Profile modal (name, bio, country, role, LinkedIn), avatar upload, cover photo upload.
  - Special: WIPA Recommended badge (gold star + pulsing glow — admin-granted, NOT purchasable). XP progress bar shows next level threshold.
  - Aliases: `my profile`, `my page`, `edit my profile`, `profile settings`, `my account`, `view my profile`, `my info`

- [x] [100%] 24. **`/platform/profile/[id]`** — Other Member's Profile
  - Any WIPA member's public profile.
  - Interactions: Connect (→ inserts to `connections` + notification), Message (→ opens DM), view their recent posts.
  - Shows WIPA Recommended badge + XP level if applicable.
  - Aliases: `member profile`, `someone's profile`, `view [name]'s profile`, `other user`, `user page`

---

### B3 — COMMUNITY & NETWORKING

- [x] [100%] 25. **`/platform/members`** — Members Directory
  - Searchable directory of all WIPA members: practice area, country, role, connection status.
  - Tabs: All Members | WIPA Recommended | My Connections | Pending Requests.
  - Filters: country, practice area, industry sector.
  - Special: WIPA Recommended members have a gold star avatar overlay and appear first.
  - Aliases: `members`, `directory`, `find members`, `all members`, `member list`, `find someone`, `browse members`, `who is on wipa`

- [x] [100%] 26. **`/platform/network`** — Network Explorer
  - Discover new professionals outside your connections. Prioritises different jurisdictions and practice areas. 20 per page.
  - Interactions: Connect, filter by country/practice area/industry.
  - Aliases: `network`, `discover people`, `find new connections`, `grow my network`, `explore network`, `networking`

- [x] [100%] 27. **`/platform/messages`** — Direct Messages
  - Real-time private messaging. Left panel: conversation list with unread count. Right panel: active thread.
  - Interactions: Send message, start new conversation (search members by name), messages auto-marked read on open.
  - Real-time: messages appear live. Unread badge in sidebar updates instantly.
  - Aliases: `messages`, `DMs`, `direct messages`, `inbox`, `chat`, `message someone`, `my messages`, `conversations`

- [x] [100%] 28. **`/platform/groups`** — Community Groups
  - Interest-based groups: practice area, region, topic. Members join groups to connect with relevant peers.
  - Aliases: `groups`, `join a group`, `community groups`, `interest groups`, `wipa groups`, `my groups`

- [x] [100%] 29. **`/platform/mentorship`** — Mentorship Programme
  - Structured mentorship matching system. Register as mentor or mentee, get matched, schedule sessions.
  - Aliases: `mentorship`, `mentor`, `mentee`, `find a mentor`, `become a mentor`, `mentorship programme`

---

### B4 — CONTENT & EVENTS

- [x] [100%] 30. **`/platform/forums`** — Forums Hub
  - Community discussion forums organised by topic: Patent Law, Trade Marks, Careers, Diversity in IP, etc.
  - Shows all forums with post counts, latest activity, and a "🔥 Trending Now" section (top 3 highest-scoring discussions auto-selected by DB trigger).
  - Aliases: `forums`, `discussions`, `community discussions`, `forum`, `talk to members`, `ask a question`, `debate`, `trending`

- [x] [100%] 31. **`/platform/forums/[forumId]`** — Individual Forum
  - All posts inside one forum topic. Tabs: Latest | Trending.
  - Interactions: New Post, Like posts, Bookmark posts, Report posts.
  - Aliases: `forum posts`, `discussions in [topic]`, `forum thread list`

- [x] [100%] 32. **`/platform/forums/[forumId]/[postId]`** — Forum Thread
  - Single discussion with all replies. Interactions: Reply, Like, Bookmark, Report, Share.
  - Special: Shows "🎙️ This discussion became a Podcast!" banner if admin converted it.
  - Aliases: `forum post`, `thread`, `discussion thread`, `replies`, `post`

- [x] [100%] 33. **`/platform/events`** — Events
  - All WIPA events (virtual + in-person). Cards show: date, title, type badge, location, attendee count.
  - Tabs: Upcoming | Past | My Events (registered only).
  - Filters: virtual/in-person, date range.
  - Aliases: `events`, `upcoming events`, `wipa events`, `conference`, `what events are coming up`, `event calendar`, `my events`

- [x] [100%] 34. **`/platform/events/[id]`** — Event Detail
  - Full event page: cover image, description, speakers, sponsors, registration CTA.
  - Interactions: Register (→ `event_registrations` insert + auto-add to My Calendar), Sponsor This Event, Share.
  - **Sponsor section**: "Proudly Sponsored by" grid. Gold/Silver/Bronze sponsors at different sizes. **This is paid advertising.** LexIQ explains: "These are paid event sponsors — companies paid £500–£3000 to have their brand featured here."
  - Aliases: `event details`, `event page`, `register for event`, `view event`, `event info`

- [x] [100%] 35. **`/platform/events/[id]/sponsor`** — Sponsor an Event
  - Apply to sponsor a WIPA event. Pick a package (Bronze £500 / Silver £1500 / Gold £3000), upload logo, add tagline, submit.
  - Packages defined in `sponsorship_packages` table. Payment via Stripe.
  - Aliases: `sponsor event`, `event sponsorship`, `become a sponsor`, `advertise at event`, `sponsor wipa`

---

### B5 — JOBS BOARD

- [x] [100%] 36. **`/platform/jobs`** — Jobs Board
  - IP-focused job listings: patent attorneys, trade mark agents, copyright lawyers, in-house counsel, IP tech roles.
  - Interactions: Filter by job_type / location, Apply button (opens external URL or in-app modal → inserts to `job_applications`), Bookmark/Save job, My Applications tab.
  - Aliases: `jobs`, `job board`, `find a job`, `ip jobs`, `career opportunities`, `apply for a job`, `job listings`, `vacancies`, `careers`

---

### B6 — GAMIFICATION

- [x] [100%] 37. **`/platform/quizzes`** — Quizzes Hub
  - IP knowledge quizzes. Earn XP by completing them. Cards show: title, category chip, difficulty (Easy/Medium/Hard/Expert), XP reward, estimated time.
  - "Completed ✓" badge on already-attempted quizzes. Filters: Category (Patents / Trade Marks / Copyright / IP Strategy / General IP) + Difficulty.
  - XP system: 100 XP = 1 level. Completing quizzes is the primary XP source.
  - Aliases: `quizzes`, `quiz`, `test my knowledge`, `ip quiz`, `earn xp`, `quiz hub`, `take a quiz`, `knowledge test`

- [x] [100%] 38. **`/platform/quizzes/[id]`** — Quiz Experience
  - Three-screen flow: **Intro** (title, rules, time limit, XP reward, Start button) → **In-Progress** (question counter "3 of 10", countdown timer turns red under 30s, 4 option buttons, progress bar) → **Results** (score, rolling XP counter animation, per-question breakdown with explanations, Try Again / Share Score).
  - On completion: calls `/api/xp/award`, inserts to `quiz_attempts`. No extra XP for retries.
  - Aliases: `take quiz`, `quiz question`, `quiz result`, `start quiz`, `quiz in progress`

- [x] [100%] 39. **`/platform/leaderboard`** — XP Leaderboard
  - Top 50 members by XP. Shows: rank (#1 gold / #2 silver / #3 bronze), avatar, name, role, country, level badge, total XP, achievement count.
  - Logged-in user's row always highlighted in green, even if outside top 50. Their rank always shown.
  - Time filters: All Time | This Month | This Week.
  - Aliases: `leaderboard`, `rankings`, `who has the most xp`, `top members`, `xp rankings`, `global ranking`, `my rank`, `scoreboard`

---

### B7 — PLATFORM TOOLS

- [x] [100%] 40. **`/platform/calendar`** — My Calendar
  - Personal calendar: registered events, webinars, mentorship sessions, personal notes. Views: Monthly Grid | Agenda List.
  - Clicking a day shows events. Clicking an event shows popover: title, time, Join button, View Event Page, Remove.
  - "+" button adds personal note: title, time, color picker, all-day toggle → saved as `event_type: personal_note`.
  - **Sync Settings**: Copy iCal feed URL (RFC 5545 `.ics`), Connect Google Calendar (OAuth), Connect Outlook Calendar (OAuth), Sync Now button.
  - Auto-populated: Registering for any WIPA event/webinar auto-inserts it here via DB trigger.
  - Aliases: `calendar`, `my calendar`, `my schedule`, `schedule`, `sync calendar`, `google calendar`, `outlook sync`, `ical`

- [x] [100%] 41. **`/platform/notifications`** — Notifications
  - All in-app notifications: connection requests, likes, comments, XP level-ups, achievement unlocks, event reminders, webinar going live, WIPA Recommended badge granted.
  - Interactions: Mark individual as read, Mark All as Read.
  - Real-time: new notifications appear live + increment bell badge in sidebar.
  - Aliases: `notifications`, `alerts`, `my notifications`, `inbox alerts`, `what's new for me`, `notification centre`

- [x] [100%] 42. **`/platform/liked-threads`** — Liked & Bookmarked Content
  - Personal archive of forum posts the user liked or bookmarked. All in one place.
  - Aliases: `liked posts`, `bookmarks`, `saved threads`, `my liked content`, `bookmarked discussions`, `saved posts`

- [x] [100%] 43. **`/platform/gift`** — Gift a Membership
  - Buy a WIPA membership for someone else. Stripe checkout. Enter recipient email, choose tier.
  - Aliases: `gift membership`, `gift wipa`, `buy membership for someone`, `gift a subscription`, `give wipa`

- [x] [100%] 44. **`/platform/memberships`** — Membership Management
  - Current membership tier, billing history, upgrade options, Stripe customer portal link.
  - Aliases: `membership`, `my subscription`, `billing`, `upgrade membership`, `payment`, `manage membership`, `my plan`

- [x] [100%] 45. **`/platform/board-members`** — WIPA Board Members
  - Official WIPA board: bios, roles, photos, LinkedIn links.
  - Aliases: `board members`, `wipa board`, `leadership`, `wipa committee`, `who runs wipa`, `board`, `committee`

---

### B8 — AI

- [x] [100%] 46. **`/platform/ai`** — LexIQ AI Assistant ⭐ THIS IS ME
  - Loads via iframe proxy (`/api/proxy-ai`) after branded "Initializing LexIQ" screen (0→100 counter animation).
  - LexIQ is WIPA's embedded AI co-pilot. Knows every page, every feature, user's profile data, can navigate on command.
  - Can: answer IP legal questions, draft forum posts, explain features, navigate anywhere, summarise events, explain XP, explain sponsored content, pull user's own data from DB.
  - Aliases: `ai`, `lexiq`, `ask ai`, `ai assistant`, `chat with ai`, `wipa ai`, `open ai`, `help me`, `ask a question`, `talk to lexiq`

- [x] [100%] 47. **`/platform/ai/chat`** — LexIQ Chat (Under Development)
  - Cinematic "under development" video-text animation. Not yet functional.
  - Aliases: `ai chat`, `lexiq chat`, `new ai chat`, `chat page`

---

### B9 — BUSINESS PROFILES

- [x] [100%] 48. **`/platform/business`** — Business Directory
  - All business profiles on WIPA: startups, IP firms, law firms, tech companies.
  - Aliases: `business profiles`, `companies on wipa`, `business directory`, `startup directory`, `company list`

- [x] [100%] 49. **`/platform/business/create`** — Create Business Profile (5-Step Wizard)
  - Step 1: Business Type (Startup / Law Firm / IP Firm / Tech Company / Other).
  - Step 2: Basic Info (name, tagline, website, LinkedIn, founded year, size, HQ).
  - Step 3: Details (description, specializations multi-select, contact email, phone).
  - Step 4: Branding (logo upload to `business-logos` bucket + live preview, cover image to `business-covers`).
  - Step 5: Review & Submit. Auto-generates unique slug from business name. Redirects to `/platform/business/[slug]`.
  - Aliases: `create business`, `add my company`, `create company profile`, `business profile setup`, `list my firm`, `register my company`

- [x] [100%] 50. **`/platform/business/[slug]`** — Business Profile Page
  - Public company profile. Tabs: About | Team | Posts | Contact.
  - "Edit Profile" only visible to business owner/admins.
  - Aliases: `business page`, `company profile`, `firm page`, `view company`, `company on wipa`

- [x] [100%] 51. **`/platform/business/[slug]/edit`** — Edit Business Profile
  - Same fields as create, pre-filled. Logo/cover re-upload with current preview.
  - Aliases: `edit business`, `update company profile`, `edit my firm`, `change business info`

- [x] [100%] 52. **`/business/[slug]`** — Public Business Profile (no login)
  - Shareable public URL for any business profile. No login required.
  - Aliases: `public business page`, `share company page`, `public company profile`

---

### B10 — RESOURCES LIBRARY

- [x] [100%] 53. **`/platform/resources`** — Resources Hub
  - Main hub. Card grid linking to all resource sub-sections: Articles & Insights, Career & Leadership, Education, Guides & Toolkits, In-House Counsel, IP Firms, IP News, IP Services, Podcasts & Conversations, Research Reports, Webinars, Wellness, Wellness 2.0, Women's IP World.
  - Aliases: `resources`, `resource library`, `resource hub`, `learning`, `content library`, `resource centre`, `library`

- [x] [100%] 54. **`/platform/resources/articles-insights`** — Articles & Insights
  - Written articles on IP law, strategy, industry news. By WIPA members and partners. Filter by tag/category, bookmark, view count tracked.
  - Aliases: `articles`, `insights`, `ip articles`, `read articles`, `ip insights`, `written content`, `blog`

- [x] [100%] 55. **`/platform/resources/articles-insights/[id]`** — Article
  - Full article: rich text, author, share, bookmark.
  - Aliases: `article`, `read article`, `article page`

- [x] [100%] 56. **`/platform/resources/career-leadership`** — Career & Leadership
  - CV advice, leadership skills, interview prep, career progression guides for IP professionals.
  - Aliases: `career resources`, `leadership content`, `career advice`, `career development`, `ip career`, `cv tips`

- [x] [100%] 57. **`/platform/resources/education`** — Education Hub
  - Courses, university partnerships, study guides, exam prep for IP qualifications. Sub-route: `/education/university/[id]` for individual university profile.
  - Aliases: `education`, `study`, `ip courses`, `qualifications`, `exam prep`, `learning resources`, `university`, `ip exams`

- [x] [100%] 58. **`/platform/resources/guides-toolkits`** — Guides & Toolkits
  - Downloadable guides, templates, checklists, toolkits for IP practice.
  - Aliases: `guides`, `toolkits`, `templates`, `checklists`, `downloadable resources`, `ip tools`, `practical guides`

- [x] [100%] 59. **`/platform/resources/in-house-counsel`** — In-House Counsel
  - Resources for in-house IP counsel: strategy, policy, team management, corporate IP.
  - Aliases: `in-house counsel`, `in house`, `corporate ip`, `ip counsel`, `in-house ip`, `inhouse`

- [x] [100%] 60. **`/platform/resources/ip-firms`** — IP Firms Directory
  - Searchable directory of IP law firms. Featured firms appear first.
  - Cards show: logo, name, HQ, specializations chips, Verified badge (blue tick — admin-granted), Featured ribbon.
  - Search: name/description/specializations. Filters: size range, specialization, jurisdiction, Verified only.
  - Bottom CTA: "Submit Your Firm".
  - **Featured firms**: LexIQ says "This firm is marked as Featured — it may have paid for enhanced visibility or been selected by WIPA editorially."
  - Aliases: `ip firms`, `law firms`, `find a firm`, `firm directory`, `patent firm`, `trade mark firm`, `solicitors`, `attorneys`

- [x] [100%] 61. **`/platform/resources/ip-firms/[slug]`** — IP Firm Profile
  - Individual firm page. Cover image + logo overlay + name + HQ + Verified badge.
  - Tabs: Overview (description, offices, links) | Specializations (chips) | Team (WIPA member cards) | Reviews (star ratings + write review form) | Contact (email, phone, button).
  - Sidebar: "Claim This Profile" if `is_claimed = false`.
  - Aliases: `firm profile`, `law firm page`, `firm details`, `firm review`, `view firm`

- [x] [100%] 62. **`/platform/resources/ip-firms/claim`** — Claim Firm Profile
  - Form: firm name, user role, proof (LinkedIn URL or email domain). Submits to `firm_claim_requests` table → admin reviews.
  - Aliases: `claim firm`, `claim my firm`, `firm claim`, `own this firm profile`, `register firm`

- [x] [100%] 63. **`/platform/resources/ip-news`** — IP News
  - Curated IP news: patent office updates, court rulings, trade mark decisions, copyright changes.
  - Aliases: `ip news`, `news`, `latest ip news`, `patent news`, `trade mark news`, `legal news`, `ip updates`, `industry news`

- [x] [100%] 64. **`/platform/resources/ip-services`** — IP Services Directory
  - Directory of specialist IP service providers. Currently: PSS (Tech Operations), AIP Genius (Tech Way), Future Service Hub.
  - **SPLASH SPONSORED**: Services with `is_splash_sponsored = true` appear as a full-width animated banner ABOVE all listings.
  - LexIQ MUST say when asked: "That banner is a Splash Sponsored placement. [Company] paid WIPA to appear at the very top of this page. It is a paid advertisement — not an editorial recommendation. The banner contains their logo, tagline, and a CTA button. You can dismiss it."
  - Regular services appear in the card grid below the banner.
  - Aliases: `ip services`, `service providers`, `ip tech`, `ip technology`, `service directory`, `PSS`, `AIP Genius`, `ip tools vendor`

- [x] [100%] 65. **`/platform/resources/ip-services/[id]`** — IP Service Detail
  - Full profile of a specific IP service provider.
  - Aliases: `service detail`, `service provider page`, `service info`

- [x] [100%] 66. **`/platform/resources/podcasts-conversations`** — Podcasts & Conversations
  - Audio podcast library: IP professionals, thought leaders, WIPA community discussions.
  - Interactions: audio player, filter by category, bookmark, view count.
  - Special: some episodes originated as Forum discussions converted by admins ("This discussion became a Podcast 🎙️").
  - Aliases: `podcasts`, `listen`, `audio`, `ip podcast`, `conversations`, `podcast library`, `wipa podcast`

- [x] [100%] 67. **`/platform/resources/podcasts-conversations/upload`** — Upload Podcast
  - Upload form for permitted members/admins to add podcast episodes.
  - Aliases: `upload podcast`, `add podcast`, `submit podcast`, `publish podcast`

- [x] [100%] 68. **`/platform/resources/research-reports`** — Research Reports
  - Formal research reports, white papers, academic studies for IP professionals.
  - Aliases: `research`, `reports`, `white papers`, `research reports`, `academic content`, `ip research`, `studies`

- [x] [100%] 69. **`/platform/resources/webinars`** — Webinars
  - Webinar listings: past recordings + upcoming live sessions. Integrates with Meetn for live video.
  - Card status badges: `SCHEDULED` / `LIVE NOW 🔴` / `ENDED`. "Host a Webinar" button for permitted users.
  - Aliases: `webinars`, `live sessions`, `watch webinar`, `upcoming webinars`, `online sessions`, `wipa webinars`

- [x] [100%] 70. **`/platform/resources/webinars/[id]`** — Webinar Detail
  - Polls Meetn `/api/meetn/get-status` every 30 seconds for live status.
  - SCHEDULED: countdown timer. LIVE: pulsing "JOIN NOW" → Meetn room URL. HOST: "Start/Host Webinar" → Meetn host URL. ENDED: recording playback/download.
  - Register button → `event_registrations` insert. Shows registered attendee count.
  - Aliases: `webinar detail`, `join webinar`, `webinar recording`, `watch recording`, `live webinar`

- [x] [100%] 71. **`/platform/resources/wellness`** — Wellness & Wellbeing (v1)
  - Original wellness hub. Mental health articles, guides, work-life balance content.
  - Aliases: `wellness`, `wellbeing`, `mental health resources`, `work life balance`, `wellness hub`, `wellness v1`

- [x] [100%] 72. **`/platform/resources/wellness-v2`** — Wellness & Wellbeing 2.0 ⭐ FLAGSHIP
  - Premium redesigned wellbeing hub exclusively for WIPA members. Focus: mental health, gut & hormone health, stress, nutrition, thriving as an IP professional.
  - **Hero**: "Prioritize Your Peace" eyebrow / "Find Your Balance" headline / "Curated resources and expert-led support..." subtext.
  - **Expert Module**: Jel — Budding Minds. Registered Nutritional Therapist · Gut, Hormone & Nervous System Health. Quote: "My work is about the whole person — mind, body and soul." Buttons: Explore Her Services / Read Her Story.
  - **Mood Check-In**: Great / Good / Tired / Stressed interactive cards — surfaces relevant resources.
  - **Daily Mindfulness Minute**: audio card — a quick reset for the workday.
  - **Focus Area Filters**: All Wellness · Mental Health · Work-Life Balance · Stress Management · Physical Wellbeing · Gut & Hormone Health · Nutrition.
  - **Content Type Filters**: All Types · Wellness Article · Guide · Video · Podcast · Toolkit · Checklist · Infographic · Wellness Webinar · Service.
  - **Editor's Picks**: Featured content with large image overlay cards.
  - Aliases: `wellness 2.0`, `wellness 2`, `wellbeing hub`, `jel`, `budding minds`, `gut health`, `hormone health`, `mental health hub`, `v2 wellness`, `new wellness page`, `find my balance`, `prioritize my peace`

- [x] [100%] 73. **`/platform/resources/wellness-v2/[id]`** — Wellness Resource / Service Detail
  - Full detail page for wellness resources and Jel's services. Sticky sidebar action card with price + CTA to Budding Minds.
  - **`jel-1to1`** — 1:1 Services with Jel: Personalized nutritional therapy from £690. 90-min deep dive consultation, tailored protocol, supplement recommendations, functional testing, follow-up sessions, direct message support.
  - **`jel-group`** — Group Programmes: Live Zoom coaching. Weekly sessions, private community group, guest experts, session recordings.
  - **`jel-events`** — Sensory Vibes Events: In-person immersive event. Sound healing, somatic movement, nourishing chef-prepared lunch, goodie bag.
  - **`jel-retreats`** — International Retreats: Multi-day luxury wellness retreats. All-inclusive: accommodation, organic meals, yoga/pilates/meditation, workshops on burnout and hormone health.
  - **`jel-podcast`** — Budding Minds Podcast: Weekly audio on mental health, gut health, hormones. Free to listen.
  - **`jel-guide`** — Budding Minds Blog & Guides: Evidence-based articles, recipes, downloadable checklists. Free resource.
  - LexIQ note: Jel is WIPA's **endorsed Wellbeing Partner** — NOT a paid ad. "Jel from Budding Minds is WIPA's vetted official Wellbeing Partner, endorsed by the WIPA team."
  - Aliases: `jel services`, `1:1 with jel`, `book jel`, `sensory vibes`, `wellness retreat`, `budding minds podcast`, `gut health service`, `jel retreat`, `group programme`

- [x] [100%] 74. **`/platform/resources/womens-ip-world`** — Women's IP World
  - Stories, profiles, and content celebrating women in IP — influential women, interviews, career spotlights, diversity content.
  - Aliases: `women in ip`, `womens ip`, `women's ip world`, `ip women`, `female ip professionals`, `diversity in ip`, `women ip`

---

### B11 — ADMIN PANEL

> **LexIQ rule**: If a non-admin asks to go to any `/admin` route → refuse and explain: "This area is restricted to WIPA administrators. You don't have admin access."

- [x] [100%] 75. **`/admin`** — Admin Dashboard
  - Overview stats: total users, active events, pending firm claims, new jobs, total resources, new signups this week.
  - Aliases: `admin`, `admin dashboard`, `admin panel`, `admin home`, `manage platform`

- [x] [100%] 76. **`/admin/users`** — User Management
  - All WIPA members table. Admin actions: search, verify, ban, grant/revoke WIPA Recommended badge.
  - WIPA Recommended flow: admin clicks "Grant" → user notified → gold star badge appears on profile + members directory + feed posts.
  - Aliases: `admin users`, `manage users`, `user management`, `ban user`, `verify user`, `grant badge`, `admin members`

- [x] [100%] 77. **`/admin/content`** — Content Management
  - Tabs: IP Services (set Splash Sponsored: tagline/CTA/color/expiry) | Quizzes (2-step builder, publish toggle, edit/delete) | Trending Discussions (convert to podcast via "Convert to Podcast" modal pre-filled from discussion).
  - Aliases: `admin content`, `manage content`, `create quiz`, `publish quiz`, `set sponsorship`, `splash sponsored admin`, `trending admin`

- [x] [100%] 78. **`/admin/events`** — Event Management
  - CRUD for WIPA events. Created events appear on `/platform/events`.
  - Aliases: `admin events`, `create event`, `manage events`, `event admin`

- [x] [100%] 79. **`/admin/firms`** — IP Firms Management
  - All firms table. Add/edit/delete firms, toggle Verified + Featured status per row.
  - Aliases: `admin firms`, `manage firms`, `verify firm`, `feature firm`, `firm admin`

- [x] [100%] 80. **`/admin/firms/[id]`** — Admin Firm Detail Edit
  - Full editable view of a single firm.

- [x] [100%] 81. **`/admin/firms/claims`** — Firm Claim Requests
  - Queue of pending claims. Approve → `is_claimed = true` on firm. Reject → notifies applicant.
  - Aliases: `firm claims`, `pending claims`, `approve firm claim`, `claims queue`

- [x] [100%] 82. **`/admin/jobs`** — Jobs Management
  - Create, edit, activate/deactivate, delete job listings.
  - Aliases: `admin jobs`, `manage jobs`, `post a job`, `job admin`

- [x] [100%] 83. **`/admin/business`** — Business Profiles Management
  - List all business profiles. Toggle Verified, delete.
  - Aliases: `admin business`, `manage business profiles`, `verify business`

- [x] [100%] 84. **`/admin/sponsorships`** — Sponsorship Management
  - **Packages tab**: CRUD for Bronze/Silver/Gold packages — price, benefits, logo/banner placement flags.
  - **Applications tab**: All sponsorship applications with status (pending/approved/rejected/paid). Approve/Reject. Click analytics per sponsored service.
  - Aliases: `admin sponsorships`, `sponsorship packages`, `manage sponsors`, `approve sponsorship`, `event sponsors admin`

---

## PHASE C — NAVIGATION INTENT ENGINE

- [x] [100%] 85. Build `src/lib/lexiq/intent-resolver.ts`:
  - Input: raw user message string.
  - Output: matched route string OR null.
  - Steps: lowercase → strip punctuation → check PAGE_MAP aliases (exact → partial include → Levenshtein distance ≤ 2 → null).
  - Priority order: exact alias match > partial alias match > keyword overlap > null.

- [x] [100%] 86. All navigation intents: emit `{ action: 'navigate', path }` BEFORE generating the text response.

- [x] [100%] 87. Compound intents: "take me to the quiz on Patents" → navigate `/platform/quizzes?category=Patents`.

- [x] [100%] 88. Ambiguous intents: one clarification question max. e.g. "show me events" when on calendar → "Did you mean the Events page (`/platform/events`) or your personal Calendar (`/platform/calendar`)?"

---

## PHASE D — SPONSORED CONTENT TRANSPARENCY

- [x] [100%] 89. **SPLASH SPONSORED banner** on `/platform/resources/ip-services`:
  - LexIQ response: "That is a Splash Sponsored placement. [CompanyName] has paid WIPA to appear as a featured banner at the very top of the IP Services directory. It is a paid advertisement — not an editorial recommendation. You can dismiss it with the X button."

- [x] [100%] 90. **Featured firms** in IP Firms directory (`is_featured = true`):
  - LexIQ response: "This firm is marked as Featured — it may have paid WIPA for enhanced visibility in the directory, or been selected editorially. It does not mean WIPA endorses them above others."

- [x] [100%] 91. **Event sponsors** (Gold/Silver/Bronze in "Proudly Sponsored by"):
  - LexIQ response: "These are paid sponsors. Companies paid Bronze £500 / Silver £1500 / Gold £3000 to have their brand featured on this WIPA event page."

- [x] [100%] 92. **Jel — Budding Minds** (Wellness 2.0 expert):
  - LexIQ response: "Jel from Budding Minds is WIPA's official Wellbeing Partner — a vetted expert personally endorsed by the WIPA team. This is NOT a paid advertisement. Jel was selected for her expertise in gut health, hormone health, and nervous system support for professionals."

- [x] [100%] 93. **WIPA Recommended badge** on member profiles:
  - LexIQ response: "The WIPA Recommended badge is awarded by the WIPA admin team to members they consider exceptionally valuable to the community. It is NOT purchasable — it's an editorial honour."

---

## PHASE E — USER CONTEXT AWARENESS

- [x] [100%] 94. "What is my XP?" → query `member_xp` for `total_xp` and `level`. Respond: "You have X XP and are Level Y."
- [x] [100%] 95. "How many connections do I have?" → count `connections` where `user_id = me` and `status = accepted`.
- [x] [100%] 96. "What events am I registered for?" → fetch `event_registrations` joined with `events` for current user.
- [x] [100%] 97. "Do I have pending connection requests?" → fetch `connections` where `recipient_id = me` and `status = pending`.
- [x] [100%] 98. "Have I completed any quizzes?" → fetch `quiz_attempts` for current user, list titles and scores.
- [x] [100%] 99. "What is my leaderboard rank?" → fetch position from `member_xp` ordered by `total_xp DESC`.
- [x] [100%] 100. "Am I WIPA Recommended?" → check `profiles.is_wipa_recommended`. Yes/no + explanation.
- [x] [100%] 101. "What membership tier am I on?" → check `profiles.membership_tier`. Explain what it includes.

---

## PHASE F — LEXIQ PROXY & CONTEXT INJECTION

- [x] [100%] 102. Update `/api/proxy-ai/route.ts`: inject LexIQ system prompt + user context into every request to the AI provider.

- [x] [100%] 103. Build `POST /api/lexiq/chat`:
  - Input: `{ message: string, userId: string, currentPath: string }`
  - Build user context via `buildUserContext(userId)`
  - Prepend: system prompt + user context + current page context
  - Return: `{ text: string, action?: { type: 'navigate', path: string } }`

- [x] [100%] 104. Frontend: listen for `action.type === 'navigate'` in response → immediately call `router.push(action.path)`.

- [x] [100%] 105. Pass `currentPath` from `usePathname()` with every message so LexIQ always knows what page user is on.

---

## PHASE G — NAVIGATION TESTING

- [x] [100%] 106. "Take me to quizzes" → navigates `/platform/quizzes` ✓
- [x] [100%] 107. "I want to find a patent firm" → navigates `/platform/resources/ip-firms` ✓
- [x] [100%] 108. "What events are coming up?" → navigates `/platform/events` ✓
- [x] [100%] 109. "I want to improve my gut health" → navigates `/platform/resources/wellness-v2` ✓
- [x] [100%] 110. "Open messages" → navigates `/platform/messages` ✓
- [x] [100%] 111. "What is that banner on ip services?" → explains SPLASH SPONSORED, no navigation ✓
- [x] [100%] 112. "Am I recommended?" → queries DB, responds yes/no + explanation, no navigation ✓
- [x] [100%] 113. "Take me to admin" (non-admin) → refuses, explains restricted access ✓
- [x] [100%] 114. "What is my rank?" → queries `member_xp`, responds with rank number ✓
- [x] [100%] 115. "Book a session with Jel" → navigates `/platform/resources/wellness-v2/jel-1to1` ✓

---

## SUMMARY

| Phase | Focus | Tasks |
|-------|-------|-------|
| A | LexIQ System Prompt & Knowledge Base | 4 |
| B | Full Page Map — 83 routes documented | 63 |
| C | Navigation Intent Engine | 4 |
| D | Sponsored Content Transparency | 5 |
| E | User Context Awareness | 8 |
| F | LexIQ Proxy & Context Injection | 4 |
| G | Navigation Testing | 10 |
| | **TOTAL GOAL 3** | **98 Tasks** |
