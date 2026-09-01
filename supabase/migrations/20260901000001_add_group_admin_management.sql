-- Group ownership, admin management, and post moderation.

ALTER TABLE public.groups
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Public',
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#5a32fa',
  ADD COLUMN IF NOT EXISTS cover_url TEXT,
  ADD COLUMN IF NOT EXISTS members_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE public.feed_posts
  ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS post_to_feed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'feed_posts_moderation_status_check'
      AND conrelid = 'public.feed_posts'::regclass
  ) THEN
    ALTER TABLE public.feed_posts
      ADD CONSTRAINT feed_posts_moderation_status_check
      CHECK (moderation_status IN ('pending', 'approved', 'rejected'));
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_group_admin(target_group_id UUID, target_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.groups AS target_group
    WHERE target_group.id = target_group_id
      AND target_group.created_by = target_user_id
  ) OR EXISTS (
    SELECT 1
    FROM public.group_members AS membership
    WHERE membership.group_id = target_group_id
      AND membership.user_id = target_user_id
      AND membership.role IN ('admin', 'owner')
  );
$$;

REVOKE ALL ON FUNCTION public.is_group_admin(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_group_admin(UUID, UUID) TO authenticated, service_role;

DROP POLICY IF EXISTS "Authenticated users can create groups." ON public.groups;
CREATE POLICY "Authenticated users can create groups."
  ON public.groups FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Only an owner/admin can change or remove a group.
DROP POLICY IF EXISTS "Group admins can update their groups." ON public.groups;
CREATE POLICY "Group admins can update their groups."
  ON public.groups FOR UPDATE TO authenticated
  USING (public.is_group_admin(id, auth.uid()))
  WITH CHECK (public.is_group_admin(id, auth.uid()));

DROP POLICY IF EXISTS "Group admins can delete their groups." ON public.groups;
CREATE POLICY "Group admins can delete their groups."
  ON public.groups FOR DELETE TO authenticated
  USING (public.is_group_admin(id, auth.uid()));

-- Covers older databases where group_id existed without an ON DELETE CASCADE
-- foreign key. Interaction rows are already cascaded from feed_posts.
CREATE OR REPLACE FUNCTION public.delete_group_posts_with_group()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.feed_posts WHERE group_id = OLD.id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS delete_group_posts_with_group ON public.groups;
CREATE TRIGGER delete_group_posts_with_group
  BEFORE DELETE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_group_posts_with_group();

-- Prevent members from granting themselves an admin role while still allowing
-- a creator to create their initial admin membership.
DROP POLICY IF EXISTS "Users can join groups." ON public.group_members;
CREATE POLICY "Users can join groups."
  ON public.group_members FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (
      role = 'member'
      OR (
        role IN ('admin', 'owner')
        AND EXISTS (
          SELECT 1
          FROM public.groups AS target_group
          WHERE target_group.id = group_id
            AND target_group.created_by = auth.uid()
        )
      )
    )
  );

DROP POLICY IF EXISTS "Users can leave groups." ON public.group_members;
CREATE POLICY "Users can leave groups."
  ON public.group_members FOR DELETE TO authenticated
  USING (auth.uid() = user_id AND role = 'member');

DROP POLICY IF EXISTS "Group admins can manage members." ON public.group_members;
CREATE POLICY "Group admins can manage members."
  ON public.group_members FOR ALL TO authenticated
  USING (public.is_group_admin(group_id, auth.uid()))
  WITH CHECK (public.is_group_admin(group_id, auth.uid()));

CREATE OR REPLACE FUNCTION public.sync_group_members_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  affected_group_id UUID;
BEGIN
  affected_group_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.group_id ELSE NEW.group_id END;

  UPDATE public.groups
  SET members_count = (
    SELECT COUNT(*)::INTEGER
    FROM public.group_members AS membership
    WHERE membership.group_id = affected_group_id
  )
  WHERE id = affected_group_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_group_members_count ON public.group_members;
CREATE TRIGGER sync_group_members_count
  AFTER INSERT OR DELETE ON public.group_members
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_group_members_count();

-- Member-authored group posts enter the moderation queue. Admin posts publish
-- immediately. Non-group feed posts keep their existing approved behavior.
CREATE OR REPLACE FUNCTION public.set_group_post_moderation_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.group_id IS NULL THEN
    NEW.moderation_status := 'approved';
    RETURN NEW;
  END IF;

  IF public.is_group_admin(NEW.group_id, NEW.author_id) THEN
    NEW.moderation_status := 'approved';
    NEW.moderated_at := timezone('utc'::text, now());
    NEW.moderated_by := NEW.author_id;
  ELSE
    NEW.moderation_status := 'pending';
    NEW.moderated_at := NULL;
    NEW.moderated_by := NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_group_post_moderation_on_insert ON public.feed_posts;
CREATE TRIGGER set_group_post_moderation_on_insert
  BEFORE INSERT ON public.feed_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_group_post_moderation_on_insert();

CREATE OR REPLACE FUNCTION public.enforce_group_post_moderation_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.moderation_status IS DISTINCT FROM OLD.moderation_status THEN
    IF OLD.group_id IS NULL OR NOT public.is_group_admin(OLD.group_id, auth.uid()) THEN
      RAISE EXCEPTION 'Only a group admin can moderate group posts';
    END IF;

    NEW.moderated_at := timezone('utc'::text, now());
    NEW.moderated_by := auth.uid();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_group_post_moderation_update ON public.feed_posts;
CREATE TRIGGER enforce_group_post_moderation_update
  BEFORE UPDATE OF moderation_status ON public.feed_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_group_post_moderation_update();

DROP POLICY IF EXISTS "Feed posts are viewable by everyone." ON public.feed_posts;
DROP POLICY IF EXISTS "Feed posts are viewable by authenticated users." ON public.feed_posts;
CREATE POLICY "Feed posts are viewable by authenticated users."
  ON public.feed_posts FOR SELECT TO authenticated
  USING (
    author_id = auth.uid()
    OR (group_id IS NOT NULL AND public.is_group_admin(group_id, auth.uid()))
    OR (
      moderation_status = 'approved'
      AND (
        group_id IS NULL
        OR EXISTS (
          SELECT 1
          FROM public.groups AS target_group
          WHERE target_group.id = group_id
            AND (
              COALESCE(target_group.type, 'Public') <> 'Private'
              OR EXISTS (
                SELECT 1
                FROM public.group_members AS membership
                WHERE membership.group_id = target_group.id
                  AND membership.user_id = auth.uid()
              )
            )
        )
      )
    )
  );

DROP POLICY IF EXISTS "Group admins can moderate posts." ON public.feed_posts;
CREATE POLICY "Group admins can moderate posts."
  ON public.feed_posts FOR UPDATE TO authenticated
  USING (group_id IS NOT NULL AND public.is_group_admin(group_id, auth.uid()))
  WITH CHECK (group_id IS NOT NULL AND public.is_group_admin(group_id, auth.uid()));

DROP POLICY IF EXISTS "Group admins can delete posts." ON public.feed_posts;
CREATE POLICY "Group admins can delete posts."
  ON public.feed_posts FOR DELETE TO authenticated
  USING (group_id IS NOT NULL AND public.is_group_admin(group_id, auth.uid()));

CREATE OR REPLACE FUNCTION public.notify_group_post_moderation_result()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  group_name TEXT;
  group_path TEXT;
BEGIN
  IF NEW.moderation_status IS NOT DISTINCT FROM OLD.moderation_status
    OR NEW.moderation_status NOT IN ('approved', 'rejected')
    OR NEW.author_id = auth.uid()
  THEN
    RETURN NEW;
  END IF;

  SELECT
    target_group.name,
    '/platform/groups/' || COALESCE(target_group.slug, target_group.id::TEXT)
  INTO group_name, group_path
  FROM public.groups AS target_group
  WHERE target_group.id = NEW.group_id;

  INSERT INTO public.notifications (user_id, actor_id, type, content, link, is_read)
  VALUES (
    NEW.author_id,
    auth.uid(),
    CASE WHEN NEW.moderation_status = 'approved' THEN 'group_post_approved' ELSE 'group_post_rejected' END,
    CASE
      WHEN NEW.moderation_status = 'approved' THEN 'approved your post in ' || COALESCE(group_name, 'the group') || '.'
      ELSE 'did not approve your post in ' || COALESCE(group_name, 'the group') || '.'
    END,
    CASE WHEN NEW.moderation_status = 'approved' THEN '/platform/post/' || NEW.id::TEXT ELSE group_path END,
    FALSE
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_group_post_moderation_result ON public.feed_posts;
CREATE TRIGGER notify_group_post_moderation_result
  AFTER UPDATE OF moderation_status ON public.feed_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_group_post_moderation_result();

CREATE INDEX IF NOT EXISTS idx_feed_posts_group_moderation
  ON public.feed_posts (group_id, moderation_status, created_at DESC)
  WHERE group_id IS NOT NULL;
