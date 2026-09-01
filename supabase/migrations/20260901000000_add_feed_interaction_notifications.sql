-- Notify a post author when another member likes or comments on their post.
-- Keeping this in the database covers every UI that writes to feed_likes or
-- feed_comments (main feed, groups, profiles, and future clients).

CREATE OR REPLACE FUNCTION public.notify_feed_post_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  post_author_id UUID;
  actor_id UUID;
  notification_type TEXT;
  notification_content TEXT;
BEGIN
  SELECT post.author_id
  INTO post_author_id
  FROM public.feed_posts AS post
  WHERE post.id = NEW.post_id;

  IF TG_TABLE_NAME = 'feed_likes' THEN
    actor_id := (to_jsonb(NEW) ->> 'user_id')::UUID;
    notification_type := 'post_like';
    notification_content := 'has liked your post.';
  ELSIF TG_TABLE_NAME = 'feed_comments' THEN
    actor_id := (to_jsonb(NEW) ->> 'author_id')::UUID;
    notification_type := 'post_comment';
    notification_content := 'has commented on your post.';
  ELSE
    RETURN NEW;
  END IF;

  -- Do not notify members about interactions with their own posts.
  IF post_author_id IS NULL OR post_author_id = actor_id THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (
    user_id,
    actor_id,
    type,
    content,
    link,
    is_read
  )
  VALUES (
    post_author_id,
    actor_id,
    notification_type,
    notification_content,
    '/platform/post/' || NEW.post_id::TEXT,
    FALSE
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_post_author_on_like ON public.feed_likes;
CREATE TRIGGER notify_post_author_on_like
  AFTER INSERT ON public.feed_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_feed_post_interaction();

DROP TRIGGER IF EXISTS notify_post_author_on_comment ON public.feed_comments;
CREATE TRIGGER notify_post_author_on_comment
  AFTER INSERT ON public.feed_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_feed_post_interaction();
