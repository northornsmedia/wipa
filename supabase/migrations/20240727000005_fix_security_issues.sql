-- Fix 1: Function Search Path Mutable for handle_new_user
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- Fix 2 & 3: Public / Signed-In Can Execute SECURITY DEFINER Function
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM public;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;
  END IF;
END
$$;

-- Fix 4: RLS Policy Always True for conversations
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK ( auth.uid() IS NOT NULL ); 

-- Fix 5: RLS Policy Always True for conversation_participants
DROP POLICY IF EXISTS "Users can join or add to conversations" ON public.conversation_participants;
CREATE POLICY "Users can join or add to conversations"
  ON public.conversation_participants FOR INSERT
  WITH CHECK ( auth.uid() IS NOT NULL );

-- Fix 6: Public Bucket Allows Listing for avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Fix 7: Public Bucket Allows Listing for resources
DROP POLICY IF EXISTS "Resources are publicly accessible." ON storage.objects;
CREATE POLICY "Resources are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'resources' AND auth.role() = 'authenticated' );
