-- 1. Create Conversations Table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  participant2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(participant1_id, participant2_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  USING ( auth.uid() = participant1_id OR auth.uid() = participant2_id );

CREATE POLICY "Users can insert conversations they are part of"
  ON public.conversations FOR INSERT
  WITH CHECK ( auth.uid() = participant1_id OR auth.uid() = participant2_id );

CREATE POLICY "Users can update conversations they are part of"
  ON public.conversations FOR UPDATE
  USING ( auth.uid() = participant1_id OR auth.uid() = participant2_id );

-- 2. Modify Messages Table
-- Delete all existing messages since they depend on receiver_id which we are dropping
DELETE FROM public.messages;

-- Drop old policies that depend on receiver_id
DROP POLICY IF EXISTS "Users can view their own messages." ON public.messages;

ALTER TABLE public.messages DROP COLUMN receiver_id;
ALTER TABLE public.messages ADD COLUMN conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL;
CREATE POLICY "Users can view their own messages."
  ON public.messages FOR SELECT
  USING ( 
    EXISTS (
      SELECT 1 FROM public.conversations c 
      WHERE c.id = messages.conversation_id 
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

-- 3. Enable Realtime
-- First check if publication exists (Supabase creates supabase_realtime by default)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END
$$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
