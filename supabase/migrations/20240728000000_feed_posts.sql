-- 8. Feed Posts Table
CREATE TABLE public.feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  privacy TEXT DEFAULT 'Anyone',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feed posts are viewable by everyone."
  ON public.feed_posts FOR SELECT
  USING ( true );

CREATE POLICY "Authenticated users can insert feed posts."
  ON public.feed_posts FOR INSERT
  WITH CHECK ( auth.uid() = author_id );

CREATE POLICY "Users can delete their own feed posts."
  ON public.feed_posts FOR DELETE
  USING ( auth.uid() = author_id );
