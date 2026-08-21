CREATE TABLE IF NOT EXISTS public.saved_posts (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their saved posts" ON public.saved_posts;
CREATE POLICY "Users can view their saved posts"
  ON public.saved_posts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save posts" ON public.saved_posts;
CREATE POLICY "Users can save posts"
  ON public.saved_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove saved posts" ON public.saved_posts;
CREATE POLICY "Users can remove saved posts"
  ON public.saved_posts FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_posts_user_created
  ON public.saved_posts (user_id, created_at DESC);
