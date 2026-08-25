-- ==============================================================================
-- Schema: push_subscriptions
-- Description: Stores Web Push notification tokens for Android and iOS PWA clients
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    device_type TEXT DEFAULT 'unknown',
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_endpoint UNIQUE (user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON public.push_subscriptions (endpoint);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'push_subscriptions' AND policyname = 'Users can view their own push subscriptions'
    ) THEN
        CREATE POLICY "Users can view their own push subscriptions" 
        ON public.push_subscriptions FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'push_subscriptions' AND policyname = 'Users can insert their own push subscriptions'
    ) THEN
        CREATE POLICY "Users can insert their own push subscriptions" 
        ON public.push_subscriptions FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'push_subscriptions' AND policyname = 'Users can update their own push subscriptions'
    ) THEN
        CREATE POLICY "Users can update their own push subscriptions" 
        ON public.push_subscriptions FOR UPDATE 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'push_subscriptions' AND policyname = 'Users can delete their own push subscriptions'
    ) THEN
        CREATE POLICY "Users can delete their own push subscriptions" 
        ON public.push_subscriptions FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END $$;
