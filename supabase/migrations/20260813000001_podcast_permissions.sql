-- Add permission flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS can_publish_podcast BOOLEAN DEFAULT false;

-- Create applications table
CREATE TABLE IF NOT EXISTS public.podcast_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  podcast_name TEXT NOT NULL,
  description TEXT NOT NULL,
  topics TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.podcast_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own applications"
  ON public.podcast_applications FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can view their own applications"
  ON public.podcast_applications FOR SELECT
  USING ( auth.uid() = user_id );
