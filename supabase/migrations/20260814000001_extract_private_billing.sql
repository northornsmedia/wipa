CREATE TABLE public.private_billing (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  stripe_customer_id TEXT
);

ALTER TABLE public.private_billing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own billing data"
  ON public.private_billing FOR SELECT
  USING ( auth.uid() = user_id );

ALTER TABLE public.profiles DROP COLUMN stripe_customer_id;
