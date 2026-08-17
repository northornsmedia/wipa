CREATE OR REPLACE FUNCTION public.compute_trending_score()
RETURNS TRIGGER AS $$
DECLARE
    likes_count INT;
    replies_count INT;
    hours_since_post FLOAT;
    new_score FLOAT;
    is_currently_trending BOOLEAN;
BEGIN
    -- We need to determine the forum_post_id depending on the trigger source
    DECLARE post_id UUID;
    BEGIN
        IF TG_TABLE_NAME = 'forum_replies' THEN
            post_id := NEW.post_id;
        ELSIF TG_TABLE_NAME = 'forum_post_likes' THEN
            post_id := NEW.post_id;
        ELSIF TG_TABLE_NAME = 'forum_posts' THEN
            post_id := NEW.id;
        END IF;

        -- Get current stats
        SELECT COUNT(*) INTO likes_count FROM public.forum_post_likes WHERE forum_post_likes.post_id = post_id;
        SELECT COUNT(*) INTO replies_count FROM public.forum_replies WHERE forum_replies.post_id = post_id;
        
        SELECT EXTRACT(EPOCH FROM (now() - created_at))/3600, is_trending 
        INTO hours_since_post, is_currently_trending
        FROM public.forum_posts WHERE id = post_id;

        -- Prevent division by zero
        IF hours_since_post < 1 THEN
            hours_since_post := 1;
        END IF;

        -- We also need views, which we will just pull directly from the post
        DECLARE current_views INT;
        BEGIN
            SELECT view_count INTO current_views FROM public.forum_posts WHERE id = post_id;
            
            -- Calculate score
            new_score := (likes_count * 2 + replies_count * 3 + current_views / 10.0) / POWER(hours_since_post, 1.5);
            
            -- Update post
            IF new_score > 50 AND NOT is_currently_trending THEN
                UPDATE public.forum_posts 
                SET trending_score = new_score, 
                    is_trending = true, 
                    trended_at = now() 
                WHERE id = post_id;
            ELSE
                UPDATE public.forum_posts 
                SET trending_score = new_score 
                WHERE id = post_id;
            END IF;
        END;
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: In a real app we'd attach this to forum_replies, forum_post_likes, and forum_posts view updates.
-- Assuming tables exist (they might not be defined in this schema if we don't have them yet, so we use DO block for safe triggers)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'forum_replies') THEN
        DROP TRIGGER IF EXISTS on_reply_trending ON public.forum_replies;
        CREATE TRIGGER on_reply_trending
        AFTER INSERT OR DELETE ON public.forum_replies
        FOR EACH ROW EXECUTE FUNCTION public.compute_trending_score();
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'forum_post_likes') THEN
        DROP TRIGGER IF EXISTS on_like_trending ON public.forum_post_likes;
        CREATE TRIGGER on_like_trending
        AFTER INSERT OR DELETE ON public.forum_post_likes
        FOR EACH ROW EXECUTE FUNCTION public.compute_trending_score();
    END IF;
END $$;
