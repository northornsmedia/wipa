ALTER TABLE public.resources
ADD COLUMN IF NOT EXISTS source_forum_post_id UUID;
