CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(requester_id, recipient_id)
);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own connections."
  ON public.connections FOR SELECT
  USING ( auth.uid() = requester_id OR auth.uid() = recipient_id );

CREATE POLICY "Users can insert connections."
  ON public.connections FOR INSERT
  WITH CHECK ( auth.uid() = requester_id );

CREATE POLICY "Users can update their connections."
  ON public.connections FOR UPDATE
  USING ( auth.uid() = requester_id OR auth.uid() = recipient_id );

CREATE POLICY "Users can delete their connections."
  ON public.connections FOR DELETE
  USING ( auth.uid() = requester_id OR auth.uid() = recipient_id );
