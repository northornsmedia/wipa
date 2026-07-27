-- 1. Create junction table
CREATE TABLE public.conversation_participants (
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY(conversation_id, user_id)
);

-- 2. Migrate existing participants to the new junction table
INSERT INTO public.conversation_participants (conversation_id, user_id, role)
SELECT id, participant1_id, 'admin' FROM public.conversations;

INSERT INTO public.conversation_participants (conversation_id, user_id, role)
SELECT id, participant2_id, 'admin' FROM public.conversations
ON CONFLICT DO NOTHING;

-- 3. Modify conversations table
ALTER TABLE public.conversations ADD COLUMN is_group BOOLEAN DEFAULT false;
ALTER TABLE public.conversations ADD COLUMN name TEXT;

-- Drop constraints related to participant1_id and participant2_id
ALTER TABLE public.conversations DROP CONSTRAINT conversations_participant1_id_participant2_id_key;

-- We need to drop policies that use participant1_id before dropping columns
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can insert conversations they are part of" ON public.conversations;
DROP POLICY IF EXISTS "Users can update conversations they are part of" ON public.conversations;
DROP POLICY IF EXISTS "Users can view their own messages." ON public.messages;
DROP POLICY IF EXISTS "Users can insert their own messages." ON public.messages;

-- Drop the columns
ALTER TABLE public.conversations DROP COLUMN participant1_id CASCADE;
ALTER TABLE public.conversations DROP COLUMN participant2_id CASCADE;

-- 4. Set up new RLS policies for conversation_participants
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants of their conversations"
  ON public.conversation_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp 
      WHERE cp.conversation_id = conversation_participants.conversation_id 
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join or add to conversations"
  ON public.conversation_participants FOR INSERT
  WITH CHECK ( true ); -- We could tighten this later based on app logic

-- 5. New RLS policies for conversations
CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  USING ( 
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp 
      WHERE cp.conversation_id = conversations.id 
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK ( true ); 

-- 6. New RLS policies for messages
CREATE POLICY "Users can view their own messages."
  ON public.messages FOR SELECT
  USING ( 
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp 
      WHERE cp.conversation_id = messages.conversation_id 
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages into their conversations."
  ON public.messages FOR INSERT
  WITH CHECK ( 
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp 
      WHERE cp.conversation_id = messages.conversation_id 
      AND cp.user_id = auth.uid()
    )
  );

-- 7. Add Realtime for new table
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
  EXCEPTION WHEN duplicate_object THEN
  END;
END $$;
