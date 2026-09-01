-- Every new post in a private group must be approved by a group owner/admin.
-- Public-group posts continue to publish immediately.

CREATE OR REPLACE FUNCTION public.set_group_post_moderation_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  group_privacy TEXT;
BEGIN
  IF NEW.group_id IS NULL THEN
    NEW.moderation_status := 'approved';
    RETURN NEW;
  END IF;

  SELECT COALESCE(target_group.type, 'Public')
  INTO group_privacy
  FROM public.groups AS target_group
  WHERE target_group.id = NEW.group_id;

  IF group_privacy = 'Private' THEN
    NEW.moderation_status := 'pending';
    NEW.moderated_at := NULL;
    NEW.moderated_by := NULL;
  ELSE
    NEW.moderation_status := 'approved';
    NEW.moderated_at := timezone('utc'::text, now());
    NEW.moderated_by := NEW.author_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_group_post_moderation_on_insert ON public.feed_posts;
CREATE TRIGGER set_group_post_moderation_on_insert
  BEFORE INSERT ON public.feed_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_group_post_moderation_on_insert();

CREATE OR REPLACE FUNCTION public.notify_group_admins_of_pending_post()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  group_name TEXT;
  group_path TEXT;
BEGIN
  IF NEW.moderation_status <> 'pending' OR NEW.group_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT
    target_group.name,
    '/platform/groups/' || COALESCE(target_group.slug, target_group.id::TEXT)
  INTO group_name, group_path
  FROM public.groups AS target_group
  WHERE target_group.id = NEW.group_id;

  INSERT INTO public.notifications (user_id, actor_id, type, content, link, is_read)
  SELECT
    admins.user_id,
    NEW.author_id,
    'group_post_pending',
    'submitted a post for approval in ' || COALESCE(group_name, 'your group') || '.',
    group_path,
    FALSE
  FROM (
    SELECT target_group.created_by AS user_id
    FROM public.groups AS target_group
    WHERE target_group.id = NEW.group_id

    UNION

    SELECT membership.user_id
    FROM public.group_members AS membership
    WHERE membership.group_id = NEW.group_id
      AND membership.role IN ('admin', 'owner')
  ) AS admins
  WHERE admins.user_id IS NOT NULL
    AND admins.user_id <> NEW.author_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_group_admins_of_pending_post ON public.feed_posts;
CREATE TRIGGER notify_group_admins_of_pending_post
  AFTER INSERT ON public.feed_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_group_admins_of_pending_post();

-- Reassert the owner/admin delete permission for databases upgrading from an
-- earlier version of the group feature.
DROP POLICY IF EXISTS "Group admins can delete posts." ON public.feed_posts;
CREATE POLICY "Group admins can delete posts."
  ON public.feed_posts FOR DELETE TO authenticated
  USING (group_id IS NOT NULL AND public.is_group_admin(group_id, auth.uid()));
