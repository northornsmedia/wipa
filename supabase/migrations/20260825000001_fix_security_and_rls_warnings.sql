-- ==============================================================================
-- Migration: Fix Supabase Security Linter Warnings & Harden Database RLS
-- Date: 2026-08-25
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. FIX FUNCTION SEARCH PATHS & EXECUTE PRIVILEGES (CWE-426 / CWE-250)
-- Sets search_path = public, pg_temp to prevent mutable search_path exploits.
-- Revokes public/anon access on SECURITY DEFINER functions where appropriate.
-- ------------------------------------------------------------------------------

-- 1.1 Function: public.is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- 1.2 Function: public.protect_wipa_recommended() (Trigger Function)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'protect_wipa_recommended') THEN
    ALTER FUNCTION public.protect_wipa_recommended() SET search_path = public, pg_temp;
    REVOKE EXECUTE ON FUNCTION public.protect_wipa_recommended() FROM public, anon, authenticated;
  END IF;
END $$;

-- 1.3 Function: public.are_users_connected(uuid, uuid)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'are_users_connected') THEN
    ALTER FUNCTION public.are_users_connected(uuid, uuid) SET search_path = public, pg_temp;
    REVOKE EXECUTE ON FUNCTION public.are_users_connected(uuid, uuid) FROM public, anon;
    GRANT EXECUTE ON FUNCTION public.are_users_connected(uuid, uuid) TO authenticated, service_role;
  END IF;
END $$;

-- 1.4 Functions: public.record_ad_impression and public.record_ad_click
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'record_ad_impression' 
    AND pronargs = 5
  ) THEN
    ALTER FUNCTION public.record_ad_impression(text, uuid, text, text, text) SET search_path = public, pg_temp;
    REVOKE EXECUTE ON FUNCTION public.record_ad_impression(text, uuid, text, text, text) FROM public, anon;
    GRANT EXECUTE ON FUNCTION public.record_ad_impression(text, uuid, text, text, text) TO authenticated, service_role;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'record_ad_click' 
    AND pronargs = 5
  ) THEN
    ALTER FUNCTION public.record_ad_click(text, uuid, text, text, text) SET search_path = public, pg_temp;
    REVOKE EXECUTE ON FUNCTION public.record_ad_click(text, uuid, text, text, text) FROM public, anon;
    GRANT EXECUTE ON FUNCTION public.record_ad_click(text, uuid, text, text, text) TO authenticated, service_role;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. HARDEN RLS POLICIES ON CONTENT & RESOURCE TABLES
-- Replaces overly permissive "FOR ALL USING (true)" policies with:
--   - Public SELECT (anyone can browse content)
--   - Admin / Service Role INSERT, UPDATE, DELETE
-- ------------------------------------------------------------------------------

-- Helper Macro to safely recreate clean RLS policies on content tables
DO $$
DECLARE
  tbl TEXT;
  content_tables TEXT[] := ARRAY[
    'articles_insights',
    'career_leadership',
    'education',
    'guides_toolkits',
    'in_house_counsel',
    'ip_news',
    'ip_services',
    'podcast_albums',
    'podcasts',
    'research_reports',
    'resources',
    'webinars',
    'wellness',
    'womens_ip_world',
    'events',
    'quizzes',
    'platform_announcements',
    'ip_firms'
  ];
  pol RECORD;
BEGIN
  FOREACH tbl IN ARRAY content_tables LOOP
    -- Check if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
      
      -- Drop all existing overly broad policies on this table
      FOR pol IN 
        SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = tbl
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', pol.policyname, tbl);
      END LOOP;

      -- 1. Anyone (including anon & authenticated) can read
      EXECUTE format(
        'CREATE POLICY "Public read access for %1$s" ON public.%1$I FOR SELECT USING (true);',
        tbl
      );

      -- 2. Only Admins can Insert
      EXECUTE format(
        'CREATE POLICY "Admin insert for %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (public.is_admin());',
        tbl
      );

      -- 3. Only Admins can Update
      EXECUTE format(
        'CREATE POLICY "Admin update for %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());',
        tbl
      );

      -- 4. Only Admins can Delete
      EXECUTE format(
        'CREATE POLICY "Admin delete for %1$s" ON public.%1$I FOR DELETE TO authenticated USING (public.is_admin());',
        tbl
      );
    END IF;
  END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 3. HARDEN RLS FOR ADS, ANALYTICS & SPECIFIC APPLICATION TABLES
-- ------------------------------------------------------------------------------

-- 3.1 Table: public.ad_campaigns
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ad_campaigns') THEN
    ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Ad campaigns all operations" ON public.ad_campaigns;
    DROP POLICY IF EXISTS "Allow all write for ad_campaigns" ON public.ad_campaigns;
    DROP POLICY IF EXISTS "Public read ad_campaigns" ON public.ad_campaigns;
    DROP POLICY IF EXISTS "Admin manage ad_campaigns" ON public.ad_campaigns;

    CREATE POLICY "Public read ad_campaigns" ON public.ad_campaigns
      FOR SELECT USING (true);

    CREATE POLICY "Admin manage ad_campaigns" ON public.ad_campaigns
      FOR ALL TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- 3.2 Table: public.ad_placements
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ad_placements') THEN
    ALTER TABLE public.ad_placements ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Ad placements all operations" ON public.ad_placements;
    DROP POLICY IF EXISTS "Allow all write for ad_placements" ON public.ad_placements;
    DROP POLICY IF EXISTS "Public read ad_placements" ON public.ad_placements;
    DROP POLICY IF EXISTS "Admin manage ad_placements" ON public.ad_placements;

    CREATE POLICY "Public read ad_placements" ON public.ad_placements
      FOR SELECT USING (true);

    CREATE POLICY "Admin manage ad_placements" ON public.ad_placements
      FOR ALL TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- 3.3 Table: public.ad_analytics_events
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ad_analytics_events') THEN
    ALTER TABLE public.ad_analytics_events ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow all write for ad_analytics_events" ON public.ad_analytics_events;
    DROP POLICY IF EXISTS "Admin read ad_analytics_events" ON public.ad_analytics_events;
    DROP POLICY IF EXISTS "Service insert ad_analytics_events" ON public.ad_analytics_events;

    CREATE POLICY "Admin read ad_analytics_events" ON public.ad_analytics_events
      FOR SELECT TO authenticated
      USING (public.is_admin());

    CREATE POLICY "Insert ad_analytics_events" ON public.ad_analytics_events
      FOR INSERT TO authenticated, anon
      WITH CHECK (true);
  END IF;
END $$;

-- 3.4 Table: public.ad_interactions
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ad_interactions') THEN
    ALTER TABLE public.ad_interactions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public insert for ad_interactions" ON public.ad_interactions;
    DROP POLICY IF EXISTS "Admin read ad_interactions" ON public.ad_interactions;

    CREATE POLICY "Admin read ad_interactions" ON public.ad_interactions
      FOR SELECT TO authenticated
      USING (public.is_admin());

    CREATE POLICY "Insert ad_interactions" ON public.ad_interactions
      FOR INSERT TO authenticated, anon
      WITH CHECK (true);
  END IF;
END $$;

-- 3.5 Table: public.analytics_events
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'analytics_events') THEN
    ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public insert for analytics_events" ON public.analytics_events;
    DROP POLICY IF EXISTS "Admin read analytics_events" ON public.analytics_events;

    CREATE POLICY "Admin read analytics_events" ON public.analytics_events
      FOR SELECT TO authenticated
      USING (public.is_admin());

    CREATE POLICY "Insert analytics_events" ON public.analytics_events
      FOR INSERT TO authenticated, anon
      WITH CHECK (true);
  END IF;
END $$;

-- 3.6 Table: public.sponsored_clicks
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sponsored_clicks') THEN
    ALTER TABLE public.sponsored_clicks ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anyone can insert sponsored clicks" ON public.sponsored_clicks;
    DROP POLICY IF EXISTS "Admin read sponsored_clicks" ON public.sponsored_clicks;

    CREATE POLICY "Admin read sponsored_clicks" ON public.sponsored_clicks
      FOR SELECT TO authenticated
      USING (public.is_admin());

    CREATE POLICY "Insert sponsored_clicks" ON public.sponsored_clicks
      FOR INSERT TO authenticated, anon
      WITH CHECK (true);
  END IF;
END $$;

-- 3.7 Table: public.calendar_events
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'calendar_events') THEN
    ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow all access to calendar_events" ON public.calendar_events;
    DROP POLICY IF EXISTS "Users can view their calendar events" ON public.calendar_events;
    DROP POLICY IF EXISTS "Users can insert their calendar events" ON public.calendar_events;
    DROP POLICY IF EXISTS "Users can update their calendar events" ON public.calendar_events;
    DROP POLICY IF EXISTS "Users can delete their calendar events" ON public.calendar_events;

    CREATE POLICY "Users can view their calendar events" ON public.calendar_events
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id OR public.is_admin());

    CREATE POLICY "Users can insert their calendar events" ON public.calendar_events
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id OR public.is_admin());

    CREATE POLICY "Users can update their calendar events" ON public.calendar_events
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id OR public.is_admin())
      WITH CHECK (auth.uid() = user_id OR public.is_admin());

    CREATE POLICY "Users can delete their calendar events" ON public.calendar_events
      FOR DELETE TO authenticated
      USING (auth.uid() = user_id OR public.is_admin());
  END IF;
END $$;

-- 3.8 Table: public.firm_claim_requests
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'firm_claim_requests') THEN
    ALTER TABLE public.firm_claim_requests ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Firm claims all operations" ON public.firm_claim_requests;
    DROP POLICY IF EXISTS "Users can view own firm claims" ON public.firm_claim_requests;
    DROP POLICY IF EXISTS "Users can insert firm claims" ON public.firm_claim_requests;
    DROP POLICY IF EXISTS "Admin manage firm claims" ON public.firm_claim_requests;

    CREATE POLICY "Users can view own firm claims" ON public.firm_claim_requests
      FOR SELECT TO authenticated
      USING (auth.uid() = requester_id OR public.is_admin());

    CREATE POLICY "Users can insert firm claims" ON public.firm_claim_requests
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = requester_id);

    CREATE POLICY "Admin manage firm claims" ON public.firm_claim_requests
      FOR ALL TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- 3.9 Table: public.ip_firm_reviews
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ip_firm_reviews') THEN
    ALTER TABLE public.ip_firm_reviews ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.ip_firm_reviews;
    DROP POLICY IF EXISTS "Public can view reviews" ON public.ip_firm_reviews;
    DROP POLICY IF EXISTS "Users can insert their own review" ON public.ip_firm_reviews;
    DROP POLICY IF EXISTS "Users can update their own review" ON public.ip_firm_reviews;
    DROP POLICY IF EXISTS "Users can delete their own review" ON public.ip_firm_reviews;

    CREATE POLICY "Public can view reviews" ON public.ip_firm_reviews
      FOR SELECT USING (true);

    CREATE POLICY "Users can insert their own review" ON public.ip_firm_reviews
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own review" ON public.ip_firm_reviews
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id OR public.is_admin())
      WITH CHECK (auth.uid() = user_id OR public.is_admin());

    CREATE POLICY "Users can delete their own review" ON public.ip_firm_reviews
      FOR DELETE TO authenticated
      USING (auth.uid() = user_id OR public.is_admin());
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 4. HARDEN STORAGE BUCKET POLICIES (feed-media listing warning)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Feed Media Access') THEN
    DROP POLICY "Public Feed Media Access" ON storage.objects;
  END IF;

  -- Create clean public read access without requiring broad listing
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Feed Media Public Read'
  ) THEN
    CREATE POLICY "Feed Media Public Read" ON storage.objects
      FOR SELECT
      USING (bucket_id = 'feed-media');
  END IF;
END $$;
