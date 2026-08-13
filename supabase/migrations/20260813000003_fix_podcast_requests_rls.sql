-- Drop any public policies we may have created previously
DROP POLICY IF EXISTS "Admin can view all podcast requests" ON public.podcast_requests;
DROP POLICY IF EXISTS "Admin can update all podcast requests" ON public.podcast_requests;
DROP POLICY IF EXISTS "Authenticated users can view podcast requests" ON public.podcast_requests;
DROP POLICY IF EXISTS "Authenticated users can update podcast requests" ON public.podcast_requests;

-- Ensure the restrictive SELECT policy exists (this is the default secure state)
DROP POLICY IF EXISTS "Users can view their own podcast requests." ON public.podcast_requests;
CREATE POLICY "Users can view their own podcast requests."
  ON public.podcast_requests FOR SELECT
  USING ( auth.uid() = user_id );
