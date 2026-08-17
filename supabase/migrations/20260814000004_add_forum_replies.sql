-- Add forum_replies table
CREATE TABLE public.forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forum replies are viewable by everyone"
    ON public.forum_replies FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert forum replies"
    ON public.forum_replies FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own replies"
    ON public.forum_replies FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own replies"
    ON public.forum_replies FOR DELETE
    USING (auth.uid() = author_id);

-- Also add a forum_post_likes table for task 49
CREATE TABLE public.forum_post_likes (
    post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    PRIMARY KEY (post_id, user_id)
);

ALTER TABLE public.forum_post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forum post likes are viewable by everyone"
    ON public.forum_post_likes FOR SELECT
    USING (true);

CREATE POLICY "Users can like posts"
    ON public.forum_post_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
    ON public.forum_post_likes FOR DELETE
    USING (auth.uid() = user_id);
