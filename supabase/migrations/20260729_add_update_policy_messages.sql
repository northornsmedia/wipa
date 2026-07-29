CREATE POLICY "Users can update their messages."
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp 
      WHERE cp.conversation_id = messages.conversation_id 
      AND cp.user_id = auth.uid()
    )
  );
