-- Secure Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users." 
  ON public.profiles FOR SELECT 
  USING ( auth.role() = 'authenticated' );

-- Secure Feed Posts
DROP POLICY IF EXISTS "Feed posts are viewable by everyone." ON public.feed_posts;
CREATE POLICY "Feed posts are viewable by authenticated users." 
  ON public.feed_posts FOR SELECT 
  USING ( auth.role() = 'authenticated' );

-- Secure Feed Likes
DROP POLICY IF EXISTS "Feed likes are viewable by everyone." ON public.feed_likes;
CREATE POLICY "Feed likes are viewable by authenticated users." 
  ON public.feed_likes FOR SELECT 
  USING ( auth.role() = 'authenticated' );
