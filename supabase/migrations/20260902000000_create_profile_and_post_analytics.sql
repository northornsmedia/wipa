-- Migration: Create Profile Views and Post Impressions tracking for User Analytics

-- 1. Create Profile Views Table
CREATE TABLE IF NOT EXISTS public.profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create Post Impressions Table
CREATE TABLE IF NOT EXISTS public.post_impressions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Indexes for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_created ON public.profile_views(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer ON public.profile_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_session ON public.profile_views(profile_id, session_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_post_impressions_author_created ON public.post_impressions(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_impressions_post_created ON public.post_impressions(post_id, created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_impressions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for profile_views
DROP POLICY IF EXISTS "Allow public inserts on profile_views" ON public.profile_views;
CREATE POLICY "Allow public inserts on profile_views" 
ON public.profile_views 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own profile_views" ON public.profile_views;
CREATE POLICY "Users can read own profile_views" 
ON public.profile_views 
FOR SELECT 
USING (auth.uid() = profile_id);

-- 6. RLS Policies for post_impressions
DROP POLICY IF EXISTS "Allow public inserts on post_impressions" ON public.post_impressions;
CREATE POLICY "Allow public inserts on post_impressions" 
ON public.post_impressions 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Authors can read own post_impressions" ON public.post_impressions;
CREATE POLICY "Authors can read own post_impressions" 
ON public.post_impressions 
FOR SELECT 
USING (auth.uid() = author_id);

-- 7. Helper Function: Record Profile View (With Self-View Filter & 1-Hour Deduplication)
CREATE OR REPLACE FUNCTION public.record_profile_view(
    p_profile_id UUID,
    p_viewer_id UUID DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Do not record if viewing one's own profile
    IF p_viewer_id IS NOT NULL AND p_viewer_id = p_profile_id THEN
        RETURN false;
    END IF;

    -- Rate limiting / Deduplication: 1 view per viewer or session per 1 hour
    IF EXISTS (
        SELECT 1 FROM public.profile_views
        WHERE profile_id = p_profile_id
          AND (
              (p_viewer_id IS NOT NULL AND viewer_id = p_viewer_id)
              OR (p_session_id IS NOT NULL AND session_id = p_session_id)
          )
          AND created_at > (now() - interval '1 hour')
    ) THEN
        RETURN false;
    END IF;

    INSERT INTO public.profile_views (profile_id, viewer_id, session_id)
    VALUES (p_profile_id, p_viewer_id, p_session_id);

    RETURN true;
END;
$$;

-- 8. Helper Function: Record Batch Post Impressions
CREATE OR REPLACE FUNCTION public.record_post_impressions(
    p_impressions JSONB,
    p_viewer_id UUID DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_inserted_count INTEGER := 0;
BEGIN
    WITH inserted_rows AS (
        INSERT INTO public.post_impressions (post_id, author_id, viewer_id)
        SELECT 
            (elem->>'post_id')::UUID,
            (elem->>'author_id')::UUID,
            p_viewer_id
        FROM jsonb_array_elements(p_impressions) AS elem
        WHERE (elem->>'author_id')::UUID IS DISTINCT FROM p_viewer_id
        RETURNING 1
    )
    SELECT COUNT(*) INTO v_inserted_count FROM inserted_rows;

    RETURN v_inserted_count;
END;
$$;

-- 9. Analytics Aggregation RPC: get_user_analytics
CREATE OR REPLACE FUNCTION public.get_user_analytics(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_views BIGINT := 0;
    v_views_this_week BIGINT := 0;
    v_views_last_week BIGINT := 0;
    v_views_growth_pct TEXT := '0% this week';
    v_views_direction TEXT := 'neutral';

    v_total_impressions BIGINT := 0;
    v_impressions_this_week BIGINT := 0;
    v_impressions_last_week BIGINT := 0;
    v_impressions_growth_pct TEXT := '0% this week';
    v_impressions_direction TEXT := 'neutral';

    v_calc_pct NUMERIC;
BEGIN
    -- Profile Views Calculation
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days'),
        COUNT(*) FILTER (WHERE created_at >= now() - interval '14 days' AND created_at < now() - interval '7 days')
    INTO v_total_views, v_views_this_week, v_views_last_week
    FROM public.profile_views
    WHERE profile_id = target_user_id;

    IF v_views_last_week = 0 THEN
        IF v_views_this_week > 0 THEN
            v_views_growth_pct := '+100% this week';
            v_views_direction := 'up';
        ELSE
            v_views_growth_pct := '0% this week';
            v_views_direction := 'neutral';
        END IF;
    ELSE
        v_calc_pct := ROUND(((v_views_this_week::NUMERIC - v_views_last_week::NUMERIC) / v_views_last_week::NUMERIC) * 100);
        IF v_calc_pct > 0 THEN
            v_views_growth_pct := '+' || v_calc_pct || '% this week';
            v_views_direction := 'up';
        ELSIF v_calc_pct < 0 THEN
            v_views_growth_pct := v_calc_pct || '% this week';
            v_views_direction := 'down';
        ELSE
            v_views_growth_pct := '0% this week';
            v_views_direction := 'neutral';
        END IF;
    END IF;

    -- Post Impressions Calculation
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days'),
        COUNT(*) FILTER (WHERE created_at >= now() - interval '14 days' AND created_at < now() - interval '7 days')
    INTO v_total_impressions, v_impressions_this_week, v_impressions_last_week
    FROM public.post_impressions
    WHERE author_id = target_user_id;

    IF v_impressions_last_week = 0 THEN
        IF v_impressions_this_week > 0 THEN
            v_impressions_growth_pct := '+100% this week';
            v_impressions_direction := 'up';
        ELSE
            v_impressions_growth_pct := '0% this week';
            v_impressions_direction := 'neutral';
        END IF;
    ELSE
        v_calc_pct := ROUND(((v_impressions_this_week::NUMERIC - v_impressions_last_week::NUMERIC) / v_impressions_last_week::NUMERIC) * 100);
        IF v_calc_pct > 0 THEN
            v_impressions_growth_pct := '+' || v_calc_pct || '% this week';
            v_impressions_direction := 'up';
        ELSIF v_calc_pct < 0 THEN
            v_impressions_growth_pct := v_calc_pct || '% this week';
            v_impressions_direction := 'down';
        ELSE
            v_impressions_growth_pct := '0% this week';
            v_impressions_direction := 'neutral';
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'profile_views', v_total_views,
        'profile_views_this_week', v_views_this_week,
        'profile_views_growth', v_views_growth_pct,
        'profile_views_direction', v_views_direction,
        'post_impressions', v_total_impressions,
        'post_impressions_this_week', v_impressions_this_week,
        'post_impressions_growth', v_impressions_growth_pct,
        'post_impressions_direction', v_impressions_direction
    );
END;
$$;
