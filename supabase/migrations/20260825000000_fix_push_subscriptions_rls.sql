-- Migration: Fix push_subscriptions RLS by adding missing UPDATE policy
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'push_subscriptions' 
        AND policyname = 'Users can update their own push subscriptions'
    ) THEN
        CREATE POLICY "Users can update their own push subscriptions" 
        ON public.push_subscriptions FOR UPDATE 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
