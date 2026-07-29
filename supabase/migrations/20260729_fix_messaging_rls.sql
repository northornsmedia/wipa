-- Fix infinite recursion in RLS policies for messaging
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;

CREATE POLICY "Users can view participants of their conversations"
  ON public.conversation_participants FOR SELECT
  USING ( true );

-- Fix 403 Forbidden when creating a new conversation (because select() runs before participants are inserted)
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;

CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  USING ( 
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp 
      WHERE cp.conversation_id = conversations.id 
      AND cp.user_id = auth.uid()
    )
    OR NOT EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversations.id
    )
  );
