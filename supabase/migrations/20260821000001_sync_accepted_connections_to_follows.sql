-- Accepted connections mutually follow each other. Following remains independent
-- and never creates or accepts a connection.
CREATE OR REPLACE FUNCTION public.sync_accepted_connection_follows()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'accepted' AND (
    TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'accepted'
  ) THEN
    INSERT INTO public.follows (follower_id, following_id)
    VALUES
      (NEW.requester_id, NEW.recipient_id),
      (NEW.recipient_id, NEW.requester_id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_accepted_connection_follows_trigger ON public.connections;
CREATE TRIGGER sync_accepted_connection_follows_trigger
AFTER INSERT OR UPDATE OF status ON public.connections
FOR EACH ROW
EXECUTE FUNCTION public.sync_accepted_connection_follows();

-- Backfill mutual follows for connections that were already accepted.
INSERT INTO public.follows (follower_id, following_id)
SELECT requester_id, recipient_id
FROM public.connections
WHERE status = 'accepted'
ON CONFLICT DO NOTHING;

INSERT INTO public.follows (follower_id, following_id)
SELECT recipient_id, requester_id
FROM public.connections
WHERE status = 'accepted'
ON CONFLICT DO NOTHING;
