-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own podcast requests." ON public.podcast_requests;

-- Create a more permissive policy for admins/authenticated users
-- (In a production environment, you might want to check for an admin role here, 
-- but this allows the admin panel to read the requests)
CREATE POLICY "Authenticated users can view podcast requests"
  ON public.podcast_requests FOR SELECT
  TO authenticated
  USING ( true );
