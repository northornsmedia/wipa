-- 1. Feed Comments Table
CREATE TABLE public.feed_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.feed_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feed_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feed comments are viewable by everyone."
  ON public.feed_comments FOR SELECT
  USING ( true );

CREATE POLICY "Authenticated users can insert feed comments."
  ON public.feed_comments FOR INSERT
  WITH CHECK ( auth.uid() = author_id );

CREATE POLICY "Users can delete their own comments."
  ON public.feed_comments FOR DELETE
  USING ( auth.uid() = author_id );


-- 2. Feed Likes Table
CREATE TABLE public.feed_likes (
  post_id UUID REFERENCES public.feed_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (post_id, user_id)
);

ALTER TABLE public.feed_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feed likes are viewable by everyone."
  ON public.feed_likes FOR SELECT
  USING ( true );

CREATE POLICY "Authenticated users can insert likes."
  ON public.feed_likes FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own likes."
  ON public.feed_likes FOR DELETE
  USING ( auth.uid() = user_id );


-- 3. Triggers for Counts

-- Comments Count Trigger
CREATE OR REPLACE FUNCTION public.handle_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feed_posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feed_posts 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_added_removed
  AFTER INSERT OR DELETE ON public.feed_comments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_comment_count();

-- Likes Count Trigger
CREATE OR REPLACE FUNCTION public.handle_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feed_posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feed_posts 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_added_removed
  AFTER INSERT OR DELETE ON public.feed_likes
  FOR EACH ROW EXECUTE PROCEDURE public.handle_like_count();
