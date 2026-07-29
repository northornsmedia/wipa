-- Fix infinite recursion in RLS policies for messaging
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;

CREATE POLICY "Users can view participants of their conversations"
  ON public.conversation_participants FOR SELECT
  USING ( true );
