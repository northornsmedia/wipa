CREATE POLICY "Users can update their own feed posts." ON feed_posts FOR UPDATE USING (auth.uid() = author_id);
