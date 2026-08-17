# WIPA PLATFORM — MOBILE REDESIGN & OPTIMIZATION MASTER BLUEPRINT (`goalmobile.md`)

> **Goal**: Completely modernize, optimize, and elevate the mobile experience of the WIPA platform across all routes to match the fluid, tactile, and intuitive mobile app standards of Facebook, LinkedIn, and Instagram. Every interactive element must deliver instant visual/tactile responsiveness (`active:scale-95`), thumb-friendly reach zones, smooth bottom-sheets, and zero horizontal scroll anomalies.

---

## SECTION 1: GLOBAL MOBILE APP SHELL & NAVIGATION ARCHITECTURE

### 1.1 — Top Mobile App Bar (`WIPA/src/components/MobileTopBar.tsx`)
- [ ] 1. **Sticky Top Bar**: Height `56px`, glassmorphic backdrop-blur (`bg-white/90 dark:bg-[#0b0f19]/90 border-b border-gray-200 dark:border-gray-800`).
- [ ] 2. **Left Brand Zone**: High-resolution WIPA logo with subtle pulse on tap routing to `/platform`.
- [ ] 3. **Right Action Hub**:
  - Global search icon button with full-screen search modal.
  - Notifications bell with live unread badge counter (`/platform/notifications`).
  - Messages chat bubble with live unread counter (`/platform/messages`).
  - Slide-over "More / Menu" drawer trigger (Hamburger menu / profile avatar).
- [ ] 4. **Haptic Tactile Feedback**: All header buttons styled with `active:scale-90 transition-transform duration-100`.

### 1.2 — Facebook-Style 5-Tab Sticky Bottom Navigation Bar (`WIPA/src/components/MobileBottomNav.tsx`)
- [ ] 5. **Fixed Bottom Position**: `fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/95 dark:bg-[#151c2c]/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-safe`.
- [ ] 6. **5 Core Mobile Touchpoints**:
  1. **Feed / Home (`/platform`)**: Icon + active dot indicator.
  2. **Network (`/platform/network`)**: Connections grid & requests badge.
  3. **Create Action (`+`)**: Centered elevated pill button opening universal creation bottom sheet (Post, Event, Topic, Resource).
  4. **Resources (`/platform/resources`)**: Quick access to all 11 verticals.
  5. **Menu / Profile (`/platform/profile`)**: User avatar tab with status ring.
- [ ] 7. **Active Route Glow**: High-contrast icon tint (`text-[#5a32fa] dark:text-[#ff90e8]`) with animated indicator.

### 1.3 — Full-Screen Mobile Drawer Menu (`WIPA/src/components/MobileDrawerMenu.tsx`)
- [ ] 8. **Slide-Over Sheet**: Smooth Framer Motion spring transition from the right.
- [ ] 9. **User Identity Header**: Avatar, full name, tier badge (`Verified Counsel`, `⭐ WIPA Recommended`), and direct profile link.
- [ ] 10. **Categorized Touch Tiles (FB Grid Style)**:
  - *Community*: Feed, Liked Threads, Discussion Forums, Groups, Mentorship.
  - *Directory*: Members, Network, IP Law Firms, Business Profiles, Board of Directors.
  - *Career & Knowledge*: Jobs Board, Quizzes & XP Leaderboard, Events & Calendar, 11 Resource Verticals.
  - *Utilities*: LexIQ AI Assistant, Gift a Membership, Refer a Friend, Dark Mode Toggle, Settings, Log Out.

---

## SECTION 2: MOBILE FEED & COMMUNITY ACTIVITY STREAM (`/platform`)

### 2.1 — Mobile Feed Header & Highlights
- [ ] 11. **Horizontal Swipeable Highlights / Stories**: Top avatar carousel featuring spotlight female leaders, upcoming webinars, and trending topics.
- [ ] 12. **Mobile Post Composer Bar**: "What's on your mind?" touch trigger opening full-screen mobile post creation modal with image/video camera picker.

### 2.2 — Mobile Feed Cards
- [ ] 13. **Edge-to-Edge Fluid Cards**: `w-full bg-white dark:bg-[#151c2c] rounded-none sm:rounded-2xl border-y sm:border border-gray-200 dark:border-gray-800 mb-2 sm:mb-4`.
- [ ] 14. **Large Thumb-Zone Action Bar**: Full-width 4-button split (Like, Comment, Repost, Share) with `h-11` touch targets and micro-animations.
- [ ] 15. **Mobile Comment Bottom-Sheet**: Clicking comment opens slide-up bottom drawer without losing user's scroll position on the main feed.

---

## SECTION 3: MOBILE USER PROFILE (`/platform/profile` & `/u/[id]`)

### 3.1 — Mobile Hero Profile Card
- [ ] 16. **Responsive Cover Photo**: Auto-adjusting `h-40` with floating camera quick-change icon.
- [ ] 17. **Centered / Overlapping Mobile Avatar**: `w-28 h-28` circle with verified checkmark and gold recommendation badge.
- [ ] 18. **Mobile Action Ribbon**: Side-by-side prominent buttons: `Edit Profile` (primary), `Share / QR` (secondary), `Settings` (icon).

### 3.2 — Mobile Profile Navigation Tabs
- [ ] 19. **Horizontal Sticky Sub-Bar**: Smooth scrolling tab pill list (`Posts`, `About`, `Experience`, `Education`, `Skills`).
- [ ] 20. **Mobile Career & Education Timeline**: Single-column vertical cards with company badges and readable fonts on small viewports.
- [ ] 21. **Mobile Endorsement Badges**: Tap-to-endorse skill pills with instant counter increments.

---

## SECTION 4: MOBILE REAL-TIME MESSAGES & CHAT (`/platform/messages`)

### 4.1 — Mobile Conversation List View
- [ ] 22. **Full-Width Chat Items**: Avatar, online green ring, bold unread message snippet, time, and unread pill badge.
- [ ] 23. **Quick Search & Filter**: Search contacts with sticky filter pills (`All`, `Unread`, `Direct`, `Groups`).

### 4.2 — Mobile Message Thread View
- [ ] 24. **WhatsApp/Messenger Transition**: Tapping a chat slides to full-screen message thread with back chevron header.
- [ ] 25. **Keyboard-Aware Sticky Input**: Chat bar pinned above mobile keyboard (`pb-safe`) with emoji, image upload, and send button.

---

## SECTION 5: MOBILE RESOURCE LIBRARY & 11 CONTENT VERTICALS

### 5.1 — Master Hub (`/platform/resources`)
- [ ] 26. **Swipeable 11-Vertical Category Carousel**: Thumb-friendly pill selector at top of screen.
- [ ] 27. **Compact Vertical Cards**: 1-column mobile card layout with cover image, category tag, read-time, and title.

### 5.2 — Mobile Verticals
- [ ] 28. **Webinars (`/webinars`)**: Embedded 16:9 mobile video player with sticky play controls.
- [ ] 29. **Education (`/education`)**: Mobile course cards with duration and 1-tap syllabus download.
- [ ] 30. **Articles & IP News (`/articles-insights`, `/ip-news`)**: Reader-optimized typography (`text-base leading-relaxed`), dark mode contrast, and share toolbar.
- [ ] 31. **Mobile Splash Sponsored Banner**: Compact full-width gradient banner with shimmering badge and mobile CTA.

---

## SECTION 6: MOBILE EVENTS, MEETN ROOMS & CALENDAR (`/platform/events`, `/calendar`)

- [ ] 32. **Mobile Event Cards**: Countdown timer chip, date badge, speaker headshot, and full-width `RSVP Now` button.
- [ ] 33. **1-Tap Mobile Calendar Sync**: Add to Google/Apple Calendar directly from mobile browser.
- [ ] 34. **Mobile Virtual Room Launcher**: Responsive Meetn/Zoom room launcher with mobile permission handling.
- [ ] 35. **Mobile Monthly Calendar**: Touch-optimized monthly grid with dot indicators and expandable daily event drawer.

---

## SECTION 7: MOBILE IP LAW FIRMS & BUSINESS PROFILES (`/ip-firms`, `/business`)

- [ ] 36. **Mobile Filter Drawer**: Bottom-sheet filter modal for practice areas, country jurisdictions, and verified firms.
- [ ] 37. **Mobile Firm Directory Cards**: Logo, firm name, HQ flag, specialization tags, and `View Firm Profile` action.
- [ ] 38. **Mobile Firm Claim Application**: Step-by-step mobile wizard with document camera upload.

---

## SECTION 8: MOBILE JOBS BOARD & QUICK APPLY (`/platform/jobs`)

- [ ] 39. **Mobile Job Cards**: Salary badge, remote tag, company logo, experience level, and 1-tap `Quick Apply` modal.
- [ ] 40. **Mobile Application Sheet**: Pre-filled profile data with resume PDF attachment from mobile file picker.

---

## SECTION 9: MOBILE GAMIFICATION, QUIZZES & LEADERBOARD (`/quizzes`, `/leaderboard`)

- [ ] 41. **Full-Screen Mobile Quiz Runner**: Large thumb-friendly option choices with tactile selection animation, countdown timer, and victory XP celebration confetti.
- [ ] 42. **Mobile Leaderboard Podium**: Animated top-3 practitioner podium with weekly/monthly tab filters.

---

## SECTION 10: MOBILE BOARD OF DIRECTORS (`/platform/board-members`)

- [ ] 43. **Portrait Mobile Cards**: Vertical `h-[460px]` portrait cards with swipe snap, country flags, and smooth tap-to-expand modal sheet.
- [ ] 44. **Smooth Mobile Bio Sheet**: Detailed modal with leader's full biography, LinkedIn, email, and WIPA profile links.

---

## SECTION 11: MOBILE LEXIQ AI CO-PILOT FAB & SLIDE-UP DRAWER

- [ ] 45. **Floating Action Button (FAB)**: Shimmering AI sparkle button in bottom-right corner.
- [ ] 46. **Full-Height Mobile Chat Sheet**: Multi-model selector (Nemotron, Gemma4, Dots, Gemini), auto-focus input, and instant SPA navigation execution.

---

## SECTION 12: TESTING, TOUCH TARGETS & BUILD VERIFICATION

- [ ] 47. **Thumb-Zone Optimization**: Minimum touch target size `44x44px` on all interactive buttons.
- [ ] 48. **Zero Horizontal Overflow**: Enforce `overflow-x-hidden` across `html`, `body`, and page wrappers on mobile viewports (360px - 430px).
- [ ] 49. **Production Next.js Build**: Compile `WIPA` and `wipa-admin` with 0 errors (`npm run build`).
- [ ] 50. **Git Synchronization**: Commit and push changes to `main`.
