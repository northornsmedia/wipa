CREATE TABLE IF NOT EXISTS public.podcast_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  podcast_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.podcast_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own podcast requests."
  ON public.podcast_requests FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can view their own podcast requests."
  ON public.podcast_requests FOR SELECT
  USING ( auth.uid() = user_id );
