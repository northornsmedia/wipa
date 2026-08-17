# 🚀 WIPA Next-Gen Enterprise Admin Suite & Dynamic Ads Engine
## Architecture & Implementation Blueprint (`newfeatures.md`)
*Inspired by Facebook Ads Manager, LinkedIn Campaign Manager & Instagram Professional Dashboard*

---

## 1. Executive Summary & Core Objectives
Transform the WIPA Admin Console (`wipa-admin`) and Frontend Platform (`WIPA`) into an enterprise-grade advertising, sponsorship, and platform intelligence ecosystem:
1. **Dynamic Multi-Slot Ad Placements**: Replace all static "AD SPACE" placeholders with live, database-driven, impression/click-tracked native ad units.
2. **Instant Backend-to-Frontend Synchronization**: Changes made in the Admin Ads Studio immediately propagate to feed streams, sidebars, resource hubs, and mobile apps.
3. **Enterprise Ads Studio**: Interactive ad composer with live mobile/desktop visual preview, custom CTA presets, banner asset uploads (Supabase Storage), and schedule targeting.
4. **Comprehensive Monetization Analytics**: Real-time CTR, impression tracking, CPC/CPM insights, partner billing exports, and click heatmaps.
5. **Community Trust & Moderation Suite**: Full user reporting queue, member verification badge manager (`⭐ WIPA Recommended`), and global announcement broadcast system.

---

## 2. Database Schema & Infrastructure

### A. Table: `public.ad_campaigns`
```sql
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  banner_image_url TEXT NOT NULL,
  slot_placement TEXT NOT NULL, -- 'feed_native' | 'sidebar_banner' | 'header_ticker' | 'resource_splash' | 'jobs_spotlight'
  headline TEXT NOT NULL,
  description TEXT,
  cta_label TEXT NOT NULL DEFAULT 'Learn More', -- 'Learn More' | 'Claim Offer' | 'Apply Now' | 'Contact Us' | 'Book Consultation'
  target_url TEXT NOT NULL,
  badge_text TEXT DEFAULT 'Sponsored',
  background_gradient TEXT DEFAULT 'from-indigo-600 to-purple-600',
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  target_audience TEXT DEFAULT 'All Members', -- 'All Members' | 'In-House Counsel' | 'Law Firms' | 'Students'
  impressions_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### B. Table: `public.ad_analytics_events`
```sql
CREATE TABLE IF NOT EXISTS public.ad_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'impression' | 'click'
  user_id UUID,
  ip_hash TEXT,
  user_agent TEXT,
  page_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### C. Table: `public.platform_announcements`
```sql
CREATE TABLE IF NOT EXISTS public.platform_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  banner_type TEXT DEFAULT 'info', -- 'info' | 'promo' | 'warning' | 'celebration'
  cta_text TEXT,
  cta_url TEXT,
  is_active BOOLEAN DEFAULT false,
  dismissible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### D. Supabase Storage Bucket
- `sponsorships` (Public, for ad creatives, partner logos, high-res banners).

---

## 3. Frontend Ad Slot Placements (Live Component Integration)

### Slot 1: `feed_native` (In-Feed Sponsored Post Card)
- **Location**: `WIPA/src/app/platform/page.tsx`
- **Cadence**: Injected every 4 feed posts.
- **Design**: Blends seamlessly with user posts, featuring partner avatar, verified sponsor tag (`💼 Sponsored • [Company Name]`), high-res creative image, engaging headline, and custom branded CTA button.
- **Tracking**: Fires impression beacon on view; tracks click count via `/api/sponsored-clicks`.

### Slot 2: `sidebar_banner` (Right Sidebar Spotlight)
- **Location**: `WIPA/src/app/platform/page.tsx` (Right Column Widget) & `WIPA/src/components/RightSidebar.tsx`
- **Design**: Premium high-contrast card with brand imagery, partner badge, headline, and hover-animated "Visit Partner" action.

### Slot 3: `header_ticker` (Top Global Announcement Ribbon)
- **Location**: `WIPA/src/components/PlatformHeader.tsx` & `WIPA/src/app/layout.tsx`
- **Design**: Subtle dismissible top ribbon displaying high-priority announcements, conference dates, or sponsored headline broadcasts.

### Slot 4: `resource_splash` (Resource Library Splash Sponsorship)
- **Location**: All 11 Resource Library pages (`/platform/resources/*`)
- **Design**: Dynamic hero sponsor card with custom CTA button, verified partner badge, and live click tracking.

### Slot 5: `jobs_spotlight` (Job Board Featured Employer)
- **Location**: `WIPA/src/app/platform/jobs/page.tsx`
- **Design**: Sticky employer highlight banner driving applications to top hiring law firms.

---

## 4. Admin Panel Features & Management Suite (`wipa-admin`)

### A. Next-Gen Sponsorships & Ads Hub (`/sponsorships`)
1. **Live Ad Studio / Creator Modal (`AdCampaignModal`)**:
   - Visual Ad Creator with real-time Mobile & Desktop live preview.
   - Slot selector dropdown (`Feed Native`, `Sidebar Banner`, `Top Ribbon`, `Resource Splash`).
   - Image & Logo Drag-and-Drop file uploader direct to Supabase `sponsorships` bucket.
   - Headline, Description, and CTA presets (`Learn More`, `Claim VIP Pass`, `Consult Firm`, `Download Report`).
   - Target URL validator with UTM auto-tagging.
   - Audience targeting filter and scheduling date-range picker.
2. **Campaign Control Center**:
   - Instant 1-click **Pause / Activate** switch.
   - Live Performance Metrics per campaign: Total Impressions, Total Clicks, Click-Through Rate (CTR %), and Status.
   - Quick Edit & Delete actions.

### B. Global Announcements & Broadcast Manager (`/announcements`)
- Push global banners to the top of the entire user platform in real-time.
- Customize banner color (Purple, Emerald, Amber, Rose), message, and link button.
- One-click active/inactive toggle.

### C. Trust, Verification & Member Badge Manager (`/users` & `/moderation`)
- Toggle **⭐ WIPA Recommended Member** badge on any profile.
- Verified Law Firm badge manager.
- User report & content moderation queue with instant dismiss / take-down actions.

---

## 5. Phased Implementation Roadmap

| Phase | Milestone | Deliverables |
| :--- | :--- | :--- |
| **Phase 1** | **Database Schema & Storage** | Create `ad_campaigns`, `ad_analytics_events`, `platform_announcements` tables and configure `sponsorships` storage bucket with seed data. |
| **Phase 2** | **Admin Ad Studio & Control Center** | Build `AdCampaignModal` with live preview, update `/sponsorships` in `wipa-admin`, build `/announcements` manager. |
| **Phase 3** | **Frontend Dynamic Ad Slots** | Replace hardcoded ad placeholders in `WIPA` (`platform/page.tsx`, `PlatformHeader.tsx`, `jobs/page.tsx`) with dynamic `AdSlot` components. |
| **Phase 4** | **Analytics & Click Tracking** | Implement `/api/sponsored-clicks` API route with live impression/click tracking and real-time CTR charts in admin. |
| **Phase 5** | **Build, Validation & Deployment** | Run end-to-end production builds on both repositories and push to GitHub. |

---

## 6. Verification Checklist
- [x] Schema designed and documented.
- [ ] Create `ad_campaigns` and `platform_announcements` in Supabase.
- [ ] Seed initial live campaigns with real partner assets (Advitam IP, Ennoble IP, UNH Law, Women's IP World).
- [ ] Build Ad Studio modal with live interactive preview in `wipa-admin`.
- [ ] Implement dynamic feed & sidebar ad rendering in `WIPA`.
- [ ] Validate zero build errors in both projects (`npm run build`).
- [ ] Git commit and push to remote repositories.
