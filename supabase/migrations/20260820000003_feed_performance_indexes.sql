-- Cursor-paginated home feed and per-page like lookups.
CREATE INDEX IF NOT EXISTS idx_feed_posts_created_at_desc
  ON public.feed_posts (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feed_likes_user_post
  ON public.feed_likes (user_id, post_id);

CREATE INDEX IF NOT EXISTS idx_feed_comments_post_created
  ON public.feed_comments (post_id, created_at DESC);
